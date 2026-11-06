/**
 * POST /api/contact (Vercel Serverless Function, Node runtime, no dependencies)
 *
 * Accepts JSON (from the enhanced form) or form-encoded data (no-JS fallback).
 * Steps: honeypot → validation → optional Cloudflare Turnstile → email via Resend.
 *
 * Environment variables (Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY        required to actually send email
 *   CONTACT_TO_EMAIL      your inbox
 *   CONTACT_FROM_EMAIL    verified sender, e.g. "Portfolio <hello@yourdomain.com>"
 *   TURNSTILE_SECRET_KEY  optional; enables server-side bot verification
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return Object.fromEntries(new URLSearchParams(req.body)); }
  }
  return {};
}

export default async function handler(req, res) {
  const wantsJson = String(req.headers.accept || '').includes('application/json');
  const reply = (status, ok, error) => {
    if (wantsJson) return res.status(status).json(ok ? { ok: true } : { ok: false, error });
    // No-JS fallback: back to the form, where CSS :target shows the message.
    res.setHeader('Location', ok ? '/contact#sent' : '/contact#error');
    return res.status(303).end();
  };

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(405, false, 'Method not allowed');
  }

  const body = await readBody(req);

  // Honeypot: pretend success so bots don't retry.
  if (clean(body.company, 200)) return reply(200, true);

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);
  if (!name || !EMAIL_RE.test(email) || message.length < 2) {
    return reply(400, false, 'Please provide your name, a valid email and a message');
  }

  // Optional bot protection
  if (process.env.TURNSTILE_SECRET_KEY) {
    const token = clean(body['cf-turnstile-response'], 4096);
    const form = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token });
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    if (ip) form.set('remoteip', ip);
    try {
      const v = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
      const result = await v.json();
      if (!result.success) return reply(403, false, 'Verification failed, please try again');
    } catch {
      return reply(502, false, 'Verification service unavailable');
    }
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.warn('[contact] Not configured: set RESEND_API_KEY and CONTACT_TO_EMAIL.');
    return reply(503, false, 'The contact form isn’t set up yet');
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });
    if (!r.ok) {
      console.error('[contact] Resend error', r.status, await r.text());
      return reply(502, false, 'Could not send right now');
    }
    return reply(200, true);
  } catch (err) {
    console.error('[contact] Send failed', err);
    return reply(502, false, 'Could not send right now');
  }
}
