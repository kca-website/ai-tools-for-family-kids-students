(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const AV = [
    { shirt: "#1b7cff", hair: "#542914", skin: "#e9ad7b" },
    { shirt: "#8c4ed1", hair: "#2e2042", skin: "#c98d64" },
    { shirt: "#24b37a", hair: "#1d3557", skin: "#f0bf91" },
  ];
  const S = {
    on: false,
    i: 0,
    xp: 0,
    coins: 0,
    p: { x: 0.18, y: 0.72 },
    keys: new Set(),
    dir: null,
    last: 0,
    moving: false,
    near: null,
    avatar: 0,
    done: { math: false, science: false, history: false, language: false },
    sort: [],
    circuit: [],
    timeline: [],
    historyStep: 0,
  };
  const COINS = [
    { x: 0.29, y: 0.69, t: 0 },
    { x: 0.39, y: 0.62, t: 0 },
    { x: 0.53, y: 0.58, t: 0 },
    { x: 0.62, y: 0.55, t: 0 },
    { x: 0.68, y: 0.62, t: 0 },
    { x: 0.55, y: 0.39, t: 0 },
    { x: 0.33, y: 0.38, t: 0 },
  ];
  const Q = [
    [
      "0,45",
      "0,8",
      1,
      0.45,
      0.8,
      "Μην κοιτάς πόσα ψηφία έχει ο αριθμός. Στα δέκατα: 0,45 έχει 4 δέκατα, ενώ 0,8 έχει 8.",
    ],
    [
      "0,7",
      "0,65",
      0,
      0.7,
      0.65,
      "Γράψε 0,7 ως 0,70. Τα 70 εκατοστά είναι περισσότερα από 65.",
    ],
    [
      "0,09",
      "0,1",
      1,
      0.09,
      0.1,
      "Γράψε 0,1 ως 0,10. Τα 10 εκατοστά είναι περισσότερα από τα 9.",
    ],
    [
      "1,05",
      "1,5",
      1,
      1.05,
      1.5,
      "Το ακέραιο μέρος είναι ίδιο: 1. Μετά σύγκρινε τα δέκατα: 0 απέναντι σε 5.",
    ],
    [
      "0,75",
      "0,705",
      0,
      0.75,
      0.705,
      "Γράψε 0,75 ως 0,750. Τώρα σύγκρινε 750 χιλιοστά με 705.",
    ],
  ];
  function save() {
    try {
      localStorage.setItem(
        "aitools4kids-play-v3",
        JSON.stringify({
          xp: S.xp,
          coins: S.coins,
          avatar: S.avatar,
          done: S.done,
          collected: COINS.map((c) => c.t),
          adventure: S.adventure || {},
        }),
      );
    } catch {}
  }
  function load() {
    try {
      let raw =
        localStorage.getItem("aitools4kids-play-v3") ||
        localStorage.getItem("aitools4kids-play-v2");
      let v = JSON.parse(raw || "null");
      if (!v) return;
      S.adventure = v.adventure || {};
      S.xp = Math.max(0, +v.xp || 0);
      S.coins = +v.coins || 0;
      S.avatar = Math.max(0, Math.min(2, +v.avatar || 0));
      S.done = {
        math: !!v.done?.math,
        science: !!v.done?.science,
        history: !!v.done?.history,
        language:
          !!v.done?.language ||
          localStorage.getItem("aitools4kids-language-v1") === "done",
      };
      (v.collected || []).forEach((x, i) => {
        if (COINS[i]) COINS[i].t = x ? 1 : 0;
      });
    } catch {}
  }
  function stars() {
    return Object.values(S.done).filter(Boolean).length;
  }
  function hud() {
    $("xp").textContent = S.xp + " XP";
    $("coins").textContent = S.coins;
    $("stars").textContent = stars();
    $("zones").textContent = stars() + "/4";
  }
  function applyAvatar() {
    let a = AV[S.avatar];
    document.documentElement.style.setProperty("--avatar", a.shirt);
    $("previewHead").style.background = a.skin;
    $("previewHead").style.borderColor = a.skin;
    $("previewHair").style.background = a.hair;
    document
      .querySelectorAll(".avatar-choice")
      .forEach((b) =>
        b.classList.toggle("selected", +b.dataset.avatar === S.avatar),
      );
    save();
  }
  function size() {
    world?.resize();
  }
  function toast(txt) {
    world?.toast(txt);
  }
  function updateMission() {
    world?.status();
  }
  function start() {
    $("intro").hidden = true;
    $("world").hidden = false;
    S.on = true;
    world.start();
  }
  function enterPortal() {
    world.interact();
  }
  function openMath() {
    S.i = 0;
    S.sort = [];
    renderMath();
    $("mathModal").hidden = false;
    $("enter").hidden = true;
  }
  function renderMath() {
    let q = Q[S.i];
    $("compare").hidden = false;
    $("sort").hidden = true;
    $("mathTitle").textContent = "Η Πύλη των Δεκαδικών";
    $("mathCount").textContent = `Αποστολή ${S.i + 1}/6`;
    $("a").textContent = q[0];
    $("b").textContent = q[1];
    $("fb").hidden =
      $("nl").hidden =
      $("retry").hidden =
      $("next").hidden =
        true;
    document.querySelectorAll("#mathModal .door").forEach((b) => {
      b.disabled = false;
      b.style.opacity = 1;
    });
  }
  function answer(i) {
    let q = Q[S.i],
      ok = i == q[2];
    document
      .querySelectorAll("#mathModal .door")
      .forEach((b) => (b.disabled = true));
    $("fb").hidden = $("nl").hidden = false;
    $("fb").classList.toggle("ok", ok);
    $("fi").textContent = ok ? "✅" : "💡";
    $("ft").textContent = ok ? "Σωστά!" : "Κοίτα ξανά";
    $("fp").textContent =
      (ok ? "Μπράβο. " + q[q[2]] + " είναι μεγαλύτερο. " : "") + q[5];
    let mx = Math.max(q[3], q[4]) > 1 ? Math.ceil(Math.max(q[3], q[4])) : 1;
    $("max").textContent = String(mx).replace(".", ",");
    [
      ["ma", q[3], q[0]],
      ["mb", q[4], q[1]],
    ].forEach((m) => {
      let e = $(m[0]);
      e.style.left = 5 + (m[1] / mx) * 90 + "%";
      e.querySelector("em").textContent = m[2];
    });
    if (ok) {
      S.xp += 50;
      hud();
      save();
      $("next").hidden = false;
    } else {
      $("retry").hidden = false;
      document.querySelector(`[data-i="${i}"]`).style.opacity = 0.55;
    }
  }
  function nextMath() {
    if (++S.i >= Q.length) showSort();
    else renderMath();
  }
  function showSort() {
    S.sort = [];
    $("compare").hidden = true;
    $("sort").hidden = false;
    $("mathTitle").textContent = "Η Γέφυρα της Σωστής Σειράς";
    $("mathCount").textContent = "Αποστολή 6/6";
    $("sfb").hidden = $("sortreset").hidden = $("mathFinish").hidden = true;
    document
      .querySelectorAll("#mathModal .sortcard")
      .forEach((b) => (b.disabled = false));
    drawSeq();
  }
  function drawSeq() {
    let e = $("seq");
    e.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      let x = document.createElement("span");
      x.textContent =
        S.sort[i] != null ? String(S.sort[i]).replace(".", ",") : i + 1 + "ο;";
      e.appendChild(x);
    }
  }
  function chooseSort(b) {
    if (S.sort.length >= 3) return;
    let v = +b.dataset.v;
    S.sort.push(v);
    b.disabled = true;
    drawSeq();
    if (S.sort.length === 3) {
      let ok = S.sort.every((v, i) => v == [0.09, 0.8, 1.2][i]);
      $("sfb").hidden = false;
      $("sfb").classList.toggle("ok", ok);
      $("sft").textContent = ok
        ? "Η γέφυρα χτίστηκε!"
        : "Η σειρά δεν είναι σωστή ακόμα";
      $("sfp").textContent = ok
        ? "0,09 < 0,8 < 1,2. Σύγκρινες τους δεκαδικούς με βάση την αξία τους."
        : "Ξεκίνα από τον αριθμό πιο κοντά στο μηδέν. Θυμήσου ότι 0,8 = 0,80.";
      $("mathFinish").hidden = !ok;
      $("sortreset").hidden = ok;
      if (ok) {
        S.xp += 100;
        hud();
        save();
      }
    }
  }
  function resetSort() {
    S.sort = [];
    document
      .querySelectorAll("#mathModal .sortcard")
      .forEach((b) => (b.disabled = false));
    $("sfb").hidden = $("sortreset").hidden = true;
    drawSeq();
  }
  function completeMath() {
    let first = !S.done.math;
    S.done.math = true;
    if (first) S.xp += 50;
    save();
    hud();
    $("mathModal").hidden = true;
    showFinish(
      "Math City ολοκληρώθηκε!",
      "Ξεκλείδωσες το Science Lab.",
      first ? "⚡ +50 XP" : "🔁 Επανάληψη",
    );
  }
  function openScience() {
    resetCircuit();
    $("scienceCount").textContent = "Πείραμα 1/2";
    $("scienceTitle").textContent = "Άναψε τη λάμπα";
    $("circuitMission").hidden = false;
    $("conductorMission").hidden = true;
    $("scienceModal").hidden = false;
    $("enter").hidden = true;
  }
  function resetCircuit() {
    S.circuit = [];
    document.querySelectorAll("#scienceModal .lab-item").forEach((b) => {
      b.disabled = false;
      b.classList.remove("active", "on");
    });
    $("lampIcon").textContent = "💡";
    $("circuitFb").hidden =
      $("circuitReset").hidden =
      $("scienceNext").hidden =
        true;
    drawCircuit();
  }
  function drawCircuit() {
    let e = $("circuitSeq");
    e.innerHTML = "";
    const icons = { battery: "🔋", wire: "〰️", lamp: "💡", paper: "📄" };
    for (let i = 0; i < 3; i++) {
      let s = document.createElement("span");
      s.textContent = S.circuit[i] ? icons[S.circuit[i]] : i + 1;
      e.appendChild(s);
    }
  }
  function chooseCircuit(b) {
    if (S.circuit.length >= 3) return;
    S.circuit.push(b.dataset.part);
    b.disabled = true;
    b.classList.add("active");
    drawCircuit();
    if (S.circuit.length !== 3) return;
    let ok =
      ["battery", "wire", "lamp"].every((x) => S.circuit.includes(x)) &&
      !S.circuit.includes("paper");
    $("circuitFb").hidden = false;
    $("circuitFb").classList.toggle("ok", ok);
    $("circuitFt").textContent = ok
      ? "Η λάμπα μπορεί να ανάψει!"
      : "Κάτι από τον πάγκο δεν χρειάζεται";
    $("circuitFp").textContent = ok
      ? "Χρειάζεσαι πηγή ενέργειας, αγώγιμη διαδρομή και συσκευή που χρησιμοποιεί την ενέργεια. Δεν υπάρχει υποχρεωτική σειρά επιλογής."
      : "Το χαρτί δεν είναι βασικό εξάρτημα του απλού κυκλώματος. Διάλεξε μπαταρία, καλώδιο και λάμπα.";
    $("scienceNext").hidden = !ok;
    $("circuitReset").hidden = ok;
    if (ok) {
      $("lampIcon").textContent = "🌟";
      document.querySelector(".lab-item.lamp").classList.add("on");
    }
  }
  function nextScience() {
    $("circuitMission").hidden = true;
    $("conductorMission").hidden = false;
    $("scienceCount").textContent = "Πείραμα 2/2";
    $("scienceTitle").textContent = "Βρες τον αγωγό";
    $("materialFb").hidden = true;
    $("scienceFinish").hidden = true;
    document
      .querySelectorAll("#scienceModal .materials button")
      .forEach((b) => {
        b.disabled = false;
        b.classList.remove("right", "wrong");
      });
  }
  function chooseMaterial(b) {
    let ok = b.dataset.material === "metal";
    document
      .querySelectorAll("#scienceModal .materials button")
      .forEach((x) => (x.disabled = true));
    b.classList.add(ok ? "right" : "wrong");
    $("materialFb").hidden = false;
    $("materialFb").classList.toggle("ok", ok);
    $("materialIcon").textContent = ok ? "✅" : "💡";
    $("materialFt").textContent = ok
      ? "Σωστά — το μέταλλο είναι αγωγός"
      : "Δοκίμασε ξανά";
    $("materialFp").textContent = ok
      ? "Τα μέταλλα επιτρέπουν στο ηλεκτρικό ρεύμα να περάσει πολύ καλύτερα από το ξύλο ή το πλαστικό."
      : "Το ξύλο και το πλαστικό χρησιμοποιούνται συνήθως ως μονωτικά. Ψάξε το μεταλλικό αντικείμενο.";
    $("scienceFinish").hidden = !ok;
    if (!ok)
      setTimeout(() => {
        document
          .querySelectorAll("#scienceModal .materials button")
          .forEach((x) => {
            x.disabled = false;
            x.classList.remove("wrong");
          });
        $("materialFb").hidden = true;
      }, 900);
  }
  function completeScience() {
    let first = !S.done.science;
    S.done.science = true;
    if (first) S.xp += 150;
    save();
    hud();
    $("scienceModal").hidden = true;
    showFinish(
      "Science Lab ολοκληρώθηκε!",
      "Ξεκλείδωσες το History Island.",
      first ? "⚡ +150 XP" : "🔁 Επανάληψη",
    );
  }
  function openHistory() {
    S.timeline = [];
    $("historyModal").hidden = false;
    $("enter").hidden = true;
    showHistoryIntro();
  }
  function showHistoryIntro() {
    $("historyIntro").hidden = false;
    $("historyTimeline").hidden = true;
    $("historyArtifact").hidden = true;
    $("historyCount").textContent = "Αποστολή 1/3";
    $("historyTitle").textContent = "Ο φύλακας της Χρονοπύλης";
    $("npcText").textContent =
      "Η χρονογραμμή του 1821 μπερδεύτηκε. Χρειάζομαι έναν εξερευνητή που θα βάλει ξανά τα γεγονότα στη σωστή θέση.";
  }
  function startTimeline() {
    $("historyIntro").hidden = true;
    $("historyTimeline").hidden = false;
    $("historyCount").textContent = "Αποστολή 2/3";
    $("historyTitle").textContent = "Επισκεύασε τη χρονογραμμή";
    S.timeline = [];
    document.querySelectorAll("#historyModal .time-stone").forEach((b) => {
      b.disabled = false;
      b.classList.remove("chosen");
    });
    $("timelineFb").hidden =
      $("timelineReset").hidden =
      $("artifactNext").hidden =
        true;
    drawTimeline();
  }
  function drawTimeline() {
    let e = $("timelineSlots");
    e.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      let s = document.createElement("span");
      s.textContent = S.timeline[i] || "?";
      e.appendChild(s);
    }
  }
  function chooseTime(b) {
    if (S.timeline.length >= 3) return;
    S.timeline.push(b.dataset.year);
    b.disabled = true;
    b.classList.add("chosen");
    drawTimeline();
    if (S.timeline.length !== 3) return;
    let ok = S.timeline.join(",") === "1814,1821,1830";
    $("timelineFb").hidden = false;
    $("timelineFb").classList.toggle("ok", ok);
    $("timelineFt").textContent = ok
      ? "Η Χρονοπύλη σταθεροποιήθηκε!"
      : "Η σειρά χρειάζεται διόρθωση";
    $("timelineFp").textContent = ok
      ? "1814: ιδρύεται η Φιλική Εταιρεία • 1821: ξεκινά η Ελληνική Επανάσταση • 1830: το Πρωτόκολλο του Λονδίνου αναγνωρίζει την Ελλάδα ως ανεξάρτητο κράτος."
      : "Βάλε τα γεγονότα από το παλαιότερο προς το νεότερο.";
    $("artifactNext").hidden = !ok;
    $("timelineReset").hidden = ok;
  }
  function resetTimeline() {
    S.timeline = [];
    document.querySelectorAll("#historyModal .time-stone").forEach((b) => {
      b.disabled = false;
      b.classList.remove("chosen");
    });
    $("timelineFb").hidden = $("timelineReset").hidden = true;
    drawTimeline();
  }
  function startArtifact() {
    $("historyTimeline").hidden = true;
    $("historyArtifact").hidden = false;
    $("historyCount").textContent = "Αποστολή 3/3";
    $("historyTitle").textContent = "Βρες τον αναχρονισμό";
    $("artifactFb").hidden = $("historyFinish").hidden = true;
    document.querySelectorAll("#historyModal .artifact").forEach((b) => {
      b.disabled = false;
      b.classList.remove("right", "wrong");
    });
  }
  function chooseArtifact(b) {
    let ok = b.dataset.artifact === "phone";
    document
      .querySelectorAll("#historyModal .artifact")
      .forEach((x) => (x.disabled = true));
    b.classList.add(ok ? "right" : "wrong");
    $("artifactFb").hidden = false;
    $("artifactFb").classList.toggle("ok", ok);
    $("artifactIcon").textContent = ok ? "✅" : "🕰️";
    $("artifactFt").textContent = ok ? "Το βρήκες!" : "Κοίτα την εποχή";
    $("artifactFp").textContent = ok
      ? "Ένα σύγχρονο κινητό δεν ανήκει σε σκηνή του 1821. Αυτό λέγεται αναχρονισμός: κάτι τοποθετείται σε εποχή στην οποία δεν υπήρχε."
      : "Σκέψου ποιο αντικείμενο είναι προϊόν της σύγχρονης τεχνολογίας.";
    $("historyFinish").hidden = !ok;
    if (!ok)
      setTimeout(() => {
        document.querySelectorAll("#historyModal .artifact").forEach((x) => {
          x.disabled = false;
          x.classList.remove("wrong");
        });
        $("artifactFb").hidden = true;
      }, 900);
  }
  function completeHistory() {
    let first = !S.done.history;
    S.done.history = true;
    if (first) S.xp += 200;
    save();
    hud();
    $("historyModal").hidden = true;
    showFinish(
      "History Island ολοκληρώθηκε!",
      "Έμαθες να σκέφτεσαι με χρονογραμμή και να εντοπίζεις αναχρονισμούς.",
      first ? "⚡ +200 XP" : "🔁 Επανάληψη",
    );
  }
  function showFinish(title, text, reward) {
    $("world").hidden = true;
    S.on = false;
    world.pause();
    $("finishTitle").textContent = title;
    $("finishText").textContent = text;
    $("finishRewards").innerHTML =
      `<span>${reward}</span><span>⭐ ${stars()}/4 περιοχές</span>` +
      Object.keys(S.done)
        .filter((k) => S.done[k])
        .map((k) => `<span>${BADGES[k]}</span>`)
        .join("");
    $("finish").hidden = false;
  }
  function backWorld() {
    $("finish").hidden = true;
    $("world").hidden = false;
    S.on = true;
    world.resume();
  }
  function resetAll() {
    if (!confirm("Να μηδενιστεί η πρόοδος του παιχνιδιού σε αυτή τη συσκευή;"))
      return;
    try {
      localStorage.removeItem("aitools4kids-play-v3");
      localStorage.removeItem("aitools4kids-play-v2");
      localStorage.removeItem("aitools4kids-language-v1");
    } catch {}
    S.xp = S.coins = 0;
    S.adventure = {};
    S.done = { math: false, science: false, history: false, language: false };
    S.avatar = 0;
    S.p = { x: 0.18, y: 0.72 };
    COINS.forEach((c) => (c.t = 0));
    hud();
    applyAvatar();
    location.reload();
  }
  function closeModal(id) {
    $(id).hidden = true;
    world.resume();
  }

  const BADGES = {
    math: "🔢 Decimal Explorer",
    science: "⚡ Circuit Builder",
    history: "🏺 Time Traveller",
    language: "📚 Word Master",
  };
  let words = [];
  const m = document.createElement("section");
  m.id = "langModal";
  m.className = "modal";
  m.hidden = 1;
  m.innerHTML = `<div class="card quiz"><button id="langClose" class="close">×</button><div class="top"><span class="pill lang-pill">📚 Language Academy</span><b id="langCount">1/3</b></div><h2 id="langTitle">Η βιβλιοθήκη των λέξεων</h2><div id="langIntro"><p class="q">Οι λέξεις έφυγαν από τις σελίδες. Βοήθησέ με να ξαναφτιάξουμε μια σωστή πρόταση.</p><button id="langStart" class="btn primary">Ξεκινάω</button></div><div id="langSentence" class="sortbox" hidden><p class="q">Πάτησε τις λέξεις με τη σωστή σειρά.</p><div class="sortcards"><button class="sortcard word-chip" data-w="διαβάζει">διαβάζει</button><button class="sortcard word-chip" data-w="Το">Το</button><button class="sortcard word-chip" data-w="βιβλίο.">βιβλίο.</button><button class="sortcard word-chip" data-w="ένα">ένα</button><button class="sortcard word-chip" data-w="παιδί">παιδί</button></div><div id="langSeq" class="sequence"></div><div id="langFb" class="feedback" hidden><div>✍️</div><div><h3 id="langFt"></h3><p id="langFp"></p></div></div><div class="actions"><button id="langReset" class="btn soft" hidden>Ξανά</button><button id="langNext" class="btn primary" hidden>Επόμενο</button></div></div><div id="langVerb" hidden><p class="q">Στην πρόταση «Η Μαρία γράφει μια ιστορία.», ποια λέξη είναι το ρήμα;</p><div class="materials"><button data-v="m">Μαρία</button><button data-v="g">γράφει</button><button data-v="i">ιστορία</button></div><div id="verbFb" class="feedback" hidden><div>📖</div><div><h3 id="verbFt"></h3><p id="verbFp"></p></div></div><div class="actions"><button id="langFinish" class="btn primary" hidden>Ολοκλήρωση κόσμου</button></div></div></div>`;
  document.body.insertBefore(m, $("finish"));

  function verbButtons() {
    return document.querySelectorAll("#langVerb [data-v]");
  }
  function openLanguage() {
    $("langModal").hidden = false;
    $("langIntro").hidden = false;
    $("langSentence").hidden = true;
    $("langVerb").hidden = true;
    $("langCount").textContent = "1/3";
    $("langTitle").textContent = "Η βιβλιοθήκη των λέξεων";
  }
  function resetWords() {
    words = [];
    document.querySelectorAll(".word-chip").forEach((b) => (b.disabled = 0));
    $("langFb").hidden = $("langReset").hidden = $("langNext").hidden = 1;
    drawWords();
  }
  function drawWords() {
    let e = $("langSeq");
    e.innerHTML = "";
    if (!words.length) {
      let x = document.createElement("span");
      x.textContent = "Οι λέξεις θα μπουν εδώ";
      e.appendChild(x);
    } else
      words.forEach((w) => {
        let x = document.createElement("span");
        x.textContent = w;
        e.appendChild(x);
      });
  }
  function pick(b) {
    if (words.length > 4) return;
    words.push(b.dataset.w);
    b.disabled = 1;
    drawWords();
    if (words.length === 5) {
      let ok = words.join("|") === "Το|παιδί|διαβάζει|ένα|βιβλίο.";
      $("langFb").hidden = 0;
      $("langFb").classList.toggle("ok", ok);
      $("langFt").textContent = ok ? "Σωστά!" : "Δοκίμασε άλλη σειρά";
      $("langFp").textContent = ok
        ? "«Το παιδί διαβάζει ένα βιβλίο.»"
        : "Ξεκίνα με «Το παιδί» και μετά σκέψου τι κάνει.";
      $("langNext").hidden = !ok;
      $("langReset").hidden = ok;
    }
  }
  function verb() {
    $("langSentence").hidden = 1;
    $("langVerb").hidden = 0;
    $("langCount").textContent = "3/3";
    $("langTitle").textContent = "Βρες το ρήμα";
    $("verbFb").hidden = $("langFinish").hidden = 1;
    verbButtons().forEach((b) => (b.disabled = 0));
  }
  function choose(b) {
    let ok = b.dataset.v === "g";
    verbButtons().forEach((x) => (x.disabled = 1));
    $("verbFb").hidden = 0;
    $("verbFb").classList.toggle("ok", ok);
    $("verbFt").textContent = ok
      ? "Σωστά — «γράφει» είναι το ρήμα"
      : "Δοκίμασε ξανά";
    $("verbFp").textContent = ok
      ? "Το ρήμα δείχνει τι κάνει η Μαρία."
      : "Ψάξε τη λέξη που δείχνει τη δράση.";
    $("langFinish").hidden = !ok;
    if (!ok)
      setTimeout(() => {
        verbButtons().forEach((x) => (x.disabled = 0));
        $("verbFb").hidden = 1;
      }, 800);
  }

  function finishLanguage() {
    const first = !S.done.language;
    S.done.language = true;
    if (first) S.xp += 200;
    save();
    hud();
    m.hidden = true;
    showFinish(
      "Ο κόσμος ολοκληρώθηκε!",
      "Εξερεύνησες τέσσερις περιοχές και κέρδισες τα σήματα του κόσμου.",
      first ? "⚡ +200 XP" : "🔁 Επανάληψη",
    );
  }
  $("langClose").onclick = () => closeModal("langModal");
  $("langStart").onclick = () => {
    $("langIntro").hidden = true;
    $("langSentence").hidden = false;
    $("langCount").textContent = "2/3";
    resetWords();
  };
  $("langReset").onclick = resetWords;
  $("langNext").onclick = verb;
  $("langFinish").onclick = finishLanguage;
  document
    .querySelectorAll("#langModal .word-chip")
    .forEach((b) => (b.onclick = () => pick(b)));
  verbButtons().forEach((b) => (b.onclick = () => choose(b)));
  load();
  hud();
  applyAvatar();
  const world = new AdventureWorld({
    state: S,
    save,
    hud,
    open: {
      math: openMath,
      science: openScience,
      history: openHistory,
      language: openLanguage,
    },
  });

  $("start").onclick = start;
  $("how").onclick = () => {
    $("help").hidden = !$("help").hidden;
  };
  $("resetAll").onclick = resetAll;
  $("enter").onclick = enterPortal;
  $("retry").onclick = renderMath;
  $("next").onclick = nextMath;
  $("sortreset").onclick = resetSort;
  $("mathFinish").onclick = completeMath;
  $("circuitReset").onclick = resetCircuit;
  $("scienceNext").onclick = nextScience;
  $("scienceFinish").onclick = completeScience;
  $("npcContinue").onclick = startTimeline;
  $("timelineReset").onclick = resetTimeline;
  $("artifactNext").onclick = startArtifact;
  $("historyFinish").onclick = completeHistory;
  $("back").onclick = backWorld;
  $("again").onclick = resetAll;
  document.querySelectorAll(".avatar-choice").forEach(
    (b) =>
      (b.onclick = () => {
        S.avatar = +b.dataset.avatar;
        applyAvatar();
      }),
  );
  document
    .querySelectorAll("#mathModal .door")
    .forEach((b) => (b.onclick = () => answer(+b.dataset.i)));
  document
    .querySelectorAll("#mathModal .sortcard")
    .forEach((b) => (b.onclick = () => chooseSort(b)));
  document
    .querySelectorAll("#scienceModal .lab-item")
    .forEach((b) => (b.onclick = () => chooseCircuit(b)));
  document
    .querySelectorAll("#scienceModal .materials button")
    .forEach((b) => (b.onclick = () => chooseMaterial(b)));
  document
    .querySelectorAll("#historyModal .time-stone")
    .forEach((b) => (b.onclick = () => chooseTime(b)));
  document
    .querySelectorAll("#historyModal .artifact")
    .forEach((b) => (b.onclick = () => chooseArtifact(b)));
  document
    .querySelectorAll("[data-close]")
    .forEach((b) => (b.onclick = () => closeModal(b.dataset.close)));
})();
