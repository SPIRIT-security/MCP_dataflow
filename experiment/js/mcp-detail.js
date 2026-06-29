/* ============================================
   MCP Detail Page — Shows MCP server details
   ============================================ */

// ── MCP Content ─────────────────────────────────────
const MCP_DETAILS = {
  'calendar-anthropic': {
    name: 'Google Calendar',
    badge: 'Anthropic',
    description: `Connect Google Calendar to Claude to view your schedule, manage events, and coordinate meetings. Claude can search your calendar for events, check your availability, find free time slots, create and update events, respond to invitations, and help you prepare for meetings.`,
    tools: {
      readOnly: [
        'Returns a single event on the specified calendar.',
        'Returns the calendars on the user\'s calendar list.',
        'Lists calendar events in a given calendar.',
        'Suggests time periods across one or more calendars.',
      ],
      writeDelete: [
        'Creates a calendar event.',
        'Deletes a calendar event.',
        'Responds to an event.',
        'Updates a calendar event.',
      ],
    },
  },
  'calendar-third-party': {
    name: 'Google Calendar',
    badge: 'Third party',
    description: '',
    tools: {
      other: ['list-calendars', 'list-events', 'create-event', 'update-event', 'delete-event'],
    },
  },
  'filesystem-anthropic': {
    name: 'Filesystem',
    badge: 'Anthropic',
    description: `This extension allows Claude to interact with your local filesystem, enabling it to read and write files directly. Underneath the hood, it uses <code>@modelcontextprotocol/server-filesystem</code>. <strong>Developed by Anthropic</strong>`,
    showAllowedDirs: true,
    tools: {
      readOnly: ['Read File (Deprecated)', 'Read Text File', 'Read Multiple Files', 'List Directory', 'List Directory with Sizes', 'Directory Tree', 'Search Files', 'Get File Info', 'List Allowed Directories'],
      writeDelete: ['Write File', 'Edit File', 'Create Directory', 'Move File'],
      other: ['Copy file to Claude'],
    },
  },
  'filesystem-third-party': {
    name: 'Filesystem',
    badge: 'Third party',
    description: '',
    tools: {
      other: ['read_file', 'set_filesystem_default', 'write_file', 'update_file', 'list_files', 'delete_file', 'delete_directory', 'create_directory', 'move_path', 'copy_path'],
    },
  },
};

// Scenario → MCP keys mapping
const SCENARIO_MCP_MAP = {
  'A-anthropic': ['calendar-anthropic'],
  'A-third-party': ['calendar-third-party'],
  'B-anthropic': ['filesystem-anthropic'],
  'B-third-party': ['filesystem-third-party'],
  'C-anthropic': ['calendar-anthropic', 'filesystem-anthropic'],
  'C-third-party': ['calendar-third-party', 'filesystem-third-party'],
};

const PROMPT_LABELS = { A: 'Scenario-Calendar', B: 'Scenario-Filesystem', C: 'Scenario-Calendar+Filesystem' };
const MCP_LABELS = { 'anthropic': 'Anthropic owned', 'third-party': 'Third party' };
const SCENARIO_DESCRIPTIONS = {
  A: 'This task requires you to use the <strong>Google Calendar MCP</strong> server to check your calendar availability based on an email from your manager, and schedule a meeting.',
  B: 'This task requires you to use the <strong>Filesystem MCP</strong> server to search for your medical records, read the files, and find your condition and medication details.',
  C: 'This task requires both <strong>Google Calendar MCP</strong> and <strong>Filesystem MCP</strong> servers — find a past appointment via calendar, then locate and read the corresponding medical files.',
};

// ── Parse params ────────────────────────────────────
function parseParams() {
  const params = new URLSearchParams(window.location.search);
  const scenario = params.get('scenario');
  if (!scenario || !SCENARIO_MCP_MAP[scenario]) return null;
  return scenario;
}

