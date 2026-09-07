/**
 * official-annual-instructions-2026-2027.js
 * Source-aware annual teaching-guidance layer for school year 2026-2027.
 *
 * Policy:
 * - A published annual-guidance page does NOT make every site topic an exact annual-syllabus mapping.
 * - Stronger annual claims are returned only when the source evidence below supports them.
 * - When a circular reference is known but a direct official attachment URL is not recorded,
 *   the status remains explicitly pending and must not be presented as exact annual alignment.
 */
(function(){
  'use strict';

  var META = Object.freeze({
    version: '1.1.0',
    schoolYear: '2026-2027',
    lastVerified: '2026-09-08',
    primaryIepUrl: 'https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/',
    primaryMinistryUrl: 'https://www.minedu.gov.gr/protovathmia/dimotiko?id=2100&view=category',
    middleMinistryHubUrl: 'https://www.minedu.gov.gr/defterovathmia/gymnasio',
    policyEl: 'Η δημοσίευση ετήσιων οδηγιών για ένα μάθημα δεν σημαίνει ότι κάθε topic anchor του site είναι αυτούσια διδακτέα ή εξεταστέα ενότητα. Ακριβής annual αντιστοίχιση δηλώνεται μόνο όταν υπάρχει ρητή section-level τεκμηρίωση.',
    policyEn: 'Publication of annual guidance for a subject does not mean every site topic anchor is itself a taught or examinable section. Exact annual alignment is claimed only with explicit section-level evidence.'
  });

  function primaryRecord(entry){
    var id = String(entry && entry.quizId || '');
    var isKnownPrimary = /^(math|glossa|science|istoria|english)-/.test(id);
    if(!isKnownPrimary) return null;
    var isEnglish = /^english-/.test(id);
    return {
      status: 'official-annual-guidance-published',
      labelEl: 'Επίσημες οδηγίες 2026–27 δημοσιευμένες',
      labelEn: 'Official 2026–27 guidance published',
      noteEl: isEnglish
        ? 'Το ΙΕΠ έχει δημοσιεύσει τις οδηγίες 2026–27 για τις Ξένες Γλώσσες του Δημοτικού. Αυτό επιβεβαιώνει την ύπαρξη επίσημης ετήσιας οδηγίας για το μάθημα, όχι ότι κάθε topic anchor του site αποτελεί αυτούσια ενότητα της φετινής ύλης.'
        : 'Το ΙΕΠ έχει δημοσιεύσει τις οδηγίες 2026–27 για τη σχετική ομάδα μαθημάτων του Δημοτικού. Αυτό επιβεβαιώνει την ύπαρξη επίσημης ετήσιας οδηγίας για το μάθημα, όχι ότι κάθε topic anchor του site αποτελεί αυτούσια ενότητα της φετινής ύλης.',
      noteEn: isEnglish
        ? 'IEP has published the 2026–27 guidance for Primary-school foreign languages. This verifies that official annual guidance exists for the subject; it does not make every site topic anchor an exact item of this year’s syllabus.'
        : 'IEP has published the 2026–27 guidance for the relevant Primary-school subject group. This verifies that official annual guidance exists for the subject; it does not make every site topic anchor an exact item of this year’s syllabus.',
      sourceUrl: META.primaryIepUrl,
      sourceLabelEl: isEnglish ? 'ΙΕΠ · Ξένες Γλώσσες Δημοτικού 2026–27' : 'ΙΕΠ · Οδηγίες Δημοτικού 2026–27',
      sourceLabelEn: isEnglish ? 'IEP · Primary foreign languages 2026–27' : 'IEP · Primary guidance 2026–27',
      ministryUrl: META.primaryMinistryUrl,
      protocol: null,
      directOfficialDocumentRecorded: true,
      exactTopicAlignment: false
    };
  }

  var MIDDLE_REFERENCES = Object.freeze([
    Object.freeze({
      test: function(entry){ return /^mathimatika-/.test(String(entry && entry.quizId || '')); },
      protocol: '111798/Δ2/28-08-2026',
      iepAct: '63/30-07-2026',
      subjectEl: 'Μαθηματικά Γυμνασίου',
      subjectEn: 'Middle-school Mathematics',
      discoverySourceUrl: 'https://edu.klimaka.gr/mathimata/gymnasiou/3032-odhgies-mathimatika-a-gymnasiou'
    }),
    Object.freeze({
      test: function(entry){ return /^(physics|fysiki)-/.test(String(entry && entry.quizId || '')); },
      protocol: '111919/Δ2/28-08-2026',
      iepAct: '63/30-07-2026',
      subjectEl: 'Φυσική Γυμνασίου',
      subjectEn: 'Middle-school Physics',
      discoverySourceUrl: 'https://edu.klimaka.gr/mathimata/gymnasiou/3042-odhgies-fysikh-b-gymnasiou'
    }),
    Object.freeze({
      test: function(entry){ return /^chimeia-/.test(String(entry && entry.quizId || '')); },
      protocol: '111948/Δ2/28-08-2026',
      iepAct: '63/30-07-2026',
      subjectEl: 'Χημεία Γυμνασίου',
      subjectEn: 'Middle-school Chemistry',
      discoverySourceUrl: 'https://edu.klimaka.gr/mathimata/gymnasiou/3044-odhgies-xhmeia-g-gymnasiou'
    }),
    Object.freeze({
      test: function(entry){ return /^biologia-/.test(String(entry && entry.quizId || '')); },
      protocol: '111939/Δ2/28-08-2026',
      iepAct: '63/30-07-2026',
      subjectEl: 'Βιολογία Γυμνασίου',
      subjectEn: 'Middle-school Biology',
      discoverySourceUrl: 'https://edu.klimaka.gr/mathimata/gymnasiou/3039-odhgies-biologia-b-gymnasioy'
    })
  ]);

  function middleRecord(entry){
    var ref = MIDDLE_REFERENCES.find(function(item){ return item.test(entry); });
    if(!ref) return null;
    return {
      status: 'annual-circular-reference-found-direct-official-url-pending',
      labelEl: 'Εγκύκλιος 2026–27 εντοπισμένη · άμεσο επίσημο αρχείο εκκρεμεί',
      labelEn: '2026–27 circular identified · direct official file pending',
      noteEl: 'Έχει εντοπιστεί η αναφορά της εγκυκλίου για '+ref.subjectEl+' ('+ref.protocol+', πράξη ΙΕΠ '+ref.iepAct+'). Στο layer δεν έχει ακόμη καταχωριστεί άμεσο URL του επίσημου συνημμένου, επομένως δεν χρησιμοποιούμε αυτή την αναφορά ως απόδειξη exact annual αντιστοίχισης ενός topic.',
      noteEn: 'The annual circular reference for '+ref.subjectEn+' has been identified ('+ref.protocol+', IEP act '+ref.iepAct+'). A direct URL to the official attachment has not yet been recorded in the layer, so this reference is not used as proof of exact annual alignment for a topic.',
      publicNoteEl: 'Έχει εντοπιστεί σχετική εγκύκλιος 2026–27 για το μάθημα. Μέχρι να καταχωριστεί άμεσο επίσημο αρχείο, δεν τη χρησιμοποιούμε ως απόδειξη ότι ένα συγκεκριμένο θέμα ανήκει ακριβώς στη φετινή ύλη.',
      publicNoteEn: 'A relevant 2026–27 circular has been identified for this subject. Until a direct official file is recorded, we do not use it as proof that a specific topic is exactly part of this year’s syllabus.',
      sourceUrl: META.middleMinistryHubUrl,
      sourceLabelEl: 'ΥΠΑΙΘΑ · Κόμβος Γυμνασίου',
      sourceLabelEn: 'Ministry · Middle-school hub',
      ministryUrl: META.middleMinistryHubUrl,
      discoverySourceUrl: ref.discoverySourceUrl,
      protocol: ref.protocol,
      iepAct: ref.iepAct,
      directOfficialDocumentRecorded: false,
      exactTopicAlignment: false
    };
  }

  function resolve(entry){
    if(!entry) return null;
    if(entry.zone === 'primary') return primaryRecord(entry);
    if(entry.zone === 'middle') return middleRecord(entry);
    return null;
  }

  window.AITOOLSKIDS_OFFICIAL_ANNUAL_INSTRUCTIONS_2026_2027 = Object.freeze({
    meta: META,
    resolve: resolve
  });
})();
