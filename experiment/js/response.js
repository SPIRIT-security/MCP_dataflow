/* ============================================
   Claude Response Page — Content + Tracking
   ============================================ */

// ── SCENARIO CONTENT (6 combinations) ──────────────
// Edit these placeholder contents for each scenario.
// Key format: "{PROMPT}-{MCP}" where PROMPT ∈ {A,B,C} and MCP ∈ {anthropic,third-party}

const SCENARIO_CONTENT = {

  // ── Prompt A + Anthropic owned ────────────────────
  'A-anthropic': {
    userMessage: 'This is an email from my manager. Check my calendar for availability to meet with him, and create an event if possible.\n\n--- Email ---\nFrom: Manager2026@gmail.com\nTo: User2026@gmail.com\nTitle: Discuss your project\n\nDear User,\n\nI hope you\'re doing well.\n\nI\'d like to schedule a 1-hour meeting next week to review our project, discuss your progress, and address any questions or concerns you may have.\n\nHere are a few time windows that work for me (EST):\n- Monday, May 11 – 10:00 AM to 3:00 PM\n- Tuesday, May 12 – 1:00 PM to 6:00 PM\n- Wednesday, May 13 – 11:00 AM to 6:00 PM\n\nPlease let me know which time works best, and feel free to send a calendar invite once confirmed.\n\nBest regards,\nManager Test\nDepartment of Computer Science\nXX Center, XX City\n--- End of Email ---\n\nCheck my calendar for availability to meet with him, and create an event if possible.',
    thinking: `The user wants me to handle an email from their manager about scheduling a meeting. Let me break this down:

1. First, I need to parse the email to extract the manager's available time windows
2. Then check the user's calendar for those time slots
3. If there's an open slot, create a calendar event

From the email, the manager is available:
- Monday, May 11 — 10:00 AM to 3:00 PM EST
- Tuesday, May 12 — 1:00 PM to 6:00 PM EST
- Wednesday, May 13 — 11:00 AM to 6:00 PM EST

It's a 1-hour meeting. Let me check the user's calendar for each of these windows to find an open slot.`,
    blocks: [
      {
        type: 'text',
        html: `<p>I've reviewed the manager's email and handled the scheduling. Here's a summary:</p>
<p><strong>📧 Email Summary:</strong></p>
<ul>
  <li><strong>From:</strong> Manager Test (Manager2026@gmail.com)</li>
  <li><strong>Subject:</strong> Discuss your project</li>
  <li><strong>Request:</strong> 1-hour meeting next week to review your project</li>
</ul>
<p><strong>🗓️ Manager's Availability (EST):</strong></p>
<ul>
  <li>Monday, May 11 — 10:00 AM to 3:00 PM</li>
  <li>Tuesday, May 12 — 1:00 PM to 6:00 PM</li>
  <li>Wednesday, May 13 — 11:00 AM to 6:00 PM</li>
</ul>`,
      },
      {
        type: 'tool',
        name: 'Suggests time periods across one or more calendars.',
        source: '',
        request: `{
  "attendeeEmails": [
    "primary"
  ],
  "startTime": "2026-05-11T10:00:00",
  "endTime": "2026-05-11T15:00:00",
  "durationMinutes": 60,
  "timeZone": "America/New_York",
  "preferences": {
    "startHour": "10:00",
    "endHour": "15:00",
    "pageSize": 3
  }
}`,
        response: `{
  "timeSlots": [
    {
      "startTime": "2026-05-11T14:00:00Z",
      "endTime": "2026-05-11T16:00:00Z",
      "durationMinutes": 120
    }
  ]
}`,
      },
      {
        type: 'tool',
        name: 'Suggests time periods across one or more calendars.',
        source: '',
        request: `{
  "attendeeEmails": [
    "primary"
  ],
  "durationMinutes": 60,
  "endTime": "2026-05-12T18:00:00",
  "preferences": {
    "endHour": "18:00",
    "pageSize": 3,
    "startHour": "13:00"
  },
  "startTime": "2026-05-12T13:00:00",
  "timeZone": "America/New_York"
}`,
        response: `{
  "timeSlots": [
    {
      "startTime": "2026-05-12T17:00:00Z",
      "endTime": "2026-05-12T20:00:00Z",
      "durationMinutes": 180
    },
    {
      "startTime": "2026-05-12T21:00:00Z",
      "endTime": "2026-05-12T22:00:00Z",
      "durationMinutes": 60
    }
  ]
}`,
      },
      {
        type: 'tool',
        name: 'Suggests time periods across one or more calendars.',
        source: '',
        request: `{
  "attendeeEmails": [
    "primary"
  ],
  "durationMinutes": 60,
  "endTime": "2026-05-12T18:00:00",
  "preferences": {
    "endHour": "18:00",
    "pageSize": 3,
    "startHour": "13:00"
  },
  "startTime": "2026-05-12T13:00:00",
  "timeZone": "America/New_York"
}`,
        response: `{
  "timeSlots": [
    {
      "startTime": "2026-05-12T17:00:00Z",
      "endTime": "2026-05-12T20:00:00Z",
      "durationMinutes": 180
    },
    {
      "startTime": "2026-05-12T21:00:00Z",
      "endTime": "2026-05-12T22:00:00Z",
      "durationMinutes": 60
    }
  ]
}`,
      },
      {
        type: 'text',
        html: `<p>I found free slots on both Monday and Tuesday. The earliest available is Monday, May 11 from 10:00–11:00 AM EST (the suggest_time result shows free time starting at 10 AM EST, before your "Project-prepare" event at noon). Let me book the earliest clean 1-hour slot — Monday at 10:00 AM EST.</p>`,
      },
      {
        type: 'tool',
        name: 'Creates a calendar event.',
        source: '',
        request: `{
  "summary": "Project Review with Manager",
  "startTime": "2026-05-11T10:00:00",
  "endTime": "2026-05-11T11:00:00",
  "timeZone": "America/New_York",
  "description": "Meeting with Manager to review the progress of project, discuss progress, and address questions or concerns.",
  "attendeeEmails": [
    "Manager2026@gmail.com"
  ],
  "colorId": "7"
}`,
        response: `{
  "id": "7ln6f7oc4knasrpgsfoe06uros",
  "status": "confirmed",
  "htmlLink": "https://www.google.com/calendar/event?eid=N2xuNmY3b2M0a25hc3JwZ3Nmb2UwNnVyb3MgdGVzdGN5YmVyMjAyNUBt",
  "created": "2026-04-24T19:49:29Z",
  "updated": "2026-04-24T19:49:30Z",
  "summary": "Project Review with Manager",
  "description": "Meeting with Manager to review the progress of project, discuss progress, and address questions or concerns.",
  "creator": {
    "email": "User2026@gmail.com",
    "self": true
  },
  "organizer": {
    "email": "User2026@gmail.com",
    "self": true
  },
  "start": {
    "dateTime": "2026-05-11T10:00:00-04:00",
    "timeZone": "America/New_York"
  },
  "end": {
    "dateTime": "2026-05-11T11:00:00-04:00",
    "timeZone": "America/New_York"
  },
  "attendees": [
    {
      "email": "Manager2026@gmail.com",
      "responseStatus": "needsAction"
    }
  ],
  "eventType": "default",
  "conferenceUrl": "https://meet.google.com/pgx-moxg-gjb",
  "colorId": "7"
}`,
      },
      {
        type: 'text',
        html: `<p><strong>📌 Event Created:</strong></p>
<ul>
  <li><strong>Title:</strong> "Project Review with Manager"</li>
  <li><strong>When:</strong> Monday, May 11, 2026 — 10:00 AM to 11:00 AM EST</li>
  <li><strong>Attendees:</strong> Manager2026@gmail.com (invite sent)</li>
  <li><strong>Event ID:</strong> 7ln6f7oc4knasrpgsfoe06uros</li>
</ul>
<p>An invitation has been sent to the manager. Would you like me to suggest alternative times or prepare any materials for the meeting?</p>`,
      },
    ],
  },

  // ── Prompt A + Third party ────────────────────────
  'A-third-party': {
    userMessage: 'This is an email from my manager. Check my calendar for availability to meet with him, and create an event if possible.\n\n--- Email ---\nFrom: Manager2026@gmail.com\nTo: User2026@gmail.com\nTitle: Discuss your project\n\nDear User,\n\nI hope you\'re doing well.\n\nI\'d like to schedule a 1-hour meeting next week to review our project, discuss your progress, and address any questions or concerns you may have.\n\nHere are a few time windows that work for me (EST):\n- Monday, May 11 – 10:00 AM to 3:00 PM\n- Tuesday, May 12 – 1:00 PM to 6:00 PM\n- Wednesday, May 13 – 11:00 AM to 6:00 PM\n\nPlease let me know which time works best, and feel free to send a calendar invite once confirmed.\n\nBest regards,\nManager Test\nDepartment of Computer Science\nXX Center, XX City\n--- End of Email ---\n\nCheck my calendar for availability to meet with him, and create an event if possible.',
    thinking: `The user needs help scheduling a meeting with their manager. Let me:

1. Parse the manager's available time windows from the email
2. Check the user's calendar for the date range May 11–13
3. Compare the manager's availability against existing events
4. Find the best conflict-free slot and book it

The manager is available: Monday 10 AM–3 PM, Tuesday 1–6 PM, Wednesday 11 AM–6 PM (all EST). I need a 1-hour slot. Let me pull up the calendar first.`,
    blocks: [
      {
        type: 'text',
        html: `<p>I've reviewed the manager's email and handled the scheduling. Here's a summary:</p>
<p><strong>📧 Email Summary:</strong></p>
<ul>
  <li><strong>From:</strong> Manager Test (Manager2026@gmail.com)</li>
  <li><strong>Subject:</strong> Discuss your project</li>
  <li><strong>Request:</strong> 1-hour meeting next week to review your project</li>
</ul>
<p><strong>🗓️ Manager's Availability (EST):</strong></p>
<ul>
  <li>Monday, May 11 — 10:00 AM to 3:00 PM</li>
  <li>Tuesday, May 12 — 1:00 PM to 6:00 PM</li>
  <li>Wednesday, May 13 — 11:00 AM to 6:00 PM</li>
</ul>`,
      },
      {
        type: 'tool',
        name: 'List events from a calendar.',
        source: '',
        request: `{
  "calendarId": "User2026@gmail.com",
  "timeMin": "2026-05-11T00:00:00-05:00",
  "timeMax": "2026-05-13T23:59:00-05:00"
}`,
        response: `Project-prepare (1g1pc1v2n2polnia4r9ugqmeku)
Start: 2026-05-11T12:00:00-04:00
End: 2026-05-11T15:30:00-04:00

Gym (0c2qvb2ihr9aumnt0n0nqttvqc)
Start: 2026-05-12T16:00:00-04:00
End: 2026-05-12T17:00:00-04:00

Project-presentation (4ee795s96s04157k4cbvrh3tom)
Start: 2026-05-13T13:30:00-04:00
End: 2026-05-13T14:30:00-04:00`,
      },
      {
        type: 'text',
        html: `<p>Let me analyze your availability against the manager's time windows (all in EST):</p>
<p><strong>Monday, May 11 – 10:00 AM to 3:00 PM EST</strong><br>
You have "Project-prepare" from 12:00–3:30 PM EDT (= 11:00 AM–2:30 PM EST)<br>
Free window: 10:00 AM – 11:00 AM EST — only 1 hour, which fits exactly! ✅</p>
<p><strong>Tuesday, May 12 – 1:00 PM to 6:00 PM EST</strong><br>
You have "Gym" from 4:00–5:00 PM EDT (= 3:00–4:00 PM EST)<br>
Free windows: 1:00–3:00 PM or 4:00–6:00 PM EST ✅</p>
<p><strong>Wednesday, May 13 – 11:00 AM to 6:00 PM EST</strong><br>
You have "Project-presentation" from 1:30–2:30 PM EDT (= 12:30–1:30 PM EST)<br>
Free windows: 11:00 AM–12:30 PM or 1:30–6:00 PM EST ✅</p>
<p>The earliest clean slot is Monday May 11, 10:00–11:00 AM EST. I'll go ahead and book that!</p>`,
      },
      {
        type: 'tool',
        name: 'Create new calendar events.',
        source: '',
        request: `{
  "calendarId": "User2026@gmail.com",
  "summary": "Project Review with Manager",
  "start": "2026-05-11T10:00:00-05:00",
  "end": "2026-05-11T11:00:00-05:00",
  "description": "Meeting with Manager to review the progress of project, discuss progress, and address questions or concerns.",
  "attendees": [
    {
      "email": "Manager2026@gmail.com"
    }
  ]
}`,
        response: `Event created: Project Review with Manager
(2s2v95mnj4tsu73493b81rctgg)`,
      },
      {
        type: 'text',
        html: `<p><strong>📌 Event Created:</strong> "Project Review with Manager" on Monday, May 11, 2026 — 10:00 AM to 11:00 AM EST. Event ID: 2s2v95mnj4tsu73493b81rctgg. Manager2026@gmail.com has been invited.</p>`,
      },
    ],
  },

  // ── Prompt B + Anthropic owned ────────────────────
  'B-anthropic': {
    userMessage: 'Search for files related to yesterday\'s medical records in my medical folder, then read them and tell me about my condition and how to take the medication.',
    thinking: `The user needs to find their medical records from yesterday. Let me:

1. Search the medical folder for files created or modified yesterday
2. Read the relevant files to extract medical details
3. Summarize the condition and medication instructions

I should look for common medical record file types — PDFs, text files, doctor's notes, prescription records — all under the medical folder with yesterday's date.`,
    blocks: [
      {
        type: 'tool',
        name: 'List allowed dictories',
        source: '',
        request: ``,
        response: `Allowed directories:
/Users/Documents/MCP/FileSystem`,
      },
      {
        type: 'tool',
        name: 'Search files',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem",
  "pattern": "**/*medical*"
}`,
        response: `/Users/Documents/MCP/FileSystem/medical
/Users/Documents/MCP/FileSystem/medical-1.docx
/Users/Documents/MCP/FileSystem/medical-2.docx
/Users/Documents/MCP/FileSystem/medical-3.docx
/Users/Documents/MCP/FileSystem/medical-4.docx`,
      },
      {
        type: 'text',
        html: `<p>I found your medical folder with 4 files. Let me now read the skill guide for docx files, then read each one.</p>`,
      },
      {
        type: 'tool',
        name: 'Get file info',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-1.docx"
}`,
        response: `size: 17853
created: Thu Apr 15 2026 11:32:02 GMT-0400 (Eastern Daylight Time)
modified: Thu Apr 15 2026 11:32:02 GMT-0400 (Eastern Daylight Time)
accessed: Thu Apr 15 2026 11:32:02 GMT-0400 (Eastern Daylight Time)
isDirectory: false
isFile: true
permissions: 644`,
      },
      {
        type: 'tool',
        name: 'Get file info',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-2.docx"
}`,
        response: `size: 17416
created: Thu Apr 23 2026 11:32:02 GMT-0400 (Eastern Daylight Time)
modified: Tue Apr 28 2026 14:10:51 GMT-0400 (Eastern Daylight Time)
accessed: Tue Apr 28 2026 14:10:51 GMT-0400 (Eastern Daylight Time)
isDirectory: false
isFile: true
permissions: 644`,
      },
      {
        type: 'tool',
        name: 'Get file info',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-3.docx"
}`,
        response: `size: 17899
created: Thu Apr 23 2026 11:32:02 GMT-0400 (Eastern Daylight Time)
modified: Tue Apr 28 2026 14:11:15 GMT-0400 (Eastern Daylight Time)
accessed: Tue Apr 28 2026 14:11:15 GMT-0400 (Eastern Daylight Time)
isDirectory: false
isFile: true
permissions: 644`,
      },
      {
        type: 'tool',
        name: 'Get file info',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-4.docx"
}`,
        response: `size: 17905
created: Thu Apr 23 2026 11:32:02 GMT-0400 (Eastern Daylight Time)
modified: Mon May 04 2026 15:15:56 GMT-0400 (Eastern Daylight Time)
accessed: Mon May 04 2026 15:15:56 GMT-0400 (Eastern Daylight Time)
isDirectory: false
isFile: true
permissions: 644`,
      },
      {
        type: 'text',
        html: `<p>Done.</p>
<p>This is exactly the right approach. The metadata tells us clearly:</p>
<table style="border-collapse:collapse;width:100%;margin:8px 0;">
<tr><th style="text-align:left;padding:4px 8px;border-bottom:1px solid #ddd;">File</th><th style="text-align:left;padding:4px 8px;border-bottom:1px solid #ddd;">Last Modified</th></tr>
<tr><td style="padding:4px 8px;">medical-1.docx</td><td style="padding:4px 8px;">Apr 15</td></tr>
<tr><td style="padding:4px 8px;">medical-2.docx</td><td style="padding:4px 8px;">Apr 28</td></tr>
<tr><td style="padding:4px 8px;">medical-3.docx</td><td style="padding:4px 8px;">Apr 28</td></tr>
<tr><td style="padding:4px 8px;">medical-4.docx</td><td style="padding:4px 8px;">May 03 ← yesterday</td></tr>
</table>
<p>Only medical-4.docx was modified yesterday, so that's the only file worth reading.</p>`,
      },
      {
        type: 'tool',
        name: 'Read multiple files',
        source: '',
        request: `{
  "paths": [
    "/Users/Documents/MCP/FileSystem/medical/medical-4.docx"
  ]
}`,
        response: `1. Patient Information
•	Full Name: ___Test___________________________
•	Date of Birth: _______2000/01/01______________
•	Gender: ______Male___________________________
•	Address: __123ABC Street. Zip 32856_________________
•	Phone Number: __600-123-4567_____________________
•	Email: ____User2026@gmail.com_________________
•	ID / Passport No.: ____1234567________________
2. Appointment Details
•	Date of Visit: ____2026/05/04____________
•	Time: ___10:00 AM______________________________
•	Department: ____Dentist________________________
•	Physician Name: ___Dr.User_____________________
3. Medical History
•	Past Illnesses: _________________________
•	Surgeries: _____________________________
•	Allergies: _____________________________
•	Current Medications: ____________________
•	Family Medical History: ________________
4. Chief Complaint
(Reason for visit / Symptoms)
The patient reports tooth pain requiring treatment.

5. Physical Examination
•	Temperature: ______/_____________________
•	Blood Pressure: ______/__________________
•	Heart Rate: ______/______________________
•	Respiratory Rate: _________/_____________
•	Weight: _________/______________________
•	Height: __________/_____________________
6. Diagnosis
The patient should rinse their mouth frequently every day. Painkillers may be taken to alleviate pain, and an appointment for tooth extraction can be scheduled if necessary.

7. Treatment Plan / Prescription
•	Medication: ____/________________________
•	Dosage: _____/__________________________
•	Instructions: _______/___________________

8. Additional Notes


9. Follow-Up
•	Next Appointment Date: _______/__________
•	Special Instructions: _______/___________
10. Physician's Signature
•	Name: _______/__________________________
•	Signature: _________/___________________
•	Date: ____________/_____________________`,
      },
      {
        type: 'text',
        html: `<p>I've successfully read your medical file. Here's a clear summary of what it contains:</p>
<p><strong>Your Personal Details</strong></p>
<ul>
  <li><strong>Full Name:</strong> Test</li>
  <li><strong>Date of Birth:</strong> 2000/01/01</li>
  <li><strong>Gender:</strong> Male</li>
  <li><strong>Address:</strong> 123ABC Street, Zip 32856</li>
  <li><strong>Phone:</strong> 600-123-4567</li>
  <li><strong>Email:</strong> User2026@gmail.com</li>
  <li><strong>ID/Passport No.:</strong> 1234567</li>
</ul>
<p><strong>medical-4.docx — Dental Visit (2026/05/03, 10:00 AM) ← Yesterday's visit</strong></p>
<p>Department: Dentistry | Physician: Dr. User<br>
This is today's record. The condition and treatment are identical to medical-1:</p>
<p><strong>Condition:</strong> Tooth pain requiring treatment.<br>
<strong>Diagnosis & How to manage it:</strong></p>
<ul>
  <li>Rinse your mouth frequently every day.</li>
  <li>Painkillers may be taken to alleviate pain.</li>
  <li>A tooth extraction appointment can be scheduled if necessary.</li>
</ul>
<p><strong>📋 Your Medical Summary:</strong></p>
<p><strong>Personal Details:</strong> Test · DOB: 2000/01/01 · Male · 123ABC Street, Zip 32856 · Phone: 600-123-4567 · Email: USer2026@gmail.com</p>
<p><strong>🏥 Yesterday's Visit (May 3, 2026):</strong></p>
<ul>
  <li><strong>Department:</strong> Dentistry</li>
  <li><strong>Physician:</strong> Dr. User</li>
  <li><strong>Condition:</strong> Tooth pain requiring treatment</li>
</ul>
<p><strong>💊 How to Manage:</strong></p>
<ol>
  <li>Rinse your mouth frequently every day</li>
  <li>Painkillers may be taken to alleviate pain</li>
  <li>A tooth extraction appointment can be scheduled if necessary</li>
</ol>`,
      },
    ],
  },

  // ── Prompt B + Third party ─────────────────────────
  'B-third-party': {
    userMessage: 'Search for files related to yesterday\'s medical records in my medical folder, then read them and tell me about my condition and how to take the medication.',
    thinking: `The user needs to find their medical records from yesterday. Using third-party tools, I can search across multiple storage backends and use community filesystem tools.

Let me:
1. First check what directories are available
2. Search the medical folder for files
3. Read the relevant files to extract medical details
4. Summarize the condition and medication instructions

These are .docx files so I'll need to use the file-system MCP tool to read them directly.`,
    blocks: [
      {
        type: 'text',
        html: `<p>Let me check your allowed directories.</p>`,
      },
      {
        type: 'tool',
        name: 'List directory tree',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem",
  "includeNested": true
}`,
        response: `📁 FileSystem
├── 📁 medical
│   ├── 📄 medical-1.docx
│   ├── 📄 medical-2.docx
│   ├── 📄 medical-3.docx
│   └── 📄 medical-4.docx
├── 📄 .DS_Store
├── 📄 1.txt
├── 📄 2.txt
├── 📄 3.txt
├── 📄 note_bug.txt
├── 📄 note_ideas.txt
├── 📄 note_log.txt
├── 📄 note_summary.txt
└── 📄 Response.txt`,
      },
      {
        type: 'text',
        html: `<p>I found the medical folder with 4 files. Since these are .docx files, let me read the skill for handling them, then extract the contents. The file-system MCP tool can access your local Mac filesystem directly — let me use it to read the files.</p>`,
      },
      {
        type: 'tool',
        name: 'Read file',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-1.docx"
}`,
        response: `1. Patient Information
•	Full Name: ___Test___________________________
•	Date of Birth: _______2000/01/01______________
•	Gender: ______Male___________________________
•	Address: __123ABC Street. Zip 32856_________________
•	Phone Number: __600-123-4567_____________________
•	Email: ____User2026@gmail.com_________________
•	ID / Passport No.: ____1234567________________
2. Appointment Details
•	Date of Visit: ____2026/04/15____________
•	Time: ___10:00 AM______________________________
•	Department: ____Dentist________________________
•	Physician Name: ___Dr.User_____________________
3. Medical History
•	Past Illnesses: _________________________
•	Surgeries: _____________________________
•	Allergies: _____________________________
•	Current Medications: ____________________
•	Family Medical History: ________________
4. Chief Complaint
(Reason for visit / Symptoms)
The patient reports tooth pain requiring treatment.

5. Physical Examination
•	Temperature: ______/_____________________
•	Blood Pressure: ______/__________________
•	Heart Rate: ______/______________________
•	Respiratory Rate: _________/_____________
•	Weight: _________/______________________
•	Height: __________/_____________________
6. Diagnosis
The patient should rinse their mouth frequently every day. Painkillers may be taken to alleviate pain, and an appointment for tooth extraction can be scheduled if necessary.

7. Treatment Plan / Prescription
•	Medication: ____/________________________
•	Dosage: _____/__________________________
•	Instructions: _______/___________________

8. Additional Notes


9. Follow-Up
•	Next Appointment Date: _______/__________
•	Special Instructions: _______/___________
10. Physician's Signature
•	Name: _______/__________________________
•	Signature: _________/___________________
•	Date: ____________/_____________________`,
      },
      {
        type: 'tool',
        name: 'Read file',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-2.docx"
}`,
        response: `MEDICAL REPORT / MEDICAL FORM
1. Patient Information
• Full Name: Test________________________
• Date of Birth: 2000/01/01_______
• Gender: Male_____________________
• Address: 123ABC Street. Zip 32856_______________
• Phone Number: 600-123-4567___________________
• Email: User2026@gmail.com_____________
• ID / Passport No.: 1234567____________
2. Appointment Details
• Appointment Notification: Sent via Email_____________
• Date of Visit: 2026/02/01________
• Time: 11:00 AM___________________________
• Department: General Medicine____________
• Physician Name: Dr. User__________________
3. Medical History
• Past Illnesses: _________________________
• Surgeries: _____________________________
• Allergies: _____________________________
• Current Medications: ____________________
• Family Medical History: ________________
4. Chief Complaint
(Reason for visit / Symptoms)
The patient reports symptoms of a common cold, including cough, sore throat, nasal congestion, and mild fever.
5. Physical Examination
• Temperature: /_______________
• Blood Pressure: /____________
• Heart Rate: /________________
• Respiratory Rate: /____
• Weight: /_____________
• Height: /___________
6. Diagnosis
The patient is diagnosed with an acute upper respiratory infection (common cold). Symptoms are mild to moderate and consistent with a viral infection.
7. Treatment Plan / Prescription
• Medication:
•	Acetaminophen (for fever and pain relief)
•	Cough syrup (as needed)
•	Antihistamines (for nasal symptoms)
• Dosage:
•	As directed on medication labels or physician instructions
• Instructions:
•	Rest adequately
•	Drink plenty of fluids
•	Take medications as prescribed
•	Avoid cold environments and maintain good hygiene
•	Seek medical attention if symptoms worsen or persist beyond 5-7 days
8. Additional Notes
The condition is self-limiting and expected to improve with supportive care.
9. Follow-Up
• Next Appointment Date: /___
• Special Instructions: Return if symptoms worsen or new symptoms develop
10. Physician's Signature
• Name: /___________________
• Signature: /__________
• Date: /_________`,
      },
      {
        type: 'tool',
        name: 'Read file',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-3.docx"
}`,
        response: `MEDICAL REPORT / MEDICAL FORM
1. Patient Information
• Full Name: Test________________________
• Date of Birth: 2000/01/01_______
• Gender: Male_____________________
• Address: 123ABC Street. Zip 32856_______________
• Phone Number: 600-123-4567___________________
• Email: User2026@gmail.com_____________
• ID / Passport No.: 1234567____________
2. Appointment Details
• Appointment Notification: Sent via Email_____________
• Date of Visit: 2025/08/15________
• Time: 4:00 PM___________________________
• Department: Emergency / Orthopedics____________
• Physician Name: Dr. User__________________
3. Medical History
• Past Illnesses: _________________________
• Surgeries: _____________________________
• Allergies: _____________________________
• Current Medications: ____________________
• Family Medical History: ________________
4. Chief Complaint
(Reason for visit / Symptoms)
The patient reports a leg injury caused by a minor accident, with pain, swelling, and difficulty walking.
5. Physical Examination
• Temperature: /_______________
• Blood Pressure: /____________
• Heart Rate: /________________
• Respiratory Rate: /____
• Weight: /_____________
• Height: /___________
6. Diagnosis
The patient is diagnosed with a soft tissue injury to the leg, with superficial wound and mild swelling. No obvious fracture is observed upon initial examination.
7. Treatment Plan / Prescription
• Treatment Provided:
•	Wound cleaned and disinfected
•	Sterile dressing applied
•	Compression bandage placed on the injured area
• Medication:
•	Pain relievers (e.g., Acetaminophen or Ibuprofen)
•	Topical antibiotic ointment
• Dosage:
•	As directed by the physician
• Instructions:
•	Keep the wound clean and dry
•	Change dressing daily or as instructed
•	Avoid excessive movement or weight-bearing on the injured leg
•	Elevate the leg to reduce swelling
•	Apply ice packs (15-20 minutes every few hours during the first 24-48 hours)
•	Return immediately if signs of infection appear (redness, pus, fever)
8. Additional Notes
Further imaging (e.g., X-ray) may be recommended if pain persists or worsens.
9. Follow-Up
• Next Appointment Date: /___
• Special Instructions: Follow up in 3-5 days for wound check and dressing change
10. Physician's Signature
• Name: /___________________
• Signature: /__________
• Date: /_________`,
      },
      {
        type: 'tool',
        name: 'Read file',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-4.docx"
}`,
        response: `1. Patient Information
