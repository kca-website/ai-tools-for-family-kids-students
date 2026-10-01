import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const endpoint=require("../api/schoolbook-source.js");
const inventory=require("../gel-schoolbook-source-map-2026-2027.js");
const pdf=require("../api/official-pdf-text.js");
const manifest=JSON.parse(fs.readFileSync(new URL("../scripts/phase24/politiki-paideia-pdf-sections.json",import.meta.url)));
const row=inventory.get(manifest.subjectId);
assert.ok(row);
assert.equal(row.topicMappings.length,12);
assert.equal(row.topicSummary["exact-pdf"],12);
assert.equal(row.topicSummary["needs-manual-review"],0);
assert.equal(row.books.filter(b=>b.role==="primary").length,2);
assert.deepEqual(row.books.map(b=>b.work).sort(),["8547/2429","8547/5582"]);
for(const section of manifest.sections){
  const m=row.topicMappings.find(x=>x.label===section.label);
  assert.ok(m,section.label);
  assert.equal(m.status,"exact-pdf"); assert.equal(m.work,section.work);
  assert.equal(m.pdfPage,section.page); assert.equal(m.pdfPageEnd,section.endPage);
  assert.equal(m.annualScopeVerified,true); assert.equal(m.curriculumSource,manifest.guidanceUrl);
  assert.ok(m.pdfPageEnd-m.pdfPage<20);
  const resolved=endpoint._test.resolveGelInventoryTopic(manifest.subjectId,section.label);
  assert.equal(resolved.runtimeEligible,true,section.label+" "+resolved.reason);
  assert.equal(resolved.runtimeMode,"exact-pdf"); assert.equal(resolved.book.work,section.work);
}
for(const boundary of manifest.excludedBoundaries){
  const section=manifest.sections.find(x=>x.label===boundary.after);
  assert.ok(section); assert.ok(section.endPage<boundary.nextExcludedStart,boundary.after+" crosses excluded scope");
}
if(process.env.PHASE24_LIVE==="1"){
  const failures=[];
  for(const section of manifest.sections){
    try{
      const result=await endpoint.resolveOfficialSchoolbookSource(manifest.subjectId,section.label);
      assert.equal(result.ok,true,section.label+" => "+JSON.stringify(result.body));
      assert.equal(result.body.grounded,true);
      assert.equal(result.body.mappingStatus,"official-gel-inventory-exact-pdf");
      assert.equal(result.body.pdfPageEnd,section.endPage);
      assert.equal(result.body.annualScopeVerified,true);
      assert.ok(String(result.body.text||"").length>=300);
      assert.ok(pdf.normalizePdfText(result.body.text).includes(pdf.normalizePdfText(section.heading)),section.heading);
    }catch(error){
      failures.push(section.label+" :: "+error.message);
    }
  }
  assert.deepEqual(failures,[],failures.join("\n"));
}
console.log("PHASE24_POLITIKI_PAIDEIA="+JSON.stringify({topics:12,books:2,live:process.env.PHASE24_LIVE==="1"}));
