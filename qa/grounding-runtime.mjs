// Bounded, read-only source retrieval audit. No AI generation or model calls.
// Each invocation checks a deterministic slice; never treats an unchecked row as passed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url);
const root=fileURLToPath(new URL('../',import.meta.url));
const out=path.join(root,'qa','results','release-gate');
fs.mkdirSync(out,{recursive:true});
const args=Object.fromEntries(process.argv.slice(2).map(x=>x.replace(/^--/,'').split('=')));
const limit=Number(args.limit||20),offset=Number(args.offset||0);
if(!Number.isInteger(limit)||limit<1||limit>50||!Number.isInteger(offset)||offset<0) throw Error('offset >= 0; limit 1..50');
const base='https://www.aitools4kids.gr';
const catalog=require('../general-education-book-sections-2026-2027.js');
const complete=require('../primary-schoolbook-complete-sources-2026-2027.js');
const secondary=require('../secondary-grounding-availability-2026-2027.js');
const epal=require('../epal-schoolbook-catalog-2026-2027.js');
const special=require('../special-education-book-sections-2026-2027.js');
const rows=[],gaps=[];
function add(level,subject,topic,context={}){rows.push({level,subject,topic,...context});}
for(const id of catalog.ids||[]){
  if(!/-dimotikou$/i.test(id)) continue;
  const row=catalog.get(id);
  for(const topic of row?.sections||[]){
    if(row.groundedSections?.[topic]||complete.get(id,topic)?.urls?.length) add('primary',id,topic);
    else gaps.push({level:'primary',subject:id,topic,reason:'official-source-not-mapped; primary fallback policy'});
  }
}
for(const [id,topics] of Object.entries(secondary.subjects||{}))
  for(const topic of topics) add(/-gymnasiou$/i.test(id)?'gymnasium':'gel',id,topic);
for(const group of epal.groups){
  for(const id of group.subjectIds){
    for(const topic of Object.keys(group.units)) add('epal',id,topic,{schoolType:'epal',grade:group.grade});
    for(const [topic,reason] of Object.entries(group.unmapped))
      if(!/^(?:free-text-input|not-a-unit)/.test(reason)) gaps.push({level:'epal',subject:id,topic,reason});
  }
}
for(const [id,row] of Object.entries(special.subjects||{}))
  for(const [topic] of row.units||[]) add('special',id,topic);
const unique=[...new Map(rows.map(r=>[JSON.stringify(r),r])).values()].sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b),'en'));
const manifestHash=createHash('sha256').update(JSON.stringify(unique)).digest('hex');
fs.writeFileSync(path.join(out,'runtime-inventory.json'),JSON.stringify({manifestHash,total:unique.length,rows:unique,explicitGaps:gaps},null,2));
if(args.inventory==='true'){console.log(JSON.stringify({manifestHash,total:unique.length,explicitGaps:gaps.length}));process.exit(0);}
if(offset>=unique.length)throw Error('offset exceeds inventory');
const results=[];
for(const row of unique.slice(offset,offset+limit)){
  const {level,...query}=row;
  const url=base+'/api/schoolbook-source?'+new URLSearchParams(query);
  try{
    const r=await fetch(url,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(45000)});
    const body=await r.json();
    const chars=String(body.text||'').trim().length;
    const ok=r.status===200&&body.grounded===true&&chars>0;
    results.push({...row,status:r.status,ok,chars,error:body.error||null,sourceUrl:body.sourceUrl||null});
  }catch(e){results.push({...row,ok:false,error:String(e.message)});}
  await new Promise(resolve=>setTimeout(resolve,300));
}
const fail=results.filter(r=>!r.ok).length;
const report={manifestHash,offset,limit,total:unique.length,checked:results.length,unchecked:unique.length-results.length,pass:results.length-fail,fail,results};
fs.writeFileSync(path.join(out,'runtime-'+offset+'.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({manifestHash,offset,total:unique.length,checked:results.length,pass:report.pass,fail}));
process.exitCode=fail?1:0;
