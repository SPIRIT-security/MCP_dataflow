/* ============================================
   Client-side Upload Helper
   Collects localStorage data and uploads to
   GitHub via the Vercel API.
   ============================================ */

// Config — update this to your deployed API URL
var API_URL = 'https://mcp-dataflow.vercel.app/api/upload';

/**
 * Initialize or get session start time.
 */
function getSessionDuration() {
  const key = 'mcp_session_start';
  let startTime = localStorage.getItem(key);
  if (!startTime) {
    startTime = Date.now().toString();
    localStorage.setItem(key, startTime);
  }
  return {
    sessionStart: new Date(parseInt(startTime)).toISOString(),
    sessionDurationMs: Date.now() - parseInt(startTime),
    sessionDurationMin: Math.round((Date.now() - parseInt(startTime)) / 60000),
  };
}

/**
 * Collect all relevant localStorage data into a single object.
 */
function collectAllData() {
  const data = {
    exportedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    session: getSessionDuration(),
    tracking: null,
    miniSurveys: null,
    surveyResponses: null,
    scenarioOrder: null,
  };

  try {
    const raw = localStorage.getItem('claude_mcp_tracking');
    data.tracking = raw ? JSON.parse(raw) : null;
  } catch (e) {}

  try {
    const raw = localStorage.getItem('mcp_mini_surveys');
    data.miniSurveys = raw ? JSON.parse(raw) : null;
  } catch (e) {}

  try {
    const raw = localStorage.getItem('mcp_survey_responses');
    data.surveyResponses = raw ? JSON.parse(raw) : null;
  } catch (e) {}

  try {
    const raw = localStorage.getItem('claude_mcp_scenario_order');
    data.scenarioOrder = raw ? JSON.parse(raw) : null;
  } catch (e) {}

  return data;
}

/**
 * Generate a unique filename.
 */
function generateFileName() {
  const now = new Date();
  const ts = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const random = Math.random().toString(36).slice(2, 6);
  return `survey_${ts}_${random}.json`;
}

/**
 * Upload JSON data to GitHub via the API endpoint.
 * @param {Object} data - The data to upload
 * @returns {Promise<Object>} - API response
 */
async function uploadToGitHub(data) {
  const fileName = generateFileName();
  const jsonStr = JSON.stringify(data, null, 2);
  const content = btoa(unescape(encodeURIComponent(jsonStr))); // base64 encode

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, content }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Upload failed: ${response.status} ${errText}`);
  }

  const result = await response.json();
  result.fileName = fileName; // Return fileName for display
  return result;
}
