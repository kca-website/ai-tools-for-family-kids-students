import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { JSDOM, VirtualConsole } = require(process.env.PLAY_QA_JSDOM || "jsdom");
const root = path.resolve(import.meta.dirname, "../..");
function boot({
  width = 1280,
  height = 800,
  saved,
  url = "https://example.test/play/",
} = {}) {
  const dom = new JSDOM(
    fs.readFileSync(path.join(root, "play/index.html"), "utf8"),
    {
      url,
      runScripts: "outside-only",
      pretendToBeVisual: true,
      virtualConsole: new VirtualConsole(),
    },
  );
  const w = dom.window;
  const g = new Proxy(
    { measureText: (t) => ({ width: t.length * 8 }) },
    { get: (o, k) => o[k] || (() => {}) },
  );
  w.HTMLCanvasElement.prototype.getContext = () => g;
  w.HTMLCanvasElement.prototype.getBoundingClientRect = () => ({
    width,
    height,
  });
  Object.defineProperties(w.HTMLCanvasElement.prototype, {
    clientWidth: { get: () => width },
    clientHeight: { get: () => height },
  });
  w.HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  w.HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
  w.confirm = () => true;
  w.requestAnimationFrame = () => 1;
  w.cancelAnimationFrame = () => {};
  if (saved)
    w.localStorage.setItem("aitools4kids-play-v3", JSON.stringify(saved));
  const run = (file) => w.eval(fs.readFileSync(path.join(root, file), "utf8"));
  run("play/world.js");
  const Original = w.AdventureWorld;
  w.AdventureWorld = class extends Original {
    constructor(api) {
      super(api);
      w.testWorld = this;
    }
  };
  run("play/game-core.js");
  run("play/mission-bridge.js");
  const click = (selector) => {
    const b = w.document.querySelector(selector);
    assert.ok(b, selector);
    assert.equal(b.disabled, false, selector + " disabled");
    assert.equal(!!b.closest("[hidden]"), false, selector + " hidden");
    b.click();
  };
  return { w, dom, world: w.testWorld, click };
}
function go(world, x, y) {
  assert.ok(world.canStand(x, y), `reachable (${x},${y})`);
  world.player = { x, y };
  world.collect();
  world.findNear();
}
function explore(env, key) {
  const { world, click } = env;
  world.changeArea(key);
  go(world, 210, 360);
  world.interact();
  click("#npcOk");
  const positions = {
    math: [
      [190, 290],
      [330, 360],
      [360, 220],
      [250, 530],
      [750, 460],
    ],
    science: [
      [240, 240],
      [390, 520],
      [730, 210],
    ],
    history: [
      [270, 530],
      [750, 220],
      [660, 520],
      [830, 430],
    ],
    language: [
      [250, 230],
      [350, 520],
      [690, 260],
      [800, 480],
      [710, 550],
    ],
  };
  positions[key].forEach(([x, y]) => go(world, x, y));
  assert.ok(world.ready());
  go(world, 790, 350);
  world.interact();
}
for (const [width, height] of [
  [1280, 800],
  [375, 812],
])
  test(`all four areas complete, rewards persist at ${width}x${height}`, () => {
    const env = boot({ width, height }),
      { click, w, world } = env;
    click("#start");
    explore(env, "math");
    click('#mathModal [data-i="0"]');
    assert.equal(w.document.querySelector("#retry").hidden, false);
    click("#retry");
    for (const i of [1, 0, 1, 1, 0]) {
      click(`#mathModal [data-i="${i}"]`);
      click("#next");
    }
    for (const n of ["0.8", "0.09", "1.2"]) click(`#mathModal [data-v="${n}"]`);
    assert.equal(w.document.querySelector("#sortreset").hidden, false);
    click("#sortreset");
    for (const n of ["0.09", "0.8", "1.2"]) click(`#mathModal [data-v="${n}"]`);
    assert.equal(w.document.querySelector("#langNext").hidden, true);
    click("#mathFinish");
    assert.match(
      w.document.querySelector("#finishRewards").textContent,
      /Decimal Explorer/,
    );
    click("#back");
    explore(env, "science");
    for (const part of ["lamp", "wire", "battery"])
      click(`#scienceModal [data-part="${part}"]`);
    click("#scienceNext");
    click('#scienceModal [data-material="metal"]');
    click("#scienceFinish");
    click("#back");
    explore(env, "history");
    click("#npcContinue");
    for (const year of ["1814", "1821", "1830"])
      click(`#historyModal [data-year="${year}"]`);
    click("#artifactNext");
    click('#historyModal [data-artifact="phone"]');
    click("#historyFinish");
    click("#back");
    explore(env, "language");
    click("#langStart");
    for (const word of ["Το", "παιδί", "διαβάζει", "ένα", "βιβλίο."])
      click(`#langModal [data-w="${word}"]`);
    click("#langNext");
    click('#langVerb [data-v="g"]');
    click("#langFinish");
    assert.equal(w.document.querySelector("#zones").textContent, "4/4");
    for (const b of [
      "Decimal Explorer",
      "Circuit Builder",
      "Time Traveller",
      "Word Master",
    ])
      assert.match(
        w.document.querySelector("#finishRewards").textContent,
        new RegExp(b),
      );
    const saved = JSON.parse(w.localStorage.getItem("aitools4kids-play-v3"));
    const reloaded = boot({ saved });
    assert.equal(
      reloaded.w.document.querySelector("#zones").textContent,
      "4/4",
    );
    assert.equal(reloaded.world.state.xp, world.state.xp);
    assert.equal(reloaded.world.state.adventure.language.items.length, 5);
    reloaded.dom.window.close();
    domClose(env);
  });
