/* Creation Missions pilot — deterministic educational simulation, no API calls or persistence. */
(function(){
"use strict";
const missions=window.CREATION_MISSIONS;
if(!Array.isArray(missions)||!missions.length||!document.getElementById("mission"))return;
const $=id=>document.getElementById(id);
const p=(el,en)=>({el,en});
const UI={
  el:{
    choose:"Διάλεξε μια αποστολή",chooseSub:"Τέσσερις διαφορετικές προκλήσεις. Σκέψου, αποφάσισε, παρατήρησε τι αλλάζει και ξαναδοκίμασε.",age:"Ηλικίες",budget:"Εικονικός προϋπολογισμός",progress:"Πρόοδος",goal:"Αποστολή",pills:["4 αποστολές","Χωρίς λογαριασμό","Μαθαίνω από τις συνέπειες"],sketch:["Σκέφτομαι","Σχεδιάζω","Δοκιμάζω","Εξηγώ"],intro:"Η πρόκληση",introTitle:"Θα δοκιμάσεις τη δική σου λύση",introMentor:"Πριν ξεκινήσεις, σκέψου: πώς θα αποφασίσεις χωρίς να μαντεύεις;",start:"Ξεκίνα την αποστολή",stage:"Απόφαση",of:"από",select:"Τι επιλέγεις;",cost:"Κόστος",unaffordable:"Δεν επαρκεί ο προϋπολογισμός",remaining:"Υπόλοιπο",benefit:"Τι πέτυχε",risk:"Τι δεν πέτυχε",reason:"Γιατί συνέβη",improve:"Πώς θα μπορούσε να βελτιωθεί",consequences:"Η συνέπεια της επιλογής σου",basedOn:"Σύνδεση με προηγούμενη απόφαση",evidenceWarning:"Το αρχικό σου σχέδιο στηρίχθηκε σε λίγα στοιχεία. Μια νέα απόφαση μπορεί να έχει απρόβλεπτα αποτελέσματα.",inclusionWarning:"Η προηγούμενη επιλογή δυσκόλεψε τη συμμετοχή κάποιων ανθρώπων. Έλεγξε αν η επόμενη το διορθώνει.",mentor:"Βοηθός σκέψης",mentorDesc:"Καθοδηγούμενη συζήτηση με ελεγμένες απαντήσεις. Δεν είναι ζωντανό AI.",askLabel:"Γράψε μια ερώτηση για την επιλογή σου",askPlace:"Γιατί δεν πέτυχε; Πώς μπορώ να το βελτιώσω;",ask:"Ρώτησε",quick:["Γιατί;","Τι πήγε καλά;","Τι δεν πήγε καλά;","Πώς το βελτιώνω;"],initialCoach:"Διάλεξε μια απόφαση για να μπορέσουμε να συζητήσουμε τις συνέπειες.",fallbackCoach:"Μπορώ να εξηγήσω την επιλογή που έκανες. Δοκίμασε να ρωτήσεις «Γιατί;», «Τι δεν πέτυχε;» ή «Πώς το βελτιώνω;».",mic:"Μίλα",stopMic:"Σταμάτα",micMissing:"Η φωνητική υπαγόρευση δεν υποστηρίζεται από αυτόν τον browser. Μπορείς να πληκτρολογήσεις.",micPrivacy:"Το μικρόφωνο είναι προαιρετικό. Ο browser μπορεί να στείλει τη φωνή στον δικό του πάροχο για αναγνώριση· το AI Tools 4 Kids δεν αποθηκεύει ηχογράφηση.",micError:"Δεν ήταν δυνατή η αναγνώριση φωνής. Δοκίμασε πληκτρολόγηση ή έλεγξε τα δικαιώματα μικροφώνου.",micListening:"Ακούω… μίλησε και μετά πάτησε «Σταμάτα».",micReady:"Η υπαγόρευση ολοκληρώθηκε. Έλεγξε το κείμενο πριν το στείλεις.",back:"Πίσω",next:"Συνέχεια",pitchTitle:"Παρουσίασε το σχέδιό σου",pitchDesc:"Γράψε με δικά σου λόγια ποιο πρόβλημα λύνεις, ποιους βοηθάς, ποια δυσκολία αντιμετώπισες και πώς θα ελέγξεις αν πέτυχε.",pitchPlace:"Προτείνω… Επέλεξα αυτή τη λύση επειδή… Μια δυσκολία είναι… Θα ελέγξω…",pitchNote:"Ελάχιστο 20 χαρακτήρες. Δεν βαθμολογείται η ορθογραφία.",pitchPoints:["Ποιο πρόβλημα λύνεις;","Γιατί διάλεξες αυτή τη λύση;","Πώς θα ελέγξεις αν λειτουργεί;"],finish:"Δες το αποτέλεσμα",result:"Τι έμαθες από τις αποφάσεις σου;",resultOk:"Η λύση σου έχει δυνατά σημεία",resultInclusion:"Η λύση χρειάζεται καλύτερη πρόσβαση για όλους",resultEvidence:"Χρειάζεσαι περισσότερα στοιχεία πριν αποφασίσεις",resultBalanced:"Έκανες επιλογές που αξίζει να δοκιμαστούν",resultExplain:"Το αποτέλεσμα είναι ενδεικτικό και αφορά το φανταστικό σενάριο. Δεν είναι βαθμός ή πραγματική πρόβλεψη.",meters:["Λειτουργικότητα","Χρήσιμο αποτέλεσμα","Συμμετοχή όλων","Τεκμηρίωση"],metricNote:"Οι δείκτες ενημερώνονται από τις επιλεγμένες ενέργειες. Δεν μετρούν την αξία του μαθητή.",history:"Τι συνέβη σε κάθε απόφαση",myPitch:"Η δική σου πρόταση",reflectTitle:"Επόμενη σκέψη",reflect:"Ποιος θα μπορούσε να διαφωνήσει με το σχέδιο και ποια δοκιμή θα έκανε τη λύση σου πιο αξιόπιστη;",tryAgain:"Ξαναδοκίμασε άλλες επιλογές",print:"Εκτύπωση",privacy:"Οι επιλογές και τα κείμενα δεν αποστέλλονται στο site ούτε αποθηκεύονται. Η καθοδήγηση είναι προσχεδιασμένη, όχι ζωντανό AI.",policy:"Πολιτική απορρήτου",nextMission:"Άλλη αποστολή"
  },
  en:{
    choose:"Choose a creation mission",chooseSub:"Four different challenges. Think, decide, see what changes, then try again.",age:"Ages",budget:"Imaginary budget",progress:"Progress",goal:"Mission",pills:["4 missions","No account","Learn from consequences"],sketch:["Think","Design","Test","Explain"],intro:"Your challenge",introTitle:"Try out your own solution",introMentor:"Before you start, how can you decide without just guessing?",start:"Start mission",stage:"Decision",of:"of",select:"What will you choose?",cost:"Cost",unaffordable:"Not enough budget",remaining:"Remaining",benefit:"What worked",risk:"What did not work",reason:"Why it happened",improve:"How to improve it",consequences:"Consequences of your choice",basedOn:"Linked to your earlier decision",evidenceWarning:"Your earlier plan relied on limited evidence. New choices may have unexpected results.",inclusionWarning:"Your earlier choice made participation harder for some people. Check whether your next step fixes that.",mentor:"Thinking coach",mentorDesc:"Guided conversation with prewritten responses, not live AI.",askLabel:"Ask about your decision",askPlace:"Why did it fail? How could I improve it?",ask:"Ask",quick:["Why?","What worked?","What didn't work?","How can I improve it?"],initialCoach:"Pick an action first, then we can discuss its consequences.",fallbackCoach:"I can explain the decision you made. Try asking 'Why?', 'What didn't work?' or 'How can I improve it?'.",mic:"Speak",stopMic:"Stop",micMissing:"Speech recognition is unavailable in this browser. You can type instead.",micPrivacy:"The microphone is optional. Your browser may send voice to its speech recognition provider; AI Tools 4 Kids does not store recordings.",micError:"Speech recognition did not work. Type instead or check microphone permissions.",micListening:"Listening… speak, then press 'Stop'.",micReady:"Dictation completed. Check the text before sending.",back:"Back",next:"Continue",pitchTitle:"Present your plan",pitchDesc:"Explain in your own words the problem, who benefits, what did not work and how you will check whether the solution works.",pitchPlace:"I propose… I chose it because… A challenge was… I will check…",pitchNote:"At least 20 characters. Spelling is not graded.",pitchPoints:["What problem are you solving?","Why this solution?","How will you test it?"],finish:"See outcome",result:"What did you learn from your choices?",resultOk:"Your idea has strong points",resultInclusion:"Your plan needs to include more people",resultEvidence:"You need stronger evidence",resultBalanced:"You made choices worth testing",resultExplain:"This outcome is illustrative and applies only to the fictional scenario. It is not a grade or a real-world prediction.",meters:["Practicality","Useful outcome","Inclusive access","Evidence"],metricNote:"Indicators change based on decisions. They do not measure student worth.",history:"What happened after each decision",myPitch:"Your proposal",reflectTitle:"Think further",reflect:"Who might disagree with your plan, and what test would make it more reliable?",tryAgain:"Try different decisions",print:"Print",privacy:"Your choices and text are not sent to the website or stored. Guidance is scripted, not live AI.",policy:"Privacy policy",nextMission:"Another mission"
  }
};
let language="el",active=missions[0],step=0,answers=[null,null,null],pitch="",chats={},recognizer=null,recognizerButton=null,recognizerStatus=null;
const copy=()=>UI[language],tr=pair=>pair?.[language]||pair?.el||"";
const euro=n=>n.toLocaleString(language==="el"?"el-GR":"en-GB")+" €";
function el(tag,cls,txt){const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x;}
function add(parent,child){parent.appendChild(child);return child;}
function button(label,cls,fn){const b=el("button",cls,label);b.type="button";b.addEventListener("click",fn);return b;}
function spent(limit=3){let total=0;for(let i=0;i<limit;i++)if(answers[i]!==null)total+=active.steps[i].options[answers[i]].cost;return total;}
function values(limit=3){const n=[1,1,1,1];for(let i=0;i<limit;i++)if(answers[i]!==null)active.steps[i].options[answers[i]].effect.forEach((v,k)=>{n[k]=Math.max(0,Math.min(5,n[k]+v));});return n;}
function stopMic(){if(recognizer){try{recognizer.stop();}catch(_){}recognizer=null;}if(recognizerButton){recognizerButton.textContent=copy().mic;recognizerButton.setAttribute("aria-pressed","false");}recognizerButton=null;recognizerStatus=null;}
function attachMic(input,parent){
 const c=copy(),Speech=window.SpeechRecognition||window.webkitSpeechRecognition,wrap=el("div","mic-row");
 const status=add(wrap,el("small","mic-status",Speech?c.micPrivacy:c.micMissing));
 const btn=button("🎙 "+c.mic,"btn mic",function(){
  if(recognizer){stopMic();return;}
  if(!Speech)return;
  const r=new Speech();r.lang=language==="el"?"el-GR":"en-US";r.interimResults=false;r.continuous=false;r.maxAlternatives=1;
  recognizer=r;recognizerButton=btn;recognizerStatus=status;btn.textContent="■ "+c.stopMic;btn.setAttribute("aria-pressed","true");status.textContent=c.micListening;
  r.onresult=function(event){const transcript=Array.from(event.results).map(x=>x[0]?.transcript||"").join(" ").trim();if(!transcript)return;const start=input.selectionStart??input.value.length;const end=input.selectionEnd??start;const prefix=input.value.slice(0,start);const suffix=input.value.slice(end);input.value=(prefix+(prefix&&!/\s$/.test(prefix)?" ":"")+transcript+" "+suffix).slice(0,input.maxLength>0?input.maxLength:1000);input.dispatchEvent(new Event("input",{bubbles:true}));status.textContent=c.micReady;};
  r.onerror=function(){status.textContent=c.micError;};
  r.onend=function(){if(recognizer===r){recognizer=null;recognizerButton=null;recognizerStatus=null;btn.textContent="🎙 "+c.mic;btn.setAttribute("aria-pressed","false");}};
  try{r.start();}catch(_){status.textContent=c.micError;stopMic();}
 });
 btn.disabled=!Speech;
 if(!Speech)btn.title=c.micMissing;
 btn.setAttribute("aria-pressed","false");
 wrap.appendChild(btn);parent.appendChild(wrap);
}
function missionCard(){
 let picker=$("missionPicker");
 if(!picker){picker=el("section","mission-picker");picker.id="missionPicker";picker.setAttribute("aria-labelledby","missionPickerTitle");document.querySelector(".work").insertBefore(picker,document.querySelector(".stats"));}
 picker.replaceChildren();
 add(picker,el("h2","",copy().choose)).id="missionPickerTitle";
 add(picker,el("p","muted",copy().chooseSub));
 const grid=add(picker,el("div","mission-grid"));
 missions.forEach(m=>{
  const selected=m.id===active.id;
  const b=button("","mission-tile",()=>chooseMission(m.id));b.setAttribute("aria-pressed",String(selected));
  add(b,el("span","mission-icon",m.symbol));
  const text=add(b,el("span","mission-tile__copy"));add(text,el("strong","",tr(m.title)));add(text,el("small","",tr(m.summary)));
  add(b,el("span","mission-age",copy().age+" "+m.ages));
  add(grid,b);
 });
}
function setupPage(){
 const c=copy();document.documentElement.lang=language;
 document.title=(language==="el"?"Αποστολές Δημιουργίας":"Creation Missions")+" | AI Tools 4 Kids";
 $("pilot").textContent=language==="el"?"Πιλοτικό εργαστήριο · 4 αποστολές":"Pilot studio · 4 missions";
 $("heroTitle").textContent=language==="el"?"Σκέψου. Δημιούργησε. Δοκίμασε.":"Think. Create. Test.";
 $("heroText").textContent=language==="el"?"Αντιμετώπισε πραγματικές προκλήσεις, δες τις συνέπειες των αποφάσεών σου και εξήγησε πώς θα βελτίωνες τη λύση σου.":"Face realistic challenges, see the consequences of your decisions and explain how you would improve your solution.";
 for(let i=0;i<3;i++)$("pill"+i).textContent=c.pills[i];
 for(let j=0;j<4;j++)$("sk"+j).textContent=c.sketch[j];
 $("budgetLabel").textContent=c.budget;$("stageLabel").textContent=c.progress;$("goalLabel").textContent=c.goal;
 $("privacy").textContent=c.privacy;$("policy").textContent=c.policy;
 $("el").setAttribute("aria-pressed",String(language==="el"));
 $("en").setAttribute("aria-pressed",String(language==="en"));
 missionCard();
}
function chooseMission(id){
 const chosen=missions.find(x=>x.id===id);if(!chosen)return;
 stopMic();active=chosen;step=0;answers=[null,null,null];pitch="";chats={};
 try{const u=new URL(location.href);u.searchParams.set("mission",id);history.replaceState(null,"",u.pathname+u.search+u.hash);}catch(_){}
 render(true);
}
function shell(tag,title,description){
 const host=$("mission");host.replaceChildren();
 const head=add(host,el("div","sheet-head"));add(head,el("div","eyebrow",tag));
 const titleEl=add(head,el("h2","",title));titleEl.id="stepHeading";
 add(head,el("p","",description));
 return add(host,el("div","sheet-body"));
}
function hint(parent,prompt){
 const wrap=add(parent,el("div","mentor"));add(wrap,el("span","", "✦"));
 const body=add(wrap,el("div"));add(body,el("strong","",copy().mentor));add(body,el("p","",prompt));
}
function controls(parent,back,next,allowed=true,label=copy().next){
 const row=add(parent,el("div","actions"));add(row,button(copy().back,"btn sub",back));
 const forward=add(row,button(label,"btn main",next));forward.disabled=!allowed;
 return forward;
}
function metricGrid(parent,n){
 const grid=add(parent,el("div","meter-grid"));
 n.forEach((v,i)=>{
  const m=add(grid,el("div","meter"));const name=add(m,el("div","meter-title"));
  add(name,el("span","",copy().meters[i]));add(name,el("span","",v+" / 5"));
  const bar=add(m,el("div","meter-bar"));const inner=add(bar,el("div"));inner.style.width=(v*20)+"%";
 });
}
function consequences(parent,option,heading){
 const c=copy(),outer=add(parent,el("div","consequence"));
 add(outer,el("h3","",heading||c.consequences));
 const fields=[["benefit",c.benefit],["risk",c.risk],["reason",c.reason],["improve",c.improve]];
 fields.forEach(([type,label],i)=>{
  const line=add(outer,el("div","consequence-row "+type));
  add(line,el("b","",label));add(line,el("p","",option.outcome[language][i]));
 });
 return outer;
}
function chatResponse(question,choice){
 const c=copy();if(!choice)return c.initialCoach;
 const outcome=choice.outcome[language],q=question.toLocaleLowerCase(language==="el"?"el-GR":"en");
 if(/γιατ|αιτ|λόγ|why|reason/.test(q))return outcome[2];
 if(/πέτυχ|καλ|όφελ|worked|good|success/.test(q))return outcome[0];
 if(/απέτυχ|δεν |λάθ|κίνδ|problem|fail|wrong|risk|didn/.test(q))return outcome[1]+" "+outcome[2];
 if(/βελτι|διορθ|άλλ|επόμε|πώς|how|improv|fix|next/.test(q))return outcome[3];
 return c.fallbackCoach;
}
function chat(parent,choice){
 const c=copy();const box=add(parent,el("section","chat"));
 const header=add(box,el("div","chat-heading"));add(header,el("h3","",c.mentor));add(header,el("small","",c.mentorDesc));
 const log=add(box,el("div","chat-log"));log.setAttribute("role","log");log.setAttribute("aria-live","polite");log.setAttribute("aria-relevant","additions");
 const key=active.id+":"+step+":"+(answers[step-1]??"none");
 if(!chats[key])chats[key]=[];
 function line(type,txt){const m=add(log,el("div","chat-msg "+type));add(m,el("b","",type==="assistant"?c.mentor:(language==="el"?"Εσύ":"You")));add(m,el("p","",txt));}
 line("assistant",choice?choice.outcome[language][2]:c.initialCoach);
 chats[key].forEach(msg=>line(msg.role,msg.text));
 const quick=add(box,el("div","chat-quick"));
 c.quick.forEach(text=>add(quick,button(text,"chat-chip",()=>send(text))));
 const label=add(box,el("label","chat-label",c.askLabel));const input=el("textarea","chat-input");input.id="chatInput";input.rows=2;input.maxLength=350;input.placeholder=c.askPlace;label.htmlFor=input.id;box.appendChild(input);
 const controls=add(box,el("div","chat-controls"));
 attachMic(input,controls);
 add(controls,button(c.ask,"btn main",()=>{send(input.value);input.value="";}));
 function send(raw){
  const value=raw.trim();if(!value)return;
  const answer=chatResponse(value,choice);
  chats[key].push({role:"student",text:value},{role:"assistant",text:answer});
  line("student",value);line("assistant",answer);log.scrollTop=log.scrollHeight;
 }
}
function renderIntroduction(){
 const c=copy();const body=shell(c.intro,tr(active.title),tr(active.problem));
 hint(body,c.introMentor);
 add(body,el("p","soft-note",language==="el"?"Δοκιμαστική προσομοίωση. Οι αριθμοί και οι συνέπειες είναι υποθετικά παραδείγματα, όχι πραγματικές επιχειρηματικές προβλέψεις.":"Pilot simulation. Numbers and consequences are hypothetical examples, not real-world business predictions."));
 add(body,button(c.start,"btn main",()=>go(1)));
}
function renderDecision(){
 const c=copy(),i=step-1,stage=active.steps[i],budget=active.budget-spent(i);
 const desc=(i===2?tr(active.surprise)+" ":"")+tr(stage.prompt);
 const body=shell(c.stage+" "+step+" "+c.of+" 4",tr(stage.title),desc);
 if(i>0&&values(i)[3]<=1)add(body,el("div","linked-warning",c.basedOn+": "+c.evidenceWarning));
 if(i>1&&values(i)[2]<=1)add(body,el("div","linked-warning",c.basedOn+": "+c.inclusionWarning));
 add(body,el("strong","",c.select));
 const options=add(body,el("div","options"));
 stage.options.forEach((o,j)=>{
   const b=button("","option",()=>{
    stopMic();
    answers[i]=j;for(let k=i+1;k<3;k++)answers[k]=null;
    pitch="";chats={};render(false);$("choice"+j).focus();
   });
   b.id="choice"+j;b.disabled=o.cost>budget;b.setAttribute("aria-pressed",String(answers[i]===j));
   const row=add(b,el("span","option-title"));add(row,el("strong","",tr(o.title)));add(row,el("span","price",euro(o.cost)));
   add(b,el("small","",b.disabled?c.unaffordable:c.cost+": "+euro(o.cost)));
   options.appendChild(b);
 });
 const selected=answers[i]===null?null:stage.options[answers[i]];
 if(selected){
  consequences(body,selected);
  metricGrid(body,values(i+1));
  add(body,el("p","micro-note",c.metricNote));
 }
 chat(body,selected);
 controls(body,()=>go(step-1),()=>{if(selected)go(step+1);},!!selected);
}
function renderPitch(){
 const c=copy(),body=shell(c.stage+" 4 "+c.of+" 4",c.pitchTitle,c.pitchDesc);
 const checks=add(body,el("div","checks"));c.pitchPoints.forEach((t,i)=>{const x=add(checks,el("div"));add(x,el("b","",String(i+1)));add(x,el("small","",t));});
 const label=add(body,el("label","input-label",c.pitchTitle));label.htmlFor="pitch";
 const field=add(body,el("textarea","entry"));field.id="pitch";field.maxLength=1000;field.value=pitch;field.placeholder=c.pitchPlace;
 const meta=add(body,el("div","entry-meta"));meta.id="pitchHelp";add(meta,el("span","",c.pitchNote));const count=add(meta,el("span","",pitch.length+" / 1000"));field.setAttribute("aria-describedby","pitchHelp");
 const mic=add(body,el("div","pitch-mic"));attachMic(field,mic);
 const next=controls(body,()=>{pitch=field.value;go(3);},()=>{if(pitch.trim().length>=20)go(5);},pitch.trim().length>=20,c.finish);
 field.addEventListener("input",()=>{pitch=field.value;count.textContent=pitch.length+" / 1000";next.disabled=pitch.trim().length<20;});
}
function renderResult(){
 const c=copy(),v=values(),title=v[2]<=1?c.resultInclusion:v[3]<=1?c.resultEvidence:v[0]>=3&&v[1]>=3?c.resultBalanced:c.resultOk;
 const body=shell(c.result,title,c.resultExplain);
 metricGrid(body,v);
 add(body,el("p","micro-note",c.metricNote));
 const recap=add(body,el("div","report"));add(recap,el("h3","",c.history));
 active.steps.forEach((s,i)=>{
  const choice=s.options[answers[i]];if(!choice)return;
  const row=add(recap,el("div","recap-line"));add(row,el("b","",String(i+1)+". "+tr(choice.title)+" · "+euro(choice.cost)));
  add(row,el("p","",c.benefit+": "+choice.outcome[language][0]));
  add(row,el("p","",c.risk+": "+choice.outcome[language][1]));
  add(row,el("p","",c.reason+": "+choice.outcome[language][2]));
 });
 add(recap,el("strong","",c.remaining+": "+euro(active.budget-spent())));
 const userPitch=add(body,el("div","report"));add(userPitch,el("h3","",c.myPitch));add(userPitch,el("p","proposal",pitch));
 const reflection=add(body,el("div","outcome"));add(reflection,el("strong","",c.reflectTitle));add(reflection,el("p","",c.reflect));
 const row=add(body,el("div","actions"));
 add(row,button(c.tryAgain,"btn sub",()=>{answers=[null,null,null];pitch="";chats={};go(0);}));
 add(row,button(c.print,"btn main",()=>window.print()));
 add(row,button(c.nextMission,"btn sub",()=>{const i=missions.indexOf(active);chooseMission(missions[(i+1)%missions.length].id);}));
}
function go(n){stopMic();step=n;render(true);}
function render(focus){
 stopMic();setupPage();
 $("budgetValue").textContent=euro(active.budget-spent());
 $("stageValue").textContent=Math.max(0,Math.min(4,step-1))+" / 4";
 $("goalValue").textContent=tr(active.title);
 const progress=Math.max(0,Math.min(4,step-1));
 $("fill").style.width=(progress*25)+"%";
 $("progress").setAttribute("aria-valuenow",String(progress));
 $("progress").setAttribute("aria-label",copy().progress);
 if(step===0)renderIntroduction();
 else if(step<=3)renderDecision();
 else if(step===4)renderPitch();
 else renderResult();
 if(focus){const heading=$("stepHeading");heading.tabIndex=-1;heading.focus({preventScroll:true});$("mission").scrollIntoView({block:"start",behavior:"auto"});}
}
$("el").addEventListener("click",()=>{if(language==="el")return;language="el";render(false);});
$("en").addEventListener("click",()=>{if(language==="en")return;language="en";render(false);});
try{const param=new URLSearchParams(location.search).get("mission");const match=missions.find(m=>m.id===param);if(match)active=match;}catch(_){}
window.addEventListener("pagehide",stopMic);
render(false);
})();
