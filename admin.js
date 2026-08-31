/* ============================================================
   MAWLYNGBNA ADVENTURE — ADMIN DASHBOARD LOGIC
   Password gate is client-side only (this is a static site with
   no server/database). It stops casual visitors from finding the
   dashboard, but is NOT real security — don't put anything on
   this page you wouldn't want a determined person to see.
   ============================================================ */

const STORAGE_KEY = "mawlyngbna_config_v1";
const SESSION_KEY = "mawlyngbna_admin_unlocked";

function loadConfig() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(DEFAULT_CONFIG);
  try {
    const parsed = JSON.parse(saved);
    return {
      ...structuredClone(DEFAULT_CONFIG),
      ...parsed,
      payment: { ...DEFAULT_CONFIG.payment, ...(parsed.payment || {}) },
      homestay: { ...DEFAULT_CONFIG.homestay, ...(parsed.homestay || {}) },
      camping: { ...DEFAULT_CONFIG.camping, ...(parsed.camping || {}) },
      pricing: { ...DEFAULT_CONFIG.pricing, ...(parsed.pricing || {}) },
      limits: { ...DEFAULT_CONFIG.limits, ...(parsed.limits || {}) },
      labels: { ...DEFAULT_CONFIG.labels, ...(parsed.labels || {}) },
      packages: (parsed.packages && parsed.packages.length ? parsed.packages : DEFAULT_CONFIG.packages).map((pkg, i) => ({
        ...(DEFAULT_CONFIG.packages[i] || {}),
        ...pkg,
        items: Array.isArray(pkg.items) ? pkg.items : (DEFAULT_CONFIG.packages[i]?.items || [])
      }))
    };
  } catch (e) {
    return structuredClone(DEFAULT_CONFIG);
  }
}

let CONFIG = loadConfig();

const toast = document.getElementById("toast");
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 1800);
}

/* ---------------- Login gate ---------------- */
const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");

function unlock() {
  loginScreen.hidden = true;
  dashboard.hidden = false;
  populateForm();
}

if (sessionStorage.getItem(SESSION_KEY) === "1") {
  unlock();
}

document.getElementById("loginBtn").addEventListener("click", tryLogin);
document.getElementById("loginPassword").addEventListener("keydown", e => {
  if (e.key === "Enter") tryLogin();
});
document.getElementById("showPasswordToggle").addEventListener("change", e => {
  document.getElementById("loginPassword").type = e.target.checked ? "text" : "password";
});

/* This used to fail whenever the password had leading/trailing
   whitespace (easy to pick up from a phone keyboard's autocomplete
   or autocapitalize bar) because it was compared with no trimming
   at all. Now both sides are trimmed before comparing. */
function tryLogin() {
  const entered = document.getElementById("loginPassword").value.trim();
  if (entered.length > 0 && entered === String(CONFIG.adminPassword).trim()) {
    sessionStorage.setItem(SESSION_KEY, "1");
    document.getElementById("loginError").style.display = "none";
    unlock();
  } else {
    document.getElementById("loginError").style.display = "block";
  }
}

/* "Forgot password" — since this is a static site with no server,
   there's no email/SMS reset possible. This resets ONLY the saved
   password back to the shipped default (from config.js), keeping
   every other saved edit (packages, prices, payment details, etc)
   exactly as they are. */
document.getElementById("forgotPasswordBtn").addEventListener("click", () => {
  if (!confirm("Reset the admin password back to the default from config.js? Everything else you've saved (packages, prices, payment info) stays untouched.")) return;
  const saved = localStorage.getItem(STORAGE_KEY);
  let parsed = {};
  try { parsed = saved ? JSON.parse(saved) : {}; } catch (e) { parsed = {}; }
  delete parsed.adminPassword;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  CONFIG = loadConfig();
  document.getElementById("loginError").style.display = "none";
  alert("Password reset. The default password is now: " + DEFAULT_CONFIG.adminPassword);
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
});

