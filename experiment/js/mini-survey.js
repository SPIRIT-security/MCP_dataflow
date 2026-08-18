const SURVEY_KEY = 'mcp_mini_surveys';
const MCP_NAMES = { A: 'Google Calendar MCP server', B: 'Filesystem MCP server', C: 'Google Calendar MCP server and Filesystem MCP server' };
const Q1_TEXTS = {
  A: 'What data do you think Claude can receive from the Google Calendar MCP server in this scenario?',
  B: 'What data do you think Claude can receive from the Filesystem MCP server in this scenario?'
};
const Q2_TEXTS = {
  A: 'What data do you think the Google Calendar MCP server can receive from Claude in this scenario?',
  B: 'What data do you think the Filesystem MCP server can receive from Claude in this scenario?'
};

function parseParams() {
  const params = new URLSearchParams(window.location.search);
  return { prompt: params.get('prompt'), mcp: params.get('mcp'), scenario: `${params.get('prompt')}-${params.get('mcp')}` };
}
function getSurveyData() { try { const raw = localStorage.getItem(SURVEY_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; } }
function saveSurveyData(data) { localStorage.setItem(SURVEY_KEY, JSON.stringify(data)); }

function checkedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
}
function showWarning() { document.getElementById('msWarning').style.display = 'block'; }

function init() {
  const { prompt, mcp, scenario } = parseParams();
  if (!prompt) { window.location.href = 'homepage.html'; return; }

  // Q1/Q2 (single question per direction) are used for prompts A & B:
  // opt-A: Calendar options (show in A), opt-B: Filesystem options (show in B)
  document.querySelectorAll('#q1Question .opt-A, #q1Question .opt-B, #q2Question .opt-A, #q2Question .opt-B').forEach(el => {
    let visible = false;
    if (el.classList.contains('opt-A') && prompt === 'A') visible = true;
    if (el.classList.contains('opt-B') && prompt === 'B') visible = true;
    el.classList.toggle('opt-hidden', !visible);
  });

  // Prompt C: hide the single Q1/Q2 and show the split sub-questions instead
  document.getElementById('q1Question').classList.toggle('opt-hidden', prompt === 'C');
  document.getElementById('q2Question').classList.toggle('opt-hidden', prompt === 'C');
  document.querySelectorAll('.c-split').forEach(el => el.classList.toggle('opt-hidden', prompt !== 'C'));

  if (prompt !== 'C') {
    document.getElementById('q1Text').innerHTML = `${Q1_TEXTS[prompt]} <span class="ms-hint">(Select all that apply)</span>`;
    document.getElementById('q2Text').innerHTML = `${Q2_TEXTS[prompt]} <span class="ms-hint">(Select all that apply)</span>`;
  }

  // Handle submit
  document.getElementById('msForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const q3 = document.querySelector('input[name="q3"]:checked')?.value;
    const q4 = document.querySelector('input[name="q4"]:checked')?.value;
    const base = { scenario, prompt, mcp, q3: parseInt(q3), q4: parseInt(q4), timestamp: new Date().toISOString() };

    let entry;
    if (prompt === 'C') {
      const q1a = checkedValues('q1a');
      const q1b = checkedValues('q1b');
      const q2a = checkedValues('q2a');
      const q2b = checkedValues('q2b');
      if (!q1a.length || !q1b.length || !q2a.length || !q2b.length || !q3 || !q4) { showWarning(); return; }
      entry = { ...base, q1a, q1b, q2a, q2b };
    } else {
      const q1 = checkedValues('q1');
      const q2 = checkedValues('q2');
      if (!q1.length || !q2.length || !q3 || !q4) { showWarning(); return; }
      entry = { ...base, q1, q2 };
    }
    const surveys = getSurveyData();
    surveys.push(entry);
    saveSurveyData(surveys);
    window.location.href = 'homepage.html';
  });
}
document.addEventListener('DOMContentLoaded', init);