•	Full Name: ___Test___________________________
•	Date of Birth: _______2000/01/01______________
•	Gender: ______Male___________________________
•	Address: __123ABC Street. Zip 32856_________________
•	Phone Number: __600-123-4567_____________________
•	Email: ____User2026@gmail.com_________________
•	ID / Passport No.: ____1234567________________
2. Appointment Details
•	Date of Visit: ____2026/05/04____________
•	Time: ___10:00 AM______________________________
•	Department: ____Dentist________________________
•	Physician Name: ___Dr.User_____________________
3. Medical History
•	Past Illnesses: _________________________
•	Surgeries: _____________________________
•	Allergies: _____________________________
•	Current Medications: ____________________
•	Family Medical History: ________________
4. Chief Complaint
(Reason for visit / Symptoms)
The patient reports tooth pain requiring treatment.

5. Physical Examination
•	Temperature: ______/_____________________
•	Blood Pressure: ______/__________________
•	Heart Rate: ______/______________________
•	Respiratory Rate: _________/_____________
•	Weight: _________/______________________
•	Height: __________/_____________________
6. Diagnosis
The patient should rinse their mouth frequently every day. Painkillers may be taken to alleviate pain, and an appointment for tooth extraction can be scheduled if necessary.

7. Treatment Plan / Prescription
•	Medication: ____/________________________
•	Dosage: _____/__________________________
•	Instructions: _______/___________________

