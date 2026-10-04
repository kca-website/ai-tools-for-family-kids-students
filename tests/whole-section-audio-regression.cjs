const assert = require('node:assert/strict');
const fs = require('node:fs');
const {extractCompletePage} = require('../schoolbook-section');
const {sourceUnits,selectedPassages,sourceSentences,createWholeSectionLesson,validMap} = require('../whole-section-audio');
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
const context = 'Φυτεύουμε ένα κλαδί από το γεράνι. Στη συγκεκριμένη περίπτωση, η αναπαραγωγή γίνεται με μονογονία.';
const contextUnits = sourceUnits(context);
assert.equal(validMap(JSON.stringify({units:[{id:'u1',passages:[context.split('. ')[1]]}]}),contextUnits),false,'An exact sentence must not lose its antecedent');
assert.equal(validMap(JSON.stringify({units:[{id:'u1',passages:[context]}]}),contextUnits),true);
assert.equal(validMap(JSON.stringify({units:[{id:'u1',passages:['Η γύρη είναι γαμέτης.']}]}),sourceUnits('Η γύρη περιέχει γαμέτες.')),false);
const table = '<main><table class="small"><tr><td>Όνομα</td><td>Σύμβολο</td><td>Σχέση</td></tr><tr><td>Μίκρο</td><td>μ</td><td>1/10000000=10<sup>–6</sup></td></tr><tr><td>Μέγα</td><td>Μ</td><td>10000000=10<sup>6</sup></td></tr></table></main>';
const tableText=extractCompletePage(table,{sourceUrl:'https://ebooks.edu.gr/ebooks/v/html/8547/2204/Fysiki_B-Gymnasiou_html-empl/index1_3.html'}).text;
assert.match(tableText,/Μίκρο · μ · 1\/1000000=10\^–6/);
assert.match(tableText,/Μέγα · Μ · 1000000=10\^6/);
assert.match(extractCompletePage(table,{sourceUrl:'https://ebooks.edu.gr/other'}).text,/10000000/,'Corrections must not apply to unrelated sources');
const normalize = s => s.replace(/\s+/g,' ').trim();
(async()=>{
 for(const count of [1,8,45]){
  const source = Array.from({length:count},(_,i)=>`Μέρος ${i+1}. ${prose} Μοναδικό γνώρισμα αριθμός ${i+1}.`).join('\n\n');
  assert.equal(normalize(sourceUnits(source).map(u=>u.text).join(' ')),normalize(source));
  const result=await createWholeSectionLesson({source,topic:'Test',generate:async args=>{
   const input=JSON.parse(args.messages.at(-1).content);
   return {ok:true,text:JSON.stringify(input.proposals?{checks:input.sourceUnits.map(u=>({id:u.id,supported:true,complete:true,concise:true}))}:{units:input.sourceUnits.map(u=>({id:u.id,lesson:u.text,evidence:[u.text]}))})};
  }});
  assert.equal(result.verification.coverageRatio,1);assert.equal(result.verification.verbatimUnits,0);assert.match(result.text,new RegExp(`Μέρος ${count}\\.`));
  assert.ok(result.text.length>=source.length);assert.equal(result.verification.unitsCovered,result.verification.units);
 }
 await assert.rejects(createWholeSectionLesson({source:prose,topic:'Test',generate:async args=>{
  const input=JSON.parse(args.messages.at(-1).content);
  return {ok:true,text:JSON.stringify(input.proposals?{checks:input.sourceUnits.map(u=>({id:u.id,supported:false,complete:false,concise:false}))}:{units:input.sourceUnits.map(u=>({id:u.id,lesson:'Ο αυθαίρετος ισχυρισμός είναι πραγματικότητα.',evidence:[u.text]}))})};
 }}),/verified_audio_summary_unavailable/);
 await assert.rejects(createWholeSectionLesson({source:Array(25).fill(prose).join('\n\n'),topic:'Test',generate:async()=>({ok:false,status:429})}),/verified_audio_summary_unavailable/);
 const essential = 'Τα φυτά αναπαράγονται με μονογονία ή αμφιγονία.';
 const end = 'Μετά τη γονιμοποίηση σχηματίζεται το σπέρμα.';
 const verbose = essential+' Ένα επιπλέον δευτερεύον παράδειγμα αφορά ένα φυτό σε μια γλάστρα. '+end+'\n\nΕικόνα 6.4. Φωτογραφία ενός κήπου.';
 const catalog=sourceSentences(sourceUnits(verbose)[0]);
 assert.equal(validMap(JSON.stringify({units:[{id:'u1',sentenceIds:[catalog[0].id,catalog[2].id]}]}),sourceUnits(verbose)),true);
 assert.equal(validMap(JSON.stringify({units:[{id:'u1',sentenceIds:['invented-id']}]}),sourceUnits(verbose)),false);
 assert.equal(validMap(JSON.stringify({units:[{id:'u1',sentenceIds:[catalog[2].id,catalog[0].id]}]}),sourceUnits(verbose)),true);
 assert.equal(validMap(JSON.stringify({units:[{id:'u1',sentenceIds:[catalog[0].id,catalog[0].id]}]}),sourceUnits(verbose)),false);
 assert.deepEqual(selectedPassages({sentenceIds:[catalog[2].id,catalog[0].id]},sourceUnits(verbose)[0]),[essential,end]);
 const references = sourceSentences(contextUnits[0]);
 assert.deepEqual(selectedPassages({sentenceIds:[references[1].id]},contextUnits[0]),references.map(s=>s.text));
 assert.equal(sourceSentences({id:'u1',text:'6.10 Τα σπέρματα είναι γυμνά.'})[0].text,'Τα σπέρματα είναι γυμνά.');
 assert.deepEqual(sourceSentences({id:'u1',text:'ΜΕΙΓΜΑΤΑ -> ΔΙΑΛΥΤΗΣ -> ΝΕΡΟ -> ΟΥΣΙΕΣ.'}),[]);
 assert.deepEqual(sourceSentences({id:'u1',text:'1η-5η ημέρα Περιγραφή του σχήματος.'}),[]);
 assert.equal(sourceSentences({id:'u1',text:'ρ = m / V.'})[0].text,'ρ = m / V.');
 const shortened = await createWholeSectionLesson({source:verbose,topic:'Φυτά',generate:async args=>{
  const input=JSON.parse(args.messages.at(-1).content);
  return {ok:true,text:JSON.stringify(input.proposals?{checks:[{id:'u1',supported:true,complete:true,concise:true}]}:{units:[{id:'u1',sentenceIds:[catalog[0].id,catalog[2].id]}]})};
 }});
 assert.match(shortened.text,/μονογονία ή αμφιγονία/);assert.match(shortened.text,/σπέρμα/);
 assert.doesNotMatch(shortened.text,/δευτερεύον|Φωτογραφία|Εικόνα/);
 assert.ok(shortened.verification.compressionRatio<0.6);
 assert.equal(shortened.mode,'verified-summary');
 const layeredSource = Array.from({length:20},(_,i)=>`Κύρια ιδέα ${i+1}: ένα ουσιώδες συμπέρασμα. ${'Δευτερεύουσες επεξηγηματικές λεπτομέρειες και επαναληπτικά παραδείγματα. '.repeat(5)}`).join('\n\n');
 let globalReview=false;
 const layered=await createWholeSectionLesson({source:layeredSource,topic:'Σύνοψη',generate:async args=>{
  const input=JSON.parse(args.messages.at(-1).content);
  if(input.sectionWide)globalReview=true;
  return {ok:true,text:JSON.stringify(input.proposals?{checks:input.sourceUnits.map(u=>({id:u.id,supported:true,complete:true,concise:true}))}:{units:input.sourceUnits.map(u=>({id:u.id,sentenceIds:sourceSentences(u).filter(s=>!input.sectionWide||s.text.startsWith('Κύρια')).map(s=>s.id)}))})};
 }});
 assert.equal(globalReview,true);assert.ok(layered.verification.compressionRatio<0.3);
 for(const i of [1,10,20])assert.match(layered.text,new RegExp('Κύρια ιδέα '+i+':'));
 for(const failure of ['supported','complete','concise']) await assert.rejects(createWholeSectionLesson({source:verbose,topic:'Φυτά',generate:async args=>{
  const input=JSON.parse(args.messages.at(-1).content);
  return {ok:true,text:JSON.stringify(input.proposals?{checks:[{id:'u1',supported:true,complete:true,concise:true,[failure]:false}]}:{units:[{id:'u1',sentenceIds:[catalog[0].id,catalog[2].id]}]})};
 }}),/verified_audio_summary_unavailable/);
 assert.equal(validMap(JSON.stringify({units:[]}),sourceUnits(prose)),false);
 const page=fs.readFileSync(require.resolve('../study.html'),'utf8');assert.doesNotMatch(page,/if\(action==='audio'&&\/\^insufficient_/);
 console.log('PASS: body vs TOC, sibling boundaries, all sequential text, image formulas, small/medium/large, unsupported claims, essential-idea summary without captions or secondary examples, rejects incomplete/non-concise output, outage does not read whole book');
})().catch(err=>{console.error(err);process.exitCode=1});

const {correctOfficialFigure,figureCorrections} = require('../schoolbook-source-corrections');
const timeline = figureCorrections[0];
assert.match(correctOfficialFigure(timeline.url,timeline.sha256),/532: Στάση Νίκα/);
assert.match(correctOfficialFigure(timeline.url,timeline.sha256),/Ακαδημίας \(χωρίς χωριστή ημερομηνία/);
assert.equal(correctOfficialFigure(timeline.url,'changed-image'),null);
assert.equal(correctOfficialFigure('https://ebooks.edu.gr/other',timeline.sha256),null);
