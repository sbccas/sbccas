# 📊 SBCCAS Digital Academic Ecosystem — Project Progress Report

**Organization:** Sutex Bank College of Computer Applications & Science (Amroli College), Surat  
**University Affiliation:** Veer Narmad South Gujarat University (VNSGU)  
**Root Repository:** [`sbccas/sbccas`](https://github.com/sbccas/sbccas)  
**Live Portal URL:** [`https://sbccas.github.io/`](https://sbccas.github.io/)  
**Mirror Portal URL:** [`https://sbccas.github.io/sbccas/`](https://sbccas.github.io/sbccas/)  
**Date:** September 26, 2026  
**Current Milestone:** Phase 2 Complete — Automated Showcase & Academic Portal Live  

---

## 1. Executive Overview

The **SBCCAS Digital Academic Ecosystem** project elevates the official GitHub presence of Amroli College from a simple code storage location into an automated, interactive **Digital Academic Portal**. The portal serves as the unified "Front Door" for students, faculty, and industry recruiters, enabling seamless discovery of official course practicals, AI & machine learning laboratories, datasets, and capstone software projects.

---

## 2. Key Achievements & Milestones Completed

### 🚀 Phase 1: Root README & Brand Modernization
* **Unified Branding:** Standardized organization identity as **`sbccas`** (Sutex Bank College of Computer Applications & Science, Amroli), removing outdated 2023 boilerplate and personal pronoun conflicts.
* **Vector Mermaid Diagrams:** Replaced fragile ASCII drawings with GitHub-native **Mermaid.js** flowcharts:
  * *The Builder Loop:* Multi-stage lifecycle moving from passive theory to active coding, experimentation, AI augmentation, and deployment.
  * *AI-Augmented Engineering:* End-to-end flowchart from problem definition to AI acceleration, critical testing, and production deployment.
* **Semantic Hierarchy:** Resolved 19 duplicate `<h1>` tags into a clean markdown structure with rich Shields.io badges.
* **Quick-Nav Portal Strip:** Integrated accessible navigation buttons linking directly to the live portal, learning paths, and getting-started guides.

---

### 🌐 Phase 2: Live Digital Academic Portal (`https://sbccas.github.io/`)
* **Modern Cyber-Academic UI:**
  * Clean dark-mode palette (`#0d1117`, `#161b22`, `#21262d`) with neon cyan/purple gradient accents.
  * Fully responsive design tested across viewports (mobile 320px–375px, tablet 768px, desktop 1024px–1920px) with 0 horizontal overflow and 0 console errors.
* **Scalable GitHub API Discovery Engine:**
  * Dynamically queries the GitHub API (`/users/sbccas/repos?per_page=100`) with pagination support (`page=1, 2...`), capable of scaling to hundreds of repositories automatically.
  * **Rate-Limit Resilience:** Features a 15-minute `sessionStorage` cache and automatically falls back to local [`data/repositories.json`](../data/repositories.json) if the GitHub API is offline or rate-limited.
* **Live Ecosystem Metrics Strip (Zero Hardcoding):**
  * Calculated on the fly from live repository data:
    * **17 Active Repositories**
    * **60+ Technologies & Topics**
    * **422 Community Stars**
    * **4 Academic Degree Programs**
* **Interactive Sorting & Filtering Controls:**
  * **Sorting:** *Recently Updated* (default), *Most Stars*, *Most Forked*, and *Alphabetical (A–Z)*.
  * **Course Filtering:** Filter by *BCA*, *BCA – AI*, *B.Sc. Data Science & Analytics*, and *B.Sc. IT*.
  * **Tech Filtering:** Filter by *Python*, *C Language*, *PySpark*, *Hugging Face*, *ASP.NET*, *Android*, or *⭐ Featured Flagships*.
  * **Reactive Search:** Instant client-side search across repository names, descriptions, languages, topics, and degree courses.
* **Configurable Flagship System:**
  * Controlled via [`data/featured.json`](../data/featured.json) so faculty can highlight flagship course repositories without modifying application code.
* **Automated CI/CD Catalog Sync:**
  * Added `.github/workflows/update-repositories.yml` running daily via cron with [`scripts/update_catalog.py`](../scripts/update_catalog.py) to automatically discover newly created repositories and keep the catalog synchronized.

---

### 📚 Phase 3: Comprehensive Academic & System Documentation
* [`docs/ARCHITECTURE.md`](ARCHITECTURE.md): Complete system architecture, data models, discovery loop, and GitHub Pages deployment design.
* [`docs/GETTING_STARTED.md`](GETTING_STARTED.md): Student onboarding guide covering Git, GitHub, Google Colab, and building a public developer portfolio.
* [`docs/AI_ERA_LEARNING.md`](AI_ERA_LEARNING.md): Practical guide on ethical AI usage, prompt engineering, viva defense validation, and academic integrity.
* [`docs/CONTRIBUTING.md`](CONTRIBUTING.md): Safe contribution guidelines for improving root documentation and portal styles.
* [`docs/FUTURE_RECOMMENDATIONS.md`](FUTURE_RECOMMENDATIONS.md): Strategic recommendations for external repository maintainers (naming, topics, setup instructions).
* [`docs/PHASE_2_FINAL_REPORT.md`](PHASE_2_FINAL_REPORT.md): Comprehensive audit log and test results.
* [`docs/learning-paths/`](learning-paths/): Verified course roadmaps:
  * `bca.md`: Procedural C (104), OS (203), Python (204), Android MAD (305), and ASP.NET.
  * `bca-ai.md`: Algorithmic logic, Pandas analytics, Hugging Face NLP, and AI assistants.
  * `bsc-data-science.md`: DS-505 Big Data, PySpark, Scikit-learn, and Colab notebooks.
  * `bsc-it.md`: Structured C programming, E-Commerce systems, and cyber security.

---

## 3. Discovered Repository Catalog Snapshot

The ecosystem currently catalogues **17 active public repositories**:

| Repository Name | Primary Category | Verified Degree Programs | Core Technologies | Community Stars |
| :--- | :--- | :--- | :--- | :---: |
| **`sbccas`** | Portal & Ecosystem | All Programs | Markdown, HTML, CSS, JS | ⭐ 187 |
| **`c-programming-tutorials`** | Programming (104-CPPM) | BCA | C Language, Algorithms | ⭐ 109 |
| **`asp.net-tutorials`** | Web Development | BCA | ASP.NET, C#, SQL Server | ⭐ 93 |
| **`data-analytics-using-python`**| Data Science & AI | BCA, B.Sc. Data Science | Python, Pandas, EDA, ML | ⭐ 15 |
| **`Practical_Assignment`** | Mobile Development (305 MAD) | BCA | Android, Java, XML | ⭐ 7 |
| **`Big-Data-Handling-...`** | Data Science & AI (DS-505) | B.Sc. Data Science, BCA-AI | PySpark, Scikit-learn, Hugging Face | ⭐ 4 |
| **`programming-skills-tutorials`**| Programming (204) | BCA | Python Scripting | ⭐ 4 |
| **`amroli-ai-assist`** | Data Science & AI | BCA-AI, B.Sc. Data Science | Python, AI, LLMs | ⭐ 1 |
| **`github-showcase`** | Showcase & Tools | All Programs | HTML, CSS, JavaScript | ⭐ 1 |
| **`VBDotNetDemos`** | Programming | BCA | Visual Basic .NET | ⭐ 1 |
| **`operating-system`** | Computer Science Core (203) | BCA | Operating Systems, Shell | 0 |
| **`Fundamentals-of-Programming...`**| Programming | B.Sc. IT | C Language | 0 |
| **`E-Commerce-and-Cyber-Security`**| Systems & Security | BCA, B.Sc. IT | Cyber Security, E-Commerce | 0 |
| **`amrolisficolleges`** | Institutional | BCA, B.Sc. Data Science | JavaScript, HTML, Web | 0 |
| **`busappschedule`** | Projects & Applications | BCA | JavaScript, Web App | 0 |
| **`projectattendance`** | Projects & Applications | BCA | Database, Web | 0 |
| **`sbccas.github.io`** | Portal & Ecosystem | All Programs | HTML, CSS, JavaScript | 0 |

---

## 4. Repository & Deployment Infrastructure

```
Remote Repositories:
├── origin  ➜  https://github.com/sbccas/sbccas.git          (Root Organization Repository & Profile README)
└── apex    ➜  https://github.com/sbccas/sbccas.github.io.git  (Dedicated Apex Domain Host for GitHub Pages)

Published Endpoints:
├── https://sbccas.github.io/         [Active - Primary Apex Portal]
└── https://sbccas.github.io/sbccas/  [Active - Project Mirror]
```

---

## 5. Next Steps & Ongoing Maintenance

1. **Automated Maintenance:** The catalog auto-updater workflow (`update-repositories.yml`) will run daily to capture new repos or topic changes automatically.
2. **Featured Flagships:** To spotlight new capstone projects or semester courses, simply add the repository name into [`data/featured.json`](../data/featured.json).
3. **Optional Custom Domain:** If desired, a custom institutional domain (e.g. `portal.amrolicollege.ac.in`) can be attached via GitHub Pages settings with a DNS CNAME record.
