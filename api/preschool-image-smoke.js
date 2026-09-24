module.exports = async function handler(req,res){
  const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
  const token=process.env.CLOUDFLARE_AI_TOKEN;
  const url='https://api.cloudflare.com/client/v4/accounts/'+encodeURIComponent(accountId)+'/ai/run/@cf/black-forest-labs/flux-1-schnell';
  try{
    const r=await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({prompt:'A friendly colorful toy robot, preschool picture book illustration, no text'})});
    const text=await r.text();
    let body; try{body=JSON.parse(text)}catch{body={raw:text.slice(0,500)}}
    return res.status(200).json({httpStatus:r.status,ok:r.ok,success:body?.success,errors:body?.errors||body?.error||null,hasImage:!!body?.result?.image,resultKeys:body?.result?Object.keys(body.result):[]});
  }catch(e){return res.status(200).json({httpStatus:0,ok:false,error:String(e?.message||e)});}
};