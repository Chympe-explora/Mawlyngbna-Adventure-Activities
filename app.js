/* ============================================================
   MAWLYNGBNA ADVENTURE — APP LOGIC
   Reads config (defaults + any admin overrides saved in
   localStorage), renders the form as a 2-page flow:
     Page 1: visitor details, package, add-ons, payment mode pick
     Page 2: only the chosen payment method's details + total,
             with Back / Submit buttons. Submit opens WhatsApp
             with every answer pre-filled.
   ============================================================ */

const STORAGE_KEY = "mawlyngbna_config_v1";

/** Merge saved admin overrides on top of the shipped defaults. */
function loadConfig() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(DEFAULT_CONFIG);
  try {
    const parsed = JSON.parse(saved);
    // shallow+nested merge so a partial save never loses defaults
    return {
      ...structuredClone(DEFAULT_CONFIG),
      ...parsed,
      payment: { ...DEFAULT_CONFIG.payment, ...(parsed.payment || {}) },
      homestay: { ...DEFAULT_CONFIG.homestay, ...(parsed.homestay || {}), ...(parsed.homestay?.adultBasePrice !== undefined ? { firstAdultPrice: parsed.homestay.adultBasePrice } : {}), ...(parsed.homestay?.childFreeAge !== undefined ? { childrenFreeWithAdult: true } : {}) },
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
    console.warn("Config parse failed, using defaults", e);
    return structuredClone(DEFAULT_CONFIG);
  }
}

const CONFIG = loadConfig();
// Shorthand used everywhere below to read the editable text strings.
const L = CONFIG.labels || {};

/* ----------------------------------------------------------------
   Steppers (+ / -) are wired FIRST and on their own, before any
   other rendering. That way, if something later in setup throws
   (a bad admin override, a missing config field, etc.) the +/-
   buttons for participants and children still work — this was the
   root cause of the "child +/- button not working" bug: one script
   error anywhere earlier in the file used to stop every listener
   below it from ever being attached.
------------------------------------------------------------------- */
const stepperLimits = {
  participants: [CONFIG.limits?.minParticipants ?? 1, CONFIG.limits?.maxParticipants ?? 50],
  children: [CONFIG.limits?.minChildren ?? 0, CONFIG.limits?.maxChildren ?? 50]
};

function setupSteppers() {
  document.querySelectorAll("[data-stepper]").forEach(wrap => {
    const key = wrap.dataset.stepper;
    const [min, max] = stepperLimits[key] || [0, 99];
    const input = wrap.querySelector(".stepper-value");
    const decBtn = wrap.querySelector('[data-action="dec"]');
    const incBtn = wrap.querySelector('[data-action="inc"]');
    if (!input || !decBtn || !incBtn) return;

    function update(val) {
      if (Number.isNaN(val)) val = min;
      val = Math.max(min, Math.min(max, val));
      input.value = String(val);
      decBtn.disabled = val <= min;
      incBtn.disabled = val >= max;
      safeRecalcTotal();
    }
    decBtn.addEventListener("click", () => update((parseInt(input.value, 10) || 0) - 1));
    incBtn.addEventListener("click", () => update((parseInt(input.value, 10) || 0) + 1));
    update(parseInt(input.value, 10));
    if (Number.isNaN(parseInt(input.value, 10))) update(min);
  });
}
setupSteppers();
/* Children are defined as visitors below 17; no individual age fields are required. */
/* ---------------- Everything else, defensively ---------------- */
try { renderLabels(); } catch (e) { console.error("Label render failed", e); }
try { renderHeader(); } catch (e) { console.error("Header render failed", e); }
try { renderPackages(); } catch (e) { console.error("Package render failed", e); }
try { renderAddonSections(); } catch (e) { console.error("Add-on render failed", e); }
try { renderPaymentDetailText(); } catch (e) { console.error("Payment detail render failed", e); }
try { setupPaymentReveal(); } catch (e) { console.error("Payment reveal setup failed", e); }
try { setupCopyButtons(); } catch (e) { console.error("Copy buttons setup failed", e); }
try { setupQrDownload(); } catch (e) { console.error("QR download setup failed", e); }
try { setupNavigation(); } catch (e) { console.error("Page navigation setup failed", e); }
try { setupClearForm(); } catch (e) { console.error("Clear form setup failed", e); }
try { setupAdminTrigger(); } catch (e) { console.error("Admin trigger setup failed", e); }
safeRecalcTotal();

