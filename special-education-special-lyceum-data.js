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

  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  const CAT=window.AITOOLSKIDS_TUTOR_CATALOG;
  const EG=window.ENEEGYL_2026_2027_STRUCTURE;

  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[΄’'·.,:;()\/\\-]/g,' ').replace(/\s+/g,' ').trim();

  function subjectKey(label,id){
    const sid=norm(id).replace(/\s+/g,'-');
    const byId={
      'language':'language','greek':'language','literature':'literature',
      'ancient-language':'ancient-language','ancient-translation':'ancient-translation','ancient':'ancient',
      'math':'math','mathematics':'math','algebra':'math','geometry':'math',
      'physics':'physics','chemistry':'chemistry','biology':'biology','geography':'geography',
      'history':'history','religion':'religion','english':'english','technology':'technology',
      'informatics':'informatics','economics':'economics','home-economics':'home-economics',
      'social-civic':'civics','civics':'civics','pe':'physical-education','physical-education':'physical-education',
      'music':'music','art':'art','arts':'art','skills-labs':'skills-labs',
      'philosophy':'philosophy','sociology':'sociology','latin':'latin','orientation':'orientation',
      'health':'health','mechanics':'mechanics','structures':'structures','creativezone':'creativezone'
    };
    if(byId[sid]) return byId[sid];
    const s=norm(label);
    if(!s) return '';
    if(s.includes('φυσικη αγωγη')) return 'physical-education';
    if(s.includes('οικιακη οικονομια')) return 'home-economics';
    if(s.includes('αρχαια ελληνικα απο μεταφραση')||s.includes('αρχαια απο μεταφραση')) return 'ancient-translation';
    if(s.includes('αρχαια ελληνικη γλωσσα')) return 'ancient-language';
    if(s.includes('νεοελληνικη λογοτεχνια')||s.includes('λογοτεχνια')) return 'literature';
    if(s.includes('γλωσσικη διδασκαλια')||s.includes('νεα ελληνικα')||s.includes('νεοελληνικη γλωσσα')||s==='ελληνικη γλωσσα') return 'language';
    if(s.includes('γεωλογια')||s.includes('γεωγραφια')) return 'geography';
    if(s.includes('κοινωνικη και πολιτικη αγωγη')||s.includes('πολιτικη παιδεια')) return 'civics';
    if(s.includes('εργαστηρια δεξιοτητων')) return 'skills-labs';
    if(s.includes('πληροφορικ')||s.includes('επιστημη των η υ')) return 'informatics';
    if(s.includes('μαθηματικ')||s.includes('αλγεβρ')||s.includes('γεωμετρ')) return 'math';
    if(s.includes('βιολογ')) return 'biology';
    if(s.includes('χημει')) return 'chemistry';
    if(s.includes('φυσικ')) return 'physics';
    if(s.includes('ιστορι')) return 'history';
    if(s.includes('θρησκευ')||s.includes('ηθικ')) return 'religion';
    if(s.includes('αγγλικ')) return 'english';
    if(s.includes('τεχνολογ')) return 'technology';
    if(s.includes('οικονομ')) return 'economics';
    if(s.includes('μουσικ')) return 'music';
    if(s.includes('καλλιτεχν')||s.includes('αισθητικη αγωγη')) return 'art';
    if(s.includes('φιλοσοφ')) return 'philosophy';
    if(s.includes('κοινωνιολογ')) return 'sociology';
    if(s.includes('λατιν')) return 'latin';
    if(s.includes('προσανατολισ')) return 'orientation';
    if(s.includes('υγεια')||s.includes('διατροφ')) return 'health';
    if(s.includes('μηχανολογ')||s.includes('θερμοδυναμ')) return 'mechanics';
    if(s.includes('τοπογραφ')||s.includes('δομικ')) return 'structures';
    return '';
  }

  function strictSubjectMatch(generalLabel,localSubject,generalId){
    const localLabel=localSubject?.label||localSubject?.subjectLabelEl||localSubject||'';
    const localId=localSubject?.id||'';
    const a=subjectKey(generalLabel,generalId);
    const b=subjectKey(localLabel,localId);
    if(a&&b) return a===b;
    return norm(generalLabel)===norm(localLabel);
  }

  function topicsFor(zone,gradeId,localSubject){
    const list=CAT?.getSubjects?.(zone,gradeId)||[];
    const found=list.find(s=>strictSubjectMatch(s.subjectLabelEl,localSubject,s.id));
    return found?(found.topics||[]).map(t=>t.labelEl).filter(Boolean):[];
  }

  function bridgeId(schoolType,suffix,subject){
    return `bridge-${schoolType}-${suffix}-${subject.id||norm(subject.label)}`.replace(/[^a-z0-9-]/gi,'-').toLowerCase();
  }

  function addBridge(schoolType,grade,gradeLabel,subject,topics,suffix,basis,label){
    if(!C?.entries||!topics.length) return;
    const id=bridgeId(schoolType,suffix,subject);
    C.entries[id]={
      id,schoolType,grade,gradeLabel,subject:subject.label||String(subject),subjectId:subject.id||'',
      subjectType:`Υποστηρικτική χαρτογράφηση από ${label}`,
      status:'verified-reference',coverageStatus:'reference',verificationBasis:basis,
      verificationDate:'2026-09-12',officialAnchors:[...new Set(topics)],
      verificationNote:`Οι ενότητες προέρχονται από ${label} του site και χρησιμοποιούνται μόνο ως πλαίσιο επιλογής. Δεν παρουσιάζονται ως ξεχωριστή ειδική εξεταστέα ύλη.`
    };
  }

  if(C?.entries&&CAT){
    ['a','b','c'].forEach(gid=>{
      const gradeLabel=window.SPECIAL_LYCEUM_2026_2027.grades[gid].labelEl;
      (CAT.getSubjects?.('high',gid)||[]).forEach(s=>{
        addBridge('special-lyceum',gid.toUpperCase(),gradeLabel,{id:s.id,label:s.subjectLabelEl},(s.topics||[]).map(t=>t.labelEl).filter(Boolean),`lyc-${gid}`,'general-lyceum-2026-27','την επαληθευμένη χαρτογράφηση ΓΕΛ 2026–27');
      });
    });
    if(EG){
      ['lyc-a','lyc-b','lyc-c','lyc-d'].forEach(gid=>{
        const g=EG.grades?.[gid]; if(!g) return;
        const highGrade=gid==='lyc-d'?'c':gid.slice(-1);
        (g.subjects||[]).forEach(subject=>{
          if(subject.type==='sector-gateway') return;
          const topics=topicsFor('high',highGrade,subject);
          addBridge('eneegyl',gid.slice(-1).toUpperCase(),g.label,subject,topics,gid,'general-lyceum-2026-27','την επαληθευμένη χαρτογράφηση ΓΕΛ 2026–27');
        });
      });
    }
  }

  function reconcileTeacherCurriculum(){
    if(!C?.entries||!CAT) return;

    Object.keys(C.entries).forEach(id=>{
      const e=C.entries[id];
      if(e?.verificationBasis==='general-gymnasium-2026-27'||e?.verificationBasis==='general-lyceum-2026-27') delete C.entries[id];
    });

    const SG=window.SPECIAL_GYMNASIUM_2026_2027;
    if(SG){
      Object.entries(SG.grades||{}).forEach(([gid,g])=>{
        (g.subjects||[]).forEach(subject=>{
          const topics=topicsFor('middle',gid,subject);
          addBridge('special-gymnasium',gid.toUpperCase(),g.label,subject,topics,`gym-${gid}`,'general-gymnasium-2026-27','την επαληθευμένη χαρτογράφηση Γυμνασίου 2026–27');
        });
      });
    }

    if(EG){
      ['gym-a','gym-b','gym-c'].forEach(gid=>{
        const g=EG.grades?.[gid]; if(!g) return;
        const middleGrade=gid.slice(-1);
        (g.subjects||[]).forEach(subject=>{
          if(subject.type==='sector-gateway') return;
          const topics=topicsFor('middle',middleGrade,subject);
          addBridge('eneegyl',middleGrade.toUpperCase(),g.label,subject,topics,gid,'general-gymnasium-2026-27','την επαληθευμένη χαρτογράφηση Γυμνασίου 2026–27');
        });
      });

      ['lyc-a','lyc-b','lyc-c','lyc-d'].forEach(gid=>{
        const g=EG.grades?.[gid]; if(!g) return;
        const highGrade=gid==='lyc-d'?'c':gid.slice(-1);
        (g.subjects||[]).forEach(subject=>{
          if(subject.type==='sector-gateway') return;
          const topics=topicsFor('high',highGrade,subject);
          addBridge('eneegyl',gid.slice(-1).toUpperCase(),g.label,subject,topics,gid,'general-lyceum-2026-27','την επαληθευμένη χαρτογράφηση ΓΕΛ 2026–27');
        });
      });
    }

    ['a','b','c'].forEach(gid=>{
      const gradeLabel=window.SPECIAL_LYCEUM_2026_2027.grades[gid].labelEl;
      (CAT.getSubjects?.('high',gid)||[]).forEach(s=>{
        addBridge('special-lyceum',gid.toUpperCase(),gradeLabel,{id:s.id,label:s.subjectLabelEl},(s.topics||[]).map(t=>t.labelEl).filter(Boolean),`lyc-${gid}`,'general-lyceum-2026-27','την επαληθευμένη χαρτογράφηση ΓΕΛ 2026–27');
      });
    });

    window.subjectMatches=function(entry,subject){
      const entryKey=subjectKey(entry?.subject,entry?.subjectId||entry?.sourceSubjectId||'');
      const subjectLabel=subject?.label||subject||'';
      const subjectId=subject?.id||'';
      const selectedKey=subjectKey(subjectLabel,subjectId);
      if(entryKey&&selectedKey) return entryKey===selectedKey;
      return norm(entry?.subject)===norm(subjectLabel);
    };

    const collisions=[];
    Object.values(C.entries).forEach(e=>{
      if(!String(e?.id||'').startsWith('bridge-')||!e.subjectId) return;
      const expected=subjectKey(e.subject,e.subjectId);
      if(!expected) collisions.push({id:e.id,subject:e.subject,reason:'unknown-subject-key'});
    });
    window.AITOOLSKIDS_TEACHER_CURRICULUM_AUDIT={checkedAt:new Date().toISOString(),collisions};

    if(typeof window.refreshSubjects==='function') window.refreshSubjects();
  }

  if(typeof document!=='undefined'&&document.readyState==='loading') document.addEventListener('DOMContentLoaded',reconcileTeacherCurriculum,{once:true});
  else reconcileTeacherCurriculum();
})();