import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const inv=require("../gel-schoolbook-source-map-2026-2027.js");
const manual=require("../gel-schoolbook-manual-overrides-2026-2027.js");
const pending=require("../gel-unmapped-dispositions-2026-2027.js");
const availability=require("../secondary-grounding-availability-2026-2027.js");
const endpoint=require("../api/schoolbook-source.js");
const cases=[
 ["archaia-a-lykeiou","Απαρέμφατο και απρόσωπη σύνταξη",1,["απρόσωπα"]],
 ["archaia-a-lykeiou","Μετοχές και συντακτικές λειτουργίες",2,["κατηγορούμενο","μετοχή"]],
 ["archaia-a-lykeiou","Σύγκριση και β΄ όρος σύγκρισης",1,["συγκριτικ"]],
 ["archaia-a-lykeiou","Ονοματικοί και επιρρηματικοί προσδιορισμοί",1,["επιρρηματικό"]],
 ["archaia-a-lykeiou","Παρατακτική και υποτακτική σύνδεση",1,["σύνδεσμοι"]],
 ["archaia-b-lykeiou","Λεξιλόγιο και ετυμολογικές σχέσεις",2,["παραγωγή"]],
 ["archaia-b-lykeiou","Μορφολογία ουσιαστικών, επιθέτων και αντωνυμιών",3,["ουσιαστικά","επίθετα","αντωνυμίες"]],
 ["archaia-b-lykeiou","Ρηματικοί χρόνοι και εγκλίσεις",1,["εγκλίσεις"]],
 ["archaia-b-lykeiou","Απαρέμφατο και μετοχή",1,["απαρέμφατο","μετοχή"]],
 ["ekthesi-b-lykeiou","Τεκμηρίωση επιχειρήματος",2,["παραδείγματα","τεκμηριωμένα"]],
 ["ekthesi-b-lykeiou","Δομή επιχειρηματολογικού κειμένου",2,["θεματική περίοδο","αντίθεση"]]
];
const norm=s=>String(s||"").toLocaleLowerCase("el").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ς/g,"σ");
for(const [subject,label,count,terms] of cases){
 const t=inv.get(subject)?.topicMappings?.find(x=>x.label===label);
 assert.equal(t?.status,"needs-manual-review",label);
 const o=manual.get(subject,label);
 assert.equal(o?.sourceTopicId,t.topicId);
 assert.equal(o?.sources?.length,count);
 assert.equal(o?.granularity,"manual-curated-examples-not-exhaustive-unit");
 assert.equal(availability.has(subject,label),true);
 assert.equal(pending.get(subject,label),null);
 assert.equal(endpoint._test.resolveGelInventoryTopic(subject,label)?.runtimeEligible,true);
 for(const purpose of ["","audio"]){
   const r=await endpoint.resolveOfficialSchoolbookSource(subject,label,{purpose});
   assert.equal(r.status,200,JSON.stringify({subject,label,purpose,error:r.body?.error}));
   assert.equal(r.body?.grounded,true);
   assert.equal(r.body?.mappingStatus,"official-gel-manual-verified-html");
   assert.equal(r.body?.annualScopeVerified,false);
   assert.equal(r.body?.sourceCoverage,"curated-examples");
   assert.equal(r.body?.sourceUrls?.length,count);
   const text=String(r.body?.text||"");
   assert.ok(text.length>=500,label+" too short: "+text.length);
   for(const term of terms)assert.ok(norm(text).includes(norm(term)),label+" lacks "+term);
   if(purpose==="audio")assert.equal(r.body?.sourceCompleteness?.complete,true,"audio source incomplete "+label);
   console.log(JSON.stringify({subject,label,purpose:purpose||"study",chars:text.length,sourceCount:count,pass:true}));
 }
}
assert.equal(pending.count,21);
