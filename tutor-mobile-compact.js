/**
 * tutor-mobile-compact.js
 * Mobile-only compact layout for AI Help.
 * Desktop remains unchanged.
 * No MutationObserver, polling or AI calls.
 */
(function () {
  "use strict";

  const STYLE_ID = "aitools4kidsTutorMobileCompactStyles";

  const LABELS = {
    el: "ℹ️ Πληροφορίες μαθήματος & πηγές",
    en: "ℹ️ Lesson information & sources",
  };

  function isEnglish() {
    return !!document.getElementById("langEn")?.classList.contains("active") ||
      (document.documentElement.lang || "").toLowerCase().startsWith("en");
  }

  function label() {
    return isEnglish() ? LABELS.en : LABELS.el;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .tutor-mobile-details{display:none;}

      @media (max-width:700px){
        #tutorMount .tutor-settings > h3{display:none;}
        #tutorMount .tutor-mode{display:none !important;}
        #tutorMount .tutor-context,
        #tutorMount .tutor-warning{display:none !important;}

        #tutorMount .tutor-access{
          margin-top:8px;
          padding:9px 11px;
          border-radius:10px;
          font-size:.78rem;
          line-height:1.35;
        }
        #tutorMount .tutor-access strong{display:inline;}
        #tutorMount .tutor-access strong::after{content:" ";}
        #tutorMount .tutor-access br{display:none;}

        #tutorMount .tutor-mobile-details{
          display:block;
          margin-top:8px;
          border:1px solid #dbe3ee;
          border-radius:10px;
          background:#fff;
          overflow:hidden;
        }
        #tutorMount .tutor-mobile-details > summary{
          list-style:none;
          cursor:pointer;
          padding:10px 11px;
          font-size:.78rem;
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
        #tutorMount .tutor-mobile-details__body{padding:10px 11px;}
        #tutorMount .tutor-mobile-details__context{
          font-size:.77rem;
          line-height:1.45;
          color:#475569;
        }
        #tutorMount .tutor-mobile-details__context a{overflow-wrap:anywhere;}
        #tutorMount .tutor-mobile-details__warning{
          margin-top:10px;
          padding:8px 9px;
          border-radius:9px;
          background:#fff7ed;
          color:#9a3412;
          font-size:.74rem;
          line-height:1.4;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function syncDetails(details) {
    if (!details) return;
    const summary = details.querySelector("summary");
    const mobileContext = details.querySelector(".tutor-mobile-details__context");
    const mobileWarning = details.querySelector(".tutor-mobile-details__warning");
    const sourceContext = document.getElementById("tutorContextBox");
    const sourceWarning = document.querySelector("#tutorMount .tutor-settings .tutor-warning");

    if (summary) summary.textContent = label();
    if (mobileContext && sourceContext) mobileContext.innerHTML = sourceContext.innerHTML;
    if (mobileWarning && sourceWarning) mobileWarning.textContent = sourceWarning.textContent.trim();
  }

  function bindField(el, details) {
    if (!el || el.dataset.mobileCompactBound === "1") return;
    el.dataset.mobileCompactBound = "1";
    el.addEventListener("change", () => setTimeout(() => syncDetails(details), 0));
  }

  function installMobileCompact() {
    injectStyles();
    const settings = document.querySelector("#tutorMount .tutor-settings");
    if (!settings) return;

    let details = settings.querySelector(".tutor-mobile-details");
    if (!details) {
      details = document.createElement("details");
      details.className = "tutor-mobile-details";

      const summary = document.createElement("summary");
      summary.textContent = label();

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
    }

    syncDetails(details);
    ["tutorGrade", "tutorSubject", "tutorTopic", "tutorAge", "tutorConsent"].forEach((id) => {
      bindField(document.getElementById(id), details);
    });
  }

  function wrapTutorRender() {
    if (!window.AITutor?.render || window.AITutor.__mobileCompactWrapped) return;
    const original = window.AITutor.render.bind(window.AITutor);
    window.AITutor.render = function (context) {
      const result = original(context);
      installMobileCompact();
      return result;
    };
    window.AITutor.__mobileCompactWrapped = true;
  }

  if (!window.__aitools4kidsMobileCompactLangBound) {
    window.__aitools4kidsMobileCompactLangBound = true;
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("#langEl, #langEn")) setTimeout(installMobileCompact, 0);
    });
  }

  wrapTutorRender();
  installMobileCompact();
})();