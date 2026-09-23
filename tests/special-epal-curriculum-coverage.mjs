import { chromium } from 'playwright';
const BASE='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto(BASE+'/teacher-assistant.html',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('#context');
  const contexts=['specialGym','specialLyc','eneegyl','epal'];
  const summary={};
  for(const ctx of contexts){
    await page.selectOption('#context',ctx);
    const grades=await page.locator('#grade option').evaluateAll(os=>os.map(o=>({id:o.value,label:o.textContent.trim()})));
    summary[ctx]={};
    for(const g of grades){
      await page.selectOption('#grade',g.id);
      const subjects=await page.locator('#subject option').evaluateAll(os=>os.map(o=>({id:o.value,label:o.textContent.trim()})));
      let mapped=0,missing=[];
      for(const s of subjects){
        await page.selectOption('#subject',s.id);
        const units=(await page.locator('#unit option').allTextContents()).map(x=>x.trim()).filter(Boolean);
        const isMissing=!units.length||units.some(x=>x.startsWith('Δεν υπάρχει χαρτογραφημένη ενότητα'));
        if(isMissing) missing.push(s.label); else mapped++;
      }
      summary[ctx][g.id]={total:subjects.length,mapped,missing};
    }
  }
  // These were known cross-layer gaps and must now resolve from existing verified data.
  const sg=Object.values(summary.specialGym).reduce((n,x)=>n+x.mapped,0);
  const sl=Object.values(summary.specialLyc).reduce((n,x)=>n+x.mapped,0);
  const en=Object.values(summary.eneegyl).reduce((n,x)=>n+x.mapped,0);
  if(!sg) throw new Error('Special Gymnasium resolver exposes no mapped units');
  if(!sl) throw new Error('Special Lyceum resolver exposes no mapped units');
  if(!en) throw new Error('ENEEGYL resolver exposes no mapped units');
  if(errors.length) throw new Error(errors.join('\n'));
  console.log(JSON.stringify(summary,null,2));
} finally { await browser.close(); }
