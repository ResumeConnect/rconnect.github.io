// ResumeConnect frontend
// 1. Deploy Code.gs as a Google Apps Script Web App.
// 2. Paste the /exec URL into GAS_WEB_APP_URL below.
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwSz0vY9yjLZVHkJ5hgEU2NKKQEjDkaW7vEmm37frA-ynuPWhpVEltEfkIl2dCUMLSLEA/exec";
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const $ = (id) => document.getElementById(id);
const form = $("resumeForm");
const fileInput = $("resumeFile");
const dropzone = $("dropzone");
const browseBtn = $("browseBtn");
const fileTitle = $("fileTitle");
const statusBox = $("status");
const submitBtn = $("submitBtn");

$("year").textContent = new Date().getFullYear();

function setStatus(message, type) {
  statusBox.textContent = message;
  statusBox.className = `status show ${type}`;
}

function clearStatus() {
  statusBox.textContent = "";
  statusBox.className = "status";
}

function normalizePhone(value) {
  return value.replace(/[^\d]/g, "");
}

function validPhone(value) {
  const digits = normalizePhone(value);
  return digits.length >= 8 && digits.length <= 15;
}

function selectFile(file) {
  if (!file) return;
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  const extOk = /\.(pdf|doc|docx)$/i.test(file.name);
  if (!extOk && !allowed.includes(file.type)) {
    setStatus("Please upload a PDF, DOC or DOCX resume.", "error");
    fileInput.value = "";
    return;
  }
  if (file.size > MAX_FILE_BYTES) {
    setStatus("Your resume is larger than 10 MB. Please choose a smaller file.", "error");
    fileInput.value = "";
    return;
  }
  fileTitle.textContent = `✓ ${file.name}`;
  clearStatus();
}

browseBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  fileInput.click();
});
dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") fileInput.click();
});
fileInput.addEventListener("change", () => selectFile(fileInput.files[0]));

["dragenter", "dragover"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });
});
["dragleave", "drop"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
  });
});
dropzone.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  if (!file) return;
  try {
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
  } catch (_) {}
  selectFile(file);
});

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearStatus();

  const whatsapp = normalizePhone($("whatsapp").value);
  const countryCode = $("countryCode").value;
  const role = $("role").value.trim();
  const location = $("location").value.trim();
  const file = fileInput.files[0];

  if (!validPhone(whatsapp)) {
    setStatus("Please enter a valid WhatsApp number.", "error");
    $("whatsapp").focus();
    return;
  }
  if (!role) {
    setStatus("Please tell us the role you want to get.", "error");
    $("role").focus();
    return;
  }
  if (!file) {
    setStatus("Please select your resume.", "error");
    return;
  }
  if (!$("consent").checked) {
    setStatus("Please accept the consent checkbox before submitting.", "error");
    return;
  }
  if (GAS_WEB_APP_URL.includes("PASTE_YOUR")) {
    setStatus("Connect the Google Apps Script Web App URL in app.js before publishing.", "error");
    return;
  }

  submitBtn.disabled = true;
  $("submitText").textContent = "Uploading securely…";
  setStatus("Preparing your resume…", "info");

  try {
    const base64 = await fileToBase64(file);
    const payload = {
      action: "submitResume",
      whatsapp: `${countryCode}${whatsapp}`,
      role,
      location,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      fileBase64: base64,
      source: window.location.hostname || "website",
      userAgent: navigator.userAgent
    };

    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!result.ok) throw new Error(result.message || "Upload failed.");

    setStatus(`Success! Your resume is submitted for the “${role}” role. ${result.message || "We will contact you through WhatsApp when relevant updates are available."}`, "success");
    form.reset();
    fileTitle.textContent = "Drop your resume here";
    window.scrollTo({top: document.getElementById("submitCard").offsetTop - 15, behavior: "smooth"});
  } catch (err) {
    console.error(err);
    setStatus("We could not submit your resume. Please check the Apps Script URL/deployment and try again.", "error");
  } finally {
    submitBtn.disabled = false;
    $("submitText").textContent = "Upload Resume & Get Matched";
  }
});

// Lightweight informational modal
const modal = $("infoModal");
const modalTitle = $("modalTitle");
const modalBody = $("modalBody");
function openInfo(title, body) {
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}
$("privacyLink").addEventListener("click", (e) => {
  e.preventDefault();
  openInfo("Privacy", "ResumeConnect stores the information you submit so it can process your job preferences and provide relevant job updates. Do not upload documents containing passwords, bank details or other unnecessary sensitive information.");
});
$("termsLink").addEventListener("click", (e) => {
  e.preventDefault();
  openInfo("Terms", "By submitting a resume, you confirm that the information belongs to you or that you are authorized to submit it. Job matching does not guarantee an interview or employment.");
});
$("closeModal").addEventListener("click", () => modal.classList.remove("open"));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });
