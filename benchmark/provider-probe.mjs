import fs from 'node:fs';
const account=process.env.CLOUDFLARE_LLM_ACCOUNT_ID, token=process.env.CLOUDFLARE_LLM_AI_TOKEN;
if(!account||!token) throw new Error('Missing configured Cloudflare credentials');
const model='@cf/qwen/qwen3-30b-a3b-fp8';
const base='https://api.cloudflare.com/client/v4/accounts/'+encodeURIComponent(account)+'/ai';
const messages=[{role:'user',content:'Πόσο κάνει 2+2; Απάντησε σε μία πρόταση στα ελληνικά.'}];
const variants=[
 {name:'native-default',endpoint:'/run/'+model,extras:{}},
 {name:'native-template',endpoint:'/run/'+model,extras:{chat_template_kwargs:{enable_thinking:false}}},
 {name:'native-top-level',endpoint:'/run/'+model,extras:{enable_thinking:false}},
 {name:'native-template-no-think',endpoint:'/run/'+model,extras:{chat_template_kwargs:{enable_thinking:false}},noThink:true},
 {name:'compatible-template',endpoint:'/v1/chat/completions',extras:{model,chat_template_kwargs:{enable_thinking:false}}},
 {name:'compatible-top-level',endpoint:'/v1/chat/completions',extras:{model,enable_thinking:false}},
];
const results=[];
for(const v of variants){
 const payload={messages:v.noThink?[{role:'user',content:messages[0].content+' /no_think'}]:messages,max_tokens:256,temperature:0.2,...v.extras};
 const response=await fetch(base+v.endpoint,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(45000)});
 const data=await response.json(),r=data.result||data,m=r.choices?.[0]?.message||{};
 const content=m.content;
 const row={variant:v.name,httpStatus:response.status,success:data.success??null,
 responseType:typeof r.response,responseChars:typeof r.response==='string'?r.response.length:0,
 contentType:Array.isArray(content)?'array':typeof content,contentChars:typeof content==='string'?content.length:0,
 content:typeof content==='string'?content.slice(0,1000):null,
 messageKeys:Object.keys(m),finishReason:r.choices?.[0]?.finish_reason||null,
 reasoningChars:typeof m.reasoning_content==='string'?m.reasoning_content.length:0,
 toolCallCount:m.tool_calls?.length||r.tool_calls?.length||0,usage:r.usage||{},
 errors:(data.errors||[]).map(e=>({code:e.code,message:e.message}))};
 results.push(row);console.log(JSON.stringify(row));
}
fs.mkdirSync('benchmark/results/probe',{recursive:true});
fs.writeFileSync('benchmark/results/probe/qwen-response-shapes.json',JSON.stringify(results,null,2));
