/* ============================================
   Claude Web Interface — Main Application Logic
   Tracks all user interactions in localStorage.
   ============================================ */

// ── State ───────────────────────────────────────────
const STATE = {
  selectedPrompt: null,       // 'A' | 'B' | 'C' | null
  selectedMcp: null,          // 'anthropic' | 'third-party' | null
  locked: false,              // true when pre-filled from homepage
  promptSelectorVisible: false,
  mcpSelectorVisible: false,
  sidebarOpen: true,          // desktop default
  mobileSidebarOpen: false,
  isMobile: false,
};

// ── Prompt definitions (placeholder — edit these later) ──
const PROMPTS = {
  A: 'This is an email from my manager. Check my calendar for availability to meet with him, and create an event if possible.\n\n--- Email ---\nFrom: Manager2026@gmail.com\nTo: User2026@gmail.com\nTitle: Discuss your project\n\nDear User,\n\nI hope you\'re doing well.\n\nI\'d like to schedule a 1-hour meeting next week to review our project, discuss your progress, and address any questions or concerns you may have.\n\nHere are a few time windows that work for me (EST):\n- Monday, May 11 – 10:00 AM to 3:00 PM\n- Tuesday, May 12 – 1:00 PM to 6:00 PM\n- Wednesday, May 13 – 11:00 AM to 6:00 PM\n\nPlease let me know which time works best, and feel free to send a calendar invite once confirmed.\n\nBest regards,\nManager Test\nDepartment of Computer Science\nXX Center, XX City\n--- End of Email ---\n\nCheck my calendar for availability to meet with him, and create an event if possible.',
  B: 'Search for files related to yesterday\'s medical records in my medical folder, then read them and tell me about my condition and how to take the medication.',
  C: 'Last week I had a health checkup. Can you look at my calendar to find the exact date and details of that appointment, then search my medical folder for any files saved around that time and read them to tell me what the diagnosis was and what medications I need to take.',
};

// ── DOM refs ────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const DOM = {
  app: $('#app'),
  sidebar: $('#sidebar'),
  sidebarToggle: $('#sidebarToggle'),
  mobileSidebarToggle: $('#mobileSidebarToggle'),
  overlay: $('#overlay'),

  // Chat
  chatMessages: $('#chatMessages'),
  greeting: $('#greeting'),
  greetingTitle: $('#greetingTitle'),

  // Input
  inputArea: $('#inputArea'),
  chatInput: $('#chatInput'),
  inputContainer: $('#inputContainer'),
  inputBox: $('.input-box'),

  // Prompt selector
  promptSelector: $('#promptSelector'),
  promptCards: $$('.prompt-card'),

  // MCP selector
  mcpSelector: $('#mcpSelector'),
  mcpOptions: $$('.mcp-option'),

  // Displays
  selectedPromptDisplay: $('#selectedPromptDisplay'),
  selectedPromptLabel: $('#selectedPromptLabel'),
  selectedPromptText: $('#selectedPromptText'),
  selectedMcpDisplay: $('#selectedMcpDisplay'),
  selectedMcpLabel: $('#selectedMcpLabel'),
  clearPromptBtn: $('#clearPromptBtn'),
  clearMcpBtn: $('#clearMcpBtn'),

  // Buttons
  sendBtn: $('#sendBtn'),
  newChatBtn: $('#newChatBtn'),
  attachBtn: $('#attachBtn'),
  contextBtn: $('#contextBtn'),
  modelSelectorBtn: $('#modelSelectorBtn'),
  shareBtn: $('#shareBtn'),
  sidebarSearch: $('#sidebarSearch'),
  userProfile: $('#userProfile'),

  // History items
  historyItems: $$('.history-item'),
};

// ── Tracking System ─────────────────────────────────
const TRACKING_KEY = 'claude_mcp_tracking';

