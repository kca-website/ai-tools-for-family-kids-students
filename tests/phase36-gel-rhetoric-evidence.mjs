import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const inventory=require('../gel-schoolbook-source-map-2026-2027.js');
const manual=require('../gel-schoolbook-manual-overrides-2026-2027.js');
const availability=require('../secondary-grounding-availability-2026-2027.js');
const dispositions=require('../gel-unmapped-dispositions-2026-2027.js');
const endpoint=require('../api/schoolbook-source.js');
const cases=[
  ['archaia-b-lykeiou','Συντακτικές λειτουργίες όρων της πρότασης','8547/2397',['γεν. της αιτίας','αντικείμενα']],
  ['archaia-b-lykeiou','Δευτερεύουσες προτάσεις','8547/2397',['δευτερεύουσες','συντακτικά']],
  ['archaia-b-lykeiou','Υποθετικός λόγος και σύνθετα συντακτικά φαινόμενα','8547/2397',['υποθετικοί λόγοι']],
  ['ekthesi-b-lykeiou','Λογοτεχνική ερμηνεία με κειμενικούς δείκτες','8547/2376',['χαρακτηριστικά αποσπάσματα','γλώσσα']]
];
const norm=v=>String(v||'').toLocaleLowerCase('el').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ς/g,'σ');
for(const [subject,label,work,terms] of cases){
  const o=manual.get(subject,label), original=inventory.get(subject)?.topicMappings?.find(t=>t.label===label);
  assert.ok(o,label);
  assert.equal(o?.sourceTopicId,original?.topicId);
  assert.equal(o?.work,work);
  assert.equal(o?.granularity,'manual-curated-examples-not-exhaustive-unit');
  assert.equal(o?.sources?.length,1);
  assert.equal(availability.has(subject,label),true);
  assert.equal(dispositions.get(subject,label),null);
  assert.equal(endpoint._test.resolveGelInventoryTopic(subject,label)?.runtimeEligible,true);
  for(const purpose of ['','audio']){
    const r=await endpoint.resolveOfficialSchoolbookSource(subject,label,{purpose});
    assert.equal(r.status,200,JSON.stringify({subject,label,purpose,status:r.status,error:r.body?.error}));
    assert.equal(r.body?.grounded,true);
    assert.equal(r.body?.annualScopeVerified,false);
    assert.equal(r.body?.sourceCoverage,'curated-examples');
    assert.equal(r.body?.sourceUrls?.length,1);
    assert.ok(String(r.body?.text||'').length>=500,label+': official text too short');
    for(const term of terms)assert.ok(norm(r.body.text).includes(norm(term)),label+' missing '+term);
    if(purpose==='audio')assert.equal(r.body?.sourceCompleteness?.complete,true,label+': incomplete audio source');
    console.log(JSON.stringify({subject,label,purpose:purpose||'study',characters:r.body.text.length,liveSource:true}));
  }
}
assert.equal(dispositions.count,21);