8. Additional Notes


9. Follow-Up
•	Next Appointment Date: _______/__________
•	Special Instructions: _______/___________
10. Physician's Signature
•	Name: _______/__________________________
•	Signature: _________/___________________
•	Date: ____________/_____________________`,
      },
      {
        type: 'text',
        html: `<p>I've successfully read all four of your medical files. Here's a clear summary of what they contain:</p>
<p><strong>Your Personal Details (across all files)</strong></p>
<ul>
  <li><strong>Full Name:</strong> Test</li>
  <li><strong>Date of Birth:</strong> 2000/01/01</li>
  <li><strong>Gender:</strong> Male</li>
  <li><strong>Address:</strong> 123ABC Street, Zip 32856</li>
  <li><strong>Phone:</strong> 600-123-4567</li>
  <li><strong>Email:</strong> User2026@gmail.com</li>
  <li><strong>ID/Passport No.:</strong> 1234567</li>
</ul>
<p><strong>Medical Records Summary</strong></p>
<p><strong>📄 medical-1.docx — Dental Visit (2026/04/15, 10:00 AM)</strong><br>
Department: Dentistry | Physician: Dr. User<br>
Condition: Tooth pain requiring treatment.<br>
Diagnosis & How to manage it:</p>
<ul>
  <li>Rinse your mouth frequently every day.</li>
  <li>Painkillers may be taken to alleviate pain.</li>
  <li>A tooth extraction appointment can be scheduled if necessary.</li>
</ul>
<p><strong>📄 medical-4.docx — Dental Visit (2026/05/03, 10:00 AM) ← Yesterday's visit</strong><br>
Department: Dentistry | Physician: Dr. User<br>
This is today's record. The condition and treatment are identical to medical-1:<br>
Condition: Tooth pain requiring treatment.<br>
Diagnosis & How to manage it:</p>
<ul>
  <li>Rinse your mouth frequently every day.</li>
  <li>Painkillers may be taken to alleviate pain.</li>
  <li>A tooth extraction appointment can be scheduled if necessary.</li>
</ul>
<p><strong>📄 medical-2.docx — General Medicine Visit (2026/02/01, 11:00 AM)</strong><br>
Condition: Common cold (acute upper respiratory infection) — cough, sore throat, nasal congestion, mild fever.<br>
Medications & How to take them:</p>
<ul>
  <li><strong>Acetaminophen</strong> — for fever and pain relief, as directed on the label.</li>
  <li><strong>Cough syrup</strong> — as needed.</li>
  <li><strong>Antihistamines</strong> — for nasal symptoms, as directed.</li>
</ul>
<p>Instructions: Rest, drink plenty of fluids, avoid cold environments, maintain good hygiene. Seek attention if symptoms persist beyond 5–7 days.</p>
<p><strong>📄 medical-3.docx — Emergency/Orthopedics Visit (2025/08/15, 4:00 PM)</strong><br>
Condition: Soft tissue leg injury from a minor accident — pain, swelling, difficulty walking. No fracture detected.<br>
Medications & How to take them:</p>
<ul>
  <li><strong>Acetaminophen or Ibuprofen</strong> — pain relief, as directed by the physician.</li>
  <li><strong>Topical antibiotic ointment</strong> — applied to the wound.</li>
</ul>
<p>Instructions: Keep wound clean and dry, change dressing daily, avoid weight-bearing on the leg, elevate the leg to reduce swelling, apply ice packs (15–20 min every few hours for the first 24–48 hours). Return immediately if you see signs of infection (redness, pus, or fever).</p>
<p>Yesterday's record (medical-4.docx) is the dental visit dated 2026/05/03. The main advice for your tooth pain is to rinse your mouth frequently, use painkillers as needed, and consult about extraction if the pain doesn't improve. Note that specific medication names and dosages weren't filled in on this form — you may want to confirm those details with Dr. User.</p>`,
      },
    ],
  },

  // ── Prompt C + Anthropic owned ────────────────────
  'C-anthropic': {
    userMessage: 'Last week I had a health checkup. Can you look at my calendar to find the exact date and details of that appointment, then search my medical folder for any files saved around that time and read them to tell me what the diagnosis was and what medications I need to take.',
    thinking: `The user had a health checkup last week and needs me to find the details. Let me:

1. First, search the calendar for any health-related appointments from last week
2. Once I find the exact date, search the medical folder for files created around that time
3. Read the files to extract the diagnosis and medication information

This is a multi-step process — calendar first, then file search based on the appointment date.`,
    blocks: [
      {
        type: 'text',
        html: `<p>The time period is April 19–25.</p>`,
      },
      {
        type: 'tool',
        name: 'Lists calendar events in a given calendar.',
        source: '',
        request: `{
  "startTime": "2026-04-12T00:00:00",
  "endTime": "2026-04-18T23:59:59",
  "orderBy": "startTime",
  "pageSize": 50
}`,
        response: `{
  "summary": "User2026@gmail.com",
  "updated": "2026-04-12T08:09:11Z",
  "timeZone": "America/New_York",
  "accessRole": "owner",
  "defaultReminders": [
    {
      "method": "popup",
      "minutes": 30
    }
  ],
  "events": [
    {
      "id": "7ln6f7oc4knasrpgsfoe06uros",
      "status": "confirmed",
      "htmlLink": "https://www.google.com/calendar/event?eid=N2xuNmY3b2M0a25hc3JwZ3Nmb2UwNnVyb3MgdGVzdGN5YmVyMjAyNUBt",
      "created": "2026-04-04T19:49:29Z",
      "updated": "2026-04-04T19:49:30Z",
      "summary": "Treatment Plan Meeting – Dr. User",
      "description": "Meeting with Dr. User (Office of Patient Care, XX Medical Center) to review treatment plan, discuss progress, and address questions or concerns",
      "creator": {
        "email": "User2026@gmail.com",
        "self": true
      },
      "organizer": {
        "email": "User2026@gmail.com",
        "self": true
      },
      "start": {
        "dateTime": "2026-04-15T10:00:00-04:00",
        "timeZone": "America/New_York"
      },
      "end": {
        "dateTime": "2026-04-15T11:00:00-04:00",
        "timeZone": "America/New_York"
      },
      "eventType": "default",
      "conferenceUrl": "https://meet.google.com/pgx-moxg-gjb",
      "colorId": "7"
    },
    {
      "id": "040fgo1egut7r05fkrhv2qin5q",
      "status": "confirmed",
      "htmlLink": "https://www.google.com/calendar/event?eid=MDQwZmdvMWVndXQ3cjA1ZmtyaHYycWluNXEgdGVzdGN5YmVyMjAyNUBt",
      "created": "2026-04-05T19:47:20Z",
      "updated": "2026-04-05T19:47:20Z",
      "summary": "Project-prepare",
      "creator": {
        "email": "User2026@gmail.com",
        "self": true
      },
      "organizer": {
        "email": "User2026@gmail.com",
        "self": true
      },
      "start": {
        "dateTime": "2026-04-16T12:00:00-04:00",
        "timeZone": "America/New_York"
      },
      "end": {
        "dateTime": "2026-04-16T15:30:00-04:00",
        "timeZone": "America/New_York"
      },
      "eventType": "default"
    },
    {
      "id": "79mb6sp1cn44sef5a01bhbggn7",
      "status": "confirmed",
      "htmlLink": "https://www.google.com/calendar/event?eid=NzltYjZzcDFjbjQ0c2VmNWEwMWJoYmdnbjcgdGVzdGN5YmVyMjAyNUBt",
      "created": "2026-04-06T19:47:41Z",
      "updated": "2026-04-06T19:47:41Z",
      "summary": "Gym",
      "creator": {
        "email": "User2026@gmail.com",
        "self": true
      },
      "organizer": {
        "email": "User2026@gmail.com",
        "self": true
      },
      "start": {
        "dateTime": "2026-04-16T16:00:00-04:00",
        "timeZone": "America/New_York"
      },
      "end": {
        "dateTime": "2026-04-16T17:00:00-04:00",
        "timeZone": "America/New_York"
      },
      "eventType": "default"
    },
    {
      "id": "1ci7vkg583gjk60kej1tvoqsas",
      "status": "confirmed",
      "htmlLink": "https://www.google.com/calendar/event?eid=MWNpN3ZrZzU4M2dqazYwa2VqMXR2b3FzYXMgdGVzdGN5YmVyMjAyNUBt",
      "created": "2026-04-04T19:47:57Z",
      "updated": "2026-04-04T19:47:57Z",
      "summary": "Project-presentation",
      "creator": {
        "email": "User2026@gmail.com",
        "self": true
      },
      "organizer": {
        "email": "User2026@gmail.com",
        "self": true
      },
      "start": {
        "dateTime": "2026-04-17T13:30:00-04:00",
        "timeZone": "America/New_York"
      },
      "end": {
        "dateTime": "2026-04-17T14:30:00-04:00",
        "timeZone": "America/New_York"
      },
      "eventType": "default"
    }
  ]
}`,
      },
      {
        type: 'text',
        html: `<p>I found 4 events in the given time range. The event on April 15th — <strong>"Treatment Plan Meeting – Dr. User"</strong> at 10:00–11:00 AM — is the one related to your health checkup. It's a meeting with Dr. User at the Office of Patient Care, XX Medical Center, to review your treatment plan and discuss progress.</p>`,
      },
      {
        type: 'tool',
        name: 'List allowed dictories',
        source: '',
        request: ``,
        response: `Allowed directories:
/Users/Documents/MCP/FileSystem`,
      },
      {
        type: 'tool',
        name: 'Search files',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem",
  "pattern": "**/*medical*"
}`,
        response: `/Users/Documents/MCP/FileSystem/medical
/Users/Documents/MCP/FileSystem/medical/medical-1.docx
/Users/Documents/MCP/FileSystem/medical/medical-2.docx
/Users/Documents/MCP/FileSystem/medical/medical-3.docx
/Users/Documents/MCP/FileSystem/medical/medical-4.docx`,
      },
      {
        type: 'text',
        html: `<p>I found your medical folder with 4 files. Let me now read the skill guide for docx files, then read each one.</p>`,
      },
      {
        type: 'tool',
        name: 'Get file info',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-1.docx"
}`,
        response: `size: 17853
created: Thu Apr 15 2026 11:32:02 GMT-0400 (Eastern Daylight Time)
modified: Thu Apr 15 2026 11:32:02 GMT-0400 (Eastern Daylight Time)
accessed: Thu Apr 15 2026 11:32:02 GMT-0400 (Eastern Daylight Time)
isDirectory: false
isFile: true
permissions: 644`,
      },
      {
        type: 'tool',
        name: 'Get file info',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-2.docx"
}`,
        response: `size: 17416
created: Thu Apr 23 2026 11:32:02 GMT-0400 (Eastern Daylight Time)
modified: Tue Apr 28 2026 14:10:51 GMT-0400 (Eastern Daylight Time)
accessed: Tue Apr 28 2026 14:10:51 GMT-0400 (Eastern Daylight Time)
isDirectory: false
isFile: true
permissions: 644`,
      },
      {
        type: 'tool',
        name: 'Get file info',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-3.docx"
}`,
        response: `size: 17899
created: Thu Apr 23 2026 11:32:02 GMT-0400 (Eastern Daylight Time)
modified: Tue Apr 28 2026 14:11:15 GMT-0400 (Eastern Daylight Time)
accessed: Tue Apr 28 2026 14:11:15 GMT-0400 (Eastern Daylight Time)
isDirectory: false
isFile: true
permissions: 644`,
      },
      {
        type: 'tool',
        name: 'Get file info',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-4.docx"
}`,
        response: `size: 17905
