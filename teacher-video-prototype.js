/* aitools4kids teacher video prototype */
(function(){
  "use strict";

  const q=(id)=>document.getElementById(id);
  let project=null;
  let narrationAudio=null;
  let playFrame=0;
  let playStarted=0;
  let browserSpeechActive=false;
  let puterPromise=null;
  let audioObjectUrl=null;
  let exportedBlob=null;
  let mp4ObjectUrl=null;
  let exportedMp4Blob=null;
  let subtitleObjectUrl=null;
  let previewTotalMs=0;
  let previewRunning=false;
  let ownMaterialText="";
  let projectDirty=false;

  function selectedText(id){
    const el=q(id);
    return el?.options?.[el.selectedIndex]?.textContent?.trim()||"";
  }

  function topicText(){
    const unit=q("unit");
    if(!unit) return "";
    if(unit.value==="custom") return q("customUnit")?.value.trim()||"";
    return selectedText("unit");
  }

  function styleLabel(){
    return selectedText("videoStyle")||"Καθαρό εκπαιδευτικό";
  }

  function sceneCount(){
    const sec=Number(q("videoDuration")?.value||60);
    return sec<=30?4:sec<=60?6:8;
  }

  function wordTarget(){
    const sec=Number(q("videoDuration")?.value||60);
    return sec<=30?"55–70":sec<=60?"115–135":"170–200";
  }

  function sourceMode(){return q("videoSourceMode")?.value||"curriculum";}

  function ownMaterial(){
    return (q("videoOwnMaterial")?.value||ownMaterialText||"").trim();
  }

  function buildPrompt(){
    const curriculum=(q("curriculumNote")?.innerText||"").replace(/\s+/g," ").trim();
    const context=selectedText("context");
    const grade=selectedText("grade");
    const subject=selectedText("subject");
    const topic=topicText()||"Δεν δόθηκε ακριβής ενότητα";
    const purpose=selectedText("videoPurpose");
    const style=styleLabel();
    const count=sceneCount();
    const duration=q("videoDuration")?.value||"60";
    const objective=q("objective")?.value.trim()||"Να κατανοηθεί η βασική έννοια και να συνδεθεί με ένα απλό παράδειγμα.";
    const notes=q("notes")?.value.trim()||"Καμία.";
    const mode=sourceMode();
    const own=ownMaterial();
    const ownInstruction=(q("videoOwnInstruction")?.value||"").trim();
    const ownPolicy=q("videoOwnPolicy")?.value||"exact";

    if(mode==="own"&&!own) throw new Error("Πρόσθεσε κείμενο ή φόρτωσε PDF/TXT πριν δημιουργήσεις βίντεο.");

    const sourceBlock=mode==="own"
      ?`ΠΗΓΗ ΠΕΡΙΕΧΟΜΕΝΟΥ: Υλικό που έδωσε ο εκπαιδευτικός.
Οδηγία εκπαιδευτικού: ${ownInstruction||"Μετέτρεψε το υλικό σε σαφές εκπαιδευτικό βίντεο."}
Πολιτική χρήσης: ${ownPolicy==="exact"
  ?"Κράτησε πιστά το νόημα και τα πραγματολογικά στοιχεία του υλικού. Μην προσθέσεις νέες πληροφορίες. Μπορείς μόνο να το χωρίσεις σε σκηνές και να προσθέσεις μικρές συνδετικές φράσεις."
  :"Μπορείς να βελτιώσεις τη σειρά, τη σαφήνεια και την προφορικότητα, αλλά ΜΗΝ προσθέσεις γεγονότα ή πληροφορίες που δεν υπάρχουν στο υλικό."}
ΥΛΙΚΟ ΕΚΠΑΙΔΕΥΤΙΚΟΥ:
--- ΑΡΧΗ ΥΛΙΚΟΥ ---
${own.slice(0,28000)}
--- ΤΕΛΟΣ ΥΛΙΚΟΥ ---`
      :`ΠΗΓΗ ΠΕΡΙΕΧΟΜΕΝΟΥ: Χαρτογραφημένη σχολική ύλη του aitools4kids.
Συγκεκριμένη σχολική ενότητα: ${topic}
Τεκμηρίωση/καθεστώς ύλης από το site: ${curriculum||"Χρησιμοποίησε μόνο την ακριβή ενότητα που δόθηκε και μην επινοήσεις επίσημη ύλη."}`;

    return `Δημιούργησε storyboard για σύντομο εκπαιδευτικό animated explainer στα ελληνικά.

Σχολικό πλαίσιο: ${context}
Τάξη: ${grade}
Μάθημα: ${subject}
${sourceBlock}
Σκοπός βίντεο: ${purpose}
Στόχος: ${objective}
Οπτικό ύφος: ${style}
Πρόσθετες οδηγίες: ${notes}
Στόχος διάρκειας: περίπου ${duration} δευτερόλεπτα.
Συνολική αφήγηση: περίπου ${wordTarget()} λέξεις.
Ακριβώς ${count} σκηνές.

Επέστρεψε ΜΟΝΟ έγκυρο JSON χωρίς markdown ή επεξηγήσεις, στη μορφή:
{
  "title":"σύντομος τίτλος",
  "subtitle":"μία σύντομη γραμμή",
  "learningGoal":"ένας σαφής μαθησιακός στόχος",
  "scenes":[
    {
      "title":"τίτλος σκηνής έως 7 λέξεις",
      "onscreen":"κείμενο οθόνης έως 16 λέξεις",
      "narration":"φυσική ελληνική αφήγηση",
      "symbol":"ένα σχετικό emoji",
      "visual":"σύντομη περιγραφή της κίνησης/οπτικής ιδέας χωρίς ανάγκη εξωτερικής εικόνας"
    }
  ]
}

Κανόνες:
- ${mode==="own"?"Βασίσου αποκλειστικά στο υλικό του εκπαιδευτικού.":"Μην επινοήσεις γεγονότα, τύπους, χρονολογίες ή επίσημη ύλη που δεν στηρίζονται στη δοθείσα ενότητα."}
- Η αφήγηση να είναι κατάλληλη για τη συγκεκριμένη τάξη και να ακούγεται φυσική.
- Κάθε σκηνή να έχει μία μόνο βασική ιδέα.
- Ξεκίνα με σαφή οπτικό hook και κλείσε με σύντομη ερώτηση ανάκλησης ή εφαρμογής.
- Μην αναφέρεις AI, prompts, πηγές ή τεχνικές οδηγίες μέσα στο βίντεο.
- Μην χρησιμοποιείς προσωπικά δεδομένα μαθητών.`;
  }

  function extractJson(raw){
    const text=String(raw||"").trim().replace(/^\`\`\`(?:json)?/i,"").replace(/\`\`\`$/,"").trim();
    const start=text.indexOf("{"),end=text.lastIndexOf("}");
    if(start<0||end<=start) throw new Error("Το AI δεν επέστρεψε έγκυρο storyboard.");
    const parsed=JSON.parse(text.slice(start,end+1));
    if(!Array.isArray(parsed.scenes)||parsed.scenes.length<3) throw new Error("Το storyboard δεν περιέχει αρκετές σκηνές.");
    parsed.scenes=parsed.scenes.slice(0,8).map((s,i)=>({
      title:String(s.title||`Σκηνή ${i+1}`).trim(),
      onscreen:String(s.onscreen||"").trim(),
      narration:String(s.narration||"").trim(),
      symbol:String(s.symbol||"✨").trim().slice(0,4),
      visual:String(s.visual||"Απλή κίνηση και καθαρή τυπογραφία.").trim()
    }));
    parsed.title=String(parsed.title||selectedText("subject")||"Εκπαιδευτικό βίντεο").trim();
    parsed.subtitle=String(parsed.subtitle||topicText()||"").trim();
    parsed.learningGoal=String(parsed.learningGoal||"").trim();
    return parsed;
  }

  function subtitlesEnabled(){
    return (q("videoSubtitles")?.value||"el")==="el";
  }

  function subtitleChunks(text,maxWords=9){
    const words=String(text||"").replace(/\s+/g," ").trim().split(" ").filter(Boolean);
    if(!words.length)return[];
    const chunks=[];
    let current=[];
    for(const word of words){
      current.push(word);
      const sentenceEnd=/[.!?;:]$/.test(word);
      if(current.length>=maxWords||sentenceEnd){
        chunks.push(current.join(" "));
        current=[];
      }
    }
    if(current.length)chunks.push(current.join(" "));
    if(chunks.length>1&&chunks[chunks.length-1].split(" ").length<3){
      chunks[chunks.length-2]+=" "+chunks.pop();
    }
    return chunks;
  }

  function subtitleForScene(scene,local=0){
    const chunks=subtitleChunks(scene?.narration||"");
    if(!chunks.length)return"";
    const index=Math.min(chunks.length-1,Math.floor(Math.max(0,Math.min(.999999,local))*chunks.length));
    return chunks[index];
  }

  function vttTimestamp(seconds){
    const total=Math.max(0,Number(seconds)||0);
    const h=Math.floor(total/3600);
    const m=Math.floor((total%3600)/60);
    const s=Math.floor(total%60);
    const ms=Math.floor((total-Math.floor(total))*1000);
    return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")+"."+String(ms).padStart(3,"0");
  }

  function buildVtt(){
    if(!project)return"";
    const total=previewDurationSeconds();
    const weights=sceneWeights();
    const cues=["WEBVTT",""];
    let cueNo=1;
    project.scenes.forEach((scene,i)=>{
      const chunks=subtitleChunks(scene.narration);
      if(!chunks.length)return;
      const sceneStart=weights[i].start*total;
      const sceneEnd=weights[i].end*total;
      const span=Math.max(.3,(sceneEnd-sceneStart)/chunks.length);
      chunks.forEach((chunk,j)=>{
        const start=sceneStart+j*span;
        const end=j===chunks.length-1?sceneEnd:sceneStart+(j+1)*span;
        cues.push(String(cueNo++));
        cues.push(vttTimestamp(start)+" --> "+vttTimestamp(Math.max(start+.25,end)));
        cues.push(chunk);
        cues.push("");
      });
    });
    return cues.join("\n");
  }

  function refreshVttDownload(){
    const a=q("videoVttDownload");
    if(!a)return;
    if(subtitleObjectUrl){URL.revokeObjectURL(subtitleObjectUrl);subtitleObjectUrl=null;}
    if(!project||!subtitlesEnabled()){a.hidden=true;a.removeAttribute("href");return;}
    const blob=new Blob([buildVtt()],{type:"text/vtt;charset=utf-8"});
    subtitleObjectUrl=URL.createObjectURL(blob);
    a.href=subtitleObjectUrl;
    a.download=(project.title||"ekpaideutiko-video").replace(/[^a-zA-Z0-9α-ωΑ-Ωάέήίόύώϊϋΐΰ -]/g,"").trim().replace(/\s+/g,"-")+"-subtitles.vtt";
    a.hidden=false;
  }

  function subtitleVisuals(){
    const size=q("videoSubtitleSize")?.value||"large";
    const contrast=q("videoSubtitleContrast")?.value||"high";
    const fontSize=size==="xlarge"?48:size==="normal"?30:38;
    const lineHeight=Math.round(fontSize*1.28);
    return {
      fontSize,
      lineHeight,
      maxLines:size==="xlarge"?2:2,
      background:contrast==="soft"?"rgba(11,18,32,.68)":"rgba(0,0,0,.9)"
    };
  }

  function palette(){
    const mode=q("videoStyle")?.value||"clean";
    if(mode==="younger") return {a:"#F59E0B",b:"#EC4899",c:"#FFF7ED",ink:"#31160b"};
    if(mode==="visual") return {a:"#2563EB",b:"#7C3AED",c:"#0F172A",ink:"#F8FAFC"};
    return {a:"#2E6F5E",b:"#2E6BA3",c:"#F8FAFC",ink:"#10212a"};
  }

  function rounded(ctx,x,y,w,h,r){
    const rr=Math.min(r,w/2,h/2);
    ctx.beginPath();
    ctx.moveTo(x+rr,y);
    ctx.arcTo(x+w,y,x+w,y+h,rr);
    ctx.arcTo(x+w,y+h,x,y+h,rr);
    ctx.arcTo(x,y+h,x,y,rr);
    ctx.arcTo(x,y,x+w,y,rr);
    ctx.closePath();
  }

  function wrapLines(ctx,text,maxWidth,maxLines=3){
    const words=String(text||"").split(/\s+/).filter(Boolean),lines=[];
    let line="";
    for(const word of words){
      const next=line?line+" "+word:word;
      if(ctx.measureText(next).width>maxWidth&&line){
        lines.push(line);line=word;
        if(lines.length===maxLines-1) break;
      }else line=next;
    }
    if(line&&lines.length<maxLines) lines.push(line);
    if(lines.length===maxLines&&words.join(" ").length>lines.join(" ").length){
      let last=lines[maxLines-1];
      while(last.length>2&&ctx.measureText(last+"…").width>maxWidth) last=last.slice(0,-1);
      lines[maxLines-1]=last+"…";
    }
    return lines;
  }

  function drawScene(scene,index,phase=1,local=0){
    const canvas=q("videoCanvas"); if(!canvas) return;
    const ctx=canvas.getContext("2d"),w=canvas.width,h=canvas.height,p=palette();
    ctx.clearRect(0,0,w,h);
    const grad=ctx.createLinearGradient(0,0,w,h);
    grad.addColorStop(0,p.c);
    grad.addColorStop(1,index%2?p.a+"22":p.b+"22");
    ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);

    // motion shapes
    ctx.globalAlpha=.14;
    ctx.fillStyle=index%2?p.b:p.a;
    ctx.beginPath();ctx.arc(w-110-80*phase,90+20*phase,180,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=index%2?p.a:p.b;
    rounded(ctx,40-30*(1-phase),h-170,360,120,38);ctx.fill();
    ctx.globalAlpha=1;

    const enter=Math.min(1,Math.max(0,phase*1.35));
    const offset=(1-enter)*42;
    ctx.globalAlpha=enter;

    ctx.fillStyle=p.a;
    ctx.font="800 28px system-ui, sans-serif";
    ctx.fillText(`ΣΚΗΝΗ ${index+1} / ${project?.scenes?.length||1}`,74,82);

    ctx.font="900 64px system-ui, sans-serif";
    ctx.fillStyle=p.ink;
    const titleLines=wrapLines(ctx,scene.title,w-320,2);
    titleLines.forEach((line,i)=>ctx.fillText(line,74+offset,180+i*76));

    ctx.font="600 34px system-ui, sans-serif";
    const bodyLines=wrapLines(ctx,scene.onscreen,w-430,3);
    bodyLines.forEach((line,i)=>ctx.fillText(line,78+offset,360+i*48));

    ctx.font="100px system-ui, sans-serif";
    ctx.textAlign="center";
    ctx.fillText(scene.symbol||"✨",w-185,h/2+20);
    ctx.textAlign="left";

    ctx.globalAlpha=.78;
    ctx.font="600 22px system-ui, sans-serif";
    ctx.fillStyle=p.ink;
    ctx.fillText(project?.title||"aitools4kids.gr",74,h-68);
    ctx.textAlign="right";
    ctx.fillText("aitools4kids.gr",w-72,h-68);
    ctx.textAlign="left";
    ctx.globalAlpha=1;

    if(subtitlesEnabled()){
      const subtitle=subtitleForScene(scene,local);
      if(subtitle){
        const sv=subtitleVisuals();
        ctx.font="800 "+sv.fontSize+"px system-ui, sans-serif";
        const sidePadding=sv.fontSize>=48?150:115;
        const subtitleLines=wrapLines(ctx,subtitle,w-sidePadding*2,sv.maxLines);
        const boxH=subtitleLines.length*sv.lineHeight+34;
        const boxY=h-150-boxH;
        ctx.globalAlpha=1;
        ctx.fillStyle=sv.background;
        rounded(ctx,sidePadding-22,boxY,w-(sidePadding-22)*2,boxH,20);
        ctx.fill();
        ctx.fillStyle="#FFFFFF";
        ctx.textAlign="center";
        ctx.shadowColor="rgba(0,0,0,.85)";
        ctx.shadowBlur=5;
        subtitleLines.forEach((line,i)=>ctx.fillText(line,w/2,boxY+sv.lineHeight-3+i*sv.lineHeight));
        ctx.shadowBlur=0;
        ctx.textAlign="left";
      }
    }
  }

  function invalidateExports(){
    projectDirty=true;
    ["videoDownload","videoMp4Download","videoSaveBtn"].forEach(id=>{if(q(id))q(id).hidden=true;});
    if(q("videoFilePreview")){q("videoFilePreview").hidden=true;q("videoFilePreview").removeAttribute("src");}
    refreshVttDownload();
  }

  function invalidateNarration(message=true){
    if(narrationAudio){try{narrationAudio.pause()}catch(_){}}
    narrationAudio=null;
    if(q("videoNarration")?.value==="ai"&&project){
      q("videoRefreshNarrationBtn").hidden=false;
      if(message)q("videoStatus").textContent="Η αφήγηση άλλαξε. Πάτησε «Ανανέωσε αφήγηση» πριν την τελική εξαγωγή με φωνή.";
    }
  }

  function syncPreviewAfterEdit(){
    if(!project?.scenes?.length)return;
    const total=previewDurationSeconds();
    const seconds=(Number(q("videoTimeline")?.value)||0)/1000*total;
    drawAtSeconds(seconds,total);
    invalidateExports();
  }

  function renderStoryboard(){
    const list=q("videoSceneList"); if(!list||!project) return;
    list.innerHTML=project.scenes.map((s,i)=>`
      <article class="video-scene-card video-scene-card--edit" data-scene-index="${i}">
        <div class="video-scene-card__no">${i+1}</div>
        <div>
          <div class="video-scene-fields">
            <div><label>Σύμβολο</label><input data-field="symbol" maxlength="4" value="${escapeAttr(s.symbol)}"></div>
            <div><label>Τίτλος</label><input data-field="title" maxlength="80" value="${escapeAttr(s.title)}"></div>
            <div class="video-scene-field--full"><label>Κείμενο στην οθόνη</label><textarea data-field="onscreen" maxlength="240">${escapeHtml(s.onscreen)}</textarea></div>
            <div class="video-scene-field--full"><label>Αφήγηση / υπότιτλοι</label><textarea data-field="narration" maxlength="900">${escapeHtml(s.narration)}</textarea></div>
            <div class="video-scene-field--full"><label>Οπτική / κίνηση</label><textarea data-field="visual" maxlength="320">${escapeHtml(s.visual)}</textarea></div>
          </div>
          <div class="video-scene-actions">
            <button type="button" data-action="up" title="Μετακίνηση πάνω">↑ Πάνω</button>
            <button type="button" data-action="down" title="Μετακίνηση κάτω">↓ Κάτω</button>
            <button type="button" data-action="regenerate">↻ Ξαναφτιάξε σκηνή</button>
            <button type="button" data-action="delete">🗑 Διαγραφή</button>
          </div>
        </div>
      </article>`).join("");
  }

  function escapeAttr(value){
    return escapeHtml(value).replace(/\n/g,"&#10;");
  }

  function normaliseScene(s,i=0){
    return {
      title:String(s?.title||`Σκηνή ${i+1}`).trim(),
      onscreen:String(s?.onscreen||"").trim(),
      narration:String(s?.narration||"").trim(),
      symbol:String(s?.symbol||"✨").trim().slice(0,4),
      visual:String(s?.visual||"Απλή κίνηση και καθαρή τυπογραφία.").trim()
    };
  }

  function updateSceneField(card,field,value){
    const i=Number(card?.dataset?.sceneIndex);
    if(!Number.isInteger(i)||!project?.scenes?.[i]||!["title","onscreen","narration","symbol","visual"].includes(field))return;
    project.scenes[i][field]=String(value||"");
    if(field==="narration")invalidateNarration(false);
    syncPreviewAfterEdit();
  }

  function moveScene(index,delta){
    const next=index+delta;
    if(!project||next<0||next>=project.scenes.length)return;
    const [scene]=project.scenes.splice(index,1);
    project.scenes.splice(next,0,scene);
    invalidateNarration(false);
    renderStoryboard();syncPreviewAfterEdit();
  }

  function deleteScene(index){
    if(!project||project.scenes.length<=1)return;
    project.scenes.splice(index,1);
    invalidateNarration(false);
    renderStoryboard();syncPreviewAfterEdit();
  }

  function addScene(){
    if(!project)return;
    project.scenes.push(normaliseScene({title:"Νέα σκηνή",onscreen:"",narration:"",symbol:"✨",visual:"Απλή κίνηση και καθαρή τυπογραφία."},project.scenes.length));
    invalidateNarration(false);
    renderStoryboard();syncPreviewAfterEdit();
    q("videoSceneList")?.lastElementChild?.scrollIntoView({behavior:"smooth",block:"nearest"});
  }

  function extractSingleScene(raw,index){
    const text=String(raw||"").trim().replace(/^\`\`\`(?:json)?/i,"").replace(/\`\`\`$/,"").trim();
    const start=text.indexOf("{"),end=text.lastIndexOf("}");
    if(start<0||end<=start)throw new Error("Δεν επέστρεψε έγκυρη σκηνή.");
    const parsed=JSON.parse(text.slice(start,end+1));
    return normaliseScene(parsed.scene||parsed,index);
  }

  async function regenerateScene(index,card){
    if(!project?.scenes?.[index])return;
    card?.classList.add("video-scene-regenerating");
    q("videoStatus").textContent=`Ξαναδημιουργία σκηνής ${index+1}…`;
    try{
      const context=buildPrompt();
      const current=project.scenes[index];
      const prompt=`${context}

Τώρα ξαναδημιούργησε ΜΟΝΟ τη σκηνή ${index+1}. Η τρέχουσα σκηνή είναι:
${JSON.stringify(current)}

Επέστρεψε ΜΟΝΟ JSON:
{"title":"...","onscreen":"...","narration":"...","symbol":"...","visual":"..."}
Να παραμένει συνεπής με τις προηγούμενες/επόμενες σκηνές και με την πηγή περιεχομένου.`;
      const r=await fetch("/api/teacher-assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system:"Είσαι εκπαιδευτικός video editor. Επιστρέφεις μόνο έγκυρο JSON και δεν προσθέτεις πληροφορίες έξω από την πηγή.",prompt})});
      const d=await r.json();
      if(!r.ok)throw new Error(d.message||"Αποτυχία επαναδημιουργίας.");
      project.scenes[index]=extractSingleScene(d.text,index);
      invalidateNarration(false);
      renderStoryboard();syncPreviewAfterEdit();
      q("videoRefreshNarrationBtn").hidden=q("videoNarration")?.value!=="ai";
      q("videoStatus").textContent=`Η σκηνή ${index+1} ενημερώθηκε.`;
    }catch(e){
      q("videoStatus").textContent="Δεν ολοκληρώθηκε: "+(e?.message||e);
    }finally{
      card?.classList.remove("video-scene-regenerating");
    }
  }

  function escapeHtml(value){
    return String(value||"").replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
  }

  function totalNarration(){
    return project?.scenes?.map(s=>s.narration).filter(Boolean).join(" ")||"";
  }

  async function readOwnFile(file){
    if(!file)return;
    const status=q("videoOwnFileStatus");
    status.textContent="Διαβάζω το αρχείο…";
    try{
      let text="",note="";
      if(file.type==="application/pdf"||/\.pdf$/i.test(file.name||"")){
        if(!window.AITOOLSKIDS_PDF?.read)throw new Error("Δεν φορτώθηκε ο αναγνώστης PDF.");
        const result=await window.AITOOLSKIDS_PDF.read(file,{maxBytes:15*1024*1024,maxPages:60,maxChars:28000});
        text=result.text;
        note=`${result.pagesRead}/${result.totalPages} σελίδες${result.truncated?" · το κείμενο περιορίστηκε για ασφαλή επεξεργασία":""}`;
      }else if(file.type==="text/plain"||/\.txt$/i.test(file.name||"")){
        text=(await file.text()).slice(0,28000);
        note=`${text.length.toLocaleString("el-GR")} χαρακτήρες`;
      }else throw new Error("Υποστηρίζονται PDF και TXT.");
      ownMaterialText=text;
      q("videoOwnMaterial").value=text;
      status.textContent=`✓ ${file.name} · ${note}`;
    }catch(e){
      ownMaterialText="";
      status.textContent="Δεν διαβάστηκε το αρχείο: "+(e?.message||e);
    }
  }

  async function refreshNarration(){
    if(!project)return;
    const btn=q("videoRefreshNarrationBtn");
    btn.disabled=true;
    q("videoStatus").textContent="Δημιουργώ ξανά την αφήγηση από το επεξεργασμένο storyboard…";
    try{
      await createNarration();
      btn.hidden=true;
      invalidateExports();
      q("videoStatus").textContent="Η αφήγηση ενημερώθηκε και συμφωνεί με το νέο storyboard.";
    }catch(e){
      q("videoStatus").textContent="Δεν ολοκληρώθηκε η αφήγηση: "+(e?.message||e);
    }finally{btn.disabled=false;}
  }

  function loadPuter(){
    if(window.puter) return Promise.resolve(window.puter);
    if(puterPromise) return puterPromise;
    puterPromise=new Promise((resolve,reject)=>{
      const existing=document.querySelector('script[src="https://js.puter.com/v2/"]');
      if(existing){
        existing.addEventListener("load",()=>resolve(window.puter),{once:true});
        existing.addEventListener("error",reject,{once:true});
        return;
      }
      const s=document.createElement("script");
      s.src="https://js.puter.com/v2/";
      s.onload=()=>resolve(window.puter);
      s.onerror=()=>reject(new Error("Δεν φορτώθηκε το Puter."));
      document.head.appendChild(s);
    });
    return puterPromise;
  }

  async function createNarration(){
    const mode=q("videoNarration")?.value||"ai";
    narrationAudio=null;
    if(mode!=="ai") return null;
    q("videoStatus").textContent="2/3 Δημιουργία ελληνικής αφήγησης…";
    await loadPuter();
    const text=totalNarration().slice(0,2900);
    const audio=await window.puter.ai.txt2speech(text,{
      provider:"gemini",
      model:"gemini-2.5-flash-preview-tts",
      voice:"Kore",
      instructions:"Μίλησε στα ελληνικά καθαρά, ζεστά και φυσικά, σαν εκπαιδευτικός σε τάξη. Μέτριος ρυθμός, σαφείς παύσεις."
    });
    narrationAudio=audio;
    await new Promise((resolve)=>{
      if(Number.isFinite(audio.duration)&&audio.duration>0) return resolve();
      audio.addEventListener("loadedmetadata",resolve,{once:true});
      setTimeout(resolve,2500);
    });
    return audio;
  }

  function sceneWeights(){
    const lengths=project.scenes.map(s=>Math.max(20,s.narration.length));
    const sum=lengths.reduce((a,b)=>a+b,0);
    let acc=0;
    return lengths.map(len=>{const start=acc/sum;acc+=len;return{start,end:acc/sum};});
  }

  function sceneAtFraction(frac){
    const weights=sceneWeights();
    let i=weights.findIndex(x=>frac>=x.start&&frac<x.end);
    if(i<0)i=weights.length-1;
    const range=weights[i];
    const local=(frac-range.start)/Math.max(.001,range.end-range.start);
    return {i,local};
  }

  function formatTime(seconds){
    const s=Math.max(0,Math.round(Number(seconds)||0));
    return Math.floor(s/60)+":"+String(s%60).padStart(2,"0");
  }

  function previewDurationSeconds(){
    const selected=Math.max(1,Number(q("videoDuration")?.value||60));
    const audio=Number.isFinite(narrationAudio?.duration)&&narrationAudio.duration>0?narrationAudio.duration:0;
    return Math.max(selected,audio);
  }

  function updateTimeline(currentSeconds,totalSeconds=previewDurationSeconds()){
    const current=Math.max(0,Math.min(totalSeconds,Number(currentSeconds)||0));
    const frac=totalSeconds>0?current/totalSeconds:0;
    if(q("videoTimeline")) q("videoTimeline").value=String(Math.round(frac*1000));
    if(q("videoCurrentTime")) q("videoCurrentTime").textContent=formatTime(current);
    if(q("videoTotalTime")) q("videoTotalTime").textContent=formatTime(totalSeconds);
  }

  function drawAtSeconds(seconds,totalSeconds=previewDurationSeconds()){
    if(!project)return;
    const frac=Math.min(1,Math.max(0,seconds/Math.max(.1,totalSeconds)));
    const pos=sceneAtFraction(frac>=1?0.999999:frac);
    drawScene(project.scenes[pos.i],pos.i,Math.min(1,pos.local*3),pos.local);
    updateTimeline(seconds,totalSeconds);
  }

  function stopPlayback(){
    cancelAnimationFrame(playFrame);
    previewRunning=false;
    if(narrationAudio){try{narrationAudio.pause();narrationAudio.currentTime=0}catch(_){}}
    if(window.speechSynthesis){window.speechSynthesis.cancel();}
    browserSpeechActive=false;
    if(q("videoPlayBtn"))q("videoPlayBtn").textContent="▶ Προεπισκόπηση από την αρχή";
  }

  function animateTimed(totalMs){
    const start=performance.now();
    playStarted=start;
    function tick(now){
      const frac=Math.min(1,(now-start)/totalMs);
      const pos=sceneAtFraction(frac);
      drawScene(project.scenes[pos.i],pos.i,Math.min(1,pos.local*3),pos.local);
      if(frac<1) playFrame=requestAnimationFrame(tick);
    }
    playFrame=requestAnimationFrame(tick);
  }

  function speakBrowser(){
    if(!("speechSynthesis" in window)) return false;
    window.speechSynthesis.cancel();
    browserSpeechActive=true;
    const utter=new SpeechSynthesisUtterance(totalNarration());
    utter.lang="el-GR"; utter.rate=.95; utter.pitch=1;
    const voices=window.speechSynthesis.getVoices();
    const greek=voices.find(v=>/^el/i.test(v.lang));
    if(greek)utter.voice=greek;
    utter.onend=()=>{browserSpeechActive=false;};
    window.speechSynthesis.speak(utter);
    return true;
  }

  async function play(){
    if(!project)return;
    stopPlayback();
    const totalSeconds=previewDurationSeconds();
    previewTotalMs=totalSeconds*1000;
    q("videoPlayBtn").textContent="■ Διακοπή προεπισκόπησης";
    previewRunning=true;
    updateTimeline(0,totalSeconds);

    if(narrationAudio){
      try{
        narrationAudio.currentTime=0;
        await narrationAudio.play();
      }catch(e){
        q("videoStatus").textContent="Η προεπισκόπηση συνεχίζεται χωρίς αυτόματη αναπαραγωγή ήχου. Πάτησε ξανά αν ο browser μπλόκαρε τον ήχο.";
      }
    }else if(q("videoNarration")?.value==="browser"){
      speakBrowser();
    }

    const started=performance.now();
    function tick(now){
      if(!previewRunning)return;
      const elapsed=Math.min(totalSeconds,(now-started)/1000);
      drawAtSeconds(elapsed,totalSeconds);
      if(elapsed<totalSeconds){
        playFrame=requestAnimationFrame(tick);
      }else{
        drawAtSeconds(totalSeconds,totalSeconds);
        previewRunning=false;
        q("videoPlayBtn").textContent="▶ Προεπισκόπηση από την αρχή";
        q("videoStatus").textContent="Η προεπισκόπηση ολοκληρώθηκε. Εμφανίστηκαν όλες οι σκηνές.";
      }
    }
    playFrame=requestAnimationFrame(tick);
  }

  function renderFrameForTime(ctxAudio,total){
    const frac=Math.min(1,ctxAudio/Math.max(.1,total));
    const pos=sceneAtFraction(frac>=1?0.999999:frac);
    drawScene(project.scenes[pos.i],pos.i,Math.min(1,pos.local*3),pos.local);
  }

  function supportedMime(format){
    if(!("MediaRecorder" in window))return"";
    const candidates=format==="mp4"
      ?[
        'video/mp4;codecs="avc1.424028,mp4a.40.2"',
        'video/mp4;codecs="avc1,opus"',
        'video/mp4'
      ]
      :[
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm"
      ];
    return candidates.find(type=>MediaRecorder.isTypeSupported(type))||"";
  }

  async function renderVideoBlob(format="webm"){
    if(!project)throw new Error("Δεν υπάρχει έτοιμο βίντεο.");
    if(!q("videoCanvas")?.captureStream||!("MediaRecorder" in window)){
      throw new Error("Η συσκευή δεν υποστηρίζει εξαγωγή βίντεο από browser.");
    }
    const mime=supportedMime(format);
    if(!mime){
      if(format==="mp4")throw new Error("Ο browser αυτής της συσκευής δεν υποστηρίζει απευθείας MP4. Το WebM παραμένει διαθέσιμο.");
      throw new Error("Ο browser αυτής της συσκευής δεν υποστηρίζει WebM.");
    }

    stopPlayback();
    const canvas=q("videoCanvas");
    const canvasStream=canvas.captureStream(30);
    const tracks=[...canvasStream.getVideoTracks()];
    let recordAudio=null,audioCtx=null,dest=null;

    if(narrationAudio?.src){
      recordAudio=new Audio(narrationAudio.src);
      recordAudio.crossOrigin="anonymous";
      await new Promise((resolve)=>{
        if(recordAudio.readyState>=1)return resolve();
        recordAudio.addEventListener("loadedmetadata",resolve,{once:true});
        recordAudio.load();
        setTimeout(resolve,2500);
      });
      try{
        audioCtx=new (window.AudioContext||window.webkitAudioContext)();
        dest=audioCtx.createMediaStreamDestination();
        const source=audioCtx.createMediaElementSource(recordAudio);
        source.connect(dest);
        tracks.push(...dest.stream.getAudioTracks());
      }catch(e){
        q("videoStatus").textContent="Η εξαγωγή συνεχίζεται χωρίς ήχο στη συγκεκριμένη συσκευή.";
      }
    }

    const stream=new MediaStream(tracks);
    const chunks=[];
    const rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:4500000,audioBitsPerSecond:128000});
    rec.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data)};
    const done=new Promise((resolve,reject)=>{
      rec.onstop=resolve;
      rec.onerror=e=>reject(e.error||new Error("Αποτυχία εγγραφής βίντεο."));
    });

    rec.start(250);
    const duration=previewDurationSeconds();
    const started=performance.now();

    if(recordAudio){
      try{
        await audioCtx?.resume?.();
        await recordAudio.play();
      }catch(_){}
    }

    await new Promise(resolve=>{
      function tick(now){
        // The video timeline always follows wall-clock time, not audio playback.
        // This prevents early/late narration from truncating the final scenes.
        const current=Math.min(duration,(now-started)/1000);
        renderFrameForTime(current,duration);
        if(current<duration)requestAnimationFrame(tick);
        else{renderFrameForTime(duration,duration);setTimeout(resolve,250);}
      }
      requestAnimationFrame(tick);
    });

    rec.stop();
    await done;
    stream.getTracks().forEach(t=>t.stop());
    try{recordAudio?.pause?.()}catch(_){}
    try{await audioCtx?.close?.()}catch(_){}

    return new Blob(chunks,{type:mime});
  }

  function safeVideoFilename(ext){
    return (project?.title||"ekpaideutiko-video")
      .replace(/[^a-zA-Z0-9α-ωΑ-Ωάέήίόύώϊϋΐΰ -]/g,"")
      .trim().replace(/\s+/g,"-")+"."+ext;
  }

  async function exportWebm(){
    const btn=q("videoExportBtn");
    if(!project)return;
    btn.disabled=true;
    q("videoStatus").textContent="Σύνθεση τελικού WebM…";
    try{
      const blob=await renderVideoBlob("webm");
      exportedBlob=blob;
      if(audioObjectUrl)URL.revokeObjectURL(audioObjectUrl);
      audioObjectUrl=URL.createObjectURL(blob);
      const a=q("videoDownload");
      a.href=audioObjectUrl;
      a.download=safeVideoFilename("webm");
      a.hidden=false;
      const filePreview=q("videoFilePreview");
      filePreview.src=audioObjectUrl;
      filePreview.hidden=false;
      q("videoSaveBtn").hidden=false;
      q("videoStatus").textContent="Έτοιμο WebM. Μπορείς να το δεις ολόκληρο και να το κατεβάσεις.";
    }catch(e){
      q("videoStatus").textContent=e?.message||"Δεν ολοκληρώθηκε η εξαγωγή WebM.";
    }finally{
      btn.disabled=false;
    }
  }

  async function exportMp4(){
    const btn=q("videoExportMp4Btn");
    if(!project)return;
    btn.disabled=true;
    q("videoStatus").textContent="Σύνθεση MP4… Αυτό μπορεί να χρειαστεί όσο περίπου η διάρκεια του βίντεο.";
    try{
      const blob=await renderVideoBlob("mp4");
      exportedMp4Blob=blob;
      if(mp4ObjectUrl)URL.revokeObjectURL(mp4ObjectUrl);
      mp4ObjectUrl=URL.createObjectURL(blob);
      const a=q("videoMp4Download");
      a.href=mp4ObjectUrl;
      a.download=safeVideoFilename("mp4");
      a.hidden=false;
      const filePreview=q("videoFilePreview");
      filePreview.src=mp4ObjectUrl;
      filePreview.hidden=false;
      q("videoStatus").textContent="Έτοιμο MP4. Μπορείς να το δεις και να το κατεβάσεις.";
    }catch(e){
      q("videoStatus").textContent=(e?.message||"Δεν ολοκληρώθηκε η εξαγωγή MP4.")+" Δοκίμασε WebM αν η συσκευή δεν υποστηρίζει MP4.";
    }finally{
      btn.disabled=false;
    }
  }

  async function toggleFullscreen(){
    const target=q("videoStageWrap");
    if(!target)return;
    try{
      if(document.fullscreenElement||document.webkitFullscreenElement){
        if(document.exitFullscreen)await document.exitFullscreen();
        else if(document.webkitExitFullscreen)document.webkitExitFullscreen();
        return;
      }
      if(target.requestFullscreen)await target.requestFullscreen();
      else if(target.webkitRequestFullscreen)target.webkitRequestFullscreen();
      else q("videoStatus").textContent="Η πλήρης οθόνη δεν υποστηρίζεται από αυτόν τον browser.";
    }catch(e){
      q("videoStatus").textContent="Δεν μπόρεσε να ανοίξει η πλήρης οθόνη.";
    }
  }

  async function generate(){
    const btn=q("videoCreateBtn");
    if(!btn)return;
    stopPlayback();
    btn.disabled=true;
    q("videoStudio").hidden=true;
    q("videoStatus").textContent="1/3 Δημιουργία σεναρίου και σκηνών…";
    q("generationProgress").hidden=false;
    q("generationTitle").textContent="Δημιουργείται το εκπαιδευτικό βίντεο…";
    q("generationMessage").textContent="1/3 Σενάριο και storyboard πάνω στην επιλεγμένη ύλη.";
    try{
      const videoSystem="Είσαι εκπαιδευτικός σχεδιαστής σύντομων βίντεο για ελληνικό σχολικό πλαίσιο. Ακολουθείς αυστηρά την ενότητα και το καθεστώς ύλης που δίνει ο χρήστης. Επιστρέφεις μόνο το JSON που ζητείται, χωρίς markdown.";
      const r=await fetch("/api/teacher-assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system:videoSystem,prompt:buildPrompt()})});
      const d=await r.json();
      if(!r.ok)throw new Error(d.message||"Αποτυχία δημιουργίας storyboard.");
      project=extractJson(d.text);
      projectDirty=false;
      drawScene(project.scenes[0],0,1,0);
      renderStoryboard();
      refreshVttDownload();
      q("videoRefreshNarrationBtn").hidden=true;

      q("generationMessage").textContent="2/3 Προετοιμασία αφήγησης.";
      if(q("videoNarration").value==="ai"){
        try{
          await createNarration();
          q("videoStudioHint").textContent="Το storyboard και η ελληνική AI αφήγηση είναι έτοιμα. Η εξαγωγή γίνεται τοπικά ως WebM χωρίς πρόγραμμα μοντάζ.";
        }catch(e){
          narrationAudio=null;
          q("videoRefreshNarrationBtn").hidden=false;
          q("videoStudioHint").textContent="Το storyboard είναι έτοιμο. Η AI αφήγηση δεν ενεργοποιήθηκε ("+(e?.message||"Puter")+"). Η προεπισκόπηση μπορεί να χρησιμοποιήσει τη φωνή της συσκευής αν την επιλέξεις.";
          q("videoStatus").textContent="Το βίντεο δημιουργήθηκε χωρίς AI αφήγηση. Μπορείς να το δεις τώρα.";
        }
      }
      q("videoExportBtn").hidden=false;
      q("videoExportMp4Btn").hidden=false;
      q("videoExportMp4Btn").disabled=!supportedMime("mp4");
      q("videoExportMp4Btn").title=supportedMime("mp4")?"Δημιουργία MP4 από τη συσκευή":"Ο browser δεν δηλώνει υποστήριξη εγγραφής MP4";
      q("videoDownload").hidden=true;
      q("videoMp4Download").hidden=true;
      q("videoSaveBtn").hidden=true;
      q("videoFilePreview").hidden=true;
      q("videoFilePreview").removeAttribute("src");
      q("generationMessage").textContent="3/3 Σύνθεση προεπισκόπησης.";
      q("videoStudio").hidden=false;
      updateTimeline(0,previewDurationSeconds());
      q("videoStatus").textContent=narrationAudio?"Έτοιμο για πλήρη προεπισκόπηση και εξαγωγή.":"Έτοιμο για πλήρη προεπισκόπηση και εξαγωγή χωρίς AI ήχο.";
      q("videoStudio").scrollIntoView({behavior:"smooth",block:"start"});
    }catch(e){
      q("videoStatus").textContent="Δεν ολοκληρώθηκε: "+(e?.message||e);
    }finally{
      btn.disabled=false;
      q("generationProgress").hidden=true;
    }
  }

  async function saveOrShare(){
    if(!exportedBlob||!audioObjectUrl)return;
    const filename=q("videoDownload")?.download||"ekpaideutiko-video.webm";
    try{
      const file=new File([exportedBlob],filename,{type:exportedBlob.type||"video/webm"});
      if(navigator.share&&navigator.canShare?.({files:[file]})){
        await navigator.share({files:[file],title:project?.title||"Εκπαιδευτικό βίντεο"});
        return;
      }
    }catch(e){
      if(e?.name==="AbortError")return;
    }
    const a=q("videoDownload");
    if(a){
      a.click();
      q("videoStatus").textContent="Ξεκίνησε η λήψη του αρχείου. Αν δεν εμφανιστεί στις Λήψεις, άνοιξε το WebM από το κουμπί λήψης.";
    }
  }

  function bind(){
    const btn=q("videoCreateBtn");
    if(!btn)return;
    btn.addEventListener("click",generate);
    q("videoSourceMode")?.addEventListener("change",()=>{
      const own=q("videoSourceMode").value==="own";
      q("videoOwnMaterialPanel").hidden=!own;
      if(own)q("videoOwnInstruction")?.focus();
    });
    q("videoOwnFile")?.addEventListener("change",e=>readOwnFile(e.target.files?.[0]));
    q("videoOwnMaterial")?.addEventListener("input",e=>{ownMaterialText=e.target.value.slice(0,28000);});
    q("videoOwnClearBtn")?.addEventListener("click",()=>{
      ownMaterialText="";
      q("videoOwnMaterial").value="";
      q("videoOwnInstruction").value="";
      q("videoOwnFile").value="";
      q("videoOwnFileStatus").textContent="";
    });
    q("videoSceneList")?.addEventListener("input",e=>{
      const field=e.target?.dataset?.field;
      if(field)updateSceneField(e.target.closest(".video-scene-card"),field,e.target.value);
    });
    q("videoSceneList")?.addEventListener("click",e=>{
      const button=e.target.closest("button[data-action]");if(!button)return;
      const card=button.closest(".video-scene-card"),index=Number(card?.dataset?.sceneIndex);
      if(!Number.isInteger(index))return;
      const action=button.dataset.action;
      if(action==="up")moveScene(index,-1);
      else if(action==="down")moveScene(index,1);
      else if(action==="delete")deleteScene(index);
      else if(action==="regenerate")regenerateScene(index,card);
    });
    q("videoAddSceneBtn")?.addEventListener("click",addScene);
    q("videoRefreshNarrationBtn")?.addEventListener("click",refreshNarration);
    q("videoPlayBtn")?.addEventListener("click",()=>{if(previewRunning){stopPlayback();return;}play();});
    q("videoRestartBtn")?.addEventListener("click",()=>{stopPlayback();if(project){drawScene(project.scenes[0],0,1);updateTimeline(0,previewDurationSeconds());}});
    q("videoExportBtn")?.addEventListener("click",exportWebm);
    q("videoExportMp4Btn")?.addEventListener("click",exportMp4);
    q("videoFullscreenBtn")?.addEventListener("click",toggleFullscreen);
    q("videoSaveBtn")?.addEventListener("click",saveOrShare);
    q("videoTimeline")?.addEventListener("input",()=>{
      if(!project||previewRunning)return;
      const total=previewDurationSeconds();
      const seconds=(Number(q("videoTimeline").value)||0)/1000*total;
      drawAtSeconds(seconds,total);
    });
    q("videoNarration")?.addEventListener("change",()=>{
      q("videoDownload").hidden=true;q("videoMp4Download").hidden=true;q("videoSaveBtn").hidden=true;q("videoFilePreview").hidden=true;
      q("videoRefreshNarrationBtn").hidden=!(project&&q("videoNarration").value==="ai"&&!narrationAudio);
    });
    ["videoSubtitleSize","videoSubtitleContrast"].forEach(id=>q(id)?.addEventListener("change",()=>{
      if(project)drawAtSeconds((Number(q("videoTimeline")?.value)||0)/1000*previewDurationSeconds(),previewDurationSeconds());
      q("videoDownload").hidden=true;
      q("videoMp4Download").hidden=true;
      q("videoSaveBtn").hidden=true;
      q("videoFilePreview").hidden=true;
    }));
    q("videoSubtitles")?.addEventListener("change",()=>{
      refreshVttDownload();
      q("videoDownload").hidden=true;
      q("videoMp4Download").hidden=true;
      q("videoSaveBtn").hidden=true;
      q("videoFilePreview").hidden=true;
      if(project)drawAtSeconds((Number(q("videoTimeline")?.value)||0)/1000*previewDurationSeconds(),previewDurationSeconds());
    });
  }

  window.AITOOLSKIDS_TEACHER_VIDEO={buildPrompt,extractJson,generate,play,exportWebm,exportMp4,toggleFullscreen,supportedMime,previewDurationSeconds,formatTime,buildVtt,subtitleChunks,readOwnFile,addScene,regenerateScene};

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});
  else bind();
})();
