/* Optional, consent-first AI review. Nothing is transmitted until the learner presses review. */
(function(){
"use strict";
let state=null,controller=null;
const TEXT={
el:{
 title:"Μικρή ανάλυση της πρότασής σου",
 summary:"Η ανάλυση εξετάζει όσα έγραψες, όχι απλώς τις επιλογές της προσομοίωσης. Δεν είναι σχολικός βαθμός.",
 privacy:"Αν πατήσεις «Ανάλυση με AI», η πρόταση και οι αποφάσεις σου θα σταλούν προσωρινά σε πάροχο AI για ανατροφοδότηση. Μη γράφεις ονόματα, σχολείο, τηλέφωνα ή προσωπικά στοιχεία. Το site δεν αποθηκεύει την πρόταση.",
 btn:"Ανάλυση της πρότασής μου με AI",retry:"Δοκίμασε ξανά",busy:"Το AI διαβάζει την πρότασή σου…",
 fail:"Η εξατομικευμένη ανάλυση δεν είναι διαθέσιμη αυτή τη στιγμή. Η προσομοίωση και η πρότασή σου παραμένουν διαθέσιμες.",
 rate:"Έφτασες προσωρινά το όριο των αιτημάτων. Δοκίμασε αργότερα.",
 sensitive:"Αφαίρεσε συνδέσμους και στοιχεία επικοινωνίας από την πρόταση πριν ζητήσεις ανάλυση.",
 tooShort:"Γράψε τουλάχιστον 30 χαρακτήρες για ουσιαστική ανατροφοδότηση.",
 evidence:"Από το κείμενό σου",next:"Δύο προτάσεις βελτίωσης",edit:"Επεξεργασία της πρότασης",
 statuses:{strong:"Τεκμηριώνεται",developing:"Χρειάζεται ανάπτυξη",missing:"Δεν φαίνεται ακόμη"},
 caution:"Το AI μπορεί να κάνει λάθη. Έλεγξε αν οι παρατηρήσεις του συμφωνούν πράγματι με όσα έγραψες."
},
en:{
 title:"A short review of your proposal",
 summary:"Feedback examines your own writing, not just the simulation choices. This is not a school grade.",
 privacy:"If you press 'Review with AI', your proposal and mission choices will be sent temporarily to an AI provider for feedback. Do not include names, school details, phone numbers or personal information. The website does not store your proposal.",
 btn:"Review my proposal with AI",retry:"Try again",busy:"AI is reviewing your proposal…",
 fail:"Personalised review is unavailable right now. Your simulation and proposal remain available.",
 rate:"You have temporarily reached the request limit. Try again later.",
 sensitive:"Remove links and contact details before requesting AI feedback.",
 tooShort:"Write at least 30 characters to get useful feedback.",
 evidence:"From your own words",next:"Two suggestions for improving your proposal",edit:"Edit your proposal",
 statuses:{strong:"Well supported",developing:"Needs detail",missing:"Not yet shown"},
 caution:"AI can make mistakes. Check whether its feedback accurately reflects what you wrote."
}};
function node(tag,cls,txt){const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;}
function add(p,n){p.appendChild(n);return n;}
function action(label,func){const b=node("button","btn main",label);b.type="button";b.addEventListener("click",func);return b;}
function clear(){
 if(controller){controller.abort();controller=null;}
 state=null;
}
function render(parent,payload){
 clear();
 const box=add(parent,node("section","review"));
 box.id="creationReview";
 box.setAttribute("aria-label",TEXT[payload.lang].title);
 state={box,payload,kind:"idle",data:null,error:null};
 paint(state);
}
function paint(current){
 if(!current||state!==current)return;
 const {box,payload,kind,data,error}=current,c=TEXT[payload.lang];
 box.replaceChildren();
 add(box,node("h3","",c.title));
 add(box,node("p","",c.summary));
 add(box,node("p","review-consent",c.privacy));
 const content=add(box,node("div","review-content"));content.setAttribute("aria-live","polite");
 if(kind==="loading"){
  add(content,node("p","review-loading",c.busy));return;
 }
 if(kind==="success"){
  add(content,node("p","review-summary",data.summary));
  const grid=add(content,node("div","review-criteria"));
  for(const item of data.criteria){
   const row=add(grid,node("div","review-criterion"));
   const head=add(row,node("div","review-criterion-head"));
   add(head,node("strong","",item.title));
   add(head,node("span","review-status review-status--"+item.status,c.statuses[item.status]||c.statuses.developing));
   add(row,node("p","",item.comment));
   if(item.evidence)add(row,node("small","review-evidence",c.evidence+": «"+item.evidence+"»"));
  }
  add(content,node("h4","",c.next));
  const list=add(content,node("ol","review-steps"));data.nextSteps.forEach(t=>add(list,node("li","",t)));
  add(content,node("p","micro-note",c.caution));
  const edit=action(c.edit,()=>{clear();payload.onEdit();});edit.className="btn sub";add(box,edit);
  return;
 }
 if(kind==="error"){
  add(content,node("p","review-error",error==="personal_details_detected"?c.sensitive:error==="review_rate_limited"?c.rate:c.fail));
 }
 const button=action(kind==="error"?c.retry:c.btn,()=>request(current));
 button.disabled=payload.plan.trim().length<30;
 add(box,button);
 if(button.disabled)add(box,node("p","micro-note",c.tooShort));
}
async function request(current){
 if(state!==current||current.kind==="loading")return;
 const body=current.payload;
 if(body.plan.trim().length<30)return;
 const ctl=new AbortController();controller=ctl;
 current.kind="loading";paint(current);
 try{
  const res=await fetch("/api/creation-review",{
   method:"POST",headers:{"Content-Type":"application/json"},
   cache:"no-store",credentials:"same-origin",
   body:JSON.stringify({missionId:body.missionId,answers:body.answers,plan:body.plan,lang:body.lang}),
   signal:ctl.signal
  });
  const data=await res.json().catch(()=>({error:"invalid_response"}));
  if(ctl.signal.aborted||state!==current)return;
  if(!res.ok||data?.kind!=="ai_feedback"||!Array.isArray(data.criteria))
   throw Object.assign(new Error("unavailable"),{code:data?.error||"review_unavailable"});
  current.data=data;current.kind="success";
 }catch(e){
  if(ctl.signal.aborted||state!==current)return;
  current.kind="error";current.error=e.code||"review_unavailable";
 }finally{
  if(controller===ctl)controller=null;
  if(state===current&&!ctl.signal.aborted)paint(current);
 }
}
window.CREATION_REVIEW_WIDGET={render,clear};
})();
