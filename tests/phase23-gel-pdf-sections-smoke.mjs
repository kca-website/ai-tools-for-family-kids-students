import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const endpoint=require('../api/schoolbook-source.js');
const inventory=require('../gel-schoolbook-source-map-2026-2027.js');
const pdf=require('../api/official-pdf-text.js');
const manifest=JSON.parse(fs.readFileSync(new URL('../scripts/phase23/math-humanities-pdf-sections.json',import.meta.url)));
const row=inventory.get(manifest.subjectId);
assert.equal(row.topicMappings.length,11);
const text='Τίτλος ενότητας\n'+ 'Εξεταστέα θεωρία και εφαρμογές. '.repeat(20);
const scoped=pdf.scopeVerifiedPdfText([text,'Πρόσθετο Υλικό 1) ΑΠΑΓΟΡΕΥΜΕΝΟ'], 'Τίτλος ενότητας','Πρόσθετο Υλικό');
assert.equal(scoped.ok,true);
assert.equal(scoped.exclusionApplied,true);
assert.ok(!scoped.text.includes('ΑΠΑΓΟΡΕΥΜΕΝΟ'));
assert.equal(pdf.scopeVerifiedPdfText([text],'Λάθος τίτλος','Πρόσθετο Υλικό').ok,false);
assert.equal(pdf.scopeVerifiedPdfText([text],'Τίτλος ενότητας','Πρόσθετο Υλικό').ok,false);
assert.equal(pdf.scopeVerifiedPdfText([text],'Τίτλος ενότητας','Άγνωστη εξαίρεση').ok,false);
assert.equal((await pdf.extractVerifiedPdfPage({sourceUrl:manifest.sourceUrl,pdfPage:9,pdfPageEnd:29,verifiedHeading:'x'})).error,'official_pdf_page_range_invalid');
assert.equal((await endpoint.resolveOfficialSchoolbookSource(manifest.subjectId,'Πιθανότητες')).ok,false);
let localDoc;
if(process.env.OFFICIAL_PDF_LOCAL){const {getDocument}=await import('pdfjs-dist/legacy/build/pdf.mjs');localDoc=await getDocument({data:new Uint8Array(fs.readFileSync(process.env.OFFICIAL_PDF_LOCAL)),isEvalSupported:false,useSystemFonts:true}).promise;}
try {
 for(const s of manifest.sections){
  const m=row.topicMappings.find(x=>x.label===s.label);
  assert.equal(m.granularity,'pdf-section');assert.equal(m.pdfPage,s.page);assert.equal(m.pdfPageEnd,s.endPage);
  assert.equal(m.annualScopeVerified,true);assert.equal(m.curriculumSource,manifest.syllabusUrl);
  const resolved=endpoint._test.resolveGelInventoryTopic(manifest.subjectId,s.label);assert.equal(resolved.runtimeEligible,true);
  const original=m.url;
  try{m.url=original.replace('/8547/5311/','/8547/9999/');assert.equal(endpoint._test.resolveGelInventoryTopic(manifest.subjectId,s.label).runtimeEligible,false);}finally{m.url=original;}
  if(localDoc){
   const texts=[];for(let n=s.page;n<=s.endPage;n++){const page=await localDoc.getPage(n);texts.push(pdf.textContentToString(await page.getTextContent()));}
   const result=pdf.scopeVerifiedPdfText(texts,s.heading,manifest.excludedHeading);assert.equal(result.ok,true,s.label+' '+result.error);assert.equal(result.exclusionApplied,true);assert.ok(!result.text.includes('Πρόσθετο Υλικό'));
  }else{
   const result=await endpoint.resolveOfficialSchoolbookSource(manifest.subjectId,s.label);
   assert.equal(result.ok,true,s.label+' '+JSON.stringify(result.body));
   assert.equal(result.body.pdfPageEnd,s.endPage);assert.equal(result.body.annualScopeVerified,true);
   assert.equal(result.body.curriculumScopeApplied,true);assert.ok(!result.body.text.includes('Πρόσθετο Υλικό'));
   assert.ok(pdf.normalizePdfText(result.body.text).includes(pdf.normalizePdfText(s.heading)));
  }
  console.log('PDF_SECTION_VERIFIED',s.page,s.endPage,s.label);
 }
}finally{await localDoc?.destroy();}
