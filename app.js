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
    currentView: "tools", // "tools" | "prompts" | "quiz", ποια υπο-όψη δείχνουμε μέσα στο path view
    // Quiz sub-state (Learning Compass)
    quizSubjectId: null, // ποιο quiz είναι επιλεγμένο μέσα στη ζώνη (π.χ. "math-e-dimotikou")
    quizCurrentIndex: 0, // δείκτης τρέχουσας ερώτησης
    quizAnswers: [], // [{ questionId, gapTag: string|null }] ανά ερώτηση που απαντήθηκε
    quizFinished: false,
  };

  // ---------- Στατικά strings (UI chrome, όχι περιεχόμενο δεδομένων) ----------
  const STRINGS = {
    el: {
      heroTitle: "Ποιο AI εργαλείο ταιριάζει στο παιδί σου και για ποια δουλειά",
      heroSubtitle:
        "Δεν είναι ακόμα ένας οδηγός ασφάλειας. Δείχνουμε ποιο συγκεκριμένο εργαλείο ταιριάζει σε ποια σχολική δουλειά, ανά ηλικία, για γονείς, μαθητές 6 έως 18 και εκπαιδευτικούς.",
      badgeFree: "Δωρεάν",
      badgeIndependent: "Ανεξάρτητο",
      badgeBilingual: "Δίγλωσσο EL / EN",
      chooseZoneHeading: "Διάλεξε ηλικιακή ζώνη",
      chooseZoneSubheading:
        "Κάθε ζώνη έχει διαφορετικά κατάλληλα εργαλεία και διαφορετικό βαθμό αυτονομίας.",
      backToZones: "Πίσω σε όλες τις ζώνες",
      footerText:
        "Ανεξάρτητο έργο. Δεν σχετίζεται με κανέναν οργανισμό ή προμηθευτή AI εργαλείων.",
      emptyState: "Δεν έχουν προστεθεί ακόμα εργαλεία για αυτόν τον συνδυασμό. Έρχονται σύντομα.",
      useCaseLabel: "Για ποια δουλειά",
      howToLabel: "Πώς να το χρησιμοποιήσεις",
      cautionLabel: "Προσοχή",
      visitLink: "Άνοιγμα εργαλείου ↗",
      viewTabTools: "Εργαλεία",
      viewTabPrompts: "Prompt Generator",
      promptsIntro:
        "Αυτά τα prompts δεν γράφουν την εργασία για εσένα. Σε ρωτάνε πρώτα τι σκέφτεσαι, και το AI απαντάει πάνω σε αυτό. Γράψε τη δική σου σκέψη μέσα στις αγκύλες πριν το αντιγράψεις.",
      promptsEmptyState: "Δεν έχουν προστεθεί ακόμα prompts για αυτή τη ζώνη. Έρχονται σύντομα.",
      copyPrompt: "Αντιγραφή prompt",
      copiedPrompt: "Αντιγράφηκε",
      tipLabel: "Συμβουλή",
      viewTabQuiz: "Διαγνωστικός Χάρτης",
      quizEmptyState: "Δεν υπάρχει ακόμα διαγνωστικό κουίζ για αυτή τη ζώνη. Έρχεται σύντομα.",
      quizPickSubject: "Διάλεξε μάθημα",
      quizStartBtn: "Ξεκίνα το κουίζ",
      quizQuestionOf: "Ερώτηση {current} από {total}",
      quizNextBtn: "Επόμενη",
      quizResultsTitle: "Το αποτέλεσμα του Χάρτη",
      quizAllCorrect: "Απάντησε σωστά σε όλα! Καμία συγκεκριμένη δυσκολία δεν εντοπίστηκε αυτή τη φορά.",
      quizGapsFound: "Εντοπίστηκαν σημεία για εξάσκηση:",
      quizRecommendedTools: "Προτεινόμενα εργαλεία",
      quizRetakeBtn: "Ξανακάνε το κουίζ",
      quizBackToStart: "Πίσω στην αρχή του κουίζ",
    },
    en: {
      heroTitle: "Which AI tool fits your child, and for which task",
      heroSubtitle:
        "This isn't another safety guide. We show which specific tool fits which schoolwork, by age, for parents, students 6 to 18, and educators.",
      badgeFree: "Free",
      badgeIndependent: "Independent",
      badgeBilingual: "Bilingual EL / EN",
      chooseZoneHeading: "Choose an age zone",
      chooseZoneSubheading:
        "Each zone has different suitable tools and a different level of independence.",
      backToZones: "Back to all zones",
      footerText:
        "Independent project. Not affiliated with any organization or AI tool vendor.",
      emptyState: "No tools added yet for this combination. Coming soon.",
      useCaseLabel: "Best for",
      howToLabel: "How to use it",
      cautionLabel: "Caution",
      visitLink: "Open tool ↗",
      viewTabTools: "Tools",
      viewTabPrompts: "Prompt Generator",
      promptsIntro:
        "These prompts don't write the assignment for you. They ask what you're thinking first, and the AI responds to that. Fill in your own thinking inside the brackets before copying.",
      promptsEmptyState: "No prompts added yet for this zone. Coming soon.",
      copyPrompt: "Copy prompt",
      copiedPrompt: "Copied",
      tipLabel: "Tip",
      viewTabQuiz: "Learning Compass",
      quizEmptyState: "No diagnostic quiz yet for this zone. Coming soon.",
      quizPickSubject: "Choose a subject",
      quizStartBtn: "Start the quiz",
      quizQuestionOf: "Question {current} of {total}",
      quizNextBtn: "Next",
      quizResultsTitle: "Your Compass Result",
      quizAllCorrect: "All correct! No specific gap spotted this time.",
      quizGapsFound: "Spots worth some extra practice:",
      quizRecommendedTools: "Recommended tools",
      quizRetakeBtn: "Retake the quiz",
      quizBackToStart: "Back to quiz start",
    },
  };

  function t(key, vars) {
    let str = STRINGS[state.lang][key] || key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace(`{${k}}`, vars[k]);
      });
    }
    return str;
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
    els.viewTabTools = document.getElementById("viewTabTools");
    els.viewTabPrompts = document.getElementById("viewTabPrompts");
    els.viewTabQuiz = document.getElementById("viewTabQuiz");
    els.toolsView = document.getElementById("toolsView");
    els.promptsView = document.getElementById("promptsView");
    els.promptList = document.getElementById("promptList");
    els.quizView = document.getElementById("quizView");
    els.quizContent = document.getElementById("quizContent");
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

  // ---------- Rendering: View tabs (Εργαλεία / Prompt Generator / Learning Compass) ----------
  function renderViewTabs() {
    els.viewTabTools.classList.toggle("active", state.currentView === "tools");
    els.viewTabPrompts.classList.toggle("active", state.currentView === "prompts");
    els.viewTabQuiz.classList.toggle("active", state.currentView === "quiz");
    els.toolsView.hidden = state.currentView !== "tools";
    els.promptsView.hidden = state.currentView !== "prompts";
    els.quizView.hidden = state.currentView !== "quiz";
  }

  // ---------- Rendering: Learning Compass (Διαγνωστικός Χάρτης Μάθησης) ----------
  function resetQuizState() {
    state.quizSubjectId = null;
    state.quizCurrentIndex = 0;
    state.quizAnswers = [];
    state.quizFinished = false;
  }

  function getZoneQuizzes() {
    return (typeof QUIZZES !== "undefined" && QUIZZES[state.currentZone]) || null;
  }

  function renderQuizView() {
    const zoneQuizzes = getZoneQuizzes();
    const subjectIds = zoneQuizzes ? Object.keys(zoneQuizzes) : [];

    if (!subjectIds.length) {
      els.quizContent.innerHTML = `<div class="empty-state">${t("quizEmptyState")}</div>`;
      return;
    }

    if (!state.quizSubjectId) {
      renderQuizSubjectPicker(zoneQuizzes, subjectIds);
      return;
    }

    const quiz = zoneQuizzes[state.quizSubjectId];
    if (!quiz) {
      renderQuizSubjectPicker(zoneQuizzes, subjectIds);
      return;
    }

    if (state.quizFinished) {
      renderQuizResults(quiz);
    } else {
      renderQuizQuestion(quiz);
    }
  }

  function renderQuizSubjectPicker(zoneQuizzes, subjectIds) {
    const cards = subjectIds
      .map((sid) => {
        const q = zoneQuizzes[sid];
        const subjectLabel = state.lang === "el" ? q.subjectLabelEl : q.subjectLabelEn;
        const title = state.lang === "el" ? q.titleEl : q.titleEn;
        const intro = state.lang === "el" ? q.introEl : q.introEn;
        return `
          <article class="quiz-subject-card">
            <p class="quiz-subject-card__subject">${escapeHtml(subjectLabel)}</p>
            <p class="quiz-subject-card__title">${escapeHtml(title)}</p>
            <p class="quiz-subject-card__intro">${escapeHtml(intro)}</p>
            <button type="button" class="quiz-start-btn" data-subject-id="${escapeAttr(sid)}">${t("quizStartBtn")}</button>
          </article>
        `;
      })
      .join("");

    els.quizContent.innerHTML = `
      <p class="quiz-pick-heading">${t("quizPickSubject")}</p>
      <div class="quiz-subject-grid">${cards}</div>
    `;

    els.quizContent.querySelectorAll(".quiz-start-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.quizSubjectId = btn.dataset.subjectId;
        state.quizCurrentIndex = 0;
        state.quizAnswers = [];
        state.quizFinished = false;
        renderQuizView();
      });
    });
  }

  function renderQuizQuestion(quiz) {
    const question = quiz.questions[state.quizCurrentIndex];
    const questionText = state.lang === "el" ? question.textEl : question.textEn;
    const total = quiz.questions.length;
    const current = state.quizCurrentIndex + 1;

    const optionsHtml = question.options
      .map((opt, idx) => {
        const label = state.lang === "el" ? opt.textEl : opt.textEn;
        return `<button type="button" class="quiz-option" data-option-index="${idx}">${escapeHtml(label)}</button>`;
      })
      .join("");

    els.quizContent.innerHTML = `
      <div class="quiz-progress">${t("quizQuestionOf", { current, total })}</div>
      <p class="quiz-question-text">${escapeHtml(questionText)}</p>
      <div class="quiz-options">${optionsHtml}</div>
    `;

    els.quizContent.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.optionIndex);
        const chosen = question.options[idx];
        state.quizAnswers.push({
          questionId: question.id,
          gapTag: chosen.isCorrect ? null : chosen.gapTag || null,
        });

        if (state.quizCurrentIndex < quiz.questions.length - 1) {
          state.quizCurrentIndex += 1;
          renderQuizQuestion(quiz);
        } else {
          state.quizFinished = true;
          renderQuizView();
        }
      });
    });
  }

  // ---------- renderQuizResults (ΑΝΑΝΕΩΜΕΝΗ με την κάρτα achievement) ----------
  function renderQuizResults(quiz) {
    // Μάζεψε τα μοναδικά gapTags από τις λάθος απαντήσεις
    const gapTagIds = [...new Set(state.quizAnswers.map((a) => a.gapTag).filter(Boolean))];

    let gapsHtml = "";
    if (!gapTagIds.length) {
      gapsHtml = `<p class="quiz-all-correct">${t("quizAllCorrect")}</p>`;
    } else {
      const gapCards = gapTagIds
        .map((tagId) => {
          const gap = (typeof GAP_TAGS !== "undefined" && GAP_TAGS[tagId]) || null;
          if (!gap) return "";

          const label = state.lang === "el" ? gap.labelEl : gap.labelEn;
          const explain = state.lang === "el" ? gap.explainEl : gap.explainEn;

          const toolsHtml = (gap.recommendedToolIds || [])
            .map((toolId) => {
              const tool = TOOLS[toolId];
              if (!tool) return "";
              return `<a class="quiz-tool-chip" href="${escapeAttr(tool.url || "#")}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.name)}</a>`;
            })
            .join("");

          return `
            <article class="quiz-gap-card">
              <p class="quiz-gap-card__label">${escapeHtml(label)}</p>
              <p class="quiz-gap-card__explain">${escapeHtml(explain)}</p>
              ${toolsHtml ? `<p class="quiz-gap-card__tools-label">${t("quizRecommendedTools")}</p><div class="quiz-tool-chips">${toolsHtml}</div>` : ""}
            </article>
          `;
        })
        .join("");

      gapsHtml = `
        <p class="quiz-gaps-found-label">${t("quizGapsFound")}</p>
        <div class="quiz-gap-grid">${gapCards}</div>
      `;
    }

    // 🔽 ΔΗΜΙΟΥΡΓΙΑ SVG ΚΑΡΤΑΣ
    const svgCard = renderAchievementCard(gapTagIds);
    const encodedSvg = encodeURIComponent(svgCard);
    const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodedSvg;

    // 🔽 HTML ΑΠΟΤΕΛΕΣΜΑΤΟΣ (με την κάρτα)
    els.quizContent.innerHTML = `
      <h3 class="quiz-results-title">${t("quizResultsTitle")}</h3>
      ${gapsHtml}
      
      <!-- 🏅 HERO CARD SECTION -->
      <div class="quiz-achievement-section" style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E4E6EA;">
        <h4 style="font-size: 1rem; font-weight: 700; margin: 0 0 12px; color: var(--color-text-muted);">
          🏅 ${state.lang === 'el' ? 'Η Κάρτα Σου' : 'Your Card'}
        </h4>
        <div style="max-width: 400px; margin: 0 auto;">
          <img src="${svgDataUrl}" alt="Achievement Card" style="width:100%; height:auto; border-radius:12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />
          <div style="display:flex; gap:10px; margin-top:14px; flex-wrap:wrap; justify-content:center;">
            <button type="button" class="quiz-download-btn" style="border:none; background:var(--color-accent); color:#FFFFFF; font-size:0.88rem; font-weight:600; padding:10px 18px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px;">
              ⬇️ ${state.lang === 'el' ? 'Κατέβασε την κάρτα' : 'Download card'}
            </button>
            <button type="button" class="quiz-share-btn" style="border:1px solid var(--color-accent); background:transparent; color:var(--color-accent); font-size:0.88rem; font-weight:600; padding:10px 18px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px;">
              📤 ${state.lang === 'el' ? 'Μοιράσου τη' : 'Share it'}
            </button>
          </div>
        </div>
      </div>

      <div class="quiz-results-actions" style="margin-top:24px;">
        <button type="button" class="quiz-retake-btn">${t("quizRetakeBtn")}</button>
        <button type="button" class="quiz-back-btn">${t("quizBackToStart")}</button>
      </div>
    `;

    // 🔽 EVENT LISTENERS
    // Download button
    els.quizContent.querySelector('.quiz-download-btn').addEventListener('click', () => {
      downloadSVG(encodedSvg, 'achievement.svg');
    });

    // Share button
    els.quizContent.querySelector('.quiz-share-btn').addEventListener('click', shareCard);

    // Retake button
    els.quizContent.querySelector('.quiz-retake-btn').addEventListener('click', () => {
      state.quizCurrentIndex = 0;
      state.quizAnswers = [];
      state.quizFinished = false;
      renderQuizView();
    });

    // Back button
    els.quizContent.querySelector('.quiz-back-btn').addEventListener('click', () => {
      resetQuizState();
      renderQuizView();
    });
  }

  // ---------- renderAchievementCard (ΝΕΑ ΣΥΝΑΡΤΗΣΗ) ----------
  function renderAchievementCard(gapTagIds) {
    // 1. Μάζεψε τα gapTags
    const gaps = gapTagIds.map(id => GAP_TAGS[id]).filter(Boolean);
    const isGreek = state.lang === "el";
    
    // 2. Δημιούργησε achievements
    let titles = gaps.map(g => isGreek ? g.achievementEl : g.achievementEn);
    let skillTags = gaps.map(g => isGreek ? g.skillTagEl : g.skillTagEn);
    let positiveMessages = gaps.map(g => isGreek ? g.positiveMessageEl : g.positiveMessageEn);
    let toolNames = gaps.map(g => {
      const toolId = g.recommendedToolIds?.[0];
      return toolId ? TOOLS[toolId]?.name : '';
    }).filter(Boolean);
    
    // 3. Αν κανένα κενό → γενικό achievement
    if (!titles.length) {
      titles = isGreek ? ["Ο Ολοκληρωμένος Μαθητής"] : ["The Complete Student"];
      skillTags = isGreek ? ["Όλες οι δεξιότητες σε καλό επίπεδο"] : ["All skills at a good level"];
      positiveMessages = isGreek ? ["Συνέχισε έτσι!"] : ["Keep it up!"];
      toolNames = [];
    }

    // 4. Κατασκευή SVG (Mobile-first, 400x500)
    const titleText = titles.join(' & ');
    const skillText = skillTags.join(' + ');
    const messageText = positiveMessages[0] || (isGreek ? 'Συνέχισε έτσι!' : 'Keep it up!');
    const toolText = toolNames.length 
      ? (isGreek ? '💡 Εξασκήσου με: ' : '💡 Practice with: ') + toolNames.join(', ')
      : (isGreek ? '💡 Συνέχισε την εξάσκηση!' : '💡 Keep practicing!');
    const emoji = gaps.length ? '🌟' : '🏆';
    const accentColor = gaps.length ? '#4CAF7D' : '#3B82C4';

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
        <!-- Background -->
        <rect width="400" height="500" rx="24" fill="#F8F9FA" stroke="#E4E6EA" stroke-width="2"/>
        
        <!-- Top accent line -->
        <rect width="400" height="6" rx="3" fill="${accentColor}"/>
        
        <!-- Emoji / Icon -->
        <text x="200" y="70" font-size="48" text-anchor="middle">${emoji}</text>
        
        <!-- Title (achievement name) -->
        <text x="200" y="120" font-size="22" font-weight="700" fill="#1F2430" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">
          ${escapeHtml(titleText)}
        </text>
        
        <!-- Subtitle: positive message -->
        <text x="200" y="160" font-size="14" fill="#5A6270" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">
          ${escapeHtml(messageText)}
        </text>
        
        <!-- Divider -->
        <line x1="60" y1="185" x2="340" y2="185" stroke="#E4E6EA" stroke-width="1"/>
        
        <!-- Skill tags -->
        <text x="200" y="220" font-size="13" font-weight="600" fill="${accentColor}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">
          ${isGreek ? '🔥 Δύναμη: ' : '🔥 Strength: '}${escapeHtml(skillText)}
        </text>
        
        <!-- Tool suggestion -->
        <text x="200" y="260" font-size="13" fill="#5A6270" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">
          ${escapeHtml(toolText)}
        </text>
        
        <!-- Footer -->
        <line x1="60" y1="310" x2="340" y2="310" stroke="#E4E6EA" stroke-width="1"/>
        <text x="200" y="345" font-size="12" fill="#9AA1B0" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">
          aitools4kids.vercel.app  🤖
        </text>
      </svg>
    `;

    return svg;
  }

  // ---------- Achievement Card: Download & Share (ΝΕΕΣ ΣΥΝΑΡΤΗΣΕΙΣ) ----------
  function downloadSVG(svgData, filename = 'achievement.svg') {
    const blob = new Blob([decodeURIComponent(svgData)], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function shareCard() {
    if (navigator.share) {
      navigator.share({
        title: 'Η κάρτα επίτευγμά μου',
        text: 'Ανακάλυψα τις δυνάμεις μου με το aitools4kids!',
        url: 'https://aitools4kids.vercel.app'
      }).catch(() => {
        // Αν ο χρήστης ακυρώσει, απλά κάνουμε fallback
        fallbackShare();
      });
    } else {
      fallbackShare();
    }
  }

  function fallbackShare() {
    navigator.clipboard.writeText('https://aitools4kids.vercel.app')
      .then(() => {
        alert('📋 Αντιγράφηκε το link! Μοιράσου το με τους φίλους σου.');
      })
      .catch(() => {
        prompt('Αντέγραψε αυτό το link:', 'https://aitools4kids.vercel.app');
      });
  }

  // ---------- Rendering: Prompt Generator ----------
  function renderPromptList() {
    const zonePrompts = (typeof PROMPTS !== "undefined" && PROMPTS[state.currentZone]) || [];
    els.promptList.innerHTML = "";

    if (!zonePrompts.length) {
      els.promptList.innerHTML = `<div class="empty-state">${t("promptsEmptyState")}</div>`;
      return;
    }

    zonePrompts.forEach((prompt) => {
      const subject = state.lang === "el" ? prompt.subjectEl : prompt.subjectEn;
      const taskType = state.lang === "el" ? prompt.taskTypeEl : prompt.taskTypeEn;
      const promptText = state.lang === "el" ? prompt.promptTextEl : prompt.promptTextEn;
      const tip = state.lang === "el" ? prompt.tipEl : prompt.tipEn;

      const card = document.createElement("article");
      card.className = "prompt-card";

      card.innerHTML = `
        <div class="prompt-card__header">
          <span class="prompt-card__subject">${escapeHtml(subject)}</span>
          <span class="prompt-card__task-type">${escapeHtml(taskType)}</span>
        </div>
        <p class="prompt-card__text">${escapeHtml(promptText)}</p>
        ${tip ? `<p class="prompt-card__tip"><strong>${t("tipLabel")}:</strong> ${escapeHtml(tip)}</p>` : ""}
        <button type="button" class="prompt-card__copy">${t("copyPrompt")}</button>
      `;

      const copyBtn = card.querySelector(".prompt-card__copy");
      copyBtn.addEventListener("click", () => copyPromptToClipboard(promptText, copyBtn));

      els.promptList.appendChild(card);
    });
  }

  function copyPromptToClipboard(text, buttonEl) {
    const originalLabel = t("copyPrompt");
    const copiedLabel = t("copiedPrompt");

    const markCopied = () => {
      buttonEl.textContent = copiedLabel;
      buttonEl.classList.add("copied");
      setTimeout(() => {
        buttonEl.textContent = originalLabel;
        buttonEl.classList.remove("copied");
      }, 1800);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(markCopied).catch(() => {
        fallbackCopy(text);
        markCopied();
      });
    } else {
      fallbackCopy(text);
      markCopied();
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      // Σιωπηλή αποτυχία, ο χρήστης μπορεί ακόμα να επιλέξει το κείμενο χειροκίνητα.
    }
    document.body.removeChild(textarea);
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
    resetQuizState(); // το quiz είναι per-ζώνη, οπότε ξεκινάμε καθαρά
    showPathView();
  }

  function selectRole(roleId) {
    state.currentRole = roleId;
    renderRoleTabs();
    renderPathContent();
  }

  function selectView(viewId) {
    if (viewId !== "tools" && viewId !== "prompts" && viewId !== "quiz") return;
    state.currentView = viewId;
    renderViewTabs();
    if (viewId === "quiz") {
      renderQuizView();
    }
  }

  function showPathView() {
    els.zoneSelectView.hidden = true;
    els.pathView.hidden = false;
    state.currentView = "tools"; // πάντα ξεκινάμε από τα εργαλεία όταν μπαίνουμε σε νέα ζώνη
    renderRoleTabs();
    renderPathContent();
    renderViewTabs();
    renderPromptList();
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
      renderPromptList();
      if (state.currentView === "quiz") {
        renderQuizView();
      }
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
    els.viewTabTools.addEventListener("click", () => selectView("tools"));
    els.viewTabPrompts.addEventListener("click", () => selectView("prompts"));
    els.viewTabQuiz.addEventListener("click", () => selectView("quiz"));
  }

  document.addEventListener("DOMContentLoaded", init);
})();
