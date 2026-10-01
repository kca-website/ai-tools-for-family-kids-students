import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "playwright";

const BASE="http://127.0.0.1:4173";
const apiSource=fs.readFileSync(new URL("../api/schoolbook-source.js",import.meta.url),"utf8");
const studyContext=fs.readFileSync(new URL("../study-context.js",import.meta.url),"utf8");

assert.match(studyContext,/hasCurriculumSelection\) return "official_required"/);

const booksBlock=apiSource.slice(apiSource.indexOf("const BOOKS = {"),apiSource.indexOf("const ALIASES = {"));
const schoolbookIds=new Set([...booksBlock.matchAll(/^\s{2}"([^"]+)":\s*\{/gm)].map(m=>m[1]));

const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.goto(BASE+"/",{waitUntil:"domcontentloaded",timeout:60000});
  await page.waitForFunction(()=>!!window.AITOOLSKIDS_EPAL_STUDENT_CATALOG?.getSubjects,{timeout:30000});

  const rows=await page.evaluate(()=>{
    const c=window.AITOOLSKIDS_EPAL_STUDENT_CATALOG;
    const all=[];
    const add=(grade,sector,specialty)=>{
      for(const s of c.getSubjects(grade,sector||"",specialty||"")){
        all.push({
          grade,sector:sector||"",specialty:specialty||"",
          id:s.id||"",subject:s.subjectLabelEl||s.id||"",
          topics:(s.topics||[]).length,
          sourceTopics:(s.topics||[]).filter(t=>/^https:\/\//.test(t.sourceUrl||"")).length,
          falseExactAnnual:(s.topics||[]).filter(t=>t.sourceKind==="annual-guidance"&&t.officialExact===true).length,
          curriculumVerified:(s.topics||[]).filter(t=>t.officialCurriculumVerified===true).length,
          coverage:s.curriculum?.coverageStatus||"",
          annualUrl:s.curriculum?.annualInstructionsUrl||"",
          supportOnly:!!s.supportOnly
        });
      }
    };
    add("a","","");
    add("b","","");
    for(const sector of c.getSectors()) add("b",sector.id,"");
    add("c","","");
    for(const sp of c.getSpecialties()) add("c","",sp.id);
    return all;
  });

  const unique=new Map();
  for(const row of rows){
    if(!row.id) continue;
    const current=unique.get(row.id);
    if(!current||row.topics>(current.topics||0)) unique.set(row.id,row);
  }
  const subjects=[...unique.values()];
  const mapped=subjects.filter(s=>schoolbookIds.has(s.id));
  const exactAnnual=subjects.filter(s=>/verified|panhellenic/i.test(s.coverage)&&s.topics>0);
  const sourceIndexed=subjects.filter(s=>/^https:\/\//.test(s.annualUrl));
  const unsupported=subjects.filter(s=>!schoolbookIds.has(s.id));

  // Phase 11D rule: annual/current-year mapping is not the same as an exact
  // schoolbook excerpt. Until a schoolbook ID is mapped, AI Study must rely on
  // the global official_required policy and fail closed rather than use memory.
  assert.equal(mapped.length,0,"No EPAL subject should be counted as exact schoolbook-grounded until an explicit endpoint mapping exists.");
  assert.ok(sourceIndexed.length>0,"EPAL catalog should preserve official 2026-27 source provenance.");
  assert.ok(unsupported.length>0,"EPAL audit should expose source-missing exact-text mappings.");
  assert.equal(subjects.reduce((n,s)=>n+(s.falseExactAnnual||0),0),0,"Annual guidance must never be labelled as exact schoolbook grounding.");
  assert.match(topicsSource,/officialCurriculumVerified:true/,"EPAL topic resolver must retain explicit official-curriculum verification metadata.");

  console.log("PHASE11_EPAL_GROUNDING_AUDIT="+JSON.stringify({
    uniqueSubjects:subjects.length,
    annualOrPanhellenicVerifiedSubjects:exactAnnual.length,
    officialAnnualSourceIndexedSubjects:sourceIndexed.length,
    exactSchoolbookMappedSubjects:mapped.length,
    exactSchoolbookSourceMissingSubjects:unsupported.length,
    byGrade:Object.fromEntries(["a","b","c"].map(g=>[g,{
      subjects:subjects.filter(x=>x.grade===g).length,
      verified:exactAnnual.filter(x=>x.grade===g).length,
      sourceIndexed:sourceIndexed.filter(x=>x.grade===g).length
    }]))
  },null,2));
} finally {
  await browser.close();
}
