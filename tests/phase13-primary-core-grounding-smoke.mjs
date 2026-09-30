import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const catalog=require("../general-education-book-sections-2026-2027.js");
const endpoint=require("../api/schoolbook-source.js");

const ids=[
  "istoria-c-dimotikou",
  "istoria-e-dimotikou",
  "istoria-st-dimotikou",
  "science-e-dimotikou",
  "glossa-st-dimotikou",
  "english-c-dimotikou",
  "english-d-dimotikou",
  "english-e-dimotikou"
];

const results=[];
for(const id of ids){
  const row=catalog.get(id);
  assert.ok(row?.sections?.length,id+" must have sections");
  const topic=row.sections[0];
  const live=await endpoint.resolveOfficialSchoolbookSource(id,topic);
  results.push({id,topic,ok:live.ok,error:live.body?.error,sourceUrl:live.body?.sourceUrl});
  assert.equal(live.ok,true,id+" / "+topic+" => "+JSON.stringify(live.body));
  assert.equal(live.body?.grounded,true);
  assert.match(String(live.body?.sourceUrl||""),/^https:\/\/[^/]*ebooks\.edu\.gr\//i);
  assert.ok(String(live.body?.text||"").length>=300);
}

console.log("PHASE13_PRIMARY_CORE_GROUNDING="+JSON.stringify(results,null,2));
