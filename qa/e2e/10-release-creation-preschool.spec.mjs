// Current creation missions and preschool UI contracts, synthetic inputs only.
import {test,expect} from './fixtures.mjs';

for(const lang of ['el','en']){
  for(let i=0;i<8;i++){
    test('creation mission '+lang+' '+(i+1)+' completes without AI transmission',async({page,qa})=>{
      let posted=0;
      await page.route('**/api/tutor-assistant',async route=>{
        if(route.request().method()==='POST') posted++;
        await route.fulfill({status:503,contentType:'application/json',body:'{"error":"mock"}'});
      });
      await page.goto('/creation-mission.html');
      if(lang==='en') await page.locator('#en').click();
      await expect(page.locator('html')).toHaveAttribute('lang',lang);
      await expect(page.locator('.mission-tile')).toHaveCount(8);
      await page.locator('.mission-tile').nth(i).click();
      const host=page.locator('#mission');
      await host.locator('.sheet-body > .btn.main').click();
      for(let stage=0;stage<3;stage++){
        const next=host.locator('.actions .btn.main');
        await expect(next).toBeDisabled();
        const cheapest=await page.evaluate(({i,stage})=>{
          const all=[...(window.CREATION_MISSIONS||[]),...(window.CREATION_MISSIONS_EXTRA||[])];
          return all[i].steps[stage].options.map((x,j)=>({j,cost:x.cost}))
            .filter(x=>!document.getElementById('choice'+x.j)?.disabled)
            .sort((a,b)=>a.cost-b.cost)[0]?.j;
        },{i,stage});
        expect(cheapest).not.toBeUndefined();
        await host.locator('#choice'+cheapest).click();
        await expect(host.locator('.consequence-row')).toHaveCount(4);
        await expect(next).toBeEnabled();
        await next.click();
      }
      const finish=host.locator('.actions .btn.main');
      await expect(finish).toBeDisabled();
      const pitch=lang==='el'?'Θα δοκιμάσω τη λύση μου με απλά παραδείγματα.':'I will test my proposed solution with simple examples.';
      await host.locator('#pitch').fill(pitch);
      await finish.click();
      await expect(host.locator('.recap-line')).toHaveCount(3);
      await expect(host.locator('.proposal')).toHaveText(pitch);
      await expect(page.locator('#progress')).toHaveAttribute('aria-valuenow','4');
      await expect(host.locator('#creationReview')).toBeVisible();
      expect(posted).toBe(0);
      expect(qa.pageErrors).toEqual([]);
    });
  }
}
test('preschool image animates its own mocked cutout, stops, and varies activity',async({page,qa})=>{
  // A tiny local image is synthetic; this tests UI wiring, not real segmentation quality.
  const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0yQAAAAASUVORK5CYII=';
  let activities=0,images=0;
  await page.route('**/api/preschool-activity',async r=>{
    activities++;
    await r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({activity:{visualTitle:'Ρομπότ',visualCaption:'Δοκιμή',visualBg:'sky',imageSubjectEn:'robot',sceneTitle:'Ρομπότ',sceneMood:'playful'}})});
  });
  await page.route('**/api/preschool-image',async r=>{
    images++;await r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({dataURI:png})});
  });
  await page.goto('/preschool.html');
  await page.locator('#creatorInput').fill('Ρομπότ');
  await page.locator('#creatorSubmit').click();
  await expect(page.locator('#creatorVisual')).toBeVisible();
  expect(images).toBe(0);
  await page.locator('#visualStill').click();
  await expect(page.locator('#visualAiImage')).toBeVisible();
  await page.evaluate(png=>{
    window.__qaCutoutInput='';
    window.PreschoolImageMotion={cutout:async src=>{
      window.__qaCutoutInput=src;return {foreground:png,width:1,height:1};
    }};
  },png);
  await page.locator('#visualAnimate').click();
  await expect(page.locator('#visualPuppet')).toBeVisible();
  await expect(page.locator('#visualPuppet')).toHaveClass(/is-playing/);
  await expect(page.locator('#visualAnimate')).toHaveAttribute('aria-pressed','true');
  expect(await page.evaluate(()=>window.__qaCutoutInput)).toBe(png);
  expect(images).toBe(1);
  await page.locator('#visualAnimate').click();
  await expect(page.locator('#visualAnimate')).toHaveAttribute('aria-pressed','false');
  await page.locator('#creatorAgain').click();
  await expect.poll(()=>activities).toBe(2);
  await expect(page.locator('#visualPuppet')).toBeHidden();
  expect(qa.pageErrors).toEqual([]);
});
