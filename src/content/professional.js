/**
 * Professional-mode content. Pure data, no markup.
 * Everything marked TODO is a placeholder. Swap in your own words and work.
 */

const projects = [
  // year groups the table rows; `image` is used by the Projects grid
  { year: '26', name: 'Project One', url: 'project-one.vercel.app', category: 'Fullstack', image: '/images/project-1.svg', featured: true },
  { year: '26', name: 'Project Two', url: 'project-two.vercel.app', category: 'Design', image: '/images/project-2.svg', featured: true },
  { year: '26', name: 'Project Three', url: 'project-three.vercel.app', category: 'Realtime', image: '/images/project-3.svg', featured: true },
  { year: '26', name: 'Project Four', url: 'project-four.vercel.app', category: 'Utility', image: '/images/project-4.svg' },
  { year: '25', name: 'Project Five', url: 'project-five.vercel.app', category: 'Social', image: '/images/project-5.svg', featured: true },
  { year: '25', name: 'Project Six', url: 'github.com', category: 'Hardware', image: '/images/project-6.svg' },
];

export default {
  home: {
    intro: 'A curious, detail-driven developer working across web development, interface design and creative coding.', // TODO
    statement: 'I build fast, accessible web applications where careful engineering meets clear, considered design.', // TODO
    photo: { src: '/images/portrait.svg', alt: 'Placeholder for a portrait of Anant at work' }, // TODO: add your photo
    work: {
      lead: 'Every project starts as a question. It gets shaped through iteration until it feels obvious.', // TODO
      cta: { label: 'View all projects', href: '/projects' },
    },
  },

  about: {
    headline: 'I build things because making them is how I make sense of them.', // TODO
    statements: [
      // `align` alternates left/right like the reference
      { text: 'Most of what I know, I learned by building something and breaking it.', align: 'left' },
      { text: 'I like making things of every kind: websites, tools, interfaces, small experiments.', align: 'right' },
      { type: 'experience' },
      { text: 'I love watching an idea go from nothing to something people actually use.', align: 'left' },
      { text: 'I get to work on real projects with people whose work I care about.', align: 'right' },
      { text: 'Creating is the most fun I know of. There’s always one more thing to try.', align: 'left' },
    ],
    experience: [
      // TODO: real roles, most recent first
      { year: '26', role: 'Software Developer', org: 'Company Name', url: 'company.com', period: 'Jan 2026 – Present' },
      { year: '', role: 'Frontend Engineer, Intern', org: 'Studio Name', url: 'studio.com', period: 'May 2025 – Dec 2025' },
      { year: '25', role: 'Founder', org: 'Side Project', url: 'side-project.vercel.app', period: 'Jan 2025 – Apr 2025' },
    ],
  },

  projects: {
    headline: 'The things I build start as problems I want solved, then grow into full projects.', // TODO
    items: projects,
  },

  contact: {
    headline: 'Tell me what you’re building, and let’s figure out the rest together.',
    fields: {
      name: { label: 'Full name', placeholder: 'Your name' },
      email: { label: 'Email address', placeholder: 'you@example.com' },
      message: { label: 'What are you working on?', placeholder: 'I’m working on…' },
    },
    submit: 'Send message',
  },

  socials: [
    // TODO: real profiles. The first footer column also shows the email.
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
};
