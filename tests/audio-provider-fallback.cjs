const assert=require('node:assert/strict');
const {generateChat,modelSequenceFor}=require('../ai-provider-router');
const saved={...process.env};const original=global.fetch;
Object.assign(process.env,{CLOUDFLARE_LLM_ACCOUNT_ID:'account',CLOUDFLARE_LLM_AI_TOKEN:'token',GROQ_API_KEY:'token',GEMINI_API_KEY:'test',GEMINI_PRODUCTION_MODEL:'gemini-2.5-flash-lite'});
(async()=>{try{
 assert.ok(!modelSequenceFor('gemini','balanced').includes('gemini-2.5-flash-lite'));
 const calls=[];global.fetch=async(url,options)=>{calls.push(String(url));return new Response(JSON.stringify(String(url).includes('googleapis')?{candidates:[{content:{parts:[{text:'Complete lesson response'}]},finishReason:'STOP'}]}:{error:{message:'rate limited'}}),{status:String(url).includes('googleapis')?200:429});};
 const result=await generateChat({messages:[{role:'user',content:'Source lesson'}]});assert.equal(result.ok,true);assert.equal(result.provider,'gemini');assert.equal(calls.length,3);assert.ok(!calls.some(u=>u.includes('2.5-flash-lite')));
 global.fetch=async()=>new Response(JSON.stringify({candidates:[{content:{parts:[{text:'unsupported'}]},finishReason:'STOP'}]}),{status:200});
 const invalid=await generateChat({messages:[{role:'user',content:'Source'}],providerOrder:['gemini'],validateText:t=>t==='supported'});assert.equal(invalid.ok,false);assert.equal(invalid.error,'invalid_output');
 console.log('PASS: automatic 429 provider fallback, obsolete Gemini skipped, invalid lesson rejected');
}finally{global.fetch=original;for(const k of Object.keys(process.env))if(!(k in saved))delete process.env[k];Object.assign(process.env,saved)}})().catch(e=>{console.error(e);process.exitCode=1});
