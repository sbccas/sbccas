/**
 * SBCCAS Digital Academic Portal - Client Script
 * Lightweight, zero-framework reactive filtering and search
 */

(function () {
  'use strict';

  let allRepositories = [];
  let currentCourse = 'all';
  let currentTech = 'all';
  let searchQuery = '';

  const gridElement = document.getElementById('repositories-grid');
  const countElement = document.getElementById('catalog-count');
  const searchInput = document.getElementById('repo-search');
  const clearBtn = document.getElementById('clear-search');
  const courseFilterGroup = document.getElementById('course-filter-group');
  const techFilterGroup = document.getElementById('tech-filter-group');

  /**
   * Fetch repositories.json from potential relative paths
   */
  async function loadRepositoryData() {
    const candidatePaths = [
      '../data/repositories.json',
      'data/repositories.json',
      './data/repositories.json'
    ];

    for (const path of candidatePaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            allRepositories = data;
            return true;
          }
        }
      } catch (err) {
        // Continue to fallback candidate
      }
    }
    return false;
  }

  /**
   * Filter repositories based on current active state
   */
  function getFilteredRepositories() {
    return allRepositories.filter(repo => {
      // 1. Course filter
      if (currentCourse !== 'all') {
        const hasCourse = Array.isArray(repo.courses) && repo.courses.some(c => 
          c.toLowerCase() === currentCourse.toLowerCase() || 
          c.toLowerCase().includes(currentCourse.toLowerCase())
        );
        if (!hasCourse) return false;
      }

      // 2. Technology filter
      if (currentTech !== 'all') {
        const hasTech = Array.isArray(repo.technologies) && repo.technologies.some(t => 
          t.toLowerCase().includes(currentTech.toLowerCase())
        );
        if (!hasTech) return false;
      }

      // 3. Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = repo.name.toLowerCase().includes(q);
        const matchDesc = (repo.description || '').toLowerCase().includes(q);
        const matchCategory = (repo.category || '').toLowerCase().includes(q);
        const matchTech = Array.isArray(repo.technologies) && repo.technologies.some(t => t.toLowerCase().includes(q));
        const matchCourse = Array.isArray(repo.courses) && repo.courses.some(c => c.toLowerCase().includes(q));

        if (!matchName && !matchDesc && !matchCategory && !matchTech && !matchCourse) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Render repository cards into DOM
   */
  function renderCatalog() {
    if (!gridElement) return;

    const filtered = getFilteredRepositories();

    // Update count indicator
    if (countElement) {
      countElement.textContent = `Showing ${filtered.length} of ${allRepositories.length} repositories`;
    }

    if (filtered.length === 0) {
      gridElement.innerHTML = `
        <div class="empty-state">
          <h3>No matching repositories found</h3>
          <p>Try clearing your search query or selecting "All Courses" and "All" technologies.</p>
        </div>
      `;
      return;
    }

    const htmlCards = filtered.map(repo => {
      const techBadges = (repo.technologies || [])
        .map(t => `<span class="tag-tech">${escapeHtml(t)}</span>`)
        .join('');

      const courseBadges = (repo.courses || [])
        .map(c => `<span class="tag-course">${escapeHtml(c)}</span>`)
        .join('');

      const levelBadge = repo.level 
        ? `<span class="repo-level">${escapeHtml(repo.level)}</span>`
        : '';

      return `
        <article class="repo-card" data-repo="${escapeHtml(repo.name)}">
          <div>
            <div class="repo-header">
              <h3 class="repo-title">
                <a href="${escapeHtml(repo.url)}" target="_blank" rel="noopener noreferrer">
                  ${escapeHtml(repo.name)}
                </a>
              </h3>
              ${levelBadge}
            </div>
            <p class="repo-desc">${escapeHtml(repo.description || 'Verified academic repository.')}</p>
          </div>

          <div class="repo-meta">
            <div class="repo-tags">
              ${courseBadges}
              ${techBadges}
            </div>
            <div class="repo-footer">
              <span class="repo-cat">${escapeHtml(repo.category || 'General')}</span>
              <a href="${escapeHtml(repo.url)}" target="_blank" rel="noopener noreferrer" class="repo-link">
                Open Repo ↗
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    gridElement.innerHTML = htmlCards;
  }

  /**
   * Helper to escape HTML characters
   */
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Initialize event handlers
   */
  function setupEventListeners() {
    // Course filters
    if (courseFilterGroup) {
      courseFilterGroup.addEventListener('click', (e) => {
        const target = e.target.closest('.filter-pill');
        if (!target) return;

        courseFilterGroup.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');
        currentCourse = target.dataset.course || 'all';
        renderCatalog();
      });
    }

    // Technology filters
    if (techFilterGroup) {
      techFilterGroup.addEventListener('click', (e) => {
        const target = e.target.closest('.tech-pill');
        if (!target) return;

        techFilterGroup.querySelectorAll('.tech-pill').forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');
        currentTech = target.dataset.tech || 'all';
        renderCatalog();
      });
    }

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (clearBtn) {
          clearBtn.style.display = searchQuery ? 'block' : 'none';
        }
        renderCatalog();
      });
    }

    // Clear search button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchQuery = '';
          clearBtn.style.display = 'none';
          searchInput.focus();
          renderCatalog();
        }
      });
    }
  }

  /**
   * Application bootstrap
   */
  async function init() {
    setupEventListeners();
    const loaded = await loadRepositoryData();
    if (loaded) {
      renderCatalog();
    } else {
      if (gridElement) {
        gridElement.innerHTML = `
          <div class="empty-state">
            <h3>Unable to load repository data</h3>
            <p>Please check that data/repositories.json exists and is properly formatted.</p>
          </div>
        `;
      }
    }
  }

  // Run on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
