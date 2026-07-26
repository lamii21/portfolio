/**
 * Site configuration — single source of truth for all metadata,
 * navigation, and personal information.
 *
 * Update this file to change any personal details across the entire portfolio.
 */

export const siteConfig = {
  name: "Lamiae El Jabri",
  role: "Software Engineer",
  headline: "I build from both ends.",
  subHeadline: "The seams are where software breaks.",
  description:
    "Software Engineering student at EMSI (Class of 2027), building full-stack web applications with React, Next.js, Django, and Python. Open to Software Engineer, Full-Stack, and Backend roles. Based in Rabat, Morocco.",
  location: "Rabat, Morocco",
  school: "EMSI — École Marocaine des Sciences de l'Ingénieur",
  program: "Génie Informatique",
  yearOfGraduation: "2027",
  availableFrom: "2027",

  // ── URLs ────────────────────────────────────────────────────────────────────
  /** Update with deployed URL */
  url: "https://lamiaeeljabri.dev",
  ogImage: "/og-image.jpg",
  resumePath: "/resume.pdf",

  // ── Contact ─────────────────────────────────────────────────────────────────
  email: "lamiaeeljabri00@gmail.com",

  // ── Social ──────────────────────────────────────────────────────────────────
  links: {
    github: "https://github.com/lamii21",
    linkedin: "https://www.linkedin.com/in/lamiae-eljabri-42b092254/",
  },

  // ── SEO ─────────────────────────────────────────────────────────────────────
  keywords: [
    "Software Engineer",
    "Full Stack Developer",
    "Full Stack Engineer",
    "Backend Developer",
    "React Developer",
    "Next.js Developer",
    "Python Developer",
    "Django Developer",
    "TypeScript Developer",
    "Web Developer",
    "Junior Software Engineer",
    "Morocco",
    "Rabat",
    "EMSI",
    "Génie Informatique",
  ],
} as const;

// ── Navigation ───────────────────────────────────────────────────────────────

export const navItems = [
  { label: "Work",     href: "#work"     },
  { label: "About",    href: "#story"    },
  { label: "Approach", href: "#approach" },
  { label: "Contact",  href: "#contact"  },
] as const;