/* ---------------- Render every static piece of text on the page ----------------
   Every label, placeholder, note, error message, and button text a
   visitor can see comes from CONFIG.labels (config.js), so editing
   that file — or the Admin Dashboard's "Text on the form" section —
   changes the live site with nothing hard-coded in the HTML. */
function setText(id, value) { const el = document.getElementById(id); if (el && value !== undefined) el.textContent = value; }
function setPlaceholder(id, value) { const el = document.getElementById(id); if (el && value !== undefined) el.placeholder = value; }

function renderLabels() {
  setText("topNote", L.topNote);
  setText("requiredNote", L.requiredNote);

  setText("nameLabel", L.nameLabel);
  setPlaceholder("f_name", L.namePlaceholder);
  setText("err_name", L.nameError);

  setText("whatsappLabel", L.whatsappLabel);
  setPlaceholder("f_whatsapp", L.whatsappPlaceholder);
  setText("err_whatsapp", L.whatsappError);

  setText("dateLabel", L.dateLabel);
  setText("err_date", L.dateError);

  setText("participantsLabel", L.participantsLabel);
  setText("childrenLabel", L.childrenLabel);
  setText("childNote", L.childNote);

  setText("packageQuestionLabel", L.packageQuestionLabel);
  setText("err_package", L.packageError);

  setText("specialLabel", L.specialLabel);
  setPlaceholder("f_special", L.specialPlaceholder);

  setText("paymentModeLabel", L.paymentModeLabel);
  setText("pm_upi_label", L.payUpiOption);
  setText("pm_bank_label", L.payBankOption);
  setText("pm_qr_label", L.payQrOption);
  setText("err_payment", L.paymentModeError);

  setText("hs_yes_label", L.homestayYesOption);
  setText("hs_no_label", L.homestayNoOption);
  setText("cp_yes_label", L.campingYesOption);
  setText("cp_no_label", L.campingNoOption);

  setText("clearFormBtn", L.clearFormBtn);
  setText("nextBtn", L.nextBtn);

  setText("page2Title", L.page2Title);
  setText("payUpiHeading", L.payUpiHeading);
  setText("upiIdRowLabel", L.upiIdRowLabel);
  setText("payBankHeading", L.payBankHeading);
  setText("accountRowLabel", L.accountRowLabel);
  setText("ifscRowLabel", L.ifscRowLabel);
  setText("payQrHeading", L.payQrHeading);
  setText("scanAndPayText", L.scanAndPayText);
  setText("qrDownloadBtn", L.downloadQrBtn);
  setText("copyBtnUpi2", L.copyUpiBtn);

  ["copyBtnUpi", "copyBtnAcc", "copyBtnIfsc"].forEach(id => setText(id, L.copyBtnText));

  setText("estimatedTotalLabel", L.estimatedTotalLabel);
  setText("totalLabel", L.totalLabel);
  setText("totalFooterNote", L.totalFooterNote);

  setText("backBtn", L.backBtn);
  setText("submitBtn", L.submitBtn);

  // Page indicator starts on page 1
  setText("pageIndicator", L.page1Indicator);
}

/* ---------------- Render header text ---------------- */
function renderHeader() {
  document.getElementById("formTitle").textContent = CONFIG.formTitle;
  document.getElementById("formSubtitle").textContent = CONFIG.formSubtitle;
  document.title = CONFIG.formTitle;
}

/* ---------------- Render packages ---------------- */
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
}

function renderPackages() {
  const packageListEl = document.getElementById("packageList");
  if (!packageListEl) return;
  packageListEl.innerHTML = "";
  CONFIG.packages.forEach(pkg => {
    const row = document.createElement("div");
    row.className = "choice-row package-choice";
    const items = Array.isArray(pkg.items) ? pkg.items : [];
    const itemsHtml = items.length ? `<div class="package-items"><div class="package-includes">${escapeHtml(L.packageDetailsText ?? "Includes:")}</div>${items.map(item => `<div class="package-item">${escapeHtml(item)}</div>`).join("")}</div>` : "";
    const childText = (L.childPriceText ?? "Child: ₹{price}").replace("{price}", Number(pkg.childPrice ?? 0).toLocaleString("en-IN"));
    row.innerHTML = `<input type="radio" name="package" value="${escapeAttr(pkg.id)}" id="pkg_${escapeAttr(pkg.id)}"><label for="pkg_${escapeAttr(pkg.id)}"><span class="package-title">${escapeHtml(pkg.label)}</span><span class="choice-price">= ₹${Number(pkg.price || 0).toLocaleString("en-IN")} ${escapeHtml(L.perPersonText ?? "per person")}</span><span class="package-child-price">${escapeHtml(childText)}</span>${itemsHtml}</label>`;
    packageListEl.appendChild(row);
    row.querySelector("input").addEventListener("change", () => { document.getElementById("err_package")?.classList.remove("show"); safeRecalcTotal(); });
  });
}

