/**
 * Personal-mode content: "Ananta's Persona", a Persona 3 Reload–inspired
 * side of the site. Same privacy rules as professional.js: no school, city,
 * age, grades, phone or address, and ananta.dev@proton.me is the only email.
 *
 * Game-flavoured terms (Social Stats, Social Links, Arcana, Requests) are
 * playful framing. The facts underneath are real.
 */

const gh = (repo) => `https://github.com/dev-ananta/${repo}`;

export default {
  nameTag: ['ananta’s', 'persona'],

  /* Main menu, in the order of the original P3Menu.jsx */
  menu: [
    { label: 'ABOUT ME', href: '/personal/about', hint: 'Status, social stats, interests' },
    { label: 'RESUME', href: '/personal/resume', hint: 'Records and Social Links' },
    { label: 'GITHUB LINK', href: 'https://github.com/dev-ananta', hint: 'github.com/dev-ananta', external: true },
    { label: 'SOCIALS', href: '/personal/socials', hint: 'Your party: GitHub, LinkedIn, email' },
    { label: 'SIDE PROJECTS', href: '/personal/projects', hint: 'Requests, completed and in progress' },
  ],

  /* Status screen (About me) */
  status: {
    name: 'Ananta',
    title: 'Student Software Engineer',
    arcana: 'The Fool', // P3R's protagonist arcana: the start of every journey
    motto: 'Explore. Engage. Educate. Evolve.',
    bio: 'I’m a high school sophomore who builds software, robots and the occasional game. Outside of code I read manhwa, manga and manhua, watch anime, design graphics and write poems.',
    // Social Stats use P3R's rank names. Max rank is 6.
    stats: [
      { stat: 'Academics', label: 'Engineering', rank: 5, rankName: 'Intelligent', note: 'Full-stack, iOS, Python and robot code' },
      { stat: 'Charm', label: 'Leadership', rank: 4, rankName: 'Smooth', note: 'Team finance, sponsors and a nonprofit' },
      { stat: 'Courage', label: 'Shipping', rank: 5, rankName: 'Fearless', note: 'Real users, real money, tested code' },
    ],
    interests: ['Game development', 'Graphic design', 'Poetry', 'Anime', 'Manhwa · Manga · Manhua', 'Robotics', 'Investing'],
    languages: ['English', 'Gujarati', 'Hindi', 'Spanish'],
    goals: [
      'Become a full-stack developer',
      'Build user-focused tools, including AI apps for everyday life',
      'Lead my FIRST teams to state level or beyond',
      'Compete in the American Rocketry Challenge',
    ],
  },

  /* Resume as P3R-style cards. Ranks follow the original ResumePage.jsx. */
  resume: [
    {
      id: 'education', badge: 'I', title: 'EDUCATION', subtitle: 'School / Programs', rank: 3,
      rows: [
        { title: 'High school sophomore', status: '2025 – 2029' },
        { title: 'Self-studying AP Computer Science A (Java)', status: 'MAY 2027' },
        { title: 'Mobile Apps Development (Swift & Xcode)', status: 'COURSE' },
        { title: 'IncubatorEDU: student startup program', status: 'COFOUNDER' },
      ],
    },
    {
      id: 'skills', badge: 'II', title: 'SKILLS', subtitle: 'Stack / Tools', rank: 4,
      rows: [
        { title: 'JavaScript / TypeScript · Python · Swift', status: 'CORE' },
        { title: 'Java · SQL · Lua/Luau · HTML/CSS', status: 'USE' },
        { title: 'FastAPI · React · SwiftUI · Supabase/Postgres', status: 'BUILD' },
        { title: 'pytest · GitHub Actions · Docker · Vercel · Stripe', status: 'SHIP' },
      ],
    },
    {
      id: 'projects', badge: 'III', title: 'PROJECTS', subtitle: 'Founders / Products', rank: 5,
      rows: [
        { title: 'Sponsorship CRM: 37 tests, atomic sends', status: 'LIVE', href: gh('sponsorship-crm') },
        { title: 'Avenor iOS: Congressional App Challenge', status: '2026', href: gh('swift-avenor') },
        { title: 'TuNet: Stripe Checkout + Supabase', status: 'SHIPPED', href: gh('tunet') },
        { title: 'Conference data pipeline: 22 tests', status: 'DATA', href: gh('teacher-conference') },
      ],
    },
    {
      id: 'experience', badge: 'IV', title: 'EXPERIENCE', subtitle: 'Teams / Roles', rank: 2,
      rows: [
        { title: 'FRC Team 8029: Software', status: '2026 –' },
        { title: 'FTC Team 6198: Finance, Sponsorship, Code', status: '2025 –' },
        { title: 'The Hack Foundation: Student Developer', status: '2026 –' },
        { title: 'TuNet: Web Developer', status: '2026' },
      ],
    },
  ],

  /* Social Links: the groups I'm part of, each with a tarot Arcana and my
     own read of how deep the bond is (rank 1–10). */
  socialLinks: [
    { arcana: 'Chariot', numeral: 'VII', name: 'FTC Team 6198', role: 'Finance & sponsorship lead, assistant coder', rank: 7, note: '2nd at a league meet, 5th at the league tournament, Illinois Championship qualifier' },
    { arcana: 'Emperor', numeral: 'IV', name: 'GCCSE', role: 'Founder, student nonprofit (fiscally sponsored by Hack Club)', rank: 6, note: 'Sponsors FTC 6198 and shares resources for young engineers' },
    { arcana: 'Magician', numeral: 'I', name: 'Hack Club', role: 'Volunteer student developer', rank: 5, note: 'Building a central library of engineering guides' },
    { arcana: 'Strength', numeral: 'VIII', name: 'FRC Team 8029', role: 'Software team member', rank: 3, note: 'Robot code, plus the team’s sponsor-focused website' },
    { arcana: 'Fortune', numeral: 'X', name: 'DECA', role: 'Competitor, personal finance events', rank: 3, note: 'Principles of Business Management, then Personal Finance' },
    { arcana: 'Hermit', numeral: 'IX', name: 'Investment & Econ Club', role: 'Board member', rank: 4, note: 'Wharton Investment Competition. Recovered the club’s accounts' },
  ],

  /* Side projects as Elizabeth-style requests */
  requests: [
    { no: '001', title: 'Naga Discord Bot', client: 'Discord communities', reward: 'JavaScript', status: 'complete', href: gh('Naga-Discord-Bot'), note: 'Self-hosted cultivation bot with ranks, XP and moderation tools.' },
    { no: '002', title: 'Atlas Game Engine', client: 'Myself', reward: 'JavaScript', status: 'in-progress', href: gh('atlas-game-engine'), note: 'A small game engine to learn how engines work.' },
    { no: '003', title: 'FPS2', client: 'Friends', reward: 'HTML · JS', status: 'complete', href: gh('FPS2'), note: 'Lightweight multiplayer FPS in plain, native JavaScript.' },
    { no: '004', title: 'Coffer', client: 'Digital minimalists', reward: 'JavaScript', status: 'complete', href: gh('coffer'), note: 'A no-nonsense password vault.' },
    { no: '005', title: 'Local Cam Menu Bar', client: 'My desk setup', reward: 'Swift · Kotlin', status: 'complete', href: gh('local-cam-menu-bar'), note: 'Use a phone or laptop webcam as an external display’s camera.' },
    { no: '006', title: 'Yggdrasil', client: 'Future me', reward: 'Swift', status: 'in-progress', href: gh('Yggdrasil---Fitness-Application'), note: 'iOS fitness app, rebuilt from scratch.' },
    { no: '007', title: 'Mines', client: 'Swift practice', reward: 'Swift', status: 'complete', href: gh('Mines'), note: 'Dig for diamonds, avoid the coal.' },
    { no: '008', title: 'Dullahan Mod', client: 'Minecraft', reward: 'Java', status: 'complete', href: gh('minecraft-dullahan'), note: 'A modded mob for Minecraft.' },
    { no: '009', title: 'Privacy Screen', client: 'Shared spaces', reward: 'TypeScript', status: 'in-progress', href: gh('privacy-screen'), note: 'A privacy-display effect for phones and laptops.' },
    { no: '010', title: 'Mini Server Rack', client: 'My shelf', reward: 'CAD', status: 'complete', href: gh('mini-server-rack'), note: 'A desktop figurine of a server rack.' },
  ],

  /* Party (socials). Leader is me. No follower counts are invented. */
  party: [
    { role: 'LEADER', label: 'GITHUB', handle: '@dev-ananta', href: 'https://github.com/dev-ananta', stat: ['REPOS', '65'], stat2: ['STARS', '58'] },
    { role: 'PARTY', label: 'LINKEDIN', handle: 'in/dev-ananta', href: 'https://www.linkedin.com/in/dev-ananta', stat: ['FOCUS', 'SWE'], stat2: ['TEAMS', '2'] },
    { role: 'PARTY', label: 'EMAIL', handle: 'ananta.dev@proton.me', href: 'mailto:ananta.dev@proton.me', stat: ['VIA', 'PROTON'], stat2: ['FOR', 'WORK'] },
  ],

  credit: 'Fan-made tribute inspired by Persona 3 Reload. Not affiliated with or endorsed by ATLUS or SEGA. Persona 3 Reload footage © ATLUS © SEGA.',
};
