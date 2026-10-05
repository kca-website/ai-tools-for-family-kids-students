module.exports = async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'method_not_allowed'});
  res.setHeader('Cache-Control','no-store');
  const base='https://ebooks.edu.gr/ebooks/v/html/8547/4722/Arches-Oikonomikis-Theorias_G-Lykeiou-SpOikPlir_html-apli/';
  const names=['index11.html','index11_1.html','index11_2.html','index11_3.html','index.html'];
  const out=[];
  for(const name of names){
    try{
      const r=await fetch(base+name,{redirect:'follow'});
      const text=await r.text();
      out.push({name,status:r.status,ok:r.ok,finalUrl:r.url,length:text.length,sample:text.replace(/\s+/g,' ').slice(0,500)});
    }catch(e){out.push({name,error:String(e?.message||e)})}
  }
  res.status(200).json({out});
};