created: Thu Apr 23 2026 11:32:02 GMT-0400 (Eastern Daylight Time)
modified: Mon May 04 2026 15:15:56 GMT-0400 (Eastern Daylight Time)
accessed: Mon May 04 2026 15:15:56 GMT-0400 (Eastern Daylight Time)
isDirectory: false
isFile: true
permissions: 644`,
      },
      {
        type: 'text',
        html: `<p>Done.</p>
<p>This is exactly the right approach. The metadata tells us clearly:</p>
<table style="border-collapse:collapse;width:100%;margin:8px 0;">
<tr><th style="text-align:left;padding:4px 8px;border-bottom:1px solid #ddd;">File</th><th style="text-align:left;padding:4px 8px;border-bottom:1px solid #ddd;">Last Modified</th></tr>
<tr><td style="padding:4px 8px;">medical-1.docx</td><td style="padding:4px 8px;">Apr 15</td></tr>
<tr><td style="padding:4px 8px;">medical-2.docx</td><td style="padding:4px 8px;">Apr 28</td></tr>
<tr><td style="padding:4px 8px;">medical-3.docx</td><td style="padding:4px 8px;">Apr 28</td></tr>
<tr><td style="padding:4px 8px;">medical-4.docx</td><td style="padding:4px 8px;">May 03</td></tr>
</table>
<p>Only medical-1.docx was modified April 15th, so that's the only file worth reading.</p>`,
      },
      {
        type: 'tool',
        name: 'Read multiple files',
        source: '',
        request: `{
  "paths": [
    "/Users/yjz/Documents/Project/MCP_Permission/FileSystem/medical/medical-1.docx"
  ]
}`,
        response: `1. Patient Information
•	Full Name: ___Test___________________________
•	Date of Birth: _______2000/01/01______________
•	Gender: ______Male___________________________
•	Address: __123ABC Street. Zip 32856_________________
•	Phone Number: __600-123-4567_____________________
•	Email: ____User2026@gmail.com_________________
•	ID / Passport No.: ____1234567________________
2. Appointment Details
•	Date of Visit: ____2026/04/15____________
•	Time: ___10:00 AM______________________________
•	Department: ____Dentist________________________
•	Physician Name: ___Dr.User_____________________
3. Medical History
•	Past Illnesses: _________________________
•	Surgeries: _____________________________
•	Allergies: _____________________________
•	Current Medications: ____________________
•	Family Medical History: ________________
4. Chief Complaint
(Reason for visit / Symptoms)
The patient reports tooth pain requiring treatment.

5. Physical Examination
•	Temperature: ______/_____________________
•	Blood Pressure: ______/__________________
•	Heart Rate: ______/______________________
•	Respiratory Rate: _________/_____________
•	Weight: _________/______________________
•	Height: __________/_____________________
6. Diagnosis
The patient should rinse their mouth frequently every day. Painkillers may be taken to alleviate pain, and an appointment for tooth extraction can be scheduled if necessary.

7. Treatment Plan / Prescription
•	Medication: ____/________________________
•	Dosage: _____/__________________________
•	Instructions: _______/___________________

8. Additional Notes


9. Follow-Up
•	Next Appointment Date: _______/__________
•	Special Instructions: _______/___________
10. Physician's Signature
•	Name: _______/__________________________
•	Signature: _________/___________________
•	Date: ____________/_____________________`,
      },
      {
        type: 'text',
        html: `<p><strong>📋 Medical Records Summary:</strong></p>
<p><strong>Personal Details:</strong> Test · DOB: 2000/01/01 · Male · 123ABC Street, Zip 32856 · Phone: 600-123-4567 · Email: User2026@gmail.com</p>
<p><strong>🦷 Dental Visit — April 15, 2026 at 10:00 AM:</strong></p>
<ul>
  <li><strong>Department:</strong> Dentistry</li>
  <li><strong>Physician:</strong> Dr. User</li>
  <li><strong>Condition:</strong> Tooth pain requiring treatment</li>
</ul>
<p><strong>💊 How to Manage:</strong></p>
<ol>
  <li>Rinse your mouth frequently every day</li>
  <li>Painkillers may be taken to alleviate pain</li>
  <li>A tooth extraction appointment can be scheduled if necessary</li>
</ol>`,
      },
    ],
  },

  // ── Prompt C + Third party ─────────────────────────
  'C-third-party': {
    userMessage: 'Last week I had a health checkup. Can you look at my calendar to find the exact date and details of that appointment, then search my medical folder for any files saved around that time and read them to tell me what the diagnosis was and what medications I need to take.',
    thinking: `The user had a health checkup last week and needs me to find the details. Using third-party tools, I can check their calendar for appointments and search the medical folder for relevant records.

Let me:
1. First check the calendar for any health-related appointments during the April 19–25 window
2. Then search the medical directory for files
3. Read the relevant files to extract diagnosis and medication information

I'll use the community filesystem tools to locate and read the medical records.`,
    blocks: [
      {
        type: 'text',
        html: `<p>The time period is April 19–25.</p>`,
      },
      {
        type: 'tool',
        name: 'List events from a calendar.',
        source: '',
        request: `{
  "calendarId": "User2026@gmail.com",
  "timeMin": "2026-04-19T00:00:00-05:00",
  "timeMax": "2026-04-25T23:59:00-05:00"
}`,
        response: `Treatment Plan Meeting – Dr. User (7ln6f7oc4knasrpgsfoe06uros)
Start: 2026-04-15T10:00:00-11:00:00

Project-prepare (1g1pc1v2n2polnia4r9ugqmeku)
Start: 2026-04-16T12:00:00-04:00
End: 2026-04-16T15:30:00-04:00

Gym (0c2qvb2ihr9aumnt0n0nqttvqc)
Start: 2026-04-16T16:00:00-04:00
End: 2026-04-16T17:00:00-04:00

Project-presentation (4ee795s96s04157k4cbvrh3tom)
Start: 2026-04-17T13:30:00-04:00
End: 2026-04-17T14:30:00-04:00`,
      },
      {
        type: 'text',
        html: `<p>I found 4 events in the given time range. The event on April 15th — <strong>"Treatment Plan Meeting – Dr. User"</strong> — is the most relevant to your health checkup.</p>`,
      },
      {
        type: 'text',
        html: `<p>Let me check your allowed directories.</p>`,
      },
      {
        type: 'tool',
        name: 'List directory tree',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem",
  "includeNested": true
}`,
        response: `📁 FileSystem
├── 📁 medical
│   ├── 📄 medical-1.docx
│   ├── 📄 medical-2.docx
│   ├── 📄 medical-3.docx
│   └── 📄 medical-4.docx
├── 📄 .DS_Store
├── 📄 1.txt
├── 📄 2.txt
├── 📄 3.txt
├── 📄 note_bug.txt
├── 📄 note_ideas.txt
├── 📄 note_log.txt
├── 📄 note_summary.txt
└── 📄 Response.txt`,
      },
      {
        type: 'text',
        html: `<p>I found the medical folder with 4 files. Since these are .docx files, let me read the skill for handling them, then extract the contents. The file-system MCP tool can access your local Mac filesystem directly — let me use it to read the files.</p>`,
      },
      {
        type: 'tool',
        name: 'Read file',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-1.docx"
}`,
        response: `1. Patient Information
•	Full Name: ___Test___________________________
•	Date of Birth: _______2000/01/01______________
•	Gender: ______Male___________________________
•	Address: __123ABC Street. Zip 32856_________________
•	Phone Number: __600-123-4567_____________________
•	Email: ____User2026@gmail.com_________________
•	ID / Passport No.: ____1234567________________
2. Appointment Details
•	Date of Visit: ____2026/04/15____________
•	Time: ___10:00 AM______________________________
•	Department: ____Dentist________________________
•	Physician Name: ___Dr.User_____________________
3. Medical History
•	Past Illnesses: _________________________
•	Surgeries: _____________________________
•	Allergies: _____________________________
•	Current Medications: ____________________
•	Family Medical History: ________________
4. Chief Complaint
(Reason for visit / Symptoms)
The patient reports tooth pain requiring treatment.

5. Physical Examination
•	Temperature: ______/_____________________
•	Blood Pressure: ______/__________________
•	Heart Rate: ______/______________________
•	Respiratory Rate: _________/_____________
•	Weight: _________/______________________
•	Height: __________/_____________________
6. Diagnosis
The patient should rinse their mouth frequently every day. Painkillers may be taken to alleviate pain, and an appointment for tooth extraction can be scheduled if necessary.

7. Treatment Plan / Prescription
•	Medication: ____/________________________
•	Dosage: _____/__________________________
•	Instructions: _______/___________________

8. Additional Notes


9. Follow-Up
•	Next Appointment Date: _______/__________
•	Special Instructions: _______/___________
10. Physician's Signature
•	Name: _______/__________________________
•	Signature: _________/___________________
•	Date: ____________/_____________________`,
      },
      {
        type: 'tool',
        name: 'Read file',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-2.docx"
}`,
        response: `MEDICAL REPORT / MEDICAL FORM
1. Patient Information
• Full Name: Test________________________
• Date of Birth: 2000/01/01_______
• Gender: Male_____________________
• Address: 123ABC Street. Zip 32856_______________
• Phone Number: 600-123-4567___________________
• Email: User2026@gmail.com_____________
• ID / Passport No.: 1234567____________
2. Appointment Details
• Appointment Notification: Sent via Email_____________
• Date of Visit: 2026/02/01________
• Time: 11:00 AM___________________________
• Department: General Medicine____________
• Physician Name: Dr. User__________________
3. Medical History
• Past Illnesses: _________________________
• Surgeries: _____________________________
• Allergies: _____________________________
• Current Medications: ____________________
• Family Medical History: ________________
4. Chief Complaint
(Reason for visit / Symptoms)
The patient reports symptoms of a common cold, including cough, sore throat, nasal congestion, and mild fever.
5. Physical Examination
• Temperature: /_______________
• Blood Pressure: /____________
• Heart Rate: /________________
• Respiratory Rate: /____
• Weight: /_____________
• Height: /___________
6. Diagnosis
The patient is diagnosed with an acute upper respiratory infection (common cold). Symptoms are mild to moderate and consistent with a viral infection.
7. Treatment Plan / Prescription
• Medication:
•	Acetaminophen (for fever and pain relief)
•	Cough syrup (as needed)
•	Antihistamines (for nasal symptoms)
• Dosage:
•	As directed on medication labels or physician instructions
• Instructions:
•	Rest adequately
•	Drink plenty of fluids
•	Take medications as prescribed
•	Avoid cold environments and maintain good hygiene
•	Seek medical attention if symptoms worsen or persist beyond 5-7 days
8. Additional Notes
The condition is self-limiting and expected to improve with supportive care.
9. Follow-Up
• Next Appointment Date: /___
• Special Instructions: Return if symptoms worsen or new symptoms develop
10. Physician's Signature
• Name: /___________________
• Signature: /__________
• Date: /_________`,
      },
      {
        type: 'tool',
        name: 'Read file',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-3.docx"
}`,
        response: `MEDICAL REPORT / MEDICAL FORM
1. Patient Information
• Full Name: Test________________________
• Date of Birth: 2000/01/01_______
• Gender: Male_____________________
• Address: 123ABC Street. Zip 32856_______________
• Phone Number: 600-123-4567___________________
• Email: User2026@gmail.com_____________
• ID / Passport No.: 1234567____________
2. Appointment Details
• Appointment Notification: Sent via Email_____________
• Date of Visit: 2025/08/15________
• Time: 4:00 PM___________________________
• Department: Emergency / Orthopedics____________
• Physician Name: Dr. User__________________
3. Medical History
• Past Illnesses: _________________________
• Surgeries: _____________________________
• Allergies: _____________________________
• Current Medications: ____________________
• Family Medical History: ________________
4. Chief Complaint
(Reason for visit / Symptoms)
The patient reports a leg injury caused by a minor accident, with pain, swelling, and difficulty walking.
5. Physical Examination
• Temperature: /_______________
• Blood Pressure: /____________
• Heart Rate: /________________
• Respiratory Rate: /____
• Weight: /_____________
• Height: /___________
6. Diagnosis
The patient is diagnosed with a soft tissue injury to the leg, with superficial wound and mild swelling. No obvious fracture is observed upon initial examination.
7. Treatment Plan / Prescription
• Treatment Provided:
•	Wound cleaned and disinfected
•	Sterile dressing applied
•	Compression bandage placed on the injured area
• Medication:
•	Pain relievers (e.g., Acetaminophen or Ibuprofen)
•	Topical antibiotic ointment
• Dosage:
•	As directed by the physician
• Instructions:
•	Keep the wound clean and dry
•	Change dressing daily or as instructed
•	Avoid excessive movement or weight-bearing on the injured leg
•	Elevate the leg to reduce swelling
•	Apply ice packs (15-20 minutes every few hours during the first 24-48 hours)
•	Return immediately if signs of infection appear (redness, pus, fever)
8. Additional Notes
Further imaging (e.g., X-ray) may be recommended if pain persists or worsens.
9. Follow-Up
• Next Appointment Date: /___
• Special Instructions: Follow up in 3-5 days for wound check and dressing change
10. Physician's Signature
• Name: /___________________
• Signature: /__________
• Date: /_________`,
      },
      {
        type: 'tool',
        name: 'Read file',
        source: '',
        request: `{
  "path": "/Users/Documents/MCP/FileSystem/medical/medical-4.docx"
}`,
        response: `1. Patient Information
•	Full Name: ___Test___________________________
•	Date of Birth: _______2000/01/01______________
•	Gender: ______Male___________________________
•	Address: __123ABC Street. Zip 32856_________________
•	Phone Number: __600-123-4567_____________________
•	Email: ____User2026@gmail.com_________________
•	ID / Passport No.: ____1234567________________
2. Appointment Details
•	Date of Visit: ____2026/05/04____________
•	Time: ___10:00 AM______________________________
•	Department: ____Dentist________________________
•	Physician Name: ___Dr.User_____________________
3. Medical History
•	Past Illnesses: _________________________
•	Surgeries: _____________________________
•	Allergies: _____________________________
•	Current Medications: ____________________
•	Family Medical History: ________________
4. Chief Complaint
(Reason for visit / Symptoms)
The patient reports tooth pain requiring treatment.

5. Physical Examination
•	Temperature: ______/_____________________
•	Blood Pressure: ______/__________________
•	Heart Rate: ______/______________________
•	Respiratory Rate: _________/_____________
•	Weight: _________/______________________
•	Height: __________/_____________________
6. Diagnosis
The patient should rinse their mouth frequently every day. Painkillers may be taken to alleviate pain, and an appointment for tooth extraction can be scheduled if necessary.

7. Treatment Plan / Prescription
•	Medication: ____/________________________
•	Dosage: _____/__________________________
•	Instructions: _______/___________________

8. Additional Notes


9. Follow-Up
•	Next Appointment Date: _______/__________
•	Special Instructions: _______/___________
10. Physician's Signature
•	Name: _______/__________________________
•	Signature: _________/___________________
•	Date: ____________/_____________________`,
      },
      {
        type: 'text',
        html: `<p>I've successfully read all four of your medical files. Here's a clear summary of what they contain:</p>
<p><strong>Your Personal Details (across all files)</strong></p>
<ul>
  <li><strong>Full Name:</strong> Test</li>
  <li><strong>Date of Birth:</strong> 2000/01/01</li>
  <li><strong>Gender:</strong> Male</li>
  <li><strong>Address:</strong> 123ABC Street, Zip 32856</li>
  <li><strong>Phone:</strong> 600-123-4567</li>
  <li><strong>Email:</strong> User2026@gmail.com</li>
  <li><strong>ID/Passport No.:</strong> 1234567</li>
</ul>
<p><strong>Medical Records Summary</strong></p>
<p><strong>📄 medical-1.docx — Dental Visit (2026/04/15, 10:00 AM)</strong><br>
Department: Dentistry | Physician: Dr. User<br>
Condition: Tooth pain requiring treatment.<br>
Diagnosis & How to manage it:</p>
<ul>
  <li>Rinse your mouth frequently every day.</li>
  <li>Painkillers may be taken to alleviate pain.</li>
  <li>A tooth extraction appointment can be scheduled if necessary.</li>
</ul>
<p><strong>📄 medical-4.docx — Dental Visit (2026/05/03, 10:00 AM)</strong><br>
Department: Dentistry | Physician: Dr. User<br>
This is a later record. The condition and treatment are identical to medical-1:<br>
Condition: Tooth pain requiring treatment.<br>
Diagnosis & How to manage it:</p>
<ul>
  <li>Rinse your mouth frequently every day.</li>
  <li>Painkillers may be taken to alleviate pain.</li>
  <li>A tooth extraction appointment can be scheduled if necessary.</li>
</ul>
<p><strong>📄 medical-2.docx — General Medicine Visit (2026/02/01, 11:00 AM)</strong><br>
Condition: Common cold (acute upper respiratory infection) — cough, sore throat, nasal congestion, mild fever.<br>
Medications & How to take them:</p>
<ul>
  <li><strong>Acetaminophen</strong> — for fever and pain relief, as directed on the label.</li>
  <li><strong>Cough syrup</strong> — as needed.</li>
  <li><strong>Antihistamines</strong> — for nasal symptoms, as directed.</li>
</ul>
<p>Instructions: Rest, drink plenty of fluids, avoid cold environments, maintain good hygiene. Seek attention if symptoms persist beyond 5–7 days.</p>
<p><strong>📄 medical-3.docx — Emergency/Orthopedics Visit (2025/08/15, 4:00 PM)</strong><br>
Condition: Soft tissue leg injury from a minor accident — pain, swelling, difficulty walking. No fracture detected.<br>
Medications & How to take them:</p>
<ul>
  <li><strong>Acetaminophen or Ibuprofen</strong> — pain relief, as directed by the physician.</li>
  <li><strong>Topical antibiotic ointment</strong> — applied to the wound.</li>
</ul>
<p>Instructions: Keep wound clean and dry, change dressing daily, avoid weight-bearing on the leg, elevate the leg to reduce swelling, apply ice packs (15–20 min every few hours for the first 24–48 hours). Return immediately if you see signs of infection (redness, pus, or fever).</p>
<p><strong>📌 Conclusion:</strong> The most relevant record is <strong>medical-1.docx</strong>, dated April 15, 2026 — the same day as your "Treatment Plan Meeting – Dr. User" appointment. This is a dental visit with Dr. User for tooth pain. The recommended management is to rinse your mouth frequently, take painkillers as needed to alleviate pain, and schedule a tooth extraction appointment if the pain persists.</p>`,
      },
    ],
  },
};

