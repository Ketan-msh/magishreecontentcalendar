/**
 * Magishree Bagaicha Resort - Bhadra Content Calendar Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const gridContainer = document.getElementById('content-grid');
  const searchInput = document.getElementById('search-input');
  const tabButtons = document.querySelectorAll('.filter-tabs .tab-btn');
  
  // Modal Elements
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalPrevBtn = document.getElementById('modal-prev');
  const modalNextBtn = document.getElementById('modal-next');
  const modalBody = document.getElementById('modal-body-content');
  const modalIndexBadge = document.getElementById('modal-index-badge');
  const modalTypeBadge = document.getElementById('modal-type-badge');
  const modalTitle = document.getElementById('modal-title');

  // Stats Counters
  const countAll = document.getElementById('count-all');
  const countReels = document.getElementById('count-reels');
  const countPosts = document.getElementById('count-posts');

  // App State
  let currentFilter = 'all';
  let currentSearchQuery = '';
  let activeModalIndex = null; // Index in contentData array

  // Initialize Stats
  function updateStats() {
    const reels = contentData.filter(item => item.type === 'Reel').length;
    const posts = contentData.filter(item => item.type === 'Post').length;
    if (countAll) countAll.textContent = contentData.length;
    if (countReels) countReels.textContent = reels;
    if (countPosts) countPosts.textContent = posts;
  }

  // Filter Data
  function getFilteredData() {
    return contentData.filter(item => {
      const matchesFilter = 
        currentFilter === 'all' || 
        (currentFilter === 'reels' && item.type === 'Reel') ||
        (currentFilter === 'posts' && item.type === 'Post');

      const query = currentSearchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query) ||
        item.theme.toLowerCase().includes(query) ||
        item.caption.toLowerCase().includes(query) ||
        item.hashtags.some(tag => tag.toLowerCase().includes(query)) ||
        (item.shotList && item.shotList.some(shot => shot.desc.toLowerCase().includes(query)));

      return matchesFilter && matchesSearch;
    });
  }

  // Render Grid
  function renderGrid() {
    const items = getFilteredData();
    gridContainer.innerHTML = '';

    if (items.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #FFF; border-radius: 16px; border: 1px solid var(--border-light);">
          <p style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-primary); margin-bottom: 8px;">No content pieces match your filter.</p>
          <p style="font-size: 0.875rem; color: var(--color-text-muted);">Try resetting your search query or filter tab.</p>
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'content-card';
      card.setAttribute('data-type', item.type);
      card.setAttribute('data-id', item.id);

      const shotCount = item.shotList ? item.shotList.length : 
                       (item.locationVersions ? '2 Options' : 'Custom');

      card.innerHTML = `
        <div class="card-top">
          <span class="card-index">CONTENT ${item.number} OF 09</span>
          <span class="card-badge ${item.type === 'Reel' ? 'badge-reel' : 'badge-post'}">
            ${item.type === 'Reel' ? '🎥 REEL' : '📸 POST'}
          </span>
        </div>
        <div>
          <h3 class="card-title">${item.title}</h3>
          <p class="card-theme">${item.theme}</p>
        </div>
        <div class="card-footer">
          <span class="card-meta-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M20.4 14.5 L16 10 L4 20"/></svg>
            ${shotCount} ${typeof shotCount === 'number' ? 'shots' : ''}
          </span>
          <span class="expand-link">View Details &rarr;</span>
        </div>
      `;

      card.addEventListener('click', () => {
        const indexInMainData = contentData.findIndex(d => d.id === item.id);
        openModal(indexInMainData);
      });

      gridContainer.appendChild(card);
    });
  }

  // Filter Buttons Event Listeners
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderGrid();
    });
  });

  // Search Input Event Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderGrid();
    });
  }

  // Open Modal Function
  function openModal(dataIndex) {
    if (dataIndex < 0 || dataIndex >= contentData.length) return;
    activeModalIndex = dataIndex;
    const item = contentData[dataIndex];

    // Set Header
    modalIndexBadge.textContent = `CONTENT ${item.number} OF 09`;
    modalTypeBadge.textContent = item.type === 'Reel' ? '🎥 REEL' : '📸 POST';
    modalTypeBadge.className = `card-badge ${item.type === 'Reel' ? 'badge-reel' : 'badge-post'}`;
    modalTitle.textContent = item.title;

    // Render Body Sections
    let htmlContent = '';

    // Theme & Notes
    htmlContent += `
      <div class="modal-section">
        <div class="section-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          CONCEPT OVERVIEW
        </div>
        <p style="font-size: 1rem; color: var(--color-text-main); font-weight: 500; margin-bottom: 12px;">${item.theme}</p>
        ${item.productionNote ? `<div class="note-box">${item.productionNote}</div>` : ''}
        ${item.audioNote ? `<div class="note-box terracotta"><strong>Audio Note:</strong> ${item.audioNote}</div>` : ''}
        ${item.editNote ? `<div class="note-box terracotta"><strong>Editing Sequence:</strong> ${item.editNote}</div>` : ''}
      </div>
    `;

    // Shot List (Items 1-7, 9)
    if (item.shotList) {
      htmlContent += `
        <div class="modal-section">
          <div class="section-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            SHOT LIST (${item.shotList.length} SHOTS)
          </div>
          <div class="shot-list-grid">
            ${item.shotList.map(shot => `
              <div class="shot-item">
                <span class="shot-number">${shot.num}</span>
                <span class="shot-desc">${shot.desc}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Item 3: Voiceover Script Table
    if (item.voiceover) {
      htmlContent += `
        <div class="modal-section">
          <div class="section-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            TIMED VOICEOVER SCRIPT (~20–23 SEC)
          </div>
          <div class="script-table-wrapper">
            <table class="script-table">
              <thead>
                <tr>
                  <th>Shot</th>
                  <th>Time</th>
                  <th>Nepali Voiceover</th>
                  <th>English Meaning</th>
                </tr>
              </thead>
              <tbody>
                ${item.voiceover.map(row => `
                  <tr>
                    <td style="font-weight:600; color: var(--color-primary);">${row.shot}</td>
                    <td><span class="time-badge">${row.time}</span></td>
                    <td class="script-nepali">"${row.nepali}"</td>
                    <td class="script-english">"${row.english}"</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // Item 5: On-Screen Text Options
    if (item.textOptions) {
      htmlContent += `
        <div class="modal-section">
          <div class="section-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
            ON-SCREEN TEXT OPTIONS
          </div>
          <div class="text-options-grid">
            ${item.textOptions.map(opt => `
              <div class="text-option-card ${opt.isRecommended ? 'recommended' : ''}">
                <div class="option-text">"${opt.text}"</div>
                ${opt.isRecommended ? '<span class="rec-badge">Recommended ⭐</span>' : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Item 8: Multi-version Location Reveal (Original vs Alternate)
    if (item.locationVersions) {
      const orig = item.locationVersions.original;
      const alt = item.locationVersions.alternate;

      htmlContent += `
        <div class="modal-section">
          <div class="section-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            EXECUTION CONCEPTS (CHOOSE ONE)
          </div>
          <div class="version-tabs">
            <button class="ver-tab-btn active" id="ver-tab-orig" data-ver="orig">Original Concept (Multi-Location)</button>
            <button class="ver-tab-btn" id="ver-tab-alt" data-ver="alt">Easier Alternate (Single-Location)</button>
          </div>

          <div id="ver-content-orig" class="ver-content">
            <div class="note-box terracotta" style="margin-bottom:14px;">
              <strong>Note:</strong> ${orig.note}
            </div>
            <div class="script-table-wrapper">
              <table class="script-table">
                <thead>
                  <tr>
                    <th>Beat / Location</th>
                    <th>Time</th>
                    <th>Action / Camera Direction</th>
                  </tr>
                </thead>
                <tbody>
                  ${orig.beats.map(b => `
                    <tr>
                      <td style="font-weight:600; color:var(--color-primary);">${b.loc}</td>
                      <td><span class="time-badge">${b.time}</span></td>
                      <td style="color:var(--color-text-main);">${b.action}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div id="ver-content-alt" class="ver-content" style="display:none;">
            <div class="note-box" style="margin-bottom:14px;">
              <strong>Note:</strong> ${alt.note}
            </div>
            <div class="script-table-wrapper">
              <table class="script-table">
                <thead>
                  <tr>
                    <th>Beat / Location</th>
                    <th>Time</th>
                    <th>Action / Camera Direction</th>
                  </tr>
                </thead>
                <tbody>
                  ${alt.beats.map(b => `
                    <tr>
                      <td style="font-weight:600; color:var(--color-primary);">${b.loc}</td>
                      <td><span class="time-badge">${b.time}</span></td>
                      <td style="color:var(--color-text-main);">${b.action}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    // Caption Box
    htmlContent += `
      <div class="modal-section">
        <div class="section-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          CAPTION (COPYABLE)
        </div>
        <div class="caption-box">
          <p class="caption-text">"${item.caption}"</p>
          <button class="copy-btn" id="copy-caption-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy Caption
          </button>
        </div>
      </div>
    `;

    // SEO Keywords & Hashtags
    htmlContent += `
      <div class="modal-section">
        <div class="section-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
          HASHTAGS & SEO TAGS (${item.hashtags.length})
        </div>
        <div class="hashtags-container">
          ${item.hashtags.map(tag => `<span class="hashtag-pill">${tag}</span>`).join('')}
        </div>
        <button class="copy-btn" id="copy-hashtags-btn" style="margin-top:16px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy All Hashtags
        </button>
      </div>
    `;

    modalBody.innerHTML = htmlContent;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Hash sync
    window.location.hash = `content-${item.id}`;

    // Attach Version Tab Listeners for Item 8
    if (item.locationVersions) {
      const btnOrig = document.getElementById('ver-tab-orig');
      const btnAlt = document.getElementById('ver-tab-alt');
      const contentOrig = document.getElementById('ver-content-orig');
      const contentAlt = document.getElementById('ver-content-alt');

      if (btnOrig && btnAlt) {
        btnOrig.addEventListener('click', () => {
          btnOrig.classList.add('active');
          btnAlt.classList.remove('active');
          contentOrig.style.display = 'block';
          contentAlt.style.display = 'none';
        });

        btnAlt.addEventListener('click', () => {
          btnAlt.classList.add('active');
          btnOrig.classList.remove('active');
          contentAlt.style.display = 'block';
          contentOrig.style.display = 'none';
        });
      }
    }

    // Attach Copy Listeners
    const copyCaptionBtn = document.getElementById('copy-caption-btn');
    if (copyCaptionBtn) {
      copyCaptionBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(item.caption).then(() => {
          showToast("Caption copied to clipboard! 📋");
        });
      });
    }

    const copyHashtagsBtn = document.getElementById('copy-hashtags-btn');
    if (copyHashtagsBtn) {
      copyHashtagsBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(item.hashtags.join(' ')).then(() => {
          showToast("All hashtags copied to clipboard! 🏷️");
        });
      });
    }
  }

  // Close Modal Function
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    activeModalIndex = null;
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Modal Nav Buttons
  modalPrevBtn.addEventListener('click', () => {
    if (activeModalIndex !== null) {
      const prevIndex = (activeModalIndex - 1 + contentData.length) % contentData.length;
      openModal(prevIndex);
    }
  });

  modalNextBtn.addEventListener('click', () => {
    if (activeModalIndex !== null) {
      const nextIndex = (activeModalIndex + 1) % contentData.length;
      openModal(nextIndex);
    }
  });

  // Keyboard shortcut (Esc to close, Left/Right for nav)
  document.addEventListener('keydown', (e) => {
    if (!modalOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') modalPrevBtn.click();
    if (e.key === 'ArrowRight') modalNextBtn.click();
  });

  // Toast Function
  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Handle URL Hash on initial load
  function checkUrlHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#content-')) {
      const id = parseInt(hash.replace('#content-', ''), 10);
      const index = contentData.findIndex(item => item.id === id);
      if (index !== -1) {
        openModal(index);
      }
    }
  }

  // Initialize
  updateStats();
  renderGrid();
  checkUrlHash();
});
