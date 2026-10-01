const assert=require('node:assert/strict');
process.env.GEMINI_API_KEY='test-secret';
delete process.env.CLOUDFLARE_LLM_ACCOUNT_ID;
delete process.env.GROQ_API_KEY;
delete process.env.SMART_AI_ROUTING_ENABLED;
const {generateChat}=require('../ai-provider-router');
const calls=[];
global.fetch=async(url,options)=>{
  assert.ok(!url.includes('test-secret'));
  calls.push(url);
  if(url.includes('gemini-2.5-flash-lite'))return Response.json({error:{status:'NOT_FOUND',message:'This model is no longer available to new users.'}},{status:404});
  assert.ok(url.includes('gemini-3.5-flash-lite'));
  const body=JSON.parse(options.body);
  assert.deepEqual(body.generationConfig.thinkingConfig,{thinkingLevel:'minimal'});
  assert.equal(body.generationConfig.maxOutputTokens,600);
  return Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:'Έτοιμο'}]}}]});
};
(async()=>{
 const result=await generateChat({messages:[{role:'user',content:'test'}],maxTokens:600});
 assert.equal(result.ok,true);
 assert.equal(result.model,'gemini-3.5-flash-lite');
 assert.equal(calls.length,2);
 console.log('New-user Gemini 404 switches automatically to supported Flash-Lite');
})().catch(error=>{console.error(error);process.exitCode=1});
