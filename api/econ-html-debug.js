module.exports = async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'method_not_allowed'});
  res.setHeader('Cache-Control','no-store');
  const base='https://ebooks.edu.gr/ebooks/v/html/8547/4722/Arches-Oikonomikis-Theorias_G-Lykeiou-SpOikPlir_html-apli/';
  try{
    const r=await fetch(base+'index.html',{redirect:'follow'});
    const text=await r.text();
    const tokens=[...new Set((text.match(/[A-Za-z0-9_./-]+\.html(?:#[A-Za-z0-9_:-]+)?/g)||[]))];
    const lower=text.toLowerCase();
    const needles=['διεθν','κεφαλαιο ενδεκατο','index11','index10','index9'];
    const snippets={};
    for(const needle of needles){
      const i=lower.indexOf(needle.toLowerCase());
      snippets[needle]=i>=0?text.slice(Math.max(0,i-300),Math.min(text.length,i+900)).replace(/\s+/g,' '):null;
    }
    return res.status(200).json({status:r.status,ok:r.ok,tokens,snippets});
  }catch(e){return res.status(200).json({error:String(e?.message||e)})}
};
