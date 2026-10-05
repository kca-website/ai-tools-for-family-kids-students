module.exports = async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'method_not_allowed'});
  res.setHeader('Cache-Control','no-store');
  const base='https://ebooks.edu.gr/ebooks/v/html/8547/4722/Arches-Oikonomikis-Theorias_G-Lykeiou-SpOikPlir_html-apli/';
  try{
    const r=await fetch(base+'index.html',{redirect:'follow'});
    const text=await r.text();
    const links=[];
    const re=/href=["']([^"']+\.html(?:#[^"']*)?)["']/gi;
    let m;
    while((m=re.exec(text))) links.push(m[1]);
    return res.status(200).json({status:r.status,ok:r.ok,links:[...new Set(links)]});
  }catch(e){return res.status(200).json({error:String(e?.message||e)})}
};