/* ---------------- Home stay / Camping sections ---------------- */
function renderAddonSections() {
  const homestayCard = document.getElementById("homestayCard");
  const campingCard = document.getElementById("campingCard");
  if (!CONFIG.homestay.enabled) homestayCard.style.display = "none";
  else {
    const hs = CONFIG.homestay; const prefix = L.notePrefix ?? "Note: ";
    document.getElementById("homestayTitle").textContent = hs.title;
    document.getElementById("homestayNote").textContent = `${prefix}${hs.note}`;
  }
  if (!CONFIG.camping.enabled) campingCard.style.display = "none";
  else {
    const cp = CONFIG.camping; const prefix = L.notePrefix ?? "Note: ";
    document.getElementById("campingTitle").textContent = cp.title;
    document.getElementById("campingNote").textContent = `${prefix}${cp.note} ₹${Number(cp.price || 0).toLocaleString("en-IN")} ${L.perPersonText ?? "per person"}`;
    const list = document.getElementById("campingItems");
    if (list) list.innerHTML = (cp.items || []).map(item => `<div class="package-item">${escapeHtml(item)}</div>`).join("");
  }
  document.querySelectorAll('input[name="homestay"], input[name="camping"]').forEach(el => el.addEventListener("change", safeRecalcTotal));
}

/* ---------------- Payment detail text (page 2) ---------------- */
function renderPaymentDetailText() {
  document.getElementById("upiIdText").textContent = CONFIG.payment.upiId;
  document.getElementById("upiIdText2").textContent = CONFIG.payment.upiId;
  document.getElementById("bankAccText").textContent = CONFIG.payment.bankAccount;
  document.getElementById("bankIfscText").textContent = CONFIG.payment.bankIFSC;
  document.getElementById("qrImage").src = CONFIG.payment.qrImageUrl;
}

/* ---------------- Adaptive price calculator ---------------- */
function formatRupees(n) {
  return "\u20B9" + Math.round(n).toLocaleString("en-IN");
}

/** Recomputes the total from whatever is currently selected on the form.
    Child price uses the same per-person rate as the chosen package
    using the package's configured childPrice. */
function computeTotal() {
  const participants = parseInt(document.getElementById("f_participants").value, 10) || 0;
  const children = parseInt(document.getElementById("f_children").value, 10) || 0;
  const pkgId = document.querySelector('input[name="package"]:checked')?.value;
  const pkg = CONFIG.packages.find(p => p.id === pkgId);
  const homestayOn = CONFIG.homestay.enabled && document.querySelector('input[name="homestay"]:checked')?.value === "yes";
  const campingOn = CONFIG.camping.enabled && document.querySelector('input[name="camping"]:checked')?.value === "yes";
  const lines = []; let total = 0;
  const adultWord = participants === 1 ? (L.adultWord ?? "adult") : (L.adultsWord ?? "adults");
  const childWordFor = n => n === 1 ? (L.childWord ?? "child") : (L.childrenWord ?? "children");
  if (pkg) {
    const adultSub = Number(pkg.price || 0) * participants;
    lines.push({label:`${pkg.label} × ${participants} ${adultWord}`, amount:adultSub}); total += adultSub;
    if (children > 0) { const sub=Number(pkg.childPrice ?? 0)*children; lines.push({label:`${pkg.label} × ${children} ${childWordFor(children)}`,amount:sub}); total+=sub; }
  }
  if (homestayOn) {
    const hs=CONFIG.homestay;
    if (participants>0) { const sub=Number(hs.firstAdultPrice||0)+Math.max(0,participants-1)*Number(hs.additionalAdultPrice||0); lines.push({label:`${hs.title} — ${participants} ${adultWord}`,amount:sub}); total+=sub; }
    if (children>0 && participants>0 && hs.childrenFreeWithAdult) lines.push({label:`${hs.title} — ${children} ${childWordFor(children)} (${L.homeStayChildFreeText ?? "free with an adult"})`,amount:0});
  }
  if (campingOn) {
    const headcount=participants+children; const sub=CONFIG.camping.perPerson ? Number(CONFIG.camping.price||0)*headcount : Number(CONFIG.camping.price||0);
    lines.push({label:CONFIG.camping.perPerson ? `${CONFIG.camping.title} × ${headcount}` : CONFIG.camping.title,amount:sub}); total+=sub;
  }
  return {lines,total,pkg};
}

