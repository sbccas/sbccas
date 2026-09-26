/**
 * SBCCAS Digital Academic Portal - Discovery & Explorer Engine
 * Fully scalable GitHub API integration with local catalog fallback,
 * pagination handling, dynamic statistics, multi-field search, and sorting.
 */

(function () {
  'use strict';

  // State Management
  let allRepositories = [];
  let academicCatalog = {};
  let featuredRepoNames = [];
  let currentCourse = 'all';
  let currentTech = 'all';
  let currentSort = 'updated';
  let searchQuery = '';

  // DOM Elements
  const gridElement = document.getElementById('repositories-grid');
  const countElement = document.getElementById('catalog-count');
  const searchInput = document.getElementById('repo-search');
  const clearBtn = document.getElementById('clear-search');
  const sortSelect = document.getElementById('repo-sort');
  const courseFilterGroup = document.getElementById('course-filter-group');
  const techFilterGroup = document.getElementById('tech-filter-group');

  // Stats Elements
  const statTotalRepos = document.getElementById('stat-total-repos');
  const statTechs = document.getElementById('stat-techs');
  const statStars = document.getElementById('stat-stars');
  const statCourses = document.getElementById('stat-courses');

  /**
   * Helper to load JSON with relative fallback paths
   */
  async function fetchJsonWithFallback(filename) {
    const candidatePaths = [
      `data/${filename}`,
      `./data/${filename}`,
      `../data/${filename}`
    ];

    for (const path of candidatePaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          if (data) return data;
        }
      } catch (e) {
        // Continue to next candidate path
      }
    }
    return null;
  }

  /**
   * 1. Load curated metadata and featured repo lists
   */
  async function loadCuratedMetadata() {
    const [reposData, featuredData] = await Promise.all([
      fetchJsonWithFallback('repositories.json'),
      fetchJsonWithFallback('featured.json')
    ]);

    if (Array.isArray(reposData)) {
      reposData.forEach(item => {
        if (item.name) academicCatalog[item.name.toLowerCase()] = item;
      });
    }

    if (Array.isArray(featuredData)) {
      featuredRepoNames = featuredData.map(name => name.toLowerCase());
    }
  }

  /**
   * 2. Scalable GitHub API Discovery with Pagination & Cache
   */
  async function fetchAllGitHubRepositories() {
    const CACHE_KEY = 'sbccas_github_repos_v2';
    const CACHE_TIME_KEY = 'sbccas_github_repos_time';
    const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache

    // Check browser cache
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      const cacheTime = sessionStorage.getItem(CACHE_TIME_KEY);
      if (cached && cacheTime && (Date.now() - parseInt(cacheTime, 10) < CACHE_TTL)) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      // sessionStorage unavailable or parsing error; continue
    }

    // Fetch dynamically from GitHub API handling pagination
    let repos = [];
    let page = 1;
    let hasMore = true;

    try {
      while (hasMore && page <= 10) { // Safety ceiling of 1000 repositories
        const apiUrl = `https://api.github.com/users/sbccas/repos?per_page=100&page=${page}&sort=updated`;
        const res = await fetch(apiUrl, {
          headers: { 'Accept': 'application/vnd.github.v3+json' }
        });

        if (!res.ok) {
          break; // Fallback to local catalog on rate limit or error
        }

        const pageData = await res.json();
        if (!Array.isArray(pageData) || pageData.length === 0) {
          hasMore = false;
        } else {
          repos = repos.concat(pageData);
          if (pageData.length < 100) {
            hasMore = false;
          } else {
            page++;
          }
        }
      }

      if (repos.length > 0) {
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(repos));
          sessionStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
        } catch (e) {
          // Storage quota full; proceed
        }
        return repos;
      }
    } catch (err) {
      console.warn('GitHub API unavailable, using local catalog fallback.', err);
    }

    return null;
  }

  /**
   * 3. Normalize repositories combining live API and verified academic catalog
   */
  function normalizeRepository(raw) {
    const name = raw.name || '';
    const key = name.toLowerCase();
    const curated = academicCatalog[key] || {};

    const isFeatured = featuredRepoNames.includes(key) || curated.featured === true;

    // Merge technologies without duplicates
    const techSet = new Set(curated.technologies || []);
    if (raw.language) techSet.add(raw.language);
    if (Array.isArray(raw.topics)) {
      raw.topics.forEach(t => techSet.add(t));
    }

    return {
      name: name,
      fullName: raw.full_name || `sbccas/${name}`,
      url: raw.html_url || curated.url || `https://github.com/sbccas/${name}`,
      description: raw.description || curated.description || 'Verified academic repository in the SBCCAS ecosystem.',
      language: raw.language || (curated.technologies && curated.technologies[0]) || 'Code',
      technologies: Array.from(techSet),
      courses: curated.courses || ['BCA', 'BCA - AI', 'B.Sc. Data Science & Analytics', 'B.Sc. IT'],
      category: curated.category || 'General',
      level: curated.level || 'All Levels',
      stars: typeof raw.stargazers_count === 'number' ? raw.stargazers_count : 0,
      forks: typeof raw.forks_count === 'number' ? raw.forks_count : 0,
      updatedAt: raw.updated_at || '',
      featured: isFeatured,
      archived: raw.archived === true
    };
  }

  /**
   * 4. Calculate dynamic ecosystem statistics
   */
  function updateEcosystemStatistics() {
    if (!statTotalRepos) return;

    const totalRepos = allRepositories.length;
    const allTechs = new Set();
    let totalStars = 0;
    const allCourses = new Set();

    allRepositories.forEach(repo => {
      (repo.technologies || []).forEach(t => allTechs.add(t.toLowerCase()));
      (repo.courses || []).forEach(c => allCourses.add(c));
      totalStars += (repo.stars || 0);
    });

    statTotalRepos.textContent = totalRepos > 0 ? totalRepos.toString() : '--';
    if (statTechs) statTechs.textContent = allTechs.size > 0 ? `${allTechs.size}+` : '--';
    if (statStars) statStars.textContent = totalStars > 0 ? `${totalStars}` : '100+';
    if (statCourses) statCourses.textContent = allCourses.size > 0 ? allCourses.size.toString() : '4';
  }

  /**
   * 5. Format ISO date to human readable string
   */
  function formatUpdatedDate(isoString) {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `Updated ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch (e) {
      return '';
    }
  }

  /**
   * 6. Sorting logic
   */
  function sortRepositories(list) {
    const sorted = [...list];
    switch (currentSort) {
      case 'stars':
        return sorted.sort((a, b) => b.stars - a.stars);
      case 'forks':
        return sorted.sort((a, b) => b.forks - a.forks);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'updated':
      default:
        return sorted.sort((a, b) => {
          if (!a.updatedAt) return 1;
          if (!b.updatedAt) return -1;
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
    }
  }

  /**
   * 7. Filter repositories based on active search, course, and tech state
   */
  function getFilteredRepositories() {
    const filtered = allRepositories.filter(repo => {
      // Course filter
      if (currentCourse !== 'all') {
        const hasCourse = Array.isArray(repo.courses) && repo.courses.some(c =>
          c.toLowerCase() === currentCourse.toLowerCase() ||
          c.toLowerCase().includes(currentCourse.toLowerCase())
        );
        if (!hasCourse) return false;
      }

      // Tech or Featured filter
      if (currentTech === 'featured') {
        if (!repo.featured) return false;
      } else if (currentTech !== 'all') {
        const hasTech = Array.isArray(repo.technologies) && repo.technologies.some(t =>
          t.toLowerCase().includes(currentTech.toLowerCase())
        );
        if (!hasTech) return false;
      }

      // Search query filter
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

    return sortRepositories(filtered);
  }

  /**
   * 8. Render repository cards into DOM
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
          <h3>No repositories matched your search</h3>
          <p>Try clearing your search query or selecting "All Courses" and "All" filters.</p>
          <button id="reset-filters-btn" class="btn btn-sm btn-outline" style="margin-top: 1rem;">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', resetAllFilters);
      }
      return;
    }

    const htmlCards = filtered.map(repo => {
      const techBadges = (repo.technologies || [])
        .slice(0, 5) // Display top 5 tags to prevent visual clutter
        .map(t => `<span class="tag-tech">${escapeHtml(t)}</span>`)
        .join('');

      const courseBadges = (repo.courses || [])
        .map(c => `<span class="tag-course">${escapeHtml(c)}</span>`)
        .join('');

      const featuredBadge = repo.featured
        ? `<span class="tag-featured-badge">⭐ Flagship</span>`
        : '';

      const updatedStr = formatUpdatedDate(repo.updatedAt);

      return `
        <article class="repo-card" data-repo="${escapeHtml(repo.name)}">
          <div>
            <div class="repo-header">
              <h3 class="repo-title">
                <a href="${escapeHtml(repo.url)}" target="_blank" rel="noopener noreferrer">
                  ${escapeHtml(repo.name)}
                </a>
              </h3>
              ${featuredBadge}
            </div>
            <p class="repo-desc">${escapeHtml(repo.description)}</p>
          </div>

          <div class="repo-meta">
            <div class="repo-tags">
              ${courseBadges}
              ${techBadges}
            </div>
            <div class="repo-footer">
              <div class="repo-metrics">
                ${repo.stars > 0 ? `<span class="metric-item" title="${repo.stars} Stars">⭐ ${repo.stars}</span>` : ''}
                ${repo.forks > 0 ? `<span class="metric-item" title="${repo.forks} Forks">🍴 ${repo.forks}</span>` : ''}
                ${updatedStr ? `<span class="metric-item">${escapeHtml(updatedStr)}</span>` : ''}
              </div>
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

  function resetAllFilters() {
    currentCourse = 'all';
    currentTech = 'all';
    searchQuery = '';
    currentSort = 'updated';

    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    if (sortSelect) sortSelect.value = 'updated';

    if (courseFilterGroup) {
      courseFilterGroup.querySelectorAll('.filter-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.course === 'all');
      });
    }

    if (techFilterGroup) {
      techFilterGroup.querySelectorAll('.tech-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tech === 'all');
      });
    }

    renderCatalog();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

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

    // Sorting dropdown
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
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

    // Clear search
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

    // Load curated course mappings & featured list first
    await loadCuratedMetadata();

    // Fetch from GitHub API or fallback to local catalog
    const apiRepos = await fetchAllGitHubRepositories();

    if (Array.isArray(apiRepos) && apiRepos.length > 0) {
      allRepositories = apiRepos.map(normalizeRepository);
    } else {
      // Fallback: use local catalog directly
      const localCatalog = await fetchJsonWithFallback('repositories.json');
      if (Array.isArray(localCatalog) && localCatalog.length > 0) {
        allRepositories = localCatalog.map(normalizeRepository);
      }
    }

    if (allRepositories.length > 0) {
      updateEcosystemStatistics();
      renderCatalog();
    } else {
      if (gridElement) {
        gridElement.innerHTML = `
          <div class="empty-state">
            <h3>Repository data is temporarily unavailable</h3>
            <p>Please visit the SBCCAS GitHub organization directly.</p>
            <a href="https://github.com/sbccas" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="margin-top: 1rem;">
              Open GitHub Organization →
            </a>
          </div>
        `;
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
