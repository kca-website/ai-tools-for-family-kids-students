const { chromium } = require(process.env.PLAY_QA_PLAYWRIGHT || "playwright");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const BASE = process.env.PLAY_QA_URL || "http://127.0.0.1:8765";
const OUT = process.env.PLAY_QA_OUTPUT || "/tmp/aitools4kids-play-qa";
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 375, height: 812 },
  ]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const requests = [];
    page.on("request", (r) => requests.push(r.url()));
    await page.addInitScript(() => {
      let Original;
      Object.defineProperty(window, "AdventureWorld", {
        get: () => Original,
        set: (value) => {
          Original = class extends value {
            constructor(api) {
              super(api);
              window.__qaWorld = this;
            }
          };
        },
      });
    });
    await page.goto(
      BASE + "/play/?mission=decimals.longer_is_larger&return=path",
    );
    await page.click("#start");
    assert.equal(await page.locator("#mathModal").isVisible(), false);
    const move = async (x, y) =>
      page.evaluate(
        ({ x, y }) => {
          const w = window.__qaWorld;
          w.pause();
          const step = 10,
            round = (n) => Math.round(n / 10) * 10,
            start = [round(w.player.x), round(w.player.y)],
            queue = [start],
            seen = new Map([[start.join(","), null]]);
          let dest;
          for (let i = 0; i < queue.length; i++) {
            const [a, b] = queue[i];
            if (Math.hypot(a - x, b - y) < 8) {
              dest = [a, b];
              break;
            }
            for (const [dx, dy] of [
              [step, 0],
              [-step, 0],
              [0, step],
              [0, -step],
            ]) {
              const n = [a + dx, b + dy],
                key = n.join(",");
              if (!seen.has(key) && w.canStand(...n)) {
                seen.set(key, [a, b]);
                queue.push(n);
              }
            }
          }
          if (!dest) throw Error("No route " + x + "," + y);
          const route = [];
          for (let n = dest; n; n = seen.get(n.join(","))) route.unshift(n);
          for (const [a, b] of route) {
            let guard = 0;
            while (
              Math.hypot(w.player.x - a, w.player.y - b) > 2 &&
              guard++ < 20
            ) {
              const dx = a - w.player.x,
                dy = b - w.player.y;
              w.keys.clear();
              w.dir =
                Math.abs(dx) > Math.abs(dy)
                  ? dx > 0
                    ? "right"
                    : "left"
                  : dy > 0
                    ? "down"
                    : "up";
              w.move(Math.min(20, Math.max(Math.abs(dx), Math.abs(dy)) / 0.24));
              w.collect();
              w.findNear();
            }
            w.clearKeys();
          }
          w.draw();
          w.status();
        },
        { x, y },
      );
    await move(210, 360);
    await page.click("#enter");
    await page.click("#npcOk");
    await move(190, 290);
    await move(330, 360);
    await move(360, 220);
    await move(250, 530);
    await move(750, 460);
    await move(790, 350);
    await page.screenshot({
      path: path.join(OUT, `math-${viewport.width}.png`),
    });
    await page.click("#enter");
    // The actual browser executes all original challenges, including the formerly conflicting mission 6.
    for (const i of [1, 0, 1, 1, 0]) {
      await page.click(`#mathModal [data-i="${i}"]`);
      await page.click("#next");
    }
    for (const v of ["0.09", "0.8", "1.2"])
      await page.click(`#mathModal [data-v="${v}"]`);
    await page.click("#mathFinish");
    assert.match(
      await page.locator("#finishRewards").innerText(),
      /Decimal Explorer/,
    );
    await page.click("#back");
    const collect = {
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
    for (const key of ["science", "history", "language"]) {
      await page.evaluate((k) => window.__qaWorld.changeArea(k), key);
      await move(210, 360);
      await page.click("#enter");
      await page.click("#npcOk");
      for (const [x, y] of collect[key]) await move(x, y);
      await move(790, 350);
      await page.click("#enter");
      if (key === "science") {
        for (const part of ["lamp", "battery", "wire"])
          await page.click(`#scienceModal [data-part="${part}"]`);
        await page.click("#scienceNext");
        await page.click('#scienceModal [data-material="metal"]');
        await page.click("#scienceFinish");
      } else if (key === "history") {
        await page.click("#npcContinue");
        for (const year of ["1814", "1821", "1830"])
          await page.click(`#historyModal [data-year="${year}"]`);
        await page.click("#artifactNext");
        await page.click('#historyModal [data-artifact="phone"]');
        await page.click("#historyFinish");
      } else {
        await page.click("#langStart");
        for (const word of ["Το", "παιδί", "διαβάζει", "ένα", "βιβλίο."])
          await page.click(`#langModal [data-w="${word}"]`);
        await page.click("#langNext");
        await page.click('#langVerb [data-v="g"]');
        await page.click("#langFinish");
      }
      if (key !== "language") await page.click("#back");
    }
    assert.equal(await page.locator("#zones").innerText(), "4/4");
    await page.screenshot({
      path: path.join(OUT, `badges-${viewport.width}.png`),
    });
    await page.reload();
    assert.equal(await page.locator("#zones").innerText(), "4/4");
    await page.click("#start");
    await page.evaluate(() => window.__qaWorld.changeArea("hub"));
    const before = await page.evaluate(() => window.__qaWorld.player.x);
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(200);
    await page.keyboard.up("ArrowRight");
    assert.ok((await page.evaluate(() => window.__qaWorld.player.x)) > before);
    const beforeTap = await page.evaluate(() => window.__qaWorld.player.x);
    await page.locator("[data-d=right]").click();
    assert.ok(
      (await page.evaluate(() => window.__qaWorld.player.x)) > beforeTap,
    );
    await page.reload();
    page.once("dialog", (d) => d.dismiss());
    await page.click("#resetAll");
    assert.equal(await page.locator("#zones").innerText(), "4/4");
    page.once("dialog", (d) => d.accept());
    await page.click("#resetAll");
    await page.waitForLoadState("load");
    assert.equal(await page.locator("#zones").innerText(), "0/4");
    assert.deepEqual(errors, []);
    assert.ok(!requests.some((u) => u.includes("/api/")));
    console.log(
      `PASS browser ${viewport.width}x${viewport.height}: four regions, movement, collectibles, missions, badges, persistence, reset, zero API requests`,
    );
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    serviceWorkers: "block",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(BASE + "/");
  await page.locator("#homeV9Play").waitFor();
  assert.equal(
    await page.locator("#homeV9Play h3").innerText(),
    "Παίξε & Μάθε",
  );
  assert.equal(
    await page.locator("#homeV9Play a").getAttribute("href"),
    "/play/",
  );
  assert.equal(
    await page.locator(".play-home-route,.play-inline-link").count(),
    0,
  );
  await page
    .locator("#homeV9Play")
    .screenshot({ path: path.join(OUT, "home-card.png") });
  await page.click("#langEn");
  assert.equal(
    await page.locator("#homeV9Play h3").innerText(),
    "Play & Learn",
  );
  await page.click("#homeV9Play a");
  await page.click("#start");
  assert.equal(
    await page.evaluate(
      () =>
        window.__qaWorld?.area ||
        document.querySelector("#mt").textContent.includes("Κόσμος μάθησης"),
    ),
    true,
  );
  await page.goto(BASE + "/primary/student/quiz?gap=decimals.longer_is_larger");
  await page.locator(".play-path-mission__cta").waitFor();
  await page.click(".play-path-mission__cta");
  await page.click("#start");
  assert.equal(await page.locator("#mathModal").isVisible(), false);
  assert.match(await page.locator("#mt").innerText(), /Math City/);
  await page.click(".route-return-world");
  await page.locator(".play-path-mission__cta").waitFor();
  assert.equal(await page.locator("#pathModalOverlay").isVisible(), true);
  assert.match(page.url(), /gap=decimals.longer_is_larger/);
  await page.goto(BASE + "/primary/student/quiz?gap=fractions.whole_number_bias");
  await page.waitForTimeout(500);
  assert.equal(await page.locator(".play-path-mission__cta").count(), 0);
  assert.deepEqual(errors, []);
  console.log(
    "PASS homepage card EL/EN, independent entry, mapped path mission, exact path return, unmapped gap excluded",
  );
  await page.screenshot({ path: path.join(OUT, "path-unmapped.png") });
  await context.close();
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
