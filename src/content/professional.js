/**
 * Professional-mode content (Anant Parikh). Pure data, no markup.
 *
 * Sources: Stripe-tailored resume, cover letter, LinkedIn profile, merit
 * sheet and github.com/dev-ananta (Nov 2026).
 *
 * Privacy rules (the owner is a minor). Keep these when editing:
 *  - Only email: ananta.dev@proton.me. No phone, address or personal/school emails.
 *  - No school name, city, GPA or transcript details. Team numbers and orgs are public.
 */

const gh = (repo) => `github.com/dev-ananta/${repo}`;

const projects = [
  { year: '26', name: 'Sponsorship CRM', url: gh('sponsorship-crm'), category: 'Fullstack', image: '/images/projects/sponsorship-crm.svg', featured: true },
  { year: '26', name: 'Avenor (iOS)', url: gh('swift-avenor'), category: 'Mobile', image: '/images/projects/avenor.svg', featured: true },
  { year: '26', name: 'TuNet', url: gh('tunet'), category: 'Payments', image: '/images/projects/tunet.svg', featured: true },
  { year: '26', name: 'Conference Pipeline', url: gh('teacher-conference'), category: 'Data', image: '/images/projects/teacher-conference.svg', featured: true },
  { year: '26', name: 'FRC 8029 Website', url: gh('steel-bronco-robotics-website'), category: 'Web', image: '/images/projects/frc-8029.svg' },
  { year: '26', name: 'iCollab', url: gh('iCollab'), category: 'macOS', image: '/images/projects/icollab.svg', featured: true },
  { year: '26', name: 'Sentiment Shield', url: gh('sentiment-shield-extension'), category: 'Extension', image: '/images/projects/sentiment-shield.svg' },
  { year: '26', name: 'Atlas Engine', url: gh('atlas-game-engine'), category: 'Game engine', image: '/images/projects/atlas.svg' },
  { year: '26', name: 'Coffer', url: gh('coffer'), category: 'Security', image: '/images/projects/coffer.svg' },
];

export default {
  home: {
    intro: 'A high school sophomore who ships full-stack software for real users: payment flows, a tested sponsorship CRM and robot code.',
    statement: 'I focus on correctness where money and people are involved: server-side pricing, duplicate-send protection, and a human approval step before anything goes out.',
    photo: { src: '/images/portrait.jpg', alt: 'Illustration of Anant at his desk at sunset, headphones on, code on the laptop and mountains outside the window' },
    work: {
      lead: 'My projects start as real problems for my teams, then get tested until I’d trust them with money and people.',
      cta: { label: 'View all projects', href: '/projects' },
    },
  },

  about: {
    headline: 'I wasn’t born with talent. I get better by building things and fixing what breaks.',
    statements: [
      { text: 'I lead finance and sponsorship for my FTC team and write robot code for my FRC team.', align: 'left' },
      { text: 'I founded a student nonprofit for computer science and engineering, fiscally sponsored by Hack Club.', align: 'right' },
      { type: 'experience' },
      { text: 'Code that touches money has to be right, not just running.', align: 'left' },
      { text: 'I use AI coding tools, and I review every line I merge. If I ship it, I can explain it.', align: 'right' },
      { text: 'Explore. Engage. Educate. Evolve.', align: 'left' },
    ],
    experience: [
      { year: '26', role: 'Software Team Member', org: 'FIRST Robotics Competition Team 8029', url: '', period: 'Sep 2026 – Present' },
      { year: '', role: 'Founder', org: 'Golden Corridor of CS & Engineering (nonprofit)', url: '', period: 'Feb 2026 – Present' },
      { year: '', role: 'Volunteer Student Developer', org: 'The Hack Foundation (Hack Club)', url: 'hackclub.com', period: 'Mar 2026 – Present' },
      { year: '', role: 'Web Developer', org: 'TuNet, a local tutoring service', url: gh('tunet'), period: 'Feb 2026 – May 2026' },
      { year: '25', role: 'Finance & Sponsorship Lead, Assistant Coder', org: 'FIRST Tech Challenge Team 6198', url: '', period: 'Aug 2025 – Present' },
      { year: '', role: 'Board Member', org: 'Investment & Econ Club', url: '', period: 'Nov 2025 – Present' },
    ],
  },

  projects: {
    headline: 'The things I build start as problems my teams actually have, then grow into full projects.',
    items: projects,
  },

  contact: {
    headline: 'Tell me what you’re building, and let’s figure out the rest together.',
    fields: {
      name: { label: 'Name', placeholder: 'Your name' },
      email: { label: 'Email address', placeholder: 'you@example.com' },
      message: { label: 'What are you working on?', placeholder: 'I’m working on…' },
    },
    submit: 'Send message',
  },

  socials: [
    { label: 'GitHub', href: 'https://github.com/dev-ananta' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dev-ananta' },
  ],
};
