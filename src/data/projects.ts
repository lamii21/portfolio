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
  /** Full case study content */
  caseStudy?: CaseStudy;
}

// ── Projects ──────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: "handymath",
    title: "HandyMath",
    category: "Education · Full-Stack",
    year: "2023",
    featured: true,
    system:
      "A full-stack math education platform — React frontend, Django REST API, PostgreSQL. Designed the schema, built the API, and wrote the interface. Same engineer, every layer, four months to deployment.",
    seam:
      "I designed the data model, built the Django REST API, and built the React interface — the same mind made every layer, so the schema directly shaped the interaction patterns. No handoff friction.",
    outcome:
      "Solo build from concept to deployment in four months. Django backend, React frontend, PostgreSQL. Complete MVC architecture with authentication.",
    honest:
      "The first schema had no native place for session-based progress state. Real users revealed it the moment they tried to resume their work. I rebuilt the data model in week three — the second version was significantly cleaner, and the rebuild took two days.",
    tech: ["Django", "React", "PostgreSQL", "Python", "REST API"],
    repo: "https://github.com/lamii21",
    demo: null,
    metrics: "Solo build · 4 months · Full deployment",
    problem:
      "Students were disengaging because the system had no memory — no way to track where they left off, what difficulty matched their current state, or what they'd already mastered. The interface couldn't ask for what the database didn't model.",
    solution:
      "Designed the relational schema before writing any application code. Progress state, difficulty tracking, and session continuity are native to the data model — not added after the fact. The interface was built to express what the schema could give it.",
    architecture:
      "Django ORM → PostgreSQL (progress schema) → REST API → React context state; the schema shaped every UI interaction pattern from the start.",
    caseStudy: {
      context:
        "Year 2 at EMSI. I wanted to build something complete — not a tutorial project, not a template. A system where I made every decision: the schema, the API contract, the authentication strategy, the deployment. I chose education because progress tracking is a genuinely interesting relational modeling problem — the kind where the schema determines everything else.",
      objectives: [
        "Design a relational schema where progress state is native, not retrofitted",
        "Build a Django REST API with authentication from scratch",
        "Build a React frontend that consumed the API without UI library shortcuts",
        "Deploy to production — not just localhost",
        "Write every layer as the same engineer, no handoffs",
      ],
      techChoices: [
        {
          name: "Django",
          reason:
            "Python backend with a strong ORM. The data modeling primitives — models, ForeignKey, ManyToMany — map directly to how I was thinking about the schema. Batteries included for auth, admin, and serialization.",
        },
        {
          name: "PostgreSQL",
          reason:
            "Relational by design. The right tool when your core problem is tracking relationships between users, exercises, and progress states across sessions. Not a document store, not a key-value store.",
        },
        {
          name: "React",
          reason:
            "The component model maps naturally to the exercise feedback cycle: render question, accept input, display result, advance state. One component per concern, composable without duplication.",
        },
        {
          name: "JWT Auth",
          reason:
            "Stateless, easier to reason about than session-based auth for a solo build. Token refresh handled in React context — one place, clearly owned, no implicit server state.",
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
          milestone: "Django REST API",
          duration: "Weeks 4–7",
          description:
            "Models, serializers, viewsets, JWT authentication endpoints. 15+ API endpoints covering users, exercises, progress tracking, and auth flows. Every endpoint tested before the frontend touched it.",
        },
        {
          milestone: "React Frontend",
          duration: "Weeks 8–12",
          description:
            "Built the interface to match what the API could give it — not the other way around. Exercise render, answer checking, progress display, session continuity.",
        },
        {
          milestone: "Schema Rebuild (v2)",
          duration: "Days 15–17",
          description:
            "Version 1 had progress state on the Exercise model — wrong cardinality. Rebuilt with a dedicated Progress join entity. Two days. Significantly cleaner queries for every access pattern.",
        },
        {
          milestone: "Production Deployment",
          duration: "Weeks 13–15",
          description:
            "First production deployment. Found a missing DATABASE_URL env var. Fixed it, documented every production requirement, redeployed. Django settings split into dev/prod configurations.",
        },
      ],
      challenges: [
        {
          title: "Schema for progress state",
          body: "Where does 'a student is 60% through topic X with 3 attempts' live in the database? Not on the Exercise model — that duplicates for every user. Not on the User model — that makes querying by exercise impossible. It needs its own entity with the right cardinality.",
          solution:
            "A Progress model as a join table between User and Exercise, with completion_date, score, and attempt_count. Version 1 had it wrong. The rebuild took two days and produced significantly cleaner queries — filtering by user, by exercise, or by completion status all became natural.",
        },
        {
          title: "Authentication moving parts",
          body: "JWT auth required coordinated moving parts: login endpoint, token generation, token validation middleware, token refresh endpoint, and protected route handling on the frontend. Each piece had to fit the others exactly.",
          solution:
            "Used DRF's SimpleJWT library for the backend. React context for token storage and refresh on the frontend. Separated auth logic from application logic cleanly — neither leaked into the other's domain.",
        },
        {
          title: "Development-to-production gap",
          body: "The application worked perfectly on localhost. First production deployment: the app couldn't connect to the database. A missing DATABASE_URL environment variable — invisible in development, immediately fatal in production.",
          solution:
            "Found it in 20 minutes, fixed it, then documented every environment variable required for a clean production deployment. This was the specific moment I understood why deployment is a skill, not a formality.",
        },
      ],
      impact: [
        {
          metric: "4 months",
          description: "Solo build from schema design to production deployment",
        },
        {
          metric: "15+ endpoints",
          description: "Authentication, exercises, progress tracking, users",
        },
        {
          metric: "3 layers",
          description: "Database, API, and interface — same engineer, every decision",
        },
      ],
      learned: [
        {
          title: "Schema first, always.",
          body: "The Progress entity wasn't obvious on day one. I found the right shape by designing the queries I needed to run, then working backward to the schema that made those queries natural. The interface was a consequence of the data model — not a driver of it.",
        },
        {
          title: "Production reveals what development hides.",
          body: "The missing env var wouldn't have mattered for another month of local development. Deploying early — even to a basic server — exposes the assumptions you didn't know you were making. I now deploy earlier in every project.",
        },
        {
          title: "Rebuilding is cheaper than avoiding it.",
          body: "Two days to rebuild a schema correctly is infinitely cheaper than months of workarounds on a wrong model. When the structure is wrong, fix the structure. The sunk cost of v1 doesn't make v1 the right answer.",
        },
      ],
    },
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
        "A real client: a restaurant owner managing orders and inventory on paper. Lost tickets, inaccurate stock counts, no daily revenue visibility. The project was client work — different from personal projects because the requirements came from a real business problem, not from my own curiosity about a technical challenge.",
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
            "Client requirement — their existing server infrastructure was Windows-based, and the hosting environment supported .NET natively. Stack choice was determined by the deployment target, not my preference.",
        },
        {
          name: "SQL Server",
          reason:
            "Standard for the .NET ecosystem, supported by the client's hosting provider. Robust relational database for the order management domain — transactions, constraints, cascade deletes.",
        },
        {
          name: "Entity Framework Core",
          reason:
            "Code-first migrations, type-safe queries, clean mapping between C# domain models and the database schema. The ORM pattern is the same as Django — different syntax, same mental model.",
        },
      ],
      timeline: [
        {
          milestone: "Domain Modeling",
          duration: "Weeks 1–2",
          description:
            "Requirements gathering and entity modeling. The restaurant domain has real relational complexity: orders contain line items, line items reference menu items, menu items have inventory quantities. The schema came from understanding this hierarchy.",
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
            "Built the interface the owner would actually use — order entry, inventory view, daily totals. Client review every week with a working demo, not slides.",
        },
        {
          milestone: "Client Feedback + Deployment",
          duration: "Week 8",
          description:
            "Incorporated client feedback from weekly reviews, then deployed to the client's server. Paper system retired the same day.",
        },
      ],
      challenges: [
        {
          title: "Working with a new tech stack",
          body: "C# and ASP.NET Core were new to me on this project. The client requirement determined the stack. I had to ship something working to a real client on a timeline — learning on the job wasn't optional.",
          solution:
            "Read the ASP.NET Core documentation systematically before writing any code. The pattern is similar to Django — models, DTOs, controllers/viewsets. Different syntax, recognizable architecture. Understanding the structure first, then writing code.",
        },
        {
          title: "Relational modeling for the restaurant domain",
          body: "A sale isn't just a transaction — it's an Order with OrderLineItems, each referencing a MenuItem with an associated InventoryItem. A sale should cascade: create the order, create the line items, decrement the inventory. All in one operation.",
          solution:
            "Modeled the full cascade as a database transaction with EF Core navigation properties. Either the full order is recorded with inventory decremented, or nothing is written. Atomicity guaranteed at the database level.",
        },
        {
          title: "Requirements that evolved mid-build",
          body: "Client requirements during a real project aren't a specification document — they evolve as the client sees what the software can do. Mid-build, the client realized they also needed weekly inventory snapshots, not just daily totals.",
          solution:
            "Weekly client reviews with a working demo. Seeing the actual software changes what the client thinks they need. More valuable than specifying everything on paper before writing code.",
        },
      ],
      impact: [
        {
          metric: "Live deployment",
          description: "Real client, paper system replaced entirely on day one",
        },
        {
          metric: "Real-time",
          description: "Inventory updated automatically on every order line item",
        },
        {
          metric: "One system",
          description: "Orders, inventory, and reporting in one database, zero transcription",
        },
      ],
      learned: [
        {
          title: "Client work requires a different kind of listening.",
          body: "The problem isn't mine to define — it's theirs. Understanding what they're doing with paper before designing the digital version changes what gets built. The interface should follow what they already know, not teach them a new mental model.",
        },
        {
          title: "A new stack is learnable if you read first.",
          body: "ASP.NET Core was new. Reading the documentation for the architectural pattern first — then writing code — meant I wasn't discovering the pattern through trial and error mid-project. Understanding before coding is the correct order.",
        },
        {
          title: "The domain model encodes the business logic.",
          body: "The order-to-inventory cascade isn't application code written in a service layer — it's an architectural property of the entity relationships and database transactions. Getting the schema right means getting the business logic right.",
        },
      ],
    },
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
    repo: "https://github.com/lamii21",
    demo: null,
    metrics: "Automated pipeline · Zero manual steps",
    problem:
      "Industrial datasets arrived as raw files requiring hours of manual cleaning before any analysis tool could read them reliably.",
    solution:
      "An automated pipeline that ingests, cleans, transforms, and exposes data via a FastAPI endpoint — any downstream tool connects once and always receives clean data.",
    architecture:
      "Python Pandas (transform) → SQLAlchemy (persistence) → FastAPI (consumption); each layer validated against the previous one before build.",
    caseStudy: {
      context:
        "A data engineering project built to solve a real problem I kept encountering: raw industrial datasets that required significant manual preparation before any analysis tool could read them. Built as a complete pipeline — not just a script, but a layered system with validation at each stage.",
      objectives: [
        "Automate the full ingestion → transformation → exposure cycle",
        "Zero manual steps between raw file and queryable output",
        "Validate each pipeline layer independently before moving to the next",
        "Make the output available to any downstream tool via a standard HTTP API",
      ],
      techChoices: [
        {
          name: "Pandas",
          reason:
            "The standard for tabular data transformation in Python. Battle-tested for exactly this kind of industrial data cleaning — dtype enforcement, missing value handling, column renaming, aggregations.",
        },
        {
          name: "FastAPI",
          reason:
            "Async by default, automatic OpenAPI documentation, fast to develop endpoints against. The right exposure layer when the consumer is another system, not a browser. Documented API means any tool can connect without guessing.",
        },
        {
          name: "SQLAlchemy",
          reason:
            "ORM that works across databases, type-safe queries, consistent with the ORM pattern I already knew from Django. The persistence layer shouldn't require a different mental model from the API layer.",
        },
      ],
      timeline: [
        {
          milestone: "Source Analysis",
          duration: "Week 1",
          description:
            "Analyzed the incoming file formats, identified schema inconsistencies, defined what 'clean' meant for this domain. The business rules, not just the column types.",
        },
        {
          milestone: "Ingestion + Validation",
          duration: "Week 2",
          description:
            "Built the ingestion layer with explicit schema validation: required columns, expected types, value ranges. Data that fails validation doesn't proceed to the transform layer.",
        },
        {
          milestone: "Transform Layer",
          duration: "Week 3",
          description:
            "Pandas cleaning logic — enforcing business rules, handling missing values, standardizing formats. Each rule a named function, each step testable independently.",
        },
        {
          milestone: "Persistence + API",
          duration: "Weeks 4–5",
          description:
            "SQLAlchemy persistence layer, then FastAPI endpoint with automatic documentation. Any downstream tool connects once and always receives clean data.",
        },
      ],
      challenges: [
        {
          title: "Inconsistent source file formats",
          body: "Industrial datasets don't arrive clean. The source files had inconsistent column naming, missing headers on some rows, and mixed numeric formats that Pandas couldn't parse without preprocessing.",
          solution:
            "Built a schema-based validator that checked required columns, expected types, and value ranges before allowing data to proceed. Files that failed validation were logged and rejected — they couldn't corrupt downstream results.",
        },
        {
          title: "Defining what 'clean' means",
          body: "Type casting is not data quality. The transform layer needed business rules — what values were valid for this sensor ID format, what timestamp range was realistic, what numeric bounds meant a reading was trustworthy.",
          solution:
            "Wrote explicit validation functions for each business rule, named clearly. The rules came from understanding the domain first — not just the schema. 'Clean' is always a domain definition, not a technical one.",
        },
        {
          title: "Layer-by-layer integration",
          body: "How do you know the ingestion layer worked correctly before building the transform on top of it? Cascading integration bugs — where a problem in layer 1 manifests as a confusing error in layer 3 — are harder to debug than isolated ones.",
          solution:
            "Validated ingestion output before building the transform. Validated transform output before building the API. Each layer had a working, verifiable state before the next was written.",
        },
      ],
      impact: [
        {
          metric: "0 manual steps",
          description: "Between raw input file and queryable FastAPI output",
        },
        {
          metric: "4 layers",
          description: "Ingest → validate → transform → expose, each independently verifiable",
        },
        {
          metric: "Any consumer",
          description: "FastAPI endpoint: scripts, dashboards, or models all connect the same way",
        },
      ],
      learned: [
        {
          title: "Data quality validation belongs in the pipeline.",
          body: "Not in the analysis tool downstream. Garbage in, garbage out — and the garbage becomes invisible if it gets past the ingestion layer without a validator catching it. Validate early, reject loudly.",
        },
        {
          title: "Layer-by-layer validation catches integration bugs.",
          body: "Building and verifying each layer before moving to the next keeps the integration surface small. When something breaks, you know exactly which layer introduced the problem — not which of five possible layers to start debugging.",
        },
        {
          title: "'Clean' is a business definition, not a technical one.",
          body: "The domain expert defines what clean means for this data. The code enforces it. Writing a validator without understanding the domain produces a technically valid but practically useless pipeline.",
        },
      ],
    },
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
        "A family business needed a proper online presence for their real-estate listings. The existing solution was a set of static HTML pages — no search, no filtering, no way to compare properties. The client was non-technical; the requirements came from watching how they used the current system and what they couldn't do with it.",
      objectives: [
        "Searchable, filterable property listings",
        "Fast initial page load for SEO — property listings benefit from being indexed",
        "Client-side filtering without full-page reloads",
        "URL-reflected filter state — every filtered view is bookmarkable and shareable",
      ],
      techChoices: [
        {
          name: "Next.js",
          reason:
            "SSR for the initial listing page — important for SEO in real estate. Properties need to appear in search results, not just in client-rendered HTML that crawlers can't parse.",
        },
        {
          name: "Prisma",
          reason:
            "Type-safe ORM with code-first schema definitions. The schema is defined in code, migrations are generated automatically, and the type system catches mismatches between the data model and the API at compile time.",
        },
        {
          name: "TypeScript",
          reason:
            "Caught prop mismatches between the API response shape and the component's expected props during development, not at runtime. The type errors were caught before the client saw them.",
        },
      ],
      timeline: [
        {
          milestone: "Domain Modeling",
          duration: "Week 1",
          description:
            "Prisma schema for property listings. Attributes came from real property descriptions: surface area, location zone, type (land/building), price, availability status.",
        },
        {
          milestone: "Next.js SSR",
          duration: "Weeks 2–3",
          description:
            "Server-rendered listing pages. Initial page load returns complete HTML — crawlable by search engines, fast for first paint, no loading state for the initial view.",
        },
        {
          milestone: "Client-Side Filtering",
          duration: "Week 4",
          description:
            "Filter state in URL query parameters — every filtered view is bookmarkable and shareable. Client-side filter logic runs without additional API calls after the initial load.",
        },
        {
          milestone: "UI + Client Review",
          duration: "Weeks 5–6",
          description:
            "Interface refinement with the client. Non-technical clients teach you what the software actually needs to do for them — not what you assumed it should do.",
        },
      ],
      challenges: [
        {
          title: "SSR vs. CSR split for filtering",
          body: "Property listings should be indexable (SSR for initial load), but filtering should be responsive (CSR without page reloads). Where does filter state live, and how does filtering work without triggering a full server round-trip on every change?",
          solution:
            "SSR for the initial full listing page. Filter state in URL query parameters — updated on the client. The client-side filter runs over the already-loaded data without re-fetching from the server.",
        },
        {
          title: "Property data model",
          body: "What makes a land parcel a real-estate listing? The client described properties using their own vocabulary — zone, titre foncier, superficie. The schema had to reflect real property attributes, not generic product fields.",
          solution:
            "Modeled the listing attributes based on actual property descriptions from the client. Surface area, location, zone type, price, availability status, long-form description. The schema reflects the domain, not a generic data model.",
        },
        {
          title: "TypeScript prop mismatches",
          body: "The Prisma-generated types and the component prop types diverged as I iterated on the schema. Without TypeScript, this would have been a runtime error visible only when the UI rendered.",
          solution:
            "TypeScript caught the mismatches at compile time. The type errors became a list of things to fix before the page would build — fixing them before the client saw the page is much cheaper than finding them after.",
        },
      ],
      impact: [
        {
          metric: "Live platform",
          description: "Real client, replaced static HTML pages entirely",
        },
        {
          metric: "Searchable",
          description: "Properties filterable by zone, type, surface area, price",
        },
        {
          metric: "Shareable",
          description: "Every filter state is a URL — bookmarkable, shareable, linkable",
        },
      ],
      learned: [
        {
          title: "SSR and CSR aren't a binary choice.",
          body: "The right answer is often both, for different reasons. SSR for the initial page load (SEO, first paint), CSR for interactivity (filtering without full reloads). The question is where each concern lives, not which one to use.",
        },
        {
          title: "Non-technical clients define the real requirements.",
          body: "The domain vocabulary the client used to describe properties — zone foncière, titre foncier, superficie — taught me what the schema needed to model. Their language is the specification. Read it before deciding on the schema.",
        },
        {
          title: "Prisma's schema-first approach is a clean design tool.",
          body: "Defining the schema in code, generating migrations automatically, getting type-safe queries from the same schema — it's a complete feedback loop. The schema is the design document for the whole application.",
        },
      ],
    },
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
    repo: "https://github.com/lamii21",
    demo: null,
    metrics: "8 hours → 4 minutes per week",
    problem:
      "BOM files from manufacturing systems arrived as complex, inconsistently-formatted Excel exports — ~8 hours of manual processing per week, prone to transcription errors.",
    solution:
      "A Python script that understands the manufacturing domain logic embedded in the file structure. Domain knowledge first, automation second.",
    architecture:
      "openpyxl (parsing) → pandas (transform logic) → Power BI output; defensive parsing built to handle every edge-case formatting variant encountered.",
    caseStudy: {
      context:
        "Industrial internship at Yazaki, a global automotive wire-harness manufacturer. The specific task: the manufacturing engineering team was spending approximately 8 hours every week manually processing Bill of Materials (BOM) data from Excel files exported by their production management system. The files were inconsistently formatted, and the team's process was manual — open Excel, copy-paste, reformat, send to the next person.",
      objectives: [
        "Automate the full BOM processing cycle — zero manual steps",
        "Handle all Excel formatting variants present in the production archive",
        "Produce output compatible with the team's existing Power BI dashboards",
        "Understand the manufacturing domain before writing any code",
      ],
      techChoices: [
        {
          name: "openpyxl",
          reason:
            "Direct Excel file access at the cell level. The BOM files had merged cells and formatting structures that pandas.read_excel() couldn't handle reliably — openpyxl let me inspect the raw cell structure before deciding how to parse each variant.",
        },
        {
          name: "Pandas",
          reason:
            "Once openpyxl extracted the raw structure, Pandas handled the transformation and restructuring. The right tool for tabular data manipulation after the hard parsing work is done.",
        },
        {
          name: "Power BI",
          reason:
            "The client's existing visualization infrastructure. Output format had to integrate with what the team already used — the goal was to replace the manual steps, not replace the workflow.",
        },
      ],
      timeline: [
        {
          milestone: "Domain Study",
          duration: "Days 1–4",
          description:
            "Read manufacturing documentation and talked to the engineers before writing any code. Understanding a BOM as a hierarchical structure — assemblies containing sub-assemblies containing parts — changed how I designed the parser.",
        },
        {
          milestone: "Parser v1 (happy path)",
          duration: "Days 5–7",
          description:
            "Built the first version assuming consistent formatting. Worked on the test files. Broke immediately on the first production file from the archive.",
        },
        {
          milestone: "Edge Case Discovery",
          duration: "Days 8–10",
          description:
            "Ran v1 against the full production archive. Catalogued every formatting variant: shifted header rows, merged cells, inconsistent column naming across software versions.",
        },
        {
          milestone: "Defensive Rewrite (v2)",
          duration: "Days 11–14",
          description:
            "Format detection first — identify the file's formatting variant before parsing. Defensive assumptions — check before trusting. Validation step — verify the output structure before it reaches Power BI.",
        },
        {
          milestone: "Testing + Handoff",
          duration: "Days 15–20",
          description:
            "Tested against the full archive. Documented every format variant and the detection logic. Handoff documentation so the team could understand what the parser was doing and why.",
        },
      ],
      challenges: [
        {
          title: "Inconsistent Excel formatting across software versions",
          body: "The BOM files had been generated by different versions of the production management software over several years. Merged cells, shifted header rows, inconsistent column naming — no two file vintages were formatted the same way. Version 1 broke on the first production file.",
          solution:
            "Enumerated every formatting variant in the archive, then built a format detector that identified which variant it was reading before attempting to parse. Each variant had its own parsing branch. Defensive parsing — check before assuming.",
        },
        {
          title: "Understanding BOM hierarchy",
          body: "A BOM is not a flat list of parts. It's a tree: assemblies contain sub-assemblies, sub-assemblies contain parts. A wire harness BOM for a car model has this hierarchy embedded in the Excel structure — indentation, level codes, group rows. Parsing it flat produces incorrect output.",
          solution:
            "Two days reading manufacturing documentation before writing code. Understanding the hierarchy changed the data structure I designed: a nested tree instead of a flat list. The domain knowledge made the parser correct, not just functional.",
        },
        {
          title: "Version 1 silently wrong on production files",
          body: "The test files I used for v1 all happened to use the same formatting vintage. Production files from earlier years had different structures. V1 worked on some of the archive and silently produced wrong output on the rest — no error, just wrong data.",
          solution:
            "Added explicit format detection, error logging for unknown formats, and a validation step that verified the output structure matched the expected schema before reaching Power BI. If the output didn't validate, the parser failed loudly rather than silently wrong.",
        },
      ],
      impact: [
        {
          metric: "8h → 4min",
          description: "Weekly BOM processing cycle, 99.2% time reduction",
        },
        {
          metric: "0 manual steps",
          description: "Between Excel export and Power BI dashboard update",
        },
        {
          metric: "100% archive",
          description: "All production file format variants handled after v2",
        },
      ],
      learned: [
        {
          title: "Domain knowledge is not optional.",
          body: "I couldn't have written a correct BOM parser without understanding what a BOM is — hierarchically — before reading a line of code. The two days reading manufacturing documentation before touching the editor is why the parser handled the hierarchy correctly.",
        },
        {
          title: "Test coverage based on examples is insufficient.",
          body: "The test files all used the same formatting vintage. Production data will always contain variants your test set doesn't. Building v1 was fast; discovering its failure modes cost more time than building it did.",
        },
        {
          title: "Defensive parsing is a discipline.",
          body: "Check format assumptions before trusting them. Log unknown formats loudly. Validate output structure before passing it downstream. Fail explicitly, not silently. This discipline — built into v2 — is why v2 handled every file in the archive.",
        },
      ],
    },
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
    repo: "https://github.com/lamii21",
    demo: null,
    problem:
      "A forecasting model without a transparent data pipeline produces outputs that can't be verified — the model and its inputs are equally important to understand.",
    solution:
      "An LSTM model paired with a clean, inspectable preprocessing pipeline. The focus was on understanding prediction boundaries, not chasing arbitrary accuracy targets.",
    architecture:
      "Pandas (preprocessing) → Keras LSTM → Matplotlib; pipeline clarity prioritized so every model input and output stays explainable.",
    caseStudy: {
      context:
        "An academic machine learning project exploring financial time-series forecasting. The goal wasn't a production trading model — it was understanding what makes a forecasting model trustworthy enough to inform decisions. The question I kept returning to: can I explain every transformation between the raw price data and the model's output?",
      objectives: [
        "Build an LSTM model for multi-step financial price forecasting",
        "Build a preprocessing pipeline that is transparent and inspectable at every step",
        "Prevent data leakage — test performance should be genuinely out-of-sample",
        "Understand prediction boundaries, not optimize for an arbitrary accuracy target",
      ],
      techChoices: [
        {
          name: "Keras / TensorFlow",
          reason:
            "High-level ML API that lets you define LSTM architecture clearly without losing visibility over the model structure. The layer-by-layer definition is explicit about what the network is doing — not a black box.",
        },
        {
          name: "Scikit-learn MinMaxScaler",
          reason:
            "Standard, well-documented normalization. Using it from sklearn rather than writing it manually meant inverse_transform() was available for converting predictions back to price space — no custom math required.",
        },
        {
          name: "Pandas",
          reason:
            "The preprocessing pipeline is entirely in Pandas — every transformation is a named step, inspectable at every stage. Transparency over raw performance. The pipeline is part of the analysis.",
        },
        {
          name: "Matplotlib",
          reason:
            "Kept the output explainable: actual vs. predicted overlay, confidence band, prediction boundary marker. The visualization is part of the analysis, not decoration.",
        },
      ],
      timeline: [
        {
          milestone: "Data Acquisition + Exploration",
          duration: "Week 1",
          description:
            "Downloaded historical price data, explored distributions, identified gaps and anomalies. Understanding what the raw data looks like before touching it.",
        },
        {
          milestone: "Preprocessing Pipeline",
          duration: "Week 2",
          description:
            "Pandas-based pipeline: missing value handling, feature engineering, MinMaxScaler fitted on training data only. Every step a named function, not an inline lambda.",
        },
        {
          milestone: "Sliding Window + Split",
          duration: "Week 3",
          description:
            "Constructed 60-timestep windows from the time series. Train/test split at a fixed point in time — no shuffling, no leakage between past and future.",
        },
        {
          milestone: "LSTM Architecture + Training",
          duration: "Week 4",
          description:
            "Two-layer LSTM with dropout. Trained on the training set, evaluated on the held-out test set. Tracked training and validation loss to identify overfitting.",
        },
        {
          milestone: "Window Size Exploration",
          duration: "Week 5",
          description:
            "Systematically explored window sizes from 20 to 90 timesteps on the validation set. Documented the decision at 60 timesteps with the supporting validation curves.",
        },
        {
          milestone: "Confidence Band + Visualization",
          duration: "Week 6",
          description:
            "Monte Carlo dropout: ran the model 100 times at inference with dropout active, used the spread of predictions as an uncertainty estimate. Visualized actual vs. predicted with confidence band.",
        },
      ],
      challenges: [
        {
          title: "Window size for LSTM sequences",
          body: "Too small a window and the LSTM can't capture long-range dependencies. Too large and it overfits to noise. There's no theoretically correct answer — it depends on the data, and guessing is not an answer.",
          solution:
            "Systematic exploration of window sizes from 20 to 90 timesteps on the validation set. Plotted validation loss against window size. Chose 60 timesteps where the improvement curve flattened — and documented the decision with the supporting curves.",
        },
        {
          title: "Data leakage via MinMaxScaler",
          body: "If you fit the MinMaxScaler on the full dataset including the test period, the scaler has seen future values before the model is trained. The test performance is then inflated — it's not genuinely out-of-sample.",
          solution:
            "Fitted the scaler only on the training data. Applied the training-fitted scaler to the test data. The test period normalization used parameters derived only from the past — genuinely out-of-sample evaluation.",
        },
        {
          title: "Interpreting model uncertainty",
          body: "The LSTM produces a point estimate — a single number. But a point estimate without any sense of uncertainty isn't a trustworthy forecast. What does the model's confidence actually look like?",
          solution:
            "Monte Carlo dropout: at inference time, keep dropout layers active and run the model 100 times on the same input. The spread of the 100 predictions estimates the model's uncertainty. Visualized as a confidence band around the central prediction.",
        },
      ],
      impact: [
        {
          metric: "Transparent pipeline",
          description: "Every transformation from raw data to model input is a named, inspectable step",
        },
        {
          metric: "Confidence band",
          description: "Monte Carlo dropout uncertainty estimate — not just a point prediction",
        },
        {
          metric: "Documented decision",
          description: "Window size chosen with validation curves — a reasoned choice, not a guess",
        },
      ],
      learned: [
        {
          title: "The pipeline is as important as the model.",
          body: "A model you can't trace back to its inputs is a model you can't trust. The preprocessing pipeline — what data went in, how it was normalized, how the windows were constructed — determines what the model actually learned.",
        },
        {
          title: "Data leakage is invisible until you look for it.",
          body: "Fitting the scaler on the full dataset is an easy mistake that inflates test performance and invalidates the evaluation. The fix is disciplined: fit on train, apply to test. Knowing the risk is the first step to avoiding it.",
        },
        {
          title: "'Better accuracy' is not a useful goal.",
          body: "Better accuracy on what? Against what baseline? Under what market conditions? Understanding prediction boundaries — when the model's uncertainty is high, what inputs caused that — is more useful than chasing a number that doesn't generalize.",
        },
      ],
    },
  },
];

/** Returns the project marked as featured. Falls back to first project. */
export const featuredProject = projects.find((p) => p.featured) ?? projects[0];

/** Returns all projects except the featured one. */
export const catalogProjects = projects.filter((p) => !p.featured);
