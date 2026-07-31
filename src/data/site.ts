/**
 * Site configuration — single source of truth for all metadata,
 * navigation, and personal information.
 *
 * Update this file to change any personal details across the entire portfolio.
 */

export const siteConfig = {
  name: "Lamiae El Jabri",
  role: "AI Software Engineer",
  headline: "I build from both ends.",
  subHeadline: "The seams are where software breaks.",
  description:
    "Software Engineering student at EMSI (Class of 2027), building AI-integrated products with React, Next.js, Django, Python, OpenCV, and SymPy. Five of ten shipped projects have a direct AI/ML component. Open to AI Software Engineer, Full-Stack, and Software Engineer roles. Based in Rabat, Morocco.",
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
    "AI Software Engineer",
    "AI Engineer",
    "Software Engineer",
    "Full Stack Engineer",
    "Full Stack Developer",
    "Backend Developer",
    "React Developer",
    "Next.js Developer",
    "Python Developer",
    "Django Developer",
    "TypeScript Developer",
    "Machine Learning Engineer",
    "Computer Vision",
    "NLP Engineer",
    "OpenCV",
    "SymPy",
    "Junior AI Engineer",
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
