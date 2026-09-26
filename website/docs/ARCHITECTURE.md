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
│       ├── update-repositories.yml  # Scheduled discovery & auto-update catalog workflow
│       └── validate-links.yml       # Automated catalog & markdown link validation
├── data/
│   ├── featured.json                # Curated list of flagship course repository names
│   └── repositories.json            # Ground-truth verified repository metadata catalog
├── docs/
│   ├── ARCHITECTURE.md              # System design & structural specification (this document)
│   ├── GETTING_STARTED.md           # Beginner student onboarding guide to Git & GitHub
│   ├── AI_ERA_LEARNING.md           # Responsible AI usage guide & academic integrity framework
│   ├── CONTRIBUTING.md              # Safe contribution guide for the root portal
│   ├── FUTURE_RECOMMENDATIONS.md    # Organizational & architectural advisory roadmap
│   ├── PHASE_2_FINAL_REPORT.md      # Comprehensive audit report
│   └── learning-paths/              # Curated academic journeys mapped to active repos
│       ├── bca.md                   # Bachelor of Computer Applications learning roadmap
│       ├── bca-ai.md                # BCA Artificial Intelligence specialization roadmap
│       ├── bsc-data-science.md      # B.Sc. Data Science & Analytics roadmap
│       └── bsc-it.md                # B.Sc. Information Technology roadmap
├── scripts/
│   └── update_catalog.py            # Automated repository discovery & metadata merger script
├── website/                         # Lightweight static academic portal (GitHub Pages ready)
│   ├── index.html                   # Semantic HTML5 portal interface
│   ├── styles.css                   # Cyber-academic modern styling (dark theme)
│   ├── script.js                    # Scalable API discovery, live stats, search & sorting
│   └── data/                        # Synchronized catalog for standalone deployment
├── index.html                       # Root mirror of the portal
├── styles.css                       # Root mirror stylesheet
├── script.js                        # Root mirror script
├── .nojekyll                        # Disables Jekyll processing on GitHub Pages
└── README.md                        # Primary GitHub Organization / Profile overview
```

---

## 3. Dynamic Repository Discovery & Scalability Architecture

To ensure the portal scales automatically whether the ecosystem contains 10, 50, or 200 repositories, a **Hybrid Resilience Discovery Model** is implemented:

```
                            ┌────────────────────────┐
                            │ Student Visits Portal  │
                            └───────────┬────────────┘
                                        │
                                        ▼
                            ┌────────────────────────┐
                            │ Check Session Storage? │
                            └─────┬────────────┬─────┘
                        YES (Fresh)│            │NO (Expired/Empty)
                                  │            ▼
                                  │  ┌───────────────────┐
                                  │  │ Query GitHub API  │
                                  │  │ (Paginated Loop)  │
                                  │  └─────┬───────┬─────┘
                                  │        │OK     │Error / Rate Limit
                                  │        │       ▼
                                  │        │ ┌───────────────────┐
                                  │        │ │ Load Local Static │
                                  │        │ │  repositories.json│
                                  │        │ └─────────┬─────────┘
                                  ▼        ▼           │
                           ┌───────────────────────────┴┐
                           │ Normalize & Merge Academic │
                           │  Metadata & Featured Tags  │
                           └─────────────┬──────────────┘
                                         ▼
                           ┌────────────────────────────┐
                           │ Compute Dynamic Statistics │
                           │  & Render Interactive Grid │
                           └────────────────────────────┘
```

### Key Technical Strategies:
1. **Pagination Support:** Queries `https://api.github.com/users/sbccas/repos?per_page=100&page=1` in a dynamic loop until all pages are retrieved.
2. **Rate-Limit Resilience:** GitHub unauthenticated client-side API requests have a limit of 60 req/hour per IP. The engine caches API results in `sessionStorage` (15-min TTL) and falls back seamlessly to `data/repositories.json` without user disruption.
3. **Automated Continuous Indexing (CI/CD):** `.github/workflows/update-repositories.yml` runs daily to discover newly added college repositories, merge them with academic categories via `scripts/update_catalog.py`, and commit updates back to the repository.

---

## 4. Data Models

### Catalog Schema (`data/repositories.json`)
```typescript
interface RepositoryEntry {
  name: string;            // Repository name on GitHub
  url: string;             // Direct HTTPS link (https://github.com/sbccas/...)
  description: string;     // Verified course/practical description
  category: string;        // Categorical grouping (e.g. Programming, Data Science & AI)
  courses: string[];       // Associated academic programs (BCA, B.Sc. DS, etc.)
  technologies: string[];  // Languages, frameworks, and libraries used
  featured: boolean;       // Flagship course display priority
  level: string;           // Difficulty level (Beginner | Intermediate | Advanced | All Levels)
  status: "active" | "archived";
}
```

### Featured Flagship Schema (`data/featured.json`)
```json
[
  "Big-Data-Handling-and-Management-for-Machine-Learning-Applications",
  "c-programming-tutorials",
  "data-analytics-using-python",
  "Practical_Assignment",
  "asp.net-tutorials",
  "amroli-ai-assist"
]
```

---

## 5. Web Experience Design & Technology Rules
* **Zero Bloat:** Built with Vanilla HTML5, CSS3, and ES6+ JavaScript. No heavy client frameworks (React, Next.js, Vue) to guarantee instant loading, 100/100 Lighthouse performance, and zero build tool fragility.
* **Client-Side Reactive Search & Sorting:** Real-time filtering across names, topics, courses, and tech stacks, plus sorting by *Recently Updated*, *Most Stars*, *Most Forks*, and *Alphabetical*.
* **Zero Tracking / Zero External Dependencies:** No third-party tracking scripts, fully privacy-compliant for educational institutions.
