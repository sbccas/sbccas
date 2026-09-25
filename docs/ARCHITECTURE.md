# 🏛️ Architecture: SBCCAS Root Repository & Digital Academic Portal

## 1. System Mission & Scope
The **sbccas** repository (`sbccas/sbccas`) serves as the official front door and root discovery layer for the **Sutex Bank College of Computer Applications and Science (Amroli College)** GitHub ecosystem.

### Architectural Separation
* **Root Repository (`sbccas/sbccas`):** Gateway, navigation, metadata catalog, learning paths, contributor guidelines, and web portal.
* **Subject / Lab Repositories:** Autonomous academic repositories containing course syllabi, lab code, datasets, and practical assignments.
* **Guiding Principle:** The root repository does **not** mirror or duplicate academic materials; it catalogues, contextualizes, and links to them.

```
                          ┌────────────────────────┐
                          │     sbccas/sbccas      │
                          │   (Root Gateway Hub)   │
                          └───────────┬────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
   ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
   │  Root README.md │       │  data/repos.json│       │  docs/ Paths &  │
   │ (Profile Front) │       │ (Catalog State) │       │    Guides       │
   └────────┬────────┘       └────────┬────────┘       └────────┬────────┘
            │                         │                         │
            └─────────────────────────┼─────────────────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │    website/ Web Portal    │
                        │ (Interactive UI & Filter) │
                        └─────────────┬─────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
   ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
   │   BCA Repos     │       │  Data Sci Repos │       │   B.Sc. IT &    │
   │ (C, OS, Python, │       │ (PySpark, EDA,  │       │   Showcases     │
   │  ASP.NET, MAD)  │       │  ML, HuggingFace│       │ (Git Showcase)  │
   └─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## 2. Directory & Information Architecture

```
sbccas/
├── .github/
│   └── workflows/
│       ├── deploy-pages.yml         # Automated GitHub Pages static build & deploy
│       └── validate-links.yml       # Automated catalog & markdown link validation
├── data/
│   └── repositories.json            # Ground-truth verified repository metadata catalog
├── docs/
│   ├── ARCHITECTURE.md              # System design & structural specification (this document)
│   ├── GETTING_STARTED.md           # Beginner student onboarding guide to Git & GitHub
│   ├── AI_ERA_LEARNING.md           # Responsible AI usage guide & academic integrity framework
│   ├── CONTRIBUTING.md              # Safe contribution guide for the root portal
│   ├── FUTURE_RECOMMENDATIONS.md    # Organizational & architectural advisory roadmap
│   ├── PHASE_2_FINAL_REPORT.md      # Comprehensive Phase 2 implementation report
│   └── learning-paths/              # Curated academic journeys mapped to active repos
│       ├── bca.md                   # Bachelor of Computer Applications learning roadmap
│       ├── bca-ai.md                # BCA Artificial Intelligence specialization roadmap
│       ├── bsc-data-science.md      # B.Sc. Data Science & Analytics roadmap
│       └── bsc-it.md                # B.Sc. Information Technology roadmap
├── website/                         # Lightweight static academic portal (GitHub Pages ready)
│   ├── index.html                   # Semantic HTML5 portal interface
│   ├── styles.css                   # Cyber-academic modern styling (dark/light contrast)
│   └── script.js                    # Client-side search, filtering, and dynamic catalog rendering
└── README.md                        # Primary GitHub Organization / Profile overview
```

---

## 3. Data Model (`data/repositories.json`)

The catalog schema is strictly validated and populated exclusively from active, verified repositories:

```typescript
interface RepositoryEntry {
  name: string;            // Official repository name on GitHub
  url: string;             // Direct HTTPS link (https://github.com/sbccas/...)
  description: string;     // Verified course/practical description
  category: string;        // Categorical grouping (e.g. Programming, Data Science & AI)
  courses: string[];       // Associated academic programs (BCA, B.Sc. DS, etc.)
  technologies: string[];  // Languages, frameworks, and libraries used
  featured: boolean;       // Display priority on portal hero
  level: string;           // Difficulty level (Beginner | Intermediate | Advanced | All Levels)
  status: "active" | "archived";
}
```

---

## 4. Web Experience Design & Technology Rules
* **Zero Bloat:** Built with Vanilla HTML5, CSS3, and JavaScript (ES6+). No heavy client frameworks (React, Next.js, Vue) to guarantee 100/100 Lighthouse performance, instant loading, and zero build tool fragility.
* **Client-Side Reactive Search:** Instant filtering across names, topics, courses, and tech stacks powered by local asynchronous `fetch()` against `data/repositories.json`.
* **Zero Tracking / Zero External Dependencies:** No Google Analytics, no third-party tracking scripts, fully privacy-compliant for educational institutions.
