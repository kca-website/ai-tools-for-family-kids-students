import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const providerPath=require.resolve('../ai-provider-router.js');
const schoolbookPath=require.resolve('../api/schoolbook-source.js');
const evidencePath=require.resolve('../teacher-web-evidence.js');
let modelCalls=0,searchCalls=0;
require.cache[providerPath]={id:providerPath,filename:providerPath,loaded:true,exports:{
 getAiStatus:()=>({configured:true,model:'mock'}),
 generateChat:async ({messages})=>{modelCalls++;const body=messages.map(x=>x.content).join('\n');assert.match(body,/έρευνα/);assert.match(body,/Ενότητα της Ιστορίας/);return {ok:true,text:'## Φύλλο εργασίας\n\nΕρμηνεία βασισμένη στις πραγματικές πηγές.',provider:'mock',model:'test'};}
}};
require.cache[schoolbookPath]={id:schoolbookPath,filename:schoolbookPath,loaded:true,exports:{resolveOfficialSchoolbookSource:async()=>{throw Error('Must not call official resolver for approved web research')}}};
require.cache[evidencePath]={id:evidencePath,filename:evidencePath,loaded:true,exports:{collectTeacherWebEvidence:async ({chapter})=>{searchCalls++;assert.equal(chapter,'Ενότητα της Ιστορίας');return {ok:true,summary:'Επαληθευμένη πραγματική διαδικτυακή έρευνα. '.repeat(20),sources:[{title:'Επιστημονικό αρχείο',url:'https://university.example.edu/records'}],searches:['ιστορία τεκμήρια'],searchSuggestions:''}}}};
const handler=require('../api/teacher-assistant.js');
async function request(body){
 let status=200,payload;
 const res={setHeader(){},status(n){status=n;return this},json(x){payload=x;return x}};
 await handler({method:'POST',headers:{'content-type':'application/json'},body:{prompt:'Φτιάξε φύλλο εργασίας',audience:'teacher',...body}},res);
 return {status,payload};
}
const web={sourceMode:'internet_search',sourceTopic:'Ενότητα της Ιστορίας',webSubjectLabel:'Ιστορία',webGradeLabel:'Β΄ Γυμνασίου',webContextLabel:'Γυμνάσιο'};
let out=await request(web);assert.equal(out.status,403);assert.equal(searchCalls,0);assert.equal(modelCalls,0);
out=await request({...web,webConsent:true,webGradeLabel:''});assert.equal(out.status,422);assert.equal(searchCalls,0);
out=await request({...web,webConsent:true});assert.equal(out.status,200);
assert.equal(searchCalls,1);assert.equal(modelCalls,1);
assert.equal(out.payload.source.kind,'web_research');
assert.equal(out.payload.groundingValidated,false);
assert.deepEqual(out.payload.source.sources[0],{title:'Επιστημονικό αρχείο',url:'https://university.example.edu/records'});
assert.equal(out.payload.source.annualScopeVerified,false);
console.log('PHASE41_TEACHER_WEB_SEARCH_CONSENT_AND_PROVENANCE_OK');
const evidence=require('../teacher-web-evidence.js');
const oldFetch=globalThis.fetch, oldKey=process.env.GEMINI_API_KEY;process.env.GEMINI_API_KEY='test-key';
try{
 let requested;
 globalThis.fetch=async (url,options)=>{requested=JSON.parse(options.body);return {ok:true,json:async()=>({candidates:[{content:{parts:[{text:'Δοκιμαστικό πραγματικό κείμενο για το περιεχόμενο του μαθήματος. '.repeat(5)}]},groundingMetadata:{groundingChunks:[{web:{uri:'https://school.edu.gr/article',title:'Σχολικό άρθρο'}}],groundingSupports:[{segment:{startIndex:0,endIndex:20},groundingChunkIndices:[0]}],webSearchQueries:['εκπαίδευση']}}]})}};
 let got=await evidence.collectTeacherWebEvidence({chapter:'Ενότητα της Ιστορίας',subject:'Ιστορία',grade:'Β΄ Γυμνασίου',context:'Γυμνάσιο'});
 assert.equal(got.ok,true);assert.equal(requested.tools[0].google_search!==undefined,true);
 assert.equal(got.sources.length,1);
 globalThis.fetch=async()=>({ok:true,json:async()=>({candidates:[{content:{parts:[{text:'Σύνοψη από μνήμη χωρίς τεκμηρίωση. '.repeat(20)}]}}]})});
 got=await evidence.collectTeacherWebEvidence({chapter:'Ιστορία',subject:'Ιστορία',grade:'Β΄',context:'Γυμνάσιο'});
 assert.equal(got.ok,false,'model memory must not count as internet research');
 console.log('PHASE41_TEACHER_GOOGLE_GROUNDING_METADATA_REQUIRED_OK');
}finally{globalThis.fetch=oldFetch;if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey;}
