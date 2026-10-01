import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const catalog=require("../general-education-book-sections-2026-2027.js");
const endpoint=require("../api/schoolbook-source.js");

const groundedIds=[
  "math-a-dimotikou",
  "math-b-dimotikou",
  "math-c-dimotikou",
  "math-d-dimotikou",
  "math-e-dimotikou",
  "math-st-dimotikou"
];

const results=[];
for(const id of groundedIds){
  const row=catalog.get(id);
  assert.ok(row?.sections?.length,id+" must have sections");
  const topic=row.sections[0];
  const live=await endpoint.resolveOfficialSchoolbookSource(id,topic);
  results.push({id,topic,ok:live.ok,status:live.status,error:live.body?.error,sourceUrl:live.body?.sourceUrl,sourceUrls:live.body?.sourceUrls?.length||0});
  assert.equal(live.ok,true,id+" / "+topic+" => "+JSON.stringify(live.body));
  assert.equal(live.body?.grounded,true);
  assert.match(String(live.body?.sourceUrl||""),/^https:\/\/[^/]*ebooks\.edu\.gr\//i);
  assert.ok(String(live.body?.text||"").length>=500);
}

const dRow=catalog.get("math-d-dimotikou");
assert.ok(dRow?.sections?.length,"math-d-dimotikou must retain curriculum sections");
const dFail=await endpoint.resolveOfficialSchoolbookSource("math-d-dimotikou","Α΄ Περίοδος · Δ΄ Ενότητα");
assert.equal(dFail.ok,false,"An unknown D Primary math period/unit must remain fail-closed");
assert.notEqual(dFail.body?.grounded,true);

const impossible=await endpoint.resolveOfficialSchoolbookSource("math-e-dimotikou","Ενότητα 99 — Ανύπαρκτη ενότητα");
assert.equal(impossible.ok,false);
assert.notEqual(impossible.body?.grounded,true);

console.log("PHASE13_PRIMARY_MATH_GROUNDING="+JSON.stringify({
  grounded:results,
  failClosed:[{id:"math-d-dimotikou",topic:"Α΄ Περίοδος · Δ΄ Ενότητα",error:dFail.body?.error}]
},null,2));
