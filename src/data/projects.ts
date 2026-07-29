/**
 * Project data — structured around the portfolio's thesis:
 * "The seams are where software breaks. I build the whole thing."
 *
 * ⚠️  Update `repo` with individual repository URLs before publishing.
 * ⚠️  Add `demo` URLs when live deployments are available.
 * ⚠️  Verify `metrics` with real numbers from your experience.
 */

// ── Case Study types ──────────────────────────────────────────────────────────

export interface CaseStudyTechChoice {
  name: string;
  reason: string;
}

export interface CaseStudyTimeline {
  milestone: string;
  duration: string;
  description: string;
}

export interface CaseStudyChallenge {
  title: string;
  body: string;
  solution: string;
}

export interface CaseStudyImpact {
  metric: string;
  description: string;
}

export interface CaseStudyLearning {
  title: string;
  body: string;
}

export interface CaseStudy {
  context: string;
  objectives: string[];
  techChoices: CaseStudyTechChoice[];
  timeline: CaseStudyTimeline[];
  challenges: CaseStudyChallenge[];
  impact: CaseStudyImpact[];
  learned: CaseStudyLearning[];
}

// ── Project interface ─────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  featured: boolean;
  system: string;
  seam: string;
  outcome: string;
  honest?: string;
  tech: string[];
  repo: string | null;
  demo: string | null;
  metrics?: string;
  problem?: string;
  solution?: string;
  architecture?: string;
  caseStudy?: CaseStudy;
}

// ── Projects ──────────────────────────────────────────────────────────────────