function generateId() {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getTrackingData() {
  try {
    const raw = localStorage.getItem(TRACKING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function initTracking() {
  let data = getTrackingData();
  if (!data) {
    data = {
      sessionId: `sess_${Date.now()}`,
      startedAt: new Date().toISOString(),
      events: [],
      completedScenarios: [],
    };
    saveTrackingData(data);
  } else {
    // Ensure completedScenarios array exists
    if (!Array.isArray(data.completedScenarios)) {
      data.completedScenarios = [];
      saveTrackingData(data);
    }
  }
  console.log('📋 Tracking init — completed:', data.completedScenarios.length, '/ 6');
  return data;
}

function saveTrackingData(data) {
  try {
    localStorage.setItem(TRACKING_KEY, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to save tracking data:', e);
  }
}

function trackEvent(type, detail = {}) {
  const data = getTrackingData();
  if (!data) return;

  const event = {
    eventId: generateId(),
    type,
    timestamp: new Date().toISOString(),
    detail,
  };

  data.events.push(event);
  saveTrackingData(data);

  // Also log to console for debugging
  console.log(`[Track] ${type}`, detail);

  return event;
}

function trackScenarioComplete(prompt, mcp) {
  const data = getTrackingData();
  if (!data) return;

  // Check if already completed
  const already = data.completedScenarios.find(
    (s) => s.prompt === prompt && s.mcp === mcp
  );
  if (already) return; // don't duplicate

  const entry = {
    prompt,
    mcp,
    completedAt: new Date().toISOString(),
  };

  data.completedScenarios.push(entry);
  saveTrackingData(data);

  console.log(`[Track] Scenario complete: Prompt ${prompt} + ${mcp}`);
  return entry;
}

function getCompletedScenarios() {
  const data = getTrackingData();
  return data ? data.completedScenarios : [];
}

// ── Scenario Grid ───────────────────────────────────
// ── Today's History ─────────────────────────────────
function populateTodayHistory() {
  const container = document.getElementById('todayHistoryItems');
  if (!container) return;

  const data = getTrackingData();
  const completed = data ? data.completedScenarios : [];
  const today = new Date().toISOString().slice(0, 10);

  // Always show 3 prompts, mark completed ones
  const items = ['A', 'B', 'C'].map(prompt => {
    const truncated = PROMPTS[prompt]
      ? PROMPTS[prompt].replace(/\n/g, ' ').slice(0, 40) + '...'
      : `Scenario ${prompt}`;
    const todayCompleted = completed.filter(s => s.prompt === prompt && s.completedAt && s.completedAt.startsWith(today));
    const mcpDone = todayCompleted.map(s => s.mcp === 'anthropic' ? 'A' : 'T');
    const doneLabel = mcpDone.length > 0 ? ` (${mcpDone.join(',')} done)` : '';
    return `<div class="history-item" onclick="window.location.href='index.html?prompt=${prompt}&mcp=anthropic'">
      <span class="history-title">${truncated}${doneLabel}</span>
    </div>`;
  });

  container.innerHTML = items.join('');
}

// ── Greeting ────────────────────────────────────────
function updateGreeting() {
  const hour = new Date().getHours();
  let timeOfDay;
  if (hour < 12) timeOfDay = 'morning';
  else if (hour < 18) timeOfDay = 'afternoon';
  else timeOfDay = 'evening';

  const greeting = `Good ${timeOfDay}, User`;
  DOM.greetingTitle.textContent = greeting;
}

// ── Prompt Selector ─────────────────────────────────
function openPromptSelector() {
  if (STATE.promptSelectorVisible) return;

  STATE.promptSelectorVisible = true;
  DOM.promptSelector.classList.add('visible');
  DOM.overlay.classList.add('visible');

  // Highlight already-selected prompt
  DOM.promptCards.forEach((card) => {
    if (card.dataset.prompt === STATE.selectedPrompt) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  trackEvent('prompt_selector_open', {
    hadPreviousSelection: !!STATE.selectedPrompt,
  });
}

function closePromptSelector() {
  if (!STATE.promptSelectorVisible) return;

  STATE.promptSelectorVisible = false;
  DOM.promptSelector.classList.remove('visible');

  // Only hide overlay if MCP selector is also not visible
  if (!STATE.mcpSelectorVisible) {
    DOM.overlay.classList.remove('visible');
  }

  trackEvent('prompt_selector_close', {
    selectedPrompt: STATE.selectedPrompt,
  });
}

function selectPrompt(promptKey) {
  const previousPrompt = STATE.selectedPrompt;
  STATE.selectedPrompt = promptKey;

  // Update card highlights
  DOM.promptCards.forEach((card) => {
    if (card.dataset.prompt === promptKey) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  // Update display badges (if present)
  if (DOM.selectedPromptLabel) if(DOM.selectedPromptLabel)DOM.selectedPromptLabel.textContent = promptKey;
  if (DOM.selectedPromptText) if(DOM.selectedPromptText)DOM.selectedPromptText.textContent = PROMPTS[promptKey];
  if (DOM.selectedPromptDisplay) DOM.selectedPromptDisplay.classList.add('visible');

  // Update input
  DOM.chatInput.value = PROMPTS[promptKey];
  DOM.chatInput.classList.add('has-prompt');
  // Prompt A has longer text — use taller textarea
  if (promptKey === 'A') { DOM.chatInput.rows = 16; DOM.chatInput.style.minHeight = '280px'; }
  else if (promptKey === 'C') { DOM.chatInput.rows = 3; DOM.chatInput.style.minHeight = '72px'; }
  else { DOM.chatInput.rows = 2; DOM.chatInput.style.minHeight = '48px'; }
  DOM.inputBox.classList.add('has-selection');

  // Close prompt selector
  closePromptSelector();

  // Show MCP selector
  openMcpSelector();

  // Track
  trackEvent('prompt_select', {
    prompt: promptKey,
    previousPrompt,
    promptText: PROMPTS[promptKey],
  });

  updateSendButton();
}

function clearPrompt() {
  const previousPrompt = STATE.selectedPrompt;
  STATE.selectedPrompt = null;
  STATE.selectedMcp = null;

  // Reset UI
  DOM.promptCards.forEach((card) => card.classList.remove('selected'));
  DOM.selectedPromptDisplay && DOM.selectedPromptDisplay.classList.remove('visible');
  if(DOM.selectedPromptLabel)DOM.selectedPromptLabel.textContent = '-';
  if(DOM.selectedPromptText)DOM.selectedPromptText.textContent = '';
  DOM.chatInput.value = '';
  DOM.chatInput.classList.remove('has-prompt');
  DOM.inputBox.classList.remove('has-selection');

  // Clear MCP
  DOM.mcpOptions.forEach((opt) => opt.classList.remove('selected'));
  DOM.selectedMcpDisplay && DOM.selectedMcpDisplay.classList.remove('visible');
  if(DOM.selectedMcpLabel)DOM.selectedMcpLabel.textContent = '';
  closeMcpSelector();

  updateSendButton();

  trackEvent('clear_prompt', { previousPrompt });
}

// ── MCP Selector ────────────────────────────────────
function openMcpSelector() {
  if (STATE.mcpSelectorVisible) return;
  if (!STATE.selectedPrompt) return; // requires prompt first

  STATE.mcpSelectorVisible = true;
  DOM.mcpSelector.classList.add('visible');

  // Highlight already-selected MCP
  DOM.mcpOptions.forEach((opt) => {
    if (opt.dataset.mcp === STATE.selectedMcp) {
      opt.classList.add('selected');
    } else {
      opt.classList.remove('selected');
    }
  });

  trackEvent('mcp_selector_open', {
    currentPrompt: STATE.selectedPrompt,
    hadPreviousMcp: !!STATE.selectedMcp,
  });
}

function closeMcpSelector() {
  if (!STATE.mcpSelectorVisible) return;

  STATE.mcpSelectorVisible = false;
  DOM.mcpSelector.classList.remove('visible');

  if (!STATE.promptSelectorVisible) {
    DOM.overlay.classList.remove('visible');
  }

  trackEvent('mcp_selector_close', {
    selectedMcp: STATE.selectedMcp,
  });
}

function selectMcp(mcpKey) {
  const previousMcp = STATE.selectedMcp;
  STATE.selectedMcp = mcpKey;

  // Update option highlights
  DOM.mcpOptions.forEach((opt) => {
    if (opt.dataset.mcp === mcpKey) {
      opt.classList.add('selected');
    } else {
      opt.classList.remove('selected');
    }
  });

  // Update display
  const label = mcpKey === 'anthropic' ? 'Anthropic owned' : 'Third party';
  if (DOM.selectedMcpLabel) if(DOM.selectedMcpLabel)DOM.selectedMcpLabel.textContent = label;
  if (DOM.selectedMcpDisplay) DOM.selectedMcpDisplay.classList.add('visible');

  // Close MCP selector
  closeMcpSelector();

  // Track
  trackEvent('mcp_select', {
    mcp: mcpKey,
    previousMcp,
    currentPrompt: STATE.selectedPrompt,
  });

  updateSendButton();
}

function clearMcp() {
  const previousMcp = STATE.selectedMcp;
  STATE.selectedMcp = null;

  DOM.mcpOptions.forEach((opt) => opt.classList.remove('selected'));
  DOM.selectedMcpDisplay && DOM.selectedMcpDisplay.classList.remove('visible');
  if(DOM.selectedMcpLabel)DOM.selectedMcpLabel.textContent = '';

  updateSendButton();

  trackEvent('clear_mcp', { previousMcp });
}

// ── Send Button ─────────────────────────────────────
function updateSendButton() {
  const canSend = STATE.selectedPrompt && STATE.selectedMcp;
  DOM.sendBtn.disabled = !canSend;
}

function handleSend() {
  if (!STATE.selectedPrompt || !STATE.selectedMcp) return;

  const prompt = STATE.selectedPrompt;
  const mcp = STATE.selectedMcp;
  const mcpLabel = mcp === 'anthropic' ? 'Anthropic owned' : 'Third party';

  // Track scenario completion
  trackScenarioComplete(prompt, mcp);
  trackEvent('send_message', {
    prompt,
    mcp,
    promptText: PROMPTS[prompt],
  });

  // Track entering response interface
  trackEvent('enter_response_interface', {
    prompt,
    mcp,
    mcpLabel,
    timestamp: new Date().toISOString(),
  });

  // Visual feedback
  showNotification(
    `✓ Entering response: Prompt ${prompt} + ${mcpLabel}`
  );

  // Redirect to response page after brief delay
  setTimeout(() => {
    window.location.href = `response.html?prompt=${prompt}&mcp=${mcp}`;
  }, 400);
}

function resetSelection() {
  STATE.selectedPrompt = null;
  STATE.selectedMcp = null;

  DOM.promptCards.forEach((card) => card.classList.remove('selected'));
  DOM.mcpOptions.forEach((opt) => opt.classList.remove('selected'));
  DOM.selectedPromptDisplay && DOM.selectedPromptDisplay.classList.remove('visible');
  DOM.selectedMcpDisplay && DOM.selectedMcpDisplay.classList.remove('visible');
  DOM.chatInput.value = '';
  DOM.chatInput.classList.remove('has-prompt');
  DOM.inputBox.classList.remove('has-selection');
  DOM.sendBtn.disabled = true;
}

// ── Notification ────────────────────────────────────
let notificationTimer = null;

function showNotification(message) {
  // Remove existing notification
  const existing = $('.notification');
  if (existing) existing.remove();

  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = message;
  document.body.appendChild(notif);

  // Trigger animation
  requestAnimationFrame(() => {
    notif.classList.add('show');
  });

  // Auto-hide
  if (notificationTimer) clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 400);
  }, 3000);
}

// ── Sidebar ─────────────────────────────────────────
function toggleSidebar() {
  STATE.sidebarOpen = !STATE.sidebarOpen;

  if (STATE.sidebarOpen) {
    DOM.sidebar.classList.remove('collapsed');
    DOM.mobileSidebarToggle.style.display = 'none';
  } else {
    DOM.sidebar.classList.add('collapsed');
    DOM.mobileSidebarToggle.style.display = 'flex';
  }

  trackEvent('sidebar_toggle', { open: STATE.sidebarOpen });
}

function toggleMobileSidebar() {
  STATE.mobileSidebarOpen = !STATE.mobileSidebarOpen;

  if (STATE.mobileSidebarOpen) {
    DOM.sidebar.classList.add('mobile-open');
    DOM.overlay.classList.add('visible');
  } else {
    DOM.sidebar.classList.remove('mobile-open');
    if (!STATE.promptSelectorVisible && !STATE.mcpSelectorVisible) {
      DOM.overlay.classList.remove('visible');
    }
  }

  trackEvent('mobile_sidebar_toggle', { open: STATE.mobileSidebarOpen });
}

// ── New Chat ────────────────────────────────────────
function handleNewChat() {
  resetSelection();
  closePromptSelector();
  closeMcpSelector();
  DOM.overlay.classList.remove('visible');

  trackEvent('new_chat', {
    previousPrompt: STATE.selectedPrompt,
    previousMcp: STATE.selectedMcp,
  });

  showNotification('New chat started');
}

// ── Overlay click ───────────────────────────────────
function handleOverlayClick() {
  if (STATE.mobileSidebarOpen) {
    toggleMobileSidebar();
    return;
  }

  closePromptSelector();
  closeMcpSelector();
  DOM.overlay.classList.remove('visible');
  trackEvent('overlay_click', {});
}

// ── Event Listeners ─────────────────────────────────
function setupEventListeners() {
  // ── Input click → open prompt selector ──
  DOM.chatInput.addEventListener('click', (e) => {
    e.stopPropagation();
    if (STATE.locked) return;
    if (!STATE.promptSelectorVisible) {
      openPromptSelector();
    }
    trackEvent('input_click', {
      hadPrompt: !!STATE.selectedPrompt,
      hadMcp: !!STATE.selectedMcp,
    });
  });

  // ── Prompt cards ──
  DOM.promptCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const prompt = card.dataset.prompt;
      selectPrompt(prompt);

      // Also track hover time (we record when they click)
    });

    // Track hover start
    card.addEventListener('mouseenter', () => {
      card._hoverStart = Date.now();
    });

    // Track hover duration on leave
    card.addEventListener('mouseleave', () => {
      if (card._hoverStart) {
        const duration = Date.now() - card._hoverStart;
        if (duration > 200) {
          // only track meaningful hovers
          trackEvent('prompt_card_hover', {
            prompt: card.dataset.prompt,
            durationMs: duration,
          });
        }
        card._hoverStart = null;
      }
    });
  });

  // ── MCP options ──
  DOM.mcpOptions.forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      selectMcp(opt.dataset.mcp);
    });

    // Track hover
    opt.addEventListener('mouseenter', () => {
      opt._hoverStart = Date.now();
    });
    opt.addEventListener('mouseleave', () => {
      if (opt._hoverStart) {
        const duration = Date.now() - opt._hoverStart;
        if (duration > 200) {
          trackEvent('mcp_option_hover', {
            mcp: opt.dataset.mcp,
            durationMs: duration,
          });
        }
        opt._hoverStart = null;
      }
    });
  });

  // ── Clear buttons ──
  if (DOM.clearPromptBtn) {
    DOM.clearPromptBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (STATE.locked) return;
      clearPrompt();
    });
  }
  if (DOM.clearMcpBtn) {
    DOM.clearMcpBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (STATE.locked) return;
      clearMcp();
    });
  }

  // ── Send button ──
  DOM.sendBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleSend();
  });

  // ── Sidebar toggle ──
  DOM.sidebarToggle.addEventListener('click', () => {
    if (STATE.isMobile) {
      toggleMobileSidebar();
    } else {
      toggleSidebar();
    }
  });

  // ── Mobile sidebar toggle ──
  DOM.mobileSidebarToggle.addEventListener('click', () => {
    if (STATE.isMobile) {
      toggleMobileSidebar();
    } else {
      toggleSidebar();
    }
  });

  // ── New chat ──
  DOM.newChatBtn.addEventListener('click', () => {
    handleNewChat();
  });

  // ── Overlay ──
  DOM.overlay.addEventListener('click', () => {
    handleOverlayClick();
  });

  // ── Attach button (visual, track clicks) ──
  DOM.attachBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    trackEvent('attach_click', {
      currentPrompt: STATE.selectedPrompt,
      currentMcp: STATE.selectedMcp,
    });
  });

  // ── Context button (visual, track clicks) ──
  DOM.contextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    trackEvent('context_click', {
      currentPrompt: STATE.selectedPrompt,
      currentMcp: STATE.selectedMcp,
    });
  });

  // ── Model selector (visual, track clicks) ──
  DOM.modelSelectorBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    trackEvent('model_selector_click', {
      currentPrompt: STATE.selectedPrompt,
      currentMcp: STATE.selectedMcp,
    });
  });

  // ── Share button ──
  DOM.shareBtn.addEventListener('click', () => {
    trackEvent('share_click', {
      currentPrompt: STATE.selectedPrompt,
      currentMcp: STATE.selectedMcp,
    });
  });

  // ── Search (visual, track clicks) ──
  DOM.sidebarSearch.addEventListener('click', () => {
    trackEvent('search_click', {});
  });
  const searchInput = DOM.sidebarSearch.querySelector('input');
  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      trackEvent('search_focus', {});
    });
  }

  // ── History items ──
  DOM.historyItems.forEach((item) => {
    item.addEventListener('click', () => {
      const title = item.querySelector('.history-title')?.textContent || '';
      trackEvent('history_item_click', { title });

      // Visual: remove active from all, add to clicked
      DOM.historyItems.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ── User profile ──
  DOM.userProfile.addEventListener('click', () => {
    trackEvent('user_profile_click', {});
  });

  // ── Keyboard: Escape ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (STATE.promptSelectorVisible || STATE.mcpSelectorVisible || STATE.mobileSidebarOpen) {
        handleOverlayClick();
        trackEvent('escape_key', {
          closedPromptSelector: STATE.promptSelectorVisible,
          closedMcpSelector: STATE.mcpSelectorVisible,
          closedSidebar: STATE.mobileSidebarOpen,
        });
      }
    }

    // Enter to send
    if (e.key === 'Enter' && !e.shiftKey && !e.metaKey) {
      if (
        STATE.selectedPrompt &&
        STATE.selectedMcp &&
        !STATE.promptSelectorVisible &&
        !STATE.mcpSelectorVisible
      ) {
        e.preventDefault();
        handleSend();
      }
    }
  });

  // ── Window resize ──
  window.addEventListener('resize', () => {
    const wasMobile = STATE.isMobile;
    STATE.isMobile = window.innerWidth <= 768;

    if (wasMobile !== STATE.isMobile) {
      trackEvent('viewport_change', {
        isMobile: STATE.isMobile,
        width: window.innerWidth,
      });
    }

    // Auto-close mobile sidebar on resize to desktop
    if (!STATE.isMobile && STATE.mobileSidebarOpen) {
      STATE.mobileSidebarOpen = false;
      DOM.sidebar.classList.remove('mobile-open');
      if (!STATE.promptSelectorVisible && !STATE.mcpSelectorVisible) {
        DOM.overlay.classList.remove('visible');
      }
    }
  });

  // ── Click outside input area to close selectors ──
  DOM.chatMessages.addEventListener('click', () => {
    if (STATE.promptSelectorVisible || STATE.mcpSelectorVisible) {
      closePromptSelector();
      closeMcpSelector();
      DOM.overlay.classList.remove('visible');
    }
  });
}

