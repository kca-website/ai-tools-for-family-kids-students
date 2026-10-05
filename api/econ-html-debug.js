const PDF=require('./official-pdf-text.js');
module.exports=async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'method_not_allowed'});
  res.setHeader('Cache-Control','no-store');
  const sourceUrl='https://ebooks.edu.gr/ebooks/v/pdf/8547/2522/22-0299-01_V1_Arches-Oikonomikis-Theorias_G-Lykeiou-Spoudon-Oikonomias-Pliroforikis_Vivlio-Mathiti/';
  const heading='2. Διεθνοποίηση της Οικονομίας';
  const out=[];
  for(let page=185;page<=191;page++){
    try{
      const r=await PDF.extractVerifiedPdfPage({sourceUrl,pdfPage:page,pdfPageEnd:page,verifiedHeading:heading,minChars:1});
      out.push({page,ok:r?.ok||false,error:r?.error||null,text:(r?.text||'').slice(0,500),chars:r?.extractedChars||0});
    }catch(e){out.push({page,error:String(e?.message||e)})}
  }
  res.status(200).json({heading,out});
};