function domClose(env) {
  env.dom.window.close();
}
test("collisions, staged bridge, persistent collectibles, paused controls and reset", () => {
  const env = boot(),
    { world, w, click } = env;
  click("#start");
  world.changeArea("math");
  assert.equal(world.canStand(110, 200), false);
  assert.equal(world.canStand(320, 180), false);
  assert.equal(world.canStand(225, 435), false);
  assert.equal(world.canStand(500, 250), false);
  assert.equal(world.canStand(500, 360), false);
  assert.equal(world.canStand(970, 360), false);
  world.player = { x: 450, y: 360 };
  world.keys.add("arrowright");
  world.move(100);
  assert.ok(world.player.x <= 456);
  world.clearKeys();
  go(world, 330, 360);
  assert.equal(world.quest().order, 0);
  go(world, 190, 290);
  go(world, 330, 360);
  go(world, 360, 220);
  assert.equal(world.canStand(500, 360), true);
  assert.equal(world.canStand(500, 250), false);
  go(world, 250, 530);
  const xp = world.state.xp;
  world.collect();
  assert.equal(world.state.xp, xp);
  go(world, 320, 570);
  const coins = world.state.coins;
  world.collect();
  assert.equal(world.state.coins, coins);
  go(world, 210, 360);
  world.interact();
  const x = world.player.x;
  world.keys.add("arrowright");
  world.move(100);
  assert.equal(world.player.x, x);
  click("#npcOk");
  const d = w.document.querySelector('[data-d="right"]');
  d.setPointerCapture = () => {};
  d.dispatchEvent(new w.Event("pointerdown", { cancelable: true }));
  assert.ok(world.player.x > x);
  d.dispatchEvent(new w.Event("pointerup"));
  assert.equal(world.dir, null);
  w.document.querySelector("#intro").hidden = false;
  w.confirm = () => false;
  click("#resetAll");
  assert.ok(w.localStorage.getItem("aitools4kids-play-v3"));
  w.confirm = () => true;
  click("#resetAll");
  assert.equal(
    JSON.parse(w.localStorage.getItem("aitools4kids-play-v3")).xp,
    0,
  );
  assert.equal(w.localStorage.getItem("aitools4kids-language-v1"), null);
  assert.deepEqual(
    JSON.parse(w.localStorage.getItem("aitools4kids-play-v3")).adventure,
    {},
  );
  domClose(env);
});
test("every collectible and goal has a collision-free route from spawn", () => {
  const env = boot(),
    { world, click } = env;
  click("#start");
  const goals = {
    math: [
      [190, 290],
      [330, 360],
      [360, 220],
      [250, 530],
      [750, 460],
    ],
    science: [
      [240, 240],
      [390, 520],
      [730, 210],
    ],
    history: [
      [270, 530],
      [750, 220],
      [660, 520],
      [830, 430],
    ],
    language: [
      [250, 230],
      [350, 520],
      [690, 260],
      [800, 480],
      [710, 550],
    ],
  };
  for (const [key, targets] of Object.entries(goals)) {
    world.changeArea(key);
    world.quest().order = 3;
    const queue = [[160, 360]],
      seen = new Set(["160,360"]);
    for (let i = 0; i < queue.length; i++) {
      const [x, y] = queue[i];
      for (const [dx, dy] of [
        [10, 0],
        [-10, 0],
        [0, 10],
        [0, -10],
      ]) {
        const nx = x + dx,
          ny = y + dy,
          id = nx + "," + ny;
        if (!seen.has(id) && world.canStand(nx, ny)) {
          seen.add(id);
          queue.push([nx, ny]);
        }
      }
    }
    for (const [x, y] of [...targets, [210, 360], [790, 350]])
      assert.ok(
        queue.some(([a, b]) => Math.hypot(a - x, b - y) < 20),
        `${key}: ${x},${y} unreachable`,
      );
  }
  domClose(env);
});
test("mapped mission starts in Math City and safe return includes exact gap", () => {
  const env = boot({
    url: "https://example.test/play/?mission=decimals.longer_is_larger&return=path",
  });
  env.click("#start");
  assert.equal(env.world.area, "math");
  assert.equal(env.w.document.querySelector("#mathModal").hidden, true);
  assert.match(
    env.w.document.querySelector(".route-return-world").href,
    /gap=decimals.longer_is_larger/,
  );
  domClose(env);
});
test("game source has no AI requests or network loop", () => {
  for (const f of ["world.js", "game-core.js", "mission-bridge.js"])
    assert.doesNotMatch(
      fs.readFileSync(path.join(root, "play", f), "utf8"),
      /\b(fetch|XMLHttpRequest|WebSocket)\s*\(|api\.groq|generativelanguage|api\.openai/,
    );
});
