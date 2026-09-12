(function(){
  "use strict";

  function norm(s){return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[΄’'·.,:;()\/\\–—-]/g," ").replace(/\s+/g," ").trim();}
  function uniq(a){return [...new Set((a||[]).map(x=>String(x||"").trim()).filter(Boolean))];}
  function usefulAnchors(entry){
    const rows=uniq(entry?.officialAnchors||[]);
    return rows.filter(x=>{
      const n=norm(x);
      return n&&!n.startsWith("βιβλιο αναφορας")&&!n.startsWith("το μαθημα")&&!n.startsWith("επισημο υποστηρικτικο")&&!n.startsWith("η ενοτητα του site")&&!n.startsWith("η επισημη εξεταστεα υλη συνεχιζεται");
    });
  }
  function add(C,e){
    if(!C?.entries||!e?.officialAnchors?.length||C.entries[e.id]) return false;
    C.entries[e.id]={
      status:"verified-reference",
      coverageStatus:"support-reference",
      verificationDate:"2026-09-12",
      subjectType:"Υποστηρικτική χαρτογράφηση — όχι δήλωση ξεχωριστής ύλης Ε.Α.Ε.",
      ...e
    };
    return true;
  }
  function topicsOf(s){return uniq((s?.topics||[]).map(t=>typeof t==="string"?t:t?.labelEl));}
  function generalMatch(list,subject){
    if(typeof window.subjectMatches==="function"){
      const strict=list.find(s=>window.subjectMatches({subject:s.label||s.subjectLabelEl,subjectId:s.id},subject));
      if(strict) return strict;
    }
    const key=norm(subject.label);
    return list.find(s=>norm(s.label||s.subjectLabelEl)===key)||null;
  }

  function run(){
    const C=window.SPECIAL_EDUCATION_CURRICULUM;
    const E=window.ENEEGYL_2026_2027_STRUCTURE;
    if(!C?.entries||!E?.grades) return;

    const d=E.grades["gym-d"];
    const generalC=typeof window.mergeSubjects==="function"?(window.mergeSubjects("middle","c")||[]):[];

    // Δ΄ Γυμνασίου ΕΝ.Ε.ΓΥ.-Λ.: use the already verified Γ΄ General Gymnasium map only as a study reference.
    // We do NOT relabel this as official Δ΄ ENEEGYL annual syllabus.
    (d?.subjects||[]).forEach(subject=>{
      if(subject.type==="sector-gateway") return;
      const match=generalMatch(generalC,subject);
      const topics=topicsOf(match);
      if(!topics.length) return;
      add(C,{
        id:`teacher-support-eneegyl-gym-d-${subject.id}`,
        schoolType:"eneegyl",grade:"D",gradeLabel:d.label,
        subject:subject.label,subjectId:subject.id,
        verificationBasis:"verified-general-gym-c-map-as-support",
        sourceTitle:"Υποστηρικτική αναφορά από την επαληθευμένη χαρτογράφηση Γ΄ Γυμνασίου 2026–27 του site",
        sourceUrl:"",
        officialAnchors:topics,
        verificationNote:"Οι ενότητες είναι πραγματικές, επαληθευμένες επιλογές της αντίστοιχης χαρτογράφησης Γ΄ Γενικού Γυμνασίου και χρησιμοποιούνται μόνο ως υποστηρικτική αναφορά μελέτης για το ομώνυμο μάθημα της Δ΄ Γυμνασίου ΕΝ.Ε.ΓΥ.-Λ. Δεν παρουσιάζονται ως αυτούσια επίσημη διδακτέα ή εξεταστέα ύλη ΕΝ.Ε.ΓΥ.-Λ."
      });
    });

    // The official SEP C Gymnasium textbook is already verified in the dataset. Reuse its real units as a support reference
    // for ENEEGYL grades that include SEP but have no separately mapped annual chapter scope.
    const sep=C.entries["teacher-extra-eneegyl-gym-c-career"];
    const sepTopics=usefulAnchors(sep);
    if(sepTopics.length){
      [["A","gym-a"],["B","gym-b"],["D","gym-d"]].forEach(([grade,gid])=>{
        const g=E.grades[gid];
        if(!(g?.subjects||[]).some(s=>s.id==="career")) return;
        add(C,{
          id:`teacher-support-eneegyl-${gid}-career`,schoolType:"eneegyl",grade,gradeLabel:g.label,
          subject:"Σχολικός Επαγγελματικός Προσανατολισμός",subjectId:"career",
          verificationBasis:"official-sep-c-textbook-as-support",sourceTitle:sep.sourceTitle,sourceUrl:sep.sourceUrl,
          officialAnchors:sepTopics,
          verificationNote:"Οι ενότητες προέρχονται από το επίσημο σχολικό βιβλίο ΣΕΠ Γ΄ Γυμνασίου. Χρησιμοποιούνται ως υποστηρικτική τράπεζα θεμάτων επειδή το μάθημα ΣΕΠ υπάρχει στη συγκεκριμένη τάξη ΕΝ.Ε.ΓΥ.-Λ., όχι ως ισχυρισμός ότι αποτελούν την επίσημη ετήσια ύλη της τάξης."
        });
      });
    }

    // For the remaining D-grade arts/skills subjects, reuse only already verified ENEEGYL references of the same subject.
    ["musicTheatre","arts","skills","creativeZone"].forEach(subjectId=>{
      if(!(d?.subjects||[]).some(s=>s.id===subjectId)) return;
      const source=Object.values(C.entries).find(e=>e.schoolType==="eneegyl"&&e.subjectId===subjectId&&String(e.grade||"").toUpperCase()!=="D"&&usefulAnchors(e).length);
      const topics=usefulAnchors(source);
      if(!topics.length) return;
      const target=(d.subjects||[]).find(s=>s.id===subjectId);
      add(C,{
        id:`teacher-support-eneegyl-gym-d-${subjectId}-existing-reference`,schoolType:"eneegyl",grade:"D",gradeLabel:d.label,
        subject:target.label,subjectId,
        verificationBasis:"existing-verified-eneegyl-reference-as-support",sourceTitle:source.sourceTitle||"Επαληθευμένη υποστηρικτική αναφορά του site",sourceUrl:source.sourceUrl||source.referenceSourceUrl||"",
        officialAnchors:topics,
        verificationNote:"Επαναχρησιμοποιείται μόνο επαληθευμένη υποστηρικτική αναφορά του ίδιου μαθήματος από άλλη τάξη ΕΝ.Ε.ΓΥ.-Λ. Δεν δηλώνεται ότι οι ίδιες ενότητες αποτελούν επίσημη ετήσια ύλη της Δ΄ Γυμνασίου."
      });
    });

    // Special Gymnasium B includes Social & Civic Education. If the verified General Gymnasium map has real units,
    // expose them strictly as a support reference, not as a separate E.A.E. syllabus.
    const SG=window.SPECIAL_GYMNASIUM_2026_2027;
    const sgB=SG?.grades?.b;
    const civics=(sgB?.subjects||[]).find(s=>s.id==="social-civic");
    if(civics){
      const match=generalMatch(generalC,{id:"civics",label:civics.label});
      const topics=topicsOf(match);
      if(topics.length) add(C,{
        id:"teacher-support-special-gym-b-civics",schoolType:"special-gymnasium",grade:"B",gradeLabel:sgB.label,
        subject:civics.label,subjectId:civics.id,verificationBasis:"verified-general-gym-c-map-as-support",
        sourceTitle:"Υποστηρικτική αναφορά από την επαληθευμένη χαρτογράφηση Γ΄ Γυμνασίου 2026–27 του site",sourceUrl:"",
        officialAnchors:topics,
        verificationNote:"Η Κοινωνική και Πολιτική Αγωγή είναι επαληθευμένο μάθημα της Β΄ Ειδικού Γυμνασίου από το ισχύον ωρολόγιο. Οι συγκεκριμένες ενότητες προέρχονται από επαληθευμένο γενικό σχολικό υλικό και εμφανίζονται μόνο ως υποστηρικτική αναφορά, όχι ως ξεχωριστή επίσημη ύλη Ε.Α.Ε."
      });
    }

    window.AITOOLSKIDS_ENEEGYL_D_SUPPORT_2026_2027=Object.freeze({version:"1.0.0",verified:"2026-09-12",policy:"support-reference-only"});
    if(typeof window.refreshSubjects==="function"&&["eneegyl","specialGym"].includes(document.getElementById("context")?.value)) window.refreshSubjects();
  }

  if(typeof document==="undefined") return;
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",run,{once:true});
  else run();
})();
