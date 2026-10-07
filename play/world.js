/* Browser-only adventure engine. One player, one loop, one persisted quest state. */
(() => {
  "use strict";
  const AREAS = {
    math: {
      name: "Math City",
      color: "#428be2",
      npc: "🤖 Ρομπότ οδηγός",
      clue: "Πάτησε τις πλάκες από τον μικρότερο δεκαδικό στον μεγαλύτερο: 0,09 → 0,8 → 1,2. Έτσι χτίζεις τη γέφυρα. Βρες και τα δύο κρυσταλλάκια και πέρασε στην Πύλη των Δεκαδικών.",
      items: [
        ["crystal-a", "◆", 250, 530],
        ["crystal-b", "◆", 750, 460],
      ],
      tiles: [
        ["0,8", 330, 360],
        ["0,09", 190, 290],
        ["1,2", 360, 220],
      ],
      goal: "Πλάκες 0,09 → 0,8 → 1,2 • 2 κρύσταλλοι",
    },
    science: {
      name: "Science Lab",
      color: "#26a376",
      npc: "🧑‍🔬 Βοηθός εργαστηρίου",
      clue: "Τα εξαρτήματα χάθηκαν στον κήπο του εργαστηρίου. Βρες μπαταρία, καλώδιο και λάμπα. Έπειτα φέρε τα στον πάγκο, στην άλλη πλευρά της γέφυρας, για να φτιάξεις κλειστό κύκλωμα.",
      items: [
        ["battery", "🔋", 240, 240],
        ["wire", "〰️", 390, 520],
        ["lamp", "💡", 730, 210],
      ],
      goal: "Βρες μπαταρία, καλώδιο και λάμπα → πάγκος",
    },
    history: {
      name: "History Island",
      color: "#bc773b",
      npc: "🏺 Φύλακας χρονογραμμής",
      clue: "Βρες τις τρεις χαμένες πέτρες: 1814, 1821, 1830. Μία είναι κοντά στο πηγάδι και δύο κρύβονται πέρα από τη γέφυρα. Ένα κινητό έχει χαθεί στη λάθος εποχή· βρες το και φέρε τα όλα στη χρονοπύλη.",
      items: [
        ["1814", "1814", 270, 530],
        ["1821", "1821", 750, 220],
        ["1830", "1830", 660, 520],
        ["phone", "📱", 830, 430],
      ],
      goal: "3 πέτρες χρονογραμμής + ο αναχρονισμός → χρονοπύλη",
    },
    language: {
      name: "Language Academy",
      color: "#8e63bf",
      npc: "📚 Βιβλιοθηκάριος",
      clue: "Οι λέξεις σκορπίστηκαν στον κήπο της βιβλιοθήκης. Βρες: Το, παιδί, διαβάζει, ένα, βιβλίο. Πέρασε και από τα δύο μονοπάτια. Έπειτα φέρε τις λέξεις στο αναγνωστήριο και βάλε τις στη σειρά.",
      items: [
        ["Το", "Το", 250, 230],
        ["παιδί", "παιδί", 350, 520],
        ["διαβάζει", "διαβάζει", 690, 260],
        ["ένα", "ένα", 800, 480],
        ["βιβλίο.", "βιβλίο.", 710, 550],
      ],
      goal: "5 χαμένες λέξεις → αναγνωστήριο",
    },
  };
  class AdventureWorld {
    constructor(api) {
      Object.assign(this, api);
      this.canvas = document.getElementById("c");
      this.ctx = this.canvas.getContext("2d");
      this.area = "hub";
      this.player = { x: 160, y: 360 };
      this.keys = new Set();
      this.dir = null;
      this.last = 0;
      this.running = false;
      this.frameId = 0;
      this.near = null;
      this.tileContact = null;
      this.scale = 1;
      this.cam = { x: 0, y: 0 };
      this.state.adventure ||= {};
      this.bind();
      this.makeMap();
    }
    quest() {
      return (this.state.adventure[this.area] ||= {
        talked: false,
        items: [],
        coins: [],
        order: 0,
      });
    }
    unlocked(k) {
      return (
        k === "math" ||
        (k === "science" && this.state.done.math) ||
        (k === "history" && this.state.done.science) ||
        (k === "language" && this.state.done.history)
      );
    }
    makeMap() {
      this.obstacles = [
        { x: 80, y: 160, w: 100, h: 100, type: "building" },
        { x: 570, y: 130, w: 95, h: 90, type: "building" },
        { x: 820, y: 180, w: 95, h: 90, type: "building" },
        { x: 90, y: 490, w: 100, h: 75, type: "building" },
        ...[
          [300, 170],
          [420, 260],
          [600, 450],
          [850, 540],
          [380, 440],
          [700, 130],
        ].map(([x, y]) => ({ x, y, w: 36, h: 36, type: "tree" })),
        { x: 210, y: 420, w: 42, h: 32, type: "rock" },
      ];
      if (this.area === "hub") {
        this.obstacles = this.obstacles.filter((o) => o.type !== "building");
        this.portals = [
          ["math", 760, 230],
          ["science", 750, 490],
          ["history", 260, 230],
          ["language", 260, 490],
        ];
      }
      this.status();
    }
    bind() {
      const $ = (id) => document.getElementById(id);
      $("enter").onclick = () => this.interact();
      $("mapBack").onclick = () => this.changeArea("hub");
      $("npcOk").onclick = () => {
        $("npcDialog").close();
        this.resume();
      };
      $("npcDialog").addEventListener("cancel", () => this.resume());
      addEventListener("resize", () => this.resize());
      addEventListener("blur", () => this.clearKeys());
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) this.clearKeys();
      });
      addEventListener("keydown", (e) => {
        if (!this.running || this.blocked()) return;
        if (
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(
            e.key,
          )
        )
          e.preventDefault();
        this.keys.add(e.key.toLowerCase());
        if (e.key === "Enter" && !e.repeat) this.interact();
      });
      addEventListener("keyup", (e) => this.keys.delete(e.key.toLowerCase()));
      document.querySelectorAll(".pad button").forEach((b) => {
        b.addEventListener("pointerdown", (e) => {
          e.preventDefault();
          b.setPointerCapture(e.pointerId);
          this.dir = b.dataset.d;
          this.move(55);
        });
        const release = () => {
          if (this.dir === b.dataset.d) this.dir = null;
        };
        b.addEventListener("pointerup", release);
        b.addEventListener("pointercancel", release);
        b.addEventListener("lostpointercapture", release);
      });
    }
    clearKeys() {
      this.keys.clear();
      this.dir = null;
    }
    blocked() {
      return (
        !!document.querySelector(".modal:not([hidden]),#npcDialog[open]") ||
        !document.getElementById("finish").hidden
      );
    }
    start() {
      const params = new URLSearchParams(location.search);
      this.changeArea(
        params.get("mission") === "decimals.longer_is_larger" ? "math" : "hub",
      );
      this.resume();
    }
    changeArea(area) {
      this.area = area;
      this.player = { x: area === "hub" ? 500 : 160, y: 360 };
      this.near = null;
      this.tileContact = null;
      this.clearKeys();
      this.makeMap();
      document.getElementById("mapBack").hidden = area === "hub";
      this.resize();
      this.resume();
    }
    resize() {
      const r = this.canvas.getBoundingClientRect(),
        d = Math.min(devicePixelRatio || 1, 2);
      this.canvas.width = r.width * d;
      this.canvas.height = r.height * d;
      this.dpr = d;
      this.scale = Math.max(0.72, Math.min(r.width / 1000, r.height / 700));
      this.draw();
    }
    pause() {
      this.running = false;
      cancelAnimationFrame(this.frameId);
      this.clearKeys();
    }
    resume() {
      this.clearKeys();
      if (!this.running) {
        this.running = true;
        this.last = performance.now();
        this.frameId = requestAnimationFrame((t) => this.frame(t));
      }
      this.status();
    }
    frame(t) {
      if (!this.running) return;
      const dt = Math.min(t - this.last, 40);
      this.last = t;
      if (!this.blocked()) {
        this.move(dt);
        this.collect();
        this.findNear();
      } else this.clearKeys();
      this.draw();
      this.frameId = requestAnimationFrame((t) => this.frame(t));
    }
    canStand(x, y) {
      const r = 14;
      if (x < 50 || x > 950 || y < 150 || y > 600) return false;
      const bridge = y >= 320 + r && y <= 400 - r;
      if (
        this.area !== "hub" &&
        x + r > 470 &&
        x - r < 530 &&
        (!bridge || (this.area === "math" && this.quest().order < 3))
      )
        return false;
      return !this.obstacles.some(
        (o) =>
          x + r > o.x && x - r < o.x + o.w && y + r > o.y && y - r < o.y + o.h,
      );
    }
    move(dt) {
      if (this.blocked()) return;
      let dx = 0,
        dy = 0;
      const k = this.keys;
      dx =
        +(k.has("arrowright") || k.has("d") || this.dir === "right") -
        +(k.has("arrowleft") || k.has("a") || this.dir === "left");
      dy =
        +(k.has("arrowdown") || k.has("s") || this.dir === "down") -
        +(k.has("arrowup") || k.has("w") || this.dir === "up");
      const len = Math.hypot(dx, dy) || 1,
        speed = 0.24 * dt;
      dx = (dx / len) * speed;
      dy = (dy / len) * speed;
      if (this.canStand(this.player.x + dx, this.player.y)) this.player.x += dx;
      if (this.canStand(this.player.x, this.player.y + dy)) this.player.y += dy;
    }
    collect() {
      if (this.area === "hub") return;
      const q = this.quest(),
        a = AREAS[this.area];
      let changed = false;
      for (const [id, label, x, y] of a.items) {
        if (
          !q.items.includes(id) &&
          Math.hypot(this.player.x - x, this.player.y - y) < 30
        ) {
          q.items.push(id);
          this.state.xp += 10;
          this.toast("🎒 " + label + " βρέθηκε! +10 XP");
          changed = true;
        }
      }
      [
        [320, 570],
        [890, 350],
        [620, 290],
      ].forEach(([x, y], i) => {
        if (
          !q.coins.includes(i) &&
          Math.hypot(this.player.x - x, this.player.y - y) < 27
        ) {
          q.coins.push(i);
          this.state.coins++;
          this.state.xp += 10;
          this.toast("🪙 +10 XP");
          changed = true;
        }
      });
      if (a.tiles) {
        const tile = a.tiles.find(
          (t) => Math.hypot(this.player.x - t[1], this.player.y - t[2]) < 30,
        );
        const id = tile?.[0] || null;
        if (id !== this.tileContact) {
          this.tileContact = id;
          if (tile && q.order < 3) {
            if (id === ["0,09", "0,8", "1,2"][q.order]) {
              q.order++;
              this.toast(
                q.order === 3
                  ? "🌉 Η γέφυρα άνοιξε!"
                  : "✓ Σωστή πλάκα — συνέχισε",
              );
              changed = true;
            } else {
              q.order = 0;
              this.toast("Κοίτα ξανά: 0,09 < 0,8 < 1,2");
              changed = true;
            }
          }
        }
      }
      if (changed) {
        this.save();
        this.hud();
        this.status();
      }
    }
    ready() {
      const q = this.quest(),
        a = AREAS[this.area];
      return (
        q.talked &&
        a.items.every((i) => q.items.includes(i[0])) &&
        (!a.tiles || q.order === 3)
      );
    }
    findNear() {
      let n = null;
      if (this.area === "hub") {
        const p = this.portals.find(
          (p) => Math.hypot(this.player.x - p[1], this.player.y - p[2]) < 64,
        );
        if (p) n = { type: "portal", key: p[0] };
      } else if (Math.hypot(this.player.x - 210, this.player.y - 360) < 65)
        n = { type: "npc" };
      else if (Math.hypot(this.player.x - 790, this.player.y - 350) < 65)
        n = { type: "goal" };
      if (JSON.stringify(n) !== JSON.stringify(this.near)) {
        this.near = n;
        this.status();
      }
    }
    status() {
      const $ = (id) => document.getElementById(id),
        a = AREAS[this.area];
      $("enter").hidden = !this.near;
      $("inventory").textContent = a
        ? "🎒 " +
          this.quest().items.length +
          "/" +
          a.items.length +
          " αντικείμενα" +
          (a.tiles ? " · 🌉 " + this.quest().order + "/3" : "")
        : "";
      $("mt").textContent = a
        ? "🗺️ " + a.name
        : "🗺️ AI Tools 4 Kids — Κόσμος μάθησης";
      $("ms").textContent = a
        ? a.goal
        : "Διάλεξε μονοπάτι. Math → Science → History → Language.";
      if (this.near?.type === "npc")
        $("enter").textContent = "Enter · Μίλα στον οδηγό";
      if (this.near?.type === "goal")
        $("enter").textContent = this.ready()
          ? "Enter · Ξεκίνα την πρόκληση"
          : "Enter · Τι μου λείπει;";
      if (this.near?.type === "portal")
        $("enter").textContent = this.unlocked(this.near.key)
          ? "Εξερεύνησε " + AREAS[this.near.key].name
          : "🔒 Ολοκλήρωσε την προηγούμενη περιοχή";
    }
    interact() {
      if (this.blocked() || !this.near) return;
      const n = this.near;
      if (n.type === "portal") {
        if (this.unlocked(n.key)) this.changeArea(n.key);
        else this.toast("🔒 Ακολούθησε τη σειρά των περιοχών");
        return;
      }
      if (n.type === "npc" || !this.ready()) {
        if (n.type === "npc") {
          this.quest().talked = true;
          this.save();
        }
        const a = AREAS[this.area];
        document.getElementById("npcName").textContent = a.npc;
        document.getElementById("npcClue").textContent = a.clue;
        this.clearKeys();
        document.getElementById("npcDialog").showModal();
        return;
      }
      this.clearKeys();
      this.open[this.area]();
    }
    toast(txt) {
      const e = document.getElementById("toast");
      e.textContent = txt;
      e.classList.add("show");
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => e.classList.remove("show"), 1800);
    }
    draw() {
      const g = this.ctx,
        c = this.canvas,
        w = c.clientWidth,
        h = c.clientHeight,
        s = this.scale;
      if (!w || !h) return;
      this.cam.x = Math.max(
        0,
        Math.min(1000 - w / s, this.player.x - w / s / 2),
      );
      this.cam.y = Math.max(
        0,
        Math.min(700 - h / s, this.player.y - h / s / 2),
      );
      g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      g.fillStyle = "#79ccdf";
      g.fillRect(0, 0, w, h);
      g.translate(
        (w > 1000 * s ? (w - 1000 * s) / 2 : 0) - this.cam.x * s,
        (h > 700 * s ? (h - 700 * s) / 2 : 0) - this.cam.y * s,
      );
      g.scale(s, s);
      g.fillStyle =
        this.area === "history"
          ? "#d6c49b"
          : this.area === "language"
            ? "#a4caa0"
            : "#80bf84";
      g.fillRect(35, 140, 930, 475);
      g.fillStyle = "#59946a";
      g.fillRect(35, 615, 930, 15);
      const path = (pts) => {
        g.strokeStyle = "#d8c9a4";
        g.lineWidth = 48;
        g.lineJoin = "round";
        g.lineCap = "round";
        g.beginPath();
        pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
        g.stroke();
      };
      path([
        [150, 360],
        [860, 360],
      ]);
      path([
        [310, 550],
        [310, 230],
        [800, 230],
      ]);
      path([
        [690, 230],
        [690, 540],
        [300, 540],
      ]);
      path([
        [310, 360],
        [430, 540],
      ]);
      if (this.area !== "hub") {
        g.fillStyle = "#4eafcf";
        g.fillRect(470, 140, 60, 475);
        g.lineWidth = 2;
        const q = this.quest(),
          segments = this.area === "math" ? q.order : 3;
        for (let i = 0; i < segments; i++) {
          g.fillStyle = "#ae7952";
          g.fillRect(470 + i * 20, 320, 20, 80);
          g.strokeStyle = "#734a36";
          g.strokeRect(470 + i * 20, 320, 20, 80);
        }
        if (segments < 3)
          this.label("Γέφυρα " + segments + "/3", 500, 305, "#254960");
      }
      this.obstacles.forEach((o) => {
        g.fillStyle = "#28493525";
        g.fillRect(o.x + 8, o.y + 12, o.w, o.h);
        if (o.type === "building") {
          g.fillStyle = AREAS[this.area]?.color || "#6d8dac";
          g.fillRect(o.x, o.y, o.w, o.h);
          g.fillStyle = "#eff1dd";
          g.fillRect(o.x + 12, o.y + 20, 20, 25);
          g.fillRect(o.x + 58, o.y + 20, 20, 25);
          g.fillStyle = "#384b5b";
          g.fillRect(o.x + 38, o.y + o.h - 30, 23, 30);
          g.fillStyle = "#3f5364";
          g.fillRect(o.x - 5, o.y - 12, o.w + 10, 18);
        } else if (o.type === "tree") {
          g.fillStyle = "#845e42";
          g.fillRect(o.x + 13, o.y + 12, 11, 30);
          g.fillStyle = "#328858";
          g.fillRect(o.x - 4, o.y - 15, 44, 36);
          g.fillStyle = "#49a36b";
          g.fillRect(o.x + 4, o.y - 28, 28, 24);
        } else {
          g.fillStyle = "#80959b";
          g.fillRect(o.x, o.y, o.w, o.h);
          g.fillStyle = "#a9b9b8";
          g.fillRect(o.x + 5, o.y, 25, 10);
        }
      });
      if (this.area === "hub") {
        this.portals.forEach(([k, x, y]) => {
          const a = AREAS[k],
            on = this.unlocked(k);
          g.fillStyle = on ? a.color : "#647479";
          g.fillRect(x - 28, y - 25, 56, 52);
          g.fillStyle = "#d8edee";
          g.fillRect(x - 17, y - 16, 34, 42);
          this.label(a.name, x, y - 40, a.color);
          this.label(
            this.state.done[k]
              ? "✓ Ολοκληρώθηκε"
              : on
                ? "Εξερεύνησε"
                : "🔒 Κλειστό",
            x,
            y + 52,
            "#254960",
          );
        });
        this.label("Πλατεία εξερευνητών", 500, 195, "#254960");
      } else {
        const a = AREAS[this.area],
          q = this.quest();
        a.items.forEach(([id, label, x, y]) => {
          if (!q.items.includes(id)) {
            g.fillStyle = "#fff3ca";
            g.fillRect(x - 23, y - 20, 46, 40);
            this.label(label, x, y + 5, "#624c30");
          }
        });
        [
          [320, 570],
          [890, 350],
          [620, 290],
        ].forEach(([x, y], i) => {
          if (!q.coins.includes(i)) {
            g.fillStyle = "#f3c343";
            g.strokeStyle = "#ab7920";
            g.lineWidth = 2;
            g.beginPath();
            g.arc(x, y, 11, 0, Math.PI * 2);
            g.fill();
            g.stroke();
            this.label("★", x, y + 5, "#8d671e");
          }
        });
        if (a.tiles)
          a.tiles.forEach(([txt, x, y]) => {
            g.fillStyle =
              q.order > ["0,09", "0,8", "1,2"].indexOf(txt)
                ? "#66d49a"
                : "#e8edf3";
            g.fillRect(x - 37, y - 24, 74, 48);
            this.label(txt, x, y + 6, "#274362");
          });
        this.label(a.npc.replace(/^\S+ /, ""), 210, 320, a.color);
        g.fillStyle = a.color;
        g.fillRect(195, 350, 30, 36);
        g.fillStyle = this.area === "math" ? "#c9dcea" : "#edbd92";
        g.fillRect(196, 328, 28, 24);
        g.fillStyle = "#26445a";
        g.fillRect(201, 338, 5, 5);
        g.fillRect(214, 338, 5, 5);
        g.fillRect(200, 385, 8, 12);
        g.fillRect(215, 385, 8, 12);
        this.label("Enter · Οδηγός", 210, 410, "#254960");
        g.fillStyle = this.ready() ? "#f0c755" : "#748c9d";
        g.fillRect(765, 325, 50, 50);
        this.label(
          this.area === "science"
            ? "Πάγκος"
            : this.area === "history"
              ? "Χρονοπύλη"
              : this.area === "language"
                ? "Αναγνωστήριο"
                : "Πύλη Δεκαδικών",
          790,
          305,
          a.color,
        );
      }
      const { x, y } = this.player;
      g.fillStyle = "#25496033";
      g.fillRect(x - 16, y + 10, 34, 10);
      g.fillStyle = "#26374d";
      g.fillRect(x - 12, y, 10, 18);
      g.fillRect(x + 3, y, 10, 18);
      g.fillStyle = ["#1b7cff", "#8c4ed1", "#24b37a"][this.state.avatar];
      g.fillRect(x - 16, y - 24, 32, 30);
      g.fillStyle = "#efb789";
      g.fillRect(x - 12, y - 44, 24, 23);
      g.fillStyle = "#4b3028";
      g.fillRect(x - 13, y - 48, 26, 10);
      g.fillStyle = "#26374d";
      g.fillRect(x - 7, y - 33, 3, 3);
      g.fillRect(x + 5, y - 33, 3, 3);
    }
    label(text, x, y, color) {
      const g = this.ctx;
      g.font = "bold 15px system-ui";
      g.textAlign = "center";
      const width = g.measureText(text).width + 18;
      g.fillStyle = "#fffffff0";
      g.fillRect(x - width / 2, y - 20, width, 28);
      g.fillStyle = color;
      g.fillText(text, x, y);
    }
  }
  window.AdventureWorld = AdventureWorld;
})();