// ── Render ──────────────────────────────────────────
function render() {
  const scenario = parseParams();
  if (!scenario) {
    document.getElementById('mcpDetailContent').innerHTML = '<p style="text-align:center;padding:40px;">Invalid scenario. <a href="homepage.html">Go back</a></p>';
    return;
  }

  const prompt = scenario.charAt(0);
  const mcp = scenario.slice(2); // 'anthropic' or 'third-party'
  const mcpKeys = SCENARIO_MCP_MAP[scenario];

  // Scenario info + description
  document.getElementById('scenarioInfo').innerHTML = `
    <span class="mcp-scenario-badge">${PROMPT_LABELS[prompt]}</span>
    <span class="mcp-scenario-mcp">${MCP_LABELS[mcp]}</span>`;

  // Go to chat button
  const chatBtn = document.getElementById('goToChatBtn');
  chatBtn.href = `index.html?prompt=${prompt}&mcp=${mcp}`;

  // Render each MCP detail (with description at top)
  const container = document.getElementById('mcpDetailContent');
  container.innerHTML = `
    <div class="hp-scenario-desc"><strong>${PROMPT_LABELS[prompt]}:</strong> ${SCENARIO_DESCRIPTIONS[prompt]}</div>`;

  mcpKeys.forEach((key, i) => {
    const detail = MCP_DETAILS[key];
    if (!detail) return;

    let html = '<div class="mcp-detail-section">';
    html += `<div class="detail-header">
      <div class="detail-title-row">
        <span class="detail-name">${detail.name}</span>
        <span class="detail-badge">${detail.badge}</span>
      </div>
    </div>`;

    if (detail.description) {
      html += `<div class="detail-description">${detail.description}</div>`;
    }

    // Allowed directories
    if (detail.showAllowedDirs) {
      html += `
      <div class="allowed-dirs-box">
        <div class="allowed-dirs-label">Allowed Directories (Required)</div>
        <div class="allowed-dirs-label" style="font-weight:400;text-transform:none;font-size:11px;">Select directories the filesystem server can access</div>
        <div class="allowed-dir-row">
          <span class="allowed-dir-path">/Users/Documents/MCP/FileSystem</span>
          <div class="allowed-dir-actions">
            <button class="allowed-dir-folder-btn" onclick="openFolderPopup()" title="Open folder">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>
        </div>
        <div class="allowed-dirs-actions">
          <button class="add-dir-btn">+ Add directory</button>
          <button class="save-btn">Save</button>
        </div>
      </div>`;
    }

    // Tool Permissions header
    if (detail.tools) {
      html += `
      <div class="tool-permissions-header">
        <span class="detail-section-title">Tool permissions</span>
        <div class="permission-dropdown" id="permissionDropdown${i}">
          <button class="permission-dropdown-btn" id="permissionDropdownBtn${i}">
            <span class="permission-badge needs-approval">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 12h1m4 0h1m4 0h1M6.5 8.5h1m4 0h1m4 0h1M6.5 15.5h1m4 0h1m4 0h1"/></svg>
              Needs approval
            </span>
            <svg class="perm-dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="permission-dropdown-menu">
            <div class="permission-option" data-perm="always-allow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 17 9"/></svg><span>Always allow</span></div>
            <div class="permission-option selected" data-perm="needs-approval"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 12h1m4 0h1m4 0h1M6.5 8.5h1m4 0h1m4 0h1M6.5 15.5h1m4 0h1m4 0h1"/></svg><span>Needs approval</span><svg class="perm-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div class="permission-option" data-perm="blocked"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="8" x2="16" y2="16"/></svg><span>Blocked</span></div>
            <div class="permission-option" data-perm="customize"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg><span>Customize</span></div>
          </div>
        </div>
      </div>
      <p class="detail-section-subtitle">Choose when Claude is allowed to use these tools.</p>
      <div class="tool-icons-header">
        <span class="tool-icon-header-item" title="Always allow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 17 9"/></svg></span>
        <span class="tool-icon-header-item active" title="Needs approval"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 12h1m4 0h1m4 0h1M6.5 8.5h1m4 0h1m4 0h1M6.5 15.5h1m4 0h1m4 0h1"/></svg></span>
        <span class="tool-icon-header-item" title="Blocked"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="8" x2="16" y2="16"/></svg></span>
      </div>`;

      if (detail.tools.readOnly) {
        html += `<div class="tool-category-label collapsible"><svg class="category-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg><span>Read-only tools ${detail.tools.readOnly.length}</span></div><div class="tool-category-items">`;
        detail.tools.readOnly.forEach(t => { html += '<div class="tool-item-row"><span class="tool-item-text">' + t + '</span><div class="tool-item-icons"><span class="tool-icon allow-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 17 9"/></svg></span><span class="tool-icon hand-icon active"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 12h1m4 0h1m4 0h1M6.5 8.5h1m4 0h1m4 0h1M6.5 15.5h1m4 0h1m4 0h1"/></svg></span><span class="tool-icon block-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="8" x2="16" y2="16"/></svg></span></div></div>'; });
        html += '</div>';
      }
      if (detail.tools.writeDelete) {
        html += `<div class="tool-category-label collapsible"><svg class="category-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg><span>Write/delete tools ${detail.tools.writeDelete.length}</span></div><div class="tool-category-items">`;
        detail.tools.writeDelete.forEach(t => { html += '<div class="tool-item-row"><span class="tool-item-text">' + t + '</span><div class="tool-item-icons"><span class="tool-icon allow-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 17 9"/></svg></span><span class="tool-icon hand-icon active"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 12h1m4 0h1m4 0h1M6.5 8.5h1m4 0h1m4 0h1M6.5 15.5h1m4 0h1m4 0h1"/></svg></span><span class="tool-icon block-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="8" x2="16" y2="16"/></svg></span></div></div>'; });
        html += '</div>';
      }
      if (detail.tools.other) {
        html += `<div class="tool-category-label collapsible"><svg class="category-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg><span>Other tools ${detail.tools.other.length}</span></div><div class="tool-category-items">`;
        detail.tools.other.forEach(t => { html += '<div class="tool-item-row"><span class="tool-item-text">' + t + '</span><div class="tool-item-icons"><span class="tool-icon allow-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 17 9"/></svg></span><span class="tool-icon hand-icon active"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 12h1m4 0h1m4 0h1M6.5 8.5h1m4 0h1m4 0h1M6.5 15.5h1m4 0h1m4 0h1"/></svg></span><span class="tool-icon block-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="8" x2="16" y2="16"/></svg></span></div></div>'; });
        html += '</div>';
      }
    }

    html += '</div>';
    container.innerHTML += html;
  });

  // Bind collapse and permission dropdown
  setupCollapse();
  setupPermissionDropdowns();
}

function setupCollapse() {
  document.querySelectorAll('.tool-category-label.collapsible').forEach(label => {
    label.addEventListener('click', () => {
      const items = label.nextElementSibling;
      if (items && items.classList.contains('tool-category-items')) {
        items.classList.toggle('collapsed');
        label.classList.toggle('collapsed');
      }
    });
  });
}

function setupPermissionDropdowns() {
  document.querySelectorAll('.permission-dropdown').forEach(dropdown => {
    const btn = dropdown.querySelector('.permission-dropdown-btn');
    const menu = dropdown.querySelector('.permission-dropdown-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', e => { e.stopPropagation(); dropdown.classList.toggle('open'); });
    menu.querySelectorAll('.permission-option').forEach(opt => {
      opt.addEventListener('click', e => {
        e.stopPropagation();
        menu.querySelectorAll('.permission-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const perm = opt.dataset.perm;
        const badge = btn.querySelector('.permission-badge');
        const icons = { 'always-allow': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 17 9"/></svg> Always allow', 'needs-approval': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 12h1m4 0h1m4 0h1M6.5 8.5h1m4 0h1m4 0h1M6.5 15.5h1m4 0h1m4 0h1"/></svg> Needs approval', 'blocked': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="8" x2="16" y2="16"/></svg> Blocked', 'customize': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg> Customize' };
        if (badge && icons[perm]) badge.innerHTML = icons[perm];
        dropdown.classList.remove('open');
      });
    });
  });
  document.addEventListener('click', () => { document.querySelectorAll('.permission-dropdown').forEach(d => d.classList.remove('open')); });
}

// ── Folder Popup ─────────────────────────────────────
function openFolderPopup() {
  document.getElementById('folderPopupOverlay').classList.add('visible');
  document.getElementById('folderPopup').classList.add('visible');
}
function closeFolderPopup() {
  document.getElementById('folderPopupOverlay').classList.remove('visible');
  document.getElementById('folderPopup').classList.remove('visible');
}
window.openFolderPopup = openFolderPopup;
window.closeFolderPopup = closeFolderPopup;

// ── Init ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', render);
