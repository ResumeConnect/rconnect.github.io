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

// Complete country/territory calling-code list.
// Based on the current ITU National Numbering Plans list.
const COUNTRY_CODES = [{"name":"Afghanistan","iso":"AF","code":"+93"},{"name":"Albania","iso":"AL","code":"+355"},{"name":"Algeria","iso":"DZ","code":"+213"},{"name":"American Samoa","iso":"AS","code":"+1684"},{"name":"Andorra","iso":"AD","code":"+376"},{"name":"Angola","iso":"AO","code":"+244"},{"name":"Anguilla","iso":"AI","code":"+1264"},{"name":"Antigua and Barbuda","iso":"AG","code":"+1268"},{"name":"Argentina","iso":"AR","code":"+54"},{"name":"Armenia","iso":"AM","code":"+374"},{"name":"Aruba","iso":"AW","code":"+297"},{"name":"Ascension","iso":"SH","code":"+247"},{"name":"Australia","iso":"AU","code":"+61"},{"name":"Austria","iso":"AT","code":"+43"},{"name":"Azerbaijan","iso":"AZ","code":"+994"},{"name":"Bahamas","iso":"BS","code":"+1242"},{"name":"Bahrain","iso":"BH","code":"+973"},{"name":"Bangladesh","iso":"BD","code":"+880"},{"name":"Barbados","iso":"BB","code":"+1246"},{"name":"Belarus","iso":"BY","code":"+375"},{"name":"Belgium","iso":"BE","code":"+32"},{"name":"Belize","iso":"BZ","code":"+501"},{"name":"Benin","iso":"BJ","code":"+229"},{"name":"Bermuda","iso":"BM","code":"+1441"},{"name":"Bhutan","iso":"BT","code":"+975"},{"name":"Bolivia","iso":"BO","code":"+591"},{"name":"Bonaire, Sint Eustatius and Saba","iso":"BQ","code":"+599"},{"name":"Bosnia and Herzegovina","iso":"BA","code":"+387"},{"name":"Botswana","iso":"BW","code":"+267"},{"name":"Brazil","iso":"BR","code":"+55"},{"name":"British Virgin Islands","iso":"VG","code":"+1284"},{"name":"Brunei Darussalam","iso":"BN","code":"+673"},{"name":"Bulgaria","iso":"BG","code":"+359"},{"name":"Burkina Faso","iso":"BF","code":"+226"},{"name":"Burundi","iso":"BI","code":"+257"},{"name":"Cabo Verde","iso":"CV","code":"+238"},{"name":"Cambodia","iso":"KH","code":"+855"},{"name":"Cameroon","iso":"CM","code":"+237"},{"name":"Canada","iso":"CA","code":"+1"},{"name":"Cayman Islands","iso":"KY","code":"+1345"},{"name":"Central African Republic","iso":"CF","code":"+236"},{"name":"Chad","iso":"TD","code":"+235"},{"name":"Chile","iso":"CL","code":"+56"},{"name":"China","iso":"CN","code":"+86"},{"name":"Colombia","iso":"CO","code":"+57"},{"name":"Comoros","iso":"KM","code":"+269"},{"name":"Congo (Republic)","iso":"CG","code":"+242"},{"name":"Cook Islands","iso":"CK","code":"+682"},{"name":"Costa Rica","iso":"CR","code":"+506"},{"name":"Côte d'Ivoire","iso":"CI","code":"+225"},{"name":"Croatia","iso":"HR","code":"+385"},{"name":"Cuba","iso":"CU","code":"+53"},{"name":"Curaçao","iso":"CW","code":"+599"},{"name":"Cyprus","iso":"CY","code":"+357"},{"name":"Czech Republic","iso":"CZ","code":"+420"},{"name":"North Korea","iso":"KP","code":"+850"},{"name":"Democratic Republic of the Congo","iso":"CD","code":"+243"},{"name":"Denmark","iso":"DK","code":"+45"},{"name":"Diego Garcia","iso":"IO","code":"+246"},{"name":"Djibouti","iso":"DJ","code":"+253"},{"name":"Dominica","iso":"DM","code":"+1767"},{"name":"Dominican Republic","iso":"DO","code":"+1809"},{"name":"Ecuador","iso":"EC","code":"+593"},{"name":"Egypt","iso":"EG","code":"+20"},{"name":"El Salvador","iso":"SV","code":"+503"},{"name":"Equatorial Guinea","iso":"GQ","code":"+240"},{"name":"Eritrea","iso":"ER","code":"+291"},{"name":"Estonia","iso":"EE","code":"+372"},{"name":"Eswatini","iso":"SZ","code":"+268"},{"name":"Ethiopia","iso":"ET","code":"+251"},{"name":"Falkland Islands","iso":"FK","code":"+500"},{"name":"Faroe Islands","iso":"FO","code":"+298"},{"name":"Fiji","iso":"FJ","code":"+679"},{"name":"Finland","iso":"FI","code":"+358"},{"name":"France","iso":"FR","code":"+33"},{"name":"French Departments and Territories in the Indian Ocean","iso":"RE","code":"+262"},{"name":"French Guiana","iso":"GF","code":"+594"},{"name":"French Polynesia","iso":"PF","code":"+689"},{"name":"Gabon","iso":"GA","code":"+241"},{"name":"Gambia","iso":"GM","code":"+220"},{"name":"Georgia","iso":"GE","code":"+995"},{"name":"Germany","iso":"DE","code":"+49"},{"name":"Ghana","iso":"GH","code":"+233"},{"name":"Gibraltar","iso":"GI","code":"+350"},{"name":"Greece","iso":"GR","code":"+30"},{"name":"Greenland","iso":"GL","code":"+299"},{"name":"Grenada","iso":"GD","code":"+1473"},{"name":"Guadeloupe","iso":"GP","code":"+590"},{"name":"Guam","iso":"GU","code":"+1671"},{"name":"Guatemala","iso":"GT","code":"+502"},{"name":"Guinea","iso":"GN","code":"+224"},{"name":"Guinea-Bissau","iso":"GW","code":"+245"},{"name":"Guyana","iso":"GY","code":"+592"},{"name":"Haiti","iso":"HT","code":"+509"},{"name":"Honduras","iso":"HN","code":"+504"},{"name":"Hong Kong","iso":"HK","code":"+852"},{"name":"Hungary","iso":"HU","code":"+36"},{"name":"Iceland","iso":"IS","code":"+354"},{"name":"India","iso":"IN","code":"+91"},{"name":"Indonesia","iso":"ID","code":"+62"},{"name":"Iran","iso":"IR","code":"+98"},{"name":"Iraq","iso":"IQ","code":"+964"},{"name":"Ireland","iso":"IE","code":"+353"},{"name":"Israel","iso":"IL","code":"+972"},{"name":"Italy","iso":"IT","code":"+39"},{"name":"Jamaica","iso":"JM","code":"+1876"},{"name":"Japan","iso":"JP","code":"+81"},{"name":"Jordan","iso":"JO","code":"+962"},{"name":"Kazakhstan","iso":"KZ","code":"+7"},{"name":"Kenya","iso":"KE","code":"+254"},{"name":"Kiribati","iso":"KI","code":"+686"},{"name":"South Korea","iso":"KR","code":"+82"},{"name":"Kosovo","iso":"XK","code":"+383"},{"name":"Kuwait","iso":"KW","code":"+965"},{"name":"Kyrgyzstan","iso":"KG","code":"+996"},{"name":"Laos","iso":"LA","code":"+856"},{"name":"Latvia","iso":"LV","code":"+371"},{"name":"Lebanon","iso":"LB","code":"+961"},{"name":"Lesotho","iso":"LS","code":"+266"},{"name":"Liberia","iso":"LR","code":"+231"},{"name":"Libya","iso":"LY","code":"+218"},{"name":"Liechtenstein","iso":"LI","code":"+423"},{"name":"Lithuania","iso":"LT","code":"+370"},{"name":"Luxembourg","iso":"LU","code":"+352"},{"name":"Macao","iso":"MO","code":"+853"},{"name":"Madagascar","iso":"MG","code":"+261"},{"name":"Malawi","iso":"MW","code":"+265"},{"name":"Malaysia","iso":"MY","code":"+60"},{"name":"Maldives","iso":"MV","code":"+960"},{"name":"Mali","iso":"ML","code":"+223"},{"name":"Malta","iso":"MT","code":"+356"},{"name":"Marshall Islands","iso":"MH","code":"+692"},{"name":"Martinique","iso":"MQ","code":"+596"},{"name":"Mauritania","iso":"MR","code":"+222"},{"name":"Mauritius","iso":"MU","code":"+230"},{"name":"Mexico","iso":"MX","code":"+52"},{"name":"Micronesia","iso":"FM","code":"+691"},{"name":"Moldova","iso":"MD","code":"+373"},{"name":"Monaco","iso":"MC","code":"+377"},{"name":"Mongolia","iso":"MN","code":"+976"},{"name":"Montenegro","iso":"ME","code":"+382"},{"name":"Montserrat","iso":"MS","code":"+1664"},{"name":"Morocco","iso":"MA","code":"+212"},{"name":"Mozambique","iso":"MZ","code":"+258"},{"name":"Myanmar","iso":"MM","code":"+95"},{"name":"Namibia","iso":"NA","code":"+264"},{"name":"Nauru","iso":"NR","code":"+674"},{"name":"Nepal","iso":"NP","code":"+977"},{"name":"Netherlands","iso":"NL","code":"+31"},{"name":"New Caledonia","iso":"NC","code":"+687"},{"name":"New Zealand","iso":"NZ","code":"+64"},{"name":"Nicaragua","iso":"NI","code":"+505"},{"name":"Niger","iso":"NE","code":"+227"},{"name":"Nigeria","iso":"NG","code":"+234"},{"name":"Niue","iso":"NU","code":"+683"},{"name":"Norfolk Island","iso":"NF","code":"+672"},{"name":"North Macedonia","iso":"MK","code":"+389"},{"name":"Northern Mariana Islands","iso":"MP","code":"+1670"},{"name":"Norway","iso":"NO","code":"+47"},{"name":"Oman","iso":"OM","code":"+968"},{"name":"Pakistan","iso":"PK","code":"+92"},{"name":"Palau","iso":"PW","code":"+680"},{"name":"Palestine","iso":"PS","code":"+970"},{"name":"Panama","iso":"PA","code":"+507"},{"name":"Papua New Guinea","iso":"PG","code":"+675"},{"name":"Paraguay","iso":"PY","code":"+595"},{"name":"Peru","iso":"PE","code":"+51"},{"name":"Philippines","iso":"PH","code":"+63"},{"name":"Poland","iso":"PL","code":"+48"},{"name":"Portugal","iso":"PT","code":"+351"},{"name":"Puerto Rico","iso":"PR","code":"+1787"},{"name":"Qatar","iso":"QA","code":"+974"},{"name":"Romania","iso":"RO","code":"+40"},{"name":"Russia","iso":"RU","code":"+7"},{"name":"Rwanda","iso":"RW","code":"+250"},{"name":"Saint Helena and Tristan da Cunha","iso":"SH","code":"+290"},{"name":"Saint Kitts and Nevis","iso":"KN","code":"+1869"},{"name":"Saint Lucia","iso":"LC","code":"+1758"},{"name":"Saint Pierre and Miquelon","iso":"PM","code":"+508"},{"name":"Saint Vincent and the Grenadines","iso":"VC","code":"+1784"},{"name":"Samoa","iso":"WS","code":"+685"},{"name":"San Marino","iso":"SM","code":"+378"},{"name":"São Tomé and Príncipe","iso":"ST","code":"+239"},{"name":"Saudi Arabia","iso":"SA","code":"+966"},{"name":"Senegal","iso":"SN","code":"+221"},{"name":"Serbia","iso":"RS","code":"+381"},{"name":"Seychelles","iso":"SC","code":"+248"},{"name":"Sierra Leone","iso":"SL","code":"+232"},{"name":"Singapore","iso":"SG","code":"+65"},{"name":"Sint Maarten","iso":"SX","code":"+1721"},{"name":"Slovakia","iso":"SK","code":"+421"},{"name":"Slovenia","iso":"SI","code":"+386"},{"name":"Solomon Islands","iso":"SB","code":"+677"},{"name":"Somalia","iso":"SO","code":"+252"},{"name":"South Africa","iso":"ZA","code":"+27"},{"name":"South Sudan","iso":"SS","code":"+211"},{"name":"Spain","iso":"ES","code":"+34"},{"name":"Sri Lanka","iso":"LK","code":"+94"},{"name":"Sudan","iso":"SD","code":"+249"},{"name":"Suriname","iso":"SR","code":"+597"},{"name":"Sweden","iso":"SE","code":"+46"},{"name":"Switzerland","iso":"CH","code":"+41"},{"name":"Syria","iso":"SY","code":"+963"},{"name":"Taiwan","iso":"TW","code":"+886"},{"name":"Tajikistan","iso":"TJ","code":"+992"},{"name":"Tanzania","iso":"TZ","code":"+255"},{"name":"Thailand","iso":"TH","code":"+66"},{"name":"Timor-Leste","iso":"TL","code":"+670"},{"name":"Togo","iso":"TG","code":"+228"},{"name":"Tokelau","iso":"TK","code":"+690"},{"name":"Tonga","iso":"TO","code":"+676"},{"name":"Trinidad and Tobago","iso":"TT","code":"+1868"},{"name":"Tunisia","iso":"TN","code":"+216"},{"name":"Türkiye","iso":"TR","code":"+90"},{"name":"Turkmenistan","iso":"TM","code":"+993"},{"name":"Turks and Caicos Islands","iso":"TC","code":"+1649"},{"name":"Tuvalu","iso":"TV","code":"+688"},{"name":"Uganda","iso":"UG","code":"+256"},{"name":"Ukraine","iso":"UA","code":"+380"},{"name":"United Arab Emirates","iso":"AE","code":"+971"},{"name":"United Kingdom","iso":"GB","code":"+44"},{"name":"United States","iso":"US","code":"+1"},{"name":"United States Virgin Islands","iso":"VI","code":"+1340"},{"name":"Uruguay","iso":"UY","code":"+598"},{"name":"Uzbekistan","iso":"UZ","code":"+998"},{"name":"Vanuatu","iso":"VU","code":"+678"},{"name":"Venezuela","iso":"VE","code":"+58"},{"name":"Vietnam","iso":"VN","code":"+84"},{"name":"Wallis and Futuna","iso":"WF","code":"+681"},{"name":"Yemen","iso":"YE","code":"+967"},{"name":"Zambia","iso":"ZM","code":"+260"},{"name":"Zimbabwe","iso":"ZW","code":"+263"}];

function isoToFlag(iso) {
  if (!iso || iso.length !== 2 || iso === "XK") return "🌐";
  return [...iso.toUpperCase()].map(c => String.fromCodePoint(127397 + c.charCodeAt(0))).join("");
}

function populateCountryCodes() {
  const select = $("countryCode");
  if (!select) return;

  const previous = select.value || "+91";
  select.innerHTML = "";

  const sorted = [...COUNTRY_CODES].sort((a, b) => {
    if (a.iso === "IN") return -1;
    if (b.iso === "IN") return 1;
    return a.name.localeCompare(b.name);
  });

  sorted.forEach(country => {
    const option = document.createElement("option");
    option.value = country.code;
    option.textContent = `${isoToFlag(country.iso)} ${country.code} — ${country.name}`;
    option.title = `${country.name} (${country.code})`;
    select.appendChild(option);
  });

  const india = sorted.find(c => c.iso === "IN");
  const preferred = sorted.find(c => c.code === previous) || india;
  if (preferred) select.value = preferred.code;
}

populateCountryCodes();


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
