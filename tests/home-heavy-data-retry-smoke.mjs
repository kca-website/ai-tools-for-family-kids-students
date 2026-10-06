import { chromium } from "playwright";
import assert from "node:assert/strict";

// The home page downloads the curriculum data in the background. A dropped download of a core data
// file used to leave QUIZZES / GAP_TAGS / LEARNING_PATHS undefined, so the tutor threw
// "LEARNING_PATHS is not defined" (seen as an intermittent failure of tutor-consolidation-smoke).
// The loader now retries a failed file once and reports the data as loaded only after that.
const LOCAL = process.env.LOCAL_BASE || "http://127.0.0.1:4173/";
const browser = await chromium.launch();
try {
  for (const failing of ["/quiz-data.js", "/learning-paths-data.js"]) {
    const context = await browser.newContext({ serviceWorkers: "block" });
    const page = await context.newPage();
    const errors = [];
    let requests = 0;
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.route("**/_vercel/insights/script.js", (r) => r.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
    await page.route((url) => new URL(url).pathname === failing, (r) => (requests++ === 0 ? r.abort("connectionreset") : r.continue()));
    await page.goto(LOCAL, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForFunction(() => window.__aitools4kidsHeavyLoaded && window.AITutor?.render, null, { timeout: 45000 });
    assert.ok(requests >= 2, `${failing}: the failed download is retried`);
    assert.deepEqual(await page.evaluate(() => [typeof QUIZZES, typeof GAP_TAGS, typeof LEARNING_PATHS]), ["object", "object", "object"], failing);
    await page.evaluate(() => {
      history.replaceState({}, "", "/middle/student/tutor");
      const view = document.getElementById("tutorView");
      if (view) view.hidden = false;
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.AITutor.render({ zoneId: "middle", roleId: "student", lang: "el" });
    });
    await page.waitForSelector("#tutorMount .tutor-chat", { state: "attached", timeout: 10000 });
    assert.deepEqual(errors, [], `${failing}: no page errors`);
    await context.close();
  }
} finally {
  await browser.close();
}
console.log("Home heavy-data retry smoke passed: a dropped data download no longer breaks the tutor.");
