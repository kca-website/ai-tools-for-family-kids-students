/** Homepage/shared refinements: accessible resources and curriculum discovery. */
(function(){
  "use strict";

  function isEnglish(){
    return !!document.getElementById("langEn")?.classList.contains("active");
  }

  function ensureCurriculumMapEntry(en){
    const zoneGrid = document.getElementById("zoneGrid");
    if (!zoneGrid) return;

    let row = document.getElementById("curriculumMapFeature");
    if (!row) {
      row = document.createElement("a");
      row.id = "curriculumMapFeature";
      row.href = "/xartis-ylis.html";
      row.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 18px;padding:12px 14px;border:1px solid #d7e3dc;border-radius:12px;background:#f7fbf8;color:#24352d;text-decoration:none;line-height:1.4;";
      zoneGrid.insertAdjacentElement("beforebegin", row);
    }

    const title = en ? "Greek Curriculum Map 2026–27" : "Ελληνικός Χάρτης Ύλης 2026–27";
    const text = en
      ? "See the official books, sources and verification level behind the mapped school topics."
      : "Δες τα επίσημα βιβλία, τις πηγές και το επίπεδο επαλήθευσης πίσω από τα χαρτογραφημένα σχολικά θέματα.";
    const cta = en ? "Open →" : "Άνοιγμα →";
    const signature = [en,title,text].join("|");
    if (row.dataset.signature === signature) return;
    row.dataset.signature = signature;
    row.innerHTML = `<span style="min-width:0;"><strong style="display:block;font-size:.93rem;margin-bottom:2px;">📚 ${title}</strong><span style="display:block;color:#52645a;font-size:.83rem;">${text}</span></span><strong style="white-space:nowrap;color:#2e6f5e;font-size:.86rem;">${cta}</strong>`;
  }

  function refine(){
    const en = isEnglish();
    const subtitle = document.querySelector('[data-i18n="heroSubtitle"]');

    if (subtitle) {
      subtitle.textContent = en
        ? "See where practice is needed, find the right AI tool, and learn how to use it effectively. Practice Map, personalized learning paths, guided AI Help and accessible educational resources for students aged 6–18, parents and educators."
        : "Δες πού χρειάζεται εξάσκηση, βρες το κατάλληλο AI εργαλείο και μάθε πώς να το χρησιμοποιείς σωστά. Χάρτης Εξάσκησης, εξατομικευμένα learning paths, AI Βοήθεια και προσβάσιμο εκπαιδευτικό υλικό για μαθητές 6–18, γονείς και εκπαιδευτικούς.";
    }

    ensureCurriculumMapEntry(en);

    const badges = document.querySelector(".hero__badges");
    if (badges && !document.getElementById("heroGslBadge")) {
      const badge = document.createElement("span");
      badge.id = "heroGslBadge";
      badge.className = "badge badge--accent";
      const privacy = badges.querySelector(".privacy-badge-details");
      if (privacy) badges.insertBefore(badge, privacy);
      else badges.appendChild(badge);
    }

    const gslBadge = document.getElementById("heroGslBadge");
    if (gslBadge) gslBadge.textContent = en ? "Accessible GSL resources" : "Προσβάσιμο υλικό ΕΝΓ";

    const helpActions = document.querySelector(".hero__ai-help-actions");
    if (helpActions) {
      let special = document.getElementById("heroHelpSpecialEducation");
      if (!special) {
        special = document.createElement("a");
        special.id = "heroHelpSpecialEducation";
        special.href = "/special-education.html";
        helpActions.appendChild(special);
      }
      special.innerHTML = `<span aria-hidden="true">🏫</span><span>${en ? "Special Education" : "Ειδική Εκπαίδευση"}</span>`;
      special.setAttribute("aria-label", en ? "Special Education: choose school type and AI Help" : "Ειδική Εκπαίδευση: επιλογή σχολείου και AI Βοήθειας");
    }

    const panel = document.getElementById("signLanguageFeature");
    if (panel) {
      const title = en ? "🤟 School concepts in Greek Sign Language (GSL)" : "🤟 Έννοιες στην Ελληνική Νοηματική Γλώσσα";
      const text = en
        ? "153 school concepts organized by subject and grade, with simple explanations, educational visuals and direct official GSL videos from IEP."
        : "153 σχολικές έννοιες οργανωμένες ανά μάθημα και τάξη, με απλή εξήγηση, εκπαιδευτική εικόνα και απευθείας επίσημο βίντεο ΕΝΓ από το ΙΕΠ.";
      const cta = en ? "Explore the 153 concepts →" : "Δες τις 153 έννοιες →";
      const signature = [en, title, text, cta].join("|");

      if (panel.dataset.gslSignature !== signature) {
        panel.dataset.gslSignature = signature;
        panel.innerHTML = `<div style="min-width:min(100%,520px);flex:1;"><div style="font-family:var(--font-heading);font-weight:800;font-size:1.08rem;color:#1f2937;margin-bottom:5px;">${title}</div><div style="font-size:.9rem;line-height:1.5;color:#475569;max-width:720px;">${text}</div></div><a href="/sign-language.html" style="display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:10px 15px;border-radius:10px;background:#2e6ba3;color:#fff;text-decoration:none;font-weight:800;white-space:nowrap;">${cta}</a>`;
      }
    }

    const description = en
      ? "Free bilingual learning guide for students 6–18, parents and educators: Practice Map, learning paths, AI tool recommendations, guided AI Help, Greek curriculum mapping and accessible educational resources."
      : "Δωρεάν δίγλωσσος οδηγός μάθησης για μαθητές 6–18, γονείς και εκπαιδευτικούς: Χάρτης Εξάσκησης, learning paths, προτάσεις AI εργαλείων, καθοδηγούμενη AI Βοήθεια, Ελληνικός Χάρτης Ύλης και προσβάσιμο εκπαιδευτικό υλικό.";

    const meta = document.querySelector('meta[name="description"]');
    const og = document.querySelector('meta[property="og:description"]');
    const twitter = document.querySelector('meta[name="twitter:description"]');
    if (meta) meta.content = description;
    if (og) og.content = description;
    if (twitter) twitter.content = description;
  }

  function scheduleRefine(){
    [0, 40, 180, 500].forEach(ms => setTimeout(refine, ms));
  }

  scheduleRefine();
  document.addEventListener("DOMContentLoaded", scheduleRefine);
  document.getElementById("langEl")?.addEventListener("click", scheduleRefine);
  document.getElementById("langEn")?.addEventListener("click", scheduleRefine);
  window.addEventListener("popstate", scheduleRefine);
  document.addEventListener("click", (event)=>{
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest(".zone-card, #roleTabs .role-tab, #viewTabQuiz, #backToZones, #heroQuizCtaBtn, .hero__quiz-picker-btn")) {
      scheduleRefine();
    }
  });
})();