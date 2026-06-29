/* ============================================
   Homepage Logic — Simplified
   ============================================ */

const TRACKING_KEY = 'claude_mcp_tracking';
const ORDER_KEY = 'claude_mcp_scenario_order';

function getTrackingData() {
  try { const raw = localStorage.getItem(TRACKING_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function getCompletedScenarios() {
  const data = getTrackingData();
  const result = Array.isArray(data?.completedScenarios) ? data.completedScenarios : [];
  console.log('📋 Homepage completed:', result.length, '/ 6', result.map(s => `${s.prompt}-${s.mcp}`));
  return result;
}
function saveTrackingData(data) {
  try { localStorage.setItem(TRACKING_KEY, JSON.stringify(data, null, 2)); } catch (e) {}
}
function trackEvent(type, detail = {}) {
  const data = getTrackingData(); if (!data) return;
  data.events.push({ eventId: 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8), type, timestamp: new Date().toISOString(), detail });
  saveTrackingData(data);
}

function getMcpOrder() {
  try { const raw = localStorage.getItem(ORDER_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function initMcpOrder() {
  let order = getMcpOrder();
  if (!order) {
    const prompts = ['A', 'B', 'C'], mcpTypes = ['anthropic', 'third-party'];
    order = {};
    prompts.forEach(p => { order[p] = [...mcpTypes].sort(() => Math.random() - 0.5); });
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  }
  return order;
}

// Scenario labels
const SCENARIO_LABELS = { A: 'Scenario-Calendar', B: 'Scenario-Filesystem', C: 'Scenario-Calendar+Filesystem' };
const MCP_LABELS = { 'anthropic': 'Anthropic owned', 'third-party': 'Third party' };

// ── Build Scenario Grid ───────────────────────────
function buildScenarioGrid() {
  const completed = getCompletedScenarios();
  const order = initMcpOrder();
  const grid = document.getElementById('scenarioGrid');
  const countEl = document.getElementById('scenarioCount');
  let doneCount = 0;

  let html = '';
  ['A', 'B', 'C'].forEach(prompt => {
    order[prompt].forEach(mcp => {
      const mcpLabel = MCP_LABELS[mcp];
      const isDone = completed.some(s => s.prompt === prompt && s.mcp === mcp);
      if (isDone) doneCount++;
      const scenarioKey = `${prompt}-${mcp}`;
      html += `<div class="hp-scenario-item${isDone ? ' completed' : ''}" onclick="goToDetail('${scenarioKey}')">
        ${isDone ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'}
        ${SCENARIO_LABELS[prompt]} · ${mcpLabel}
      </div>`;
    });
  });

  grid.innerHTML = html;
  countEl.textContent = `${doneCount}/6`;
}

function goToDetail(scenarioKey) {
  trackEvent('homepage_scenario_click', { scenarioKey });
  window.location.href = `mcp-detail.html?scenario=${scenarioKey}`;
}

// ── Completion Modal ──────────────────────────────
function checkCompletionModal() {
  const completed = getCompletedScenarios();
  if (completed.length >= 6) {
    const dismissed = sessionStorage.getItem('survey_modal_dismissed');
    if (!dismissed) { setTimeout(showCompletionModal, 600); }
    else { const btn = document.getElementById('surveyReopenBtn'); if (btn) btn.style.display = 'inline-flex'; }
  }
}
function showCompletionModal() {
  const overlay = document.getElementById('completionModalOverlay'), modal = document.getElementById('completionModal');
  if (!overlay || !modal) return;
  modal.classList.remove('closing'); overlay.classList.add('visible'); modal.classList.add('visible');
  trackEvent('homepage_completion_modal_show', {});
}
function hideCompletionModal() {
  const overlay = document.getElementById('completionModalOverlay'), modal = document.getElementById('completionModal');
  if (!overlay || !modal) return;
  modal.classList.add('closing');
  setTimeout(() => { overlay.classList.remove('visible'); modal.classList.remove('visible', 'closing'); }, 280);
  const btn = document.getElementById('surveyReopenBtn'); if (btn) { btn.style.display = 'inline-flex'; btn.style.animation = 'none'; btn.offsetHeight; btn.style.animation = 'fadeSlideIn 0.4s ease'; }
  sessionStorage.setItem('survey_modal_dismissed', 'true');
  trackEvent('homepage_completion_modal_dismiss', {});
}

// ── Init ──────────────────────────────────────────
function init() {
  trackEvent('homepage_enter', { completedScenarios: getCompletedScenarios() });
  buildScenarioGrid();
  checkCompletionModal();

  document.getElementById('completionModalClose').addEventListener('click', hideCompletionModal);
  document.getElementById('completionModalOverlay').addEventListener('click', hideCompletionModal);
  document.getElementById('surveyReopenBtn').addEventListener('click', () => { sessionStorage.removeItem('survey_modal_dismissed'); showCompletionModal(); });

  window.addEventListener('beforeunload', () => { trackEvent('homepage_leave', {}); });
  document.addEventListener('visibilitychange', () => { trackEvent(document.hidden ? 'homepage_hidden' : 'homepage_visible', {}); });
}
document.addEventListener('DOMContentLoaded', init);