/* ---------------- Populate form from CONFIG ---------------- */
function populateForm() {
  document.getElementById("a_title").value = CONFIG.formTitle;
  document.getElementById("a_subtitle").value = CONFIG.formSubtitle;
  document.getElementById("a_whatsapp").value = CONFIG.whatsappNumber;

  document.getElementById("a_hs_enabled").checked = !!CONFIG.homestay.enabled;
  document.getElementById("a_hs_title").value = CONFIG.homestay.title;
  document.getElementById("a_hs_note").value = CONFIG.homestay.note;
  document.getElementById("a_hs_firstadult").value = CONFIG.homestay.firstAdultPrice ?? 0;
  document.getElementById("a_hs_adultextra").value = CONFIG.homestay.additionalAdultPrice ?? 0;
  document.getElementById("a_hs_childrenfree").checked = !!CONFIG.homestay.childrenFreeWithAdult;

  document.getElementById("a_cp_enabled").checked = !!CONFIG.camping.enabled;
  document.getElementById("a_cp_title").value = CONFIG.camping.title;
  document.getElementById("a_cp_price").value = CONFIG.camping.price;
  document.getElementById("a_cp_note").value = CONFIG.camping.note;
  document.getElementById("a_cp_perperson").checked = !!CONFIG.camping.perPerson;

  
  document.getElementById("a_minP").value = CONFIG.limits?.minParticipants ?? 1;
  document.getElementById("a_maxP").value = CONFIG.limits?.maxParticipants ?? 50;
  document.getElementById("a_minC").value = CONFIG.limits?.minChildren ?? 0;
  document.getElementById("a_maxC").value = CONFIG.limits?.maxChildren ?? 50;

  document.getElementById("a_pay_name").value = CONFIG.payment.accountName;
  document.getElementById("a_pay_upi").value = CONFIG.payment.upiId;
  document.getElementById("a_pay_bankname").value = CONFIG.payment.bankName;
  document.getElementById("a_pay_bankacc").value = CONFIG.payment.bankAccount;
  document.getElementById("a_pay_ifsc").value = CONFIG.payment.bankIFSC;
  document.getElementById("a_pay_qr").value = CONFIG.payment.qrImageUrl;

  document.getElementById("a_password").value = CONFIG.adminPassword;

  populateLabelFields();
  renderPackageEditor();
}

/* ---------------- Text-on-the-form fields (CONFIG.labels) ----------------
   Every key in DEFAULT_CONFIG.labels gets its own input with the id
   "t_" + key (e.g. labels.nameLabel <-> #t_nameLabel). Looping over
   the keys here means a new label added to config.js only needs a
   matching input added to admin.html — nothing else to wire up. */
function populateLabelFields() {
  const labels = CONFIG.labels || {};
  Object.keys(DEFAULT_CONFIG.labels || {}).forEach(key => {
    const el = document.getElementById("t_" + key);
    if (el) el.value = labels[key] ?? DEFAULT_CONFIG.labels[key] ?? "";
  });
}

/* ---------------- Package editor (add / edit / remove / reorder) ---------------- */
const packageEditor = document.getElementById("packageEditor");

function renderPackageEditor() {
  packageEditor.innerHTML = "";
  CONFIG.packages.forEach((pkg, idx) => {
    const row = document.createElement("div");
    row.className = "pkg-row pkg-row-expanded";
    const items = Array.isArray(pkg.items) ? pkg.items.join("\n") : "";
    row.innerHTML = `
      <input type="text" data-field="label" value="${escapeAttr(pkg.label)}" placeholder="Package name">
      <input type="number" data-field="price" value="${pkg.price}" placeholder="Adult price">
      <input type="number" data-field="childPrice" value="${pkg.childPrice ?? 0}" placeholder="Child price">
      <textarea data-field="items" rows="4" placeholder="One emoji item per line">${escapeTextarea(items)}</textarea>
      <button type="button" class="icon-btn" data-action="move-up" title="Move up">↑</button>
      <button type="button" class="icon-btn danger" data-action="remove" title="Remove">✕ Remove</button>
    `;
    row.querySelector('[data-field="label"]').addEventListener("input", e => CONFIG.packages[idx].label=e.target.value);
    row.querySelector('[data-field="price"]').addEventListener("input", e => CONFIG.packages[idx].price=Number(e.target.value)||0);
    row.querySelector('[data-field="childPrice"]').addEventListener("input", e => CONFIG.packages[idx].childPrice=Number(e.target.value)||0);
    row.querySelector('[data-field="items"]').addEventListener("input", e => CONFIG.packages[idx].items=e.target.value.split(/\n/).map(v=>v.trim()).filter(Boolean));
    row.querySelector('[data-action="remove"]').addEventListener("click",()=>{CONFIG.packages.splice(idx,1);renderPackageEditor();});
    row.querySelector('[data-action="move-up"]').addEventListener("click",()=>{if(idx===0)return; const tmp=CONFIG.packages[idx-1]; CONFIG.packages[idx-1]=CONFIG.packages[idx]; CONFIG.packages[idx]=tmp; renderPackageEditor();});
    packageEditor.appendChild(row);
  });
}

