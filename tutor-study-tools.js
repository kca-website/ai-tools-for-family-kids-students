/**
 * tutor-study-tools.js
 * Quiz + presentation helpers for AI Help.
 * - One Puter AI call generates a complete quiz or presentation outline.
 * - Answering, grading, navigation, copying and reopening cached material are local-only.
 * - No MutationObserver, interval or background polling.
 */
(function () {
  "use strict";

  const MODEL = "openai/gpt-4.1-nano";
  const STORE_KEY = "aitools4kids_study_tools_v1";
  const MAX_CACHE_ENTRIES = 16;
  const QUIZ_COUNT = 6;
  const SLIDE_COUNT = 6;
  const STYLE_ID = "aitools4kidsStudyToolsStyles";
  const RENDER_EVENT = "aitools4kids:tutor-rendered";

  const T = {
    el: {
      title: "🧰 Εργαλεία μελέτης",
      intro: "Δημιούργησε υλικό πάνω στην τάξη, το μάθημα και το θέμα που έχεις ήδη επιλέξει.",
      usage: "ℹ️ Κάθε νέα δημιουργία χρησιμοποιεί ένα μικρό μέρος από τη δωρεάν μηνιαία χρήση AI του Puter. Μετά τη δημιουργία, η χρήση του quiz ή της παρουσίασης δεν καταναλώνει επιπλέον AI.",
      quiz: "📝 Φτιάξε quiz εξάσκησης",
      quizExam: "📝 Φτιάξε quiz επιπέδου εξετάσεων",
      slides: "🎞️ Φτιάξε παρουσίαση 6 διαφανειών",
      quizSaved: "Άνοιξε αποθηκευμένο quiz · χωρίς νέα χρήση AI",
      quizExamSaved: "Άνοιξε αποθηκευμένο quiz εξετάσεων · χωρίς νέα χρήση AI",
      slidesSaved: "Άνοιξε αποθηκευμένη παρουσίαση · χωρίς νέα χρήση AI",
      quizNew: "Νέο quiz",
      quizExamNew: "Νέο quiz εξετάσεων",
      slidesNew: "Νέα παρουσίαση",
      needConnect: "Συνδέσου πρώτα με Puter από το πλαίσιο επάνω.",
      unavailable: "Η λειτουργία δεν είναι διαθέσιμη με την τωρινή ηλικιακή ρύθμιση.",
      generatingQuiz: "Δημιουργείται το quiz…",
      generatingSlides: "Δημιουργείται η παρουσίαση…",
      failed: "Δεν μπόρεσα να δημιουργήσω έγκυρο υλικό. Δεν έγινε αυτόματη δεύτερη κλήση, ώστε να μη χρησιμοποιηθεί επιπλέον AI.",
      question: "Ερώτηση",
      of: "από",
      score: "Σκορ",
      next: "Επόμενη →",
      prev: "← Προηγούμενη",
      correct: "✓ Σωστό",
      wrong: "✗ Όχι ακριβώς",
      explanation: "Γιατί",
      finished: "Ολοκλήρωσες το quiz.",
      slide: "Διαφάνεια",
      yourPart: "Δική σου προσθήκη",
      copy: "Αντιγραφή διάρθρωσης",
      copied: "Η διάρθρωση αντιγράφηκε.",
      copyFailed: "Δεν έγινε αυτόματη αντιγραφή. Μπορείς να επιλέξεις το κείμενο χειροκίνητα.",
      cached: "Φορτώθηκε από τον browser χωρίς νέα χρήση AI.",
      saved: "Αποθηκεύτηκε στον browser για αυτό το θέμα.",
    },
    en: {
      title: "🧰 Study tools",
      intro: "Create material for the grade, subject and topic you have already selected.",
      usage: "ℹ️ Each new generation uses a small part of your free monthly Puter AI allowance. After generation, using the quiz or presentation does not consume more AI.",
      quiz: "📝 Create a practice quiz",
      quizExam: "📝 Create an exam-level quiz",
      slides: "🎞️ Create a 6-slide presentation",
      quizSaved: "Open saved quiz · no new AI usage",
      quizExamSaved: "Open saved exam-level quiz · no new AI usage",
      slidesSaved: "Open saved presentation · no new AI usage",
      quizNew: "New quiz",
      quizExamNew: "New exam-level quiz",
      slidesNew: "New presentation",
      needConnect: "Connect to Puter first using the box above.",
      unavailable: "This feature is not available with the current age setting.",
      generatingQuiz: "Creating the quiz…",
      generatingSlides: "Creating the presentation…",
      failed: "I couldn't create valid material. No automatic second call was made, so no extra AI usage was consumed.",
      question: "Question",
      of: "of",
      score: "Score",
      next: "Next →",
      prev: "← Previous",
      correct: "✓ Correct",
      wrong: "✗ Not quite",
      explanation: "Why",
      finished: "You completed the quiz.",
      slide: "Slide",
      yourPart: "Your contribution",
      copy: "Copy outline",
      copied: "The outline was copied.",
      copyFailed: "Automatic copy was not available. You can select the text manually.",
      cached: "Loaded from this browser with no new AI usage.",
      saved: "Saved in this browser for this topic.",
    },
  };

  function lang() {
    return document.getElementById("langEn")?.classList.contains("active") ||
      (document.documentElement.lang || "").toLowerCase().startsWith("en") ? "en" : "el";
  }
  function tr(key) { return T[lang()]?.[key] || key; }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .tutor-study-tools{margin:0 0 12px;padding:12px;border:1px solid #ddd6fe;border-radius:12px;background:#fbfaff;color:#334155;}
      .tutor-study-tools__title{font-weight:800;color:#4338ca;margin:0 0 3px;font-size:.92rem;}
      .tutor-study-tools__intro,.tutor-study-tools__usage{margin:0;color:#64748b;font-size:.78rem;line-height:1.45;}
      .tutor-study-tools__usage{margin-top:5px;}
      .tutor-study-tools__actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px;}
      .tutor-study-tools__btn{border:1px solid #c4b5fd;background:#fff;color:#3730a3;border-radius:9px;padding:8px 10px;font:inherit;font-size:.78rem;font-weight:750;cursor:pointer;}
      .tutor-study-tools__btn--primary{background:#4f46e5;border-color:#4f46e5;color:#fff;}
      .tutor-study-tools__btn:disabled{opacity:.55;cursor:not-allowed;}
      .tutor-study-tools__status{min-height:1.2em;margin-top:7px;font-size:.76rem;color:#64748b;}
      .tutor-study-tools__result{margin-top:11px;border-top:1px solid #ddd6fe;padding-top:11px;}
      .study-quiz__meta,.study-slides__meta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:9px;font-size:.75rem;color:#64748b;}
      .study-quiz__question{font-weight:800;font-size:1rem;line-height:1.45;color:#1e293b;margin-bottom:10px;}
      .study-quiz__options{display:grid;gap:7px;}
      .study-quiz__option{text-align:left;border:1px solid #cbd5e1;background:#fff;border-radius:9px;padding:9px 10px;font:inherit;font-size:.84rem;cursor:pointer;color:#334155;}
      .study-quiz__option.is-selected{outline:2px solid #818cf8;outline-offset:1px;}
      .study-quiz__option.is-correct{border-color:#22c55e;background:#f0fdf4;}
      .study-quiz__option.is-wrong{border-color:#ef4444;background:#fef2f2;}
      .study-quiz__feedback{margin-top:10px;padding:9px 10px;border-radius:9px;background:#f8fafc;font-size:.82rem;line-height:1.45;color:#334155;}
      .study-quiz__nav,.study-slides__nav{display:flex;gap:7px;justify-content:space-between;margin-top:10px;}
      .study-slide{border:1px solid #cbd5e1;background:#fff;border-radius:13px;padding:18px;min-height:220px;}
      .study-slide h4{margin:0 0 11px;font-size:1.08rem;color:#1e293b;}
      .study-slide ul{margin:0;padding-left:20px;color:#334155;line-height:1.5;}
      .study-slide__your-part{margin-top:14px;padding:9px 10px;border-radius:9px;background:#f5f3ff;color:#4c1d95;font-size:.8rem;line-height:1.45;}
      .study-slides__copy{margin-top:9px;}
      @media(max-width:620px){.tutor-study-tools__actions .tutor-study-tools__btn{width:100%}.study-quiz__nav .tutor-study-tools__btn,.study-slides__nav .tutor-study-tools__btn{flex:1}.study-slide{min-height:240px;padding:14px}}
    `;
    document.head.appendChild(style);
  }

  function selectInfo(id) {
    const el = document.getElementById(id);
    if (!el) return { value: "", label: "" };
    return { value: el.value || "", label: el.selectedOptions?.[0]?.textContent?.trim() || "" };
  }

  function currentContext() {
    const grade = selectInfo("tutorGrade");
    const subject = selectInfo("tutorSubject");
    const topic = selectInfo("tutorTopic");
    return {
      lang: lang(), path: location.pathname,
      gradeId: grade.value, grade: grade.label,
      subjectId: subject.value, subject: subject.label,
      topicId: topic.value, topic: topic.label,
      contextText: document.getElementById("tutorContextBox")?.innerText?.trim() || "",
    };
  }

  function isHighSchool(c) {
    return /(^|\/)high(\/|$)/.test(String(c?.path || ""));
  }

  function contextKey(type, c) {
    const cacheType = type === "quiz" && isHighSchool(c) ? "quiz-exam-v2" : type;
    return [cacheType, c.lang, c.path, c.gradeId, c.subjectId, c.topicId].join("|");
  }
  function readStore() {
    try {
      const data = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      return data && Array.isArray(data.entries) ? data : { version: 1, entries: [] };
    } catch (_) { return { version: 1, entries: [] }; }
  }
  function writeStore(store) { try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (_) {} }
  function getCached(type, c) { return readStore().entries.find((e) => e.key === contextKey(type, c)) || null; }
  function saveCached(type, c, data) {
    const key = contextKey(type, c);
    const store = readStore();
    const entries = store.entries.filter((e) => e.key !== key);
    entries.unshift({ key, type, data, createdAt: Date.now() });
    store.entries = entries.slice(0, MAX_CACHE_ENTRIES);
    writeStore(store);
  }

  function extractText(resp) {
    if (typeof resp === "string") return resp;
    if (typeof resp?.text === "string") return resp.text;
    const content = resp?.message?.content;
    if (typeof content === "string") return content;
    if (Array.isArray(content)) return content.map((x) => typeof x === "string" ? x : (x?.text || "")).join("").trim();
    return "";
  }
  function parseJson(raw) {
    const text = String(raw || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start < 0 || end <= start) throw new Error("No JSON object");
    return JSON.parse(text.slice(start, end + 1));
  }

  function parseQuiz(raw) {
    const data = parseJson(raw);
    if (!Array.isArray(data.questions)) throw new Error("No questions array");
    const questions = data.questions.map((q) => {
      const options = Array.isArray(q?.options) ? q.options.map((x) => String(x || "").trim().slice(0, 350)).filter(Boolean).slice(0, 4) : [];
      const correct = Number(q?.correct);
      return {
        q: String(q?.q || q?.question || "").trim().slice(0, 600),
        options,
        correct,
        explanation: String(q?.explanation || "").trim().slice(0, 700),
      };
    }).filter((q) => q.q && q.options.length === 4 && Number.isInteger(q.correct) && q.correct >= 0 && q.correct <= 3 && q.explanation).slice(0, QUIZ_COUNT);
    if (questions.length < 4) throw new Error("Too few valid questions");
    return questions;
  }

  function parseSlides(raw) {
    const data = parseJson(raw);
    if (!Array.isArray(data.slides)) throw new Error("No slides array");
    const slides = data.slides.map((s) => ({
      title: String(s?.title || "").trim().slice(0, 220),
      bullets: Array.isArray(s?.bullets) ? s.bullets.map((x) => String(x || "").trim().slice(0, 350)).filter(Boolean).slice(0, 5) : [],
      yourPart: String(s?.yourPart || s?.your_part || "").trim().slice(0, 450),
    })).filter((s) => s.title && s.bullets.length >= 1 && s.yourPart).slice(0, SLIDE_COUNT);
    if (slides.length < 4) throw new Error("Too few valid slides");
    return slides;
  }

  function baseContextPrompt(c) {
    return `Grade: ${c.grade || "school grade"}\nSubject: ${c.subject || "school subject"}\nTopic/focus: ${c.topic || "selected topic"}\nSite curriculum context:\n${c.contextText || "No additional context."}`;
  }

  function highSchoolExamLevel(c) {
    if (c.gradeId === "a") return "A' Lyceum / 10th grade: demanding written school-exam level. Require real application and reasoning, not Panhellenic-specific framing.";
    if (c.gradeId === "b") return "B' Lyceum / 11th grade: advanced written school-exam and exam-preparation level. Questions should require synthesis, interpretation and multi-step reasoning where the subject allows it.";
    if (c.gradeId === "c") return "C' Lyceum / 12th grade: final-exam level. If the selected subject is nationally examined, use reasoning depth comparable to serious Panhellenic-exam preparation; otherwise use a demanding final school-exam level. Do not imitate or claim to reproduce the official exam-paper format.";
    return "Greek Lyceum: demanding written-exam level appropriate to the selected grade.";
  }

  function highSchoolQuizPrompt(c, language) {
    return `Create exactly ${QUIZ_COUNT} EXAM-LEVEL multiple-choice practice questions for a Greek Lyceum learner. This is a demanding revision quiz, not a basic recall quiz and not a reproduction of an official exam paper.\n\nCONTEXT\n${baseContextPrompt(c)}\n\nDIFFICULTY TARGET\n${highSchoolExamLevel(c)}\n\nRULES\n- Write in ${language}.\n- Stay strictly within the selected grade, subject, topic and the site curriculum context above. Do not invent out-of-scope curriculum content, quotations, sources or statistics.\n- At least 4 of the ${QUIZ_COUNT} questions must require application, inference, comparison, synthesis, interpretation or multi-step reasoning. No more than 1 question may be pure definition/recall.\n- At least 2 questions must be built around a short problem, data set, source, scenario, claim, graph description, experimental situation or worked context appropriate to the selected subject.\n- For Mathematics, Physics, Chemistry, Economics or Informatics, prefer calculations, data/graph interpretation, method choice and multi-step problem solving where appropriate.\n- For Language, Literature, History and other humanities/social subjects, prefer short source/claim/evidence interpretation, comparison, argument evaluation, cause/effect and inference.\n- Make distractors genuinely plausible and based on common misconceptions, partial reasoning, sign/method errors or tempting but incomplete interpretations. Avoid obviously silly answers.\n- Do not use trick wording, obscure trivia, 'all of the above'/'none of the above', or giveaway answer-length patterns.\n- Each question has exactly 4 options of reasonably comparable plausibility and length.\n- correct is the zero-based index 0,1,2,3 of the correct option.\n- explanation must be 1-3 concise sentences that show the reasoning or decisive evidence, not merely restate the correct option.\n- Do not mention AI, Puter, prompts or internal ids.\n- Return STRICT JSON only, no markdown.\n\nRequired shape:\n{"questions":[{"q":"question","options":["A","B","C","D"],"correct":0,"explanation":"reasoned explanation"}]}\n\nReturn exactly ${QUIZ_COUNT} questions.`;
  }

  function quizPrompt(c) {
    const language = c.lang === "en" ? "English" : "Greek";
    if (isHighSchool(c)) return highSchoolQuizPrompt(c, language);
    return `Create exactly ${QUIZ_COUNT} multiple-choice practice questions for a school learner.\n\nCONTEXT\n${baseContextPrompt(c)}\n\nRULES\n- Write in ${language}.\n- Match the selected grade.\n- Focus on understanding, cause/effect, concepts, evidence and useful application; avoid trivial grammar or obscure trivia unless central to the topic.\n- Each question has exactly 4 plausible options.\n- correct is the zero-based index 0,1,2,3 of the correct option.\n- explanation is a short explanation of why the answer is correct.\n- Do not mention AI, Puter, prompts or internal ids.\n- Return STRICT JSON only, no markdown.\n\nRequired shape:\n{"questions":[{"q":"question","options":["A","B","C","D"],"correct":0,"explanation":"short explanation"}]}\n\nReturn exactly ${QUIZ_COUNT} questions.`;
  }

  function slidesPrompt(c) {
    const language = c.lang === "en" ? "English" : "Greek";
    return `Create exactly ${SLIDE_COUNT} slides as a STUDENT PRESENTATION SCAFFOLD, not a finished assignment.\n\nCONTEXT\n${baseContextPrompt(c)}\n\nRULES\n- Write in ${language}.\n- Match the selected grade and subject.\n- Slide 1 should introduce the topic. The final slide should summarize what was learned or invite a conclusion.\n- Each slide must have a short title and 2-4 concise bullet points.\n- Each slide must include yourPart: one concrete thing the student should add or personalize (example, source, image, comparison, evidence, own wording, or conclusion).\n- Do NOT write a ready-to-submit essay, speech or long paragraphs.\n- Avoid invented sources, quotations or statistics.\n- Do not mention AI, Puter, prompts or internal ids.\n- Return STRICT JSON only, no markdown.\n\nRequired shape:\n{"slides":[{"title":"title","bullets":["point 1","point 2"],"yourPart":"what the student should add"}]}\n\nReturn exactly ${SLIDE_COUNT} slides.`;
  }

  function canUseTutor() {
    const input = document.getElementById("tutorInput");
    return !!input && !input.disabled;
  }
  function isSignedIn() { try { return !!window.puter?.auth?.isSignedIn?.(); } catch (_) { return false; } }
  function setStatus(panel, text, isError) {
    const el = panel.querySelector(".tutor-study-tools__status");
    if (!el) return;
    el.textContent = text || "";
    el.style.color = isError ? "#b91c1c" : "#64748b";
  }
  function clearResult(panel) { panel.querySelector(".tutor-study-tools__result")?.remove(); }

  function renderQuiz(panel, questions, cached) {
    clearResult(panel);
    const result = document.createElement("div");
    result.className = "tutor-study-tools__result";
    result.dataset.type = "quiz";
    panel.appendChild(result);
    const state = { questions, index: 0, answers: {} };

    function draw() {
      result.replaceChildren();
      const item = questions[state.index];
      const answered = Object.prototype.hasOwnProperty.call(state.answers, state.index);
      const chosen = state.answers[state.index];
      const score = Object.entries(state.answers).filter(([i, answer]) => questions[Number(i)]?.correct === answer).length;

      const meta = document.createElement("div"); meta.className = "study-quiz__meta";
      const pos = document.createElement("span"); pos.textContent = `${tr("question")} ${state.index + 1} ${tr("of")} ${questions.length}`;
      const sc = document.createElement("span"); sc.textContent = `${tr("score")}: ${score}/${Object.keys(state.answers).length}`;
      meta.append(pos, sc);

      const q = document.createElement("div"); q.className = "study-quiz__question"; q.textContent = item.q;
      const options = document.createElement("div"); options.className = "study-quiz__options";
      item.options.forEach((text, i) => {
        const btn = document.createElement("button"); btn.type = "button"; btn.className = "study-quiz__option"; btn.textContent = text;
        if (answered) {
          btn.disabled = true;
          if (i === item.correct) btn.classList.add("is-correct");
          if (i === chosen && chosen !== item.correct) btn.classList.add("is-wrong");
          if (i === chosen) btn.classList.add("is-selected");
        }
        btn.addEventListener("click", () => { if (!answered) { state.answers[state.index] = i; draw(); } });
        options.appendChild(btn);
      });

      result.append(meta, q, options);
      if (answered) {
        const fb = document.createElement("div"); fb.className = "study-quiz__feedback";
        const verdict = chosen === item.correct ? tr("correct") : tr("wrong");
        fb.textContent = `${verdict}. ${tr("explanation")}: ${item.explanation}`;
        result.appendChild(fb);
      }

      const nav = document.createElement("div"); nav.className = "study-quiz__nav";
      const prev = document.createElement("button"); prev.type = "button"; prev.className = "tutor-study-tools__btn"; prev.textContent = tr("prev"); prev.disabled = state.index === 0;
      prev.addEventListener("click", () => { state.index -= 1; draw(); });
      const next = document.createElement("button"); next.type = "button"; next.className = "tutor-study-tools__btn tutor-study-tools__btn--primary"; next.textContent = tr("next"); next.disabled = state.index >= questions.length - 1;
      next.addEventListener("click", () => { state.index += 1; draw(); });
      nav.append(prev, next); result.appendChild(nav);
      if (Object.keys(state.answers).length === questions.length) setStatus(panel, `${tr("finished")} ${tr("score")}: ${score}/${questions.length}`, false);
    }
    draw();
    setStatus(panel, cached ? tr("cached") : tr("saved"), false);
    updateButtons(panel);
  }

  function slidesAsText(slides) {
    return slides.map((s, i) => `${tr("slide")} ${i + 1}: ${s.title}\n${s.bullets.map((b) => `• ${b}`).join("\n")}\n${tr("yourPart")}: ${s.yourPart}`).join("\n\n");
  }

  function renderSlides(panel, slides, cached) {
    clearResult(panel);
    const result = document.createElement("div");
    result.className = "tutor-study-tools__result";
    result.dataset.type = "slides";
    panel.appendChild(result);
    const state = { index: 0 };
    function draw() {
      result.replaceChildren();
      const slide = slides[state.index];
      const meta = document.createElement("div"); meta.className = "study-slides__meta";
      const pos = document.createElement("span"); pos.textContent = `${tr("slide")} ${state.index + 1}/${slides.length}`;
      meta.appendChild(pos);
      const box = document.createElement("article"); box.className = "study-slide";
      const h = document.createElement("h4"); h.textContent = slide.title;
      const ul = document.createElement("ul"); slide.bullets.forEach((b) => { const li = document.createElement("li"); li.textContent = b; ul.appendChild(li); });
      const part = document.createElement("div"); part.className = "study-slide__your-part"; part.innerHTML = `<strong>${tr("yourPart")}:</strong> `; part.append(document.createTextNode(slide.yourPart));
      box.append(h, ul, part);
      const nav = document.createElement("div"); nav.className = "study-slides__nav";
      const prev = document.createElement("button"); prev.type = "button"; prev.className = "tutor-study-tools__btn"; prev.textContent = tr("prev"); prev.disabled = state.index === 0; prev.addEventListener("click", () => { state.index -= 1; draw(); });
      const next = document.createElement("button"); next.type = "button"; next.className = "tutor-study-tools__btn tutor-study-tools__btn--primary"; next.textContent = tr("next"); next.disabled = state.index >= slides.length - 1; next.addEventListener("click", () => { state.index += 1; draw(); });
      nav.append(prev, next);
      const copy = document.createElement("button"); copy.type = "button"; copy.className = "tutor-study-tools__btn study-slides__copy"; copy.textContent = tr("copy");
      copy.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(slidesAsText(slides)); setStatus(panel, tr("copied"), false); }
        catch (_) { setStatus(panel, tr("copyFailed"), true); }
      });
      result.append(meta, box, nav, copy);
    }
    draw();
    setStatus(panel, cached ? tr("cached") : tr("saved"), false);
    updateButtons(panel);
  }

  async function generate(panel, type) {
    if (panel.dataset.busy === "1") return;
    const c = currentContext();
    if (!canUseTutor()) {
      if (!isSignedIn()) { setStatus(panel, tr("needConnect"), true); document.getElementById("tutorSignIn")?.focus(); }
      else setStatus(panel, tr("unavailable"), true);
      return;
    }
    if (!window.puter?.ai?.chat) { setStatus(panel, tr("needConnect"), true); return; }

    panel.dataset.busy = "1";
    panel.querySelectorAll("[data-study-tool]").forEach((b) => { b.disabled = true; });
    setStatus(panel, type === "quiz" ? tr("generatingQuiz") : tr("generatingSlides"), false);
    try {
      const prompt = type === "quiz" ? quizPrompt(c) : slidesPrompt(c);
      const examQuiz = type === "quiz" && isHighSchool(c);
      const response = await window.puter.ai.chat(prompt, {
        model: MODEL,
        normalize: true,
        max_tokens: type === "quiz" ? (examQuiz ? 2200 : 1500) : 1400,
        temperature: examQuiz ? 0.18 : 0.25,
      });
      if (type === "quiz") {
        const questions = parseQuiz(extractText(response)); saveCached(type, c, questions); renderQuiz(panel, questions, false);
      } else {
        const slides = parseSlides(extractText(response)); saveCached(type, c, slides); renderSlides(panel, slides, false);
      }
    } catch (err) {
      console.error(`AI Help ${type} generation failed`, err);
      setStatus(panel, tr("failed"), true);
    } finally {
      panel.dataset.busy = "0";
      panel.querySelectorAll("[data-study-tool]").forEach((b) => { b.disabled = false; });
      updateButtons(panel);
    }
  }

  function openOrGenerate(panel, type) {
    const cached = getCached(type, currentContext());
    const currentType = panel.querySelector(".tutor-study-tools__result")?.dataset?.type || "";
    if (cached && currentType !== type) {
      if (type === "quiz") renderQuiz(panel, cached.data, true); else renderSlides(panel, cached.data, true);
      return;
    }
    generate(panel, type);
  }

  function updateButtons(panel) {
    const c = currentContext();
    const resultType = panel.querySelector(".tutor-study-tools__result")?.dataset?.type || "";
    const q = panel.querySelector('[data-study-tool="quiz"]');
    const s = panel.querySelector('[data-study-tool="slides"]');
    const examQuiz = isHighSchool(c);
    if (q) {
      const newLabel = examQuiz ? tr("quizExamNew") : tr("quizNew");
      const savedLabel = examQuiz ? tr("quizExamSaved") : tr("quizSaved");
      const createLabel = examQuiz ? tr("quizExam") : tr("quiz");
      q.textContent = resultType === "quiz" ? newLabel : getCached("quiz", c) ? savedLabel : createLabel;
    }
    if (s) s.textContent = resultType === "slides" ? tr("slidesNew") : getCached("slides", c) ? tr("slidesSaved") : tr("slides");
  }

  function installPanel() {
    injectStyles();
    const chat = document.querySelector("#tutorMount .tutor-chat");
    if (!chat || chat.querySelector(".tutor-study-tools")) return;
    const header = chat.querySelector(".tutor-chat__header");
    if (!header) return;
    const anchor = chat.querySelector(".tutor-flashcards") || header;

    const panel = document.createElement("section"); panel.className = "tutor-study-tools"; panel.setAttribute("aria-label", tr("title"));
    const title = document.createElement("div"); title.className = "tutor-study-tools__title"; title.textContent = tr("title");
    const intro = document.createElement("p"); intro.className = "tutor-study-tools__intro"; intro.textContent = tr("intro");
    const usage = document.createElement("p"); usage.className = "tutor-study-tools__usage"; usage.textContent = tr("usage");
    const actions = document.createElement("div"); actions.className = "tutor-study-tools__actions";
    const quiz = document.createElement("button"); quiz.type = "button"; quiz.className = "tutor-study-tools__btn tutor-study-tools__btn--primary"; quiz.dataset.studyTool = "quiz"; quiz.addEventListener("click", () => openOrGenerate(panel, "quiz"));
    const slides = document.createElement("button"); slides.type = "button"; slides.className = "tutor-study-tools__btn"; slides.dataset.studyTool = "slides"; slides.addEventListener("click", () => openOrGenerate(panel, "slides"));
    actions.append(quiz, slides);
    const status = document.createElement("div"); status.className = "tutor-study-tools__status"; status.setAttribute("aria-live", "polite");
    panel.append(title, intro, usage, actions, status);
    anchor.insertAdjacentElement("afterend", panel);
    updateButtons(panel);

    ["tutorGrade", "tutorSubject", "tutorTopic", "tutorAge", "tutorConsent"].forEach((id) => {
      document.getElementById(id)?.addEventListener("change", () => {
        clearResult(panel); setStatus(panel, "", false); setTimeout(() => updateButtons(panel), 0);
      });
    });
  }

  document.addEventListener(RENDER_EVENT, installPanel);
  installPanel();
})();