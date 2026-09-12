/**
 * Special Lyceum E.A.E. — current institutional structure metadata.
 *
 * IMPORTANT: this file confirms the school type and A/B/C Lyceum structure used
 * for navigation. It does not claim a separately mapped 2026-27 chapter syllabus
 * for every subject. Where a matching verified General Lyceum mapping already
 * exists in the site, it may be reused as a support reference for chapter selection.
 */
(function(){
  "use strict";
  window.SPECIAL_LYCEUM_2026_2027=Object.freeze({
    id:"special-lyceum",
    schoolType:"special-lyceum",
    labelEl:"Ειδικό Λύκειο",
    labelEn:"Special Lyceum",
    status:"verified-structure",
    schoolYear:"2026-2027",
    verificationDate:"2026-09-06",
    sourceUrl:"https://www.minedu.gov.gr/eidiki-entaksiaki-ekpaidefsi",
    sourceLabelEl:"Υπουργείο Παιδείας — Λύκειο Ε.Α.Ε.",
    sourceLabelEn:"Ministry of Education — Special Lyceum E.A.E.",
    grades:Object.freeze({
      a:Object.freeze({id:"a",labelEl:"Α΄ Λυκείου",labelEn:"Lyceum A"}),
      b:Object.freeze({id:"b",labelEl:"Β΄ Λυκείου",labelEn:"Lyceum B"}),
      c:Object.freeze({id:"c",labelEl:"Γ΄ Λυκείου",labelEn:"Lyceum C"})
    }),
    scopeNoteEl:"Το Λύκειο Ε.Α.Ε. είναι ξεχωριστός επίσημος τύπος Λυκείου. Όπου υπάρχει ήδη επαληθευμένη χαρτογράφηση αντίστοιχου μαθήματος του ΓΕΛ 2026–27, χρησιμοποιείται ως πρακτικό πλαίσιο επιλογής κεφαλαίου και όχι ως δήλωση ξεχωριστής ειδικής εξεταστέας ύλης.",
    scopeNoteEn:"Special Lyceum E.A.E. is an official distinct Lyceum type. Where a verified matching 2026-27 General Lyceum mapping exists, it can be reused as a practical chapter-selection reference, not as a claim of a separate official E.A.E. syllabus.",
    tutorPolicy:Object.freeze({
      warningEl:"Μην επινοείς ξεχωριστή επίσημη ύλη Ε.Α.Ε. Χρησιμοποίησε επαληθευμένες αντίστοιχες ενότητες όπου υπάρχουν και το πραγματικό κεφάλαιο, κείμενο ή άσκηση του μαθητή.",
      warningEn:"Do not invent a separate official E.A.E. syllabus. Use verified matching chapter references where available and the learner's actual chapter, text or exercise."
    })
  });

  // Reuse verified General Lyceum chapter mappings as support references in
  // Special Lyceum and in the Lyceum part of EN.E.E.GY.-L. This is a menu bridge,
  // not a claim that the official special-education syllabus is identical.
  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  const CAT=window.AITOOLSKIDS_TUTOR_CATALOG;
  const EG=window.ENEEGYL_2026_2027_STRUCTURE;
  if(C?.entries && CAT){
    const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[΄’'·.,:;()\/\\-]/g,' ').replace(/\s+/g,' ').trim();
    const aliases={
      language:['γλωσσ','νεοελλην'],literature:['λογοτεχν'],ancient:['αρχαι'],math:['μαθηματικ','αλγεβρ','γεωμετρ'],
      physics:['φυσικ'],chemistry:['χημει'],biology:['βιολογ'],history:['ιστορι'],religion:['θρησκευ'],english:['αγγλικ'],
      informatics:['πληροφορ','επιστημη των η υ'],economics:['οικονομ'],civics:['πολιτικ'],philosophy:['φιλοσοφ'],
      sociology:['κοινωνιολογ'],latin:['λατιν'],orientation:['προσανατολισ'],health:['υγεια','διατροφ']
    };
    const subjectMatch=(general,local,id)=>{
      const a=norm(general),b=norm(local); if(!a||!b) return false;
      if(a.includes(b)||b.includes(a)) return true;
      const keys=aliases[norm(id).replace(/\s/g,'')]||aliases[norm(id)]||[];
      return keys.some(k=>a.includes(norm(k))||b.includes(norm(k)));
    };
    const topicsFor=(gradeId,localSubject)=>{
      const list=CAT.getSubjects?.('high',gradeId)||[];
      const found=list.find(s=>subjectMatch(s.subjectLabelEl,localSubject.label||localSubject,localSubject.id||''));
      return found?(found.topics||[]).map(t=>t.labelEl).filter(Boolean):[];
    };
    const add=(schoolType,grade,gradeLabel,subject,topics,suffix)=>{
      if(!topics.length) return;
      const id=`bridge-${schoolType}-${suffix}-${subject.id||norm(subject.label)}`.replace(/[^a-z0-9-]/gi,'-').toLowerCase();
      if(C.entries[id]) return;
      C.entries[id]={
        id,schoolType,grade,gradeLabel,subject:subject.label||String(subject),
        subjectType:'Υποστηρικτική χαρτογράφηση από επαληθευμένες οδηγίες ΓΕΛ 2026–27',
        status:'verified-reference',coverageStatus:'reference',verificationBasis:'general-lyceum-2026-27',
        verificationDate:'2026-09-12',officialAnchors:topics,
        verificationNote:'Οι ενότητες προέρχονται από την επαληθευμένη χαρτογράφηση ΓΕΛ 2026–27 του site και χρησιμοποιούνται μόνο ως πλαίσιο επιλογής. Δεν παρουσιάζονται ως ξεχωριστή ειδική εξεταστέα ύλη.'
      };
    };

    // Special Lyceum: expose all verified General Lyceum subjects/chapters by grade.
    ['a','b','c'].forEach(gid=>{
      const gradeLabel=window.SPECIAL_LYCEUM_2026_2027.grades[gid].labelEl;
      (CAT.getSubjects?.('high',gid)||[]).forEach(s=>{
        const subject={id:s.id,label:s.subjectLabelEl};
        add('special-lyceum',gid.toUpperCase(),gradeLabel,subject,(s.topics||[]).map(t=>t.labelEl).filter(Boolean),`lyc-${gid}`);
      });
    });

    // EN.E.E.GY.-L. Lyceum: bridge every common subject that matches the verified
    // General Lyceum catalog. D Lyceum uses C Lyceum only for matching common subjects.
    if(EG){
      ['lyc-a','lyc-b','lyc-c','lyc-d'].forEach(gid=>{
        const g=EG.grades?.[gid]; if(!g) return;
        const highGrade=gid==='lyc-d'?'c':gid.slice(-1);
        (g.subjects||[]).forEach(subject=>{
          if(subject.type==='sector-gateway') return;
          const topics=topicsFor(highGrade,subject);
          add('eneegyl',gid.slice(-1).toUpperCase(),g.label,subject,topics,gid);
        });
      });
    }
  }
})();