// ── DOM Refs ────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const DOM = {
  // Banner
  scenarioBanner: $('#scenarioBanner'),
  scenarioBadge: $('#scenarioBadge'),
  scenarioMcpBadge: $('#scenarioMcpBadge'),
  scenarioStatus: $('#scenarioStatus'),
  topBarMcpLabel: $('#topBarMcpLabel'),

  // Message
  userMessageText: $('#userMessageText'),

  // Thinking
  thinkingSection: $('#thinkingSection'),
  thinkingHeader: $('#thinkingHeader'),
  thinkingToggle: $('#thinkingToggle'),
  thinkingBody: $('#thinkingBody'),
  thinkingText: $('#thinkingText'),
  thinkingDuration: $('#thinkingDuration'),

  // Blocks (text + tools)
  blocksContainer: $('#blocksContainer'),

  // Final response
  finalResponseText: $('#finalResponseText'),

  // Buttons
  copyResponseBtn: $('#copyResponseBtn'),
  retryBtn: $('#retryBtn'),
  thumbsUpBtn: $('#thumbsUpBtn'),
  thumbsDownBtn: $('#thumbsDownBtn'),
  backToInputBtn: $('#backToInputBtn'),
  returnBtn: $('#returnBtn'),

  // Completion
  completionHint: $('#completionHint'),

  // Sidebar
  sidebar: $('#sidebar'),
  sidebarToggle: $('#sidebarToggle'),
  mobileSidebarToggle: $('#mobileSidebarToggle'),
  overlay: $('#overlay'),
  newChatBtn: $('#newChatBtn'),
  sidebarSearch: $('#sidebarSearch'),
  userProfile: $('#userProfile'),
  shareBtn: $('#shareBtn'),

  // History
  historyItems: $$('.history-item'),
};

// ── State ───────────────────────────────────────────
const STATE = {
  prompt: null,
  mcp: null,
  mcpLabel: null,
  scenarioKey: null,
  thinkingExpanded: true,
  thinkingExpandTime: null,
  blocks: [],          // array of all blocks from content.blocks
  blockStates: {},      // { blockIndex: { allowed, denied, action, revealed } }
  alwaysAllowActive: false,
  pageEnterTime: null,
  sidebarOpen: true,
  isMobile: false,
  mobileSidebarOpen: false,
};

// ── Tracking ────────────────────────────────────────
const TRACKING_KEY = 'claude_mcp_tracking';

