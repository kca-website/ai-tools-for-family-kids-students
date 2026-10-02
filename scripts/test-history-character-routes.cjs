const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=process.env.ROUTE_DATA_ROOT||path.resolve(__dirname,'..');
const html=fs.readFileSync(path.resolve(__dirname,'../study.html'),'utf8');
const window={},container={innerHTML:''};
const context=vm.createContext({window,console,URLSearchParams,document:{addEventListener(){},querySelectorAll(){return[]},getElementById(){return null}},setTimeout(){}});
for(const [,file]of html.matchAll(/<script src="\/([^"]+)"/g)){
 if(/pdf-text-reader|guided-task-assistant|study-context/.test(file))continue;
 const source=['history-character-data.js','history-e-schoolbook-chapters.js'].includes(file)?path.resolve(__dirname,'../'+file):path.join(root,file);
 vm.runInContext(fs.readFileSync(source,'utf8'),context,{filename:file});
}
function extract(start,end){return html.slice(html.indexOf(start),html.indexOf(end,html.indexOf(start)))}
context.container=container;
vm.runInContext(`const $=()=>container,resolver=()=>window.AITOOLSKIDS_CURRICULUM_RESOLVER;let lang='el';const grades={primary:[['a','Α΄'],['b','Β΄'],['c','Γ΄'],['d','Δ΄'],['e','Ε΄'],['st','ΣΤ΄']],middle:[['a','Α΄'],['b','Β΄'],['c','Γ΄']],high:[['a','Α΄'],['b','Β΄'],['c','Γ΄']]};function selectedSubjectId(){return ''}function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}`,context);
for(const [start,end]of [['  function studyTopicsFor','  function populateTopics'],['  function requiresOfficialSource','  async function officialSchoolbookSource'],['  function charactersForTopic','  function studyCharacterChoices'],['  function renderCharacterRoutes','  let activeStudyCharacter']])vm.runInContext(extract(start,end),context);
vm.runInContext('renderCharacterRoutes()',context);
const links=[...container.innerHTML.matchAll(/href="([^"]+)"/g)].map(m=>m[1].replace(/&amp;/g,'&'));
assert.ok(links.length>15);
const characters=new Set();
for(const link of links){const q=new URL(link,'https://www.aitools4kids.gr').searchParams;const topics=context.studyTopicsFor(q.get('zone'),q.get('grade'),q.get('subject'));assert.ok(topics.some(t=>t.id===q.get('topic')),link);assert.ok(context.charactersForTopic(q.get('subject'),q.get('topicText')).some(c=>c.id===q.get('character')),link);characters.add(q.get('character'))}
assert.equal(context.charactersForTopic('istoria-b-gymnasiou','Εξωτερικά προβλήματα και αναδιοργάνωση του κράτους').some(c=>c.id==='kapodistrias'),false);
assert.equal(context.charactersForTopic('istoria-b-gymnasiou','Περίοδος της κρίσης του Βυζαντίου (1025-1453)').some(c=>c.id==='constantinopleResident1453'),false);
assert.equal(context.charactersForTopic('istoria-b-gymnasiou','Οι σταυροφορίες και η πρώτη άλωση της Πόλης').some(c=>c.id==='constantinopleResident1453'),false);
console.log(`${links.length} selectable routes for ${characters.size} characters; no false Kapodistrias or broad 1453 match`);
fs.writeFileSync('/tmp/verified-character-links.json',JSON.stringify(links));
