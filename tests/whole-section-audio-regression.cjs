const assert = require('node:assert/strict');
const fs = require('node:fs');
const {extractCompletePage} = require('../schoolbook-section');
const {sourceUnits,createWholeSectionLesson,validMap} = require('../whole-section-audio');
const prose = 'ΑΡΧΗ. Η πρώτη ουσιώδης ιδέα εξηγεί έναν ορισμό. ΜΕΣΗ. Η δεύτερη ιδέα εξηγεί μια διαδικασία. ΤΕΛΟΣ. Η τελευταία ιδέα εξηγεί το αποτέλεσμα.';
const toc = '<nav><h2>1.1 Επιλεγμένη</h2><h2>1.2 Γειτονική</h2></nav>';
const html = `<html><head><title>metadata</title></head><body>${toc}<main><h2>1.0 Προηγούμενη</h2><p>ΑΠΑΓΟΡΕΥΜΕΝΟ πριν</p><h2>1.1 Επιλεγμένη</h2><p>${prose}</p><h3>1.1.1 Υποενότητα</h3><p>Επιπλέον ουσιώδης διαδικασία με στάδια.</p><h2>1.2 Γειτονική</h2><p>ΑΠΑΓΟΡΕΥΜΕΝΟ μετά</p></main></body></html>`;
const extracted = extractCompletePage(html,{topic:'1.1 — Επιλεγμένη'}).text;
assert.match(extracted,/ΑΡΧΗ/);assert.match(extracted,/ΜΕΣΗ/);assert.match(extracted,/ΤΕΛΟΣ/);assert.match(extracted,/Επιπλέον/);assert.doesNotMatch(extracted,/ΑΠΑΓΟΡΕΥΜΕΝΟ|Γειτονική|Προηγούμενη|metadata/);
const duplicate = extractCompletePage(`<body><main><div class="toc"><h2>1.1 Επιλεγμένη</h2><h2>1.2 Άλλη</h2></div><h2>1.1 Επιλεγμένη</h2><p>${prose}</p><h2>1.2 Άλλη</h2><p>ΑΠΑΓΟΡΕΥΜΕΝΟ</p></main></body>`,{topic:'1.1'}).text;
assert.match(duplicate,/ΤΕΛΟΣ/);assert.doesNotMatch(duplicate,/ΑΠΑΓΟΡΕΥΜΕΝΟ/);
const review = extractCompletePage(`<div id="eclass_ebook_body"><h1>1.3</h1><p>${prose}</p><p>Ερωτήσεις</p><p>Άσχετη γενική άσκηση κεφαλαίου</p></div>`,{topic:'1.3'}).text;
assert.doesNotMatch(review,/Άσχετη/);
const image=extractCompletePage('<div id="eclass_ebook_body"><p>τύπος <img alt="img" data-official-transcription="ρ = m / V"></p></div>').text;assert.match(image,/ρ = m \/ V/);
const normalize = s => s.replace(/\s+/g,' ').trim();
(async()=>{
 for(const count of [1,8,45]){
  const source = Array.from({length:count},(_,i)=>`Μέρος ${i+1}. ${prose} Μοναδικό γνώρισμα αριθμός ${i+1}.`).join('\n\n');
  assert.equal(normalize(sourceUnits(source).map(u=>u.text).join(' ')),normalize(source));
  const result=await createWholeSectionLesson({source,topic:'Test',generate:async args=>{
   const input=JSON.parse(args.messages.at(-1).content);
   return {ok:true,text:JSON.stringify(input.proposals?{checks:input.sourceUnits.map(u=>({id:u.id,supported:true,complete:true}))}:{units:input.sourceUnits.map(u=>({id:u.id,lesson:u.text,evidence:[u.text]}))})};
  }});
  assert.equal(result.verification.coverageRatio,1);assert.equal(result.verification.verbatimUnits,0);assert.match(result.text,new RegExp(`Μέρος ${count}\\.`));
  assert.ok(result.text.length>=source.length);assert.equal(result.verification.unitsCovered,result.verification.units);
 }
 const unsupported=await createWholeSectionLesson({source:prose,topic:'Test',generate:async args=>{
  const input=JSON.parse(args.messages.at(-1).content);
  return {ok:true,text:JSON.stringify(input.proposals?{checks:input.sourceUnits.map(u=>({id:u.id,supported:false,complete:false}))}:{units:input.sourceUnits.map(u=>({id:u.id,lesson:'Ο αυθαίρετος ισχυρισμός είναι πραγματικότητα.',evidence:[u.text]}))})};
 }});
 assert.doesNotMatch(unsupported.text,/αυθαίρετος/);assert.match(unsupported.text,/ΤΕΛΟΣ/);assert.equal(unsupported.verification.verbatimUnits,1);
 const outage=await createWholeSectionLesson({source:Array(25).fill(prose).join('\n\n'),topic:'Test',generate:async()=>({ok:false,status:429})});
 assert.equal(outage.verification.coverageRatio,1);assert.equal(outage.verification.verbatimUnits,outage.verification.units);assert.equal(normalize(outage.text.split('\n\n').slice(1).join(' ')),normalize(Array(25).fill(prose).join(' ')));
 assert.equal(validMap(JSON.stringify({units:[]}),sourceUnits(prose)),false);
 const page=fs.readFileSync(require.resolve('../study.html'),'utf8');assert.doesNotMatch(page,/if\(action==='audio'&&\/\^insufficient_/);
 console.log('PASS: body vs TOC, sibling boundaries, all sequential text, image formulas, small/medium/large, unsupported claims, full provider outage, no short-route fallback');
})().catch(err=>{console.error(err);process.exitCode=1});