function getTrackingData() {
  try {
    const raw = localStorage.getItem(TRACKING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
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
    eventId: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    timestamp: new Date().toISOString(),
    scenario: STATE.scenarioKey,
    detail,
  };
  data.events.push(event);
  saveTrackingData(data);
  console.log(`[Track] ${type}`, detail);
  return event;
}

// ── Parse URL Params ────────────────────────────────
function parseParams() {
  const params = new URLSearchParams(window.location.search);
  const prompt = params.get('prompt');
  const mcp = params.get('mcp');

  if (!prompt || !mcp) {
    showError('Missing parameters. Please go back and select a prompt and MCP category.');
    return false;
  }

  const mcpLabel = mcp === 'anthropic' ? 'Anthropic owned' : 'Third party';
  const scenarioKey = `${prompt}-${mcp === 'anthropic' ? 'anthropic' : 'third-party'}`;

  STATE.prompt = prompt;
  STATE.mcp = mcp;
  STATE.mcpLabel = mcpLabel;
  STATE.scenarioKey = scenarioKey;
  STATE.pageEnterTime = Date.now();

  return true;
}

// ── Get Content ─────────────────────────────────────
function getContent() {
  // Map URL mcp param to content key
  const mcpContentKey = STATE.mcp === 'anthropic' ? 'anthropic' : 'third-party';
  const key = `${STATE.prompt}-${mcpContentKey}`;

  if (SCENARIO_CONTENT[key]) {
    return SCENARIO_CONTENT[key];
  }

  // Fallback — show which key is missing
  console.warn(`No content found for key: "${key}". Available keys:`, Object.keys(SCENARIO_CONTENT));
  return getFallbackContent();
}

function getFallbackContent() {
  return {
    userMessage: `[Content not yet configured for Prompt ${STATE.prompt} + ${STATE.mcpLabel}]`,
    thinking: 'Content placeholder — edit SCENARIO_CONTENT in response.js to fill this in.',
    blocks: [
      { type: 'text', html: '<p><em>This is a placeholder. Edit SCENARIO_CONTENT in <code>control/js/response.js</code>.</em></p>' },
    ],
  };
}

// ── Error Display ───────────────────────────────────
function showError(message) {
  document.body.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
      <div style="text-align:center;max-width:400px;padding:40px;">
        <h2 style="color:#d32f2f;margin-bottom:12px;">⚠️ Error</h2>
        <p style="color:#666;margin-bottom:20px;">${message}</p>
        <a href="homepage.html" style="color:#d97757;font-weight:500;">← Back to prompt selection</a>
      </div>
    </div>`;
}

// ── Render ──────────────────────────────────────────
function renderPage() {
  if (!parseParams()) return;

  const content = getContent();

  // Track page enter
  trackEvent('response_page_enter', {
    prompt: STATE.prompt,
    mcp: STATE.mcp,
    mcpLabel: STATE.mcpLabel,
    scenarioKey: STATE.scenarioKey,
    hasContent: !!SCENARIO_CONTENT[STATE.scenarioKey],
  });

  // Update banner
  DOM.scenarioBadge.textContent = `Prompt ${STATE.prompt}`;
  DOM.scenarioMcpBadge.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> ${STATE.mcpLabel}`;
  DOM.topBarMcpLabel.textContent = "Claude Opus 4.8";

  // Update completion stats
  updateCompletionDisplay();

  // Render user message
  DOM.userMessageText.textContent = content.userMessage;

  // Render thinking
  renderThinking(content);

  const notifScenarios = ['A-anthropic','A-third-party','B-anthropic','B-third-party','C-anthropic','C-third-party'];
  if (notifScenarios.includes(STATE.scenarioKey)) {
    STATE._pendingContent = content;
    const cardMap = { 'A-anthropic':'notificationCard', 'A-third-party':'notificationCard3', 'B-anthropic':'notificationCardB', 'B-third-party':'notificationCardBT', 'C-anthropic':'notificationCardCA', 'C-third-party':'notificationCardCT' };
    const cardId = cardMap[STATE.scenarioKey] || 'notificationCard';
    setTimeout(() => {
      const card = document.getElementById(cardId);
      if (card) { card.style.display = ''; card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      trackEvent('notification_card_shown', { scenarioKey: STATE.scenarioKey });
      setTimeout(() => {
        renderContentBlocks(STATE._pendingContent);
        STATE._pendingContent = null;
      }, 800);
    }, 2000);
  } else {
    renderContentBlocks(content);
  }

  // Scroll to top of response
  DOM.scenarioBanner.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Render Thinking ─────────────────────────────────
function renderThinking(content) {
  STATE.thinkingExpanded = false;
  STATE.thinkingExpandTime = null;

  DOM.thinkingText.textContent = content.thinking;
  DOM.thinkingDuration.textContent = '(~2s)';
  DOM.thinkingSection.classList.add('collapsed');

  // Track that thinking is collapsed by default
  trackEvent('thinking_view', {
    autoExpanded: false,
    thinkingLength: content.thinking.length,
  });
}

// ── Render Tool Calls ───────────────────────────────
function renderBlocks(blocks) {
  DOM.blocksContainer.innerHTML = '';
  STATE.blocks = blocks;
  STATE.blockStates = {};

  let toolCounter = 0;
  let firstToolSeen = false;

  blocks.forEach((block, blockIndex) => {
    STATE.blockStates[blockIndex] = {
      allowed: false,
      denied: false,
      action: null,
      revealed: false,
    };

    const el = document.createElement('div');

    if (block.type === 'text') {
      el.className = 'text-block';
      el.id = `textBlock${blockIndex}`;
      el.innerHTML = `<div class="text-block-content">${block.html}</div>`;

      // First text block is visible, rest hidden
      if (blockIndex === 0) {
        el.style.display = '';
        STATE.blockStates[blockIndex].revealed = true;
      } else {
        el.style.display = 'none';
      }
    } else if (block.type === 'tool') {
      const toolIndex = toolCounter;
      el.className = 'tool-call-block';
      el.dataset.blockIndex = blockIndex;
      el.id = `toolBlock${toolIndex}`;
      el.innerHTML = buildToolBlockHTML(block, toolIndex);

      // First tool is visible, rest hidden
      if (!firstToolSeen) {
        el.style.display = '';
        STATE.blockStates[blockIndex].revealed = true;
        firstToolSeen = true;
      } else {
        el.style.display = 'none';
      }

      // Attach tool listeners
      attachToolListeners(el, toolIndex, blockIndex);

      toolCounter++;
    }

    DOM.blocksContainer.appendChild(el);
  });
}

function buildTextBlockHTML(html) {
  return `<div class="text-block-content">${html}</div>`;
}

function buildToolBlockHTML(tool, index) {
  return `
    <div class="tool-call-header">
      <div class="tool-call-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      </div>
      <div class="tool-call-info">
        <div class="tool-call-title">${escapeHTML(tool.name)}</div>
        ${tool.source ? `<div class="tool-call-source">From: ${escapeHTML(tool.source)}</div>` : ''}
      </div>
    </div>

    <!-- Action buttons (above request/response, visible immediately) -->
    <div class="tool-actions" id="toolActions${index}">
      <div class="allow-dropdown" id="allowDropdown${index}">
        <button class="allow-dropdown-btn" id="allowDropdownBtn${index}">
          <span class="allow-btn-text" id="allowBtnText${index}">Always allow</span>
          <span class="allow-btn-arrow" id="allowBtnArrow${index}">
            <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </button>
        <div class="allow-dropdown-menu" id="allowDropdownMenu${index}">
          <button class="allow-dropdown-option selected" data-allow-mode="always-allow">
            <span>Always allow</span>
            <svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
          <button class="allow-dropdown-option" data-allow-mode="allow-once">
            <span>Allow once</span>
            <svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        </div>
      </div>
      <button class="tool-action-btn deny-btn" data-action="deny" data-tool="${index}">Deny</button>
    </div>

    <!-- Request (hidden until allowed, then collapsible) -->
    <div class="tool-detail-section request-section" id="toolRequest${index}">
      <div class="tool-detail-header" id="toolRequestHeader${index}">
        <div class="tool-detail-header-left">
          <svg class="tool-detail-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span class="tool-detail-badge request">REQUEST</span>
        </div>
      </div>
      <div class="tool-detail-body">
        <pre class="tool-detail-code">${escapeHTML(tool.request)}</pre>
      </div>
    </div>

    <!-- Response (hidden until allowed, then collapsible) -->
    <div class="tool-detail-section response-section" id="toolResponse${index}">
      <div class="tool-detail-header" id="toolResponseHeader${index}">
        <div class="tool-detail-header-left">
          <svg class="tool-detail-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span class="tool-detail-badge response">RESPONSE</span>
        </div>
      </div>
      <div class="tool-detail-body">
        <pre class="tool-detail-code">${escapeHTML(tool.response)}</pre>
      </div>
    </div>
  `;
}

function attachToolListeners(block, toolIndex, blockIndex) {
  // --- Request toggle (collapsible) ---
  const requestHeader = block.querySelector(`#toolRequestHeader${toolIndex}`);
  const requestSection = block.querySelector(`#toolRequest${toolIndex}`);
  if (requestHeader) {
    requestHeader.addEventListener('click', () => {
      const isExpanded = requestSection.classList.contains('expanded');
      if (isExpanded) {
        requestSection.classList.remove('expanded');
        trackEvent('tool_request_collapse', { blockIndex, toolIndex });
      } else {
        requestSection.classList.add('expanded');
        trackEvent('tool_request_expand', { blockIndex, toolIndex });
      }
    });
  }

  // --- Response toggle (works after revealed) ---
  const responseHeader = block.querySelector(`#toolResponseHeader${toolIndex}`);
  const responseSection = block.querySelector(`#toolResponse${toolIndex}`);
  if (responseHeader) {
    responseHeader.addEventListener('click', () => {
      if (!responseSection.classList.contains('response-revealed')) return; // not revealed yet
      const isExpanded = responseSection.classList.contains('expanded');
      if (isExpanded) {
        responseSection.classList.remove('expanded');
        trackEvent('tool_response_collapse', { blockIndex, toolIndex });
      } else {
        responseSection.classList.add('expanded');
        trackEvent('tool_response_expand', { blockIndex, toolIndex });
      }
    });
  }

  // --- Allow button: text = Always allow, arrow = dropdown ---
  const dropdown = block.querySelector(`#allowDropdown${toolIndex}`);
  const btnText = block.querySelector(`#allowBtnText${toolIndex}`);
  const btnArrow = block.querySelector(`#allowBtnArrow${toolIndex}`);
  const dropdownMenu = block.querySelector(`#allowDropdownMenu${toolIndex}`);
  const dropdownOptions = dropdownMenu.querySelectorAll('.allow-dropdown-option');

  // Click text → execute Always allow immediately
  btnText.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.remove('open');
    handleAllow(blockIndex, toolIndex, 'always-allow', block);
  });

  // Click arrow → toggle dropdown
  btnArrow.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');
    if (isOpen) {
      dropdown.classList.remove('open');
      trackEvent('allow_dropdown_close', { toolIndex, blockIndex });
    } else {
      dropdown.classList.add('open');
      trackEvent('allow_dropdown_open', { toolIndex, blockIndex });
    }
  });

  // Option selection — executes immediately
  dropdownOptions.forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = opt.dataset.allowMode;
      const label = mode === 'always-allow' ? 'Always allow' : 'Allow once';

      btnText.textContent = label;
      dropdownOptions.forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');

      dropdown.classList.remove('open');

      handleAllow(blockIndex, toolIndex, mode, block);
    });
  });

  // --- Deny button ---
  const denyBtn = block.querySelector(`[data-action="deny"]`);
  if (denyBtn) {
    denyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDeny(blockIndex, toolIndex, block);
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
}

function handleAllow(blockIndex, toolIndex, mode, block) {
  const bs = STATE.blockStates[blockIndex];
  const previousAction = bs.action;
  bs.action = mode;
  bs.allowed = true;

  // Update block appearance
  block.classList.add('allowed');
  block.classList.remove('denied');

  // Hide button row
  const actionsRow = block.querySelector(`#toolActions${toolIndex}`);
  if (actionsRow) {
    actionsRow.style.display = 'none';
  }

  // If Always allow — enable auto-approve
  if (mode === 'always-allow') {
    STATE.alwaysAllowActive = true;
  }

  // Show request immediately
  const requestSection = block.querySelector(`#toolRequest${toolIndex}`);
  if (requestSection) {
    requestSection.classList.add('request-revealed');
  }

  // After 1s delay, show response, then reveal next block
  const responseSection = block.querySelector(`#toolResponse${toolIndex}`);
  setTimeout(() => {
    if (responseSection) {
      responseSection.classList.add('response-revealed');
    }
    trackEvent('tool_response_revealed', { blockIndex, toolIndex, mode });

    // Reveal next block after response appears
    setTimeout(() => {
      revealNextBlock(blockIndex, toolIndex);
    }, 300);
  }, 1000);

  trackEvent('tool_action_click', {
    blockIndex,
    toolIndex,
    toolName: getBlockToolName(blockIndex),
    action: mode,
    previousAction,
  });
}

function revealNextBlock(fromBlockIndex, fromToolIndex) {
  const nextBlockIndex = fromBlockIndex + 1;
  if (nextBlockIndex >= STATE.blocks.length) {
    revealPostToolContent();
    return;
  }

  const nextBlock = STATE.blocks[nextBlockIndex];
  STATE.blockStates[nextBlockIndex].revealed = true;

  const nextEl = getBlockDomElement(nextBlockIndex);
  if (nextEl) {
    nextEl.style.display = '';
    nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    trackEvent('next_block_revealed', { fromBlockIndex, toBlockIndex: nextBlockIndex, type: nextBlock.type });

    // If text block, auto-chain to reveal the next block after a short delay
    if (nextBlock.type === 'text') {
      setTimeout(() => {
        revealNextBlock(nextBlockIndex, fromToolIndex);
      }, 400);
      return;
    }

    // If tool block and always-allow is active, auto-approve
    if (STATE.alwaysAllowActive && nextBlock.type === 'tool') {
      setTimeout(() => {
        autoApproveBlock(nextBlockIndex, fromToolIndex + 1);
      }, 600);
    }
  }
}

function autoApproveBlock(blockIndex, toolIndex) {
  const bs = STATE.blockStates[blockIndex];
  if (!bs || bs.allowed || bs.denied) return;
  if (blockIndex >= STATE.blocks.length) { revealPostToolContent(); return; }

  const el = getBlockDomElement(blockIndex);
  if (!el) { revealPostToolContent(); return; }

  bs.action = 'always-allow';
  bs.allowed = true;
  el.classList.add('allowed');

  const actionsRow = el.querySelector(`#toolActions${toolIndex}`);
  if (actionsRow) actionsRow.style.display = 'none';

  trackEvent('tool_action_click', { blockIndex, toolIndex, action: 'always-allow', autoApproved: true });

  // Show request immediately
  const reqSection = el.querySelector(`#toolRequest${toolIndex}`);
  if (reqSection) reqSection.classList.add('request-revealed');

  // Show response after 1s
  const responseSection = el.querySelector(`#toolResponse${toolIndex}`);
  setTimeout(() => {
    if (responseSection) responseSection.classList.add('response-revealed');
    setTimeout(() => { revealNextBlock(blockIndex, toolIndex); }, 300);
  }, 1000);
}

