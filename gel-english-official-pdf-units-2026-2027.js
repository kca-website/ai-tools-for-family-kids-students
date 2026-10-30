"use strict";
// Verified official textbook TOC page ranges. The PDF cover adds 2 pages.
// A/B 2026-27 official exam scopes are established; C' annual scope is not
// independently verified and is deliberately flagged annualScopeVerified=false.
(function(root){
const rows={"english-a-lykeiou":{"title":"Αγγλικά Γενικού Λυκείου 1","url":"https://ebooks.edu.gr/ebooks/v/pdf/8547/2628/22-0250-01_V4_Agglika-1_A-Lykeiou_Vivlio-Mathiti/","annual":true,"units":[["Unit 2: A refugee’s dreamland","A refugee",15,24],["Unit 3: On duty","On",25,36],["Unit 4: Vincent Van Gogh","Vincent van Gogh",37,50],["Unit 5: Animal rights","Animal Rights",51,66],["Unit 6: Fast fashion","Fast Fashion",67,80],["Unit 7: Pride and Prejudice","Pride and Prejudice",81,94],["Unit 8: Social media","Social Media",95,114]]},"english-b-lykeiou":{"title":"Αγγλικά Γενικού Λυκείου 2","url":"https://ebooks.edu.gr/ebooks/v/pdf/8547/2630/22-0251-01_V3_Agglika-2_B-G-Lykeiou_Vivlio-Mathiti/","annual":true,"units":[["Unit 2: Do we all live in the same world?","Do we all live in the same world",15,34],["Unit 3: Renaissance arts and artists","Renaissance arts",35,52],["Unit 4: Learning to fly","Learning to fly",53,66],["Unit 5: Addictions","Addictions",67,82]]},"english-g-lykeiou":{"title":"Αγγλικά Γενικού Λυκείου 2","url":"https://ebooks.edu.gr/ebooks/v/pdf/8547/2630/22-0251-01_V3_Agglika-2_B-G-Lykeiou_Vivlio-Mathiti/","annual":false,"units":[["Unit 6: Leaders. Born or made?","Leaders",83,102],["Unit 7: Human Rights","Human Rights",103,116],["Unit 8: Book burning","Book burning",117,142],["Unit 9: The Merchant of Venice","The Merchant of Venice",143,148]]}};
function labels(id){return (rows[id]?.units||[]).map(x=>x[0])}
function pdfFor(subjectId,topic){
 const row=rows[subjectId],t=row?.units.find(x=>x[0]===String(topic||"").trim());
 if(!t)return null;
 return {subjectId,label:t[0],heading:t[1],pdfPage:t[2],pdfPageEnd:t[3],
  title:row.title,viewUrl:row.url,downloadUrl:row.url.replace("/v/pdf/","/d/").replace(/\/$/,".pdf"),
  annualScopeVerified:row.annual,curriculumSource:"https://www.iep.edu.gr/yli-kai-odigies-didaskalias-genikou-lykeiou-gia-to-scholiko-etos-2026-2027/"};
}
const api=Object.freeze({schoolYear:"2026-2027",subjects:rows,labels,pdfFor,
 topics(id){return labels(id).map((label,i)=>({id:id+".official-"+(i+1),labelEl:label,labelEn:label,sourceType:"official-book-section-pdf"}))}});
if(root)root.AITOOLSKIDS_GEL_ENGLISH_OFFICIAL_PDF=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
