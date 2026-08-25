/**
 * Magishree Bagaicha Resort - Bhadra Content Calendar Controller
 * Robust Supabase & Local Fallback Integration
 */

// Initialize Supabase Client (if valid configuration provided)
const SUPABASE_URL = 'https://giofettzlbggkustigyq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_jeGM2mbAkaeKnU7H1RmP1g_kSAtpaFX';

let supabase = null;
try {
  if (window.supabase && window.supabase.createClient && SUPABASE_URL && !SUPABASE_URL.includes('your-supabase-id')) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.warn('Supabase initialization fallback to local contentData:', e);
}

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const gridContainer = document.getElementById('content-grid');
  const searchInput = document.getElementById('search-input');
  const tabButtons = document.querySelectorAll('.filter-tabs .tab-btn');
  const addContentBtn = document.getElementById('add-content-btn');

  // Modal Elements (Detail View)
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalPrevBtn = document.getElementById('modal-prev');
  const modalNextBtn = document.getElementById('modal-next');
  const modalEditBtn = document.getElementById('modal-edit-btn');
  const modalDeleteBtn = document.getElementById('modal-delete-btn');
  const modalBody = document.getElementById('modal-body-content');
  const modalIndexBadge = document.getElementById('modal-index-badge');
  const modalTypeBadge = document.getElementById('modal-type-badge');
  const modalTitle = document.getElementById('modal-title');

  // Form Modal Elements (Add / Edit Event)
  const formModalOverlay = document.getElementById('form-modal-overlay');
  const formModalTitle = document.getElementById('form-modal-title');
  const formModalClose = document.getElementById('form-modal-close');
  const formCancelBtn = document.getElementById('form-cancel-btn');
  const eventForm = document.getElementById('event-form');
  const eventIdInput = document.getElementById('event-id');
  const eventTitleInput = document.getElementById('event-title');
  const eventTypeInput = document.getElementById('event-type');
  const eventNumberInput = document.getElementById('event-number');
  const eventThemeInput = document.getElementById('event-theme');
  const eventCaptionInput = document.getElementById('event-caption');
  const eventHashtagsInput = document.getElementById('event-hashtags');

  // Stats Counters
  const countAll = document.getElementById('count-all');
  const countReels = document.getElementById('count-reels');
  const countPosts = document.getElementById('count-posts');

  // Application State - DEFAULT TO ALL 9 CONTENT PIECES FROM DATA.JS IMMEDIATELY
  let eventsList = (typeof contentData !== 'undefined' && Array.isArray(contentData)) ? [...contentData] : [];
  let currentFilter = 'all';
  let currentSearchQuery = '';
  let activeModalIndex = null;

  /* ==========================================================================
     SUPABASE ASYNCHRONOUS DATABASE OPERATIONS (Load, Add, Update, Delete)
     ========================================================================== */

  // Normalize event record structure from DB
  function normalizeEvent(row) {
    return {
      id: row.id,
      number: row.number || row.num || (row.id ? String(row.id).padStart(2, '0') : '01'),
      type: row.type || 'Reel',
      title: row.title || 'Untitled Event',
      theme: row.theme || row.description || '',
      productionNote: row.production_note || row.productionNote || null,
      audioNote: row.audio_note || row.audioNote || null,
      editNote: row.edit_note || row.editNote || null,
      shotList: typeof row.shot_list === 'string' ? JSON.parse(row.shot_list) : (row.shot_list || row.shotList || null),
      voiceover: typeof row.voiceover === 'string' ? JSON.parse(row.voiceover) : (row.voiceover || null),
      textOptions: typeof row.text_options === 'string' ? JSON.parse(row.text_options) : (row.text_options || row.textOptions || null),
      locationVersions: typeof row.location_versions === 'string' ? JSON.parse(row.location_versions) : (row.location_versions || row.locationVersions || null),
      caption: row.caption || '',
      hashtags: Array.isArray(row.hashtags) ? row.hashtags : (typeof row.hashtags === 'string' ? row.hashtags.split(' ') : (row.hashtags || []))
    };
  }

  // Load / Fetch Events from Supabase Database safely without blocking UI
  async function loadEventsFromSupabase() {
    // 1. Instantly render default 9 items first so page is NEVER empty!
    updateStats();
    renderGrid();
    checkUrlHash();

    if (!supabase) return;

    try {
      // Timeout controller to prevent hanging if URL fails to resolve
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('id', { ascending: true });

      clearTimeout(timeoutId);

      if (!error && data && data.length > 0) {
        eventsList = data.map(normalizeEvent);
        updateStats();
        renderGrid();
        showToast('Synced with Supabase DB 🟢');
      } else if (!error && data && data.length === 0) {
        // Table exists but empty -> auto seed initial 9 items to Supabase!
        seedInitialEventsToSupabase(eventsList);
      }
    } catch (err) {
      console.log('Supabase connection deferred, showing local content calendar items:', err.message || err);
    }
  }

  // Seed Initial Events to Supabase if table is fresh
  async function seedInitialEventsToSupabase(initialItems) {
    if (!supabase || !initialItems || initialItems.length === 0) return;
    try {
      const rowsToInsert = initialItems.map(item => ({
        id: item.id,
        number: item.number,
        type: item.type,
        title: item.title,
        theme: item.theme,
        production_note: item.productionNote || null,
        audio_note: item.audioNote || null,
        edit_note: item.editNote || null,
        shot_list: item.shotList ? JSON.stringify(item.shotList) : null,
        voiceover: item.voiceover ? JSON.stringify(item.voiceover) : null,
        text_options: item.textOptions ? JSON.stringify(item.textOptions) : null,
        location_versions: item.locationVersions ? JSON.stringify(item.locationVersions) : null,
        caption: item.caption,
        hashtags: item.hashtags
      }));

      await supabase.from('events').insert(rowsToInsert);
    } catch (err) {
      console.warn('Auto-seed to Supabase deferred:', err);
    }
  }

  // Add Event to Supabase
  async function addEventToSupabase(newEventData) {
    const nextId = eventsList.length > 0 ? Math.max(...eventsList.map(e => e.id || 0)) + 1 : 1;
    const formattedEvent = {
      id: nextId,
      number: newEventData.number || String(nextId).padStart(2, '0'),
      type: newEventData.type,
      title: newEventData.title,
      theme: newEventData.theme,
      caption: newEventData.caption,
      hashtags: newEventData.hashtags
    };

    eventsList.push(formattedEvent);
    updateStats();
    renderGrid();
    closeFormModal();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('events')
          .insert([{
            number: formattedEvent.number,
            type: formattedEvent.type,
            title: formattedEvent.title,
            theme: formattedEvent.theme,
            caption: formattedEvent.caption,
            hashtags: formattedEvent.hashtags
          }])
          .select();

        if (error) {
          showToast('Saved locally ✨');
        } else if (data && data[0]) {
          formattedEvent.id = data[0].id;
          showToast('Event added to Supabase DB! ✨');
        }
      } catch (err) {
        showToast('Saved locally ✨');
      }
    } else {
      showToast('Event added locally! ✨');
    }
  }

  // Update Event in Supabase
  async function updateEventInSupabase(id, updatedFields) {
    const index = eventsList.findIndex(e => e.id === id);
    if (index === -1) return;

    eventsList[index] = { ...eventsList[index], ...updatedFields };
    updateStats();
    renderGrid();
    closeFormModal();
    if (activeModalIndex !== null) openModal(index);

    if (supabase) {
      try {
        const { error } = await supabase
          .from('events')
          .update({
            title: updatedFields.title,
            type: updatedFields.type,
            number: updatedFields.number,
            theme: updatedFields.theme,
            caption: updatedFields.caption,
            hashtags: updatedFields.hashtags
          })
          .eq('id', id);

        if (!error) {
          showToast('Event updated in Supabase DB! 🔄');
        } else {
          showToast('Updated locally 🔄');
        }
      } catch (err) {
        showToast('Updated locally 🔄');
      }
    } else {
      showToast('Event updated locally! 🔄');
    }
  }

  // Delete Event from Supabase
  async function deleteEventFromSupabase(id) {
    if (!confirm('Are you sure you want to delete this content event?')) return;

    const index = eventsList.findIndex(e => e.id === id);
    if (index === -1) return;

    eventsList.splice(index, 1);
    closeModal();
    updateStats();
    renderGrid();

    if (supabase) {
      try {
        await supabase.from('events').delete().eq('id', id);
        showToast('Event deleted 🗑️');
      } catch (err) {
        showToast('Event deleted locally');
      }
    } else {
      showToast('Event deleted locally');
    }
  }

  /* ==========================================================================
     UI RENDERING & CONTROLLERS
     ========================================================================== */

  // Initialize Stats
  function updateStats() {
    const reels = eventsList.filter(item => item.type === 'Reel').length;
    const posts = eventsList.filter(item => item.type === 'Post').length;
    if (countAll) countAll.textContent = eventsList.length;
    if (countReels) countReels.textContent = reels;
    if (countPosts) countPosts.textContent = posts;
  }

  // Filter Data
  function getFilteredData() {
    return eventsList.filter(item => {
      const matchesFilter = 
        currentFilter === 'all' || 
        (currentFilter === 'reels' && item.type === 'Reel') ||
        (currentFilter === 'posts' && item.type === 'Post');

      const query = currentSearchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.theme && item.theme.toLowerCase().includes(query)) ||
        (item.caption && item.caption.toLowerCase().includes(query)) ||
        (item.hashtags && item.hashtags.some(tag => tag.toLowerCase().includes(query))) ||
        (item.shotList && item.shotList.some(shot => (shot.desc || shot).toLowerCase().includes(query)));

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
                       (item.locationVersions ? '2 Options' : 'Brief');

      card.innerHTML = `
        <div class="card-top">
          <span class="card-index">CONTENT ${item.number || '01'} OF ${String(eventsList.length).padStart(2, '0')}</span>
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
        const indexInMainData = eventsList.findIndex(d => d.id === item.id);
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

  // Open Detail Modal
  function openModal(dataIndex) {
    if (dataIndex < 0 || dataIndex >= eventsList.length) return;
    activeModalIndex = dataIndex;
    const item = eventsList[dataIndex];

    // Set Header
    modalIndexBadge.textContent = `CONTENT ${item.number || '01'} OF ${String(eventsList.length).padStart(2, '0')}`;
    modalTypeBadge.textContent = item.type === 'Reel' ? '🎥 REEL' : '📸 POST';
    modalTypeBadge.className = `card-badge ${item.type === 'Reel' ? 'badge-reel' : 'badge-post'}`;
    modalTitle.textContent = item.title;

    // Attach Edit & Delete buttons
    if (modalEditBtn) modalEditBtn.onclick = () => openFormModal(item);
    if (modalDeleteBtn) modalDeleteBtn.onclick = () => deleteEventFromSupabase(item.id);

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

    // Shot List
    if (item.shotList && item.shotList.length > 0) {
      htmlContent += `
        <div class="modal-section">
          <div class="section-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            SHOT LIST (${item.shotList.length} SHOTS)
          </div>
          <div class="shot-list-grid">
            ${item.shotList.map((shot, idx) => `
              <div class="shot-item">
                <span class="shot-number">${shot.num || shot.number || (idx + 1)}</span>
                <span class="shot-desc">${shot.desc || shot.description || shot}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Voiceover Script Table
    if (item.voiceover && item.voiceover.length > 0) {
      htmlContent += `
        <div class="modal-section">
          <div class="section-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            TIMED VOICEOVER SCRIPT
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

    // On-Screen Text Options
    if (item.textOptions && item.textOptions.length > 0) {
      htmlContent += `
        <div class="modal-section">
          <div class="section-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
            ON-SCREEN TEXT OPTIONS
          </div>
          <div class="text-options-grid">
            ${item.textOptions.map(opt => `
              <div class="text-option-card ${opt.isRecommended ? 'recommended' : ''}">
                <div class="option-text">"${opt.text || opt}"</div>
                ${opt.isRecommended ? '<span class="rec-badge">Recommended ⭐</span>' : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Location Reveal Options (Item 8)
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
              <strong>Note:</strong> ${orig ? orig.note : ''}
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
                  ${orig && orig.beats ? orig.beats.map(b => `
                    <tr>
                      <td style="font-weight:600; color:var(--color-primary);">${b.loc}</td>
                      <td><span class="time-badge">${b.time}</span></td>
                      <td style="color:var(--color-text-main);">${b.action}</td>
                    </tr>
                  `).join('') : ''}
                </tbody>
              </table>
            </div>
          </div>

          <div id="ver-content-alt" class="ver-content" style="display:none;">
            <div class="note-box" style="margin-bottom:14px;">
              <strong>Note:</strong> ${alt ? alt.note : ''}
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
                  ${alt && alt.beats ? alt.beats.map(b => `
                    <tr>
                      <td style="font-weight:600; color:var(--color-primary);">${b.loc}</td>
                      <td><span class="time-badge">${b.time}</span></td>
                      <td style="color:var(--color-text-main);">${b.action}</td>
                    </tr>
                  `).join('') : ''}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    // Caption Box
    if (item.caption) {
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
    }

    // SEO Keywords & Hashtags
    if (item.hashtags && item.hashtags.length > 0) {
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
    }

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
          if (contentOrig) contentOrig.style.display = 'block';
          if (contentAlt) contentAlt.style.display = 'none';
        });

        btnAlt.addEventListener('click', () => {
          btnAlt.classList.add('active');
          btnOrig.classList.remove('active');
          if (contentAlt) contentAlt.style.display = 'block';
          if (contentOrig) contentOrig.style.display = 'none';
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

  // Close Detail Modal
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    activeModalIndex = null;
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  if (modalPrevBtn) {
    modalPrevBtn.addEventListener('click', () => {
      if (activeModalIndex !== null) {
        const prevIndex = (activeModalIndex - 1 + eventsList.length) % eventsList.length;
        openModal(prevIndex);
      }
    });
  }

  if (modalNextBtn) {
    modalNextBtn.addEventListener('click', () => {
      if (activeModalIndex !== null) {
        const nextIndex = (activeModalIndex + 1) % eventsList.length;
        openModal(nextIndex);
      }
    });
  }

  /* ==========================================================================
     FORM MODAL CONTROLLERS (ADD & EDIT)
     ========================================================================== */

  function openFormModal(editItem = null) {
    if (editItem) {
      formModalTitle.textContent = `Edit Event #${editItem.number || editItem.id}`;
      eventIdInput.value = editItem.id;
      eventTitleInput.value = editItem.title || '';
      eventTypeInput.value = editItem.type || 'Reel';
      eventNumberInput.value = editItem.number || '';
      eventThemeInput.value = editItem.theme || '';
      eventCaptionInput.value = editItem.caption || '';
      eventHashtagsInput.value = Array.isArray(editItem.hashtags) ? editItem.hashtags.join(' ') : (editItem.hashtags || '');
    } else {
      formModalTitle.textContent = 'Add New Content Event';
      if (eventForm) eventForm.reset();
      eventIdInput.value = '';
      eventNumberInput.value = String(eventsList.length + 1).padStart(2, '0');
    }

    formModalOverlay.classList.add('active');
  }

  function closeFormModal() {
    formModalOverlay.classList.remove('active');
  }

  if (addContentBtn) {
    addContentBtn.addEventListener('click', () => openFormModal(null));
  }

  if (formModalClose) formModalClose.addEventListener('click', closeFormModal);
  if (formCancelBtn) formCancelBtn.addEventListener('click', closeFormModal);

  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = eventIdInput.value ? parseInt(eventIdInput.value, 10) : null;
      const formData = {
        title: eventTitleInput.value.trim(),
        type: eventTypeInput.value,
        number: eventNumberInput.value.trim() || '01',
        theme: eventThemeInput.value.trim(),
        caption: eventCaptionInput.value.trim(),
        hashtags: eventHashtagsInput.value.trim().split(/\s+/).filter(Boolean)
      };

      if (id) {
        updateEventInSupabase(id, formData);
      } else {
        addEventToSupabase(formData);
      }
    });
  }

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (modalOverlay && modalOverlay.classList.contains('active')) {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft' && modalPrevBtn) modalPrevBtn.click();
      if (e.key === 'ArrowRight' && modalNextBtn) modalNextBtn.click();
    }
    if (formModalOverlay && formModalOverlay.classList.contains('active') && e.key === 'Escape') {
      closeFormModal();
    }
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

  // Handle URL Hash
  function checkUrlHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#content-')) {
      const id = parseInt(hash.replace('#content-', ''), 10);
      const index = eventsList.findIndex(item => item.id === id);
      if (index !== -1) {
        openModal(index);
      }
    }
  }

  // Initial Load (Renders 9 default items immediately & syncs with Supabase if online)
  loadEventsFromSupabase();
});
