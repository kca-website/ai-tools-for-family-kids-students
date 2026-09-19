import fs from 'node:fs';
import path from 'node:path';

const sourceDir=process.argv[2];
const output=process.argv[3]||'epal-official-guidance-topics-2026-2027.js';
if(!sourceDir) throw new Error('Usage: node scripts/build-epal-official-guidance-data.mjs <pdftotext-directory> [output]');

const sources=[
  [2,'appliedArts'],[3,'structures'],[4,'mechanical'],[5,'agriculture'],
  [6,'informatics'],[7,'electrical'],[8,'health'],[9,'administrationEconomy'],[10,'foreignLanguages']
];

const clean=value=>String(value||'').replace(/\f/g,' ').replace(/\s+/g,' ').trim();
const norm=value=>clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/[^a-z0-9α-ω]+/g,' ').replace(/\s+/g,' ').trim().replace(/^δiδακτεα/,'διδακτεα');

function scopeStart(lines){
  return lines.findIndex(line=>{
    const n=norm(line);
    return /^(?:διδακτεα|εξεταστεα)(?: εξεταστεα)? υλη/.test(n)||n.includes('διδακτεα εξεταστεα υλη');
  });
}

function topicFromLine(raw){
  const line=String(raw||'').replace(/\f/g,'').trimEnd();
  const trimmed=line.trim();
  if(!trimmed) return '';
  let match=trimmed.match(/^((?:Κεφ(?:άλαιο|\.)?|Ενότητα|Μέρος|ΔΙΔΑΚΤΙΚΗ ΕΝΟΤΗΤΑ)\s*[^\s].*?)(?:\s{2,}.*)?$/i);
  if(match){
    const candidate=clean(match[1]);
    if(/(?:ΤΙΤΛΟΣ|ΠΑΡΑΤΗΡΗΣ|ΕΝΟΤΗΤΕΣ\/ΠΑΡΑΓΡΑΦΟΙ)/i.test(candidate)) return '';
    if(/^(?:ΚΕΦΑΛΑΙΟ|ΕΝΟΤΗΤΑ|ΜΕΡΟΣ)$/i.test(candidate)) return '';
    return candidate.length<=180?candidate:'';
  }
  match=line.match(/^\s*(\d+)[οΟo]?\s{2,}(.+?)(?:\s{2,}.*)?$/);
  if(match){
    const title=clean(match[2]);
    if(title.length>3&&title.length<=140&&!/^(?:σελ|ωρες|σύνολο)/i.test(title)) return `Κεφάλαιο ${match[1]} — ${title}`;
  }
  return '';
}

function extractScope(block){
  const lines=block.split(/\r?\n/);
  const start=scopeStart(lines);
  if(start<0) return {topics:[],scope:''};
  const selected=[];
  const markerLine=lines[start];
  const markerTail=markerLine.replace(/^.*?(?:Διδακτέα(?:\s*-\s*Εξεταστέα)?|Εξεταστέα|ΔIΔΑΚΤΕΑ)\s+[ΎΥύυ]λη\s*:?/i,'').trim();
  if(markerTail) selected.push(markerTail);
  for(let i=start+1;i<lines.length;i++){
    selected.push(lines[i]);
  }
  const topics=[...new Set(selected.map(topicFromLine).filter(Boolean))].slice(0,40);
  let paragraph=[];
  for(const line of selected){
    const value=clean(line);
    if(!value){if(paragraph.length) break;continue;}
    if(/^ΑΔΑ:/i.test(value)||/^\d+$/.test(value)) continue;
    paragraph.push(value);
    if(paragraph.join(' ').length>420) break;
  }
  const scope=clean(paragraph.join(' ')).slice(0,500);
  return {topics,scope};
}

function courseBlocks(text){
  const matches=[...text.matchAll(/ΜΑΘΗΜΑ:\s*([^\n]+)/g)];
  return matches.map((match,index)=>({
    label:clean(match[1]),
    block:text.slice(match.index,matches[index+1]?.index||text.length)
  }));
}

const records=[];
for(const [number,sourceKey] of sources){
  const filename=path.join(sourceDir,`${number}.txt`);
  if(!fs.existsSync(filename)) throw new Error(`Missing ${filename}`);
  const text=fs.readFileSync(filename,'utf8');
  for(const course of courseBlocks(text)){
    if(!/^[A-ZΑ-ΩΆΈΉΊΌΎΏ«]/.test(course.label)||course.label.startsWith(':')||course.label.length<4) continue;
    const extracted=extractScope(course.block);
    if(!extracted.topics.length&&!extracted.scope) continue;
    records.push({label:course.label,sourceKey,...extracted});
  }
}

const best=new Map();
for(const record of records){
  const key=norm(record.label);
  const previous=best.get(key);
  if(!previous||record.topics.length>previous.topics.length||(!previous.scope&&record.scope)) best.set(key,record);
}

const payload=[...best.values()].sort((a,b)=>a.label.localeCompare(b.label,'el'));
const js=`(function(){\n  "use strict";\n  const records=${JSON.stringify(payload,null,2)};\n  const norm=value=>String(value||"").replace(/^.*?\\s·\\s/,"").replace(/^Ειδικό εργαστηριακό:\\s*/,"").normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").toLowerCase().replace(/[^a-z0-9α-ω]+/g," ").replace(/\\s+/g," ").trim().replace(/\\bii\\b/g,"ιι").replace(/\\bi\\b/g,"ι");\n  const byLabel=new Map(records.map(record=>[norm(record.label),Object.freeze(record)]));\n  const aliases=new Map([\n    ["εισαγωγη στα υπολογιστικα συστηματα και στα δικτυα επικοινωνιων","εισαγωγη στα υπολογιστικα συστηματα και"]\n  ]);\n  function get(label){\n    const key=norm(label);\n    const direct=byLabel.get(key)||byLabel.get(aliases.get(key));\n    if(direct) return direct;\n    const prefix=[...byLabel.entries()].filter(([candidate])=>candidate.length>=12&&key.startsWith(candidate)).sort((a,b)=>b[0].length-a[0].length)[0];\n    return prefix?.[1]||null;\n  }\n  window.AITOOLSKIDS_EPAL_OFFICIAL_GUIDANCE_TOPICS_2026_2027=Object.freeze({\n    version:"1.0.0",schoolYear:"2026-2027",recordCount:records.length,get,\n    note:"Generated only from the official IEP 2026-27 EPAL guidance PDFs; no keyword-inferred themes."\n  });\n})();\n`;
fs.writeFileSync(output,js);
console.log(`Wrote ${payload.length} official course records to ${output}`);
