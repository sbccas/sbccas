# 🤝 Contributing to the SBCCAS Root Portal

Thank you for your interest in contributing to the **SBCCAS Digital Academic Portal**! 

The root repository (`sbccas/sbccas`) serves as the central directory and gateway for the entire college GitHub organization. We welcome contributions that improve navigation, documentation, accessibility, and student discovery.

---

## 🔒 Scope of This Repository
To protect academic syllabus integrity, **this repository manages only the root ecosystem**:
* `README.md` (organization profile)
* `data/repositories.json` (repository discovery catalog)
* `docs/` (learning paths, guides, architectural notes)
* `website/` (lightweight static web portal)

> [!IMPORTANT]
> **Do not submit pull requests to this repository attempting to update subject-specific notes or lab code from other repositories.**  
> Subject repositories (e.g., `c-programming-tutorials`, `asp.net-tutorials`) are managed independently by their respective course coordinators.

---

## 💡 Ways You Can Contribute

1. **Fix Broken Links or Typographical Errors:** Found a typo in a guide or a broken URL in the catalog? Open a quick PR!
2. **Improve Documentation:** Help expand explanations in `docs/GETTING_STARTED.md` or provide clearer instructions for beginners.
3. **Enhance Portal Usability:** Suggest CSS refinements, accessibility improvements (ARIA tags, keyboard navigation), or UI enhancements for `website/`.
4. **Propose New Learning Paths:** Have ideas for better mapping between coursework and self-directed projects? Suggest an outline!

---

## 🛠️ Contribution Workflow

1. **Fork the Repository:**
   Click the **Fork** button at the top right of [github.com/sbccas/sbccas](https://github.com/sbccas/sbccas) to create your personal copy.

2. **Clone Locally:**
   ```bash
   git clone https://github.com/<your-username>/sbccas.git
   cd sbccas
   ```

3. **Create a Dedicated Branch:**
   ```bash
   git checkout -b fix/catalog-links
   ```

4. **Make Your Changes & Test Locally:**
   * If editing documentation, ensure Markdown syntax renders cleanly.
   * If modifying `website/`, open `website/index.html` in your browser and verify responsiveness and console logs.
   * If updating `data/repositories.json`, ensure valid JSON syntax:
     ```bash
     python -m json.tool data/repositories.json > /dev/null
     ```

5. **Commit with Clear Messages:**
   ```bash
   git commit -m "docs: clarify Google Colab instructions in getting started guide"
   ```

6. **Push and Open a Pull Request:**
   ```bash
   git push origin fix/catalog-links
   ```
   Open a Pull Request against `sbccas/sbccas` on the `main` branch with a concise summary of what was changed and why.

---

## 📜 Code of Conduct & Academic Ethics
* Be respectful and encouraging toward fellow students and beginners.
* Never publish private exam questions, internal faculty credentials, or proprietary third-party copyrighted materials.
