/* Homepage v11 — task-first.
 * Scope: homepage only. The core app, routing, language system and school views
 * stay untouched; legacy homepage blocks remain in the DOM (other scripts may
 * reference them) but are hidden here.
 *
 * Flow:
 *   1. "What do you want to do today?" — six task tiles (one click).
 *   2. The destination button appears at once. A school level is an optional
 *      accelerator: every task has a sensible level-free destination that asks
 *      for the level itself. A role is asked only where it changes the route.
 *   3. Pathways (parents, preschool, EPAL, special education, GSL, university)
 *      and "Learn another way" sit below, never competing with the main task.
 *
 * The routing contract of the previous finder is preserved exactly whenever a
 * level is chosen (EPAL practice → EPAL diagnostic, Special Education practice
 * → diagnostic, primary help → adult pathway, …). The selection is shared with
 * the rest of the site through sessionStorage "aitools4kidsShortcutSelection".
 */
(function(){
  "use strict";

  const signLanguageConceptCount = Number(window.AITOOLSKIDS_SITE_META?.signLanguageConceptCount) || 167;

  function isHome(){
    return location.pathname === "/" || location.pathname === "";
  }
  if(isHome()) document.documentElement.classList.add("home-v8-active", "home-v11");

  // "Find an AI tool" is the core of the site, so it comes first.
  const TASKS = ["tools", "study", "practice", "stuck", "organize", "teacher"];
  const TONE = { study: "study", practice: "practice", stuck: "help", organize: "organize", teacher: "teacher", tools: "tools" };
  const LEVEL_TASKS = ["study", "practice", "stuck", "tools"];

  const COPY = {
    el: {
      subtitle: "Δες πού χρειάζεται λίγο περισσότερη εξάσκηση ο μαθητής, μελέτησε με βάση τη σχολική ύλη και βρες το σωστό AI για κάθε ανάγκη. Για μαθητές 6–18, γονείς και εκπαιδευτικούς.",
      identity: ["Δωρεάν", "Ανεξάρτητο", "Ελληνικά / English"],
      question: "Τι θέλεις να κάνεις σήμερα;",
      questionHint: "Διάλεξε ένα. Θα σου δείξουμε από πού να ξεκινήσεις.",
      epalHint: "Διαδρομή ΕΠΑΛ: διάλεξε τι θέλεις να κάνεις. Τάξη, τομέα και ειδικότητα θα τα επιλέξεις στο επόμενο βήμα.",
      tasks: {
        study: ["Να διαβάσω ένα μάθημα", "Εξήγηση, σύνοψη, κάρτες, quiz"],
        practice: ["Εξάσκηση ή τεστ", "Σύντομα κουίζ 2 λεπτών, χωρίς βαθμό"],
        stuck: ["Κόλλησα σε μια άσκηση", "Υποδείξεις βήμα βήμα"],
        organize: ["Να οργανώσω το διάβασμα", "Μικρά, εφικτά βήματα"],
        teacher: ["Είμαι εκπαιδευτικός", "Φτιάχνω υλικό για την τάξη"],
        tools: ["Να βρω AI εργαλείο", "Κατάλογος ανά ανάγκη και ηλικία"]
      },
      explain: {
        study: "Η AI Μελέτη: διαλέγεις ενότητα από τη σχολική ύλη ή ανεβάζεις τις σημειώσεις σου και μετά επιλέγεις εξήγηση, σύνοψη, ακουστικό μάθημα, κάρτες ή quiz.",
        practice: "Ο Χάρτης Εξάσκησης: σύντομες ερωτήσεις που δείχνουν πού χρειάζεται λίγη παραπάνω εξάσκηση. Δεν βαθμολογεί και δεν κάνει διάγνωση.",
        stuck: "Η AI Βοήθεια σε καθοδηγεί, δεν δίνει έτοιμη λύση. Για ολόκληρη ενότητα, διάλεξε «Να διαβάσω ένα μάθημα».",
        organize: "Σπάει το διάβασμα σε μικρά, εφικτά βήματα, ώστε να ξέρεις τι κάνεις σήμερα και τι αύριο.",
        teacher: "Φύλλα εργασίας, αξιολόγηση, σχέδια μαθήματος και βίντεο πάνω στην ύλη 2026–27. Εσύ ελέγχεις και προσαρμόζεις.",
        tools: "Εξωτερικά AI εργαλεία με ηλικιακά όρια, προσβασιμότητα και αναζήτηση ανά σχολική ανάγκη."
      },
      studyOfficial: "Βασισμένη στο επίσημο σχολικό βιβλίο · Ύλη 2026–27. Η κάλυψη σχολικών βιβλίων είναι επιλεκτική.",
      levelLabel: "Βαθμίδα",
      levelOptional: "προαιρετικά, για πιο γρήγορη αρχή",
      roleLabel: "Ποιος θα τη χρησιμοποιήσει;",
      roles: { student: "Μαθητής / Μαθήτρια", guardian: "Γονιός" },
      zones: { primary: ["Δημοτικό","6–12"], middle: ["Γυμνάσιο","12–15"], high: ["ΓΕΛ","15–18"], epal: ["ΕΠΑΛ","15–18"], special: ["Ειδική Εκπαίδευση",""], preschool: ["Νηπιαγωγείο","4–6"] },
      cta: { study: "Άνοιξε την AI Μελέτη", practice: "Άνοιξε τον Χάρτη Εξάσκησης", stuck: "Άνοιξε την AI Βοήθεια", organize: "Σπάσε το διάβασμα σε μικρά βήματα", teacher: "Άνοιξε τα εργαλεία εκπαιδευτικού", tools: "Δες τα AI εργαλεία" },
      ctaPreschool: "Δραστηριότητες Νηπιαγωγείου", ctaSpecial: "Άνοιξε την Ειδική Εκπαίδευση", ctaSpecialPractice: "Κάνε το μικρό διαγνωστικό",
      ctaEpalHelp: "Άνοιξε βοήθεια για τα μαθήματα ΕΠΑΛ", ctaPracticeGel: "Χάρτης Εξάσκησης ΓΕΛ", ctaPracticeEpal: "Χάρτης Εξάσκησης ΕΠΑΛ",
      pdf: "Έχω δικό μου PDF ή σημειώσεις →",
      knownUnit: "Ξέρεις την ενότητα; Κάνε εξάσκηση σε αυτή →",
      allTools: "Όλος ο κατάλογος, χωρίς φίλτρο βαθμίδας →",
      teacherLabel: "Ή πήγαινε κατευθείαν σε:",
      studyGoalsLabel: "Τι θέλεις να κάνεις με την ενότητα;",
      studyGoals: [["understand","Να το καταλάβω"],["revise","Επανάληψη"],["test","Γράφω τεστ"],["pdf","Έχω PDF ή σημειώσεις"]],
      helpStepsLabel: "Πώς δουλεύει",
      helpSteps: ["Γράψε την άσκηση και τι δοκίμασες", "Πάρε μία υπόδειξη", "Δοκίμασε ξανά μόνος/η σου"],
      teacherTasks: [["worksheet","Φύλλο εργασίας"],["assessment","Αξιολόγηση"],["lesson","Σχέδιο μαθήματος"],["video","Βίντεο"]],
      notePrimary: "Στο Δημοτικό η AI Βοήθεια ανοίγει στη διαδρομή του ενήλικα, μαζί με γονέα ή εκπαιδευτικό.",
      notePreschool: "Στο Νηπιαγωγείο ο ενήλικας χειρίζεται το εργαλείο.",
      noteSpecial: "Ειδικό Γυμνάσιο, Ειδικό Λύκειο και ΕΝ.Ε.Ε.ΓΥ.-Λ., με προσαρμοσμένη γλώσσα και ρυθμό.",
      pathsTitle: "Διαδρομές για",
      paths: {
        parents: ["Γονείς", "Πώς βοηθάς χωρίς να κάνεις τη δουλειά"],
        preschool: ["Νηπιαγωγείο · 4–6", "Δραστηριότητες με ενήλικα"],
        epal: ["Μαθητές ΕΠΑΛ", "Τάξη, τομέας, ειδικότητα"],
        special: ["Ειδική Εκπαίδευση", "Ειδικό Γυμνάσιο, Ειδικό Λύκειο, ΕΝ.Ε.Ε.ΓΥ.-Λ."],
        university: ["Φοιτητές ΑΕΙ · Πιλοτικό", "Επιλεγμένα τμήματα, επίσημες πηγές"]
      },
      engTitle: "Ελληνική Νοηματική",
      engDesc: `${signLanguageConceptCount} σχολικές έννοιες με απλή εξήγηση και επίσημο βίντεο ΕΝΓ`,
      engLink: `Δες τις ${signLanguageConceptCount} έννοιες →`,
      moreTitle: "Μάθε αλλιώς",
      more: {
        curriculum: ["Βρες την ενότητα που διαβάζεις", "Χάρτης Ύλης 2026–27: τάξη → μάθημα → ενότητα", "Άνοιξε την ύλη 2026–27 →"],
        characters: ["Μίλα με χαρακτήρα της Ιστορίας", "Διάλογος με πρόσωπα από την ύλη", "Ξεκίνα μια συζήτηση →"],
        play: ["Παίξε & Μάθε", "Μικρές αποστολές μάθησης", "Δες τα παιχνίδια →"],
        aiPaths: ["Ξέρεις πότε το AI κάνει λάθος;", "AI Διαδρομές: σωστή και ασφαλής χρήση", "Ξεκίνα μια AI Διαδρομή →"],
        video: ["Δημιούργησε εκπαιδευτικό βίντεο", "Από την ύλη ή δικό σου κείμενο/PDF, με ελληνική αφήγηση και υπότιτλους", "Δοκίμασέ το →"]
      },
      trustTitle: "Πώς δουλεύει",
      aiTechSummary: "ⓘ Ποιο AI χρησιμοποιείται;",
      aiTechText: "GPT-OSS 120B μέσω Cloudflare Workers AI, με Groq ως εφεδρικό πάροχο. Το Puter είναι προαιρετική εναλλακτική.",
      aiTechLink: "Διαφάνεια AI →",
      selected: "Επιλεγμένο"
    },
    en: {
      subtitle: "See where a student needs a little more practice, study from the school curriculum and find the right AI for every need. For students aged 6–18, parents and educators.",
      identity: ["Free", "Independent", "Ελληνικά / English"],
      question: "What do you want to do today?",
      questionHint: "Pick one. We will show you where to start.",
      epalHint: "EPAL pathway: choose what you want to do. You will pick your grade, sector and specialty in the next step.",
      tasks: {
        study: ["Study a lesson", "Explanation, summary, cards, quiz"],
        practice: ["Practise or take a quiz", "Short 2-minute quizzes, no grades"],
        stuck: ["I'm stuck on an exercise", "Step-by-step hints"],
        organize: ["Plan my studying", "Small, doable steps"],
        teacher: ["I'm an educator", "Create class material"],
        tools: ["Find an AI tool", "Catalogue by need and age"]
      },
      explain: {
        study: "AI Study: choose a curriculum unit or upload your notes, then pick an explanation, summary, audio lesson, cards or a quiz.",
        practice: "The Practice Map: short questions that show where a little more practice helps. It does not grade or diagnose.",
        stuck: "AI Help guides you; it does not hand out answers. For a whole unit, choose “Study a lesson”.",
        organize: "Breaks studying into small, doable steps so you know what to do today and tomorrow.",
        teacher: "Worksheets, assessment, lesson plans and videos built on the 2026–27 curriculum. You review and adapt.",
        tools: "External AI tools with age limits, accessibility notes and search by school need."
      },
      studyOfficial: "Based on the official school textbook · Curriculum 2026–27. Textbook coverage is selective.",
      levelLabel: "Level",
      levelOptional: "optional, for a quicker start",
      roleLabel: "Who will use it?",
      roles: { student: "Student", guardian: "Parent" },
      zones: { primary: ["Primary","6–12"], middle: ["Middle School","12–15"], high: ["General Lyceum","15–18"], epal: ["EPAL","15–18"], special: ["Special Education",""], preschool: ["Preschool","4–6"] },
      cta: { study: "Open AI Study", practice: "Open the Practice Map", stuck: "Open AI Help", organize: "Break it into small steps", teacher: "Open the educator tools", tools: "See the AI tools" },
      ctaPreschool: "Preschool activities", ctaSpecial: "Open Special Education", ctaSpecialPractice: "Take the short check",
      ctaEpalHelp: "Open EPAL subject help", ctaPracticeGel: "General Lyceum Practice Map", ctaPracticeEpal: "Vocational Lyceum (EPAL) Practice Map",
      pdf: "I have my own PDF or notes →",
      knownUnit: "Know your unit? Practise that unit →",
      allTools: "The whole catalogue, no level filter →",
      teacherLabel: "Or go straight to:",
      studyGoalsLabel: "What do you want to do with the unit?",
      studyGoals: [["understand","Understand it"],["revise","Review"],["test","Test coming up"],["pdf","I have a PDF or notes"]],
      helpStepsLabel: "How it works",
      helpSteps: ["Write the exercise and what you tried", "Get one hint", "Try again on your own"],
      teacherTasks: [["worksheet","Worksheet"],["assessment","Assessment"],["lesson","Lesson plan"],["video","Video"]],
      notePrimary: "In primary school, AI Help opens in the adult pathway, used together with a parent or educator.",
      notePreschool: "In preschool the adult operates the tool.",
      noteSpecial: "Special Gymnasium, Special Lyceum and EN.E.E.GY.-L., with adapted language and pace.",
      pathsTitle: "Pathways for",
      paths: {
        parents: ["Parents", "How to help without doing the work"],
        preschool: ["Preschool · 4–6", "Adult-led activities"],
        epal: ["EPAL students", "Grade, sector, specialty"],
        special: ["Special Education", "Special Gymnasium, Special Lyceum, EN.E.E.GY.-L."],
        university: ["University students · Pilot", "Selected departments, official sources"]
      },
      engTitle: "Greek Sign Language",
      engDesc: `${signLanguageConceptCount} school concepts with a simple explanation and official GSL video`,
      engLink: `See the ${signLanguageConceptCount} concepts →`,
      moreTitle: "Learn another way",
      more: {
        curriculum: ["Find the unit you are studying", "Curriculum Map 2026–27: grade → subject → unit", "Open the 2026–27 curriculum →"],
        characters: ["Talk with a character from history", "A dialogue with people from the curriculum", "Start a conversation →"],
        play: ["Play & Learn", "Short learning missions", "See the games →"],
        aiPaths: ["Can you tell when AI is wrong?", "AI Paths: using AI wisely and safely", "Start an AI Path →"],
        video: ["Create an educational video", "From the curriculum or your own text/PDF, with Greek narration and subtitles", "Try it →"]
      },
      trustTitle: "How it works",
      aiTechSummary: "ⓘ Which AI is used?",
      aiTechText: "GPT-OSS 120B via Cloudflare Workers AI, with Groq as the fallback provider. Puter is an optional alternative.",
      aiTechLink: "AI transparency →",
      selected: "Selected"
    }
  };

  function isEnglish(){
    return !!document.getElementById("langEn")?.classList.contains("active") ||
      (document.documentElement.lang || "").toLowerCase().startsWith("en");
  }
  function currentCopy(){ return isEnglish() ? COPY.en : COPY.el; }
  function escapeHtml(value){
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }
  function icon(key){
    const icons = window.AITOOLSKIDS_IA?.icons || {};
    const map = { stuck: "help" };
    return icons[map[key] || key] || "";
  }

  function ensureStyles(){
    let link = document.querySelector('link[data-navigator-home="1"]');
    if(link) return link;
    link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/navigator-home.css";
    link.dataset.navigatorHome = "1";
    document.head.appendChild(link);
    return link;
  }

  function revealHomepage(link){
    let done = false;
    const reveal = () => {
      if(done) return;
      done = true;
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("navigator-home-booting");
        document.documentElement.classList.add("navigator-home-ready");
      });
    };
    if(link?.sheet) reveal();
    else if(link){
      link.addEventListener("load", reveal, {once:true});
      link.addEventListener("error", reveal, {once:true});
      setTimeout(reveal, 700);
    }else reveal();
  }

  /* ---------- State (shared with site-chrome.js through sessionStorage) ---------- */
  const SEL_KEY = "aitools4kidsShortcutSelection";
  const shortcutIntent = () => location.hash === "#open-tools" ? "tools" : location.hash === "#open-help" ? "stuck" : "";
  const finderState = { role: "student", zone: "", need: "" };
  try {
    const saved = JSON.parse(sessionStorage.getItem(SEL_KEY) || "null");
    if(saved){
      if(["student","guardian"].includes(saved.role)) finderState.role = saved.role;
      if(["primary","middle","high","epal","preschool","special"].includes(saved.zone)) finderState.zone = saved.zone;
      if(TASKS.includes(saved.need) || saved.need === "pdf") finderState.need = saved.need === "pdf" ? "study" : saved.need;
    }
  } catch {}
  function saveState(){
    try {
      const saved = JSON.parse(sessionStorage.getItem(SEL_KEY) || "null") || {};
      sessionStorage.setItem(SEL_KEY, JSON.stringify(Object.assign(saved, { role: finderState.role, zone: finderState.zone, need: finderState.need })));
    } catch {}
  }
  const currentNeed = () => shortcutIntent() || finderState.need;

  /* ---------- Routing contract ---------- */
  function finderHref(needOverride){
    const { role, zone } = finderState;
    const need = needOverride || currentNeed();
    if(need === "teacher") return "/teacher-assistant.html";
    if(zone === "preschool") return "/preschool";
    if(zone === "special") return "/special-education.html";
    if(need === "organize") return "/organosi-meletis-ai.html";
    if(!zone){
      if(need === "pdf") return "/study.html#studyNotes";
      return { study: "/study.html", practice: "/practice.html", stuck: "/tools/ai-help.html", tools: "/tools/" }[need] || "/study.html";
    }
    if(need === "study" || need === "pdf") return `/study.html?zone=${zone === "epal" ? "high" : zone}${zone === "epal" ? "&schoolType=epal" : ""}${need === "pdf" ? "#studyNotes" : ""}`;
    if(zone === "epal") return `/high/${role === "guardian" ? "guardian" : "student"}/${need === "tools" ? "tools" : "tutor"}?schoolType=epal`;
    if(need === "practice") return `/${zone}/guardian/quiz`;
    if(need === "stuck"){
      if(zone === "primary") return "/primary/guardian/tutor";
      return `/${zone}/${role === "student" ? "student" : "guardian"}/tutor`;
    }
    return `/${zone}/${role === "student" ? "student" : "guardian"}/tools`;
  }

  function finderCta(c){
    const { zone } = finderState;
    const need = currentNeed();
    if(need === "teacher") return c.cta.teacher;
    if(zone === "preschool") return c.ctaPreschool;
    if(zone === "special") return need === "practice" ? c.ctaSpecialPractice : c.ctaSpecial;
    if(need === "organize") return c.cta.organize;
    if(zone === "epal" && need !== "study" && need !== "practice" && need !== "tools") return c.ctaEpalHelp;
    if(zone === "high" && need === "practice") return c.ctaPracticeGel;
    const base = c.cta[need] || c.cta.study;
    return zone ? `${base} · ${c.zones[zone][0]}` : base;
  }

  function practiceTrigger(){
    const { zone } = finderState;
    if(currentNeed() !== "practice") return "";
    return zone === "special" ? " data-special-education-diagnostic" : zone === "epal" ? " data-epal-practice-map" : "";
  }

  function stepExtras(c){
    const { zone } = finderState;
    const need = currentNeed();
    const out = [];
    if(need === "practice" && zone && zone !== "preschool" && zone !== "special"){
      out.push(`<a class="home-v9-finder__extra" href="/study.html?zone=${zone === "epal" ? "high" : zone}&mode=practice${zone === "epal" ? "&schoolType=epal" : ""}">${escapeHtml(c.knownUnit)}</a>`);
      if(zone === "high") out.push(`<a class="home-v9-finder__extra" href="/high/student/tutor?schoolType=epal" data-epal-practice-map>${escapeHtml(c.ctaPracticeEpal)} <span aria-hidden="true">→</span></a>`);
    }
    if(need === "tools" && zone) out.push(`<a class="home-v9-finder__extra" href="/tools/">${escapeHtml(c.allTools)}</a>`);
    return out.join("");
  }

  function stepNote(c){
    const { zone } = finderState;
    const need = currentNeed();
    if(zone === "preschool") return c.notePreschool;
    if(zone === "special") return c.noteSpecial;
    if(zone === "primary" && need === "stuck") return c.notePrimary;
    return "";
  }

  /* ---------- Rendering ---------- */
  function chip(kind, value, label, pressed, small){
    return `<button type="button" class="home-v9-chip home-v11-chip" data-finder-${kind}="${value}" aria-pressed="${pressed ? "true" : "false"}"><span>${escapeHtml(label)}</span>${small ? `<small>${escapeHtml(small)}</small>` : ""}</button>`;
  }

  function stepMarkup(c){
    const need = currentNeed();
    if(!need) return "";
    const tone = TONE[need];
    const explain = `<p class="home-v11-step__explain">${escapeHtml(c.explain[need])}</p>`;
    const official = need === "study" ? `<p class="home-v11-step__official">${escapeHtml(c.studyOfficial)}</p>` : "";
    let body = "";
    if(need === "teacher"){
      body = `<p class="home-v11-step__label">${escapeHtml(c.teacherLabel)}</p>
        <div class="home-v11-step__links">${c.teacherTasks.map(([id,label]) => `<a href="/teacher-assistant.html?task=${id}#builder">${escapeHtml(label)}</a>`).join("")}</div>`;
    }else if(LEVEL_TASKS.includes(need)){
      const zones = Object.entries(c.zones).map(([id,[label,age]]) => chip("zone", id, label, finderState.zone === id, age)).join("");
      body = `<div class="home-v9-finder__step home-v11-step__group" role="group" aria-labelledby="homeV11LevelLabel">
          <p class="home-v11-step__label" id="homeV11LevelLabel">${escapeHtml(c.levelLabel)} <small>(${escapeHtml(c.levelOptional)})</small></p>
          <div class="home-v9-finder__chips">${zones}</div>
        </div>`;
      // Ask "who will use it?" only where it changes the destination.
      const roleMatters = (need === "tools" && ["primary","middle","high","epal"].includes(finderState.zone)) ||
        (need === "stuck" && ["middle","high","epal"].includes(finderState.zone));
      if(roleMatters){
        const roles = Object.entries(c.roles).map(([id,label]) => chip("role", id, label, finderState.role === id)).join("");
        body += `<div class="home-v9-finder__step home-v11-step__group" role="group" aria-labelledby="homeV11RoleLabel">
          <p class="home-v11-step__label" id="homeV11RoleLabel">${escapeHtml(c.roleLabel)}</p>
          <div class="home-v9-finder__chips">${roles}</div>
        </div>`;
      }
    }
    // Study: go straight to the study goal (same options as inside AI Study), carrying the level.
    if(need === "study" && finderState.zone !== "special" && finderState.zone !== "preschool"){
      const z = finderState.zone;
      const base = z ? `/study.html?zone=${z === "epal" ? "high" : z}${z === "epal" ? "&schoolType=epal" : ""}&` : "/study.html?";
      const links = c.studyGoals.map(([id,label]) => id === "pdf"
        ? `<a id="homeV11PdfLink" data-finder-pdf href="${finderHref("pdf")}">${escapeHtml(label)}</a>`
        : `<a data-study-goal="${id}" href="${base}mode=${id}">${escapeHtml(label)}</a>`).join("");
      body += `<div class="home-v11-step__group" role="group" aria-labelledby="homeV11GoalLabel">
          <p class="home-v11-step__label" id="homeV11GoalLabel">${escapeHtml(c.studyGoalsLabel)}</p>
          <div class="home-v11-step__links">${links}</div>
        </div>`;
    }
    // Help: the three-step promise (attempt → hint → try again) that the old AI Help card showed.
    const helpSteps = need === "stuck" && finderState.zone !== "special" && finderState.zone !== "preschool"
      ? `<ol class="home-v11-steps" aria-label="${escapeHtml(c.helpStepsLabel)}">${c.helpSteps.map((t, i) => `<li><span aria-hidden="true">${i + 1}</span>${escapeHtml(t)}</li>`).join("")}</ol>`
      : "";
    const note = stepNote(c);
    return `<div class="home-v11-step ia-tone--${tone}" id="homeV11Step" data-need="${need}">
      <h3 class="home-v11-step__title" id="homeV11StepTitle" tabindex="-1">${escapeHtml(c.tasks[need][0])}</h3>
      ${explain}${helpSteps}${official}${body}
      ${note ? `<p class="home-v9-finder__note home-v11-step__note" aria-live="polite">${escapeHtml(note)}</p>` : ""}
      <div class="home-v11-step__actions">
        <a class="home-v9-way__action home-v11-cta" id="homeV9FinderCta" href="${finderHref()}"${practiceTrigger()}>${escapeHtml(finderCta(c))} <span aria-hidden="true">→</span></a>
        ${stepExtras(c)}
      </div>
    </div>`;
  }

  function renderFinder(){
    const mount = document.getElementById("homeV9Finder");
    if(!mount) return;
    const c = currentCopy();
    const need = currentNeed();
    const tiles = TASKS.map((id) => `
      <li><button type="button" class="home-v11-task ia-tone--${TONE[id]}" data-finder-need="${id}" aria-pressed="${need === id ? "true" : "false"}" aria-controls="homeV11StepMount">
        <span class="home-v11-task__icon">${icon(id)}</span>
        <span class="home-v11-task__copy"><strong>${escapeHtml(c.tasks[id][0])}</strong><small>${escapeHtml(c.tasks[id][1])}</small></span>
      </button></li>`).join("");
    mount.innerHTML = `
      <h2 class="home-v11-question" id="homeV8FinderTitle" tabindex="-1">${escapeHtml(c.question)}</h2>
      <p class="home-v11-question__hint${finderState.zone === "epal" && !need ? " home-v11-question__hint--epal" : ""}">${escapeHtml(finderState.zone === "epal" && !need ? c.epalHint : c.questionHint)}</p>
      <ul class="home-v11-tasks" aria-labelledby="homeV8FinderTitle">${tiles}</ul>
      <div id="homeV11StepMount" aria-live="polite">${stepMarkup(c)}</div>`;
  }

  function ensureHeroCopy(){
    const c = currentCopy();
    const title = document.querySelector("#zoneSelectView .hero__title[data-i18n='heroTitle']");
    const subtitle = document.querySelector("#zoneSelectView .hero__subtitle[data-i18n='heroSubtitle']");
    if(title && !isEnglish()) title.textContent = "Μαθαίνω Έξυπνα με AI";
    if(subtitle) subtitle.textContent = c.subtitle;
  }

  function ensureIdentity(){
    const badges = document.querySelector("#zoneSelectView .hero__badges");
    if(!badges) return;
    badges.classList.add("home-v11-identity");
    const en = isEnglish();
    const set = (sel, el, enText) => { const node = badges.querySelector(sel); if(node && node.textContent !== (en ? enText : el)) node.textContent = en ? enText : el; };
    set(".badge--free", "Δωρεάν", "Free");
    set('[data-i18n="badgeIndependent"]', "Ανεξάρτητο", "Independent");
    set('[data-i18n="badgeBilingual"]', "Ελληνικά / English", "Ελληνικά / English");
    set('summary[data-i18n="badgeZeroTracking"]', "Χωρίς cookies", "No cookies");
    document.getElementById("homeEngBadge")?.remove();
  }

  function hideLegacyHomeBlocks(){
    [
      "#zoneSelectView .hero__learning-loop", "#zoneSelectView .hero__map-pair", "#zoneSelectView .hero__quiz-cta-wrap",
      "#zoneSelectView .hero__ai-help", "#homeAiLearningModes", "#zoneSelectView > .section-heading",
      "#zoneSelectView > .section-subheading", "#zoneGrid", "#homeVideoNew", "#homeV9Principle"
    ].forEach((sel) => document.querySelector(sel)?.classList.add("home-v8-legacy"));
    suppressLegacyInjectedBlocks();
  }
  function suppressLegacyInjectedBlocks(){
    ["pwaMobileLauncher", "curriculumMapFeature", "signLanguageFeature", "specialEducationHomeFeature", "homeAllToolsShortcut"]
      .forEach((id) => document.getElementById(id)?.classList.add("home-v8-legacy"));
  }

  function card(id, key, title, desc, href, extraClass){
    return `<li><a class="home-v11-card ${extraClass || ""}" ${id ? `id="${id}"` : ""} href="${href}">
      <span class="home-v11-card__icon">${icon(key)}</span>
      <span class="home-v11-card__copy"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(desc)}</small></span>
      <span class="home-v11-card__arrow" aria-hidden="true">→</span></a></li>`;
  }

  function pathsMarkup(){
    const c = currentCopy();
    const p = c.paths;
    return `<h2 class="home-v11-h2" id="homeV11PathsTitle">${escapeHtml(c.pathsTitle)}</h2>
      <ul class="home-v11-cards">
        ${card("", "parents", p.parents[0], p.parents[1], "/ai-gia-goneis.html")}
        ${card("", "preschool", p.preschool[0], p.preschool[1], "/preschool")}
        ${card("homeV11Epal", "epal", p.epal[0], p.epal[1], "/#epal")}
        ${card("homeV11Special", "special", p.special[0], p.special[1], "/special-education.html")}
        <li id="homeV11EngSlot"></li>
        ${card("", "university", p.university[0], p.university[1], "/higher-education-pilot.html")}
      </ul>`;
  }

  function ensureEngSection(slot, detached){
    let box = document.getElementById("homeV8Eng") || detached;
    if(!box) return;
    const c = currentCopy();
    box.className = "home-v8-eng home-v11-eng";
    box.innerHTML = `<a class="home-v11-card" href="/sign-language.html">
        <span class="home-v11-card__icon">${icon("gsl")}</span>
        <span class="home-v11-card__copy"><strong id="homeV8EngTitle">${escapeHtml(c.engTitle)}</strong><small>${escapeHtml(c.engDesc)}</small></span>
        <span class="home-v11-card__link">${escapeHtml(c.engLink)}</span></a>`;
    if(slot && box.parentElement !== slot) slot.appendChild(box);
  }

  function moreMarkup(){
    const c = currentCopy();
    const m = c.more;
    const faces = [["socrates"],["pericles"],["greek-revolution-1821"]].map(([f]) => `<img src="/assets/characters/${f}.png" alt="" width="28" height="28" decoding="async">`).join("");
    const tile = (id, key, data, href, lead) => `<li><a class="home-v11-tile" id="${id}" href="${href}">
        ${lead || `<span class="home-v11-tile__icon">${icon(key)}</span>`}
        <strong>${escapeHtml(data[0])}</strong><small>${escapeHtml(data[1])}</small><span class="home-v9-tile__cta">${escapeHtml(data[2])}</span></a></li>`;
    return `<h2 class="home-v11-h2" id="homeV9MoreTitle">${escapeHtml(c.moreTitle)}</h2>
      <ul class="home-v9-more__grid home-v11-tiles">
        ${tile("homeV9CurriculumTile", "curriculum", m.curriculum, "/xartis-ylis.html")}
        ${tile("homeV9Characters", "characters", m.characters, "/history-characters.html", `<span class="home-v11-tile__faces" aria-hidden="true">${faces}</span>`)}
        ${tile("homeV9Play", "play", m.play, "/play/")}
        ${tile("homeV9Video", "video", m.video, "/teacher-assistant.html?task=video#builder", `<span class="home-v11-tile__icon"><svg class="ia-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></svg></span>`)}
      </ul>`;
  }

  function trustMarkup(){
    const c = currentCopy();
    return `<h2 class="home-v9-visually-hidden">${escapeHtml(c.trustTitle)}</h2>
      <details class="home-v8-ai__tech" id="homeV8AiTechDetails">
        <summary>${escapeHtml(c.aiTechSummary)}</summary>
        <p>${escapeHtml(c.aiTechText)} <a href="/ai-transparency.html">${escapeHtml(c.aiTechLink)}</a></p>
      </details>`;
  }

  function ensureSection(parent, id, className, labelledBy, markup){
    let el = document.getElementById(id);
    if(!el){
      el = document.createElement("section");
      el.id = id;
      el.className = className;
      if(labelledBy) el.setAttribute("aria-labelledby", labelledBy);
    }
    const keepOpen = el.querySelector("details[open]")?.id;
    el.innerHTML = markup;
    if(keepOpen) el.querySelector("#" + keepOpen)?.setAttribute("open", "");
    if(el.parentElement !== parent) parent.appendChild(el);
    return el;
  }

  function placeSearchFirst(){
    const mount = document.getElementById("siteHeaderSearch");
    const search = document.getElementById("homeGlobalSearch");
    if(mount && search && search.parentElement !== mount) mount.appendChild(search);
  }

  function ensureMainShell(){
    const hero = document.querySelector("#zoneSelectView .hero");
    if(!hero) return null;
    let shell = document.getElementById("homeV8Shell");
    if(!shell){
      shell = document.createElement("div");
      shell.id = "homeV8Shell";
      shell.className = "home-v8-shell home-v11-shell";
      const anchor = document.getElementById("homeV9Top");
      if(anchor) anchor.insertAdjacentElement("afterend", shell);
      else hero.appendChild(shell);
    }
    ["homeV8HelpersMount", "homeV8Needs", "homeCurriculumStrip", "homeV9ZonesLead"].forEach((id) => document.getElementById(id)?.remove());
    // Keep the crawlable GSL node alive: detach it before the pathways markup is rebuilt.
    const eng = document.getElementById("homeV8Eng");
    if(eng && eng.closest("#homeV11Paths")) eng.remove();
    const paths = ensureSection(shell, "homeV11Paths", "home-v11-section home-v11-paths", "homeV11PathsTitle", pathsMarkup());
    ensureEngSection(paths.querySelector("#homeV11EngSlot"), eng);
    ensureSection(shell, "homeV9More", "home-v11-section home-v9-more home-v11-more", "homeV9MoreTitle", moreMarkup());
    const trust = ensureSection(shell, "homeV11Trust", "home-v11-trust", "", trustMarkup());
    const notGuide = document.querySelector("#zoneSelectView .not-guide-box");
    if(notGuide && notGuide.parentElement !== trust) trust.insertBefore(notGuide, trust.firstChild.nextSibling);
    return shell;
  }

  function apply(){
    if(!isHome()) return;
    document.documentElement.classList.add("home-v8-active", "home-v11");
    const styleLink = ensureStyles();
    hideLegacyHomeBlocks();
    ensureHeroCopy();
    ensureIdentity();
    renderFinder();
    ensureMainShell();
    suppressLegacyInjectedBlocks();
    revealHomepage(styleLink);
  }

  window.AITOOLSKIDS_REFRESH_HOME = apply;
  window.AITOOLSKIDS_HOME_FINDER = { state: finderState, href: finderHref };

  function isSpaRoute(pathname){
    return /^\/(primary|middle|high)\/(guardian|student)\/(tools|advanced|prompts|quiz|tutor|guide)\/?$/.test(pathname);
  }
  function openSpaRoute(link){
    const url = new URL(link.href, location.origin);
    if(url.origin !== location.origin || !isSpaRoute(url.pathname)) return false;
    history.pushState({}, "", url.pathname + url.search + url.hash);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({top:0, behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
    return true;
  }

  function revealStep(){
    const step = document.getElementById("homeV11Step");
    if(!step) return;
    const rect = step.getBoundingClientRect();
    if(rect.top < 0 || rect.top > window.innerHeight - 120){
      step.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  }

  // "EPAL students" pathway: preselect EPAL and let the student choose the task
  // (AI tools, study, practice, help). Every task then uses the existing EPAL routes.
  function selectEpal(){
    finderState.zone = "epal";
    finderState.role = "student";
    finderState.need = "";
    saveState();
    renderFinder();
    document.getElementById("homeV8FinderTitle")?.focus({preventScroll:true});
    document.getElementById("homeV9Finder")?.scrollIntoView({block:"start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
  }

  function applyHashIntent(){
    if(!isHome()) return;
    if(location.hash === "#open-help" || location.hash === "#homeV8AiTitle"){ location.replace("/tools/ai-help.html"); return; }
    if(["#open-quiz", "#homeV8MapTitle"].includes(location.hash)){ location.replace("/practice.html"); return; }
    if(location.hash === "#epal"){ selectEpal(); return; }
    const intent = shortcutIntent();
    if(intent){
      finderState.need = intent;
      renderFinder();
    }
    if(intent || location.hash === "#tasks"){
      document.getElementById("homeV8FinderTitle")?.focus({preventScroll:true});
      document.getElementById("homeV9Finder")?.scrollIntoView({block:"start"});
    }
  }

  function init(){
    apply();
    applyHashIntent();
    window.addEventListener("hashchange", applyHashIntent);

    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if(!target) return;

      const finderChip = target.closest("#homeV9Finder [data-finder-role], #homeV9Finder [data-finder-zone], #homeV9Finder [data-finder-need]");
      if(finderChip){
        const d = finderChip.dataset;
        let kind = "need";
        if(d.finderNeed){
          finderState.need = d.finderNeed;
          if(shortcutIntent()) history.replaceState(history.state, "", location.pathname + location.search);
        }
        if(d.finderZone){ kind = "zone"; finderState.zone = finderState.zone === d.finderZone ? "" : d.finderZone; }
        if(d.finderRole){ kind = "role"; finderState.role = d.finderRole; }
        saveState();
        renderFinder();
        const value = kind === "zone" ? d.finderZone : finderState[kind];
        document.querySelector(`#homeV9Finder [data-finder-${kind}="${value}"]`)?.focus({preventScroll:true});
        if(kind === "need") revealStep();
        return;
      }

      if(target.closest('#homeV11Epal, a[href="/#epal"]') && isHome() && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){
        event.preventDefault();
        selectEpal();
        return;
      }

      const spaLink = target.closest("#homeV8Shell a[href], #homeV9Top a[href]");
      if(spaLink && !spaLink.hasAttribute("data-epal-practice-map") && !spaLink.hasAttribute("data-special-education-diagnostic") && !event.defaultPrevented && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0 && isHome() && openSpaRoute(spaLink)){
        event.preventDefault();
        return;
      }

      if(target.closest("#langEl,#langEn,#backToZones")){
        setTimeout(() => { if(isHome()) apply(); }, 0);
      }
    });

    window.addEventListener("pageshow", (event) => { if(event.persisted && isHome()) apply(); });

    window.addEventListener("popstate", () => {
      setTimeout(() => {
        if(!isHome()) return;
        const zoneView = document.getElementById("zoneSelectView");
        const pathView = document.getElementById("pathView");
        if(zoneView?.hidden && pathView && !pathView.hidden){
          document.getElementById("backToZones")?.click();
        }
        apply();
      }, 0);
    });

    const shellForSearch = document.getElementById("homeV8Shell");
    if(shellForSearch && "MutationObserver" in window){
      new MutationObserver(placeSearchFirst).observe(shellForSearch, {childList:true});
    }
    placeSearchFirst();

    const grid = document.getElementById("zoneGrid");
    if(grid && "MutationObserver" in window){
      new MutationObserver(suppressLegacyInjectedBlocks).observe(grid, {childList:true});
    }

    [0, 50, 200, 550, 1200, 2000].forEach((ms) => setTimeout(() => {
      if(!isHome()) return;
      suppressLegacyInjectedBlocks();
      ensureHeroCopy();
      ensureIdentity();
      placeSearchFirst();
      if(!document.querySelector("#homeV9Finder .home-v11-task .ia-icon") && window.AITOOLSKIDS_IA) apply();
    }, ms));
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init, {once:true});
  }else{
    init();
  }
})();
