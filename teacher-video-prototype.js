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
  let previewTotalMs=0;
  let previewRunning=false;

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
    return `Δημιούργησε storyboard για σύντομο εκπαιδευτικό animated explainer στα ελληνικά.

Σχολικό πλαίσιο: ${context}
Τάξη: ${grade}
Μάθημα: ${subject}
Συγκεκριμένη σχολική ενότητα: ${topic}
Τεκμηρίωση/καθεστώς ύλης από το site: ${curriculum||"Χρησιμοποίησε μόνο την ακριβή ενότητα που δόθηκε και μην επινοήσεις επίσημη ύλη."}
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
- Μην επινοήσεις γεγονότα, τύπους, χρονολογίες ή επίσημη ύλη που δεν στηρίζονται στη δοθείσα ενότητα.
- Η αφήγηση να είναι κατάλληλη για τη συγκεκριμένη τάξη και να ακούγεται φυσική, όχι σαν σχολικό εγχειρίδιο.
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

  function drawScene(scene,index,phase=1){
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
  }

  function renderStoryboard(){
    const list=q("videoSceneList"); if(!list||!project) return;
    list.innerHTML=project.scenes.map((s,i)=>`
      <article class="video-scene-card">
        <div class="video-scene-card__no">${i+1}</div>
        <div><h4>${escapeHtml(s.symbol+" "+s.title)}</h4>
        <p><strong>Οθόνη:</strong> ${escapeHtml(s.onscreen)}</p>
        <p><strong>Αφήγηση:</strong> ${escapeHtml(s.narration)}</p>
        <p><strong>Κίνηση:</strong> ${escapeHtml(s.visual)}</p></div>
      </article>`).join("");
  }

  function escapeHtml(value){
    return String(value||"").replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
  }

  function totalNarration(){
    return project?.scenes?.map(s=>s.narration).filter(Boolean).join(" ")||"";
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
    drawScene(project.scenes[pos.i],pos.i,Math.min(1,pos.local*3));
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
      drawScene(project.scenes[pos.i],pos.i,Math.min(1,pos.local*3));
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
    drawScene(project.scenes[pos.i],pos.i,Math.min(1,pos.local*3));
  }

  async function exportWebm(){
    if(!project)return;
    if(!("MediaRecorder" in window)||!q("videoCanvas")?.captureStream){
      q("videoStatus").textContent="Η συσκευή δεν υποστηρίζει εξαγωγή WebM από browser.";
      return;
    }
    stopPlayback();
    q("videoStatus").textContent="3/3 Σύνθεση τελικού WebM…";
    q("videoExportBtn").disabled=true;
    const canvas=q("videoCanvas");
    const canvasStream=canvas.captureStream(30);
    const tracks=[...canvasStream.getVideoTracks()];
    let recordAudio=null,audioCtx=null,dest=null;
    if(narrationAudio?.src){
      recordAudio=new Audio(narrationAudio.src);
      recordAudio.crossOrigin="anonymous";
      await new Promise((resolve)=>{recordAudio.addEventListener("loadedmetadata",resolve,{once:true});recordAudio.load();setTimeout(resolve,2500);});
      try{
        audioCtx=new (window.AudioContext||window.webkitAudioContext)();
        dest=audioCtx.createMediaStreamDestination();
        const source=audioCtx.createMediaElementSource(recordAudio);
        source.connect(dest);
        source.connect(audioCtx.destination);
        tracks.push(...dest.stream.getAudioTracks());
      }catch(e){
        q("videoStatus").textContent="Η εξαγωγή συνεχίζεται χωρίς ήχο στη συγκεκριμένη συσκευή.";
      }
    }
    const stream=new MediaStream(tracks);
    const types=["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"];
    const mime=types.find(t=>MediaRecorder.isTypeSupported(t))||"video/webm";
    const chunks=[];
    const rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:4500000});
    rec.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data)};
    const done=new Promise(resolve=>{rec.onstop=resolve});
    rec.start(250);
    const duration=previewDurationSeconds();
    const started=performance.now();
    if(recordAudio){
      await audioCtx?.resume?.();
      await recordAudio.play();
    }
    await new Promise(resolve=>{
      function tick(now){
        const current=recordAudio?recordAudio.currentTime:(now-started)/1000;
        renderFrameForTime(current,duration);
        if(current<duration)requestAnimationFrame(tick);
        else{renderFrameForTime(duration,duration);setTimeout(resolve,220);}
      }
      requestAnimationFrame(tick);
    });
    rec.stop();
    await done;
    stream.getTracks().forEach(t=>t.stop());
    try{await audioCtx?.close?.()}catch(_){}
    if(audioObjectUrl)URL.revokeObjectURL(audioObjectUrl);
    const blob=new Blob(chunks,{type:mime});
    exportedBlob=blob;
    audioObjectUrl=URL.createObjectURL(blob);
    const filename=(project.title||"ekpaideutiko-video").replace(/[^a-zA-Z0-9α-ωΑ-Ωάέήίόύώϊϋΐΰ -]/g,"").trim().replace(/\s+/g,"-")+".webm";
    const a=q("videoDownload");
    a.href=audioObjectUrl;
    a.download=filename;
    a.hidden=false;
    const filePreview=q("videoFilePreview");
    filePreview.src=audioObjectUrl;
    filePreview.hidden=false;
    q("videoSaveBtn").hidden=false;
    q("videoStatus").textContent="Έτοιμο. Μπορείς να δεις ολόκληρο το αρχείο παρακάτω και να το κατεβάσεις.";
    q("videoExportBtn").disabled=false;
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
      drawScene(project.scenes[0],0,1);
      renderStoryboard();

      q("generationMessage").textContent="2/3 Προετοιμασία αφήγησης.";
      if(q("videoNarration").value==="ai"){
        try{
          await createNarration();
          q("videoStudioHint").textContent="Το storyboard και η ελληνική AI αφήγηση είναι έτοιμα. Η εξαγωγή γίνεται τοπικά ως WebM χωρίς πρόγραμμα μοντάζ.";
        }catch(e){
          narrationAudio=null;
          q("videoStudioHint").textContent="Το storyboard είναι έτοιμο. Η AI αφήγηση δεν ενεργοποιήθηκε ("+(e?.message||"Puter")+"). Η προεπισκόπηση μπορεί να χρησιμοποιήσει τη φωνή της συσκευής αν την επιλέξεις.";
          q("videoStatus").textContent="Το βίντεο δημιουργήθηκε χωρίς AI αφήγηση. Μπορείς να το δεις τώρα.";
        }
      }
      q("videoExportBtn").hidden=false;
      q("videoDownload").hidden=true;
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
    q("videoPlayBtn")?.addEventListener("click",()=>{if(previewRunning){stopPlayback();return;}play();});
    q("videoRestartBtn")?.addEventListener("click",()=>{stopPlayback();if(project){drawScene(project.scenes[0],0,1);updateTimeline(0,previewDurationSeconds());}});
    q("videoExportBtn")?.addEventListener("click",exportWebm);
    q("videoSaveBtn")?.addEventListener("click",saveOrShare);
    q("videoTimeline")?.addEventListener("input",()=>{
      if(!project||previewRunning)return;
      const total=previewDurationSeconds();
      const seconds=(Number(q("videoTimeline").value)||0)/1000*total;
      drawAtSeconds(seconds,total);
    });
    q("videoNarration")?.addEventListener("change",()=>{q("videoDownload").hidden=true;q("videoSaveBtn").hidden=true;q("videoFilePreview").hidden=true;});
  }

  window.AITOOLSKIDS_TEACHER_VIDEO={buildPrompt,extractJson,generate,play,exportWebm,previewDurationSeconds,formatTime};

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});
  else bind();
})();
