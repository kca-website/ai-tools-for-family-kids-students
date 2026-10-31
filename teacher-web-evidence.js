'use strict';
// Google Search grounding is invoked only after explicit teacher consent.
// An uncited AI model answer is never accepted as "web research".
const MODELS = new Set(['gemini-3.5-flash-lite','gemini-3.1-flash-lite','gemini-2.5-flash-lite']);
const LIMIT_MS = 24000, MAX_SUMMARY_CHARS = 10500;
const clamp = (text, max) => String(text || '').trim().slice(0,max);
function validUrl(url){
  try {const v=new URL(String(url));return v.protocol==='https:'&&!v.username&&!v.password&&v.hostname.includes('.');}
  catch(_){return false;}
}
async function collectTeacherWebEvidence({chapter='',subject='',grade='',context=''} = {}){
  if(!process.env.GEMINI_API_KEY)return {ok:false,status:503,message:'Η αναζήτηση δεν είναι διαθέσιμη. Πρόσθεσε δικό σου κείμενο ή PDF.'};
  const selected=String(process.env.GEMINI_PRODUCTION_MODEL || 'gemini-3.1-flash-lite');
  const model=MODELS.has(selected)?selected:'gemini-3.1-flash-lite';
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),LIMIT_MS);
  try{
    const response=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent',{
      method:'POST',
      headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMINI_API_KEY},
      body:JSON.stringify({
        systemInstruction:{parts:[{text:
          'Είσαι βοηθός αναζήτησης πηγών για Έλληνες εκπαιδευτικούς. Χρησιμοποίησε υποχρεωτικά πραγματική αναζήτηση Google Search και όχι μνήμη μοντέλου. Προτίμησε θεσμικές, πανεπιστημιακές, επιστημονικές και αξιόπιστες εκπαιδευτικές πηγές. Σύνοψε μόνο τα τεκμηριωμένα στοιχεία σε έως 800 λέξεις. Μην επινοείς αναφορές, τίτλους, κεφάλαια ή εξεταστέα ύλη. Οι διαδικτυακές πληροφορίες δεν είναι πιστοποιημένο σχολικό βιβλίο. Αν δεν βρεθούν επαρκείς πηγές, δήλωσε το ξεκάθαρα.'
        }]},
        contents:[{role:'user',parts:[{text:
          'Σχολικό πλαίσιο: '+clamp(context,100)+'\nΤάξη: '+clamp(grade,100)+'\nΜάθημα: '+clamp(subject,200)+'\nΕνότητα: '+clamp(chapter,300)+'\nΒρες πραγματικές εκπαιδευτικές διαδικτυακές πηγές ειδικά γι’ αυτό το θέμα.'
        }]}],
        tools:[{google_search:{}}],
        generationConfig:{temperature:0.1,maxOutputTokens:1900}
      }),signal:controller.signal
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok)return {ok:false,status:502,message:'Η διαδικτυακή αναζήτηση απέτυχε. Πρόσθεσε δικό σου κείμενο ή PDF.'};
    const candidate=data?.candidates?.[0]||{};
    const fullSummary=(candidate.content?.parts||[]).filter(p=>typeof p.text==='string'&&!p.thought).map(p=>p.text).join('\n').trim();
    const summary=clamp(fullSummary,MAX_SUMMARY_CHARS);
    const ground=candidate.groundingMetadata||{};
    const sources=[];
    for(const chunk of ground.groundingChunks||[]){
      const url=chunk?.web?.uri;
      if(!validUrl(url)||sources.some(x=>x.url===url))continue;
      sources.push({title:clamp(chunk.web.title||new URL(url).hostname,160),url:clamp(url,1200)});
      if(sources.length===6)break;
    }
    if(summary.length<120 || !sources.length || !Array.isArray(ground.groundingSupports) || !ground.groundingSupports.length){
      return {ok:false,status:422,message:'Η αναζήτηση δεν επέστρεψε πηγές με επαρκή τεκμηρίωση. Πρόσθεσε δικό σου κείμενο ή PDF.'};
    }
    return {ok:true,summary,sources,
      searches:(ground.webSearchQueries||[]).filter(x=>typeof x==='string').slice(0,4).map(x=>clamp(x,180)),
      searchSuggestions:clamp(ground.searchEntryPoint?.renderedContent||'',25000),
      excerptTruncated:fullSummary.length>MAX_SUMMARY_CHARS
    };
  }catch(_){return {ok:false,status:504,message:'Η διαδικτυακή αναζήτηση δεν ολοκληρώθηκε. Πρόσθεσε δικό σου κείμενο ή PDF.'};}
  finally{clearTimeout(timer);}
}
module.exports={collectTeacherWebEvidence};
