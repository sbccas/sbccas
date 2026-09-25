# 🔭 Future Recommendations & Architectural Roadmap

> **Notice:** As per Phase 2 guidelines, these recommendations are strictly informational.  
> No external repositories have been modified.

---

## Repository Observations & Recommended Actions

| Repository | Current Observation | Recommended Action | Strategic Rationale |
| :--- | :--- | :--- | :--- |
| **`amroli-ai-assist`** | Repository description is empty (`null`) and has zero GitHub topics. | Add description: *"AI-assisted coding and intelligent tutoring prototypes for Amroli College"* and topics: `ai`, `python`, `llm`, `vnsgu`, `sbccas`. | Essential for student discoverability and search indexing on GitHub. |
| **`Practical_Assignment`** | Generic repository title with mixed casing; contains specifically Android MAD-1 practical demos. | Enhance the repository `README.md` with a prominent title banner: *"Mobile Application Development (305 MAD-1) Practicals"* and add topic `android-sdk`. | Distinguishes this repository from other course practicals and reduces student confusion. |
| **`operating-system`** | Has minimal topic tagging and lacks an introductory setup section for Linux terminal basics. | Add topics: `operating-systems`, `bca`, `linux`, `vnsgu`, and add a beginner-friendly Shell command cheat-sheet. | Enhances self-paced learning for FYBCA Semester II students. |
| **`E-Commerce-and-Cyber-Security`** | Description is brief (*"E-Comm-and-Cyber-Security Material"*); no topic tags attached. | Add topics: `cyber-security`, `ecommerce`, `cryptography`, `vnsgu`, and include structured chapter markdown index files. | Organizes theoretical syllabus into modular, searchable reading notes. |
| **`Big-Data-Handling-and-Management-for-Machine-Learning-Applications`** | Excellent PySpark and Hugging Face curriculum, but 67-character repository name can be difficult to type in terminal. | Maintain prominent shortcuts from the root portal and consider creating a git alias recommendation in its README. | Simplifies student `git clone` operations on lab computers. |
| **`busappschedule` / `projectattendance`** | Student projects that lack architecture diagrams and deployment instructions. | Add a standard `CONTRIBUTING.md` and architecture diagram to illustrate how student capstones should be documented. | Provides model examples for junior students submitting their own final-year projects. |

---

## Organization-Level Infrastructure Recommendations

### 1. GitHub Pages Domain Strategy
* **Current Situation:** The root repository is named `sbccas/sbccas`.
* **GitHub Architecture:** GitHub Pages deploys `sbccas/sbccas` to:
  `https://sbccas.github.io/sbccas/`
* **Root Domain Requirement:** For the URL `https://sbccas.github.io/` (without the `/sbccas/` subpath), GitHub requires the repository to be named specifically:
  `sbccas.github.io`
* **Recommendation:**
  * **Option A:** Keep `sbccas/sbccas` as the Organization Profile README hub and deploy the portal to `https://sbccas.github.io/sbccas/` (or via custom domain).
  * **Option B:** Create a dedicated repository named `sbccas.github.io` to claim the top-level organization domain.
  * **Option C:** Configure a custom institutional subdomain such as `code.amrolicollege.ac.in` using GitHub Pages CNAME settings.

### 2. Standardized Repository Topic Schema
Establish a uniform topic convention across all departmental repositories:
* Program tag: `bca` | `bca-ai` | `bsc-it` | `bsc-data-science`
* Institution tag: `sbccas` | `amroli-college`
* University tag: `vnsgu`
* Tech tags: `python` | `c` | `android` | `pyspark` | `asp-net`