// ── Page visibility tracking ─────────────────────────
function setupVisibilityTracking() {
  let visibilityChangeTime = null;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      visibilityChangeTime = Date.now();
      trackEvent('page_hidden', {
        selectedPrompt: STATE.selectedPrompt,
        selectedMcp: STATE.selectedMcp,
        promptSelectorVisible: STATE.promptSelectorVisible,
        mcpSelectorVisible: STATE.mcpSelectorVisible,
      });
    } else {
      const hiddenDuration = visibilityChangeTime
        ? Date.now() - visibilityChangeTime
        : 0;
      trackEvent('page_visible', {
        hiddenDurationMs: hiddenDuration,
        selectedPrompt: STATE.selectedPrompt,
        selectedMcp: STATE.selectedMcp,
      });
    }
  });

  // Track before unload
  window.addEventListener('beforeunload', () => {
    trackEvent('session_end', {
      selectedPrompt: STATE.selectedPrompt,
      selectedMcp: STATE.selectedMcp,
      completedScenarios: getCompletedScenarios(),
    });
  });
}

// ── Export tracking data ─────────────────────────────
function setupExport() {
  // Expose export function globally
  window.exportTrackingData = function () {
    const data = getTrackingData();
    if (!data) {
      console.log('No tracking data found.');
      return null;
    }
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claude-tracking-${data.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('Tracking data exported.');
    return data;
  };

  window.clearTrackingData = function () {
    localStorage.removeItem(TRACKING_KEY);
    console.log('Tracking data cleared.');
    initTracking();
    showNotification('Tracking data cleared');
  };

  window.getTrackingData = getTrackingData;
}

// ── Init ─────────────────────────────────────────────
function init() {
  console.log('🚀 Claude MCP Simulator — Phase 1 (Input Interface)');
  console.log('📊 Tracking data stored in localStorage key:', TRACKING_KEY);
  console.log('💡 Use exportTrackingData() to download tracking data');
  console.log('💡 Use clearTrackingData() to reset tracking');

  // Check mobile
  STATE.isMobile = window.innerWidth <= 768;

  // Init tracking
  initTracking();

  // Parse URL params (from homepage)
  const params = new URLSearchParams(window.location.search);
  const urlPrompt = params.get('prompt');
  const urlMcp = params.get('mcp');
  if (urlPrompt && urlMcp && PROMPTS[urlPrompt]) {
    STATE.locked = true;
    // Pre-select prompt
    selectPrompt(urlPrompt);
    // Pre-select MCP
    setTimeout(() => {
      selectMcp(urlMcp);
    }, 100);
    // Change placeholder
    DOM.chatInput.placeholder = 'Prompt and MCP locked — click Send to continue';
  }

  trackEvent('session_start', {
    userAgent: navigator.userAgent,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    isMobile: STATE.isMobile,
    locked: STATE.locked,
    urlPrompt,
    urlMcp,
  });

  // Populate today's history
  populateTodayHistory();

  // Setup UI
  updateGreeting();
  setupEventListeners();
  setupVisibilityTracking();
  setupExport();

  // Update send button initial state
  updateSendButton();

  // Mobile: start with sidebar hidden
  if (STATE.isMobile) {
    DOM.sidebar.classList.add('collapsed');
    STATE.sidebarOpen = false;
  }

  console.log('✅ Initialization complete.');
}

// ── Start ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
