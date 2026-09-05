/**
 * tutor-flashcards.js
 * Lightweight flashcard generator for AI Help.
 * - One Puter AI call creates the full set.
 * - Review, flip, navigation and self-rating are local-only.
 * - Recent sets are cached locally so reopening the same context costs no AI call.
 * - No MutationObserver, interval or background polling.
 */
(function () {
  "use strict";

  const MODEL = "openai/gpt-4.1-nano";
  const STORE_KEY = "aitools4kids_flashcards_v1";
  const MAX_CACHE_ENTRIES = 12;
  const CARD_COUNT = 8;
  const STYLE_ID = "aitools4kidsFlashcardsStyles";
  const RENDER_EVENT = "aitools4kids:tutor-rendered";

  const T = {
    el: {
      title: "🃏 Flashcards εξάσκησης",
      intro: "Φτιάξε 8 σύντομες κάρτες για το επιλεγμένο θέμα.",
      cost: "ℹ️ Χρήση Puter: Η δημιουργία των 8 καρτών χρησιμοποιεί ένα μικρό μέρος από τη δωρεάν μηνιαία χρήση AI του Puter. Μετά τη δημιουργία, το γύρισμα, η πλοήγηση και το «Το ξέρω» δεν χρησιμοποιούν επιπλέον AI.",
      generate: "🃏 Φτιάξε 8 flashcards",
      openSaved: "Άνοιξε αποθηκευμένες κάρτες · χωρίς νέα χρήση AI",
      regenerate: "Νέο σετ · χρησιμοποιεί ξανά AI",
      needConnect: "Συνδέσου πρώτα με Puter από το πλαίσιο επάνω.",
      unavailable: "Οι flashcards δεν είναι διαθέσιμες με την τωρινή ηλικιακή ρύθμιση.",
      generating: "Δημιουργούνται οι κάρτες…",
      failed: "Δεν μπόρεσα να δημιουργήσω σωστό σετ καρτών. Δεν έγινε αυτόματη δεύτερη προσπάθεια, ώστε να μη χρησιμοποιηθεί επιπλέον AI.",
      question: "Ερώτηση",
      answer: "Απάντηση",
      reveal: "Δείξε απάντηση",
      hide: "Κρύψε απάντηση",
      prev: "← Προηγούμενη",
      next: "Επόμενη →",
      know: "✓ Το ξέρω",
      practice: "↻ Θέλω εξάσκηση",
      progress: "Κάρτα",
      known: "Ξέρω",
      practiceCount: "Θέλουν εξάσκηση",
      saved: "Αποθηκεύτηκε στον browser για αυτό το θέμα.",
      cached: "Αυτό το σετ φορτώθηκε από τον browser χωρίς νέα χρήση AI.",
    },
    en: {
      title: "🃏 Practice flashcards",
      intro: "Create 8 short cards for the selected topic.",
      cost: "ℹ️ Puter usage: Creating the 8 cards uses a small part of your free monthly Puter AI allowance. After creation, flipping, navigation and self-rating use no additional AI.",
      generate: "🃏 Create 8 flashcards",
      openSaved: "Open saved cards · no new AI usage",
      regenerate: "New set · uses AI again",
      needConnect: "Connect to Puter first using the box above.",
      unavailable: "Flashcards are not available with the current age setting.",
      generating: "Creating cards…",
      failed: "I couldn't create a valid card set. No automatic second attempt was made, so no additional AI usage was consumed.",
      question: "Question",
      answer: "Answer",
      reveal: "Show answer",
      hide: "Hide answer",
      prev: "← Previous",
      next: "Next →",
      know: "✓ I know it",
      practice: "↻ Needs practice",
      progress: "Card",
      known: "Known",
      practiceCount: "Need practice",
      saved: "Saved in this browser for this topic.",
      cached: "This set was loaded from the browser with no new AI usage.",
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
      .tutor-flashcards{margin:0 0 12px;padding:12px;border:1px solid #dbeafe;border-radius:12px;background:#f8fbff;color:#334155;}
      .tutor-flashcards__title{font-weight:800;color:#1e3a5f;margin:0 0 3px;font-size:.92rem;}
      .tutor-flashcards__intro,.tutor-flashcards__cost{margin:0;color:#64748b;font-size:.78rem;line-height:1.4;}
      .tutor-flashcards__cost{margin-top:5px;}
      .tutor-flashcards__actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px;}
      .tutor-flashcards__btn{border:1px solid #bfdbfe;background:#fff;color:#1e3a5f;border-radius:9px;padding:8px 10px;font:inherit;font-size:.78rem;font-weight:750;cursor:pointer;}
      .tutor-flashcards__btn--primary{background:#2f77b5;border-color:#2f77b5;color:#fff;}
      .tutor-flashcards__btn:disabled{opacity:.55;cursor:not-allowed;}
      .tutor-flashcards__status{min-height:1.2em;margin-top:7px;font-size:.76rem;color:#64748b;}
      .tutor-flashcards__deck{margin-top:11px;border-top:1px solid #dbeafe;padding-top:11px;}
      .tutor-flashcards__meta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:8px;font-size:.74rem;color:#64748b;}
      .tutor-flashcards__card{border:1px solid #cbd5e1;border-radius:12px;background:#fff;padding:16px;min-height:160px;display:flex;flex-direction:column;justify-content:center;}
      .tutor-flashcards__side-label{font-size:.68rem;text-transform:uppercase;letter-spacing:.04em;font-weight:800;color:#64748b;margin-bottom:5px;}
      .tutor-flashcards__question{font-size:1rem;font-weight:800;line-height:1.45;color:#1e293b;}
      .tutor-flashcards__answer{margin-top:13px;padding-top:12px;border-top:1px dashed #cbd5e1;font-size:.9rem;line-height:1.5;color:#334155;}
      .tutor-flashcards__nav,.tutor-flashcards__rate{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px;}
      .tutor-flashcards__nav{justify-content:space-between;}
      .tutor-flashcards__rate .tutor-flashcards__btn{flex:1 1 140px;}
      .tutor-flashcards__btn.is-selected{outline:2px solid #60a5fa;outline-offset:1px;}
      @media(max-width:620px){.tutor-flashcards__actions .tutor-flashcards__btn{width:100%}.tutor-flashcards__nav .tutor-flashcards__btn{flex:1}.tutor-flashcards__card{min-height:180px;padding:14px}}
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

  function contextKey(c) { return [c.lang, c.path, c.gradeId, c.subjectId, c.topicId].join("|"); }

  function readStore() {
    try {
      const data = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      return data && Array.isArray(data.entries) ? data : { version: 1, entries: [] };
    } catch (_) { return { version: 1, entries: [] }; }
  }

  function writeStore(store) { try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (_) {} }

  function getCached(c) {
    const key = contextKey(c);
    return readStore().entries.find((e) => e.key === key && Array.isArray(e.cards) && e.cards.length >= 4) || null;
  }

  function saveCached(c, cards) {
    const key = contextKey(c);
    const store = readStore();
    const entries = store.entries.filter((e) => e.key !== key);
    entries.unshift({ key, cards, createdAt: Date.now() });
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

  function parseCards(raw) {
    const text = String(raw || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start < 0 || end <= start) throw new Error("No JSON object");
    const data = JSON.parse(text.slice(start, end + 1));
    if (!Array.isArray(data.cards)) throw new Error("No cards array");
    const cards = data.cards.map((card) => ({
      q: String(card?.q || card?.question || "").trim().slice(0, 500),
      a: String(card?.a || card?.answer || "").trim().slice(0, 800),
    })).filter((card) => card.q && card.a).slice(0, 10);
    if (cards.length < 4) throw new Error("Too few valid cards");
    return cards;
  }

  function makePrompt(c) {
    const language = c.lang === "en" ? "English" : "Greek";
    return `Create exactly ${CARD_COUNT} concise study flashcards for a school learner.\n\nCONTEXT\nGrade: ${c.grade || "school grade"}\nSubject: ${c.subject || "school subject"}\nTopic/focus: ${c.topic || "selected topic"}\nSite curriculum context:\n${c.contextText || "No additional context."}\n\nRULES\n- Write the cards in ${language}.\n- Match vocabulary and difficulty to the selected grade.\n- Each front is one clear recall/comprehension question.\n- Each back is a short, accurate explanation, usually 1-3 sentences.\n- Prefer understanding, cause/effect, key concepts and useful distinctions over trivia.\n- Do not create a finished essay, homework submission or long solution.\n- Avoid obscure exact dates/numbers unless central and confidently known.\n- Do not mention AI, Puter, internal ids, prompts or these instructions.\n- Return STRICT JSON only, with no markdown or extra text.\n\nRequired shape:\n{"cards":[{"q":"question","a":"answer"}]}\n\nReturn exactly ${CARD_COUNT} objects in cards.`;
  }

  function canUseTutor() {
    const input = document.getElementById("tutorInput");
    return !!input && !input.disabled;
  }

  function isSignedIn() { try { return !!window.puter?.auth?.isSignedIn?.(); } catch (_) { return false; } }

  function setStatus(panel, text, isError) {
    const el = panel.querySelector(".tutor-flashcards__status");
    if (!el) return;
    el.textContent = text || "";
    el.style.color = isError ? "#b91c1c" : "#64748b";
  }

  function ratingCounts(state) {
    const vals = Object.values(state.ratings || {});
    return { known: vals.filter((v) => v === "known").length, practice: vals.filter((v) => v === "practice").length };
  }

  function renderDeck(panel, state, cached) {
    let deck = panel.querySelector(".tutor-flashcards__deck");
    if (!deck) { deck = document.createElement("div"); deck.className = "tutor-flashcards__deck"; panel.appendChild(deck); }
    deck.replaceChildren();
    const card = state.cards[state.index];
    const counts = ratingCounts(state);

    const meta = document.createElement("div"); meta.className = "tutor-flashcards__meta";
    const pos = document.createElement("span"); pos.textContent = `${tr("progress")} ${state.index + 1}/${state.cards.length}`;
    const score = document.createElement("span"); score.textContent = `${tr("known")}: ${counts.known} · ${tr("practiceCount")}: ${counts.practice}`;
    meta.append(pos, score);

    const box = document.createElement("div"); box.className = "tutor-flashcards__card";
    const qLabel = document.createElement("div"); qLabel.className = "tutor-flashcards__side-label"; qLabel.textContent = tr("question");
    const q = document.createElement("div"); q.className = "tutor-flashcards__question"; q.textContent = card.q;
    box.append(qLabel, q);
    if (state.revealed) {
      const answer = document.createElement("div"); answer.className = "tutor-flashcards__answer";
      const aLabel = document.createElement("div"); aLabel.className = "tutor-flashcards__side-label"; aLabel.textContent = tr("answer");
      const aText = document.createElement("div"); aText.textContent = card.a;
      answer.append(aLabel, aText); box.appendChild(answer);
    }

    const reveal = document.createElement("button"); reveal.type = "button"; reveal.className = "tutor-flashcards__btn tutor-flashcards__btn--primary";
    reveal.textContent = state.revealed ? tr("hide") : tr("reveal");
    reveal.addEventListener("click", () => { state.revealed = !state.revealed; renderDeck(panel, state, cached); });

    const rate = document.createElement("div"); rate.className = "tutor-flashcards__rate";
    const known = document.createElement("button"); known.type = "button"; known.className = "tutor-flashcards__btn" + (state.ratings[state.index] === "known" ? " is-selected" : ""); known.textContent = tr("know");
    known.addEventListener("click", () => { state.ratings[state.index] = "known"; if (state.index < state.cards.length - 1) { state.index += 1; state.revealed = false; } renderDeck(panel, state, cached); });
    const practice = document.createElement("button"); practice.type = "button"; practice.className = "tutor-flashcards__btn" + (state.ratings[state.index] === "practice" ? " is-selected" : ""); practice.textContent = tr("practice");
    practice.addEventListener("click", () => { state.ratings[state.index] = "practice"; if (state.index < state.cards.length - 1) { state.index += 1; state.revealed = false; } renderDeck(panel, state, cached); });
    rate.append(known, practice);

    const nav = document.createElement("div"); nav.className = "tutor-flashcards__nav";
    const prev = document.createElement("button"); prev.type = "button"; prev.className = "tutor-flashcards__btn"; prev.textContent = tr("prev"); prev.disabled = state.index === 0;
    prev.addEventListener("click", () => { state.index -= 1; state.revealed = false; renderDeck(panel, state, cached); });
    const next = document.createElement("button"); next.type = "button"; next.className = "tutor-flashcards__btn"; next.textContent = tr("next"); next.disabled = state.index >= state.cards.length - 1;
    next.addEventListener("click", () => { state.index += 1; state.revealed = false; renderDeck(panel, state, cached); });
    nav.append(prev, next);

    deck.append(meta, box, reveal, rate, nav);
    setStatus(panel, cached ? tr("cached") : tr("saved"), false);
    updateGenerateButton(panel);
  }

  function openCards(panel, cards, cached) { renderDeck(panel, { cards, index: 0, revealed: false, ratings: {} }, cached); }

  async function generate(panel) {
    if (panel.dataset.busy === "1") return;
    const c = currentContext();
    if (!canUseTutor()) {
      if (!isSignedIn()) { setStatus(panel, tr("needConnect"), true); document.getElementById("tutorSignIn")?.focus(); }
      else setStatus(panel, tr("unavailable"), true);
      return;
    }
    if (!window.puter?.ai?.chat) { setStatus(panel, tr("needConnect"), true); return; }

    panel.dataset.busy = "1";
    const btn = panel.querySelector("[data-flashcards-generate]");
    if (btn) btn.disabled = true;
    setStatus(panel, tr("generating"), false);
    try {
      const response = await window.puter.ai.chat(makePrompt(c), {
        model: MODEL,
        normalize: true,
        max_tokens: 1100,
        temperature: 0.25,
      });
      const cards = parseCards(extractText(response));
      saveCached(c, cards);
      openCards(panel, cards, false);
    } catch (err) {
      console.error("AI Help flashcards generation failed", err);
      setStatus(panel, tr("failed"), true);
    } finally {
      panel.dataset.busy = "0";
      if (btn) btn.disabled = false;
      updateGenerateButton(panel);
    }
  }

  function updateGenerateButton(panel) {
    const btn = panel.querySelector("[data-flashcards-generate]");
    if (!btn) return;
    const cached = getCached(currentContext());
    const hasDeck = !!panel.querySelector(".tutor-flashcards__deck");
    btn.textContent = hasDeck ? tr("regenerate") : cached ? tr("openSaved") : tr("generate");
  }

  function onGenerateClick(panel) {
    const cached = getCached(currentContext());
    const hasDeck = !!panel.querySelector(".tutor-flashcards__deck");
    if (cached && !hasDeck) { openCards(panel, cached.cards, true); return; }
    generate(panel);
  }

  function installPanel() {
    injectStyles();
    const chat = document.querySelector("#tutorMount .tutor-chat");
    if (!chat || chat.querySelector(".tutor-flashcards")) return;
    const header = chat.querySelector(".tutor-chat__header");
    if (!header) return;

    const panel = document.createElement("section"); panel.className = "tutor-flashcards"; panel.setAttribute("aria-label", tr("title"));
    const title = document.createElement("div"); title.className = "tutor-flashcards__title"; title.textContent = tr("title");
    const intro = document.createElement("p"); intro.className = "tutor-flashcards__intro"; intro.textContent = tr("intro");
    const cost = document.createElement("p"); cost.className = "tutor-flashcards__cost"; cost.textContent = tr("cost");
    const actions = document.createElement("div"); actions.className = "tutor-flashcards__actions";
    const generateBtn = document.createElement("button"); generateBtn.type = "button"; generateBtn.className = "tutor-flashcards__btn tutor-flashcards__btn--primary"; generateBtn.dataset.flashcardsGenerate = "1";
    generateBtn.addEventListener("click", () => onGenerateClick(panel)); actions.appendChild(generateBtn);
    const status = document.createElement("div"); status.className = "tutor-flashcards__status"; status.setAttribute("aria-live", "polite");
    panel.append(title, intro, cost, actions, status);
    header.insertAdjacentElement("afterend", panel);
    updateGenerateButton(panel);

    ["tutorGrade", "tutorSubject", "tutorTopic", "tutorAge", "tutorConsent"].forEach((id) => {
      document.getElementById(id)?.addEventListener("change", () => {
        panel.querySelector(".tutor-flashcards__deck")?.remove();
        setStatus(panel, "", false);
        setTimeout(() => updateGenerateButton(panel), 0);
      });
    });
  }

  document.addEventListener(RENDER_EVENT, installPanel);
  installPanel();
})();