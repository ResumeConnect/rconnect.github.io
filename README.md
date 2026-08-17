# ResumeConnect — Mobile Resume + WhatsApp Job Intake

A mobile-first static web app inspired by the supplied ResumeConnect visual reference.

## Files

- `index.html` — mobile UI and form
- `styles.css` — responsive design
- `app.js` — validation, file upload and Apps Script API call
- `Code.gs` — Google Apps Script backend
- `README.md` — setup instructions

## What the user submits

1. WhatsApp number
2. Target job role
3. Preferred location (optional)
4. Resume: PDF/DOC/DOCX, max 10 MB
5. Consent

## Google Apps Script setup

1. Create a Google Sheet.
2. Create a Google Drive folder where uploaded resumes should be stored.
3. Open Google Apps Script and paste `Code.gs`.
4. Either:
   - put the Sheet ID and Drive Folder ID into `CONFIG`, or
   - add Script Properties named `SHEET_ID` and `DRIVE_FOLDER_ID`.
5. Deploy as **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the deployed `/exec` URL.
7. In `app.js`, replace:

`PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE`

with your `/exec` URL.
8. Deploy the frontend to GitHub Pages or any static hosting.

## Data model

The backend creates a `Submissions` sheet with:

`Timestamp | WhatsApp | Role | Location | Resume Name | Drive File ID | Resume URL | Source | Status`

Uploaded resumes remain private in your Google Drive. Do not make the Drive folder public if resumes contain personal information.

## Important production hardening

For a public launch, add:
- spam/rate limiting
- CAPTCHA or Turnstile
- server-side file type validation
- stricter MIME/signature checks
- retention/deletion policy
- consent/privacy notice appropriate for your jurisdiction
- admin access controls
- WhatsApp Business/API integration for actual outbound notifications

The current frontend does not claim that WhatsApp messages are automatically sent. It stores the submitted WhatsApp number so a later matching/notification system can use it.
