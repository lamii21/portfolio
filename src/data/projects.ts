/**
 * Project data — structured around the portfolio's thesis:
 * "The seams are where software breaks. I build the whole thing."
 *
 * Each project answers three questions:
 *  system   — What was the system? (technical, precise)
 *  seam     — Where was the handoff boundary that she crossed?
 *  outcome  — What specifically resulted?
 *
 * ⚠️  Update `repo` with individual repository URLs before publishing.
 * ⚠️  Add `demo` URLs when live deployments are available.
 * ⚠️  Verify `metrics` with real numbers from your experience.
 */

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  /** Mark true for the one project that receives full cinematic treatment */
  featured: boolean;
  system: string;
  seam: string;
  outcome: string;
  /** One sentence on what broke, what she learned — honesty signal */
  honest?: string;
  tech: string[];
  repo: string | null;
  demo: string | null;
  metrics?: string;
  /** What was wrong / what needed solving before this was built */
  problem?: string;
  /** What was built and the reasoning behind it */
  solution?: string;
  /** One sentence on the key architectural decision */
  architecture?: string;
}

export const projects: Project[] = [
  {
    id: "handymath",
    title: "HandyMath",
    category: "Education · Full-Stack",
    year: "2023",
    featured: true, // ← Hero case study. Change to false to feature a different project.
    system:
      "A full-stack educational platform built to make mathematics approachable for students who were convinced they couldn't do it.",
    seam:
      "I designed the data model, built the Django REST API, and built the React interface — the same mind made every layer, so the schema directly shaped the interaction patterns. No handoff friction.",
    outcome:
      "Solo build from concept to deployment in four months. Django backend, React frontend, PostgreSQL. Complete MVC architecture with authentication.",
    honest:
      "The first database schema didn't account for user progress state across sessions. I rebuilt it in week three. The second version was significantly cleaner.",
    tech: ["Django", "React", "PostgreSQL", "Python", "REST API"],
    repo: "https://github.com/lamii21", // ⚠️ Replace with actual repo URL
    demo: null,
    metrics: "Solo build · 4 months · Full deployment",
    problem: "Students were disengaging from math instruction — the platform needed to track individual progress, surface exercises at the right difficulty level, and feel less like homework.",
    solution: "Designed the data model first: a relational schema where progress state is native to the structure, not bolted on afterward. Then built the API and interface to match the schema — never the reverse.",
    architecture: "Django ORM → PostgreSQL (progress schema) → REST API → React context state; the schema shaped every UI interaction pattern from the start.",
  },
  {
    id: "darlbanat",
    title: "Darlbanat",
    category: "Restaurant System · Backend",
    year: "2024",
    featured: false,
    system:
      "A web application to manage daily restaurant operations — orders, inventory, and reporting — for a real client.",
    seam:
      "The relational data model determined the interface. I built both simultaneously, which meant the UI never asked the database for something it wasn't designed to give.",
    outcome:
      "Replaced a manual paper-based process. Order tracking and inventory management in one system. ASP.NET Core API with a structured SQL schema.",
    tech: ["C#", "ASP.NET Core", "SQL Server", "Entity Framework"],
    repo: "https://github.com/lamii21", // ⚠️ Replace with actual repo URL
    demo: null,
    metrics: "Real client · Live deployment",
    problem: "A paper-based system for tracking orders and inventory meant errors, lost tickets, and zero visibility into daily revenue or stock levels.",
    solution: "A web application where every order is a database row — inventory depletes on sale, reports query live data, nothing is transcribed manually.",
    architecture: "Entity Framework Core → SQL Server → ASP.NET Core Web API; the relational model drives UI logic, not the other way around.",
  },
  {
    id: "flowforge-etl",
    title: "FlowForge ETL",
    category: "Data Engineering · Automation",
    year: "2023",
    featured: false,
    system:
      "An automated data pipeline that ingests raw industrial data, cleans and transforms it, and surfaces it through a FastAPI endpoint.",
    seam:
      "Built the ingestion logic, the transformation layer, and the API that consumed the output — then validated each layer against the previous one. The pipeline is meaningless without the consumer.",
    outcome:
      "Processes structured industrial datasets without manual intervention. The FastAPI layer makes the output queryable by any downstream tool.",
    tech: ["Python", "Pandas", "FastAPI", "SQLAlchemy"],
    repo: "https://github.com/lamii21", // ⚠️ Replace with actual repo URL
    demo: null,
    metrics: "Automated pipeline · Zero manual steps",
    problem: "Industrial datasets arrived as raw files requiring hours of manual cleaning before any analysis tool could read them reliably.",
    solution: "An automated pipeline that ingests, cleans, transforms, and exposes data via a FastAPI endpoint — any downstream tool connects once and always receives clean data.",
    architecture: "Python Pandas (transform) → SQLAlchemy (persistence) → FastAPI (consumption); each layer validated against the previous one before build.",
  },
  {
    id: "nacim2",
    title: "Nacim²",
    category: "Real Estate · Web Application",
    year: "2024",
    featured: false,
    system:
      "A property listing platform for a family real-estate business, built to help clients find land for building homes.",
    seam:
      "Designed the data structure and the search/filtering interface together, so the UX never outpaced what the backend could actually query efficiently.",
    outcome:
      "Replaced static listings with a dynamic, searchable platform. Built on Next.js with server-side rendering for performance.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma"],
    repo: "https://github.com/lamii21", // ⚠️ Replace with actual repo URL
    demo: null,
    problem: "A family real-estate business was showing properties through static HTML listings — no search, no filtering, no way to compare land parcels.",
    solution: "A dynamic Next.js platform with server-side rendering and client-side filtering; the data model and search UI were designed at the same time.",
    architecture: "Next.js SSR → Prisma ORM → PostgreSQL; server renders listings for initial load, client manages filter state without extra API calls.",
  },
  {
    id: "yazaki",
    title: "Yazaki Internship",
    category: "Industrial Automation · Python",
    year: "2024",
    featured: false,
    system:
      "A Python automation system built during my internship at Yazaki to process Bill of Materials (BOM) data from industrial manufacturing files.",
    seam:
      "The BOM files were Excel-based. I had to understand the manufacturing logic before I could write a script that processed it correctly — domain knowledge first, automation second.",
    outcome:
      "Reduced weekly BOM processing from approximately 8 hours of manual work to under 4 minutes of automated processing.",
    honest:
      "The first version broke on edge cases in the Excel formatting that I hadn't accounted for. The second version was more defensive and significantly more reliable.",
    tech: ["Python", "openpyxl", "pandas", "Power BI"],
    repo: "https://github.com/lamii21", // ⚠️ Replace with actual repo URL
    demo: null,
    metrics: "8 hours → 4 minutes per week",
    problem: "BOM files from manufacturing systems arrived as complex, inconsistently-formatted Excel exports — ~8 hours of manual processing per week, prone to transcription errors.",
    solution: "A Python script that understands the manufacturing domain logic embedded in the file structure. Domain knowledge first, automation second.",
    architecture: "openpyxl (parsing) → pandas (transform logic) → Power BI output; defensive parsing built to handle every edge-case formatting variant encountered.",
  },
  {
    id: "fintech-predict",
    title: "FinTech Predict",
    category: "Machine Learning · Finance",
    year: "2024",
    featured: false,
    system:
      "A financial forecasting model trained on historical market data, exploring what makes prediction models trustworthy enough to inform decisions.",
    seam:
      "The model output is only useful if you understand the preprocessing that produced it. I built the data pipeline and the model together, then had to explain both to understand the results.",
    outcome:
      "LSTM-based forecasting model with a Python data pipeline. The focus was on understanding prediction boundaries, not on achieving arbitrary accuracy targets.",
    tech: ["Python", "TensorFlow/Keras", "Pandas", "Scikit-learn", "Matplotlib"],
    repo: "https://github.com/lamii21", // ⚠️ Replace with actual repo URL
    demo: null,
    problem: "A forecasting model without a transparent data pipeline produces outputs that can't be verified — the model and its inputs are equally important to understand.",
    solution: "An LSTM model paired with a clean, inspectable preprocessing pipeline. The focus was on understanding prediction boundaries, not chasing arbitrary accuracy targets.",
    architecture: "Pandas (preprocessing) → Keras LSTM → Matplotlib; pipeline clarity prioritized so every model input and output stays explainable.",
  },
];

/** Returns the project marked as featured. Falls back to first project. */
export const featuredProject = projects.find((p) => p.featured) ?? projects[0];

/** Returns all projects except the featured one. */
export const catalogProjects = projects.filter((p) => !p.featured);
