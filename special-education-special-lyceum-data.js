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
      'language':'language','greek':'language','new-greek':'language','literature':'literature',
      'ancient-language':'ancient-language','ancient-translation':'ancient-translation','ancienttranslated':'ancient-translation','ancient':'ancient','archaia-b-lykeiou':'ancient',
      'math':'math','mathematics':'math','algebra':'math','geometry':'math',
      'physics':'physics','chemistry':'chemistry','biology':'biology','geography':'geography',
      'history':'history','religion':'religion','english':'english','technology':'technology',
      'informatics':'informatics','pliroforiki-b-lykeiou':'informatics','economics':'economics','home-economics':'home-economics','homeeconomics':'home-economics',
      'social-civic':'civics','civics':'civics','pe':'physical-education','physical-education':'physical-education',
      'music':'music','musictheatre':'music','art':'art','arts':'art','skills-labs':'skills-labs','skills':'skills-labs',
      'philosophy':'philosophy','sociology':'sociology','latin':'latin','orientation':'orientation',
      'health':'health','mechanics':'mechanics','structures':'structures','creativezone':'creativezone','creative-zone':'creativezone'
    };
    if(byId[sid]) return byId[sid];
    const s=norm(label);
    if(!s) return '';
    if(s.includes('φυσικη αγωγη')) return 'physical-education';
    if(s.includes('οικιακη οικονομια')) return 'home-economics';
    if(s.includes('αρχαια')&&s.includes('μεταφραση')) return 'ancient-translation';
    if(s.includes('αρχαια ελληνικη γλωσσα')) return 'ancient-language';
    if(s.includes('αρχαια ελληνικα')) return 'ancient';
    if(s.includes('νεοελληνικη λογοτεχνια')||s.includes('λογοτεχνια')) return 'literature';
    if(s.includes('γλωσσικη διδασκαλια')||s.includes('νεα ελληνικα')||s.includes('νεοελληνικη γλωσσα')||s==='ελληνικη γλωσσα') return 'language';
    if(s.includes('γεωλογια')||s.includes('γεωγραφια')) return 'geography';
    if(s.includes('κοινωνικη και πολιτικη αγωγη')||s.includes('πολιτικη παιδεια')) return 'civics';
    if(s.includes('εργαστηρια δεξιοτητων')) return 'skills-labs';
    if(s.includes('πληροφορικ')||s.includes('επιστημη των η υ')||s.includes('επιστημης των η υ')) return 'informatics';
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

  const LITERATURE_TEXTBOOK={
    a:{sourceUrl:'https://ebooks.edu.gr/ebooks/v/html/8547/2228/Keimena-Neoellinikis-Logotechnias_AGymnasiou_html-empl/index.html',topics:['Ο άνθρωπος και η φύση — Πόλη — Ύπαιθρος','Λαογραφικά','Οικογενειακές σχέσεις','Θρησκευτική ζωή','Εθνική ζωή','Παλαιότερες μορφές ζωής','Ταξιδιωτικά κείμενα','Η αποδημία — Ο καημός της ξενιτιάς — Ο ελληνισμός έξω από τα σύνορα — Τα Μικρασιατικά — Οι πρόσφυγες','Αθλητισμός','Η αγάπη για τους συνανθρώπους μας — Οι φιλικοί δεσμοί — Η αγάπη','Η βιοπάλη — Το αγωνιστικό πνεύμα του ανθρώπου','Προβλήματα της σύγχρονης ζωής','Οι φίλοι μας τα ζώα']},
    b:{sourceUrl:'https://www.ebooks.edu.gr/ebooks/v/html/8547/2246/Keimena-Neoellinikis-Logotechnias_B-Gymnasiou_html-empl/',topics:['Ο άνθρωπος και η φύση — Πόλη — Ύπαιθρος','Λαογραφικά','Οικογενειακές σχέσεις','Θρησκευτική ζωή','Εθνική ζωή','Παλαιότερες μορφές ζωής','Ταξιδιωτικά κείμενα','Η αποδημία — Ο καημός της ξενιτιάς — Ο ελληνισμός έξω από τα σύνορα — Τα Μικρασιατικά — Οι πρόσφυγες','Αθλητισμός','Η αγάπη για τους συνανθρώπους μας — Οι φιλικοί δεσμοί — Η αγάπη','Η βιοπάλη — Το αγωνιστικό πνεύμα του ανθρώπου','Προβλήματα της σύγχρονης ζωής','Οι φίλοι μας τα ζώα']},
    c:{sourceUrl:'https://www.ebooks.edu.gr/ebooks/v/html/8547/2218/Keimena-Neoellinikis-Logotechnias_GGymnasiou_html/index.html',topics:['Δημοτικά τραγούδια','Κρητική λογοτεχνία','Νεοελληνικός Διαφωτισμός','Απομνημονεύματα','Η λογοτεχνία στα Επτάνησα','Οι Φαναριώτες και οι Ρομαντικοί των Αθηνών','Η Νέα Αθηναϊκή Σχολή (1880–1922)','Η νεότερη λογοτεχνία — Η λογοτεχνία από το 1922 ως το 1945','Η νεότερη λογοτεχνία — Μεταπολεμική και σύγχρονη λογοτεχνία']}
  };

  const ANCIENT_LANGUAGE_TEXTBOOK={
    a:{sourceUrl:'https://lb2.ebooks.edu.gr/ebooks/v/html/8547/2244/Archaia-Elliniki-Glossa_A-Gymnasiou_html-empl/index.html',topics:['Ενότητα 1 — Το ταξίδι των λέξεων στον χρόνο','Ενότητα 2 — Η εκπαίδευση των παιδιών στην αρχαία Αθήνα','Ενότητα 3 — Επαγγέλματα των αρχαίων Αθηναίων','Ενότητα 4 — Ένα ταξίδι επιστημονικής φαντασίας','Ενότητα 5 — Ο πλούτος της αττικής γης','Ενότητα 6 — Η ομορφιά δεν είναι το παν','Ενότητα 7 — Η λύση του γόρδιου δεσμού','Ενότητα 8 — Ένα μοιραίο λάθος','Ενότητα 9 — Ανυπέρβλητα πρότυπα','Ενότητα 10 — Ο Σωκράτης για τη φιλία','Ενότητα 11 — Η αγάπη του Αλεξάνδρου για τον Βουκεφάλα','Ενότητα 12 — Αθήνα και Ατλαντίδα','Ενότητα 13 — Δάμων και Φιντίας','Ενότητα 14 — Ένα άδικο παράπονο','Ενότητα 15 — Η μεταμόρφωση του Λευκίππου','Ενότητα 16 — Το θλιβερό τέλος ενός τυράννου','Ενότητα 17 — Ένα διδακτικό παράδειγμα από τη φύση','Ενότητα 18 — Η ειλικρίνεια ανταμείβεται']},
    b:{sourceUrl:'https://www.ebooks.edu.gr/ebooks/v/html/8547/2234/Archaia-Elliniki-Glossa_B-Gymnasiou_html-empl/',topics:['Ενότητα 1 — Πατρική δικαιοσύνη','Ενότητα 2 — Το τέχνασμα του Θεμιστοκλή','Ενότητα 3 — Το χρέος του ιστορικού','Ενότητα 4 — Οι Σεληνίτες','Ενότητα 5 — Η ελεημοσύνη βασίλισσα των αρετών','Ενότητα 6 — Η ευθύνη για την παιδεία των νέων','Ενότητα 7 — Ένας στοργικός ηγέτης','Ενότητα 8 — Η γένεση της θρησκείας και της δικαιοσύνης','Ενότητα 9 — Η Καλλιπάτειρα','Ενότητα 10 — Ένας δύσκολος αντίπαλος','Ενότητα 11 — Ο σεβασμός προς τους γονείς μέλημα του νόμου','Ενότητα 12 — Τα φαινόμενα απατούν','Ενότητα 13 — Η σωστή στάση στο θέμα της τροφής','Ενότητα 14 — Απρόσκλητοι βοηθοί','Ενότητα 15 — Η Αθήνα προπύργιο της Ευρώπης','Ενότητα 16 — Μεγαλόψυχη στάση','Ενότητα 17 — Το πάθημα των ερωδιών','Ενότητα 18 — Τα μειονεκτήματα του γραπτού λόγου σε σχέση με τον προφορικό']},
    c:{sourceUrl:'https://ebooks.edu.gr/ebooks/v/html/8547/2238/Archaia-Elliniki-Glossa_G-Gymnasiou_html-empl/',topics:['Ενότητα 1 — Η Ελένη και η καταστροφή της Τροίας','Ενότητα 2 — Θυσία για την πατρίδα','Ενότητα 3 — Η κατοχή της εξουσίας δεν εγγυάται την ευτυχία','Ενότητα 4 — Τα πλεονεκτήματα της ειρήνης','Ενότητα 5 — Η ισονομία των πολιτών εγγύηση της δημοκρατίας','Ενότητα 6 — Η μουσική εξημερώνει','Ενότητα 7 — Η επιστήμη στην υπηρεσία της άμυνας του κράτους','Ενότητα 8 — Ένα παράδειγμα σεβασμού προς τους γονείς','Ενότητα 9 — Οι νόμοι επισκέπτονται τον Σωκράτη στη φυλακή','Ενότητα 10 — Μια τιμητική εξορία','Ενότητα 11 — Επικίνδυνες συμμαχίες','Ενότητα 12 — Θεϊκές αδυναμίες']}
  };

  const ANCIENT_TRANSLATED_TEXTBOOK={
    a:{sourceUrl:'https://ebooks.edu.gr/ebooks/v/html/8547/2232/Omirika-Epi-Odysseia_A-Gymnasiou_html-empl/',topics:['1η Ενότητα — α: περίληψη, α 1-25','2η Ενότητα — α 26-108','3η Ενότητα — α 109-173','4η Ενότητα — α 174-360','5η Ενότητα — α 361-497','6η Ενότητα — β, γ, δ: περίληψη και μικρά αποσπάσματα','7η Ενότητα — ε: περίληψη, ε 1-165','8η Ενότητα — ε 165-310','9η Ενότητα — ε 311-420','10η Ενότητα — ε 421-552','11η Ενότητα — ζ: περίληψη, ζ 139-259','12η Ενότητα — η, θ, ι 1-41: περίληψη και αποσπάσματα','13η Ενότητα — θ 550-688, ι 1-41','14η Ενότητα — ι 42 κ.ε., ι 240-512','15η Ενότητα — ι 513-630','16η Ενότητα — κ, λ: περίληψη, λ 99-249','17η Ενότητα — λ 376-433, 522-604','18η Ενότητα — μ, ν 1-209','19η Ενότητα — ν 210-494','20ή Ενότητα — ξ, ο, π: περίληψη','21η Ενότητα — π 1-172','22η Ενότητα — π 185-336','23η Ενότητα — ρ, σ: περίληψη, ρ 331-376','24η Ενότητα — τ, υ: περίληψη και αποσπάσματα','25η Ενότητα — φ: περίληψη, φ 303-473','26η Ενότητα — χ: περίληψη και αποσπάσματα','27η Ενότητα — ψ: περίληψη και αποσπάσματα','28η Ενότητα — ω: περίληψη και αποσπάσματα']},
    b:{sourceUrl:'https://ebooks.edu.gr/ebooks/v/html/8547/2296/Omirika-Epi-Iliada_B-Gymnasiou_empl/',topics:['Εισαγωγή και γεγονότα — ημερολόγιο της Ιλιάδας','Ραψωδία Α','Ραψωδία Β','Ραψωδία Γ','Ραψωδία Δ','Ραψωδία Ε','Ραψωδία Ζ','Ραψωδία Η','Ραψωδία Θ','Ραψωδία Ι','Ραψωδία Κ','Ραψωδία Λ','Ραψωδία Μ','Ραψωδία Ν','Ραψωδία Ξ','Ραψωδία Ο','Ραψωδία Π','Ραψωδία Ρ','Ραψωδία Σ','Ραψωδία Τ','Ραψωδία Υ','Ραψωδία Φ','Ραψωδία Χ','Ραψωδία Ψ','Ραψωδία Ω']},
    c:{sourceUrl:'https://ebooks.edu.gr/ebooks/v/html/8547/2342/Dramatiki-Poiisi-Evripidi-Eleni_G-Gymnasiou_empl/',topics:['Εισαγωγή','Πρόλογος — στ. 1-191','Πάροδος — στ. 192-436','Α΄ Επεισόδιο — στ. 437-575','Επιπάροδος – Β΄ Επεισόδιο — στ. 576-1219','Α΄ Στάσιμο — στ. 1220-1285','Γ΄ Επεισόδιο — στ. 1286-1424','Β΄ Στάσιμο — στ. 1425-1499','Δ΄ Επεισόδιο — στ. 1500-1592','Γ΄ Στάσιμο — στ. 1593-1652','Έξοδος — στ. 1653-1870']}
  };

  const CIVICS_TEXTBOOK={
    c:{sourceUrl:'https://ebooks.edu.gr/ebooks/v/html/8547/4720/Koinoniki-kai-Politiki-Agogi_G-Gymnasiou_html-apli/',topics:['Κεφάλαιο 1 — Εισαγωγικές έννοιες','Κεφάλαιο 2 — Κοινωνικές ομάδες','Κεφάλαιο 3 — Κοινωνική οργάνωση και μεταβολή','Κεφάλαιο 4 — Κοινωνικοί θεσμοί','Κεφάλαιο 5 — Κοινωνικοποίηση και κοινωνικός έλεγχος','Κεφάλαιο 6 — Κοινωνικά προβλήματα','Κεφάλαιο 7 — Το άτομο και η Πολιτεία','Κεφάλαιο 8 — Τα πολιτεύματα και το Σύνταγμα','Κεφάλαιο 9 — Εκλογές, κόμματα, ΜΜΕ','Κεφάλαιο 10 — Οι λειτουργίες του κράτους','Κεφάλαιο 11 — Η Διοίκηση','Κεφάλαιο 12 — Δικαιώματα και υποχρεώσεις','Κεφάλαιο 13 — Ευρωπαϊκή Ένωση','Κεφάλαιο 14 — Η Διεθνής Κοινότητα']}
  };

  const PE_TEXTBOOK={
    sourceUrl:'https://ebooks.edu.gr/ebooks/v/html/8547/2252/Fysiki-Agogi_A-B-GGymnasiou_html-empl/index.html',
    a:['Κεφάλαιο 1 — Η ιστορία του αθλητισμού','Κεφάλαιο 2 — Αθλητικές και κινητικές δραστηριότητες που διδάσκονται στο μάθημα της Φυσικής Αγωγής'],
    b:['Κεφάλαιο 3 — Η αξία της δια βίου άσκησης','Κεφάλαιο 4 — Μέθοδοι βελτίωσης των φυσικών ικανοτήτων των μαθητών'],
    c:['Κεφάλαιο 5 — Ειδικά θέματα','Κεφάλαιο 6 — Συμμετοχή των μαθητών στην οργάνωση σχολικών δραστηριοτήτων']
  };

  function officialTextbookReference(gradeId,localSubject){
    const gid=String(gradeId||'').toLowerCase();
    const key=subjectKey(localSubject?.label||localSubject,localSubject?.id);
    let ref=null,label='';
    if(key==='literature'){ref=LITERATURE_TEXTBOOK[gid];label='το επίσημο Διαδραστικό Σχολικό Βιβλίο Νεοελληνικής Λογοτεχνίας';}
    else if(key==='ancient-language'){ref=ANCIENT_LANGUAGE_TEXTBOOK[gid];label='το επίσημο Διαδραστικό Σχολικό Βιβλίο Αρχαίας Ελληνικής Γλώσσας';}
    else if(key==='ancient-translation'){ref=ANCIENT_TRANSLATED_TEXTBOOK[gid];label='το επίσημο Διαδραστικό Σχολικό Βιβλίο Αρχαίων Ελληνικών από Μετάφραση';}
    else if(key==='civics'){ref=CIVICS_TEXTBOOK[gid];label='το επίσημο Διαδραστικό Σχολικό Βιβλίο Κοινωνικής και Πολιτικής Αγωγής';}
    else if(key==='physical-education'&&PE_TEXTBOOK[gid]){ref={sourceUrl:PE_TEXTBOOK.sourceUrl,topics:PE_TEXTBOOK[gid]};label='το επίσημο Διαδραστικό Σχολικό Βιβλίο Φυσικής Αγωγής';}
    return ref?{topics:ref.topics,basis:'official-digital-textbook',label,sourceUrl:ref.sourceUrl}:null;
  }

  function topicReference(zone,gradeId,localSubject){
    const merged=typeof window.mergeSubjects==='function'?(window.mergeSubjects(zone,gradeId)||[]):[];
    const mergedFound=merged.find(s=>strictSubjectMatch(s.label||s.subjectLabelEl,localSubject,s.id));
    const mergedTopics=(mergedFound?.topics||[]).map(t=>typeof t==='string'?t:t?.labelEl).filter(Boolean);
    if(mergedTopics.length){
      return {topics:mergedTopics,basis:zone==='high'?'general-lyceum-2026-27':'general-gymnasium-2026-27',label:zone==='high'?'την πλήρη χαρτογράφηση ΓΕΛ 2026–27 του site':'την πλήρη χαρτογράφηση Γυμνασίου 2026–27 του site',sourceUrl:''};
    }

    const list=CAT?.getSubjects?.(zone,gradeId)||[];
    const found=list.find(s=>strictSubjectMatch(s.subjectLabelEl,localSubject,s.id));
    const mapped=(found?.topics||[]).map(t=>t.labelEl).filter(Boolean);
    if(mapped.length){
      return {topics:mapped,basis:zone==='high'?'general-lyceum-2026-27':'general-gymnasium-2026-27',label:zone==='high'?'την επαληθευμένη χαρτογράφηση ΓΕΛ 2026–27':'την επαληθευμένη χαρτογράφηση Γυμνασίου 2026–27',sourceUrl:''};
    }
    if(zone==='middle'){
      const textbook=officialTextbookReference(gradeId,localSubject);
      if(textbook) return textbook;
    }
    return {topics:[],basis:zone==='high'?'general-lyceum-2026-27':'general-gymnasium-2026-27',label:zone==='high'?'την επαληθευμένη χαρτογράφηση ΓΕΛ 2026–27':'την επαληθευμένη χαρτογράφηση Γυμνασίου 2026–27',sourceUrl:''};
  }

  function topicsFor(zone,gradeId,localSubject){return topicReference(zone,gradeId,localSubject).topics;}
  function bridgeId(schoolType,suffix,subject){return `bridge-${schoolType}-${suffix}-${subject.id||norm(subject.label)}`.replace(/[^a-z0-9-]/gi,'-').toLowerCase();}

  function addBridge(schoolType,grade,gradeLabel,subject,topics,suffix,basis,label,sourceUrl){
    if(!C?.entries||!topics.length) return;
    const id=bridgeId(schoolType,suffix,subject);
    C.entries[id]={id,schoolType,grade,gradeLabel,subject:subject.label||String(subject),subjectId:subject.id||'',subjectType:`Υποστηρικτική χαρτογράφηση από ${label}`,status:'verified-reference',coverageStatus:'reference',verificationBasis:basis,verificationDate:'2026-09-12',officialAnchors:[...new Set(topics)],referenceSourceUrl:sourceUrl||'',verificationNote:basis==='official-digital-textbook'?`Οι επιλογές είναι πραγματικές ενότητες του επίσημου σχολικού βιβλίου και χρησιμοποιούνται ως πλαίσιο επιλογής. Δεν παρουσιάζονται ως ξεχωριστή ετήσια εξεταστέα ύλη Ε.Α.Ε. 2026–27.`:`Οι ενότητες προέρχονται από ${label} του site και χρησιμοποιούνται μόνο ως πλαίσιο επιλογής. Δεν παρουσιάζονται ως ξεχωριστή ειδική εξεταστέα ύλη.`};
  }

  if(C?.entries&&CAT){
    ['a','b','c'].forEach(gid=>{const gradeLabel=window.SPECIAL_LYCEUM_2026_2027.grades[gid].labelEl;(CAT.getSubjects?.('high',gid)||[]).forEach(s=>{addBridge('special-lyceum',gid.toUpperCase(),gradeLabel,{id:s.id,label:s.subjectLabelEl},(s.topics||[]).map(t=>t.labelEl).filter(Boolean),`lyc-${gid}`,'general-lyceum-2026-27','την επαληθευμένη χαρτογράφηση ΓΕΛ 2026–27');});});
    if(EG){['lyc-a','lyc-b','lyc-c','lyc-d'].forEach(gid=>{const g=EG.grades?.[gid];if(!g)return;const highGrade=gid==='lyc-d'?'c':gid.slice(-1);(g.subjects||[]).forEach(subject=>{if(subject.type==='sector-gateway')return;const topics=topicsFor('high',highGrade,subject);addBridge('eneegyl',gid.slice(-1).toUpperCase(),g.label,subject,topics,gid,'general-lyceum-2026-27','την επαληθευμένη χαρτογράφηση ΓΕΛ 2026–27');});});}
  }

  function reconcileTeacherCurriculum(){
    if(!C?.entries||!CAT) return;
    Object.keys(C.entries).forEach(id=>{const e=C.entries[id];if(['general-gymnasium-2026-27','general-lyceum-2026-27','official-digital-textbook'].includes(e?.verificationBasis))delete C.entries[id];});

    const SG=window.SPECIAL_GYMNASIUM_2026_2027;
    if(SG){Object.entries(SG.grades||{}).forEach(([gid,g])=>{(g.subjects||[]).forEach(subject=>{const ref=topicReference('middle',gid,subject);addBridge('special-gymnasium',gid.toUpperCase(),g.label,subject,ref.topics,`gym-${gid}`,ref.basis,ref.label,ref.sourceUrl);});});}

    if(EG){
      ['gym-a','gym-b','gym-c'].forEach(gid=>{const g=EG.grades?.[gid];if(!g)return;const middleGrade=gid.slice(-1);(g.subjects||[]).forEach(subject=>{if(subject.type==='sector-gateway')return;const ref=topicReference('middle',middleGrade,subject);addBridge('eneegyl',middleGrade.toUpperCase(),g.label,subject,ref.topics,gid,ref.basis,ref.label,ref.sourceUrl);});});
      ['lyc-a','lyc-b','lyc-c','lyc-d'].forEach(gid=>{const g=EG.grades?.[gid];if(!g)return;const highGrade=gid==='lyc-d'?'c':gid.slice(-1);(g.subjects||[]).forEach(subject=>{if(subject.type==='sector-gateway')return;const ref=topicReference('high',highGrade,subject);addBridge('eneegyl',gid.slice(-1).toUpperCase(),g.label,subject,ref.topics,gid,ref.basis,ref.label,ref.sourceUrl);});});
    }

    ['a','b','c'].forEach(gid=>{const gradeLabel=window.SPECIAL_LYCEUM_2026_2027.grades[gid].labelEl;const source=typeof window.mergeSubjects==='function'?(window.mergeSubjects('high',gid)||[]):(CAT.getSubjects?.('high',gid)||[]).map(s=>({id:s.id,label:s.subjectLabelEl,topics:(s.topics||[]).map(t=>t.labelEl)}));source.forEach(s=>{const topics=(s.topics||[]).map(t=>typeof t==='string'?t:t?.labelEl).filter(Boolean);addBridge('special-lyceum',gid.toUpperCase(),gradeLabel,{id:s.id,label:s.label||s.subjectLabelEl},topics,`lyc-${gid}`,'general-lyceum-2026-27','την πλήρη χαρτογράφηση ΓΕΛ 2026–27 του site');});});

    window.subjectMatches=function(entry,subject){const entryKey=subjectKey(entry?.subject,entry?.subjectId||entry?.sourceSubjectId||'');const subjectLabel=subject?.label||subject||'';const subjectId=subject?.id||'';const selectedKey=subjectKey(subjectLabel,subjectId);if(entryKey&&selectedKey)return entryKey===selectedKey;return norm(entry?.subject)===norm(subjectLabel);};
    const collisions=[];Object.values(C.entries).forEach(e=>{if(!String(e?.id||'').startsWith('bridge-')||!e.subjectId)return;const expected=subjectKey(e.subject,e.subjectId);if(!expected)collisions.push({id:e.id,subject:e.subject,reason:'unknown-subject-key'});});window.AITOOLSKIDS_TEACHER_CURRICULUM_AUDIT={checkedAt:new Date().toISOString(),collisions};
    if(typeof window.refreshSubjects==='function')window.refreshSubjects();
  }

  if(typeof document!=='undefined'&&document.readyState==='loading')document.addEventListener('DOMContentLoaded',reconcileTeacherCurriculum,{once:true});else reconcileTeacherCurriculum();
})();