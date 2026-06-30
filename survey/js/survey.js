/* ============================================
   Survey Logic — localStorage + GitHub upload
   ============================================ */

const SURVEY_KEY = 'mcp_survey_responses';

function getSurveyData() {
  try { const raw = localStorage.getItem(SURVEY_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

function saveSurveyData(data) {
  localStorage.setItem(SURVEY_KEY, JSON.stringify(data, null, 2));
}

function trackSurveyEvent(type, detail = {}) {
  const data = getSurveyData();
  if (!data) return;
  if (!data.events) data.events = [];
  data.events.push({ type, timestamp: new Date().toISOString(), detail });
  saveSurveyData(data);
}

function initSurveyData() {
  let data = getSurveyData();
  if (!data) {
    data = { sessionId: `survey_${Date.now()}`, startedAt: new Date().toISOString(), completedAt: null, submitted: false, responses: {}, events: [] };
    saveSurveyData(data);
  }
  return data;
}

function restoreAnswers() {
  const data = getSurveyData();
  if (!data || !data.responses) return;
  Object.entries(data.responses).forEach(([name, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => { const el = document.querySelector(`input[name="${name}"][value="${v}"]`); if (el) el.checked = true; });
    } else {
      const el = document.querySelector(`input[name="${name}"][value="${value}"]`); if (el) el.checked = true;
    }
  });
}

function collectAnswers() {
  const responses = {};
  const form = document.getElementById('surveyForm');
  // Q1: multi-select
  responses.q1 = Array.from(form.querySelectorAll('input[name="q1"]:checked')).map(el => el.value);
  // Q2-Q21, Q25-Q29: single-select
  for (const name of ['q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13','q14','q15','q16','q17','q18','q19','q20','q21','q25','q26','q27','q28','q29']) {
    const el = form.querySelector(`input[name="${name}"]:checked`);
    responses[name] = el ? el.value : null;
  }
  // Q22-Q24: target (A/B/C/D) + agreement (1-5)
  for (const name of ['q22_target','q22_agree','q23_target','q23_agree','q24_target','q24_agree']) {
    const el = form.querySelector(`input[name="${name}"]:checked`);
    responses[name] = el ? el.value : null;
  }
  return responses;
}

function validateAll() {
  const r = collectAnswers();
  const unanswered = [];
  if (!r.q1 || r.q1.length === 0) unanswered.push('Q1');
  for (let i = 2; i <= 21; i++) { if (!r[`q${i}`]) unanswered.push(`Q${i}`); }
  for (const name of ['q22_target','q22_agree','q23_target','q23_agree','q24_target','q24_agree']) { if (!r[name]) unanswered.push(name.replace('_',' ').toUpperCase()); }
  for (let i = 25; i <= 29; i++) { if (!r[`q${i}`]) unanswered.push(`Q${i}`); }
  return unanswered;
}

function setupAutoSave() {
  document.getElementById('surveyForm').addEventListener('change', (e) => {
    const data = getSurveyData(); if (data) { data.responses = collectAnswers(); saveSurveyData(data); }
    trackSurveyEvent('answer_change', { question: e.target.name, value: e.target.value });
  });
}

async function handleSubmit(e) {
  e.preventDefault();
  const unanswered = validateAll();
  const warning = document.getElementById('submitWarning');
  if (unanswered.length > 0) {
    if (warning) { warning.style.display = 'block'; warning.textContent = `⚠ Please answer all questions. Unanswered: ${unanswered.join(', ')}`; }
    return;
  }
  if (warning) warning.style.display = 'none';

  const responses = collectAnswers();
  const data = getSurveyData();
  if (data) { data.responses = responses; data.submitted = true; data.completedAt = new Date().toISOString(); saveSurveyData(data); }
  trackSurveyEvent('survey_submit', { totalAnswered: Object.keys(responses).length });

  const formEl = document.getElementById('surveyForm');
  formEl.innerHTML = `<div class="success-message"><h2>⏳ Submitting...</h2><p>Uploading your data. Please wait a moment.</p></div>`;

  // Generate code before upload so it's saved even if upload fails
  const fileName = generateFileName();
  if (data) { data.uploadCode = fileName; saveSurveyData(data); }

  try {
    const allData = collectAllData();
    await uploadToGitHub(allData, fileName);
    if (data) { data.uploadStatus = 1; saveSurveyData(data); }
    formEl.innerHTML = `
      <div class="success-message">
        <h2>✅ Survey Submitted</h2>
        <p>Thank you for your responses. Your data has been uploaded successfully.</p>
        ${showCodeBox(fileName)}
      </div>`;
  } catch (uploadErr) {
    console.error('Upload failed:', uploadErr);
    if (data) { data.uploadStatus = 2; saveSurveyData(data); }
    formEl.innerHTML = `<div class="success-message"><h2>⚠ Upload Failed</h2><p>Your responses are saved locally. You can retry later.</p>${showCodeBox(fileName)}${retryButton(fileName)}</div>`;
  }
}

async function retryUpload(fileName) {
window.retryUpload = retryUpload;
  const formEl = document.getElementById('surveyForm');
  formEl.innerHTML = `<div class="success-message"><h2>⏳ Retrying...</h2><p>Uploading your data...</p></div>`;
  const data = getSurveyData();
  try {
    const allData = collectAllData();
    await uploadToGitHub(allData, fileName);
    if (data) { data.uploadStatus = 1; saveSurveyData(data); }
    formEl.innerHTML = `<div class="success-message"><h2>✅ Upload Successful</h2><p>Your data has been uploaded.</p>${showCodeBox(fileName)}</div>`;
  } catch (e) {
    console.error('Retry failed:', e);
    formEl.innerHTML = `<div class="success-message"><h2>⚠ Upload Failed</h2><p>Still unable to upload. Please try again later.</p>${showCodeBox(fileName)}${retryButton(fileName)}</div>`;
  }
}

function retryButton(fileName) {
  return `<button type="button" onclick="retryUpload('${fileName}')" style="margin-top:12px;padding:8px 20px;border-radius:var(--radius-full);font-size:13px;font-weight:500;color:#fff;background:var(--accent);border:none;cursor:pointer;">🔄 Retry Upload</button>`;
}

function showCodeBox(code) {
  return `<div class="copy-code-box" style="margin:16px auto;padding:12px 16px;background:var(--bg-badge);border:1px solid var(--border-light);border-radius:var(--radius-md);max-width:420px;text-align:left;">
    <p style="font-size:11px;color:var(--text-tertiary);margin-bottom:4px;">Your submission code:</p>
    <code id="submissionCode" style="font-size:13px;font-weight:600;color:var(--text-primary);word-break:break-all;">${code}</code>
    <button type="button" onclick="navigator.clipboard.writeText(document.getElementById('submissionCode').textContent);this.textContent='Copied!'" style="display:block;margin-top:8px;padding:4px 12px;font-size:12px;border-radius:var(--radius-full);border:1px solid var(--border-medium);background:var(--bg-card);cursor:pointer;">📋 Copy code</button>
  </div>
  <p style="font-size:12px;color:var(--text-secondary);">Please paste this code into the corresponding survey. Compensation will be provided after verification.</p>`;
}

function setupPageTracking() {
  let enterTime = Date.now();
  trackSurveyEvent('survey_enter', { submitted: getSurveyData()?.submitted || false });
  window.addEventListener('beforeunload', () => { trackSurveyEvent('survey_leave', { timeOnPageMs: Date.now() - enterTime }); });
  let hiddenTime = null;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { hiddenTime = Date.now(); trackSurveyEvent('survey_hidden', {}); }
    else { trackSurveyEvent('survey_visible', { hiddenDurationMs: hiddenTime ? Date.now() - hiddenTime : 0 }); }
  });
}

function init() {
  const data = initSurveyData();
  if (data.submitted) {
    const code = data.uploadCode || 'unknown';
    const status = data.uploadStatus || 0;
    const statusText = status === 1 ? '✅ Survey Already Submitted' : '⚠ Survey Submitted (Upload Pending)';
    const statusDesc = status === 1 ? 'Thank you for your responses.' : 'Your responses are saved. Upload has not completed yet.';
    const retryHtml = status === 2 ? retryButton(code) : '';
    document.getElementById('surveyForm').innerHTML = `<div class="success-message">
      <h2>${statusText}</h2>
      <p>${statusDesc}</p>
      ${showCodeBox(code)}
      ${retryHtml}
    </div>`;
    return;
  }
  restoreAnswers();
  setupAutoSave();
  setupPageTracking();
  document.getElementById('surveyForm').addEventListener('submit', handleSubmit);
  console.log('📋 Survey ready — 29 questions');
}

document.addEventListener('DOMContentLoaded', init);
