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
      "A full-stack math education platform — React frontend, Django REST API, PostgreSQL. Designed the schema, built the API, and wrote the interface. Same engineer, every layer, four months to deployment.",
    seam:
      "I designed the data model, built the Django REST API, and built the React interface — the same mind made every layer, so the schema directly shaped the interaction patterns. No handoff friction.",
    outcome:
      "Solo build from concept to deployment in four months. Django backend, React frontend, PostgreSQL. Complete MVC architecture with authentication.",
    honest:
      "The first schema had no native place for session-based progress state. Real users revealed it the moment they tried to resume their work. I rebuilt the data model in week three — the second version was significantly cleaner, and the rebuild took two days.",
    tech: ["Django", "React", "PostgreSQL", "Python", "REST API"],
    repo: "https://github.com/lamii21", // ⚠️ Replace with actual repo URL
    demo: null,
    metrics: "Solo build · 4 months · Full deployment",
    problem: "Students were disengaging because the system had no memory — no way to track where they left off, what difficulty matched their current state, or what they'd already mastered. The interface couldn't ask for what the database didn't model.",
    solution: "Designed the relational schema before writing any application code. Progress state, difficulty tracking, and session continuity are native to the data model — not added after the fact. The interface was built to express what the schema could give it.",
    architecture: "Django ORM → PostgreSQL (progress schema) → REST API → React context state; the schema shaped every UI interaction pattern from the start.",
  },
  {
    id: "darlbanat",
    title: "Darlbanat",
    category: "Restaurant System · Backend",
    year: "2024",
    featured: false,
    system:
      "Built for a real client to replace a paper-based order system. Every transaction becomes a database row — inventory updates in real-time, reports query live data, nothing gets transcribed twice.",
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
      "Ingest, transform, expose. Raw industrial data files go in; clean, queryable output comes out of a FastAPI endpoint. No manual steps in between.",
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
      "A searchable property listing platform for a real family real-estate business. Server-rendered listings with client-side filtering — replaced static HTML pages that couldn't be searched.",
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
      "Built during my internship at Yazaki — a global automotive manufacturer. A Python script that cut the weekly BOM processing cycle from 8 hours of manual Excel work to under 4 minutes.",
    seam:
      "The BOM files were Excel-based. I had to understand the manufacturing logic before I could write a script that processed it correctly — domain knowledge first, automation second.",
    outcome:
      "Reduced weekly BOM processing from approximately 8 hours of manual work to under 4 minutes of automated processing.",
    honest:
      "Version one broke on Excel formatting variants I hadn't seen in the test files. Defensive parsing is harder than happy-path parsing. Version two handled every production format variant without exception.",
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
      "An LSTM forecasting model with a transparent preprocessing pipeline. The goal wasn't arbitrary accuracy — it was understanding the prediction boundaries well enough to trust the outputs.",
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
