/** September 2026 tool audit + compact Tool Nutrition Labels. No DOM observers or polling. */
(function(){
  "use strict";
  if (typeof TOOLS === "undefined") return;

  const DATE = "2026-09-05";
  const DATE_EL = "5 Σεπτεμβρίου 2026";
  const DATE_EN = "5 September 2026";

  function patch(id, data){
    if (!TOOLS[id]) return;
    Object.assign(TOOLS[id], data || {}, {
      lastReviewed: DATE,
      lastReviewedEl: DATE_EL,
      lastReviewedEn: DATE_EN
    });
  }

  patch("photomath", {minAge:13, minAgeNote:"13+. Κάτω των 13 η χρήση απαγορεύεται. Για ανήλικο χρήστη απαιτείται άδεια γονέα ή νόμιμου κηδεμόνα όπου προβλέπεται.", auditSource:"https://photomath.com/terms/"});
  patch("miro-ai", {minAge:16, minAgeNote:"16+. Οι τρέχοντες Όροι Χρήσης της Miro δεν επιτρέπουν χρήση από άτομα κάτω των 16 ετών.", auditSource:"https://miro.com/legal/terms-of-service/"});
  patch("symbolab", {minAge:16, minAgeNote:"Στον ΕΟΧ/ΕΕ και στο Ηνωμένο Βασίλειο: 16+. Για την Ελλάδα χρησιμοποιούμε το όριο του ΕΟΧ.", auditSource:"https://www.symbolab.com/terms-of-use"});
  patch("scite", {minAge:13, minAgeNote:"13+. Η χρήση από άτομα κάτω των 13 ετών απαγορεύεται από τους Όρους του Scite.", auditSource:"https://scite.ai/terms"});
  patch("elicit", {minAge:13, minAgeNote:"13+ για άμεση χρήση. Για ανηλίκους εξακολουθούν να ισχύουν οι τοπικοί κανόνες και η γονική επίβλεψη όπου απαιτείται.", auditSource:"https://elicit.com/operations/terms"});
  patch("replit-ai", {minAge:13, minAgeNote:"13+. Κάτω των 18 απαιτείται άδεια γονέα ή κηδεμόνα σύμφωνα με τους τρέχοντες Όρους της Replit.", auditSource:"https://replit.com/terms-of-service"});
  patch("grammarly", {minAge:16, minAgeNote:"Για προσωπικό λογαριασμό στην ΕΕ χρησιμοποιούμε 16+ ως ασφαλές όριο. Διαχειριζόμενοι λογαριασμοί Education ακολουθούν την πολιτική του οργανισμού/σχολείου.", auditSource:"https://www.grammarly.com/terms"});
  patch("canva-magic", {minAge:15, minAgeNote:"Για προσωπική χρήση στην Ελλάδα χρησιμοποιούμε 15+. Για μικρότερες ηλικίες υπάρχει ξεχωριστή σχολική διαδρομή Canva Education με επίβλεψη.", auditSource:"https://www.canva.com/el_gr/politikes/terms-of-use/"});
  patch("github-copilot", {minAge:15, minAgeNote:"Για προσωπικό λογαριασμό στην Ελλάδα χρησιμοποιούμε 15+ ως ασφαλές όριο, λαμβάνοντας υπόψη και το τοπικό όριο ψηφιακής συγκατάθεσης.", auditSource:"https://docs.github.com/en/site-policy/github-terms/github-terms-of-service"});
  patch("quizlet", {minAge:13, minAgeNote:"Το Quizlet απευθύνεται κυρίως σε χρήστες 13+, με περιορισμένη εμπειρία/πρόσθετες δικλείδες για μικρότερους χρήστες όπου προβλέπεται.", auditSource:"https://quizlet.com/tos"});
  patch("magicschool", {minAge:18, minAgeNote:"Ο προσωπικός λογαριασμός εκπαιδευτικού είναι 18+. Οι μαθητές χρησιμοποιούν MagicStudent μόνο σε σχολικά/εκπαιδευτικά διαχειριζόμενο περιβάλλον.", auditSource:"https://www.magicschool.ai/privacy-security/student-data-policy"});
  patch("erla", {minAge:13, minAgeNote:"13+ ή το μεγαλύτερο νόμιμο όριο της χώρας.", auditSource:"https://erla.app/terms"});
  patch("elements-of-ai", {minAge:13, minAgeNote:"13+ με επαληθεύσιμη γονική/κηδεμονική συναίνεση όταν ο χρήστης είναι κάτω των 18.", auditSource:"https://community.elementsofai.com/terms"});
  patch("claude-academy", {minAge:15, minAgeNote:"Το 15+ εδώ είναι παιδαγωγική σύσταση για το εκπαιδευτικό περιεχόμενο της Academy. Το Claude.ai παραμένει 18+.", auditSource:"https://academy.claude.com/"});
  patch("chatgpt-edu", {minAge:15, pending:false, minAgeNote:"Στην Ελλάδα αφορά σχολικό πιλοτικό πρόγραμμα σε επιλεγμένα λύκεια και πρόσβαση μέσω συμμετέχουσας σχολικής μονάδας.", auditSource:"https://edugpt.sch.gr/features.php"});
  patch("khan-academy-kids", {minAge:2, minAgeNote:"Σχεδιασμένο επίσημα για παιδιά 2–8 ετών. Δεν είναι γενικός generative-AI chatbot.", auditSource:"https://learn.khanacademy.org/khan-academy-kids/"});

  ["chatgpt","gemini","notebooklm","copilot","claude","perplexity","phet","google-arts-culture","gemini-education","ai-help"].forEach((id)=>patch(id, {}));

  function language(){
    return document.documentElement.lang === "en" ? "en" : "el";
  }

  function textFor(tool){
    return [tool.name, tool.minAgeNote, tool.shortDescEl, tool.shortDescEn, tool.greekTips]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("el-GR");
  }

  function hasAny(text, terms){
    return terms.some((term) => text.includes(term));
  }

  function unknown(lang){
    return lang === "el" ? "Δεν έχει επιβεβαιωθεί" : "Not yet verified";
  }

  function greekFact(tool, lang){
    const text = textFor(tool);
    if (tool.isGreek || /\(ελληνικά\)/i.test(tool.name || "")) {
      return lang === "el" ? "Ελληνικό / Ελληνικά" : "Greek / Greek-language";
    }
    if (hasAny(text, ["μόνο στα αγγλικά", "μόνο σε αγγλικό κείμενο", "χωρίς επιλογή ελληνικών", "does not support greek", "english only"])) {
      return lang === "el" ? "Μόνο αγγλικά" : "English only";
    }
    if (hasAny(text, ["υποστηρίζει ελληνικά", "ελληνική διεπαφή", "ελληνικής γλώσσας", "στα ελληνικά", "greek interface", "supports greek"])) {
      return lang === "el" ? "Υποστήριξη Ελληνικών" : "Greek supported";
    }
    return unknown(lang);
  }

  function costFact(tool, lang){
    const text = textFor(tool);
    const free = hasAny(text, ["δωρεάν", "free"]);
    const paid = hasAny(text, ["επί πληρωμή", "συνδρομή", "subscription", "paid plan", "premium"]);
    if (free && paid) return lang === "el" ? "Δωρεάν + επί πληρωμή επιλογές" : "Free + paid options";
    if (free) return lang === "el" ? "Δωρεάν / υπάρχει δωρεάν χρήση" : "Free / free use available";
    if (paid) return lang === "el" ? "Επί πληρωμή" : "Paid";
    return unknown(lang);
  }

  function accountFact(tool, lang){
    const text = textFor(tool);
    if (hasAny(text, ["χωρίς λογαριασμό", "δεν χρειάζεται λογαριασμό", "no account", "without an account"])) {
      return lang === "el" ? "Χωρίς λογαριασμό για βασική χρήση" : "No account for basic use";
    }
    if (hasAny(text, ["απαιτεί λογαριασμό", "μέσω σχολικού λογαριασμού", "requires an account", "requires account"])) {
      return lang === "el" ? "Απαιτεί λογαριασμό" : "Account required";
    }
    return unknown(lang);
  }

  function accessibilityFact(tool, lang){
    const info = typeof ACCESSIBILITY_INFO !== "undefined" ? ACCESSIBILITY_INFO[tool.id] : null;
    if (!info) return unknown(lang);
    const labels = {
      good: lang === "el" ? "Τεκμηριωμένη υποστήριξη" : "Documented support",
      partial: lang === "el" ? "Μερική / μεικτή τεκμηρίωση" : "Partial / mixed evidence",
      caution: lang === "el" ? "Τεκμηριωμένη ανησυχία" : "Documented concern",
      none: lang === "el" ? "Δεν βρέθηκε τεκμηρίωση" : "No evidence found"
    };
    return labels[info.status] || unknown(lang);
  }

  function ensureStyles(){
    if (document.getElementById("toolNutritionStyles")) return;
    const style = document.createElement("style");
    style.id = "toolNutritionStyles";
    style.textContent = `
      .tool-card__nutrition{margin:12px 0 4px;border:1px solid #DCE4EE;border-radius:10px;background:#F8FAFC;overflow:hidden}
      .tool-card__nutrition summary{cursor:pointer;list-style:none;padding:9px 11px;font-size:.78rem;font-weight:800;color:#243447;display:flex;align-items:center;gap:6px;min-height:40px}
      .tool-card__nutrition summary::-webkit-details-marker{display:none}
      .tool-card__nutrition summary::after{content:"+";margin-left:auto;font-size:1rem;line-height:1}
      .tool-card__nutrition[open] summary::after{content:"−"}
      .tool-card__nutrition summary:focus-visible{outline:3px solid #174A72;outline-offset:-3px}
      .tool-card__nutrition-grid{display:grid;grid-template-columns:minmax(110px,.8fr) minmax(0,1.2fr);margin:0;padding:0 11px 10px;gap:0}
      .tool-card__nutrition-row{display:contents}
      .tool-card__nutrition-key,.tool-card__nutrition-value{margin:0;padding:6px 0;border-top:1px solid #E5EAF0;font-size:.76rem;line-height:1.35}
      .tool-card__nutrition-key{font-weight:800;color:#334155;padding-right:10px}
      .tool-card__nutrition-value{color:#475569;overflow-wrap:anywhere}
      .tool-card__nutrition-note{margin:0;padding:0 11px 10px;font-size:.7rem;line-height:1.4;color:#5B6573}
      .tool-card__nutrition-note a{color:#174A72}
      @media (max-width:520px){
        .tool-card__nutrition-grid{grid-template-columns:1fr}
        .tool-card__nutrition-row{display:block;border-top:1px solid #E5EAF0;padding:6px 0}
        .tool-card__nutrition-key,.tool-card__nutrition-value{display:block;border:0;padding:0}
        .tool-card__nutrition-value{margin-top:2px}
      }
    `;
    document.head.appendChild(style);
  }

  function row(documentRef, key, value){
    const wrap = documentRef.createElement("div");
    wrap.className = "tool-card__nutrition-row";
    const dt = documentRef.createElement("dt");
    dt.className = "tool-card__nutrition-key";
    dt.textContent = key;
    const dd = documentRef.createElement("dd");
    dd.className = "tool-card__nutrition-value";
    dd.textContent = value;
    wrap.append(dt, dd);
    return wrap;
  }

  function toolIdFromCard(card){
    const link = card.querySelector('.tool-card__link[href*="/tools/"]');
    if (!link) return "";
    const match = link.getAttribute("href")?.match(/\/tools\/([^/?#]+)\.html/i);
    return match ? decodeURIComponent(match[1]) : "";
  }

  function enrichCard(card){
    const id = toolIdFromCard(card);
    const tool = id ? TOOLS[id] : null;
    if (!tool) return;

    const lang = language();
    const existing = card.querySelector(".tool-card__nutrition");
    if (existing?.dataset.lang === lang) return;
    if (existing) existing.remove();

    const details = document.createElement("details");
    details.className = "tool-card__nutrition";
    details.dataset.lang = lang;

    const summary = document.createElement("summary");
    summary.textContent = lang === "el" ? "ℹ️ Στοιχεία εργαλείου" : "ℹ️ Tool facts";
    details.appendChild(summary);

    const dl = document.createElement("dl");
    dl.className = "tool-card__nutrition-grid";
    const keys = lang === "el"
      ? ["Ηλικία", "Ελληνικά", "Κόστος", "Λογαριασμός", "Προσβασιμότητα", "Έλεγχος"]
      : ["Age", "Greek", "Cost", "Account", "Accessibility", "Reviewed"];
    const values = [
      typeof tool.minAge === "number" ? `${tool.minAge}+` : unknown(lang),
      greekFact(tool, lang),
      costFact(tool, lang),
      accountFact(tool, lang),
      accessibilityFact(tool, lang),
      lang === "el" ? (tool.lastReviewedEl || unknown(lang)) : (tool.lastReviewedEn || unknown(lang))
    ];
    keys.forEach((key, index) => dl.appendChild(row(document, key, values[index])));
    details.appendChild(dl);

    const note = document.createElement("p");
    note.className = "tool-card__nutrition-note";
    if (lang === "el") {
      note.append("Δείχνουμε μόνο ό,τι προκύπτει από τα τεκμηριωμένα στοιχεία του οδηγού. Το πεδίο λογαριασμού δεν αποτελεί πλήρη έλεγχο ιδιωτικότητας. ");
      const link = document.createElement("a");
      link.href = "/accessibility.html";
      link.textContent = "Στοιχεία προσβασιμότητας";
      note.appendChild(link);
    } else {
      note.append("We show only what is supported by the guide's documented evidence. The account field is not a full privacy audit. ");
      const link = document.createElement("a");
      link.href = "/accessibility.html";
      link.textContent = "Accessibility evidence";
      note.appendChild(link);
    }
    details.appendChild(note);

    const actions = card.querySelector(".tool-card__actions");
    card.insertBefore(details, actions || null);
  }

  function enrichAll(){
    ensureStyles();
    document.querySelectorAll(".tool-card").forEach(enrichCard);
  }

  let scheduled = false;
  function schedule(){
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      enrichAll();
    });
  }

  schedule();
  document.addEventListener("click", schedule);
  document.addEventListener("change", schedule);
  window.addEventListener("popstate", schedule);
  window.addEventListener("hashchange", schedule);
  window.addEventListener("load", schedule, {once:true});

  window.AITOOLSKIDS_TOOL_AUDIT = Object.freeze({
    updated:DATE,
    count:Object.keys(TOOLS).length,
    mode:"data-plus-nutrition-labels",
    nutritionLabels:true,
    privacyAuditClaim:false
  });
})();