export const projects: Project[] = [

  // ── 1. HandyMath ────────────────────────────────────────────────────────────
  {
    id: "handymath",
    title: "HandyMath",
    category: "Education · AI · Full-Stack",
    year: "2023",
    featured: true,
    system:
      "A full-stack math education platform with computer vision OCR, automatic equation solving (SymPy), Three.js 3D visualization, and a Django REST backend. The student photographs a problem — the system reads it, solves it, and explains it.",
    seam:
      "I designed the schema, built the API, wired the OCR and SymPy solver, and built the React + Three.js interface. The same engineer understood every layer — so the camera input, the math engine, and the 3D visualization never contradicted each other.",
    outcome:
      "Solo build: OCR pipeline → SymPy solver → Django REST API → React interface with Three.js 3D graphs. Four months from schema design to deployment.",
    honest:
      "The first schema had no native place for session-based progress state. Real users revealed it the moment they tried to resume their work. I rebuilt the data model in week three — the second version was significantly cleaner, and the rebuild took two days.",
    tech: ["React", "TypeScript", "Django REST", "Python", "JWT", "OpenCV", "SymPy", "Three.js"],
    repo: "https://github.com/lamii21",
    demo: null,
    metrics: "Solo build · 4 months · OCR + SymPy + 3D",
    problem:
      "Students were disengaging because the system had no memory — no way to track where they left off, what difficulty matched their current state, or what they'd mastered. And solving problems required paper — the student had no way to photograph a question and get an immediate explanation.",
    solution:
      "Designed the relational schema before writing code. OCR (OpenCV) reads the student's handwritten or printed problem. SymPy solves it symbolically and produces step-by-step reasoning. Three.js renders the function in 3D where relevant. Progress is native to the data model — not bolted on.",
    architecture:
      "Camera → OpenCV OCR → SymPy solver → Django REST API → PostgreSQL (progress schema) → React + Three.js; the schema shaped every UI interaction from day one.",
    caseStudy: {
      context:
        "Year 2 at EMSI. I wanted to build something that stretched every layer of the stack — not a tutorial project. I chose education because progress tracking is a genuine relational modeling problem, and I added OCR and SymPy because I wanted to understand what it takes to make software that reasons about mathematical input, not just stores it.",
      objectives: [
        "OCR pipeline: photograph a math problem → extract text using OpenCV",
        "Symbolic solver: parse the extracted equation with SymPy, produce step-by-step solution",
        "3D visualization: render function graphs with Three.js for geometric and calculus problems",
        "Django REST API with JWT authentication and relational progress tracking",
        "Deploy to production — not just localhost",
      ],
      techChoices: [
        {
          name: "OpenCV",
          reason:
            "Computer vision library for image preprocessing and text region detection. The raw camera image needs binarization, noise removal, and contour detection before OCR can run reliably.",
        },
        {
          name: "SymPy",
          reason:
            "Python symbolic math library. Unlike numerical solvers, SymPy produces exact symbolic answers and intermediate steps — which is what a student needs to understand the solution, not just check it.",
        },
        {
          name: "Three.js",
          reason:
            "3D rendering in the browser. For functions and geometric problems, a rendered 3D graph is a more useful explanation than a text description. Three.js lets the student rotate and inspect the graph.",
        },
        {
          name: "Django REST",
          reason:
            "Python backend with a strong ORM. The data modeling primitives map directly to the schema: User, Exercise, Progress, SolverLog. Batteries included for auth, serialization, and the REST API.",
        },
      ],
      timeline: [
        {
          milestone: "Schema Design",
          duration: "Weeks 1–3",
          description:
            "Designed the relational schema first. Three core entities: User, Exercise, Progress. The Progress model — a join table with completion_date, score, and attempt_count — is what makes session continuity possible.",
        },
        {
          milestone: "OCR Pipeline",
          duration: "Weeks 4–6",
          description:
            "OpenCV preprocessing (binarize, denoise, detect text regions) → OCR → mathematical expression parser. Handling handwritten vs. printed input required separate preprocessing paths.",
        },
        {
          milestone: "SymPy Solver",
          duration: "Weeks 6–8",
          description:
            "Parsing the extracted string into a SymPy expression. Solving it. Extracting step-by-step intermediate results. Formatting the solution for display in the React interface.",
        },
        {
          milestone: "Django REST API",
          duration: "Weeks 8–10",
          description:
            "Models, serializers, viewsets, JWT authentication. 15+ API endpoints: users, exercises, progress, solver invocation, result retrieval.",
        },
        {
          milestone: "React + Three.js Interface",
          duration: "Weeks 10–14",
          description:
            "Camera input, exercise display, solver result rendering, progress dashboard. Three.js 3D graph for function visualization. Schema rebuild (v2) at day 17 — Progress model redesigned.",
        },
        {
          milestone: "Deployment",
          duration: "Week 15",
          description:
            "First production deployment. Found a missing DATABASE_URL env var. Fixed, documented, redeployed. Django settings split into dev/prod configurations.",
        },
      ],
      challenges: [
        {
          title: "OCR accuracy on handwritten input",
          body: "Handwritten mathematical notation is one of the hardest OCR targets. Symbols like ∫, Σ, and √ don't appear in standard OCR training sets. An expression like '∫x²dx' is ambiguous without context.",
          solution:
            "Separate preprocessing paths for printed (higher binarization threshold) and handwritten input. A custom symbol dictionary for common math notation. For ambiguous cases, the system surfaces the parsed expression back to the student before solving — a confirmation step that catches misreadings.",
        },
        {
          title: "Schema for progress state",
          body: "Where does 'a student is 60% through topic X with 3 attempts' live in the database? Version 1 had progress state on the Exercise model — wrong cardinality.",
          solution:
            "A Progress model as a join table between User and Exercise, with completion_date, score, and attempt_count. The rebuild took two days and produced significantly cleaner queries — filtering by user, by topic, or by completion status all became natural.",
        },
        {
          title: "Three.js integration with React",
          body: "Three.js is imperative; React is declarative. Managing the Three.js renderer lifecycle inside React components — creating, updating, and disposing the canvas — required careful use of useEffect and useRef.",
          solution:
            "A custom React hook that encapsulates the Three.js scene lifecycle. The hook takes the mathematical function as a dependency and re-renders the scene on function change. Cleanup runs on unmount. The React component is declarative; the Three.js work is isolated in the hook.",
        },
      ],
      impact: [
        {
          metric: "End-to-end",
          description: "Camera input → OCR → SymPy solve → 3D render, in one system",
        },
        {
          metric: "4 months",
          description: "Solo build from schema design to production deployment",
        },
        {
          metric: "15+ endpoints",
          description: "Auth, exercises, progress, solver invocation, result retrieval",
        },
      ],
      learned: [
        {
          title: "Computer vision requires domain-specific preprocessing.",
          body: "Generic OCR fails on mathematical notation. The preprocessing pipeline — binarization, noise removal, symbol detection — is as important as the recognition model. Understanding what makes math notation hard to read is prerequisite to building a system that reads it.",
        },
        {
          title: "Symbolic computation is a different kind of software.",
          body: "SymPy doesn't compute a numeric answer — it reasons about expressions. Understanding how SymPy represents expressions internally (as expression trees) changed how I designed the solver output and the step-by-step explanation format.",
        },
        {
          title: "Schema first, always.",
          body: "The Progress entity wasn't obvious on day one. The rebuild took two days and produced significantly cleaner queries. The interface was a consequence of the data model — not a driver of it.",
        },
      ],
    },
  },

  // ── 2. Smart RH ──────────────────────────────────────────────────────────────
  {
    id: "smart-rh",
    title: "Smart RH",
    category: "SaaS · HR Management · AI",
    year: "2025",
    featured: false,
    system:
      "Final-year engineering project. A SaaS HR management platform with AI-assisted recruitment scoring, employee dashboards, leave management, and automated HR workflows. Multi-tenant: each client company's data is isolated at the database level.",
    seam:
      "Designed the full SaaS architecture — data isolation, role-based access, AI analysis, and dashboard — as one integrated system. The AI scoring module needed the employee data model to be designed for analysis from the start.",
    outcome:
      "A deployed multi-tenant SaaS HR platform with AI-powered recruitment, employee management, leave workflows, and HR analytics dashboards. Delivered as the final-year engineering project.",
    tech: ["React", "TypeScript", "Django", "Python", "PostgreSQL", "AI", "Tailwind CSS"],
    repo: null,
    demo: null,
    metrics: "Final-year project · Multi-tenant SaaS · AI recruitment",
    problem:
      "SMEs manage HR with disconnected tools — employee records in spreadsheets, recruitment in email, leave requests in WhatsApp. HR managers spend more time on data entry than on people. No single view of the workforce.",
    solution:
      "A unified SaaS platform where all HR data lives in one system. AI-assisted recruitment scoring reduces manual screening time. Row-level security ensures complete data isolation between client companies. Dashboards give HR managers real-time visibility into their workforce.",
    architecture:
      "React SaaS dashboard → Django REST API (RBAC) → PostgreSQL (row-level security per tenant) → Python AI analysis layer → automated workflow engine",
    caseStudy: {
      context:
        "Final-year engineering project at EMSI. The brief was to design and build a production-quality SaaS application demonstrating architecture, AI integration, and system design. We chose HR management because the domain has real, unsolved complexity — most SMEs manage HR with spreadsheets, and the gap between what's possible and what they have is large.",
      objectives: [
        "Multi-tenant SaaS architecture with row-level data isolation per client company",
        "AI-assisted recruitment: CV scoring and candidate ranking",
        "Employee management, leave workflows, and HR analytics dashboards",
        "Role-based access: HR manager, line manager, employee views of the same data",
        "Production-quality architecture delivered as a graduation project",
      ],
      techChoices: [
        {
          name: "React / TypeScript",
          reason:
            "Complex SaaS dashboard with role-based views, multi-step forms, and real-time data. TypeScript caught the majority of UI state bugs at compile time — critical for a system where role mismatches could expose the wrong data.",
        },
        {
          name: "Django / PostgreSQL",
          reason:
            "Django's ORM is well-suited to the relational complexity of HR data. PostgreSQL's row-level security enforces tenant isolation at the database level — not just in application code.",
        },
        {
          name: "Python / AI",
          reason:
            "AI analysis layer for recruitment scoring and workforce analytics. Same language as the backend — no separate service required for the ML component.",
        },
      ],
      timeline: [
        {
          milestone: "Architecture Design",
          duration: "Weeks 1–3",
          description:
            "Multi-tenant SaaS architecture. How does data isolation work between organizations? Row-level security in PostgreSQL. Role-based access control across the stack.",
        },
        {
          milestone: "Core HR Data Layer",
          duration: "Weeks 4–7",
          description:
            "Employee, department, role, and contract models. Leave management with approval workflows. The data layer is the foundation everything else depends on.",
        },
        {
          milestone: "AI Recruitment Module",
          duration: "Weeks 8–10",
          description:
            "CV upload, NLP parsing, skill extraction, ML scoring. Candidates ranked by match quality against open positions. Score breakdown visible to HR reviewers.",
        },
        {
          milestone: "Dashboards + Workflows",
          duration: "Weeks 11–14",
          description:
            "Executive HR dashboard: headcount, turnover, leave pipeline, recruitment funnel. Automated workflows for leave approval, onboarding checklists, and notifications.",
        },
        {
          milestone: "Testing + Deployment",
          duration: "Weeks 15–16",
          description:
            "End-to-end testing across all modules. Multi-tenant isolation tests. Production deployment and final-year project defense.",
        },
      ],
      challenges: [
        {
          title: "Multi-tenant data isolation",
          body: "A SaaS HR platform handles different companies' employee data. These datasets must never be visible across tenants — a breach is both a technical failure and a legal one.",
          solution:
            "Row-level security in PostgreSQL ensures every query is automatically scoped to the requesting tenant's organization. The application layer never sees cross-tenant data — the isolation is enforced at the database level, not just in application code.",
        },
        {
          title: "Role-based access across the full stack",
          body: "An HR manager, a line manager, and an employee all use the same platform but see completely different views of the same data. Access control logic had to be consistent between the API and the UI.",
          solution:
            "JWT-encoded role claims, enforced in the Django API at every endpoint, and reflected in the React router to show/hide views. One source of truth for roles — the token — not duplicated logic across two layers.",
        },
        {
          title: "AI recruitment scoring explainability",
          body: "The AI scoring module produces a ranked list of candidates. A score without explanation is not trusted by HR reviewers — they need to know why a candidate ranked where they did.",
          solution:
            "Score breakdown by dimension: technical skill match, experience level alignment, domain relevance. HR reviewers see the contributing factors, not just the number. The AI is a tool that helps them decide, not a decision maker.",
        },
      ],
      impact: [
        {
          metric: "Multi-tenant",
          description: "Row-level security for complete per-company data isolation",
        },
        {
          metric: "AI-assisted",
          description: "Recruitment scoring with explainable breakdown per candidate",
        },
        {
          metric: "Graduation project",
          description: "Production-quality SaaS architecture, delivered and defended",
        },
      ],
      learned: [
        {
          title: "Multi-tenancy is an architectural decision, not a feature.",
          body: "Adding multi-tenant isolation after the fact is expensive and error-prone. Designing row-level security into the schema from day one — and testing it from day one — is the only approach that produces reliable isolation.",
        },
        {
          title: "Role-based access must be consistent across the stack.",
          body: "Access control logic duplicated in the API and the UI diverges over time. JWT-encoded role claims enforced at the API, reflected in the UI, with one definition of what each role can do — that's the only sustainable pattern.",
        },
        {
          title: "The graduation project is a systems design exercise.",
          body: "The interesting decisions were architectural: multi-tenancy, access control, AI integration, workflow automation. Writing the code was the implementation of design decisions made earlier. Getting the design right first made the implementation cleaner.",
        },
      ],
    },
  },

  // ── 3. RecruteAI ────────────────────────────────────────────────────────────
  {
    id: "recrute-ai",
    title: "RecruteAI",
    category: "AI · Recruitment · NLP",
    year: "2024",
    featured: false,
    system:
      "Intelligent recruitment platform using ML and NLP to automate candidate matching, skill extraction, and scoring. CV goes in; ranked candidates with explainable scores come out. HR reviewers see the reasoning, not just the number.",
    seam:
      "Built the NLP parsing pipeline, the ML scoring model, and the HR dashboard as one system. The scoring model output directly shapes what recruiters see — a model that can't explain its ranking is a model the reviewers won't trust.",
    outcome:
      "Automated CV parsing, skill extraction, and candidate scoring with a React dashboard. Candidates ranked by match quality with score breakdown by dimension.",
    tech: ["Python", "NLP", "Machine Learning", "React", "FastAPI"],
    repo: null,
    demo: null,
    metrics: "Automated CV matching · Explainable scoring",
    problem:
      "Manual CV screening is slow, inconsistent, and biased toward keyword matching rather than actual capability. Skilled candidates get filtered out before a human reads their file. Recruiters spend hours on a task that could be automated.",
    solution:
      "An ML pipeline that parses CVs, extracts skills, and scores candidates against job requirements — with a React dashboard that makes the ranking visible, filterable, and explainable by dimension.",
    architecture:
      "CV upload → NLP parser → skill extractor → ML matcher → score API (FastAPI) → React HR dashboard",
    caseStudy: {
      context:
        "Recruitment processes rely on manual CV review that is slow, inconsistent, and prone to keyword-matching bias. This platform automates the screening stage using NLP and ML — so recruiters spend time on candidates the system has already ranked, not on reading every file in a stack.",
      objectives: [
        "Automate CV parsing and skill extraction with NLP",
        "Score candidates against job requirements with a trained ML model",
        "Build a dashboard that makes rankings visible, filterable, and explainable",
        "Reduce time-to-shortlist without reducing candidate quality",
      ],
      techChoices: [
        {
          name: "Python / NLP",
          reason:
            "Natural language processing for CV parsing and skill extraction — tokenization, entity recognition, semantic similarity. Python's NLP ecosystem is the standard for this type of pipeline.",
        },
        {
          name: "Machine Learning",
          reason:
            "Supervised scoring model trained on job-candidate match patterns. The model produces a score, not a binary filter — HR reviewers can see the breakdown and adjust thresholds.",
        },
        {
          name: "FastAPI",
          reason:
            "Async Python API layer between the ML pipeline and the React frontend. Automatic OpenAPI documentation. The right exposure layer when the consumer is the HR dashboard, not a browser user.",
        },
        {
          name: "React",
          reason:
            "Dashboard interface for HR managers — ranked candidate list, filtering by skill or score, individual profile view with score breakdown per dimension.",
        },
      ],
      timeline: [
        {
          milestone: "Domain Research",
          duration: "Week 1",
          description:
            "Researched what 'good match' means in recruitment — skills, experience weight, role specificity. The ML model needed a definition of the target before feature engineering.",
        },
        {
          milestone: "CV Parser + NLP Pipeline",
          duration: "Weeks 2–3",
          description:
            "CV text extraction, NLP entity recognition for skills, education, experience. Every CV becomes structured data — the pipeline is the foundation of the scoring model.",
        },
        {
          milestone: "ML Matching Model",
          duration: "Weeks 4–5",
          description:
            "Feature engineering from extracted skills + job requirements. Trained scoring model. Output: a ranked score per candidate-job pair with dimension breakdown.",
        },
        {
          milestone: "FastAPI + React Dashboard",
          duration: "Weeks 6–8",
          description:
            "Score API, then the HR dashboard — ranked candidate list, filters by skill or score, individual profile view with score breakdown by dimension.",
        },
      ],
      challenges: [
        {
          title: "Defining 'match' formally",
          body: "A match is not just keyword overlap. A senior candidate for a junior role is also a mismatch. The model needed a definition of good match that captured level, relevance, and breadth of skills.",
          solution:
            "Feature engineering that included skill-level alignment (not just presence), experience weight, and role-specific importance scores. The training signal came from feedback on historical candidates.",
        },
        {
          title: "CV format diversity",
          body: "CVs arrive in PDF and DOCX with wildly different layouts. Skill names are inconsistent — 'JavaScript', 'JS', and 'Node.js' refer to overlapping but distinct concepts.",
          solution:
            "Format-agnostic text extraction, then an NLP normalization layer that maps surface variations to canonical skill names. The normalization dictionary was built iteratively from real CV data.",
        },
        {
          title: "Explainability for HR reviewers",
          body: "A score without explanation is not trusted. 'Why is this candidate ranked 4th?' needs a real answer — not just a number.",
          solution:
            "Score breakdown by category: technical skills match, experience level alignment, domain relevance. The dashboard shows which factors drove the score, visible per candidate.",
        },
      ],
      impact: [
        {
          metric: "Automated",
          description: "CV parsing, skill extraction, and scoring in one pipeline",
        },
        {
          metric: "Ranked",
          description: "Candidates ordered by match quality, not submission order",
        },
        {
          metric: "Explainable",
          description: "Score breakdown per dimension visible in the HR dashboard",
        },
      ],
      learned: [
        {
          title: "Domain expertise shapes the model.",
          body: "The ML model is only as good as its definition of 'match'. Getting that definition right required understanding the recruitment domain before building features — what HR reviewers actually care about, not what's easy to quantify.",
        },
        {
          title: "Explainability is a feature, not an afterthought.",
          body: "HR reviewers don't trust a black-box score. Building the score breakdown into the interface from the start — not as a later addition — made the tool actually usable in practice.",
        },
        {
          title: "NLP normalization is the hardest part.",
          body: "Parsing text from a CV is easy. Knowing that 'React.js', 'ReactJS', and 'React' are the same skill — and that 'JavaScript' and 'Node.js' are related but distinct — requires a normalization layer that takes real domain knowledge to build.",
        },
      ],
    },
  },

  // ── 4. OrderHub ─────────────────────────────────────────────────────────────
  {
    id: "orderhub",
    title: "OrderHub",
    category: "SaaS · E-Commerce · Automation",
    year: "2024",
    featured: false,
    system:
      "SaaS order management platform with real-time Google Sheets sync via webhooks. Orders placed in the Next.js store appear immediately in the team's operational spreadsheet — zero manual copy-paste.",
    seam:
      "Built the e-commerce frontend, the Express.js webhook layer, and the Supabase backend as one system — then built the Google Apps Script bridge to meet the client's actual operational workflow. The sync is invisible to the team.",
    outcome:
      "Real-time order synchronization between a Next.js storefront and Google Sheets via webhook triggers. Order data flows automatically — no manual export, no copy-paste, no lag.",
    tech: ["Next.js", "React", "TypeScript", "Supabase", "Google Apps Script", "Express.js"],
    repo: null,
    demo: null,
    metrics: "Real-time sync · Zero manual steps",
    problem:
      "A small e-commerce team was managing orders in Google Sheets manually — each new order required copy-pasting customer details, items, and totals from the store admin. Errors and delays were constant.",
    solution:
      "A webhook-triggered sync that writes every new order directly into the team's Google Sheets the moment it is placed. The team's operational workflow didn't change — the data just arrived automatically.",
    architecture:
      "Next.js storefront → order event → Express.js webhook → Supabase persist → Google Apps Script → Google Sheets row",
    caseStudy: {
      context:
        "A small e-commerce team was managing order data across two systems: their Next.js store and a Google Sheets spreadsheet used for daily operations. Every order required manual copy-paste from the store admin into the sheet. This project replaced that copy-paste loop with an automated sync.",
      objectives: [
        "Real-time order sync from Next.js store to Google Sheets via webhook",
        "Zero manual steps between order placement and spreadsheet row",
        "Order data in Supabase for querying and reporting",
        "Admin dashboard for order status and tracking",
      ],
      techChoices: [
        {
          name: "Next.js / TypeScript",
          reason:
            "Full-stack framework for the storefront — server-side rendering for product pages, client-side for cart and checkout. TypeScript throughout: prop mismatches caught at compile time.",
        },
        {
          name: "Supabase",
          reason:
            "Postgres-based backend with real-time capabilities. Order data is persisted in Supabase — the webhook reads from here to trigger the Sheets sync. Real-time listeners for the dashboard.",
        },
        {
          name: "Express.js",
          reason:
            "Lightweight webhook receiver. Validates the incoming order payload, writes to Supabase, then calls the Google Apps Script endpoint. Retry logic for failed sync attempts.",
        },
        {
          name: "Google Apps Script",
          reason:
            "The bridge between the webhook and Google Sheets. GAS runs inside Google's infrastructure with direct write access to Sheets — no API key management on the Sheets side.",
        },
      ],
      timeline: [
        {
          milestone: "Storefront + Checkout",
          duration: "Weeks 1–3",
          description:
            "Next.js product catalog, cart, and checkout flow. Order model defined in Supabase. TypeScript throughout — type mismatches caught at build time.",
        },
        {
          milestone: "Webhook Architecture",
          duration: "Week 4",
          description:
            "Express.js webhook receiver. Validates incoming order events, persists to Supabase, calls the Google Apps Script endpoint. Retry logic for failed sync attempts.",
        },
        {
          milestone: "Google Sheets Sync",
          duration: "Week 5",
          description:
            "Google Apps Script that appends a new row to the operations sheet on each webhook call. Format matched the team's existing sheet structure exactly — no retraining needed.",
        },
        {
          milestone: "Dashboard + Testing",
          duration: "Weeks 6–7",
          description:
            "React admin dashboard for order status and tracking. End-to-end testing from order placement to sheet row appearing.",
        },
      ],
      challenges: [
        {
          title: "Webhook reliability",
          body: "Webhooks can fail — network timeouts, transient errors, Google Apps Script execution limits. An order that triggers no sheet row is invisible to the operations team.",
          solution:
            "Retry logic on the Express.js webhook handler. Each webhook event is persisted to Supabase before the Sheets sync — if the sync fails, the order is still in the database and can be resent from there.",
        },
        {
          title: "Google Apps Script execution limits",
          body: "GAS has daily execution quotas and per-call time limits. High order volume could exhaust the quota before the end of the business day.",
          solution:
            "Batched sync for high-frequency periods — instead of one GAS call per order, the webhook accumulates orders and sends them in batches. Individual orders under low load still sync immediately.",
        },
        {
          title: "Matching the team's existing sheet structure",
          body: "The team had been using their Google Sheets format for years. A sync that produced different column names or row formats would require retraining the team — or they'd reject the tool.",
          solution:
            "Built the sync output to match their existing format exactly: same column order, same date format, same status vocabulary. The tool was invisible to their workflow — it just removed the manual step.",
        },
      ],
      impact: [
        {
          metric: "Real-time",
          description: "Orders appear in Google Sheets the moment they are placed",
        },
        {
          metric: "0 manual steps",
          description: "Between order placement and operational spreadsheet row",
        },
        {
          metric: "Full stack",
          description: "Next.js storefront, Express webhook, Supabase, Google Sheets",
        },
      ],
      learned: [
        {
          title: "Match the team's existing workflow.",
          body: "The best automation is invisible. If the sync had changed the sheet's column structure, the team would have needed to change their processes. Matching the existing format exactly meant the tool required zero adoption effort.",
        },
        {
          title: "Webhook reliability requires defensive design.",
          body: "Persisting the event before processing it means no order is ever lost even if downstream systems fail. The retry logic and the Supabase fallback are not optional — they're what makes the sync trustworthy.",
        },
        {
          title: "Google Apps Script is the right tool for Sheets integration.",
          body: "GAS runs inside Google's infrastructure with direct write access to Sheets. No API key management, no OAuth flow to maintain. Easier than the Sheets API and sufficient for this use case.",
        },
      ],
    },
  },

  // ── 5. FlowForge ETL ────────────────────────────────────────────────────────
  {
    id: "flowforge-etl",
    title: "FlowForge ETL",
    category: "Data Engineering · Automation",
    year: "2024",
    featured: false,
    system:
      "Built during my internship at Yazaki. Ingest, transform, expose. Raw BOM Excel files go in; clean, queryable output comes out of a FastAPI endpoint. A React dashboard visualizes the pipeline output. No manual steps in between.",
    seam:
      "Built the ingestion logic, the transformation layer, the API, and the React visualization — then validated each layer against the previous one. The pipeline is meaningless without the consumer that reads it.",
    outcome:
      "Cut weekly BOM processing from 8 hours of manual Excel work to under 4 minutes of automated processing. FastAPI exposes the clean data; React visualizes it.",
    honest:
      "Version one broke on Excel formatting variants I hadn't seen in the test files. Defensive parsing is harder than happy-path parsing. Version two handled every production format variant without exception.",
    tech: ["Python", "Pandas", "FastAPI", "React", "TypeScript", "openpyxl"],
    repo: "https://github.com/lamii21",
    demo: null,
    metrics: "8 hours → 4 minutes · Yazaki internship",
    problem:
      "Industrial BOM files from manufacturing systems arrived as complex, inconsistently-formatted Excel exports. The team was spending approximately 8 hours per week on manual processing — copy-paste, reformatting, validation by hand.",
    solution:
      "An automated pipeline that ingests, cleans, transforms, and exposes data via a FastAPI endpoint — any downstream tool connects once and always receives clean data. A React dashboard visualizes the weekly BOM output for the engineering team.",
    architecture:
      "Excel BOM → format detector → openpyxl parser → Pandas transform → SQLAlchemy persist → FastAPI endpoint → React dashboard",
    caseStudy: {
      context:
        "Industrial internship at Yazaki, a global automotive wire-harness manufacturer. The manufacturing engineering team was spending approximately 8 hours every week manually processing Bill of Materials (BOM) data from Excel files. The files were inconsistently formatted across software versions. I built the full pipeline — from Excel parsing to React visualization — to replace the manual process entirely.",
      objectives: [
        "Automate the full BOM processing cycle — zero manual steps",
        "Handle all Excel formatting variants present in the production archive",
        "Expose clean data via FastAPI for downstream tools",
        "React dashboard for engineering team to inspect pipeline output",
      ],
      techChoices: [
        {
          name: "openpyxl",
          reason:
            "Direct Excel file access at the cell level. The BOM files had merged cells and formatting structures that pandas.read_excel() couldn't handle reliably — openpyxl let me inspect the raw cell structure before parsing.",
        },
        {
          name: "Pandas",
          reason:
            "Once openpyxl extracted the raw structure, Pandas handled the transformation. Standard tool for tabular data manipulation after the hard parsing work is done.",
        },
        {
          name: "FastAPI",
          reason:
            "Async Python API layer. Automatic OpenAPI documentation. Exposes the clean pipeline output to any downstream tool — dashboards, scripts, or reporting systems.",
        },
        {
          name: "React / TypeScript",
          reason:
            "Dashboard for the engineering team to inspect the pipeline's output — BOM hierarchy visualization, processing status, exception log. TypeScript caught prop mismatches at build time.",
        },
      ],
      timeline: [
        {
          milestone: "Domain Study",
          duration: "Days 1–4",
          description:
            "Read manufacturing documentation before writing code. Understanding BOM as a hierarchical tree — assemblies containing sub-assemblies — changed how I designed the parser's data structure.",
        },
        {
          milestone: "Parser v1 (happy path)",
          duration: "Days 5–7",
          description:
            "Built the first version assuming consistent formatting. Worked on test files. Broke immediately on the first production file from the archive.",
        },
        {
          milestone: "Edge Case Discovery",
          duration: "Days 8–10",
          description:
            "Ran v1 against the full archive. Catalogued every formatting variant: shifted header rows, merged cells, inconsistent column naming across software versions.",
        },
        {
          milestone: "Defensive Rewrite (v2)",
          duration: "Days 11–14",
          description:
            "Format detection before parsing. Defensive assumptions — check before trusting. Validation step that verifies output structure before it reaches downstream consumers.",
        },
        {
          milestone: "FastAPI + React Dashboard",
          duration: "Days 15–20",
          description:
            "FastAPI endpoint exposing clean output. React dashboard for the engineering team — BOM visualization, status, exception log. Handoff documentation.",
        },
      ],
      challenges: [
        {
          title: "Inconsistent Excel formatting across software versions",
          body: "The BOM files had been generated by different versions of the production management software over several years. No two file vintages were formatted the same way. Version 1 broke on the first production file.",
          solution:
            "Format detector that identified which variant it was reading before attempting to parse. Each variant had its own parsing branch. Defensive parsing — check before assuming.",
        },
        {
          title: "Understanding BOM hierarchy",
          body: "A BOM is a tree: assemblies contain sub-assemblies, sub-assemblies contain parts. Parsing it flat produces incorrect output. The hierarchy is embedded in the Excel structure — indentation, level codes, group rows.",
          solution:
            "Two days reading manufacturing documentation before writing code. Understanding the hierarchy changed the data structure I designed: nested tree instead of flat list. Domain knowledge made the parser correct.",
        },
        {
          title: "Version 1 silently producing wrong output",
          body: "V1 worked on 40% of the archive and silently produced wrong output on the rest — no error, just wrong data. Silent failures are worse than loud ones.",
          solution:
            "Explicit format detection, error logging for unknown formats, and a validation step that verified output structure before passing it to the FastAPI layer. Fail loudly, not silently.",
        },
      ],
      impact: [
        {
          metric: "8h → 4min",
          description: "Weekly BOM processing cycle, 99.2% time reduction",
        },
        {
          metric: "0 manual steps",
          description: "Between Excel export and FastAPI output + React dashboard",
        },
        {
          metric: "100% archive",
          description: "All production file format variants handled after v2",
        },
      ],
      learned: [
        {
          title: "Domain knowledge is not optional.",
          body: "I couldn't have written a correct BOM parser without understanding what a BOM is — hierarchically — before reading a line of code. The two days reading manufacturing documentation is why the parser handled the hierarchy correctly.",
        },
        {
          title: "Test coverage based on examples is insufficient.",
          body: "The test files all used the same formatting vintage. Production data will always contain variants your test set doesn't. Building v1 was fast; discovering its failure modes cost more time than building it.",
        },
        {
          title: "Defensive parsing is a discipline.",
          body: "Check format assumptions before trusting them. Log unknown formats loudly. Validate output structure before passing it downstream. Fail explicitly, not silently.",
        },
      ],
    },
  },

  // ── 6. HijabShop ────────────────────────────────────────────────────────────
  {
    id: "hijabshop",
    title: "HijabShop",
    category: "E-Commerce · Full-Stack · AI",
    year: "2024",
    featured: false,
    system:
      "Full-stack modest fashion e-commerce platform with an AI-powered color pairing recommendation engine. The system suggests complementary products based on color theory — catalog, cart, checkout, and intelligent styling in one platform.",
    seam:
      "Built the full e-commerce stack and the AI color recommendation layer together. The recommendation system needed color metadata to be native to the product data model — designed in from the start, not retrofitted.",
    outcome:
      "A deployed e-commerce platform with product catalog, cart, checkout, order management, and an AI color pairing recommendation engine for modest fashion.",
    tech: ["Next.js", "TypeScript", "Python", "AI", "Tailwind CSS", "PostgreSQL"],
    repo: null,
    demo: null,
    metrics: "Full-stack · AI color recommendations",
    problem:
      "Modest fashion customers often struggle to build coherent wardrobes. Individual pieces are easy to find, but knowing what colors and styles pair well together requires expertise most customers don't have.",
    solution:
      "An AI-powered color recommendation system embedded in the product pages. When a customer views a product, the system suggests complementary items based on color theory rules and the product's color family.",
    architecture:
      "Next.js product pages → color metadata schema → Python recommendation API → complementary product list → React display component",
    caseStudy: {
      context:
        "A modest fashion e-commerce platform built for customers who know what they want to wear but need help building a coherent wardrobe. The standard e-commerce experience shows products in isolation — this platform shows how products fit together. Color pairing is the core differentiating feature.",
      objectives: [
        "Full e-commerce platform: catalog, cart, checkout, orders",
        "AI color recommendation: suggest complementary products using color theory",
        "Mobile-first, accessible UI for fashion e-commerce",
        "Order management for the store operator",
      ],
      techChoices: [
        {
          name: "Next.js / TypeScript",
          reason:
            "SSR for product pages (SEO — fashion search traffic depends on being indexed), client-side for cart and checkout. TypeScript throughout for type-safe prop passing.",
        },
        {
          name: "AI / Color Recommendation",
          reason:
            "Python service that applies color theory rules to product metadata. Complementary, analogous, and neutral combinations suggested based on the product's color family and tone.",
        },
        {
          name: "PostgreSQL",
          reason:
            "Relational data for products, orders, inventory. Color metadata stored as structured attributes on each product — the recommendation query is a SQL join, not a separate ML model call.",
        },
      ],
      timeline: [
        {
          milestone: "Product Catalog + Color Schema",
          duration: "Weeks 1–2",
          description:
            "Designed the product schema with color metadata as a first-class attribute: primary hue, tone (warm/cool/neutral), saturation level. The recommendation system depends on this being native to the data model.",
        },
        {
          milestone: "E-Commerce Core",
          duration: "Weeks 3–5",
          description:
            "Product pages, cart state, checkout flow, order creation. SSR for product pages. Cart persistence across sessions.",
        },
        {
          milestone: "Color Recommendation API",
          duration: "Week 6",
          description:
            "Python service that returns complementary product IDs for a given product's color attributes. Color theory rules encoded as explicit logic — transparent, not a black box.",
        },
        {
          milestone: "UI Integration + Order Management",
          duration: "Weeks 7–8",
          description:
            "Recommendation display on product pages. Store operator dashboard for order management and inventory. Mobile-first responsive design.",
        },
      ],
      challenges: [
        {
          title: "Color metadata modeling",
          body: "Color is multi-dimensional: hue, saturation, tone, cultural context. A simple 'color: red' field is insufficient for recommendation logic.",
          solution:
            "Modeled each product's color as a structured object: primary hue, tone (warm/cool/neutral), and saturation level. The recommendation logic operates on these dimensions, not on color names.",
        },
        {
          title: "Recommendation quality vs. page load speed",
          body: "Computing color recommendations in real-time on every product page view adds latency. Pre-computing for every product pair doesn't scale as the catalog grows.",
          solution:
            "Computed recommendations at product creation time and cached them. When a new product is added, its recommendations are computed against the existing catalog and stored. Page load doesn't trigger live recommendation computation.",
        },
        {
          title: "Mobile-first UX with complex recommendations",
          body: "Product pages with recommendations add visual complexity that can overwhelm small screens. Fashion e-commerce gets most of its traffic on mobile.",
          solution:
            "Progressive disclosure: the recommendation panel is collapsed by default on mobile and expands on tap. Desktop shows it inline. Same content, context-appropriate presentation.",
        },
      ],
      impact: [
        {
          metric: "End-to-end",
          description: "Catalog, cart, checkout, orders, and AI recommendations in one platform",
        },
        {
          metric: "Color theory AI",
          description: "Complementary product suggestions based on structured color attributes",
        },
        {
          metric: "Mobile-first",
          description: "Progressive disclosure design for fashion e-commerce mobile traffic",
        },
      ],
      learned: [
        {
          title: "Domain knowledge shapes the data model.",
          body: "Color recommendation only works if color is a first-class concept in the schema. Designing the product model with color as a structured attribute from day one — not a string field — made the recommendation feature possible without retrofitting.",
        },
        {
          title: "Pre-computation beats real-time for recommendations.",
          body: "Computing recommendations at product creation time, rather than at page load, means fast page loads and a computation cost paid once per product, not on every user visit.",
        },
        {
          title: "Progressive disclosure is a design principle, not a mobile trick.",
          body: "Collapsing the recommendation panel on mobile and expanding on tap is the right answer for any context where adding information risks overwhelming the primary content.",
        },
      ],
    },
  },

  // ── 7. Darlbanat ────────────────────────────────────────────────────────────
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
    repo: "https://github.com/lamii21",
    demo: null,
    metrics: "Real client · Live deployment",
    problem:
      "A paper-based system for tracking orders and inventory meant errors, lost tickets, and zero visibility into daily revenue or stock levels.",
    solution:
      "A web application where every order is a database row — inventory depletes on sale, reports query live data, nothing is transcribed manually.",
    architecture:
      "Entity Framework Core → SQL Server → ASP.NET Core Web API; the relational model drives UI logic, not the other way around.",
    caseStudy: {
      context:
        "A real client: a restaurant owner managing orders and inventory on paper. Lost tickets, inaccurate stock counts, no daily revenue visibility. Different from personal projects because the requirements came from a real business problem, not from my own curiosity about a technical challenge.",
      objectives: [
        "Replace the paper system with a digital one the owner could actually use",
        "Inventory updates in real-time — depletes automatically on every sale",
        "Daily revenue and stock reporting from live data",
        "Weekly client reviews with working demos, not specification documents",
      ],
      techChoices: [
        {
          name: "C# / ASP.NET Core",
          reason:
            "Client requirement — their existing server infrastructure was Windows-based, and the hosting environment supported .NET natively. Stack choice determined by the deployment target.",
        },
        {
          name: "SQL Server",
          reason:
            "Standard for the .NET ecosystem, supported by the client's hosting provider. Robust relational database for order management — transactions, constraints, cascade deletes.",
        },
        {
          name: "Entity Framework Core",
          reason:
            "Code-first migrations, type-safe queries, clean mapping between C# domain models and the database schema. Same ORM pattern as Django — different syntax, same mental model.",
        },
      ],
      timeline: [
        {
          milestone: "Domain Modeling",
          duration: "Weeks 1–2",
          description:
            "Requirements gathering and entity modeling. Restaurant domain: orders contain line items, line items reference menu items, menu items have inventory quantities. Schema came from understanding this hierarchy.",
        },
        {
          milestone: "Database + API",
          duration: "Weeks 3–5",
          description:
            "SQL Server schema, Entity Framework models, ASP.NET Core Web API endpoints for orders, inventory management, and daily reports.",
        },
        {
          milestone: "Web Frontend",
          duration: "Weeks 6–7",
          description:
            "Interface the owner would actually use — order entry, inventory view, daily totals. Client review every week with a working demo.",
        },
        {
          milestone: "Client Feedback + Deployment",
          duration: "Week 8",
          description:
            "Incorporated client feedback from weekly reviews, deployed to the client's server. Paper system retired the same day.",
        },
      ],
      challenges: [
        {
          title: "Working with a new tech stack",
          body: "C# and ASP.NET Core were new to me on this project. The client requirement determined the stack. I had to ship something working to a real client on a timeline.",
          solution:
            "Read the ASP.NET Core documentation systematically before writing code. Same architectural pattern as Django — models, DTOs, controllers. Different syntax, recognizable structure.",
        },
        {
          title: "Relational modeling for the restaurant domain",
          body: "A sale isn't just a transaction — it cascades: create the Order, create OrderLineItems, decrement Inventory. All in one operation.",
          solution:
            "Modeled the cascade as a database transaction with EF Core navigation properties. Either the full order is recorded with inventory decremented, or nothing is written. Atomicity at the database level.",
        },
        {
          title: "Requirements that evolved mid-build",
          body: "Mid-build, the client realized they also needed weekly inventory snapshots, not just daily totals.",
          solution:
            "Weekly client reviews with a working demo. Seeing the actual software changes what the client thinks they need — more valuable than specifying everything on paper first.",
        },
      ],
      impact: [
        { metric: "Live deployment", description: "Real client, paper system replaced entirely" },
        { metric: "Real-time", description: "Inventory updated automatically on every sale" },
        { metric: "One system", description: "Orders, inventory, and reporting in one database" },
      ],
      learned: [
        {
          title: "Client work requires a different kind of listening.",
          body: "The problem isn't mine to define — it's theirs. Understanding what they're doing with paper before designing the digital version changes what gets built.",
        },
        {
          title: "A new stack is learnable if you read first.",
          body: "ASP.NET Core was new. Reading the architectural pattern first meant I wasn't discovering it through trial and error mid-project. Understanding before coding is the correct order.",
        },
        {
          title: "The domain model encodes the business logic.",
          body: "The order-to-inventory cascade isn't application code written in a service layer — it's a property of the entity relationships. Getting the schema right means getting the business logic right.",
        },
      ],
    },
  },

  // ── 8. Nacim² ───────────────────────────────────────────────────────────────
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
    repo: "https://github.com/lamii21",
    demo: null,
    problem:
      "A family real-estate business was showing properties through static HTML listings — no search, no filtering, no way to compare land parcels.",
    solution:
      "A dynamic Next.js platform with server-side rendering and client-side filtering; the data model and search UI were designed at the same time.",
    architecture:
      "Next.js SSR → Prisma ORM → PostgreSQL; server renders listings for initial load, client manages filter state without extra API calls.",
    caseStudy: {
      context:
        "A family business needed a proper online presence for their real-estate listings. Static HTML pages — no search, no filtering. The client was non-technical; requirements came from watching how they used the current system and what they couldn't do with it.",
      objectives: [
        "Searchable, filterable property listings",
        "Fast initial page load for SEO — property listings benefit from being indexed",
        "Client-side filtering without full-page reloads",
        "URL-reflected filter state — every filtered view is bookmarkable",
      ],
      techChoices: [
        { name: "Next.js", reason: "SSR for SEO. Properties need to appear in search results, not just in client-rendered HTML that crawlers can't parse." },
        { name: "Prisma", reason: "Type-safe ORM. Schema defined in code, migrations automatic, type system catches mismatches between data model and API at compile time." },
        { name: "TypeScript", reason: "Caught prop mismatches between API response shape and component props during development, not at runtime." },
      ],
      timeline: [
        { milestone: "Domain Modeling", duration: "Week 1", description: "Prisma schema for property listings: surface area, location zone, type, price, availability status." },
        { milestone: "Next.js SSR", duration: "Weeks 2–3", description: "Server-rendered listing pages. Complete HTML on initial load — crawlable, fast first paint." },
        { milestone: "Client-Side Filtering", duration: "Week 4", description: "Filter state in URL query parameters. Client-side filter runs over already-loaded data without re-fetching." },
        { milestone: "UI + Client Review", duration: "Weeks 5–6", description: "Interface refinement with the client. Non-technical clients teach you what the software actually needs to do." },
      ],
      challenges: [
        { title: "SSR vs. CSR split for filtering", body: "Property listings need SSR for SEO but filtering needs to be responsive without page reloads.", solution: "SSR for initial full listing page. Filter state in URL query params, updated client-side. Client filter runs over already-loaded data." },
        { title: "Property data model", body: "The client used their own vocabulary — zone foncière, titre foncier, superficie. The schema had to reflect real property attributes.", solution: "Modeled attributes from actual property descriptions. Surface area, location, zone type, price, availability. Schema reflects the domain." },
        { title: "TypeScript prop mismatches", body: "Prisma-generated types and component prop types diverged as I iterated on the schema.", solution: "TypeScript caught mismatches at compile time. Fixed before the client saw them — much cheaper than finding them after." },
      ],
      impact: [
        { metric: "Live platform", description: "Real client, replaced static HTML pages" },
        { metric: "Searchable", description: "Properties filterable by zone, type, surface area, price" },
        { metric: "Shareable", description: "Every filter state is a URL — bookmarkable and shareable" },
      ],
      learned: [
        { title: "SSR and CSR aren't a binary choice.", body: "SSR for initial load (SEO), CSR for interactivity (filtering). The question is where each concern lives, not which one to use." },
        { title: "Non-technical clients define the real requirements.", body: "The domain vocabulary the client used to describe properties taught me what the schema needed to model." },
        { title: "Prisma's schema-first approach is a clean design tool.", body: "Schema defined in code, migrations auto-generated, type-safe queries — a complete feedback loop." },
      ],
    },
  },

  // ── 9. Yazaki Internship ────────────────────────────────────────────────────
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
    repo: "https://github.com/lamii21",
    demo: null,
    metrics: "8 hours → 4 minutes per week",
    problem:
      "BOM files from manufacturing systems arrived as complex, inconsistently-formatted Excel exports — ~8 hours of manual processing per week, prone to transcription errors.",
    solution:
      "A Python script that understands the manufacturing domain logic embedded in the file structure. Domain knowledge first, automation second.",
    architecture:
      "openpyxl (parsing) → pandas (transform logic) → Power BI output; defensive parsing built to handle every edge-case formatting variant encountered.",
  },

  // ── 10. FinTech Predict ──────────────────────────────────────────────────────
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
    repo: "https://github.com/lamii21",
    demo: null,
    problem:
      "A forecasting model without a transparent data pipeline produces outputs that can't be verified — the model and its inputs are equally important to understand.",
    solution:
      "An LSTM model paired with a clean, inspectable preprocessing pipeline. The focus was on understanding prediction boundaries, not chasing arbitrary accuracy targets.",
    architecture:
      "Pandas (preprocessing) → Keras LSTM → Matplotlib; pipeline clarity prioritized so every model input and output stays explainable.",
  },
];

/** Returns the project marked as featured. Falls back to first project. */
export const featuredProject = projects.find((p) => p.featured) ?? projects[0];

/** Returns all projects except the featured one. */
export const catalogProjects = projects.filter((p) => !p.featured);
