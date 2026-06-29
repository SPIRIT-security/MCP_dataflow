/* ============================================
   Mini Survey Logic
   ============================================ */

const SURVEY_KEY = 'mcp_mini_surveys';

// Task-specific MCP names for Q2
const MCP_NAMES = {
  A: 'Google Calendar MCP server',
  B: 'Filesystem MCP server',
  C: 'Google Calendar and Filesystem MCP servers',
};

function parseParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    prompt: params.get('prompt'),
    mcp: params.get('mcp'),
    scenario: `${params.get('prompt')}-${params.get('mcp')}`,
  };
}

function getSurveyData() {
  try { const raw = localStorage.getItem(SURVEY_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

function saveSurveyData(data) {
  localStorage.setItem(SURVEY_KEY, JSON.stringify(data));
}

function init() {
  const { prompt, mcp, scenario } = parseParams();
  if (!prompt) { window.location.href = 'homepage.html'; return; }

  // Update Q2 with task-specific MCP name
  const mcpName = MCP_NAMES[prompt] || 'MCP server';
  document.getElementById('q2Text').innerHTML = `What data do you think the <strong>${mcpName}</strong> can access? <span class="ms-hint">(Select all that apply)</span>`;

  // Handle submit
  document.getElementById('msForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const q1 = Array.from(document.querySelectorAll('input[name="q1"]:checked')).map(el => el.value);
    const q2 = Array.from(document.querySelectorAll('input[name="q2"]:checked')).map(el => el.value);
    const q3 = document.querySelector('input[name="q3"]:checked')?.value;
    const q4 = document.querySelector('input[name="q4"]:checked')?.value;

    if (q1.length === 0 || q2.length === 0 || !q3 || !q4) {
      document.getElementById('msWarning').style.display = 'block';
      return;
    }

    const surveys = getSurveyData();
    surveys.push({
      scenario,
      prompt,
      mcp,
      q1, q2, q3: parseInt(q3), q4: parseInt(q4),
      timestamp: new Date().toISOString(),
    });
    saveSurveyData(surveys);

    window.location.href = 'homepage.html';
  });
}

document.addEventListener('DOMContentLoaded', init);