function escapeAttr(str) { return String(str).replace(/"/g,"&quot;"); }
function escapeTextarea(str) { return String(str ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\u0022/g,"&quot;"); }

document.getElementById("addPackageBtn").addEventListener("click", () => {
  CONFIG.packages.push({
    id: "pkg" + Date.now(),
    label: "New package",
    price: 0,
    childPrice: 600,
    items: ["✨ New activity"]
  });
  renderPackageEditor();
});

function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

/* ---------------- Save ---------------- */
document.getElementById("saveBtn").addEventListener("click", () => {
  CONFIG.formTitle = document.getElementById("a_title").value.trim();
  CONFIG.formSubtitle = document.getElementById("a_subtitle").value.trim();
  CONFIG.whatsappNumber = document.getElementById("a_whatsapp").value.replace(/\D/g, "");

  CONFIG.homestay.enabled = document.getElementById("a_hs_enabled").checked;
  CONFIG.homestay.title = document.getElementById("a_hs_title").value.trim();
  CONFIG.homestay.note = document.getElementById("a_hs_note").value.trim();
  CONFIG.homestay.firstAdultPrice = Number(document.getElementById("a_hs_firstadult").value) || 0;
  CONFIG.homestay.additionalAdultPrice = Number(document.getElementById("a_hs_adultextra").value) || 0;
  CONFIG.homestay.childrenFreeWithAdult = document.getElementById("a_hs_childrenfree").checked;

  CONFIG.camping.enabled = document.getElementById("a_cp_enabled").checked;
  CONFIG.camping.title = document.getElementById("a_cp_title").value.trim();
  CONFIG.camping.price = Number(document.getElementById("a_cp_price").value) || 0;
  CONFIG.camping.note = document.getElementById("a_cp_note").value.trim();
  CONFIG.camping.perPerson = document.getElementById("a_cp_perperson").checked;

  CONFIG.limits = CONFIG.limits || {};
  CONFIG.limits.minParticipants = Number(document.getElementById("a_minP").value) || 0;
  CONFIG.limits.maxParticipants = Number(document.getElementById("a_maxP").value) || 50;
  CONFIG.limits.minChildren = Number(document.getElementById("a_minC").value) || 0;
  CONFIG.limits.maxChildren = Number(document.getElementById("a_maxC").value) || 50;

  CONFIG.payment.accountName = document.getElementById("a_pay_name").value.trim();
  CONFIG.payment.upiId = document.getElementById("a_pay_upi").value.trim();
  CONFIG.payment.bankName = document.getElementById("a_pay_bankname").value.trim();
  CONFIG.payment.bankAccount = document.getElementById("a_pay_bankacc").value.trim();
  CONFIG.payment.bankIFSC = document.getElementById("a_pay_ifsc").value.trim();
  CONFIG.payment.qrImageUrl = document.getElementById("a_pay_qr").value.trim();

  CONFIG.adminPassword = document.getElementById("a_password").value.trim() || CONFIG.adminPassword;

  CONFIG.labels = CONFIG.labels || {};
  Object.keys(DEFAULT_CONFIG.labels || {}).forEach(key => {
    const el = document.getElementById("t_" + key);
    if (el) CONFIG.labels[key] = el.value;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(CONFIG));
  showToast("Saved. The live form on this browser is now updated.");
  document.getElementById("saveStatus").textContent = "Saved just now.";
  setTimeout(() => { document.getElementById("saveStatus").textContent = ""; }, 3000);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirm("Reset all prices, text and payment details back to the defaults shipped in config.js? This cannot be undone.")) return;
  localStorage.removeItem(STORAGE_KEY);
  CONFIG = loadConfig();
  populateForm();
  showToast("Reset to defaults.");
});
