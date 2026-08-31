(function () {
  "use strict";

  const concepts = (Array.isArray(window.SIGN_LANGUAGE_CONCEPTS) ? window.SIGN_LANGUAGE_CONCEPTS : []).slice();
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
    biology: "🧬 Βιολογία / Σώμα",
    science: "🔬 Φυσικές Επιστήμες",
    geography: "🌍 Γεωγραφία / Περιβάλλον",
    math: "📐 Μαθηματικά",
    history: "🏛️ Ιστορία",
  };
  const subjectEn = {
    biology: "🧬 Biology / Body",
    science: "🔬 Science",
    geography: "🌍 Geography / Environment",
    math: "📐 Mathematics",
    history: "🏛️ History",
  };
  const subjectOrder = { math: 1, geography: 2, science: 3, biology: 4, history: 5 };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);

  const normalizeSearch = (value) => String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("el")
    .replace(/ς/g, "σ");

  function gradeIds(concept) {
    return (gradeMap[concept.name] || []).filter((id) => gradeDefs[id]);
  }

  function earliest(concept) {
    const ids = gradeIds(concept);
    return ids.length ? Math.min(...ids.map((id) => gradeDefs[id].order || 99)) : 99;
  }

  concepts.sort((a, b) => earliest(a) - earliest(b)
    || (subjectOrder[a.subject] || 9) - (subjectOrder[b.subject] || 9)
    || a.name.localeCompare(b.name, "el"));

  function gradeTags(concept) {
    return gradeIds(concept)
      .map((id) => `<span class="grade-tag">${escapeHtml(lang === "en" ? gradeDefs[id].labelEn : gradeDefs[id].labelEl)}</span>`)
      .join("");
  }

  function card(concept) {
    const grades = gradeIds(concept);
    const searchableText = normalizeSearch([
      concept.name, concept.desc, subjectEl[concept.subject], subjectEn[concept.subject],
      ...grades.map((id) => gradeDefs[id].labelEl),
      ...grades.map((id) => gradeDefs[id].labelEn),
    ].join(" "));
    const subjectLabel = lang === "en" ? subjectEn[concept.subject] : subjectEl[concept.subject];
    const videoLabel = lang === "en" ? "🤟 Open official GSL video ↗" : "🤟 Δες το επίσημο βίντεο ΕΝΓ ↗";
    const sourceLabel = lang === "en" ? "IEP source page ↗" : "σελίδα πηγής στο ΙΕΠ ↗";
    const verifiedLabel = lang === "en" ? "✓ Verified direct WebM" : "✓ Direct WebM επιβεβαιωμένο";
    const videoSource = lang === "en" ? "Video source: IEP" : "Πηγή βίντεο: ΙΕΠ";

    return `<article class="card" data-subject="${escapeHtml(concept.subject)}" data-search="${escapeHtml(searchableText)}"><div class="art"><img loading="lazy" referrerpolicy="no-referrer" src="${escapeHtml(concept.image)}" alt="${escapeHtml(concept.imageAlt || concept.name)}"><a class="image-credit" href="${escapeHtml(concept.imageSource)}" target="_blank" rel="noopener noreferrer">${escapeHtml(concept.imageCredit || "Πηγή εικόνας")}</a></div><div class="card-body"><div class="subject">${escapeHtml(subjectLabel)}</div><h2>${escapeHtml(concept.name)}</h2><div class="grade-tags">${gradeTags(concept)}</div><p class="desc">${escapeHtml(concept.desc)}</p><div class="iep-box"><p class="iep-label">${videoSource}</p><p class="iep-source">${escapeHtml(concept.sourceLabel)}</p><a class="btn" href="${escapeHtml(concept.video)}" target="_blank" rel="noopener noreferrer">${videoLabel}</a><a class="source-page" href="${escapeHtml(concept.sourcePage)}" target="_blank" rel="noopener noreferrer">${sourceLabel}</a><div class="verified">${verifiedLabel}</div></div></div></article>`;
  }

  function renderCards() {
    grid.innerHTML = concepts.map(card).join("");
    applyFilters();
  }

  function setEmptyMessage(rawTerm) {
    if (rawTerm) {
      empty.textContent = `Η λέξη «${rawTerm}» δεν υπάρχει ακόμη στις ${concepts.length} διαθέσιμες έννοιες. Η αναζήτηση δεν καλύπτει όλο το λεξιλόγιο της ΕΝΓ.`;
      emptyEn.textContent = `“${rawTerm}” is not yet included in the ${concepts.length} available concepts. Search does not cover the full GSL vocabulary.`;
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
    count.textContent = `${visibleCount}${lang === "en" ? " concepts" : " έννοιες"}`;
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
    search.placeholder = isEnglish ? "e.g. DNA, photosynthesis, circle" : "π.χ. DNA, φωτοσύνθεση, κύκλος";
    search.setAttribute("aria-label", isEnglish ? `Search the ${concepts.length} available concepts` : `Αναζήτηση στις ${concepts.length} διαθέσιμες έννοιες`);
    document.querySelectorAll(".filter").forEach((button) => { button.textContent = button.dataset[isEnglish ? "en" : "el"]; });
    renderCards();
    try { localStorage.setItem("aitools4kids_lang", lang); } catch (_error) {}
  }

  document.querySelectorAll(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      subject = button.dataset.subject;
      document.querySelectorAll(".filter").forEach((item) => item.classList.toggle("active", item === button));
      applyFilters();
    });
  });
  search.addEventListener("input", applyFilters);
  document.getElementById("btnEl").addEventListener("click", () => setLang("el"));
  document.getElementById("btnEn").addEventListener("click", () => setLang("en"));

  renderCards();
  try { if (localStorage.getItem("aitools4kids_lang") === "en") setLang("en"); } catch (_error) {}
})();