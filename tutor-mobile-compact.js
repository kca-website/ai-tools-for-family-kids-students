/**
 * tutor-mobile-compact.js
 * Mobile-only compact layout for AI Help.
 * Desktop remains unchanged.
 * No MutationObserver, polling or AI calls.
 */
(function () {
  "use strict";

  const STYLE_ID = "aitools4kidsTutorMobileCompactStyles";
  const MQ = "(max-width: 700px)";
  const RENDER_EVENT = "aitools4kids:tutor-rendered";

  const LABELS = {
    el: {
      info: "ℹ️ Πληροφορίες μαθήματος & πηγές",
      authMore: "Πώς λειτουργεί;",
      authLess: "Κλείσιμο πληροφοριών",
      settings: "Ρυθμίσεις μαθήματος",
      edit: "Επεξεργασία",
      close: "Κλείσιμο",
      notSelected: "Δεν έχει επιλεγεί",
    },
    en: {
      info: "ℹ️ Lesson information & sources",
      authMore: "How does it work?",
      authLess: "Close information",
      settings: "Lesson settings",
      edit: "Edit",
      close: "Close",
      notSelected: "Not selected",
    },
  };

  function isEnglish() {
    return !!document.getElementById("langEn")?.classList.contains("active") ||
      (document.documentElement.lang || "").toLowerCase().startsWith("en");
  }

  function tr(key) {
    const lang = isEnglish() ? "en" : "el";
    return LABELS[lang]?.[key] || key;
  }

  function isMobile() {
    return !!window.matchMedia?.(MQ).matches;
  }

  function tutorIsVisible() {
    const view = document.getElementById("tutorView");
    if (view && !view.hidden) return true;
    return /\/(primary|middle|high)\/(guardian|student)\/tutor\/?$/i.test(location.pathname);
  }

  function syncRouteClass() {
    document.body.classList.toggle("tutor-mobile-active", tutorIsVisible());
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .tutor-mobile-details,
      .tutor-mobile-auth-more,
      .tutor-mobile-settings-toggle{display:none;}

      @media (max-width:700px){
        /* Tutor route: remove repeated guidance, keep navigation compact. */
        body.tutor-mobile-active #startHereGuide,
        body.tutor-mobile-active #roleContextGuide{display:none !important;}
        body.tutor-mobile-active .breadcrumb{margin-bottom:8px;}
        body.tutor-mobile-active #pathZoneHeading{margin-bottom:8px;}
        body.tutor-mobile-active .role-tabs{margin-bottom:10px;}
        body.tutor-mobile-active .view-tabs{
          flex-wrap:nowrap;
          overflow-x:auto;
          -webkit-overflow-scrolling:touch;
          scrollbar-width:none;
          gap:6px;
          margin-bottom:12px;
          padding-bottom:2px;
        }
        body.tutor-mobile-active .view-tabs::-webkit-scrollbar{display:none;}
        body.tutor-mobile-active .view-tab{
          flex:0 0 auto;
          white-space:nowrap;
          padding:5px 9px;
          font-size:.72rem;
        }

        #tutorMount .tutor-shell{gap:12px;}
        #tutorMount .tutor-heading{
          padding:14px 14px 13px;
          border-radius:14px;
        }
        #tutorMount .tutor-heading__eyebrow{font-size:.65rem;margin-bottom:3px;}
        #tutorMount .tutor-heading h2{font-size:1.28rem;margin-bottom:4px;}
        #tutorMount .tutor-heading p:last-child{font-size:.82rem;line-height:1.45;}

        /* Puter: only the actionable status is open by default. */
        #tutorMount .tutor-auth-card{
          padding:12px;
          border-radius:14px;
        }
        #tutorMount .tutor-auth-card__top{
          display:block;
        }
        #tutorMount .tutor-auth-card__top > div > strong{
          display:block;
          font-size:.9rem;
        }
        #tutorMount .tutor-auth-card__top > div > p,
        #tutorMount .tutor-auth-steps,
        #tutorMount .tutor-auth-links,
        #tutorMount .tutor-privacy-note{
          display:none;
        }
        #tutorMount .tutor-auth-card.mobile-details-open .tutor-auth-card__top > div > p,
        #tutorMount .tutor-auth-card.mobile-details-open .tutor-auth-steps,
        #tutorMount .tutor-auth-card.mobile-details-open .tutor-auth-links,
        #tutorMount .tutor-auth-card.mobile-details-open .tutor-privacy-note{
          display:block;
        }
        #tutorMount .tutor-auth-card__top #tutorSwitchAccount{
          margin-top:8px;
        }
        #tutorMount .tutor-auth-status{
          margin-top:8px;
          padding:9px 10px;
          gap:7px;
          border-radius:10px;
        }
        #tutorMount .tutor-auth-status strong{font-size:.82rem;}
        #tutorMount .tutor-auth-user{font-size:.72rem;}
        #tutorMount .tutor-auth-connect{
          width:100%;
          margin:2px 0 0;
          min-height:40px;
        }
        #tutorMount .tutor-usage{width:100%;min-width:0;margin-left:0;}
        #tutorMount .tutor-mobile-auth-more{
          display:flex;
          width:100%;
          align-items:center;
          justify-content:space-between;
          gap:8px;
          margin-top:7px;
          padding:7px 9px;
          border:0;
          border-radius:9px;
          background:#f8fafc;
          color:#2563a8;
          font:inherit;
          font-size:.74rem;
          font-weight:750;
          cursor:pointer;
        }
        #tutorMount .tutor-mobile-auth-more::after{content:"▾";color:#64748b;}
        #tutorMount .tutor-auth-card.mobile-details-open .tutor-mobile-auth-more::after{content:"▴";}
        #tutorMount .tutor-auth-steps{margin-top:8px;font-size:.69rem;line-height:1.4;}
        #tutorMount .tutor-auth-links{font-size:.69rem;}
        #tutorMount .tutor-privacy-note{font-size:.7rem;line-height:1.4;padding:8px 9px;}

        /* Lesson settings: summary first, fields only when editing. */
        #tutorMount .tutor-settings{
          padding:11px 12px;
          border-radius:14px;
        }
        #tutorMount .tutor-settings > h3{display:none;}
        #tutorMount .tutor-mobile-settings-toggle{
          display:grid;
          grid-template-columns:minmax(0,1fr) auto;
          grid-template-areas:"title action" "summary action";
          gap:2px 10px;
          width:100%;
          padding:0;
          border:0;
          background:transparent;
          color:inherit;
          text-align:left;
          font:inherit;
          cursor:pointer;
        }
        #tutorMount .tutor-mobile-settings-title{
          grid-area:title;
          font-size:.9rem;
          font-weight:800;
          color:#1f2937;
        }
        #tutorMount .tutor-mobile-settings-summary{
          grid-area:summary;
          min-width:0;
          margin-top:3px;
          color:#64748b;
          font-size:.73rem;
          line-height:1.35;
          overflow-wrap:anywhere;
        }
        #tutorMount .tutor-mobile-settings-action{
          grid-area:action;
          align-self:center;
          white-space:nowrap;
          padding:6px 8px;
          border:1px solid #dbeafe;
          border-radius:8px;
          background:#f8fbff;
          color:#2563a8;
          font-size:.69rem;
          font-weight:750;
        }
        #tutorMount .tutor-settings:not(.mobile-settings-open) > .tutor-field,
        #tutorMount .tutor-settings:not(.mobile-settings-open) > .tutor-consent,
        #tutorMount .tutor-settings:not(.mobile-settings-open) > .tutor-mode,
        #tutorMount .tutor-settings:not(.mobile-settings-open) > .tutor-access,
        #tutorMount .tutor-settings:not(.mobile-settings-open) > .tutor-context,
        #tutorMount .tutor-settings:not(.mobile-settings-open) > .tutor-warning,
        #tutorMount .tutor-settings:not(.mobile-settings-open) > .tutor-mobile-details{
          display:none !important;
        }
        #tutorMount .tutor-settings.mobile-settings-open .tutor-mobile-settings-toggle{
          margin-bottom:10px;
          padding-bottom:9px;
          border-bottom:1px solid #e5e7eb;
        }
        #tutorMount .tutor-field{margin-bottom:9px;gap:4px;}
        #tutorMount .tutor-field > span{font-size:.69rem;}
        #tutorMount .tutor-field select{padding:8px 9px;font-size:.82rem;}
        #tutorMount .tutor-consent{margin-bottom:9px;padding:8px 9px;font-size:.72rem;}
        #tutorMount .tutor-mode{display:none !important;}
        #tutorMount .tutor-context,
        #tutorMount .tutor-warning{display:none !important;}
        #tutorMount .tutor-access{
          margin-top:7px;
          padding:8px 9px;
          border-radius:9px;
          font-size:.72rem;
          line-height:1.35;
        }
        #tutorMount .tutor-access strong{display:inline;}
        #tutorMount .tutor-access strong::after{content:" ";}
        #tutorMount .tutor-access br{display:none;}

        #tutorMount .tutor-mobile-details{
          display:block;
          margin-top:7px;
          border:1px solid #dbe3ee;
          border-radius:9px;
          background:#fff;
          overflow:hidden;
        }
        #tutorMount .tutor-mobile-details > summary{
          list-style:none;
          cursor:pointer;
          padding:8px 9px;
          font-size:.72rem;
          font-weight:750;
          color:#475569;
          background:#f8fafc;
        }
        #tutorMount .tutor-mobile-details > summary::-webkit-details-marker{display:none;}
        #tutorMount .tutor-mobile-details > summary::after{
          content:"▾";
          float:right;
          margin-left:8px;
          color:#64748b;
        }
        #tutorMount .tutor-mobile-details[open] > summary::after{content:"▴";}
        #tutorMount .tutor-mobile-details[open] > summary{border-bottom:1px solid #e2e8f0;}
        #tutorMount .tutor-mobile-details__body{padding:9px;}
        #tutorMount .tutor-mobile-details__context{font-size:.72rem;line-height:1.4;color:#475569;}
        #tutorMount .tutor-mobile-details__context a{overflow-wrap:anywhere;}
        #tutorMount .tutor-mobile-details__warning{
          margin-top:8px;
          padding:7px 8px;
          border-radius:8px;
          background:#fff7ed;
          color:#9a3412;
          font-size:.69rem;
          line-height:1.38;
        }

        /* Chat becomes the main visual destination instead of a tall empty box. */
        #tutorMount .tutor-chat{min-height:0;border-radius:14px;}
        #tutorMount .tutor-chat__header{padding:11px 12px;align-items:center;}
        #tutorMount .tutor-chat__header strong{font-size:.9rem;}
        #tutorMount .tutor-chat__header span{font-size:.66rem;}
        #tutorMount #tutorNewChat{padding:7px 9px;font-size:.7rem;white-space:nowrap;}
        #tutorMount .tutor-messages{
          min-height:180px;
          max-height:420px;
          padding:12px;
        }
        #tutorMount .tutor-empty{
          margin:38px auto 0;
          padding:0 4px;
          font-size:.8rem;
          line-height:1.45;
        }
        #tutorMount .tutor-bubble{max-width:92%;font-size:.84rem;}
        #tutorMount .tutor-composer{padding:9px;}
        #tutorMount .tutor-composer textarea{
          min-height:70px;
          resize:none;
          font-size:16px;
        }
        #tutorMount .tutor-voice-hint{font-size:.67rem;line-height:1.3;margin-top:5px;}
        #tutorMount .tutor-composer__bottom{gap:6px;margin-top:6px;}
        #tutorMount .tutor-composer__bottom .tutor-btn{min-height:40px;padding:7px 9px;font-size:.72rem;}
        #tutorMount .tutor-auto-speak{font-size:.69rem;margin-top:5px;min-height:30px;}

        /* Secondary study tools: keep the actions, remove repeated explanatory bulk. */
        #tutorMount .tutor-flashcards,
        #tutorMount .tutor-study-tools{
          margin:10px 10px 0;
          padding:10px;
          border-radius:11px;
        }
        #tutorMount .tutor-flashcards__title,
        #tutorMount .tutor-study-tools__title{font-size:.84rem;margin-bottom:2px;}
        #tutorMount .tutor-flashcards__intro,
        #tutorMount .tutor-study-tools__intro{font-size:.71rem;line-height:1.35;}
        #tutorMount .tutor-flashcards__cost,
        #tutorMount .tutor-study-tools__usage{display:none;}
        #tutorMount .tutor-flashcards__actions,
        #tutorMount .tutor-study-tools__actions{margin-top:7px;gap:6px;}
        #tutorMount .tutor-flashcards__actions .tutor-flashcards__btn,
        #tutorMount .tutor-study-tools__actions .tutor-study-tools__btn{
          min-height:39px;
          padding:7px 9px;
          font-size:.72rem;
        }
        #tutorMount .tutor-flashcards__status,
        #tutorMount .tutor-study-tools__status{
          min-height:0;
          margin-top:5px;
          font-size:.69rem;
        }
        #tutorMount .tutor-flashcards__status:empty,
        #tutorMount .tutor-study-tools__status:empty{display:none;}
        #tutorMount .tutor-flashcards__deck,
        #tutorMount .tutor-study-tools__result{margin-top:8px;padding-top:8px;}

        /* Lighter footer on long mobile tutor pages. */
        body.tutor-mobile-active .site-footer{padding:18px 0 16px;}
        body.tutor-mobile-active .site-footer p{font-size:.72rem;line-height:1.42;margin-bottom:6px;}
        body.tutor-mobile-active .site-footer__last-checked,
        body.tutor-mobile-active .site-footer__credit,
        body.tutor-mobile-active .site-footer__legal{font-size:.68rem !important;}
      }
    `;
    document.head.appendChild(style);
  }

  function selectedText(id) {
    const el = document.getElementById(id);
    if (!el) return "";
    return el.selectedOptions?.[0]?.textContent?.trim() || "";
  }

  function settingsSummary() {
    const parts = [];
    const age = selectedText("tutorAge");
    const grade = selectedText("tutorGrade");
    const subject = selectedText("tutorSubject");
    const topic = selectedText("tutorTopic");
    if (age && !/διάλεξε|choose/i.test(age)) parts.push(age);
    if (grade) parts.push(grade);
    if (subject) parts.push(subject);
    if (topic) parts.push(topic);
    return parts.length ? parts.join(" · ") : tr("notSelected");
  }

  function settingsAreReady(settings) {
    const age = document.getElementById("tutorAge");
    const consent = document.getElementById("tutorConsent");
    const access = document.getElementById("tutorAccessGate");
    if (age && !age.value) return false;
    if (age?.value === "13-14" && consent && !consent.checked) return false;
    if (access && !access.classList.contains("tutor-access--good")) return false;
    return true;
  }

  function syncSettingsToggle(settings) {
    const btn = settings?.querySelector(".tutor-mobile-settings-toggle");
    if (!btn) return;
    const summary = btn.querySelector(".tutor-mobile-settings-summary");
    const action = btn.querySelector(".tutor-mobile-settings-action");
    if (summary) summary.textContent = settingsSummary();
    if (action) action.textContent = settings.classList.contains("mobile-settings-open") ? tr("close") : tr("edit");
    btn.setAttribute("aria-expanded", settings.classList.contains("mobile-settings-open") ? "true" : "false");
  }

  function makeSettingsToggle(settings) {
    let btn = settings.querySelector(".tutor-mobile-settings-toggle");
    if (btn) return btn;
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tutor-mobile-settings-toggle";
    btn.innerHTML = `
      <span class="tutor-mobile-settings-title"></span>
      <span class="tutor-mobile-settings-summary"></span>
      <span class="tutor-mobile-settings-action"></span>`;
    btn.querySelector(".tutor-mobile-settings-title").textContent = tr("settings");
    btn.addEventListener("click", () => {
      settings.classList.toggle("mobile-settings-open");
      syncSettingsToggle(settings);
    });
    settings.prepend(btn);
    return btn;
  }

  function syncDetails(details) {
    if (!details) return;
    const summary = details.querySelector("summary");
    const mobileContext = details.querySelector(".tutor-mobile-details__context");
    const mobileWarning = details.querySelector(".tutor-mobile-details__warning");
    const sourceContext = document.getElementById("tutorContextBox");
    const sourceWarning = document.querySelector("#tutorMount .tutor-settings .tutor-warning");

    if (summary) summary.textContent = tr("info");
    if (mobileContext && sourceContext) mobileContext.innerHTML = sourceContext.innerHTML;
    if (mobileWarning && sourceWarning) mobileWarning.textContent = sourceWarning.textContent.trim();
  }

  function makeMobileDetails(settings) {
    let details = settings.querySelector(".tutor-mobile-details");
    if (details) return details;

    details = document.createElement("details");
    details.className = "tutor-mobile-details";

    const summary = document.createElement("summary");
    summary.textContent = tr("info");

    const body = document.createElement("div");
    body.className = "tutor-mobile-details__body";

    const mobileContext = document.createElement("div");
    mobileContext.className = "tutor-mobile-details__context";

    const mobileWarning = document.createElement("div");
    mobileWarning.className = "tutor-mobile-details__warning";

    body.append(mobileContext, mobileWarning);
    details.append(summary, body);

    const access = document.getElementById("tutorAccessGate");
    if (access) access.insertAdjacentElement("afterend", details);
    else settings.appendChild(details);
    return details;
  }

  function makeAuthToggle(authCard) {
    let btn = authCard.querySelector(".tutor-mobile-auth-more");
    if (btn) return btn;
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tutor-mobile-auth-more";
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = tr("authMore");
    const status = authCard.querySelector(".tutor-auth-status");
    (status || authCard).insertAdjacentElement(status ? "afterend" : "beforeend", btn);
    btn.addEventListener("click", () => {
      const open = authCard.classList.toggle("mobile-details-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? tr("authLess") : tr("authMore");
    });
    return btn;
  }

  function bindField(el, settings, details) {
    if (!el || el.dataset.mobileCompactBound === "1") return;
    el.dataset.mobileCompactBound = "1";
    el.addEventListener("change", () => {
      setTimeout(() => {
        syncDetails(details);
        syncSettingsToggle(settings);
        if (settingsAreReady(settings)) {
          settings.classList.remove("mobile-settings-open");
          syncSettingsToggle(settings);
        } else {
          settings.classList.add("mobile-settings-open");
          syncSettingsToggle(settings);
        }
      }, 0);
    });
  }

  function installMobileCompact() {
    injectStyles();
    syncRouteClass();
    if (!isMobile()) return;

    const root = document.getElementById("tutorMount");
    if (!root) return;

    const authCard = root.querySelector(".tutor-auth-card");
    if (authCard) {
      const authToggle = makeAuthToggle(authCard);
      authToggle.textContent = authCard.classList.contains("mobile-details-open") ? tr("authLess") : tr("authMore");
    }

    const settings = root.querySelector(".tutor-settings");
    if (!settings) return;

    const details = makeMobileDetails(settings);
    makeSettingsToggle(settings);
    syncDetails(details);

    if (!settings.dataset.mobileCompactInitialised) {
      settings.dataset.mobileCompactInitialised = "1";
      settings.classList.toggle("mobile-settings-open", !settingsAreReady(settings));
    }
    syncSettingsToggle(settings);

    ["tutorGrade", "tutorSubject", "tutorTopic", "tutorAge", "tutorConsent"].forEach((id) => {
      bindField(document.getElementById(id), settings, details);
    });
  }

  function scheduleSync() {
    setTimeout(() => {
      syncRouteClass();
      installMobileCompact();
    }, 0);
  }

  if (!window.__aitools4kidsMobileCompactGlobalBound) {
    window.__aitools4kidsMobileCompactGlobalBound = true;
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("#langEl, #langEn, .view-tab, .role-tab, #backToZones")) scheduleSync();
    });
    window.addEventListener("popstate", scheduleSync);
    window.matchMedia?.(MQ).addEventListener?.("change", scheduleSync);
  }

  document.addEventListener(RENDER_EVENT, installMobileCompact);
  installMobileCompact();
})();