/**
 * Curated support tools for Special Education.
 * These are not presented as replacements for teaching or as diagnosis-specific
 * prescriptions. They solve concrete access/study tasks alongside AI Help.
 */
(function(){
  "use strict";
  window.SPECIAL_EDUCATION_SUPPORT_TOOLS=Object.freeze({
    version:3,
    verificationDate:"2026-09-24",
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
        id:"math-progress",
        name:"Microsoft Math Progress",
        icon:"➗",
        task:"Στοχευμένη μαθηματική εξάσκηση με παρακολούθηση προόδου",
        why:"Ο εκπαιδευτικός μπορεί να δημιουργήσει ή να προσαρμόσει μαθηματικές ασκήσεις μέσα στο Teams, να χρησιμοποιήσει AI για προτάσεις προβλημάτων και να δει δεδομένα προόδου χωρίς να αφήνει τον μαθητή μόνο με ένα γενικό chatbot.",
        bestFor:"Όταν χρειάζεται διαφοροποιημένη εξάσκηση σε μικρά βήματα και ο εκπαιδευτικός θέλει να παρακολουθεί ποια λάθη επαναλαμβάνονται.",
        url:"https://support.microsoft.com/en-us/education/learning-accelerators/getting-started-with-math-progress",
        sourceUrl:"https://support.microsoft.com/en-us/education/learning-accelerators/getting-started-with-math-progress",
        freeNote:"Διατίθεται μέσα στο Microsoft Teams for Education· απαιτεί σχολικό περιβάλλον Microsoft 365."
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
        id:"diffit",
        name:"Diffit",
        icon:"🧩",
        task:"Διαφοροποίηση και απλοποίηση εκπαιδευτικού υλικού",
        why:"Ο εκπαιδευτικός μπορεί να προσαρμόσει κείμενα, επίπεδο ανάγνωσης, λεξιλόγιο, δραστηριότητες και οργανωτές χωρίς να ζητά από τον μαθητή να δουλέψει σε γενικό chatbot.",
        bestFor:"Όταν το ίδιο γνωστικό περιεχόμενο χρειάζεται πιο καθαρή γλώσσα, μικρότερα βήματα ή διαφορετικό επίπεδο υποστήριξης.",
        url:"https://web.diffit.me/",
        sourceUrl:"https://web.diffit.me/faq",
        freeNote:"Υπάρχει δωρεάν βασική έκδοση για εκπαιδευτικούς. Η Diffit δηλώνει ότι δεν συλλέγει δεδομένα μαθητών."
      },
      {
        id:"snorkl",
        name:"Snorkl",
        icon:"🗣️",
        task:"Εξήγηση σκέψης με φωνή, γραφή ή σχεδίαση",
        why:"Ο μαθητής μπορεί να δείξει πώς σκέφτεται και να λάβει άμεσο feedback, κάτι χρήσιμο όταν η σωστή τελική απάντηση δεν αρκεί για να καταλάβουμε τη διαδικασία.",
        bestFor:"Μαθηματικά, επιστήμες και δραστηριότητες όπου βοηθά η προφορική ή οπτική εξήγηση αντί για μεγάλο γραπτό κείμενο.",
        url:"https://snorkl.app/",
        sourceUrl:"https://snorkl.app/plans",
        freeNote:"Δωρεάν πλάνο για εκπαιδευτικούς με teacher-managed δραστηριότητες."
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