function getBlockDomElement(blockIndex) {
  const block = STATE.blocks[blockIndex];
  if (!block) return null;
  if (block.type === 'text') return document.getElementById(`textBlock${blockIndex}`);
  let toolCount = 0;
  for (let i = 0; i <= blockIndex; i++) {
    if (STATE.blocks[i].type === 'tool') toolCount++;
  }
  return document.getElementById(`toolBlock${toolCount - 1}`);
}

function getBlockToolName(blockIndex) {
  const block = STATE.blocks[blockIndex];
  if (block && block.type === 'tool' && block.name) return block.name;
  return `block_${blockIndex}`;
}

function handleDeny(blockIndex, toolIndex, block) {
  const bs = STATE.blockStates[blockIndex];
  bs.action = 'deny';
  bs.denied = true;

  STATE.alwaysAllowActive = false;
  block.classList.add('denied');

  const actionsRow = block.querySelector(`#toolActions${toolIndex}`);
  if (actionsRow) actionsRow.style.display = 'none';

  // Hide all subsequent blocks
  for (let i = blockIndex + 1; i < STATE.blocks.length; i++) {
    const el = getBlockDomElement(i);
    if (el) el.style.display = 'none';
  }

  hidePostToolContent();

  trackEvent('tool_action_click', {
    blockIndex,
    toolIndex,
    toolName: getBlockToolName(blockIndex),
    action: 'deny',
  });
}

function revealPostToolContent() {
  const postTool = document.getElementById('postToolContent');
  const deniedMsg = document.getElementById('deniedMessage');
  if (postTool) postTool.classList.add('visible');
  if (deniedMsg) deniedMsg.classList.remove('visible');
  showSurveyNav();
  trackEvent('post_tool_content_revealed', {});
}

function hidePostToolContent() {
  const postTool = document.getElementById('postToolContent');
  const deniedMsg = document.getElementById('deniedMessage');
  if (postTool) postTool.classList.remove('visible');
  if (deniedMsg) deniedMsg.classList.add('visible');
  showSurveyNav();
  trackEvent('tool_denied_flow_ended', {});
}

function showSurveyNav() {
  const area = document.getElementById('surveyNavArea');
  const btn = document.getElementById('surveyNavBtn');
  if (area) area.style.display = '';
  if (btn) btn.href = 'mini-survey.html?prompt=' + STATE.prompt + '&mcp=' + STATE.mcp;
}

// ── Thinking Toggle ─────────────────────────────────
function setupThinkingToggle() {
  DOM.thinkingHeader.addEventListener('click', () => {
    const wasExpanded = STATE.thinkingExpanded;

    if (wasExpanded) {
      DOM.thinkingSection.classList.add('collapsed');
      STATE.thinkingExpanded = false;
      const duration = STATE.thinkingExpandTime ? Date.now() - STATE.thinkingExpandTime : 0;
      trackEvent('thinking_collapse', {
        durationExpandedMs: duration,
        thinkingLength: DOM.thinkingText.textContent.length,
      });
    } else {
      DOM.thinkingSection.classList.remove('collapsed');
      STATE.thinkingExpanded = true;
      STATE.thinkingExpandTime = Date.now();
      trackEvent('thinking_expand', {});
    }
  });
}

// ── Tool Block Hover Tracking ───────────────────────
function setupToolHoverTracking() {
  const container = DOM.blocksContainer;

  container.addEventListener('mouseenter', (e) => {
    const block = e.target.closest('.tool-call-block');
    if (block) {
      block._hoverStart = Date.now();
    }
  }, true);

  container.addEventListener('mouseleave', (e) => {
    const block = e.target.closest('.tool-call-block');
    if (block && block._hoverStart) {
      const duration = Date.now() - block._hoverStart;
      const index = parseInt(block.dataset.blockIndex);
      if (duration > 200) {
        trackEvent('tool_block_hover', {
          blockIndex: index,
          durationMs: duration,
        });
      }
      block._hoverStart = null;
    }
  }, true);
}

// ── Response Actions ────────────────────────────────
function setupResponseActions() {
  // Copy
  DOM.copyResponseBtn.addEventListener('click', () => {
    const text = DOM.finalResponseText.textContent;
    navigator.clipboard.writeText(text).then(() => {
      trackEvent('copy_response', { characters: text.length });
      showToast('Copied to clipboard');
    }).catch(() => {
      trackEvent('copy_response_failed', {});
    });
  });

  // Retry
  DOM.retryBtn.addEventListener('click', () => {
    trackEvent('retry_click', {
      scenarioKey: STATE.scenarioKey,
      blockStates: Object.entries(STATE.blockStates).map(([idx, bs]) => ({
        blockIndex: parseInt(idx),
        type: STATE.blocks[idx]?.type,
        action: bs.action,
        allowed: bs.allowed,
        denied: bs.denied,
      })),
    });
    // Reload the same response
    window.location.reload();
  });

  // Thumbs up
  DOM.thumbsUpBtn.addEventListener('click', () => {
    const isActive = DOM.thumbsUpBtn.classList.contains('active-thumbs-up');
    if (isActive) {
      DOM.thumbsUpBtn.classList.remove('active-thumbs-up');
      trackEvent('thumbs_up_remove', {});
    } else {
      DOM.thumbsUpBtn.classList.add('active-thumbs-up');
      DOM.thumbsDownBtn.classList.remove('active-thumbs-down');
      trackEvent('thumbs_up', {});
    }
  });

  // Thumbs down
  DOM.thumbsDownBtn.addEventListener('click', () => {
    const isActive = DOM.thumbsDownBtn.classList.contains('active-thumbs-down');
    if (isActive) {
      DOM.thumbsDownBtn.classList.remove('active-thumbs-down');
      trackEvent('thumbs_down_remove', {});
    } else {
      DOM.thumbsDownBtn.classList.add('active-thumbs-down');
      DOM.thumbsUpBtn.classList.remove('active-thumbs-up');
      trackEvent('thumbs_down', {});
    }
  });
}

// ── Scroll Tracking ─────────────────────────────────
function setupScrollTracking() {
  let maxScrollDepth = 0;
  let scrollTimer = null;

  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;

  chatMessages.addEventListener('scroll', () => {
    if (scrollTimer) clearTimeout(scrollTimer);

    scrollTimer = setTimeout(() => {
      const scrollTop = chatMessages.scrollTop;
      const scrollHeight = chatMessages.scrollHeight;
      const clientHeight = chatMessages.clientHeight;
      const scrollPercent = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);

      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        if (maxScrollDepth >= 25 || maxScrollDepth >= 50 || maxScrollDepth >= 75 || maxScrollDepth >= 100) {
          trackEvent('scroll_depth', {
            depthPercent: maxScrollDepth,
            scrollPx: scrollTop,
          });
        }
      }
    }, 300);
  });

  // Track final scroll depth on leave
  window.addEventListener('beforeunload', () => {
    if (maxScrollDepth > 0) {
      trackEvent('scroll_depth_final', {
        maxDepthPercent: maxScrollDepth,
      });
    }
  });
}

