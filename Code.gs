/**
 * ResumeConnect Google Apps Script backend
 *
 * SETUP:
 * 1) Create a Google Sheet for submissions.
 * 2) Create a Google Drive folder for resumes.
 * 3) Put their IDs below OR use Script Properties:
 *    SHEET_ID and DRIVE_FOLDER_ID
 * 4) Deploy > New deployment > Web app
 *    Execute as: Me
 *    Who has access: Anyone
 * 5) Copy the /exec URL into app.js.
 *
 * Sheet columns:
 * Timestamp | WhatsApp | Role | Location | Resume Name | Drive File ID |
 * Resume URL | Source | Status
 */

const CONFIG = {
  SHEET_ID: "10K6rjNpvPKgkhFic3t0379OQkBoY57EQPOH1TS3NRPk",        // Example: 1AbCdEf...
  DRIVE_FOLDER_ID: "1tiMCtRf2yyWQbKtkWVlm38dWwy-oa7-4", // Example: 1AbCdEf...
  SHEET_NAME: "Submissions",
  MAX_FILE_BYTES: 10 * 1024 * 1024
};

function doGet() {
  return json_({ok: true, service: "ResumeConnect", message: "ResumeConnect backend is running."});
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");

    if (data.action !== "submitResume") {
      return json_({ok: false, message: "Invalid action."});
    }

    const whatsapp = String(data.whatsapp || "").trim();
    const role = String(data.role || "").trim();
    const location = String(data.location || "").trim();
    const fileName = String(data.fileName || "resume").trim();
    const mimeType = String(data.mimeType || "application/octet-stream").trim();
    const base64 = String(data.fileBase64 || "");
    const source = String(data.source || "").trim();

    if (!whatsapp || !/^\+?[0-9]{8,15}$/.test(whatsapp)) {
      return json_({ok: false, message: "Invalid WhatsApp number."});
    }
    if (!role || role.length > 100) {
      return json_({ok: false, message: "Please enter a valid target role."});
    }
    if (!base64) {
      return json_({ok: false, message: "Resume file is required."});
    }

    const bytes = Utilities.base64Decode(base64);
    if (bytes.length > CONFIG.MAX_FILE_BYTES) {
      return json_({ok: false, message: "Resume exceeds the 10 MB limit."});
    }

    const folder = getDriveFolder_();
    const safeName = sanitizeFileName_(fileName);
    const blob = Utilities.newBlob(bytes, mimeType, safeName);
    const file = folder.createFile(blob);

    // Optional: keep Drive access private. Do not use "anyone with link" for resumes.
    const fileId = file.getId();
    const fileUrl = file.getUrl();

    const sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      whatsapp,
      role,
      location,
      safeName,
      fileId,
      fileUrl,
      source,
      "New"
    ]);

    return json_({
      ok: true,
      message: "Your resume is now in the matching queue."
    });

  } catch (err) {
    console.error(err);
    return json_({ok: false, message: "Server error. Please try again later."});
  }
}

function getSheet_() {
  const props = PropertiesService.getScriptProperties();
  const id = CONFIG.SHEET_ID || props.getProperty("SHEET_ID");
  if (!id) throw new Error("Missing SHEET_ID.");
  const ss = SpreadsheetApp.openById(id);
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow([
      "Timestamp","WhatsApp","Role","Location","Resume Name",
      "Drive File ID","Resume URL","Source","Status"
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getDriveFolder_() {
  const props = PropertiesService.getScriptProperties();
  const id = CONFIG.DRIVE_FOLDER_ID || props.getProperty("DRIVE_FOLDER_ID");
  if (!id) throw new Error("Missing DRIVE_FOLDER_ID.");
  return DriveApp.getFolderById(id);
}

function sanitizeFileName_(name) {
  let clean = name.replace(/[\\/:*?"<>|#%{}]/g, "_").trim();
  if (!clean) clean = "resume";
  if (clean.length > 120) clean = clean.slice(0, 120);
  return clean;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
