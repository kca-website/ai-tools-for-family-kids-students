import fs from 'node:fs';
import {SUBJECT_REGISTRY} from '../phase14/gel-registry.mjs';
const file=new URL('../../gel-schoolbook-source-map-2026-2027.js',import.meta.url);
const src=fs.readFileSync(file,'utf8'), start=src.indexOf('  const data = ')+15, end=src.indexOf(';\n  const subjects',start);
const data=JSON.parse(src.slice(start,end));
const id='mathimatika-g-genikis', subject=data.subjects[id], reg=SUBJECT_REGISTRY[id];
const book=subject.books.find(b=>b.role==='primary'&&b.work==='8547/5309'&&b.pdf);
if(!book) throw new Error('Verified primary PDF missing');
subject.topicMappings=Object.entries(reg.pdfAnchors).map(([topicId,a])=>({
 topicId,label:a.label,status:'exact-pdf',work:book.work,url:book.pdf.url+'#page='+a.page,
 pdfPage:a.page,pdfPageEnd:a.endPage,printedPage:a.printed,heading:a.heading,
 granularity:'pdf-section',matchBasis:'2026-27-syllabus-page-20+verified-pdf-section-range',
 labelParaphrase:false,annualScopeVerified:true,curriculumSource:a.curriculumSource,excludedHeading:a.excludedHeading
}));
subject.topicCoverage='complete';
subject.topicSummary={total:11,'exact-html':0,'exact-pdf':11,'needs-manual-review':0,'no-safe-mapping':0};
data.summary={subjects:Object.keys(data.subjects).length,byStatus:{},topics:{total:0,'exact-html':0,'exact-pdf':0,'needs-manual-review':0,'no-safe-mapping':0}};
for(const s of Object.values(data.subjects)){
 data.summary.byStatus[s.status]=(data.summary.byStatus[s.status]||0)+1;
 for(const [k,v] of Object.entries(s.topicSummary)) data.summary.topics[k]=(data.summary.topics[k]||0)+v;
}
function ser(v,depth=0,pad=''){
 if(v===null||typeof v!=='object')return JSON.stringify(v);
 const arr=Array.isArray(v), compact=JSON.stringify(v);
 if(depth>=3||compact.length<90)return compact;
 const ip=pad+' ',items=arr?v.map(x=>ip+ser(x,depth+1,ip)):Object.keys(v).map(k=>ip+JSON.stringify(k)+': '+ser(v[k],depth+1,ip));
 return(arr?'[':'{')+'\n'+items.join(',\n')+'\n'+pad+(arr?']':'}');
}
fs.writeFileSync(file,src.slice(0,start)+ser(data)+src.slice(end));
console.log('Applied 11 verified PDF section ranges');

