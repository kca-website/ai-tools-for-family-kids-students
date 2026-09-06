/**
 * Special Lyceum E.A.E. — current institutional structure metadata.
 *
 * IMPORTANT: this file confirms the school type and A/B/C Lyceum structure used
 * for navigation. It does not claim a separately mapped 2026-27 chapter syllabus
 * for every subject. The AI Tutor therefore works from the learner's actual
 * chapter/text/exercise whenever a subject-specific E.A.E. scope is not mapped.
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
    scopeNoteEl:"Το Λύκειο Ε.Α.Ε. είναι ξεχωριστός επίσημος τύπος Λυκείου. Μέχρι να ολοκληρωθεί ξεχωριστή χαρτογράφηση της φετινής ύλης ανά μάθημα, η επιλογή μαθημάτων στην AI Βοήθεια χρησιμοποιεί το υπάρχον σχολικό catalog του Λυκείου μόνο ως πρακτικό μενού υποστήριξης — όχι ως δήλωση ειδικής διδακτέας ύλης.",
    scopeNoteEn:"Special Lyceum E.A.E. is an official distinct Lyceum type. Until a separate current subject-by-subject syllabus mapping is completed, AI Help mirrors the existing Lyceum subject catalog only as a tutoring menu, not as a claim about a separate official E.A.E. syllabus.",
    tutorPolicy:Object.freeze({
      warningEl:"Μην επινοείς ξεχωριστή επίσημη ύλη Ε.Α.Ε. Ζήτησε ή χρησιμοποίησε το πραγματικό κεφάλαιο, κείμενο ή άσκηση του μαθητή και προσαρμόζεις γλώσσα, βήματα, παραδείγματα και ρυθμό.",
      warningEn:"Do not invent a separate official E.A.E. syllabus. Work from the learner's actual chapter, text or exercise and adapt language, steps, examples and pace."
    })
  });
})();