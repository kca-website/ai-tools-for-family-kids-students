/**
 * official-annual-instructions-2026-2027.js
 * Effective annual-guidance layer for school year 2026-2027.
 *
 * Important:
 * - "guidance published" verifies that official 2026-27 guidance exists for the subject.
 * - It does NOT turn every site topic anchor into an official chapter or an examinable item.
 * - Exact topic/section alignment still requires explicit section-level evidence.
 */
(function(){
  'use strict';

  var META = Object.freeze({
    version: '1.2.0',
    schoolYear: '2026-2027',
    lastVerified: '2026-09-18',
    primaryIepUrl: 'https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/',
    middleIepUrl: 'https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/',
    primaryMinistryUrl: 'https://www.minedu.gov.gr/protovathmia/dimotiko?id=2100&view=category',
    middleMinistryHubUrl: 'https://www.minedu.gov.gr/defterovathmia/gymnasio',
    policyEl: 'Η δημοσίευση ετήσιων οδηγιών για ένα μάθημα δεν σημαίνει ότι κάθε topic anchor του site είναι αυτούσια διδακτέα ή εξεταστέα ενότητα. Ακριβής αντιστοίχιση δηλώνεται μόνο όταν υπάρχει ρητή section-level τεκμηρίωση.',
    policyEn: 'Publication of annual guidance for a subject does not mean every site topic anchor is itself a taught or examinable section. Exact alignment is claimed only with explicit section-level evidence.'
  });

  function publishedRecord(entry, zone){
    var primary = zone === 'primary';
    return {
      status: 'official-annual-guidance-published',
      labelEl: 'Επίσημες οδηγίες 2026–27 δημοσιευμένες',
      labelEn: 'Official 2026–27 guidance published',
      noteEl: primary
        ? 'Το ΙΕΠ έχει δημοσιεύσει τις οδηγίες διδασκαλίας 2026–27 για τα μαθήματα της Πρωτοβάθμιας που υποστηρίζει το site. Αυτό επιβεβαιώνει την επίσημη ετήσια πηγή, όχι ότι κάθε topic anchor του site είναι αυτούσιος τίτλος κεφαλαίου ή όλη η διδακτέα ύλη.'
        : 'Το ΙΕΠ έχει δημοσιεύσει τις οδηγίες διδασκαλίας Γυμνασίου 2026–27. Αυτό επιβεβαιώνει την επίσημη ετήσια πηγή για το μάθημα, όχι ότι κάθε topic anchor του site είναι αυτούσιος τίτλος κεφαλαίου ή εξεταστέα ενότητα.',
      noteEn: primary
        ? 'IEP has published the 2026–27 Primary-school teaching guidance for the subjects supported by the site. This verifies the official annual source, not that every site topic anchor is an exact chapter title or the full taught syllabus.'
        : 'IEP has published the 2026–27 Middle-school teaching guidance. This verifies the official annual source for the subject, not that every site topic anchor is an exact chapter title or examinable section.',
      publicNoteEl: 'Υπάρχει επίσημη οδηγία 2026–27 για το μάθημα. Όπου δεν έχουμε section-level αντιστοίχιση, εμφανίζουμε το θέμα μόνο ως χαρτογραφημένο topic και όχι ως επίσημο κεφάλαιο.',
      publicNoteEn: 'Official 2026–27 guidance exists for the subject. Where section-level mapping is not recorded, the site shows the item only as a mapped topic, not as an official chapter.',
      sourceUrl: primary ? META.primaryIepUrl : META.middleIepUrl,
      sourceLabelEl: primary ? 'ΙΕΠ · Οδηγίες Πρωτοβάθμιας 2026–27' : 'ΙΕΠ · Οδηγίες Γυμνασίου 2026–27',
      sourceLabelEn: primary ? 'IEP · Primary guidance 2026–27' : 'IEP · Middle-school guidance 2026–27',
      ministryUrl: primary ? META.primaryMinistryUrl : META.middleMinistryHubUrl,
      directOfficialDocumentRecorded: true,
      exactTopicAlignment: false
    };
  }

  function resolve(entry){
    if(!entry) return null;
    if(entry.zone === 'primary') return publishedRecord(entry, 'primary');
    if(entry.zone === 'middle') return publishedRecord(entry, 'middle');
    return null;
  }

  window.AITOOLSKIDS_OFFICIAL_ANNUAL_INSTRUCTIONS_2026_2027 = Object.freeze({
    meta: META,
    resolve: resolve
  });
})();
