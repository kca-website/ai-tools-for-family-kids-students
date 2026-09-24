module.exports = async function handler(req,res){
  const key=process.env.GROQ_API_KEY;
  if(!key) return res.status(503).json({ok:false,error:'no_key'});
  try{
    const response=await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},
      body:JSON.stringify({
        model:'openai/gpt-oss-120b',
        messages:[
          {role:'system',content:'Return a short preschool activity in Greek as JSON matching the schema.'},
          {role:'user',content:'Theme: robot. Age 4. Five minutes. Home.'}
        ],
        temperature:0.2,
        reasoning_effort:'low',
        include_reasoning:false,
        max_completion_tokens:1200,
        response_format:{
          type:'json_schema',
          json_schema:{
            name:'preschool_activity',
            strict:true,
            schema:{
              type:'object',additionalProperties:false,
              properties:{
                story:{type:'string'},words:{type:'string'},game:{type:'string'},
                make:{type:'string'},offline:{type:'string'},adultTip:{type:'string'}
              },
              required:['story','words','game','make','offline','adultTip']
            }
          }
        }
      })
    });
    const body=await response.json().catch(()=>({}));
    return res.status(response.ok?200:response.status).json({ok:response.ok,status:response.status,content:body?.choices?.[0]?.message?.content||null,error:body?.error||null});
  }catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)});}
};