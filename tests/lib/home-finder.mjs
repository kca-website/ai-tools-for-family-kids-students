// Drives the v11 task-first homepage finder: task → optional level → role (only
// when the homepage asks for it). Clicking is idempotent: options that are
// already selected (for example restored from sessionStorage) are not toggled.
export async function pickFinder(page, { need, zone, role } = {}) {
  if (need) await clickIfNotPressed(page, `#homeV9Finder [data-finder-need="${need}"]`);
  if (zone !== undefined) {
    if (zone) await clickIfNotPressed(page, `#homeV9Finder [data-finder-zone="${zone}"]`);
    else {
      const pressed = page.locator('#homeV9Finder [data-finder-zone][aria-pressed="true"]');
      if (await pressed.count()) await pressed.first().click();
    }
  }
  if (role) {
    const sel = `#homeV9Finder [data-finder-role="${role}"]`;
    if (await page.locator(sel).count()) await clickIfNotPressed(page, sel);
  }
}

async function clickIfNotPressed(page, selector) {
  const el = page.locator(selector).first();
  await el.waitFor({ state: 'visible', timeout: 15000 });
  if ((await el.getAttribute('aria-pressed')) !== 'true') await el.click();
}
