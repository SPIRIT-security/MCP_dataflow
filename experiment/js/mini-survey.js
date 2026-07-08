const SURVEY_KEY = 'mcp_mini_surveys';
const MCP_NAMES = { A: 'Google Calendar MCP server', B: 'Filesystem MCP server', C: 'Google Calendar MCP server and Filesystem MCP server' };
const Q1_TEXTS = {
  A: 'What data do you think Claude can receive from the Google Calendar MCP server in this scenario?',
  B: 'What data do you think Claude can receive from the Filesystem MCP server in this scenario?',
  C: 'What data do you think Claude can receive from the Google Calendar MCP server and Filesystem MCP server in this scenario?'
};
const Q2_TEXTS = {
  A: 'What data do you think the Google Calendar MCP server can receive from Claude in this scenario?',
  B: 'What data do you think the Filesystem MCP server can receive from Claude in this scenario?',
  C: 'What data do you think the Google Calendar MCP server and Filesystem MCP server can access in this scenario?'
};

function parseParams() {
  const params = new URLSearchParams(window.location.search);
  return { prompt: params.get('prompt'), mcp: params.get('mcp'), scenario: `${params.get('prompt')}-${params.get('mcp')}` };
}
function getSurveyData() { try { const raw = localStorage.getItem(SURVEY_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; } }
function saveSurveyData(data) { localStorage.setItem(SURVEY_KEY, JSON.stringify(data)); }

function init() {
  const { prompt, mcp, scenario } = parseParams();
  if (!prompt) { window.location.href = 'homepage.html'; return; }

  // Show/hide options based on prompt
  // opt-A: Calendar items (show in A), opt-B: Filesystem items (show in B), opt-C: Calendar items (show in C)
  // opt-C-only: Filesystem items with C-specific values (show only in C)
  // Items with both opt-A and opt-C: show in both A and C
  // Items with opt-A only: show only in A
  // Items with opt-B only: show only in B
  document.querySelectorAll('.opt-A, .opt-B, .opt-C, .opt-C-only').forEach(el => {
    let visible = false;
    if (el.classList.contains('opt-A') && prompt === 'A') visible = true;
    if (el.classList.contains('opt-B') && prompt === 'B') visible = true;
    if (el.classList.contains('opt-C') && prompt === 'C') visible = true;
    if (el.classList.contains('opt-C-only') && prompt === 'C') visible = true;
    el.classList.toggle('opt-hidden', !visible);
  });

  // Update Q1 text
  document.getElementById('q1Text').innerHTML = `${Q1_TEXTS[prompt]} <span class="ms-hint">(Select all that apply)</span>`;

  // Update Q2 text
  document.getElementById('q2Text').innerHTML = `${Q2_TEXTS[prompt]} <span class="ms-hint">(Select all that apply)</span>`;

  // Handle submit
  document.getElementById('msForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const q1 = Array.from(document.querySelectorAll('input[name="q1"]:checked')).map(el => el.value);
    const q2 = Array.from(document.querySelectorAll('input[name="q2"]:checked')).map(el => el.value);
    const q3 = document.querySelector('input[name="q3"]:checked')?.value;
    const q4 = document.querySelector('input[name="q4"]:checked')?.value;
    if (q1.length === 0 || q2.length === 0 || !q3 || !q4) { document.getElementById('msWarning').style.display = 'block'; return; }
    const surveys = getSurveyData();
    surveys.push({ scenario, prompt, mcp, q1, q2, q3: parseInt(q3), q4: parseInt(q4), timestamp: new Date().toISOString() });
    saveSurveyData(surveys);
    window.location.href = 'homepage.html';
  });
}
document.addEventListener('DOMContentLoaded', init);
