import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const routerPath=require.resolve('../ai-provider-router.js');
const sourcePath=require.resolve('../api/schoolbook-source.js');
let sourceCalls=0,generatorCalls=0,lastMessages=null;
require.cache[routerPath]={id:routerPath,filename:routerPath,loaded:true,exports:{
  getAiStatus:()=>({configured:true,model:'mock'}),
  generateChat:async args=>{generatorCalls++;lastMessages=args.messages;return {ok:true,text:'## Τεκμηριωμένο σχέδιο μαθήματος\n\nΜία άσκηση πάνω στο υλικό.',model:'mock',provider:'mock'};}
}};
require.cache[sourcePath]={id:sourcePath,filename:sourcePath,loaded:true,exports:{
  resolveOfficialSchoolbookSource:async (subject,topic)=>{sourceCalls++;return {ok:true,status:200,body:{grounded:true,text:'Επαληθευμένο βιβλίο για συγκεκριμένη ενότητα. '.repeat(22),sourceUrl:'https://ebooks.edu.gr/ebooks/v/html/example/chapter.html',bookTitle:'Επίσημο βιβλίο',annualScopeVerified:false}};}
}};
const handler=require('../api/teacher-assistant.js');
async function request(payload){
 const out={status:200,body:null};
 const res={setHeader:()=>{},status(c){out.status=c;return this},json(v){out.body=v;return v}};
 await handler({method:'POST',headers:{'content-type':'application/json'},body:{audience:'teacher',prompt:'Φτιάξε φύλλο εργασίας.',...payload}},res);
 return out;
}
let r=await request({sourceMode:'teacher_upload',documentText:'Μικρό'});
assert.equal(r.status,422);assert.equal(generatorCalls,0);
r=await request({sourceMode:'official_schoolbook',sourceSubjectId:'fysiki-b-gymnasiou',sourceTopic:'Ενότητα 1',documentText:'CLIENT FORGED TEXT'});
assert.equal(r.status,200);assert.equal(sourceCalls,1);assert.equal(generatorCalls,1);
assert.equal(r.body.source.kind,'official_schoolbook');
assert.equal(r.body.groundingValidated,true);
assert.equal(r.body.source.annualScopeVerified,false);
const messages=JSON.stringify(lastMessages);
assert.match(messages,/Επαληθευμένο βιβλίο/);
assert.doesNotMatch(messages,/CLIENT FORGED TEXT/,'client claims must not override server book');
r=await request({sourceMode:'teacher_upload',documentText:'Αυτό είναι πραγματικό υλικό εκπαιδευτικού και περιγράφει το συγκεκριμένο μάθημα με σαφήνεια.',documentName:'Σημειώσεις'});
assert.equal(r.status,200);assert.equal(r.body.source.kind,'teacher_upload');assert.equal(r.body.groundingValidated,false);
r=await request({sourceMode:'unknown'});
assert.equal(r.status,400);
console.log('PHASE40_TEACHER_SERVER_VERIFICATION_OK',{sourceCalls,generatorCalls});
