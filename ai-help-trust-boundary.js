/* AI Help trust boundary
 * ------------------------------------------------------------
 * Adds a clear disclosure step before the optional Puter sign-in flow.
 * This is a transparency/UI safeguard only; it does not make or imply a
 * legal-compliance determination for minors.
 *
 * The script does not load Puter, does not send data, and does not alter
 * tutor.js. It only intercepts the first allowed sign-in click in the
 * current page session, shows the disclosure, then lets the existing
 * tutor.js sign-in handler continue after the user explicitly proceeds.
 */
(function () {
  "use strict";

  let acknowledged = false;
  let pendingButton = null;
  let lastFocused = null;

  function isEnglish() {
    return !!document.getElementById("langEn")?.classList.contains("active") ||
      (document.documentElement.lang || "").toLowerCase().startsWith("en");
  }

  function copy() {
    if (isEnglish()) {
      return {
        title: "Before Puter opens",
        intro: "The core aitools4kids.gr site works without an account. If you continue, you are entering the optional AI Help flow, which uses a third-party service.",
        bullet1: "Puter will load only after you choose to continue.",
        bullet2: "Messages you send in AI Help are sent to Puter and the AI provider so a reply can be generated.",
        bullet3: "If you use the microphone, the audio clip is sent through Puter for speech-to-text transcription.",
        bullet4: "aitools4kids.gr does not store AI Help messages or recordings in its own database.",
        warning: "Do not enter full names, school identifiers, addresses, phone numbers, email addresses, passwords, health information, or other personal/sensitive data.",
        minorNote: "For ages 13–14, the site also asks for a parent/guardian consent declaration before sign-in. This declaration is an access safeguard and is not a technical verification of identity or age.",
        terms: "Puter Terms ↗",
        privacy: "Puter Privacy ↗",
        continue: "I understand — continue to Puter",
        cancel: "Cancel",
      };
    }
    return {
      title: "Πριν ανοίξει το Puter",
      intro: "Η βασική πλατφόρμα aitools4kids.gr λειτουργεί χωρίς λογαριασμό. Αν συνεχίσεις, περνάς στην προαιρετική AI Βοήθεια, η οποία χρησιμοποιεί υπηρεσία τρίτου.",
      bullet1: "Το Puter θα φορτωθεί μόνο αφού επιλέξεις να συνεχίσεις.",
      bullet2: "Τα μηνύματα που στέλνεις στην AI Βοήθεια αποστέλλονται στο Puter και στον πάροχο AI ώστε να παραχθεί απάντηση.",
      bullet3: "Αν χρησιμοποιήσεις μικρόφωνο, το ηχητικό απόσπασμα αποστέλλεται μέσω Puter για μεταγραφή σε κείμενο.",
      bullet4: "Το aitools4kids.gr δεν αποθηκεύει μηνύματα ή ηχογραφήσεις της AI Βοήθειας σε δική του βάση δεδομένων.",
      warning: "Μην γράφεις ονοματεπώνυμο, στοιχεία σχολείου/τμήματος, διεύθυνση, τηλέφωνο, email, κωδικούς, στοιχεία υγείας ή άλλα προσωπικά/ευαίσθητα δεδομένα.",
      minorNote: "Για ηλικίες 13–14, η πλατφόρμα ζητά επίσης δήλωση γονικής συναίνεσης πριν από τη σύνδεση. Η δήλωση αυτή είναι μέτρο πρόσβασης και δεν αποτελεί τεχνική επαλήθευση ταυτότητας ή ηλικίας.",
      terms: "Όροι Puter ↗",
      privacy: "Απόρρητο Puter ↗",
      continue: "Κατάλαβα — συνέχεια στο Puter",
      cancel: "Ακύρωση",
    };
  }

  function ensureStyles() {
    if (document.getElementById("aiHelpBoundaryStyles")) return;
    const style = document.createElement("style");
    style.id = "aiHelpBoundaryStyles";
    style.textContent = `
      .ai-help-boundary[hidden]{display:none!important;}
      .ai-help-boundary{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:20px;background:rgba(17,24,39,.58);}
      .ai-help-boundary__panel{width:min(620px,100%);max-height:min(84vh,760px);overflow:auto;background:#fff;color:#1f2430;border-radius:16px;box-shadow:0 24px 80px rgba(15,23,42,.28);padding:22px;}
      .ai-help-boundary__panel h2{margin:0 0 10px;font-size:clamp(21px,4.8vw,27px);line-height:1.2;color:#1f2430;}
      .ai-help-boundary__panel p{margin:0 0 12px;line-height:1.55;}
      .ai-help-boundary__panel ul{margin:10px 0 14px;padding-left:22px;line-height:1.5;}
      .ai-help-boundary__panel li+li{margin-top:7px;}
      .ai-help-boundary__warning{margin:14px 0;padding:12px 14px;border-radius:10px;background:#fff7ed;border:1px solid #fed7aa;font-weight:650;line-height:1.5;}
      .ai-help-boundary__minor{margin:12px 0;padding:11px 13px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;font-size:14px;line-height:1.5;}
      .ai-help-boundary__links{margin:12px 0 18px!important;font-size:14px;}
      .ai-help-boundary__links a{font-weight:650;}
      .ai-help-boundary__actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;}
      .ai-help-boundary__btn{min-height:44px;border-radius:10px;padding:10px 15px;border:1px solid #cbd5e1;background:#fff;color:#1f2430;font:inherit;font-weight:700;cursor:pointer;}
      .ai-help-boundary__btn--primary{background:#2e6ba3;border-color:#2e6ba3;color:#fff;}
      .ai-help-boundary__btn:focus-visible,.ai-help-boundary__panel a:focus-visible{outline:3px solid #0f5c8f;outline-offset:3px;}
      @media (max-width:520px){
        .ai-help-boundary{padding:12px;align-items:end;}
        .ai-help-boundary__panel{max-height:90vh;border-radius:16px 16px 10px 10px;padding:18px 16px;}
        .ai-help-boundary__actions{display:grid;grid-template-columns:1fr;}
        .ai-help-boundary__btn{width:100%;}
        .ai-help-boundary__btn--primary{order:-1;}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureDialog() {
    let root = document.getElementById("aiHelpTrustBoundary");
    if (root) return root;
    ensureStyles();
    root = document.createElement("div");
    root.id = "aiHelpTrustBoundary";
    root.className = "ai-help-boundary";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "aiHelpBoundaryTitle");
    root.addEventListener("click", (event) => {
      if (event.target === root) closeDialog(false);
    });
    document.body.appendChild(root);
    return root;
  }

  function renderDialog() {
    const root = ensureDialog();
    const t = copy();
    const age = document.getElementById("tutorAge")?.value || "";
    root.innerHTML = `
      <div class="ai-help-boundary__panel" tabindex="-1">
        <h2 id="aiHelpBoundaryTitle">${escapeHtml(t.title)}</h2>
        <p>${escapeHtml(t.intro)}</p>
        <ul>
          <li>${escapeHtml(t.bullet1)}</li>
          <li>${escapeHtml(t.bullet2)}</li>
          <li>${escapeHtml(t.bullet3)}</li>
          <li>${escapeHtml(t.bullet4)}</li>
        </ul>
        <div class="ai-help-boundary__warning">${escapeHtml(t.warning)}</div>
        ${age === "13-14" ? `<div class="ai-help-boundary__minor">${escapeHtml(t.minorNote)}</div>` : ""}
        <p class="ai-help-boundary__links"><a href="https://puter.com/terms" target="_blank" rel="noopener noreferrer">${escapeHtml(t.terms)}</a> · <a href="https://puter.com/privacy" target="_blank" rel="noopener noreferrer">${escapeHtml(t.privacy)}</a></p>
        <div class="ai-help-boundary__actions">
          <button type="button" class="ai-help-boundary__btn" data-ai-help-boundary-cancel>${escapeHtml(t.cancel)}</button>
          <button type="button" class="ai-help-boundary__btn ai-help-boundary__btn--primary" data-ai-help-boundary-continue>${escapeHtml(t.continue)}</button>
        </div>
      </div>`;

    root.querySelector("[data-ai-help-boundary-cancel]")?.addEventListener("click", () => closeDialog(false));
    root.querySelector("[data-ai-help-boundary-continue]")?.addEventListener("click", () => closeDialog(true));
    return root;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getFocusable(root) {
    if (!root) return [];
    return Array.from(root.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter((element) => !element.hasAttribute("hidden") && element.getClientRects().length > 0);
  }

  function trapDialogFocus(event, root) {
    if (event.key !== "Tab" || !root || root.hidden) return;
    const focusable = getFocusable(root);
    if (!focusable.length) {
      event.preventDefault();
      root.querySelector(".ai-help-boundary__panel")?.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    const activeInside = active instanceof Element && root.contains(active);

    if (event.shiftKey && (!activeInside || active === first)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (!activeInside || active === last)) {
      event.preventDefault();
      first.focus();
    }
  }

  function openDialog(button) {
    pendingButton = button;
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : button;
    const root = renderDialog();
    root.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => root.querySelector("[data-ai-help-boundary-continue]")?.focus());
  }

  function closeDialog(proceed) {
    const root = document.getElementById("aiHelpTrustBoundary");
    if (!root || root.hidden) return;
    root.hidden = true;
    document.body.style.overflow = "";
    const button = pendingButton;
    pendingButton = null;

    if (proceed && button?.isConnected) {
      acknowledged = true;
      button.click();
      return;
    }
    if (lastFocused?.isConnected) lastFocused.focus();
  }

  function gateAllowsSignIn() {
    return !!document.getElementById("tutorAccessGate")?.classList.contains("tutor-access--good");
  }

  function interceptSignIn(event) {
    const target = event.target instanceof Element ? event.target.closest("#tutorSignIn, #tutorSwitchAccount") : null;
    if (!target || acknowledged || !gateAllowsSignIn()) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openDialog(target);
  }

  document.addEventListener("click", interceptSignIn, true);
  document.addEventListener("keydown", (event) => {
    const root = document.getElementById("aiHelpTrustBoundary");
    if (!root || root.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog(false);
      return;
    }
    trapDialogFocus(event, root);
  });

  window.AITOOLSKIDS_AI_HELP_TRUST_BOUNDARY = Object.freeze({
    version: 2,
    disclosureBeforePuter: true,
    legalComplianceClaim: false,
    focusTrap: true,
  });
})();