function recalcTotal() {
  const { lines, total } = computeTotal();
  const breakdownEl = document.getElementById("totalBreakdown");
  const totalEl = document.getElementById("totalAmount");
  if (!breakdownEl || !totalEl) return;

  if (lines.length === 0) {
    breakdownEl.innerHTML = `<div class="b-empty">${L.emptyBreakdownNote ?? "Select a package to see pricing"}</div>`;
  } else {
    breakdownEl.innerHTML = lines.map(l =>
      `<div class="b-row"><span>${l.label}</span><span class="amt">${formatRupees(l.amount)}</span></div>`
    ).join("");
  }
  totalEl.textContent = formatRupees(total);
}
function safeRecalcTotal() { try { recalcTotal(); } catch (e) { console.error("recalcTotal failed", e); } }

/* ---------------- Payment mode → page 2 reveal ---------------- */
const PAY_LABELS = {
  upi: L.payUpiOption ?? "UPI ID",
  bank: L.payBankOption ?? "Bank Transfer",
  qr: L.payQrOption ?? "QR Code"
};

function setupPaymentReveal() {
  document.querySelectorAll('input[name="paymentMode"]').forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.checked) document.getElementById("err_payment").classList.remove("show");
    });
  });
}

/** Shows only the payment-detail block matching the chosen mode on page 2,
    and sets that page's heading. Called right before page 2 becomes visible. */
function revealChosenPaymentDetail() {
  const mode = document.querySelector('input[name="paymentMode"]:checked')?.value;
  const detailUpi = document.getElementById("detailUpi");
  const detailBank = document.getElementById("detailBank");
  const detailQr = document.getElementById("detailQr");
  detailUpi.hidden = mode !== "upi";
  detailBank.hidden = mode !== "bank";
  detailQr.hidden = mode !== "qr";
  const title = document.getElementById("page2Title");
  const basePage2Title = L.page2Title ?? "Payment";
  if (title) title.textContent = mode ? `${basePage2Title} \u2014 ${PAY_LABELS[mode]}` : basePage2Title;
}

/* ---------------- Copy buttons ---------------- */
const toast = document.getElementById("toast");
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 1800);
}

function setupCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const targetId = btn.dataset.copyTarget;
      const text = document.getElementById(targetId).textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        // fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      showToast((L.copiedToastPrefix ?? "Copied: ") + text);
      btn.classList.add("copied");
      const original = btn.textContent;
      btn.textContent = L.copiedBtnText ?? "Copied!";
      setTimeout(() => { btn.classList.remove("copied"); btn.textContent = original; }, 1400);
    });
  });
}

/* ---------------- QR download ---------------- */
function setupQrDownload() {
  document.getElementById("qrDownloadBtn").addEventListener("click", async () => {
    const url = CONFIG.payment.qrImageUrl;
    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "mawlyngbna-payment-qr.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      // Cross-origin images can't be fetched as a blob — open in a new tab instead.
      window.open(url, "_blank");
    }
  });
}

/* ---------------- Validation ---------------- */
function digitsOnly(str) { return (str || "").replace(/\D/g, ""); }

/** Validates everything collected on page 1 (name, WhatsApp, date, package, payment mode). */
function validatePage1() {
  let ok = true;

  const name = document.getElementById("f_name").value.trim();
  toggleError("err_name", "f_name", name.length === 0);
  if (name.length === 0) ok = false;

  const whatsapp = digitsOnly(document.getElementById("f_whatsapp").value);
  const whatsappBad = whatsapp.length < 10;
  toggleError("err_whatsapp", "f_whatsapp", whatsappBad);
  if (whatsappBad) ok = false;

  const date = document.getElementById("f_date").value;
  toggleError("err_date", "f_date", !date);
  if (!date) ok = false;

  const pkgChosen = document.querySelector('input[name="package"]:checked');
  document.getElementById("err_package").classList.toggle("show", !pkgChosen);
  if (!pkgChosen) ok = false;

  const payChosen = document.querySelector('input[name="paymentMode"]:checked');
  document.getElementById("err_payment").classList.toggle("show", !payChosen);
  if (!payChosen) ok = false;



  return ok;
}

function toggleError(errId, inputId, isBad) {
  document.getElementById(errId).classList.toggle("show", isBad);
  document.getElementById(inputId).classList.toggle("invalid", isBad);
}

