import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});

try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{ if(m.type()==='error') errors.push(m.text()); });

  await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITOOLSKIDS_TUTOR_CATALOG?.zones?.middle && window.AITOOLSKIDS_TUTOR_CATALOG?.zones?.high,{timeout:30000});

  const audit=await page.evaluate(()=>{
    const catalog=window.AITOOLSKIDS_TUTOR_CATALOG;
    const rows=[];
    for(const zoneId of ['middle','high']){
      const zone=catalog.zones[zoneId]||{};
      for(const [gradeId,subjects] of Object.entries(zone)){
        for(const subject of (subjects||[])){
          const c=subject.curriculum||{};
          rows.push({
            zoneId,gradeId,id:subject.id,
            topicCount:Array.isArray(subject.topics)?subject.topics.length:0,
            coverageStatus:c.coverageStatus||'',
            coverageLabelEl:c.coverageLabelEl||'',
            schoolYear:c.schoolYear||'',
            verificationDate:c.verificationDate||c.lastVerified||'',
            sourceUrl:c.annualInstructionsUrl||c.examSyllabusUrl||c.catalogUrl||'',
            sourceLabelEl:c.sourceLabelEl||'',
            scopeNoteEl:c.scopeNoteEl||c.annualInstructionsNoteEl||'',
            topics:(subject.topics||[]).map(t=>({id:t.id||'',labelEl:t.labelEl||'',labelEn:t.labelEn||'',explainEl:t.explainEl||''}))
          });
        }
      }
    }
    return rows;
  });

  assert.ok(audit.length>0,'Tutor curriculum catalog is empty');
  for(const row of audit){
    assert.ok(row.coverageStatus, `${row.zoneId}/${row.gradeId}/${row.id}: missing coverageStatus`);
    assert.ok(row.coverageLabelEl, `${row.zoneId}/${row.gradeId}/${row.id}: missing human-readable coverage label`);
    assert.ok(row.schoolYear, `${row.zoneId}/${row.gradeId}/${row.id}: missing schoolYear`);
    assert.ok(row.verificationDate, `${row.zoneId}/${row.gradeId}/${row.id}: missing verification date`);
    assert.match(row.sourceUrl,/^https:\/\//,`${row.zoneId}/${row.gradeId}/${row.id}: missing official/source URL`);
    assert.ok(row.sourceLabelEl, `${row.zoneId}/${row.gradeId}/${row.id}: missing source label`);
    assert.ok(row.scopeNoteEl, `${row.zoneId}/${row.gradeId}/${row.id}: missing scope/boundary note`);

    for(const topic of row.topics){
      assert.ok(topic.id && topic.labelEl && topic.labelEn, `${row.id}: incomplete topic identity`);
      assert.ok(topic.explainEl, `${row.id}/${topic.id}: topic missing documented learning explanation`);
    }
  }

  const currentHigh=audit.filter(r=>r.zoneId==='high');
  assert.ok(currentHigh.every(r=>r.schoolYear==='2026-2027'), 'Every active GEL subject must now point to 2026–27 evidence');
  assert.ok(currentHigh.every(r=>/2026-27|2027/.test(r.coverageStatus)), 'Every active GEL subject must carry a current-year coverage status');

  // User-facing provenance: mapped material must display both its boundary and clickable source.
  await page.evaluate(()=>{
    history.replaceState({},'', '/high/student/tutor');
    const view=document.getElementById('tutorView');
    if(view) view.hidden=false;
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.AITutor.render({zoneId:'high',roleId:'student',lang:'el'});
  });
  await page.waitForSelector('#tutorSubject',{state:'attached',timeout:10000});
  await page.selectOption('#tutorGrade','a');
  await page.selectOption('#tutorSubject','biologia-a-lykeiou');
  await page.waitForTimeout(120);

  const ctx=(await page.locator('#tutorContextBox').innerText()).replace(/\s+/g,' ');
  assert.match(ctx,/Επίσημη βάση/i,'Tutor context must name the evidence basis');
  assert.match(ctx,/αναλυτικός χάρτης/i,'Mapped GEL content must state that it is a navigation map, not exact official section titles');
  assert.ok(await page.locator('#tutorContextBox a[href^="https://"]').count()>=1,'Tutor context must expose a clickable source link');
  assert.equal((await page.locator('#tutorTopic option').count()),14,'A Lyceum Biology should expose all 14 documented mapped topics');

  assert.deepEqual(errors,[],`Curriculum provenance browser errors: ${errors.join('\n')}`);
  await page.close();
  console.log(`Curriculum provenance smoke passed for ${audit.length} active Middle/GEL subject records.`);
}finally{
  await browser.close();
}