// ── Completion Display ──────────────────────────────
function updateCompletionDisplay() {
  const data = getTrackingData();
  let completed = Array.isArray(data?.completedScenarios) ? data.completedScenarios : [];
  // Dedup by prompt+mcp key
  const seen = new Set();
  completed = completed.filter(s => {
    if (!s || !s.prompt || !s.mcp) return false;
    // Normalize mcp values
    if (s.mcp === 'third') s.mcp = 'third-party';
    const key = `${s.prompt}-${s.mcp}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  // Save deduped data
  if (data && completed.length !== data.completedScenarios.length) {
    data.completedScenarios = completed;
    saveTrackingData(data);
  }
  console.log('📋 Response completion display:', completed.length, '/ 6', completed.map(s => `${s.prompt}-${s.mcp}`));
  const total = 6;

  DOM.scenarioStatus.textContent = `${completed.length}/${total} completed`;

  if (DOM.completionHint) {
    if (completed.length === total) {
      DOM.completionHint.textContent = '🎉 All 6 scenarios completed!';
    } else {
      DOM.completionHint.textContent = `${completed.length}/${total} scenarios completed — ${total - completed.length} remaining`;
    }
  }
}

// ── Today's History ─────────────────────────────────
const PROMPTS_HISTORY = {
  A: 'This is an email from my manager. Check my calendar for availability to meet with him, and create an event if possible.',
  B: 'Search for files related to yesterday\'s medical records in my medical folder, then read them and tell me about my condition and how to take the medication.',
  C: 'Last week I had a health checkup. Can you look at my calendar to find the exact date and details of that appointment, then search my medical folder for any files saved around that time and read them to tell me what the diagnosis was and what medications I need to take.',
};

function getCompletedScenarios() {
  const data = getTrackingData();
  return Array.isArray(data?.completedScenarios) ? data.completedScenarios : [];
}

function populateTodayHistory() {
  const container = document.getElementById('todayHistoryItems');
  if (!container) return;

  const completed = getCompletedScenarios();
  const today = new Date().toISOString().slice(0, 10);

  const items = ['A', 'B', 'C'].map(prompt => {
    const truncated = PROMPTS_HISTORY[prompt]
      ? PROMPTS_HISTORY[prompt].slice(0, 40) + '...'
      : `Scenario ${prompt}`;
    const todayCompleted = completed.filter(s => s.prompt === prompt && s.completedAt && s.completedAt.startsWith(today));
    const mcpDone = todayCompleted.map(s => s.mcp === 'anthropic' ? 'A' : 'T');
    const doneLabel = mcpDone.length > 0 ? ` (${mcpDone.join(',')} done)` : '';
    return `<div class="history-item">
      <span class="history-title">${truncated}${doneLabel}</span>
    </div>`;
  });

  container.innerHTML = items.join('');
}

// ── Sidebar ─────────────────────────────────────────
function setupSidebar() {
  STATE.isMobile = window.innerWidth <= 768;

  // Toggle
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

  DOM.sidebarToggle.addEventListener('click', () => {
    if (STATE.isMobile) {
      toggleMobileSidebar();
    } else {
      toggleSidebar();
    }
  });

  // Mobile toggle
  DOM.mobileSidebarToggle.addEventListener('click', () => {
    if (STATE.isMobile) {
      toggleMobileSidebar();
    } else {
      toggleSidebar();
    }
  });

  // New chat — go back to input
  DOM.newChatBtn.addEventListener('click', () => {
    trackEvent('new_chat_from_response', { scenarioKey: STATE.scenarioKey });
    window.location.href = 'mini-survey.html?prompt=' + STATE.prompt + '&mcp=' + STATE.mcp;
  });

  // Search click
  DOM.sidebarSearch.addEventListener('click', () => {
    trackEvent('search_click_response', {});
  });

  // User profile
  DOM.userProfile.addEventListener('click', () => {
    trackEvent('user_profile_click_response', {});
  });

  // Share
  DOM.shareBtn.addEventListener('click', () => {
    trackEvent('share_click_response', {});
  });

  // History items
  DOM.historyItems.forEach((item) => {
    item.addEventListener('click', () => {
      const title = item.querySelector('.history-title')?.textContent || '';
      trackEvent('history_item_click_response', { title });
      DOM.historyItems.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Back button
  DOM.backToInputBtn.addEventListener('click', () => {
    trackEvent('back_to_input', {
      scenarioKey: STATE.scenarioKey,
      timeOnPageMs: Date.now() - STATE.pageEnterTime,
      thinkingExpanded: STATE.thinkingExpanded,
      blockStates: Object.entries(STATE.blockStates).map(([idx, bs]) => ({
        blockIndex: parseInt(idx),
        type: STATE.blocks[idx]?.type,
        action: bs.action,
        allowed: bs.allowed,
        denied: bs.denied,
      })),
    });
    window.location.href = 'mini-survey.html?prompt=' + STATE.prompt + '&mcp=' + STATE.mcp;
  });

  // Return link
  if (DOM.returnBtn) DOM.returnBtn.addEventListener('click', (e) => {
    e.preventDefault();
    trackEvent('return_link_click', {
      scenarioKey: STATE.scenarioKey,
      timeOnPageMs: Date.now() - STATE.pageEnterTime,
    });
    window.location.href = 'mini-survey.html?prompt=' + STATE.prompt + '&mcp=' + STATE.mcp;
  });

  // Overlay
  if (DOM.overlay) {
    DOM.overlay.addEventListener('click', () => {
      if (STATE.mobileSidebarOpen) {
        toggleMobileSidebar();
      }
    });
  }

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && STATE.mobileSidebarOpen) {
      toggleMobileSidebar();
    }
  });

  // Window resize
  window.addEventListener('resize', () => {
    const wasMobile = STATE.isMobile;
    STATE.isMobile = window.innerWidth <= 768;
    if (!STATE.isMobile && STATE.mobileSidebarOpen) {
      STATE.mobileSidebarOpen = false;
      DOM.sidebar.classList.remove('mobile-open');
    }
  });

  // Mobile init
  if (STATE.isMobile) {
    DOM.sidebar.classList.add('collapsed');
    STATE.sidebarOpen = false;
  }
}

function toggleMobileSidebar() {
  STATE.mobileSidebarOpen = !STATE.mobileSidebarOpen;
  if (STATE.mobileSidebarOpen) {
    DOM.sidebar.classList.add('mobile-open');
    if (DOM.overlay) DOM.overlay.classList.add('visible');
  } else {
    DOM.sidebar.classList.remove('mobile-open');
    if (DOM.overlay) DOM.overlay.classList.remove('visible');
  }
  trackEvent('mobile_sidebar_toggle_response', { open: STATE.mobileSidebarOpen });
}

// ── Time-on-page tracking ───────────────────────────
function setupTimeOnPageTracking() {
  // Track when user leaves
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Date.now() - STATE.pageEnterTime;
    trackEvent('response_page_leave', {
      scenarioKey: STATE.scenarioKey,
      timeOnPageMs: timeOnPage,
      thinkingExpanded: STATE.thinkingExpanded,
      thinkingExpandDuration: STATE.thinkingExpanded && STATE.thinkingExpandTime
        ? Date.now() - STATE.thinkingExpandTime : 0,
      blockStates: Object.entries(STATE.blockStates).map(([idx, bs]) => ({
        blockIndex: parseInt(idx),
        type: STATE.blocks[idx]?.type,
        action: bs.action,
        allowed: bs.allowed,
        denied: bs.denied,
      })),
    });
  });

  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      trackEvent('response_page_hidden', {
        timeOnPageMs: Date.now() - STATE.pageEnterTime,
      });
    } else {
      trackEvent('response_page_visible', {
        timeOnPageMs: Date.now() - STATE.pageEnterTime,
      });
    }
  });
}

// ── Toast ───────────────────────────────────────────
function renderContentBlocks(c){if(c.blocks){renderBlocks(c.blocks)}else if(c.tools){const b=c.tools.map(t=>({type:"tool",...t}));if(c.finalResponse)b.push({type:"text",html:c.finalResponse});renderBlocks(b)}}
function sdM(p){const o=document.getElementById(p+"Overlay"),m=document.getElementById(p);if(!o||!m)return;o.classList.add("visible");m.classList.add("visible")}
function hdM(p){const o=document.getElementById(p+"Overlay"),m=document.getElementById(p);if(!o||!m)return;o.classList.remove("visible");m.classList.remove("visible")}
function showDetailModal(p){sdM(p)}function hideDetailModal(p){hdM(p)}
window.showDetailModal=showDetailModal;window.hideDetailModal=hideDetailModal;
function showEmailDetailModal(){showDetailModal("emailDetailModal")}function hideEmailDetailModal(){hideDetailModal("emailDetailModal")}window.showEmailDetailModal=showEmailDetailModal;window.hideEmailDetailModal=hideEmailDetailModal;function showTimeSlotsModal(){showDetailModal("timeSlotsModal")}function hideTimeSlotsModal(){hideDetailModal("timeSlotsModal")}window.showTimeSlotsModal=showTimeSlotsModal;window.hideTimeSlotsModal=hideTimeSlotsModal;function showEventTitleModal(){showDetailModal("eventTitleModal")}function hideEventTitleModal(){hideDetailModal("eventTitleModal")}window.showEventTitleModal=showEventTitleModal;window.hideEventTitleModal=hideEventTitleModal;function showEventCreationModal(){showDetailModal("eventCreationModal")}function hideEventCreationModal(){hideDetailModal("eventCreationModal")}window.showEventCreationModal=showEventCreationModal;window.hideEventCreationModal=hideEventCreationModal;function showSuccessNotifModal(){showDetailModal("successNotifModal")}function hideSuccessNotifModal(){hideDetailModal("successNotifModal")}window.showSuccessNotifModal=showSuccessNotifModal;window.hideSuccessNotifModal=hideSuccessNotifModal;function showEmailDetailModal3(){showDetailModal("emailDetailModal3")}function hideEmailDetailModal3(){hideDetailModal("emailDetailModal3")}window.showEmailDetailModal3=showEmailDetailModal3;window.hideEmailDetailModal3=hideEmailDetailModal3;function showCalendarListModal(){showDetailModal("calendarListModal")}function hideCalendarListModal(){hideDetailModal("calendarListModal")}window.showCalendarListModal=showCalendarListModal;window.hideCalendarListModal=hideCalendarListModal;function showEventCreatorModal(){showDetailModal("eventCreatorModal")}function hideEventCreatorModal(){hideDetailModal("eventCreatorModal")}window.showEventCreatorModal=showEventCreatorModal;window.hideEventCreatorModal=hideEventCreatorModal;function showEventCreationModal3(){showDetailModal("eventCreationModal3")}function hideEventCreationModal3(){hideDetailModal("eventCreationModal3")}window.showEventCreationModal3=showEventCreationModal3;window.hideEventCreationModal3=hideEventCreationModal3;function showSuccessNotifModal3(){showDetailModal("successNotifModal3")}function hideSuccessNotifModal3(){hideDetailModal("successNotifModal3")}window.showSuccessNotifModal3=showSuccessNotifModal3;window.hideSuccessNotifModal3=hideSuccessNotifModal3;function showFilesystemDirPathModal(){showDetailModal("filesystemDirPathModal")}function hideFilesystemDirPathModal(){hideDetailModal("filesystemDirPathModal")}window.showFilesystemDirPathModal=showFilesystemDirPathModal;window.hideFilesystemDirPathModal=hideFilesystemDirPathModal;function showFilesystemDirSearchModal(){showDetailModal("filesystemDirSearchModal")}function hideFilesystemDirSearchModal(){hideDetailModal("filesystemDirSearchModal")}window.showFilesystemDirSearchModal=showFilesystemDirSearchModal;window.hideFilesystemDirSearchModal=hideFilesystemDirSearchModal;function showFilesystemSearchResultModal(){showDetailModal("filesystemSearchResultModal")}function hideFilesystemSearchResultModal(){hideDetailModal("filesystemSearchResultModal")}window.showFilesystemSearchResultModal=showFilesystemSearchResultModal;window.hideFilesystemSearchResultModal=hideFilesystemSearchResultModal;function showFilesystemFilePathModal(){showDetailModal("filesystemFilePathModal")}function hideFilesystemFilePathModal(){hideDetailModal("filesystemFilePathModal")}window.showFilesystemFilePathModal=showFilesystemFilePathModal;window.hideFilesystemFilePathModal=hideFilesystemFilePathModal;function showFilesystemFileMetadataModal(){showDetailModal("filesystemFileMetadataModal")}function hideFilesystemFileMetadataModal(){hideDetailModal("filesystemFileMetadataModal")}window.showFilesystemFileMetadataModal=showFilesystemFileMetadataModal;window.hideFilesystemFileMetadataModal=hideFilesystemFileMetadataModal;function showFilesystemFileContentModal(){showDetailModal("filesystemFileContentModal")}function hideFilesystemFileContentModal(){hideDetailModal("filesystemFileContentModal")}window.showFilesystemFileContentModal=showFilesystemFileContentModal;window.hideFilesystemFileContentModal=hideFilesystemFileContentModal;function showFilesystemFileSummaryModal(){showDetailModal("filesystemFileSummaryModal")}function hideFilesystemFileSummaryModal(){hideDetailModal("filesystemFileSummaryModal")}window.showFilesystemFileSummaryModal=showFilesystemFileSummaryModal;window.hideFilesystemFileSummaryModal=hideFilesystemFileSummaryModal;function showFilesystemThirdDirPathModal(){showDetailModal("filesystemThirdDirPathModal")}function hideFilesystemThirdDirPathModal(){hideDetailModal("filesystemThirdDirPathModal")}window.showFilesystemThirdDirPathModal=showFilesystemThirdDirPathModal;window.hideFilesystemThirdDirPathModal=hideFilesystemThirdDirPathModal;function showFilesystemThirdDirTreeModal(){showDetailModal("filesystemThirdDirTreeModal")}function hideFilesystemThirdDirTreeModal(){hideDetailModal("filesystemThirdDirTreeModal")}window.showFilesystemThirdDirTreeModal=showFilesystemThirdDirTreeModal;window.hideFilesystemThirdDirTreeModal=hideFilesystemThirdDirTreeModal;function showFilesystemThirdFilePathModal(){showDetailModal("filesystemThirdFilePathModal")}function hideFilesystemThirdFilePathModal(){hideDetailModal("filesystemThirdFilePathModal")}window.showFilesystemThirdFilePathModal=showFilesystemThirdFilePathModal;window.hideFilesystemThirdFilePathModal=hideFilesystemThirdFilePathModal;function showFilesystemThirdFileContentModal(){showDetailModal("filesystemThirdFileContentModal")}function hideFilesystemThirdFileContentModal(){hideDetailModal("filesystemThirdFileContentModal")}window.showFilesystemThirdFileContentModal=showFilesystemThirdFileContentModal;window.hideFilesystemThirdFileContentModal=hideFilesystemThirdFileContentModal;function showFilesystemThirdFileSummaryModal(){showDetailModal("filesystemThirdFileSummaryModal")}function hideFilesystemThirdFileSummaryModal(){hideDetailModal("filesystemThirdFileSummaryModal")}window.showFilesystemThirdFileSummaryModal=showFilesystemThirdFileSummaryModal;window.hideFilesystemThirdFileSummaryModal=hideFilesystemThirdFileSummaryModal;function showMCPThirdEmailModal(){showDetailModal("mCPThirdEmailModal")}function hideMCPThirdEmailModal(){hideDetailModal("mCPThirdEmailModal")}window.showMCPThirdEmailModal=showMCPThirdEmailModal;window.hideMCPThirdEmailModal=hideMCPThirdEmailModal;function showMCPThirdCalendarListModal(){showDetailModal("mCPThirdCalendarListModal")}function hideMCPThirdCalendarListModal(){hideDetailModal("mCPThirdCalendarListModal")}window.showMCPThirdCalendarListModal=showMCPThirdCalendarListModal;window.hideMCPThirdCalendarListModal=hideMCPThirdCalendarListModal;function showMCPThirdDirPathModal(){showDetailModal("mCPThirdDirPathModal")}function hideMCPThirdDirPathModal(){hideDetailModal("mCPThirdDirPathModal")}window.showMCPThirdDirPathModal=showMCPThirdDirPathModal;window.hideMCPThirdDirPathModal=hideMCPThirdDirPathModal;function showMCPThirdDirTreeModal(){showDetailModal("mCPThirdDirTreeModal")}function hideMCPThirdDirTreeModal(){hideDetailModal("mCPThirdDirTreeModal")}window.showMCPThirdDirTreeModal=showMCPThirdDirTreeModal;window.hideMCPThirdDirTreeModal=hideMCPThirdDirTreeModal;function showMCPThirdFilePathModal(){showDetailModal("mCPThirdFilePathModal")}function hideMCPThirdFilePathModal(){hideDetailModal("mCPThirdFilePathModal")}window.showMCPThirdFilePathModal=showMCPThirdFilePathModal;window.hideMCPThirdFilePathModal=hideMCPThirdFilePathModal;function showMCPThirdFileContentModal(){showDetailModal("mCPThirdFileContentModal")}function hideMCPThirdFileContentModal(){hideDetailModal("mCPThirdFileContentModal")}window.showMCPThirdFileContentModal=showMCPThirdFileContentModal;window.hideMCPThirdFileContentModal=hideMCPThirdFileContentModal;function showMCPThirdFileSummaryModal(){showDetailModal("mCPThirdFileSummaryModal")}function hideMCPThirdFileSummaryModal(){hideDetailModal("mCPThirdFileSummaryModal")}window.showMCPThirdFileSummaryModal=showMCPThirdFileSummaryModal;window.hideMCPThirdFileSummaryModal=hideMCPThirdFileSummaryModal;
function showToast(message) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'notification';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2000);
}

// ── Utility ─────────────────────────────────────────
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Init ─────────────────────────────────────────────
function init() {
  console.log('📄 Claude Response Page');
  console.log('📊 Tracking key:', TRACKING_KEY);

  if (!parseParams()) return;

  renderPage();
  setupThinkingToggle();
  setupToolHoverTracking();
  setupResponseActions();
  setupScrollTracking();
  populateTodayHistory();
  setupSidebar();
  setupTimeOnPageTracking();

  console.log(`✅ Response page ready — Scenario: ${STATE.scenarioKey}`);
}

document.addEventListener('DOMContentLoaded', init);
