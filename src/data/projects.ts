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

export interface CaseStudyAlternative {
  option: string;
  why: string;
  chosen: string;
}

export interface CaseStudyOptimization {
  title: string;
  description: string;
  before?: string;
  after?: string;
}

export interface CaseStudyTesting {
  strategy: string;
  types: string[];
  coverage?: string;
  tools?: string[];
  notes?: string;
}

export interface CaseStudyDbField {
  name: string;
  type: string;
  key?: "pk" | "fk";
}

export interface CaseStudyDbEntity {
  name: string;
  fields: CaseStudyDbField[];
}

export interface CaseStudy {
  context: string;
  objectives: string[];
  techChoices: CaseStudyTechChoice[];
  timeline: CaseStudyTimeline[];
  challenges: CaseStudyChallenge[];
  impact: CaseStudyImpact[];
  learned: CaseStudyLearning[];
  alternatives?: CaseStudyAlternative[];
  optimizations?: CaseStudyOptimization[];
  testing?: CaseStudyTesting;
  wouldDoDifferently?: CaseStudyLearning[];
  dbSchema?: CaseStudyDbEntity[];
  screenshots?: { label: string; description: string }[];
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
    repo: "https://github.com/lamii21/HandyMath",
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
      alternatives: [
        {
          option: "Tesseract OCR (out-of-the-box, no preprocessing)",
          why: "Tesseract performs well on standard printed text but fails on mathematical notation (∫, Σ, √, fractions) without custom training data. Without preprocessing, recognition rate on math problems was too low to be useful.",
          chosen: "OpenCV for preprocessing (binarization, denoising, contour detection) fed into the OCR pipeline — domain-specific preparation before recognition rather than relying on a general-purpose model.",
        },
        {
          option: "SciPy / NumPy numerical solver",
          why: "Numerical solvers produce floating-point approximations — 0.33333... instead of 1/3, no intermediate steps. A student checking their work needs to see the algebraic transformations, not a decimal result.",
          chosen: "SymPy — symbolic computation that produces exact answers (1/3, √2, π) and step-by-step intermediate expressions that match what a student would write on paper.",
        },
        {
          option: "Firebase / Firestore (NoSQL)",
          why: "Firebase was fast to set up, but the progress tracking requirement is inherently relational: a user completes many exercises, each exercise has many attempts, each attempt has a score and a timestamp. Modeling that in a document store required denormalization that made queries awkward.",
          chosen: "Django REST with PostgreSQL — the ORM maps directly to the relational structure, and the Progress join table (user × exercise × attempt_count × score) became a natural, queryable entity.",
        },
        {
          option: "React Native (mobile-first for camera access)",
          why: "The camera integration is more natural on mobile. React Native was considered for direct camera access. Rejected because validating the OCR pipeline itself was the hard problem — adding mobile build complexity during development would have slowed that down.",
          chosen: "React web with a file upload / camera input — simpler to build and debug. The OCR pipeline was validated first; mobile is the logical next step.",
        },
      ],
      optimizations: [
        {
          title: "OCR preprocessing pipeline",
          description: "Raw camera images produced inconsistent recognition on mathematical symbols. Added adaptive thresholding (not fixed threshold — adjusts per image region), Gaussian blur to reduce noise, and morphological operations to close gaps in symbol contours.",
          before: "~60–70% recognition accuracy on printed problems, significantly lower on handwritten",
          after: "~85–90% on printed input with the full preprocessing pipeline; handwritten improved but remains harder",
        },
        {
          title: "Three.js renderer lifecycle hook",
          description: "The initial Three.js integration created a new WebGLRenderer on every React render cycle, leaking GPU memory when navigating between exercises. Extracted into a custom useEffect hook that creates the renderer once, updates the scene on function change, and disposes renderer + geometry on unmount.",
          before: "WebGLRenderer instances not disposed — GPU memory leak on navigation",
          after: "Clean lifecycle — single renderer per component mount, fully disposed on unmount",
        },
        {
          title: "Progress data model v2",
          description: "Version 1 stored progress state as a field on the Exercise model — wrong cardinality. Rebuilt as a dedicated Progress join table between User and Exercise, with attempt_count, score, and completed_at as first-class fields. Queries for 'all exercises for user X' and 'completion rate per topic' became natural SQL joins.",
          before: "Progress state on Exercise model — one row per exercise, no per-user state, impossible to track multiple attempts",
          after: "Progress(user_id, exercise_id, score, attempt_count, completed_at) — correct cardinality, clean queries, per-user per-exercise tracking",
        },
      ],
      testing: {
        strategy: "Manual end-to-end testing of the OCR pipeline against a curated equation test set. Django REST Framework tests for API endpoint correctness. Manual UI testing across the exercise and progress flows.",
        types: ["Manual OCR (curated equation test set)", "Django REST Framework API tests", "Manual UI flow testing"],
        coverage: "À compléter — formal coverage percentages not tracked per module",
        tools: ["Django REST Framework test client", "pytest", "Manual browser testing"],
        notes: "OCR was tested against a set of handwritten and printed equations ranging from simple arithmetic to integrals and fractions. Edge cases discovered iteratively: symbol recognition improved through preprocessing tuning rather than model retraining.",
      },
      wouldDoDifferently: [
        {
          title: "Start with a constrained math subset.",
          body: "Building OCR for the full range of mathematical notation from day one was too ambitious. Starting with basic algebra only — single variable, integer coefficients — would have let me validate the full pipeline (OCR → parse → solve → display) faster. Add integral and differential notation in a second pass.",
        },
        {
          title: "Add asynchronous task processing from the start.",
          body: "OCR and SymPy solving are both synchronous operations that block the request thread. For a classroom with concurrent students, this would create visible latency. I would add Celery with a Redis broker from the beginning — not as a later optimization.",
        },
        {
          title: "Write OCR tests before the pipeline.",
          body: "I wrote tests retroactively — after the OCR was working — which means they tested existing behavior rather than specified behavior. Test-first would have caught symbol dictionary gaps earlier and made the preprocessing tuning more systematic.",
        },
      ],
      dbSchema: [
        {
          name: "User",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "email", type: "VARCHAR(255)" },
            { name: "password_hash", type: "VARCHAR(255)" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
        {
          name: "Exercise",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "topic", type: "VARCHAR(100)" },
            { name: "difficulty", type: "SMALLINT" },
            { name: "equation_raw", type: "TEXT" },
            { name: "solution_steps", type: "JSONB" },
          ],
        },
        {
          name: "Progress",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "user_id", type: "UUID", key: "fk" },
            { name: "exercise_id", type: "UUID", key: "fk" },
            { name: "score", type: "SMALLINT" },
            { name: "attempt_count", type: "INTEGER" },
            { name: "completed_at", type: "TIMESTAMP" },
          ],
        },
        {
          name: "SolverLog",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "exercise_id", type: "UUID", key: "fk" },
            { name: "raw_ocr_text", type: "TEXT" },
            { name: "parsed_expr", type: "TEXT" },
            { name: "solver_output", type: "JSONB" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
      ],
      screenshots: [
        {
          label: "OCR capture flow",
          description: "Student photographs handwritten equation → system shows the parsed expression for confirmation before solving — catches misreadings before they reach SymPy",
        },
        {
          label: "Step-by-step solver UI",
          description: "SymPy solution rendered as sequential algebraic transformations — each intermediate step visible, formatted to match what a student would write on paper",
        },
        {
          label: "Three.js 3D function graph",
          description: "Mathematical function rendered as an interactive 3D surface — student can rotate, zoom, and inspect the graph to understand geometric behavior",
        },
        {
          label: "Progress dashboard",
          description: "Per-topic completion rate, recent exercise history, difficulty progression over time — derived from the Progress join table",
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
    repo: "https://github.com/lamii21/RH",
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
      alternatives: [
        {
          option: "MongoDB / NoSQL for HR data",
          why: "HR data is deeply relational: employees belong to departments, departments have managers, leave requests have approvers, candidates apply to postings. Modeling these relationships in documents requires denormalization and loses referential integrity.",
          chosen: "PostgreSQL — relational schema where foreign keys and joins model HR relationships naturally, and row-level security enforces tenant isolation at the database engine level.",
        },
        {
          option: "Single-tenant architecture (one DB per client)",
          why: "One database per client is operationally expensive at scale — schema migrations require running against N databases, monitoring multiplies, and the deployment pipeline grows with each new client.",
          chosen: "Multi-tenant with row-level security from day one. Every table has an org_id column; PostgreSQL RLS ensures every query is automatically scoped to the requesting tenant without application-level filtering.",
        },
        {
          option: "Next.js SSR for the dashboard",
          why: "Next.js would add SSR complexity to a dashboard that is entirely authenticated and user-specific. SEO is irrelevant for HR management dashboards — all content is behind a login.",
          chosen: "React SPA with JWT authentication — no SSR overhead for content that is entirely behind authentication. Client-side routing handles the multi-role view switching.",
        },
        {
          option: "Dedicated ML microservice (separate Python service)",
          why: "A separate service for the AI scoring would require inter-service communication (HTTP or message queue), additional deployment complexity, and network latency on every recruitment scoring call.",
          chosen: "Embedded Python AI module within the Django backend — same process, no network hop, simpler deployment at this scale.",
        },
      ],
      optimizations: [
        {
          title: "Index on org_id for all RLS-scoped tables",
          description: "Row-level security policies filter every query by org_id. Without an index, each query scans the full table before applying the RLS filter. Adding a B-tree index on org_id across all tenant-scoped tables ensures the RLS predicate is evaluated on the index, not the full table.",
          before: "Full table scan on every RLS-filtered query — linear cost as tenant data grows",
          after: "Index scan on org_id — constant-time tenant scoping regardless of total row count",
        },
        {
          title: "Eager loading for HR dashboard aggregates",
          description: "The executive dashboard showed headcount, department breakdown, leave pipeline, and open positions. Early version made a separate query per metric — 8 queries per page load. Consolidated into 3 aggregate queries using Django's annotate() and values().",
          before: "8 separate database queries per dashboard page load",
          after: "3 aggregate queries covering the same data — reduced DB round-trips, faster page paint",
        },
        {
          title: "JWT role claim — no extra DB lookup per request",
          description: "Early version fetched the user's role from the database on every authenticated request to determine RBAC permissions. Moved the role into the JWT payload at login — the API reads role from the token, not the database.",
          before: "Extra database query per authenticated request to fetch user role",
          after: "Role read from JWT token — zero extra DB lookup, stateless authorization",
        },
      ],
      testing: {
        strategy: "Django REST Framework tests for API endpoints with RBAC coverage. Manual multi-tenant isolation testing — verifying that authenticated requests from Tenant A never return data from Tenant B under any conditions.",
        types: ["API endpoint tests (DRF)", "Multi-tenant isolation tests", "RBAC permission coverage", "Manual UI testing"],
        coverage: "À compléter — formal test coverage percentages not tracked",
        tools: ["Django REST Framework test client", "pytest", "Manual browser testing"],
        notes: "Multi-tenant isolation was tested by creating two organizations with overlapping employee names and verifying that no cross-tenant data appeared in any API response. Every RBAC-restricted endpoint was tested with tokens for all three roles (HR manager, line manager, employee).",
      },
      wouldDoDifferently: [
        {
          title: "Build a single-tenant MVP first.",
          body: "Multi-tenancy is the right architecture, but it added complexity to every layer from day one. A single-tenant version with correct HR data modeling would have been faster to validate. Adding multi-tenancy in a second phase — once the core HR flows were proven — would have been cleaner.",
        },
        {
          title: "Separate the AI scoring into its own service.",
          body: "Embedding the AI module in the Django backend was fast to build, but it creates a tight coupling between the scoring model and the API release cycle. A dedicated FastAPI service for AI scoring would let the model be updated independently of the rest of the platform.",
        },
        {
          title: "Add Playwright E2E tests from the start.",
          body: "Manual testing of multi-role views was time-consuming and error-prone. Playwright tests asserting that the HR manager view shows leave approvals, the employee view does not, and the line manager view shows only their team — written once and run on every change.",
        },
      ],
      dbSchema: [
        {
          name: "Organization",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "name", type: "VARCHAR(200)" },
            { name: "plan_type", type: "VARCHAR(50)" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
        {
          name: "User",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "org_id", type: "UUID", key: "fk" },
            { name: "email", type: "VARCHAR(255)" },
            { name: "role", type: "VARCHAR(50)" },
            { name: "is_active", type: "BOOLEAN" },
          ],
        },
        {
          name: "Employee",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "org_id", type: "UUID", key: "fk" },
            { name: "user_id", type: "UUID", key: "fk" },
            { name: "department_id", type: "UUID", key: "fk" },
            { name: "contract_type", type: "VARCHAR(50)" },
            { name: "start_date", type: "DATE" },
          ],
        },
        {
          name: "LeaveRequest",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "employee_id", type: "UUID", key: "fk" },
            { name: "start_date", type: "DATE" },
            { name: "end_date", type: "DATE" },
            { name: "status", type: "VARCHAR(50)" },
            { name: "approver_id", type: "UUID", key: "fk" },
          ],
        },
        {
          name: "Candidate",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "org_id", type: "UUID", key: "fk" },
            { name: "cv_path", type: "TEXT" },
            { name: "extracted_skills", type: "JSONB" },
            { name: "overall_score", type: "NUMERIC(5,2)" },
            { name: "status", type: "VARCHAR(50)" },
          ],
        },
      ],
      screenshots: [
        {
          label: "HR Manager Dashboard",
          description: "Headcount overview, leave pipeline, open positions, recruitment funnel — all derived from live PostgreSQL aggregates",
        },
        {
          label: "AI Recruitment Panel",
          description: "Ranked candidate list with score chips — each candidate expandable to show per-dimension score breakdown (technical skills, experience level, domain match)",
        },
        {
          label: "Employee Profile View",
          description: "Contract details, leave history, department assignment, manager chain — role-scoped: employees see their own data, managers see their team",
        },
        {
          label: "Leave Approval Workflow",
          description: "Request creation → manager review → approval/rejection — status tracked in LeaveRequest table, visible across all role views simultaneously",
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
    repo: "https://github.com/lamii21/RecrutAI",
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
      alternatives: [
        {
          option: "Fine-tuned BERT for named entity recognition",
          why: "BERT-based NER achieves higher accuracy on skill extraction but requires GPU inference infrastructure and significant training time. For a v1 that needs to demonstrate the concept, the latency and infrastructure cost are not justified.",
          chosen: "spaCy NER with a custom skill entity matcher — faster inference, no GPU required, accuracy sufficient for the explainability goal.",
        },
        {
          option: "Regex-based skill matching",
          why: "Regex matching on skill keywords fails on synonyms and abbreviations. 'JS', 'JavaScript', and 'ES6' are the same skill family but have zero string overlap. A regex approach requires manually maintaining thousands of patterns.",
          chosen: "NLP normalization layer that maps surface variants to canonical skill names — iteratively built from real CV data.",
        },
        {
          option: "Django REST for the ML API",
          why: "Django REST is heavier than needed for an API layer that simply wraps a Python ML pipeline. The synchronous request handling would block on model inference.",
          chosen: "FastAPI — async handlers, automatic OpenAPI docs, and native Pydantic integration for request/response validation.",
        },
        {
          option: "Single aggregate score (black box)",
          why: "A single score hides the reasoning. HR reviewers rejected the prototype because they couldn't understand why a candidate ranked 4th — they needed to see which dimensions drove the score.",
          chosen: "Multi-dimensional score breakdown: technical skill match, experience level alignment, domain relevance — all visible per candidate in the dashboard.",
        },
      ],
      optimizations: [
        {
          title: "CV text extraction caching",
          description: "Parsing a PDF or DOCX to extract text is the most expensive step in the pipeline. The same CV file submitted to multiple job postings was being re-parsed each time. Added a content hash cache — if the same file is submitted again, text extraction is skipped and the cached result is used.",
          before: "Full PDF/DOCX parse on every submission — even re-submissions of the same file",
          after: "Cache hit on re-submission — text extraction skipped, only scoring recomputed",
        },
        {
          title: "Batch CV processing",
          description: "When a recruiter uploads 20+ CVs at once, processing them sequentially blocks the API response. Moved to async batch processing: upload returns immediately with a job ID, processing runs in the background, dashboard polls for completion.",
          before: "Sequential processing — API blocked until all CVs scored, timeout risk on large batches",
          after: "Async batch — immediate response, background scoring, dashboard updates as results arrive",
        },
        {
          title: "NLP normalization dictionary",
          description: "Skill extraction accuracy improved significantly as the normalization dictionary grew. Started with 50 canonical skills, expanded to 200+ through iterative testing on real CVs. Each alias maps to a canonical form — 'ReactJS', 'React.js', 'React' all map to 'React'.",
          before: "50 canonical skills — many real-world CV variants unrecognized",
          after: "200+ canonical skills with full alias coverage — À compléter with exact counts",
        },
      ],
      testing: {
        strategy: "Manual end-to-end testing with a curated set of CVs with known expected skill extractions. NLP normalization tested with variant skill forms. FastAPI endpoint tests for scoring API correctness.",
        types: ["Manual CV test set (known-skill CVs)", "NLP normalization coverage (variant forms)", "FastAPI API endpoint tests"],
        coverage: "À compléter — formal coverage percentages not tracked",
        tools: ["FastAPI TestClient", "pytest", "Manual verification against expected extractions"],
        notes: "NLP pipeline was tested by feeding CVs with known skills and verifying extracted skill lists matched. Normalization was tested with variant forms of the same skill: 'JS', 'JavaScript', 'ES6', 'Node.js' — verifying canonical mapping.",
      },
      wouldDoDifferently: [
        {
          title: "Use sentence embeddings instead of keyword NLP.",
          body: "The keyword normalization approach works but requires manually maintaining a synonym dictionary. Vector embeddings (sentence-transformers) would capture semantic similarity automatically — 'proficient in React' and 'React developer' would match without needing a rule.",
        },
        {
          title: "Add a recruiter feedback loop.",
          body: "The model ranking is only as good as its definition of 'match'. Building in a way for HR reviewers to rate the ranking quality — 'this candidate was actually a good hire' — and using that feedback to improve the model would make it substantially more useful over time.",
        },
        {
          title: "Start with a specific domain (tech CVs only).",
          body: "A general-purpose CV parser faces enormous variation in format and terminology. Starting with only software engineering CVs would have produced a tighter normalization dictionary, cleaner extraction, and more useful skills scoring — before generalizing to other domains.",
        },
      ],
      dbSchema: [
        {
          name: "JobPosting",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "org_id", type: "UUID" },
            { name: "title", type: "VARCHAR(200)" },
            { name: "required_skills", type: "JSONB" },
            { name: "experience_level", type: "VARCHAR(50)" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
        {
          name: "Candidate",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "posting_id", type: "UUID", key: "fk" },
            { name: "cv_text", type: "TEXT" },
            { name: "extracted_skills", type: "JSONB" },
            { name: "overall_score", type: "NUMERIC(5,2)" },
            { name: "rank", type: "INTEGER" },
          ],
        },
        {
          name: "MatchResult",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "candidate_id", type: "UUID", key: "fk" },
            { name: "posting_id", type: "UUID", key: "fk" },
            { name: "score_breakdown", type: "JSONB" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
      ],
      screenshots: [
        {
          label: "HR Dashboard — Ranked Candidates",
          description: "Sorted candidate list with score chips per applicant — filterable by skill, score threshold, experience level",
        },
        {
          label: "Candidate Score Breakdown",
          description: "Per-dimension score bars: technical skills match, experience level alignment, domain relevance — visible for each candidate profile",
        },
        {
          label: "CV Upload & Processing",
          description: "Drag-and-drop CV upload (PDF/DOCX), real-time extraction status indicator, skill list preview before scoring",
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
    repo: "https://github.com/lamii21/OrderHub",
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
      alternatives: [
        {
          option: "Zapier / Make (no-code automation)",
          why: "No-code tools abstract the retry logic, error handling, and payload validation — but they also hide it. When a Zapier workflow fails silently, diagnosing it requires reading Zapier's logs rather than own code. The cost scales with order volume.",
          chosen: "Custom Express.js webhook with explicit retry logic, Supabase fallback, and full control over failure modes — instrumented with own logging.",
        },
        {
          option: "Google Sheets API v4 (direct REST calls)",
          why: "The Sheets API requires OAuth2 with a service account, token refresh logic, and rate-limit handling. GAS runs inside Google's infrastructure with direct Sheets access — no OAuth flow to maintain.",
          chosen: "Google Apps Script as the Sheets bridge — simpler, no OAuth management, sufficient for this write volume.",
        },
        {
          option: "Next.js API routes for the webhook (instead of Express.js)",
          why: "Next.js API routes would co-locate the webhook handler with the storefront — simpler deployment. Rejected because the webhook handler needs to be independently deployable and scalable, and the long-running retry logic doesn't fit Next.js's serverless function model.",
          chosen: "Express.js as a dedicated webhook service — independently deployable, long-running process model, full control over retry behavior.",
        },
        {
          option: "Supabase real-time subscriptions for Sheets sync (instead of webhooks)",
          why: "Supabase real-time would trigger the GAS call from the database event, not the application layer. Harder to add retry logic and payload validation at the database event level.",
          chosen: "Application-level webhook: validate → persist → sync, in that order, with retry on the sync step.",
        },
      ],
      optimizations: [
        {
          title: "Persist-before-sync for reliability",
          description: "The order is written to Supabase before the Google Sheets sync is attempted. If the GAS endpoint is unavailable, the order is not lost — it's in the database and the sync can be retried from there. This is the single most important reliability decision in the architecture.",
          before: "Sync-first approach — if GAS call fails, order data is nowhere",
          after: "Persist first — order always in Supabase, sync is a best-effort operation with retry",
        },
        {
          title: "Batch sync for high-frequency periods",
          description: "Google Apps Script has daily execution quotas. During a sale event with high order volume, individual GAS calls per order could exhaust the quota before end of day. Implemented accumulation window: under low load, orders sync individually; during bursts, orders batch and sync together in a single GAS call.",
          before: "One GAS call per order — quota risk during high-volume events",
          after: "Batch accumulation under burst conditions — single GAS call for multiple orders, quota preserved",
        },
        {
          title: "Retry with exponential backoff",
          description: "GAS calls can fail transiently. Initial implementation retried immediately — hitting the same transient error. Changed to exponential backoff: 1s → 2s → 4s → 8s, up to 3 retries before marking the event as failed and logging for manual resolution.",
          before: "Immediate retry — repeated failures during the same transient error window",
          after: "Exponential backoff — retries spread across the error recovery window",
        },
      ],
      testing: {
        strategy: "End-to-end flow testing: place an order → verify Supabase row → verify Google Sheets row appears. Failure simulation: disconnect GAS endpoint and verify orders remain in Supabase with failed sync status.",
        types: ["E2E order-to-sheet flow", "Webhook failure simulation", "Retry logic verification", "Manual Sheets row format verification"],
        coverage: "À compléter — automated test coverage not measured",
        tools: ["Express.js test client", "Manual order placement + Sheets inspection", "Supabase dashboard for order verification"],
        notes: "Failure scenarios tested by intentionally disconnecting the GAS endpoint and verifying: (1) orders persisted in Supabase, (2) retry logic re-attempted with backoff, (3) sheet row eventually appeared after reconnection.",
      },
      wouldDoDifferently: [
        {
          title: "Use a proper job queue (Bull/BullMQ) for retry logic.",
          body: "The in-memory retry logic works but doesn't survive process restarts. A Bull queue backed by Redis would persist retry jobs across restarts, provide a UI for monitoring failed jobs, and handle concurrency safely. The right infrastructure for production webhook processing.",
        },
        {
          title: "Add a dead letter queue for permanently failed syncs.",
          body: "After N retries, the sync attempt is currently logged and abandoned. A dead letter queue — and an admin UI to view and replay failed syncs — would make the system observable and recoverable without manual database queries.",
        },
        {
          title: "Add order analytics from the start.",
          body: "The data is all in Supabase. Revenue by day, product performance, average order value — all derivable from the orders table. The dashboard was built for order status only; analytics was deferred and never added.",
        },
      ],
      dbSchema: [
        {
          name: "Product",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "name", type: "VARCHAR(200)" },
            { name: "price", type: "NUMERIC(10,2)" },
            { name: "stock", type: "INTEGER" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
        {
          name: "Order",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "customer_name", type: "VARCHAR(200)" },
            { name: "customer_email", type: "VARCHAR(255)" },
            { name: "total", type: "NUMERIC(10,2)" },
            { name: "status", type: "VARCHAR(50)" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
        {
          name: "OrderItem",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "order_id", type: "UUID", key: "fk" },
            { name: "product_id", type: "UUID", key: "fk" },
            { name: "quantity", type: "INTEGER" },
            { name: "unit_price", type: "NUMERIC(10,2)" },
          ],
        },
        {
          name: "WebhookEvent",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "order_id", type: "UUID", key: "fk" },
            { name: "sync_status", type: "VARCHAR(50)" },
            { name: "attempts", type: "INTEGER" },
            { name: "last_attempted_at", type: "TIMESTAMP" },
          ],
        },
      ],
      screenshots: [
        {
          label: "Next.js Storefront — Product Catalog",
          description: "Product grid with color, price, stock indicator — SSR for initial load, client-side cart management",
        },
        {
          label: "Cart & Checkout Flow",
          description: "Multi-step checkout: cart summary → customer details → order confirmation — triggers webhook on submission",
        },
        {
          label: "Google Sheets — Live Sync",
          description: "Operations sheet with new order row appearing automatically within seconds of placement — matching the team's existing column format exactly",
        },
        {
          label: "Admin Dashboard — Order Status",
          description: "Order list with status chips and sync state indicator — shows which orders are synced to Sheets, which are pending, which failed",
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
    year: "2025",
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
    repo: "https://github.com/lamii21/FlowForge-ETL",
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
      alternatives: [
        {
          option: "pandas.read_excel() (out-of-the-box)",
          why: "pandas.read_excel() works on well-structured Excel files. The Yazaki BOM files had merged cells spanning multiple columns, shifted header rows, and custom indentation to encode BOM hierarchy — none of which pandas.read_excel() handles correctly without manual preprocessing.",
          chosen: "openpyxl for cell-level access — read the raw cell grid, detect format variant, then parse with explicit logic per variant.",
        },
        {
          option: "Apache Airflow for scheduling",
          why: "Airflow is the standard for production ETL scheduling, but it requires a separate server, a metadata database, and operational overhead not justified for a single-pipeline weekly job.",
          chosen: "Custom Python script with scheduled execution — simpler, no infrastructure overhead at this scale.",
        },
        {
          option: "SQLite for persistence",
          why: "SQLite is file-based and requires no server. Rejected because the manufacturing team's downstream tools (Power BI, existing reporting scripts) expected a connectable database, not a file.",
          chosen: "SQLAlchemy with a proper database backend — clean ORM interface, standard connection string for downstream tools.",
        },
        {
          option: "Power BI direct connector (no FastAPI layer)",
          why: "Power BI can connect directly to Excel or a database without a FastAPI intermediary. But the FastAPI layer provides a clean, versioned API contract for any future downstream consumer — not just Power BI.",
          chosen: "FastAPI as an intermediary — any tool can consume the clean data through a standard HTTP API, not just the current visualization tool.",
        },
      ],
      optimizations: [
        {
          title: "Format detection before full parse — fail fast",
          description: "The v1 parser assumed all files had the same format. It would process a file completely before detecting that the output was wrong. v2 detects the format variant in the first 20 rows before attempting a full parse. Unknown formats are rejected immediately with a clear error rather than silently producing wrong output.",
          before: "Full parse before format check — wrong output discovered after processing",
          after: "Format detection in first 20 rows — reject unknown formats before any data processing",
        },
        {
          title: "openpyxl read-only (streaming) mode for large files",
          description: "Loading large Excel files into memory with openpyxl's default mode was slow and memory-intensive. Switched to read_only mode (streaming) for the initial format detection pass — reads cells without loading the entire file into memory.",
          before: "Full file load into memory for format detection — slow on large BOM files",
          after: "Streaming read for format detection — low memory overhead, faster first-row inspection",
        },
        {
          title: "Output schema validation before FastAPI exposure",
          description: "Added a Pydantic validation step between the Pandas transform and the FastAPI endpoint. If the transformed output doesn't match the expected BomRecord schema, the pipeline fails loudly before any consumer sees wrong data.",
          before: "No output validation — malformed data could reach FastAPI consumers",
          after: "Pydantic schema check before exposure — invalid output caught at the pipeline boundary",
        },
      ],
      testing: {
        strategy: "Full regression testing against the production archive: every historical BOM file run through the v2 pipeline and output verified. Edge case catalogue built from v1 failure modes — each failure became a named test case.",
        types: ["Full archive regression (all historical files)", "Edge case catalogue from v1 failures", "FastAPI endpoint tests", "Output schema validation tests"],
        coverage: "100% of known production file format variants handled after v2",
        tools: ["pytest", "FastAPI TestClient", "Manual output comparison against expected BOM structure"],
        notes: "The v1 failure mode catalogue was the most valuable testing artifact. Each formatting variant that broke v1 was documented, named, and turned into a specific test case. v2 was built against these test cases, not discovered from them.",
      },
      wouldDoDifferently: [
        {
          title: "Run the full archive against the parser before shipping v1.",
          body: "v1 was built and tested on a small sample of 'nice' files. Running it against the full production archive before declaring it complete would have caught the formatting variants immediately — before they caused a silent failure in production. Test breadth over test depth for a parser.",
        },
        {
          title: "Build the format detector as a standalone module with its own tests.",
          body: "The format detector was embedded in the parser in v1. Extracting it into a separate module with its own test suite would have made it easier to add new format variants incrementally — and would have prevented the detector from being accidentally coupled to the parsing logic.",
        },
        {
          title: "Write a format specification document with Yazaki engineering.",
          body: "The BOM file format was implicit knowledge in the manufacturing team's heads. A one-page document specifying the expected format variants, header row positions, and hierarchy encoding — reviewed and signed off by the engineering team — would have caught format assumptions before they became parser bugs.",
        },
      ],
      dbSchema: [
        {
          name: "BomRecord",
          fields: [
            { name: "id", type: "INTEGER", key: "pk" },
            { name: "part_number", type: "VARCHAR(100)" },
            { name: "description", type: "TEXT" },
            { name: "quantity", type: "NUMERIC(10,3)" },
            { name: "level", type: "INTEGER" },
            { name: "parent_id", type: "INTEGER", key: "fk" },
            { name: "file_source", type: "VARCHAR(255)" },
            { name: "processed_at", type: "TIMESTAMP" },
          ],
        },
        {
          name: "ProcessingLog",
          fields: [
            { name: "id", type: "INTEGER", key: "pk" },
            { name: "filename", type: "VARCHAR(255)" },
            { name: "format_variant", type: "VARCHAR(50)" },
            { name: "status", type: "VARCHAR(50)" },
            { name: "records_count", type: "INTEGER" },
            { name: "error_message", type: "TEXT" },
            { name: "processed_at", type: "TIMESTAMP" },
          ],
        },
      ],
      screenshots: [
        {
          label: "React Dashboard — BOM Hierarchy View",
          description: "Tree visualization of the assembly structure — top-level assembly expands to sub-assemblies, sub-assemblies expand to individual parts with quantities",
        },
        {
          label: "Processing Log",
          description: "Per-file processing status, format variant detected, record count, processing time, error message for failed files",
        },
        {
          label: "FastAPI — OpenAPI Documentation",
          description: "Auto-generated /docs endpoint showing all BOM API endpoints, request/response schemas, and example payloads",
        },
        {
          label: "Before/After — Weekly Processing Comparison",
          description: "8 hours of manual Excel work vs. 4 minutes of automated pipeline — the quantified impact of the automation",
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
    repo: "https://github.com/lamii21/HijabiShop",
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
      alternatives: [
        {
          option: "ML model for color recommendations (trained)",
          why: "Training an ML model for color recommendations requires labeled data: product pairs rated as 'good match' / 'bad match'. This data doesn't exist at launch. A model trained on generic color data wouldn't capture the domain-specific rules of modest fashion styling.",
          chosen: "Rule-based color theory: explicit logic for complementary, analogous, and neutral combinations. Transparent, explainable, and doesn't require training data. The rules can be updated by a stylist without retraining.",
        },
        {
          option: "Shopify (hosted e-commerce platform)",
          why: "Shopify would eliminate backend work, but it also eliminates control over the product data model. The color recommendation system requires color metadata (hue, tone, saturation) as first-class product attributes — Shopify's product model doesn't support this natively.",
          chosen: "Next.js with a custom PostgreSQL schema — full control over the product model, color attributes as first-class fields.",
        },
        {
          option: "Real-time recommendation computation (on page load)",
          why: "Computing color recommendations in real-time on every product page view would add latency proportional to the catalog size. As the catalog grows, page load time grows with it.",
          chosen: "Pre-computed recommendations at product creation: when a product is added, its compatible products are computed once and stored in a ColorCompatibility table. Page load is a simple index scan, not a computation.",
        },
        {
          option: "Supabase (instead of direct PostgreSQL)",
          why: "Supabase adds a hosted Postgres with a REST API and real-time capabilities. The real-time capability is not needed for a product catalog. Direct PostgreSQL gives more control over the color recommendation query.",
          chosen: "Direct PostgreSQL with full SQL control over color compatibility joins.",
        },
      ],
      optimizations: [
        {
          title: "Pre-computed color compatibility",
          description: "Color recommendations are computed once when a product is created and stored in the ColorCompatibility table. Every product page load reads from this table — no computation at request time. When a new product is added, its compatibility with the existing catalog is computed in the background.",
          before: "Real-time computation on page load — O(catalog size) computation per page view",
          after: "Pre-computed at product creation — O(1) lookup per page view, computation paid once",
        },
        {
          title: "SSR for product pages — SEO and first paint",
          description: "Product pages are server-rendered: complete HTML including product data and recommendations on the initial response. Search engine crawlers see full content. The first paint is a complete page, not a loading skeleton waiting for client-side data fetching.",
          before: "Client-side rendering — crawlers saw empty HTML, slower first meaningful paint",
          after: "SSR — crawlable HTML, faster first paint, recommendations included in initial payload",
        },
        {
          title: "Progressive disclosure for mobile recommendations",
          description: "The recommendation panel adds visual complexity that overwhelms small screens. Fashion e-commerce receives the majority of its traffic on mobile. Collapsed the recommendation panel by default on mobile; expanded on tap. Desktop shows it inline.",
          before: "Full recommendation panel shown on all screen sizes — overwhelming on mobile",
          after: "Progressive disclosure — collapsed on mobile, expanded on tap, inline on desktop",
        },
      ],
      testing: {
        strategy: "Manual color recommendation verification across product hue families. Checkout flow testing for cart state and order creation. Mobile responsive testing using browser DevTools emulation.",
        types: ["Manual color recommendation verification", "Checkout flow E2E", "Mobile responsive testing", "SSR output verification"],
        coverage: "À compléter — automated test coverage not measured",
        tools: ["Manual browser testing", "Chrome DevTools mobile emulation", "Next.js dev mode for SSR verification"],
        notes: "Color recommendations were manually verified for representative products across all hue families (warm rose, cool blue, neutral beige) and saturation levels. Each complementary, analogous, and neutral pairing rule was tested with at least one product.",
      },
      wouldDoDifferently: [
        {
          title: "Add payment processing from the start.",
          body: "The checkout flow ends without a real payment step — the order is created but no money moves. Integrating Stripe from the beginning would have made the platform actually usable for a real launch. Payment integration is harder to retrofit than to design in.",
        },
        {
          title: "Use vector similarity for recommendations.",
          body: "Rule-based color theory works but requires manually encoding fashion expertise. A product embedding model — where products are represented as vectors and recommendations are nearest neighbors — would capture more nuanced style relationships without requiring explicit rules.",
        },
        {
          title: "Add photography guidelines for product images.",
          body: "Fashion e-commerce lives or dies on image quality. The platform has no constraints on how product photos are taken — inconsistent lighting, backgrounds, and angles make the catalog look incoherent. A style guide for product photography would have been more impactful than the recommendation engine.",
        },
      ],
      dbSchema: [
        {
          name: "Product",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "name", type: "VARCHAR(200)" },
            { name: "price", type: "NUMERIC(10,2)" },
            { name: "stock", type: "INTEGER" },
            { name: "primary_hue", type: "VARCHAR(50)" },
            { name: "tone", type: "VARCHAR(20)" },
            { name: "saturation_level", type: "VARCHAR(20)" },
            { name: "category", type: "VARCHAR(100)" },
          ],
        },
        {
          name: "ColorCompatibility",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "product_id", type: "UUID", key: "fk" },
            { name: "recommended_id", type: "UUID", key: "fk" },
            { name: "compatibility_type", type: "VARCHAR(50)" },
          ],
        },
        {
          name: "Cart",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "session_id", type: "VARCHAR(255)" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
        {
          name: "Order",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "customer_email", type: "VARCHAR(255)" },
            { name: "total", type: "NUMERIC(10,2)" },
            { name: "status", type: "VARCHAR(50)" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
      ],
      screenshots: [
        {
          label: "Product Page with Color Recommendations",
          description: "Product detail with inline complementary product carousel — each recommended item shows its compatibility type (complementary / analogous / neutral)",
        },
        {
          label: "Mobile View — Progressive Disclosure",
          description: "Recommendation panel collapsed by default on mobile → expanded on tap — same content, context-appropriate presentation",
        },
        {
          label: "Cart & Checkout Flow",
          description: "Cart summary with product thumbnails → customer details form → order confirmation with order ID",
        },
        {
          label: "Admin — Product Management",
          description: "Product list with color attribute chips visible — hue, tone, saturation editable per product — recommendation preview on update",
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
      alternatives: [
        {
          option: "MySQL instead of SQL Server",
          why: "MySQL is open-source and would have reduced licensing cost. The client's Windows server had an existing SQL Server license and their hosting provider's support team knew SQL Server — switching would have created a support gap.",
          chosen: "SQL Server — consistent with the client's existing infrastructure and support capability.",
        },
        {
          option: "Django / Python backend",
          why: "Django would have been faster to build in. The client's IT contact was a .NET developer who would maintain the system after handoff — Python was unfamiliar to them.",
          chosen: "ASP.NET Core — technology the client's team could maintain and extend without external help.",
        },
        {
          option: "Desktop application (Windows Forms / WPF)",
          why: "A desktop app would have required installation on each device in the restaurant. The kitchen tablet, the owner's phone, and the cashier terminal all needed access — a web application is device-agnostic.",
          chosen: "Web application — accessible from any device on the restaurant's network without installation.",
        },
        {
          option: "Manual inventory decrement (application logic)",
          why: "Decrementing inventory in the application service layer (not the database) requires manually handling partial failures: what if the order is created but the inventory update fails? Two separate operations, possible inconsistency.",
          chosen: "Database transaction: Order creation + OrderLineItems + inventory decrement as a single atomic operation in EF Core. Either everything commits or nothing does.",
        },
      ],
      optimizations: [
        {
          title: "Atomic order creation via EF Core transaction",
          description: "The order creation flow involves three operations: create the Order row, create all OrderLineItem rows, and decrement the stock for each MenuItem. Wrapped in a single EF Core transaction — if any step fails, the entire operation rolls back. No partial orders, no phantom inventory decrements.",
          before: "Three separate database operations — partial failure possible, inventory inconsistency risk",
          after: "Single atomic transaction — all three operations commit together or not at all",
        },
        {
          title: "Date-range index for daily reports",
          description: "The daily revenue report queries all orders within a date range. Without an index on created_at, this is a full table scan that grows linearly as orders accumulate. Added a clustered index on created_at — report query time stays constant regardless of order history size.",
          before: "Full table scan for date-range report queries",
          after: "Clustered index scan on created_at — constant-time report generation",
        },
        {
          title: "Eager loading for order detail views",
          description: "Loading an order's detail view triggered N+1 queries: one query for the order, then one query per line item to fetch the MenuItem name. Used EF Core's Include() to eager-load the OrderLineItems with their MenuItems in a single JOIN query.",
          before: "N+1 queries per order detail view — 1 + (number of line items) queries",
          after: "Single JOIN query — one database round-trip for the complete order detail",
        },
      ],
      testing: {
        strategy: "Weekly client UAT sessions with working demos as the primary feedback loop. Manual testing of order flow, inventory decrement, and report generation. SQL query verification against known test data.",
        types: ["Weekly client UAT (User Acceptance Testing)", "Manual order → inventory flow", "Daily report total verification", "SQL constraint testing"],
        coverage: "À compléter — no automated test suite; client review was the primary validation mechanism",
        tools: ["Manual browser testing", "SQL Server Management Studio for data verification", "Weekly client demo sessions"],
        notes: "Requirements that emerged during client demo sessions (weekly inventory snapshots, table number field on orders, item availability toggle) were incorporated between sessions. Client demos were more valuable than upfront specification.",
      },
      wouldDoDifferently: [
        {
          title: "Add inventory reorder alerts.",
          body: "The system tracks stock levels but doesn't notify the owner when a menu item runs low. A simple threshold check on each inventory update — email or SMS when stock drops below a set level — would have been the most requested feature after handoff.",
        },
        {
          title: "Automate daily PDF report delivery.",
          body: "The daily revenue report is available in the dashboard but requires the owner to log in and export it manually. A scheduled task that emails the report at closing time would have eliminated the main remaining manual step.",
        },
        {
          title: "Write the API specification before building.",
          body: "Mid-project additions (table number, item availability, weekly snapshots) required schema migrations that would have been caught by an upfront API specification. A one-page data dictionary reviewed by the client before coding would have avoided the migration rewrites.",
        },
      ],
      dbSchema: [
        {
          name: "MenuItem",
          fields: [
            { name: "id", type: "INT", key: "pk" },
            { name: "name", type: "NVARCHAR(200)" },
            { name: "price", type: "DECIMAL(10,2)" },
            { name: "category", type: "NVARCHAR(100)" },
            { name: "current_stock", type: "INT" },
            { name: "is_available", type: "BIT" },
          ],
        },
        {
          name: "Order",
          fields: [
            { name: "id", type: "INT", key: "pk" },
            { name: "table_number", type: "INT" },
            { name: "created_at", type: "DATETIME" },
            { name: "total", type: "DECIMAL(10,2)" },
            { name: "status", type: "NVARCHAR(50)" },
          ],
        },
        {
          name: "OrderLineItem",
          fields: [
            { name: "id", type: "INT", key: "pk" },
            { name: "order_id", type: "INT", key: "fk" },
            { name: "menu_item_id", type: "INT", key: "fk" },
            { name: "quantity", type: "INT" },
            { name: "unit_price", type: "DECIMAL(10,2)" },
          ],
        },
        {
          name: "InventoryLog",
          fields: [
            { name: "id", type: "INT", key: "pk" },
            { name: "menu_item_id", type: "INT", key: "fk" },
            { name: "change_quantity", type: "INT" },
            { name: "reason", type: "NVARCHAR(100)" },
            { name: "recorded_at", type: "DATETIME" },
          ],
        },
      ],
      screenshots: [
        {
          label: "Order Entry — Waiter View",
          description: "Table number selector, menu item grid with availability indicators, running order total — one-tap item addition",
        },
        {
          label: "Inventory Dashboard",
          description: "Current stock per menu item, low-stock visual indicators, quick adjustment for manual stock corrections",
        },
        {
          label: "Daily Revenue Report",
          description: "Orders by hour, top-selling items, total revenue for the day — all queried from live Order data, no manual input",
        },
        {
          label: "Owner Admin Panel",
          description: "Menu management: add/edit/remove items, set price, toggle availability — changes reflect immediately in the waiter view",
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
      alternatives: [
        {
          option: "TypeORM instead of Prisma",
          why: "TypeORM is decorator-based and integrates closely with TypeScript class syntax. Prisma's schema-first approach with auto-generated types was cleaner for this project — the Prisma schema file became the single source of truth for both the database structure and the TypeScript types.",
          chosen: "Prisma — schema-first, auto-generated TypeScript client, cleaner migration workflow.",
        },
        {
          option: "Gatsby (static site generator)",
          why: "Gatsby would have been fast for static listing pages. But filtering requires either client-side data fetching on every filter change or rebuilding the entire site on each property update. Neither is acceptable for a live listing platform.",
          chosen: "Next.js — SSR for initial load (SEO + first paint), client-side filtering over already-loaded data.",
        },
        {
          option: "Server-side filtering (API call per filter change)",
          why: "Server-side filtering is the standard for large catalogs. For a family real-estate business with a small number of properties, fetching all listings once and filtering client-side produces faster interactive filtering with no additional API calls.",
          chosen: "Single full data load on page render, client-side filter over in-memory data — no API round-trips on filter change.",
        },
        {
          option: "Mapbox / Google Maps for property location",
          why: "A map view would be the most natural interface for property browsing. Rejected for v1 — the complexity of map integration was not justified before validating that the core listing + filtering flow was useful.",
          chosen: "Text-based listing with location zone as a filter — simpler, faster to build, map view planned for v2.",
        },
      ],
      optimizations: [
        {
          title: "Single data load + client-side filter",
          description: "All property listings are loaded on the initial SSR page render. Client-side filter state (zone, type, price range, surface area) operates over the already-loaded data — no additional API calls. For a catalog of this size, the single payload is faster than multiple filtered requests.",
          before: "Separate API call per filter combination — network round-trip on each filter change",
          after: "Single payload on load, instant client-side filter — no network requests after initial load",
        },
        {
          title: "URL query parameter filter state",
          description: "All active filters are reflected in the URL query string. Every filtered view is a unique URL — bookmarkable, shareable, and browser-back-navigable. The filter state is re-hydrated from the URL on page load.",
          before: "Filter state in React component state only — lost on navigation, not shareable",
          after: "Filter state in URL params — persistent, shareable, browser-history-integrated",
        },
        {
          title: "Next.js Image for property photos",
          description: "Property photos served through Next.js Image component — automatic format conversion (WebP/AVIF), lazy loading, and size optimization based on the viewport. Fashion e-commerce traffic is mobile-heavy; optimized images are critical for mobile performance.",
          before: "Raw <img> tags — no format optimization, no lazy loading, no size adaptation",
          after: "next/image — WebP/AVIF, lazy load, viewport-appropriate sizes",
        },
      ],
      testing: {
        strategy: "Manual verification of every filter combination and URL state persistence. SSR output verification to confirm crawlers receive complete HTML. Mobile responsive testing across screen sizes.",
        types: ["Manual filter combination testing", "URL state persistence verification", "SSR output verification", "Mobile responsive testing"],
        coverage: "À compléter — no automated test suite",
        tools: ["Manual browser testing", "Prisma Studio for data verification", "Chrome DevTools for responsive and SSR inspection"],
        notes: "Every filter combination (zone × type × surface area range × price range) was manually verified to produce correct results. URL state was tested by copying filter URLs and verifying they loaded the correct filtered view on a clean tab.",
      },
      wouldDoDifferently: [
        {
          title: "Add a map view from the start.",
          body: "Property location is the primary decision factor for real estate buyers. A map showing all available properties — with filter pins — would be more useful than a list with a zone dropdown. The map view was planned for v2 but never built.",
        },
        {
          title: "Use Prisma's full-text search for property descriptions.",
          body: "Filtering by zone, type, and price is useful but doesn't capture what buyers often search for: 'near school', 'quiet neighborhood', 'corner plot'. Full-text search on the property description field would have covered these cases.",
        },
        {
          title: "Add a property comparison feature.",
          body: "Buyers often narrow to 2-3 properties and need to compare surface area, price per m², and location side-by-side. A compare mode — select two properties, see them side-by-side — would have addressed the most common post-filter action.",
        },
      ],
      dbSchema: [
        {
          name: "Zone",
          fields: [
            { name: "id", type: "INT", key: "pk" },
            { name: "name", type: "VARCHAR(100)" },
            { name: "governorate", type: "VARCHAR(100)" },
          ],
        },
        {
          name: "Property",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "title", type: "VARCHAR(255)" },
            { name: "surface_area", type: "NUMERIC(10,2)" },
            { name: "zone_id", type: "INT", key: "fk" },
            { name: "type", type: "VARCHAR(100)" },
            { name: "price", type: "NUMERIC(12,2)" },
            { name: "status", type: "VARCHAR(50)" },
            { name: "description", type: "TEXT" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
        {
          name: "PropertyImage",
          fields: [
            { name: "id", type: "UUID", key: "pk" },
            { name: "property_id", type: "UUID", key: "fk" },
            { name: "url", type: "TEXT" },
            { name: "display_order", type: "INTEGER" },
          ],
        },
      ],
      screenshots: [
        {
          label: "Property Listing Grid",
          description: "Filterable property cards — surface area, zone, type, and price visible at a glance as chips on each card",
        },
        {
          label: "Filter Panel",
          description: "Zone dropdown, property type selector, price range slider, surface area range — all reflected in the URL on change",
        },
        {
          label: "Property Detail Page",
          description: "Full description, photo gallery (next/image optimized), location zone, contact CTA — complete HTML on initial server render",
        },
        {
          label: "URL-reflected Filter State",
          description: "Browser address bar showing active filter params — ?zone=agdal&type=terrain&maxPrice=500000 — shareable and bookmarkable",
        },
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
    year: "2025",
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
