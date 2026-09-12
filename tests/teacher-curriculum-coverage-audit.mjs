import { chromium } from 'playwright';

const BASE='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});

try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(e.message));
  page.on('console',m=>{ if(m.type()==='error') pageErrors.push(m.text()); });

  await page.goto(`${BASE}/teacher-assistant.html`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('#context');
  await page.waitForFunction(()=>window.AITOOLSKIDS_TEACHER_CURRICULUM_AUDIT,{timeout:30000});

  const contexts=await page.locator('#context option').evaluateAll(opts=>opts.map(o=>({id:o.value,label:o.textContent.trim()})));
  const rows=[];
  const suspiciousDuplicates=[];

  for(const ctx of contexts){
    await page.selectOption('#context',ctx.id);
    const grades=await page.locator('#grade option').evaluateAll(opts=>opts.map(o=>({id:o.value,label:o.textContent.trim()})));

    for(const gr of grades){
      await page.selectOption('#grade',gr.id);
      const subjects=await page.locator('#subject option').evaluateAll(opts=>opts.map(o=>({id:o.value,label:o.textContent.trim()})));
      const fingerprints=new Map();

      for(const sub of subjects){
        await page.selectOption('#subject',sub.id);
        const unitOptions=await page.locator('#unit option').allTextContents();
        const units=unitOptions.map(x=>x.trim()).filter(Boolean);
        const missing=units.length===0 || units.some(x=>x.startsWith('Δεν υπάρχει χαρτογραφημένη ενότητα'));
        const usable=missing?[]:units;
        rows.push({context:ctx.label,contextId:ctx.id,grade:gr.label,gradeId:gr.id,subject:sub.label,subjectId:sub.id,topicCount:usable.length,missing,topics:usable});

        if(usable.length){
          const fp=JSON.stringify(usable);
          if(!fingerprints.has(fp)) fingerprints.set(fp,[]);
          fingerprints.get(fp).push(sub.label);
        }
      }

      for(const [fp,names] of fingerprints){
        if(names.length>1){
          suspiciousDuplicates.push({context:ctx.label,grade:gr.label,subjects:names,topicCount:JSON.parse(fp).length});
        }
      }
    }
  }

  const missing=rows.filter(r=>r.missing);
  const covered=rows.filter(r=>!r.missing);
  const byContext={};
  rows.forEach(r=>{
    const k=r.context;
    byContext[k]??={total:0,covered:0,missing:0};
    byContext[k].total++;
    if(r.missing) byContext[k].missing++; else byContext[k].covered++;
  });

  console.log('CURRICULUM_COVERAGE_SUMMARY');
  console.log(JSON.stringify({total:rows.length,covered:covered.length,missing:missing.length,byContext,suspiciousDuplicateCount:suspiciousDuplicates.length,pageErrors},null,2));
  console.log('CURRICULUM_MISSING_ROWS');
  console.log(JSON.stringify(missing.map(({topics,...r})=>r),null,2));
  console.log('CURRICULUM_SUSPICIOUS_DUPLICATES');
  console.log(JSON.stringify(suspiciousDuplicates,null,2));

  if(pageErrors.length) process.exitCode=1;
} finally {
  await browser.close();
}
