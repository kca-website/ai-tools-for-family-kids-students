(function(){
  "use strict";

  const base=window.EPAL_2026_2027_TEACHER_STRUCTURE;
  const detail=window.AITOOLSKIDS_EPAL_C_SPECIALTY_DATA_2026_2027;
  const finalData=window.AITOOLSKIDS_EPAL_C_FINAL_SECTOR_DATA_2026_2027;
  const topicLayer=window.AITOOLSKIDS_EPAL_STUDENT_TOPICS_2026_2027;
  if(!base){
    console.warn("[EPAL student tutor] Base 2026-27 EPAL structure is missing.");
    return;
  }

  const SCHOOL_YEAR="2026-2027";
  const VERIFIED=base.verificationDate||"2026-09-18";
  const HUB=base.sourceUrls?.epalHub||"https://www.iep.edu.gr/yli-kai-odigies-didaskalias-epa-l-gia-to-scholiko-etos-2026-2027/";

  const commonRows=(grade)=>(base.grades?.[grade]||[]).filter(x=>!x.sector&&!x.sectorGateway);
  const baseSectorRows=(sector)=>(base.grades?.b||[]).filter(x=>x.sector===sector&&!x.sectorGateway);
  const gatewayRows=()=>(base.grades?.b||[]).filter(x=>x.sectorGateway);
  const cleanGatewayLabel=(label)=>String(label||"").replace(/^Τομέας:\s*/,"").replace(/^Ειδικότητες Τομέα:\s*/,"").trim();

  function slug(value){
    return String(value||"")
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .toLowerCase().replace(/[^a-z0-9α-ω]+/gi,"-").replace(/^-|-$/g,"").slice(0,80)||"item";
  }

  function curriculum(sourceUrl,topicsVerified,scopeNoteEl,needsExactTitle=false){
    const verified=!!topicsVerified;
    const panhellenic=/91809|4328/i.test(String(sourceUrl||""));
    return {
      schoolYear:SCHOOL_YEAR,
      schoolType:"epal",
      verificationDate:VERIFIED,
      coverageStatus:panhellenic?"panhellenic-2027-verified":(verified?"annual-instructions-verified":"official-course-verified"),
      coverageLabelEl:panhellenic?"Επίσημη ύλη Πανελλαδικών ΕΠΑΛ 2027":(verified?"Επαληθευμένες ενότητες ΕΠΑΛ 2026–27":"Επαληθευμένο μάθημα ΕΠΑΛ — γράψε την ακριβή ενότητα"),
      coverageLabelEn:panhellenic?"Official 2027 EPAL Panhellenic syllabus":(verified?"Verified EPAL 2026–27 units":"Verified EPAL course — enter the exact unit"),
      annualInstructionsStatus:verified?"2026-27-verified":"section-level-scope-not-encoded",
      annualInstructionsUrl:sourceUrl||HUB,
      catalogUrl:sourceUrl||HUB,
      sourceLabelEl:panhellenic?"ΥΠΑΙΘΑ: ΦΕΚ ύλης Πανελλαδικών ΕΠΑΛ 2027":"ΙΕΠ/ΥΠΑΙΘΑ: Οδηγίες διδασκαλίας ΕΠΑΛ 2026–27",
      sourceLabelEn:panhellenic?"Ministry: Official 2027 EPAL Panhellenic syllabus":"IEP/Ministry: EPAL teaching guidance 2026–27",
      scopeNoteEl:scopeNoteEl||(verified
        ?"Οι εμφανιζόμενες ενότητες προέρχονται από την καταγεγραμμένη τρέχουσα χαρτογράφηση 2026–27."
        :"Το μάθημα έχει επαληθευτεί, αλλά η πλήρης αναλυτική ύλη δεν έχει ακόμη κωδικοποιηθεί. Γράψε τον ακριβή τίτλο από το επίσημο βιβλίο ή την εγκύκλιο· δεν εμφανίζονται εικασίες."),
      scopeNoteEn:verified
        ?"Displayed units come from the site's recorded current 2026–27 mapping."
        :"The course or structure is verified, but complete section-level scope is not encoded. The student should type the exact chapter or exercise.",
      annualInstructionsNoteEl:needsExactTitle?"Δεν παρουσιάζονται μη επαληθευμένες θεματικές ως ύλη.":"Οι ενότητες έχουν αντιστοιχιστεί στην επίσημη πηγή.",
      annualInstructionsNoteEn:"Unverified topic anchors are not presented as official chapters."
    };
  }

  function subjectFromItem(grade,item,prefix=""){
    const baseId=`epal-${grade}-${prefix?prefix+"-":""}${slug(item.id||item.label)}`;
    const resolved=topicLayer?.resolve?.(item.label,item.topics||[])||(item.topics||[]).map(label=>({label,officialExact:true}));
    const topics=resolved.map((entry,index)=>({
      id:`${baseId}.topic-${index+1}`,
      labelEl:entry.label,
      labelEn:entry.label,
      officialExact:entry.officialExact!==false,
      customTitle:!!entry.customTitle,
      sourceUrl:entry.sourceUrl||"",
      sourceKind:entry.sourceKind||"",
      explainEl:`Δούλεψε την ενότητα «${entry.label}» με μικρές υποδείξεις και έλεγχο κατανόησης.`,
      explainEn:`Work on “${entry.label}” with small hints and understanding checks.`
    }));
    const exactTopics=topics.length>0&&topics.every(x=>x.officialExact)&&!item.structureOnly;
    return {
      id:baseId,
      grade,
      subjectLabelEl:item.label,
      subjectLabelEn:item.label,
      topics,
      sector:item.sector||"",
      specialty:item.specialty||"",
      curriculum:curriculum(topics.find(x=>x.sourceUrl)?.sourceUrl||item.sourceUrl||HUB,exactTopics,"",topics.some(x=>x.customTitle))
    };
  }

  const commonByGrade={
    a:commonRows("a").map(x=>subjectFromItem("a",x)),
    b:commonRows("b").map(x=>subjectFromItem("b",x)),
    c:commonRows("c").map(x=>subjectFromItem("c",x))
  };

  const bHealthSector="Υγείας - Πρόνοιας - Ευεξίας";
  const bHealth=(detail?.bHealth||[]).map((label,index)=>subjectFromItem("b",{
    id:`health-${index+1}`,label,sector:bHealthSector,sourceUrl:detail?.sources?.health||HUB,officialStructure:true
  },"health"));

  const gatewaySectorMap=new Map(gatewayRows().map(x=>[cleanGatewayLabel(x.label),x]));
  const sectorNames=new Set([
    ...(base.grades?.b||[]).filter(x=>x.sector).map(x=>x.sector),
    ...gatewaySectorMap.keys(),
    ...(bHealth.length?[bHealthSector]:[])
  ]);

  const sectors=[...sectorNames].filter(Boolean).sort((a,b)=>a.localeCompare(b,"el")).map(label=>({id:label,label}));

  const specialtyRows=[
    ...(detail?.specialties||[]),
    ...(finalData?.specialties||[])
  ];
  const specialtyMap=new Map();
  for(const x of specialtyRows){
    if(x?.id&&!specialtyMap.has(x.id)) specialtyMap.set(x.id,x);
  }
  const specialties=[...specialtyMap.values()]
    .sort((a,b)=>(a.sector+" "+a.label).localeCompare(b.sector+" "+b.label,"el"))
    .map(x=>({id:x.id,label:`${x.sector} — ${x.label}`,sector:x.sector,specialty:x.label}));

  function bSubjects(sector){
    const rows=[...commonByGrade.b];
    if(!sector) return rows;
    const detailed=[
      ...baseSectorRows(sector).map(x=>subjectFromItem("b",x,slug(sector))),
      ...(sector===bHealthSector?bHealth:[])
    ];
    if(detailed.length) return [...rows,...detailed];
    const gateway=gatewaySectorMap.get(sector);
    if(gateway){
      rows.push({
        id:`epal-b-gateway-${slug(sector)}`,
        grade:"b",
        subjectLabelEl:`Μάθημα τομέα: ${sector} — γράψε το ακριβές μάθημα στο μήνυμα`,
        subjectLabelEn:`Sector course: ${sector} — type the exact course in your message`,
        topics:[],
        sector,
        supportOnly:true,
        curriculum:curriculum(gateway.sourceUrl||HUB,false,
          "Ο τομέας είναι επίσημα καταγεγραμμένος, αλλά δεν έχει εξαχθεί πλήρης λίστα μαθημάτων/κεφαλαίων στο μαθητικό UI. Γράψε το πραγματικό μάθημα και κεφάλαιο· η AI δεν πρέπει να επινοήσει ύλη.")
      });
    }
    return rows;
  }

  function cSubjects(specialtyId){
    const rows=[...commonByGrade.c];
    if(!specialtyId) return rows;
    const sp=specialtyMap.get(specialtyId);
    if(!sp) return rows;
    const extra=(sp.subjects||[]).map((label,index)=>subjectFromItem("c",{
      id:`${sp.id}-${index+1}`,
      label,
      sector:sp.sector,
      specialty:sp.label,
      sourceUrl:sp.sourceUrl||HUB,
      officialStructure:true
    },sp.id));
    return [...rows,...extra];
  }

  function getSubjects(grade,sector="",specialtyId=""){
    const id=String(grade||"a").toLowerCase();
    if(id==="a") return [...commonByGrade.a];
    if(id==="b") return bSubjects(sector);
    if(id==="c") return cSubjects(specialtyId);
    return [];
  }

  function getSubject(grade,subjectId,sector="",specialtyId=""){
    return getSubjects(grade,sector,specialtyId).find(x=>x.id===subjectId)||null;
  }

  window.AITOOLSKIDS_EPAL_STUDENT_CATALOG=Object.freeze({
    meta:Object.freeze({
      version:"1.1.0",
      schoolYear:SCHOOL_YEAR,
      verified:VERIFIED,
      source:HUB,
      note:"Student-facing EPAL catalog reuses the verified 2026-27 EPAL structure. Only source-verified units are shown; otherwise the learner enters the exact chapter/exercise from the official material."
    }),
    getSectors:()=>sectors.map(x=>({...x})),
    getSpecialties:()=>specialties.map(x=>({...x})),
    getSubjects,
    getSubject
  });
})();
