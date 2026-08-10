/**
 * app.js
 * ------------------------------------------------------------
 * Εφαρμογή vanilla JS. Χωρίς build step, χωρίς framework.
 * Διαβάζει τα δεδομένα από το ZONES / ROLES / TOOLS / PATHS (data.js)
 * και κάνει render / πλοήγηση.
 *
 * State machine (πολύ απλή):
 *   VIEW: "zoneSelect" | "path"
 *   currentZone: null | zoneId
 *   currentRole: null | roleId
 *   lang: "el" | "en"
 * ------------------------------------------------------------
 */

(function () {
  "use strict";

  // ---------- State ----------
  const state = {
    lang: "el",
    currentZone: null,
    currentRole: "guardian", // default λεωφορείο όταν μπαίνεις σε ζώνη
  };

  // ---------- Στατικά strings (UI chrome, όχι περιεχόμενο δεδομένων) ----------
  const STRINGS = {
    el: {
      heroTitle: "Ποιο AI εργαλείο ταιριάζει στο παιδί σου — και για ποια δουλειά",
      heroSubtitle:
        "Δεν είναι ακόμα ένας οδηγός ασφάλειας. Δείχνουμε ποιο συγκεκριμένο εργαλείο ταιριάζει σε ποια σχολική δουλειά, ανά ηλικία — για γονείς, μαθητές 6–18 και εκπαιδευτικούς.",
      badgeFree: "Δωρεάν",
      badgeIndependent: "Ανεξάρτητο",
      badgeBilingual: "Δίγλωσσο EL / EN",
      chooseZoneHeading: "Διάλεξε ηλικιακή ζώνη",
      chooseZoneSubheading:
        "Κάθε ζώνη έχει διαφορετικά κατάλληλα εργαλεία και διαφορετικό βαθμό αυτονομίας.",
      backToZones: "← Πίσω σε όλες τις ζώνες",
      footerText:
        "Ανεξάρτητο έργο — δεν σχετίζεται με κανέναν οργανισμό ή προμηθευτή AI εργαλείων.",
      emptyState: "Δεν έχουν προστεθεί ακόμα εργαλεία για αυτόν τον συνδυασμό. Έρχονται σύντομα.",
      useCaseLabel: "Για ποια δουλειά",
      howToLabel: "Πώς να το χρησιμοποιήσεις",
      cautionLabel: "Προσοχή",
      visitLink: "Άνοιγμα εργαλείου ↗",
    },
    en: {
      heroTitle: "Which AI tool fits your child — and for which task",
      heroSubtitle:
        "This isn't another safety guide. We show which specific tool fits which schoolwork, by age — for parents, students 6–18, and educators.",
      badgeFree: "Free",
      badgeIndependent: "Independent",
      badgeBilingual: "Bilingual EL / EN",
      chooseZoneHeading: "Choose an age zone",
      chooseZoneSubheading:
        "Each zone has different suitable tools and a different level of independence.",
      backToZones: "← Back to all zones",
      footerText:
        "Independent project — not affiliated with any organization or AI tool vendor.",
      emptyState: "No tools added yet for this combination. Coming soon.",
      useCaseLabel: "Best for",
      howToLabel: "How to use it",
      cautionLabel: "Caution",
      visitLink: "Open tool ↗",
    },
  };

  function t(key) {
    return STRINGS[state.lang][key] || key;
  }

  // ---------- DOM refs ----------
  const els = {};

  function cacheDom() {
    els.zoneSelectView = document.getElementById("zoneSelectView");
    els.pathView = document.getElementById("pathView");
    els.zoneGrid = document.getElementById("zoneGrid");
    els.pathZoneHeading = document.getElementById("pathZoneHeading");
    els.roleTabs = document.getElementById("roleTabs");
    els.pathIntro = document.getElementById("pathIntro");
    els.toolGrid = document.getElementById("toolGrid");
    els.backToZones = document.getElementById("backToZones");
    els.langElBtn = document.getElementById("langEl");
    els.langEnBtn = document.getElementById("langEn");
  }

  // ---------- Rendering: στατικό UI κείμενο ----------
  function renderStaticStrings() {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      node.textContent = t(key);
    });
    els.langElBtn.classList.toggle("active", state.lang === "el");
    els.langEnBtn.classList.toggle("active", state.lang === "en");
    document.documentElement.lang = state.lang;
  }

  // ---------- Rendering: Ζώνες (Βήμα 1) ----------
  function renderZoneGrid() {
    els.zoneGrid.innerHTML = "";
    ZONES.forEach((zone) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "zone-card";
      card.dataset.zone = zone.id;

      const label = state.lang === "el" ? zone.labelEl : zone.labelEn;
      const age = state.lang === "el" ? zone.ageRangeEl : zone.ageRangeEn;
      const desc = state.lang === "el" ? zone.descriptionEl : zone.descriptionEn;

      card.innerHTML = `
        <span class="zone-card__icon" aria-hidden="true">${zone.icon}</span>
        <p class="zone-card__label">${label}</p>
        <p class="zone-card__age">${age}</p>
        <p class="zone-card__desc">${desc}</p>
      `;

      card.addEventListener("click", () => selectZone(zone.id));
      els.zoneGrid.appendChild(card);
    });
  }

  // ---------- Rendering: Role tabs (Βήμα 2) ----------
  function renderRoleTabs() {
    els.roleTabs.innerHTML = "";
    ROLES.forEach((role) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "role-tab" + (state.currentRole === role.id ? " active" : "");
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", state.currentRole === role.id ? "true" : "false");

      const label = state.lang === "el" ? role.labelEl : role.labelEn;
      tab.innerHTML = `<span aria-hidden="true">${role.icon}</span> ${label}`;

      tab.addEventListener("click", () => selectRole(role.id));
      els.roleTabs.appendChild(tab);
    });
  }

  // ---------- Rendering: Path intro + tool grid ----------
  function renderPathContent() {
    const zone = ZONES.find((z) => z.id === state.currentZone);
    const role = ROLES.find((r) => r.id === state.currentRole);
    if (!zone || !role) return;

    const zoneLabel = state.lang === "el" ? zone.labelEl : zone.labelEn;
    const zoneAge = state.lang === "el" ? zone.ageRangeEl : zone.ageRangeEn;
    els.pathZoneHeading.textContent = `${zone.icon} ${zoneLabel} (${zoneAge})`;

    const pathData = (PATHS[state.currentZone] && PATHS[state.currentZone][state.currentRole]) || null;

    if (!pathData) {
      els.pathIntro.textContent = "";
      els.toolGrid.innerHTML = `<div class="empty-state">${t("emptyState")}</div>`;
      return;
    }

    els.pathIntro.textContent = state.lang === "el" ? pathData.introEl : pathData.introEn;

    renderToolGrid(pathData.tools || []);
  }

  function renderToolGrid(pathTools) {
    els.toolGrid.innerHTML = "";

    if (!pathTools.length) {
      els.toolGrid.innerHTML = `<div class="empty-state">${t("emptyState")}</div>`;
      return;
    }

    pathTools.forEach((entry) => {
      const tool = TOOLS[entry.toolId];
      if (!tool) return; // αγνόησε broken references αντί να σκάσει η σελίδα

      const category = CATEGORIES.find((c) => c.id === tool.category);
      const categoryLabel = category ? (state.lang === "el" ? category.labelEl : category.labelEn) : "";

      const useCase = state.lang === "el" ? entry.useCaseEl : entry.useCaseEn;
      const howTo = state.lang === "el" ? entry.howToEl : entry.howToEn;
      const caution = state.lang === "el" ? entry.cautionEl : entry.cautionEn;

      const card = document.createElement("article");
      card.className = "tool-card";

      card.innerHTML = `
        <div class="tool-card__header">
          <div class="tool-card__logo" aria-hidden="true"></div>
          <p class="tool-card__name">${escapeHtml(tool.name)}</p>
        </div>
        ${categoryLabel ? `<span class="tool-card__category">${escapeHtml(categoryLabel)}</span>` : ""}

        ${useCase ? `
          <p class="tool-card__field-label">${t("useCaseLabel")}</p>
          <p class="tool-card__field-value">${escapeHtml(useCase)}</p>
        ` : ""}

        ${howTo ? `
          <p class="tool-card__field-label">${t("howToLabel")}</p>
          <p class="tool-card__field-value">${escapeHtml(howTo)}</p>
        ` : ""}

        ${caution ? `
          <div class="tool-card__caution">
            <strong>${t("cautionLabel")}:</strong> ${escapeHtml(caution)}
          </div>
        ` : ""}

        ${tool.url ? `<a class="tool-card__link" href="${escapeAttr(tool.url)}" target="_blank" rel="noopener noreferrer">${t("visitLink")}</a>` : ""}
      `;

      els.toolGrid.appendChild(card);
    });
  }

  // ---------- Βοηθητικά: escaping (βασική προστασία αφού το περιεχόμενο ζει σε JS αρχείο) ----------
  function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }

  // ---------- Navigation ----------
  function selectZone(zoneId) {
    state.currentZone = zoneId;
    state.currentRole = "guardian"; // reset σε default λεωφορείο κάθε φορά που μπαίνεις σε ζώνη
    showPathView();
  }

  function selectRole(roleId) {
    state.currentRole = roleId;
    renderRoleTabs();
    renderPathContent();
  }

  function showPathView() {
    els.zoneSelectView.hidden = true;
    els.pathView.hidden = false;
    renderRoleTabs();
    renderPathContent();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showZoneSelectView() {
    state.currentZone = null;
    els.pathView.hidden = true;
    els.zoneSelectView.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setLang(lang) {
    if (lang !== "el" && lang !== "en") return;
    state.lang = lang;
    renderStaticStrings();
    renderZoneGrid();
    if (state.currentZone) {
      renderRoleTabs();
      renderPathContent();
    }
  }

  // ---------- Init ----------
  function init() {
    cacheDom();
    renderStaticStrings();
    renderZoneGrid();

    els.backToZones.addEventListener("click", showZoneSelectView);
    els.langElBtn.addEventListener("click", () => setLang("el"));
    els.langEnBtn.addEventListener("click", () => setLang("en"));
  }

  document.addEventListener("DOMContentLoaded", init);
})();