/* ---------------- Page navigation ---------------- */
const pageIndicator = document.getElementById("pageIndicator");

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  if (pageIndicator) {
    pageIndicator.textContent = pageId === "page-2" ? (L.page2Indicator ?? "Page 2 of 2") : (L.page1Indicator ?? "Page 1 of 2");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setupNavigation() {
  // live-clear errors as the visitor fixes fields
  ["f_name", "f_whatsapp", "f_date"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => validatePage1());
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    if (!validatePage1()) {
      showToast(L.fillRequiredToast ?? "Please fill in all required fields.");
      return;
    }
    revealChosenPaymentDetail();
    safeRecalcTotal();
    showPage("page-2");
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    showPage("page-1");
  });

  const form = document.getElementById("bookingForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Defensive re-check in case the visitor navigated back and cleared something.
    if (!validatePage1()) {
      showToast(L.fillRequiredToast ?? "Please fill in all required fields.");
      showPage("page-1");
      return;
    }

    const name = document.getElementById("f_name").value.trim();
    const whatsapp = document.getElementById("f_whatsapp").value.trim();
    const date = document.getElementById("f_date").value;
    const participants = document.getElementById("f_participants").value;
    const children = document.getElementById("f_children").value;
    const pkg = CONFIG.packages.find(p => p.id === document.querySelector('input[name="package"]:checked').value);
    const homestay = CONFIG.homestay.enabled ? (document.querySelector('input[name="homestay"]:checked')?.value || "no") : null;
    const camping = CONFIG.camping.enabled ? (document.querySelector('input[name="camping"]:checked')?.value || "no") : null;
    const special = document.getElementById("f_special").value.trim();
    const payMode = document.querySelector('input[name="paymentMode"]:checked').value;
    const payLabel = PAY_LABELS[payMode];

    const { lines: priceLines, total } = computeTotal();

    const lines = [
      "*New Booking — Mawlyngbna Adventure*",
      "",
      `Name: ${name}`,
      `WhatsApp Number: ${whatsapp}`,
      `Date of visit: ${date}`,
      `Number of participants: ${participants}`,
      `Number of child: ${children}`
    ];
    lines.push(`Package: ${pkg.label} (\u20B9${pkg.price} per person)`);
    if (homestay !== null) lines.push(`Home stay: ${homestay}`);
    if (camping !== null) lines.push(`Camping: ${camping}`);
    if (special) lines.push(`Special request: ${special}`);
    lines.push(`Payment mode: ${payLabel}`);
    lines.push("");
    lines.push("*Price breakdown*");
    priceLines.forEach(l => lines.push(`${l.label}: \u20B9${Math.round(l.amount).toLocaleString("en-IN")}`));
    lines.push(`*Total: \u20B9${Math.round(total).toLocaleString("en-IN")}*`);

    const message = lines.join("\n");
    const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.location.href = waUrl;
  });
}

/* ---------------- Clear form ---------------- */
function setupClearForm() {
  document.getElementById("clearFormBtn").addEventListener("click", () => {
    const form = document.getElementById("bookingForm");
    form.reset();
    document.querySelectorAll(".field-error").forEach(el => el.classList.remove("show"));
    document.querySelectorAll("input.invalid").forEach(el => el.classList.remove("invalid"));
    document.querySelectorAll("[data-stepper]").forEach(wrap => {
      const key = wrap.dataset.stepper;
      const min = stepperLimits[key] ? stepperLimits[key][0] : 0;
      const input = wrap.querySelector(".stepper-value");
      if (input) input.value = min;
      const decBtn = wrap.querySelector('[data-action="dec"]');
      const incBtn = wrap.querySelector('[data-action="inc"]');
      if (decBtn) decBtn.disabled = true;
      if (incBtn) incBtn.disabled = false;
    });
    document.getElementById("detailUpi").hidden = true;
    document.getElementById("detailBank").hidden = true;
    document.getElementById("detailQr").hidden = true;
    safeRecalcTotal();
    showPage("page-1");
  });
}

/* ---------------- Secret admin dashboard trigger ----------------
   Tap the invisible bottom-right corner 5 times within 3 seconds
   to open the admin dashboard. Nothing is visible or labeled,
   so casual visitors will never find it by accident.
------------------------------------------------------------------ */
function setupAdminTrigger() {
  const zone = document.getElementById("adminTrigger");
  let taps = 0;
  let timer = null;
  zone.addEventListener("click", () => {
    taps += 1;
    clearTimeout(timer);
    timer = setTimeout(() => { taps = 0; }, 3000);
    if (taps >= 5) {
      taps = 0;
      window.location.href = "admin.html";
    }
  });
}
