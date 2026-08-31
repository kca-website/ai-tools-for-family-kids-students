(function () {
  "use strict";

  function loadEducationData(done) {
    if (window.SIGN_LANGUAGE_EDUCATION_LOADED) return done();
    const script = document.createElement("script");
    script.src = "/sign-language-education.js?v=20260831";
    script.async = false;
    script.onload = done;
    script.onerror = () => {
      console.warn("[GSL] Education vocabulary could not be loaded.");
      done();
    };
    document.head.appendChild(script);
  }

  loadEducationData(init);

  function init() {
    const concepts = (Array.isArray(window.SIGN_LANGUAGE_CONCEPTS)
      ? window.SIGN_LANGUAGE_CONCEPTS
      : []).slice();
    const gradeDefs = window.SIGN_LANGUAGE_GRADE_DEFS || {};
    const gradeMap = window.SIGN_LANGUAGE_GRADE_MAP || {};

    const grid = document.getElementById("grid");
    const search = document.getElementById("search");
    const count = document.getElementById("count");
    const empty = document.getElementById("empty");
    const emptyEn = document.getElementById("emptyEn");

    let subject = "all";
    let lang = "el";

    const subjectEl = {
      education: "🎒 Σχολείο / Μάθηση",
      biology: "🧬 Βιολογία / Σώμα",
      science: "🔬 Φυσικές Επιστήμες",
      geography: "🌍 Γεωγραφία / Περιβάλλον",
      math: "📐 Μαθηματικά",
      history: "🏛️ Ιστορία",
    };
    const subjectEn = {
      education: "🎒 School / Learning",
      biology: "🧬 Biology / Body",
      science: "🔬 Science",
      geography: "🌍 Geography / Environment",
      math: "📐 Mathematics",
      history: "🏛️ History",
    };
    const subjectOrder = { education: 1, math: 2, geography: 3, science: 4, biology: 5, history: 6 };

    const escapeHtml = (value) =>
      String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]);

    const normalizeSearch = (value) =>
      String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("el")
        .replace(/ς/g, "σ");

    function gradeIds(concept) {
      return (gradeMap[concept.name] || []).filter((id) => gradeDefs[id]);
    }

    function earliest(concept) {
      const ids = gradeIds(concept);
      return ids.length
        ? Math.min(...ids.map((id) => gradeDefs[id].order || 99))
        : 99;
    }

    function injectEducationFilter() {
      const filters = document.querySelector(".filters");
      if (!filters || filters.querySelector('[data-subject="education"]')) return;
      const button = document.createElement("button");
      button.className = "filter";
      button.type = "button";
      button.dataset.subject = "education";
      button.dataset.el = "🎒 Σχολείο / Μάθηση";
      button.dataset.en = "🎒 School / Learning";
      button.textContent = button.dataset.el;
      const all = filters.querySelector('[data-subject="all"]');
      if (all?.nextSibling) filters.insertBefore(button, all.nextSibling);
      else filters.appendChild(button);
    }

    function updateStaticCopy() {
      const total = concepts.length;
      const subjectCount = Object.keys(subjectEl).length;

      const metaDescription = `Δωρεάν συλλογή ${total} σχολικών εννοιών και σχολικού λεξιλογίου στην Ελληνική Νοηματική Γλώσσα (ΕΝΓ), με direct βίντεο από ΙΕΠ και Πανεπιστήμιο Θεσσαλίας.`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.content = metaDescription;
      const og = document.querySelector('meta[property="og:description"]');
      if (og) og.content = metaDescription;
      const tw = document.querySelector('meta[name="twitter:description"]');
      if (tw) tw.content = `${total} σχολικές έννοιες και όροι στην Ελληνική Νοηματική Γλώσσα (ΕΝΓ).`;

      const heroEl = document.querySelector('.hero p[data-lang="el"]');
      const heroEn = document.querySelector('.hero p[data-lang="en"]');
      if (heroEl) heroEl.textContent = `Περιηγήσου στις ${total} διαθέσιμες σχολικές έννοιες και όρους, διάβασέ τες με απλά λόγια και άνοιξε απευθείας το αντίστοιχο βίντεο Ελληνικής Νοηματικής Γλώσσας από ΙΕΠ ή Πανεπιστήμιο Θεσσαλίας.`;
      if (heroEn) heroEn.textContent = `Browse ${total} available school concepts and terms, read the simple explanation, and open the matching Greek Sign Language video from IEP or the University of Thessaly.`;

      const notices = document.querySelectorAll('.hero .notice');
      notices.forEach((node) => {
        if (node.dataset.lang === "el") node.innerHTML = `<strong>Σημαντικό:</strong> Η σελίδα περιλαμβάνει ${total} επιλεγμένες σχολικές έννοιες και όρους. Δεν είναι πλήρες λεξικό Ελληνικής Νοηματικής Γλώσσας και η αναζήτηση ελέγχει μόνο τις έννοιες που υπάρχουν ήδη εδώ.`;
        if (node.dataset.lang === "en") node.innerHTML = `<strong>Important:</strong> This page contains ${total} selected school concepts and terms. It is not a complete Greek Sign Language dictionary, and search only checks the concepts already included here.`;
      });

      const stats = document.querySelectorAll('.stats .stat');
      if (stats[0]) stats[0].textContent = `${total} direct GSL videos`;
      stats.forEach((node) => {
        if (node.dataset.lang === "el" && /διαθέσιμες έννοιες/.test(node.textContent)) node.textContent = `${total} διαθέσιμες έννοιες / όροι`;
        if (node.dataset.lang === "en" && /available concepts/.test(node.textContent)) node.textContent = `${total} available concepts / terms`;
        if (node.dataset.lang === "el" && /σχολικές θεματικές/.test(node.textContent)) node.textContent = `${subjectCount} σχολικές θεματικές`;
        if (node.dataset.lang === "en" && /school subject areas/.test(node.textContent)) node.textContent = `${subjectCount} school subject areas`;
      });

      document.querySelectorAll('.browse-title[data-lang="el"]').forEach((node) => node.textContent = `Αναζήτησε μέσα στις ${total} διαθέσιμες έννοιες / όρους`);
      document.querySelectorAll('.browse-title[data-lang="en"]').forEach((node) => node.textContent = `Search within the ${total} available concepts / terms`);

      const metaRow = document.querySelector('.meta-row');
      if (metaRow) {
        const spans = metaRow.querySelectorAll('span');
        spans.forEach((node) => {
          if (node.id === "count") return;
          if (node.dataset.lang === "el") node.textContent = "Direct βίντεο από ΙΕΠ & Πανεπιστήμιο Θεσσαλίας";
          if (node.dataset.lang === "en") node.textContent = "Direct videos from IEP & University of Thessaly";
        });
      }

      const rightsEl = document.querySelector('.rights p[data-lang="el"]');
      const rightsEn = document.querySelector('.rights p[data-lang="en"]');
      if (rightsEl) rightsEl.innerHTML = '<strong>Πηγές &amp; δικαιώματα:</strong> Τα βίντεο ΕΝΓ ανοίγουν απευθείας από τις πρωτότυπες πηγές τους: <strong>prosvasimo.iep.edu.gr</strong> (ΙΕΠ) και <strong>vod.uth.gr / streamer.uth.gr</strong> (Πανεπιστήμιο Θεσσαλίας). Δεν κατεβάζονται ούτε επαναφιλοξενούνται από το AI Tools for Kids. Οι εικόνες των επιστημονικών εννοιών προέρχονται από ανοικτές πηγές, ενώ η εικονογράφηση της θεματικής «Σχολείο / Μάθηση» είναι δική μας.';
      if (rightsEn) rightsEn.innerHTML = '<strong>Sources &amp; rights:</strong> GSL videos open directly from their original sources: <strong>prosvasimo.iep.edu.gr</strong> (IEP) and <strong>vod.uth.gr / streamer.uth.gr</strong> (University of Thessaly). AI Tools for Kids does not download or re-host them. Scientific visuals come from open sources; the “School / Learning” illustration is our own.';

      const ld = document.querySelector('script[type="application/ld+json"]');
      if (ld) {
        try {
          const data = JSON.parse(ld.textContent);
          data.description = `${total} σχολικές έννοιες και όροι στην Ελληνική Νοηματική Γλώσσα, με απλές εξηγήσεις και direct συνδέσμους προς ΙΕΠ και Πανεπιστήμιο Θεσσαλίας.`;
          ld.textContent = JSON.stringify(data);
        } catch (_error) {}
      }
    }

    injectEducationFilter();
    updateStaticCopy();

    concepts.sort((a, b) =>
      earliest(a) - earliest(b)
      || (subjectOrder[a.subject] || 9) - (subjectOrder[b.subject] || 9)
      || a.name.localeCompare(b.name, "el")
    );

    function gradeTags(concept) {
      return gradeIds(concept)
        .map((id) => `<span class="grade-tag">${escapeHtml(
          lang === "en" ? gradeDefs[id].labelEn : gradeDefs[id].labelEl
        )}</span>`)
        .join("");
    }

    function card(concept) {
      const grades = gradeIds(concept);
      const searchableText = normalizeSearch([
        concept.name,
        concept.desc,
        subjectEl[concept.subject],
        subjectEn[concept.subject],
        ...grades.map((id) => gradeDefs[id].labelEl),
        ...grades.map((id) => gradeDefs[id].labelEn),
      ].join(" "));
      const subjectLabel = lang === "en"
        ? subjectEn[concept.subject]
        : subjectEl[concept.subject];
      const isUth = concept.sourceOrg === "uth";
      const videoLabel = lang === "en"
        ? (isUth ? "🤟 Open GSL video ↗" : "🤟 Open official GSL video ↗")
        : (isUth ? "🤟 Δες το βίντεο ΕΝΓ ↗" : "🤟 Δες το επίσημο βίντεο ΕΝΓ ↗");
      const sourcePageLabel = lang === "en"
        ? (isUth ? "University of Thessaly source ↗" : "IEP source page ↗")
        : (isUth ? "πηγή Πανεπιστημίου Θεσσαλίας ↗" : "σελίδα πηγής στο ΙΕΠ ↗");
      const verifiedLabel = lang === "en"
        ? `✓ Direct ${escapeHtml(concept.videoFormat || "WebM")}`
        : `✓ Direct ${escapeHtml(concept.videoFormat || "WebM")}`;
      const videoSource = lang === "en"
        ? (isUth ? "Video source: University of Thessaly" : "Video source: IEP")
        : (isUth ? "Πηγή βίντεο: Πανεπιστήμιο Θεσσαλίας" : "Πηγή βίντεο: ΙΕΠ");

      return `<article class="card" data-subject="${escapeHtml(concept.subject)}" data-search="${escapeHtml(searchableText)}"><div class="art"><img loading="lazy" referrerpolicy="no-referrer" src="${escapeHtml(concept.image)}" alt="${escapeHtml(concept.imageAlt || concept.name)}"><a class="image-credit" href="${escapeHtml(concept.imageSource)}" target="_blank" rel="noopener noreferrer">${escapeHtml(concept.imageCredit || "Πηγή εικόνας")}</a></div><div class="card-body"><div class="subject">${escapeHtml(subjectLabel)}</div><h2>${escapeHtml(concept.name)}</h2><div class="grade-tags">${gradeTags(concept)}</div><p class="desc">${escapeHtml(concept.desc)}</p><div class="iep-box"><p class="iep-label">${videoSource}</p><p class="iep-source">${escapeHtml(concept.sourceLabel)}</p><a class="btn" href="${escapeHtml(concept.video)}" target="_blank" rel="noopener noreferrer">${videoLabel}</a><a class="source-page" href="${escapeHtml(concept.sourcePage)}" target="_blank" rel="noopener noreferrer">${sourcePageLabel}</a><div class="verified">${verifiedLabel}</div></div></div></article>`;
    }

    function renderCards() {
      grid.innerHTML = concepts.map(card).join("");
      applyFilters();
    }

    function setEmptyMessage(rawTerm) {
      if (rawTerm) {
        empty.textContent = `Η λέξη «${rawTerm}» δεν υπάρχει ακόμη στις ${concepts.length} διαθέσιμες έννοιες / όρους. Η αναζήτηση δεν καλύπτει όλο το λεξιλόγιο της ΕΝΓ.`;
        emptyEn.textContent = `“${rawTerm}” is not yet included in the ${concepts.length} available concepts / terms. Search does not cover the full GSL vocabulary.`;
        return;
      }
      empty.textContent = "Δεν υπάρχουν ακόμη διαθέσιμες έννοιες σε αυτή τη θεματική.";
      emptyEn.textContent = "There are no available concepts in this subject area yet.";
    }

    function applyFilters() {
      const rawTerm = (search.value || "").trim();
      const term = normalizeSearch(rawTerm);
      let visibleCount = 0;

      [...grid.querySelectorAll(".card")].forEach((item) => {
        const matchesSubject = subject === "all" || item.dataset.subject === subject;
        const matchesSearch = !term || (item.dataset.search || "").includes(term);
        const isVisible = matchesSubject && matchesSearch;
        item.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      count.textContent = `${visibleCount}${lang === "en" ? " concepts / terms" : " έννοιες / όροι"}`;
      setEmptyMessage(rawTerm);
      empty.style.display = visibleCount || lang === "en" ? "none" : "block";
      emptyEn.style.display = visibleCount || lang !== "en" ? "none" : "block";
    }

    function setLang(next) {
      lang = next === "en" ? "en" : "el";
      const isEnglish = lang === "en";
      document.body.classList.toggle("lang-en", isEnglish);
      document.documentElement.lang = isEnglish ? "en" : "el";
      document.getElementById("btnEl").classList.toggle("active", !isEnglish);
      document.getElementById("btnEn").classList.toggle("active", isEnglish);
      search.placeholder = isEnglish
        ? "e.g. DNA, photosynthesis, school, fraction"
        : "π.χ. DNA, φωτοσύνθεση, σχολείο, κλάσμα";
      search.setAttribute(
        "aria-label",
        isEnglish
          ? `Search the ${concepts.length} available concepts and terms`
          : `Αναζήτηση στις ${concepts.length} διαθέσιμες έννοιες και όρους`
      );
      document.querySelectorAll(".filter").forEach((button) => {
        button.textContent = button.dataset[isEnglish ? "en" : "el"];
      });
      renderCards();
      try {
        localStorage.setItem("aitools4kids_lang", lang);
      } catch (_error) {}
    }

    document.querySelectorAll(".filter").forEach((button) => {
      button.addEventListener("click", () => {
        subject = button.dataset.subject;
        document.querySelectorAll(".filter").forEach((item) => {
          item.classList.toggle("active", item === button);
        });
        applyFilters();
      });
    });
    search.addEventListener("input", applyFilters);
    document.getElementById("btnEl").addEventListener("click", () => setLang("el"));
    document.getElementById("btnEn").addEventListener("click", () => setLang("en"));

    renderCards();
    try {
      if (localStorage.getItem("aitools4kids_lang") === "en") setLang("en");
    } catch (_error) {}
  }
})();