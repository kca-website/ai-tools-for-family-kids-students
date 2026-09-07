/** Homepage/shared refinements: accessible resources, Practice Map copy, curriculum discovery. */
(function(){
  "use strict";

  function isEnglish(){
    return !!document.getElementById("langEn")?.classList.contains("active");
  }

  function setText(selector, text){
    const el = document.querySelector(selector);
    if (el && el.textContent !== text) el.textContent = text;
  }

  function refinePracticeMapCopy(en){
    const heroTitle = en ? "Practice Map in 2 minutes" : "Χάρτης Εξάσκησης σε 2 λεπτά";
    const heroSub = en
      ? "A few short questions to spot what may be worth practising more. No grade and no diagnosis — just a starting point for the next Learning Path."
      : "Λίγες σύντομες ερωτήσεις για να δεις ποια σημεία αξίζει να εξασκήσεις περισσότερο. Χωρίς βαθμό και χωρίς διάγνωση — μόνο ένα σημείο εκκίνησης για το επόμενο Μονοπάτι Μάθησης.";

    setText('[data-i18n="heroQuizCta"]', heroTitle);
    setText('[data-i18n="heroQuizCtaSub"]', heroSub);
    setText('#viewTabQuiz', en ? "Practice Map" : "Χάρτης Εξάσκησης");

    const privacy = document.querySelector('[data-i18n="badgeZeroTrackingExplainer"]');
    if (privacy) {
      privacy.textContent = en
        ? "The guide, tool directory and Practice Map use no cookies and require no account. Practice Map progress may be stored only on your device. Only the optional AI Help feature uses Puter; if you choose to sign in, Puter’s own terms and privacy policy apply."
        : "Ο οδηγός, τα εργαλεία και ο Χάρτης Εξάσκησης δεν χρησιμοποιούν cookies ούτε απαιτούν λογαριασμό. Η πρόοδος του Χάρτη μπορεί να αποθηκευτεί μόνο τοπικά στη συσκευή σου. Μόνο η προαιρετική AI Βοήθεια χρησιμοποιεί Puter: όταν επιλέξεις να συνδεθείς, ισχύουν οι όροι και η πολιτική απορρήτου του Puter.";
    }

    const start = document.getElementById("startHereGuide");
    if (start) {
      const title = start.querySelector("div > div:first-child");
      const text = start.querySelector("div > div:nth-child(2)");
      const cta = start.querySelector("a");
      if (title) title.textContent = en ? "Not sure where to start?" : "Δεν ξέρεις από πού να ξεκινήσεις;";
      if (text) text.textContent = en
        ? "Start with the 2-minute Practice Map. It highlights what may be worth practising and then leads you to the relevant Learning Path."
        : "Ξεκίνα με τον Χάρτη Εξάσκησης των 2 λεπτών. Θα σου δείξει τι μπορεί να αξίζει περισσότερη εξάσκηση και μετά θα σε οδηγήσει στο αντίστοιχο Μονοπάτι Μάθησης.";
      if (cta) cta.textContent = en ? "Open the Practice Map →" : "Άνοιξε τον Χάρτη Εξάσκησης →";
    }

    const roleGuide = document.getElementById("roleContextGuide");
    if (roleGuide) {
      roleGuide.innerHTML = roleGuide.innerHTML
        .replace(/Diagnostic Map/g, "Practice Map")
        .replace(/Διαγνωστικός Χάρτης/g, "Χάρτης Εξάσκησης");
    }

    const disclaimer = document.querySelector(".quiz-formative-disclaimer");
    if (disclaimer) {
      disclaimer.textContent = en
        ? "The Practice Map is a practice and self-assessment tool. It is not an official school grade, a diagnosis of a learning difficulty, an assessment of the learner’s ability, or a decision about their educational path."
        : "Ο Χάρτης Εξάσκησης είναι εργαλείο εξάσκησης και αυτοαξιολόγησης. Δεν αποτελεί σχολική βαθμολόγηση, διάγνωση μαθησιακής δυσκολίας, αξιολόγηση της ικανότητας του μαθητή ή απόφαση για την εκπαιδευτική του πορεία.";
    }

    const flow = document.querySelector(".quiz-path-flow-note");
    if (flow) {
      flow.textContent = en
        ? "What happens next: the Practice Map highlights an area that may need practice. Open its Learning Path for the practical 3-step route: activity, guided tool use and an understanding check."
        : "Τι γίνεται μετά: ο Χάρτης Εξάσκησης εντοπίζει ένα σημείο που μπορεί να θέλει εξάσκηση. Άνοιξε το Μονοπάτι Μάθησης αυτού του θέματος για την πρακτική διαδρομή 3 βημάτων: δραστηριότητα, καθοδηγούμενη χρήση εργαλείου και έλεγχο κατανόησης.";
    }

    document.querySelectorAll(".quiz-perfect-enrichment").forEach((panel)=>{
      panel.innerHTML = panel.innerHTML
        .replace(/Diagnostic Map/g, "Practice Map")
        .replace(/Διαγνωστικό/g, "Χάρτη Εξάσκησης");
    });
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

    refinePracticeMapCopy(en);
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