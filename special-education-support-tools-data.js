/**
 * Curated support tools for Special Education.
 * These are not presented as replacements for teaching or as diagnosis-specific
 * prescriptions. They solve concrete access/study tasks alongside AI Help.
 */
(function(){
  "use strict";
  window.SPECIAL_EDUCATION_SUPPORT_TOOLS=Object.freeze({
    version:1,
    verificationDate:"2026-09-06",
    intro:"Διάλεξε εργαλείο ανάλογα με τη δυσκολία της στιγμής: ανάγνωση, γραφή, οπτική οργάνωση ή μαθηματική κατανόηση.",
    items:Object.freeze([
      {
        id:"immersive-reader",
        name:"Microsoft Edge Reading mode / Immersive Reader",
        icon:"🔊",
        task:"Ανάγνωση και συγκέντρωση στο κείμενο",
        why:"Διαβάζει δυνατά ελληνικό κείμενο, επιτρέπει line focus, αλλαγή χρωμάτων/εμφάνισης και μετάφραση σε υποστηριζόμενες σελίδες.",
        bestFor:"Όταν μεγάλο κείμενο κουράζει ή όταν βοηθά να ακούει ο μαθητής καθώς διαβάζει.",
        url:"https://support.microsoft.com/en-us/edge/use-immersive-reader-in-microsoft-edge",
        sourceUrl:"https://support.microsoft.com/en-us/education/languages-and-products-supported-by-immersive-reader",
        freeNote:"Διαθέσιμο μέσα στον Microsoft Edge."
      },
      {
        id:"google-docs-voice",
        name:"Google Docs — Φωνητική πληκτρολόγηση",
        icon:"🎙️",
        task:"Γραφή χωρίς πολύ πληκτρολόγηση",
        why:"Μετατρέπει ομιλία σε κείμενο και υποστηρίζει ελληνικά.",
        bestFor:"Όταν ο μαθητής ξέρει τι θέλει να πει αλλά δυσκολεύεται ή κουράζεται στη γραπτή παραγωγή.",
        url:"https://support.google.com/docs/answer/4492226?hl=el",
        sourceUrl:"https://support.google.com/docs/answer/4492226?hl=el",
        freeNote:"Διαθέσιμο στα Έγγραφα Google σε υποστηριζόμενο browser."
      },
      {
        id:"desmos",
        name:"Desmos",
        icon:"📈",
        task:"Οπτικοποίηση μαθηματικών",
        why:"Γραφικές παραστάσεις και μαθηματική διερεύνηση με ισχυρά χαρακτηριστικά προσβασιμότητας, όπως audio trace, screen-reader συμβατό equation editor και Braille υποστήριξη.",
        bestFor:"Όταν μια μαθηματική σχέση γίνεται ευκολότερη με εικόνα, γράφημα ή ακουστική αναπαράσταση.",
        url:"https://www.desmos.com/calculator",
        sourceUrl:"https://www.desmos.com/acr",
        freeNote:"Δωρεάν βασική χρήση."
      },
      {
        id:"geogebra",
        name:"GeoGebra",
        icon:"📐",
        task:"Γεωμετρία και οπτική διερεύνηση",
        why:"Δυναμική γεωμετρία και μαθηματικά με πλοήγηση πληκτρολογίου, screen-reader και Braille υποστήριξη σύμφωνα με την επίσημη σελίδα προσβασιμότητας.",
        bestFor:"Γεωμετρία, μετρήσεις, σχήματα και όταν χρειάζεται να αλλάζει ο μαθητής ένα στοιχείο και να βλέπει άμεσα τι συμβαίνει.",
        url:"https://www.geogebra.org/",
        sourceUrl:"https://help.geogebra.org/hc/en-us/articles/20048444963869-Accessibility",
        freeNote:"Δωρεάν βασική χρήση."
      },
      {
        id:"canva-education",
        name:"Canva for Education",
        icon:"🧩",
        task:"Οπτική οργάνωση και παρουσίαση",
        why:"Χρήσιμο για οπτικά βήματα, απλές παρουσιάσεις, αφίσες και οργανωτές. Το Canva Education παρέχεται δωρεάν σε επιλέξιμους K-12 εκπαιδευτικούς και μαθητές και διαθέτει εργαλεία προσβασιμότητας.",
        bestFor:"Όταν η πληροφορία γίνεται πιο κατανοητή με εικόνες, λίγα λόγια και σαφή διάταξη.",
        url:"https://www.canva.com/education/",
        sourceUrl:"https://www.canva.com/accessibility/",
        freeNote:"Canva Education: δωρεάν για επιλέξιμους K-12 εκπαιδευτικούς/μαθητές."
      },
      {
        id:"autodraw",
        name:"AutoDraw",
        icon:"✏️",
        task:"Έκφραση με εικόνα χωρίς πολύ κείμενο",
        why:"Ο μαθητής σχεδιάζει πρόχειρα και το εργαλείο προτείνει καθαρά εικονίδια. Δεν απαιτείται να γράψει περιγραφή για να ξεκινήσει.",
        bestFor:"Διαγράμματα, οπτικές σημειώσεις, αφίσες και δραστηριότητες όπου η εικόνα βοηθά περισσότερο από μεγάλο κείμενο.",
        url:"/autodraw.html",
        sourceUrl:"https://www.autodraw.com/",
        freeNote:"Δωρεάν, χωρίς λογαριασμό για βασική χρήση."
      }
    ])
  });
})();