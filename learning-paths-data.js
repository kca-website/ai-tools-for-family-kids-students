/**
 * learning-paths-data.js
 * Μονοπάτια μάθησης (Learning Paths) ανά gap tag.
 * Κάθε gap tag (βλ. GAP_TAGS στο quiz-data.js) αντιστοιχεί σε 3 βήματα:
 *   1) Ατομική προσπάθεια χωρίς εργαλείο (learning-first)
 *   2) Καθοδηγούμενη χρήση ενός προτεινόμενου εργαλείου (ερωτήσεις, όχι έτοιμη λύση)
 *   3) Εμπέδωση / απόδειξη κατανόησης
 * Φιλοσοφία ίδια με το υπόλοιπο project: το AI ρωτάει, δεν λύνει.
 */

const LEARNING_PATHS = {
  "fractions.whole_number_bias": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Σύγκριση κλασμάτων» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να συγκρίνει κλάσματα όταν ο παρονομαστής είναι μεγαλύτερος αριθμός. Συχνά σκέφτεται τον αριθμητή και τον παρονομαστή σαν δύο ξεχωριστούς ακέραιους αριθμούς, αντί για ένα ενιαίο μέγεθος.",
      "descriptionEn": "Solve 2-3 exercises on \"Comparing fractions\" by hand, writing out every step on paper. The most common trap on this topic: Struggles to compare fractions when the denominator is a bigger number. Often treats the numerator and denominator as two separate whole numbers instead of one combined quantity.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Σύγκριση κλασμάτων”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Comparing fractions'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Σύγκριση κλασμάτων» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Comparing fractions\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],
  "fractions.add_across": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Πρόσθεση κλασμάτων» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Προσθέτει ξεχωριστά αριθμητές και παρονομαστές αντί να βρει πρώτα κοινό παρονομαστή. Είναι το πιο συχνό λάθος στην πρόσθεση κλασμάτων σε αυτή την ηλικία.",
      "descriptionEn": "Solve 2-3 exercises on \"Adding fractions\" by hand, writing out every step on paper. The most common trap on this topic: Adds numerators and denominators separately instead of finding a common denominator first. This is the most common error in fraction addition at this age.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Πρόσθεση κλασμάτων”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Adding fractions'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Πρόσθεση κλασμάτων» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Adding fractions\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],
  "decimals.longer_is_larger": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Σύγκριση δεκαδικών» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Πιστεύει ότι ο δεκαδικός με περισσότερα ψηφία είναι πάντα ο μεγαλύτερος (π.χ. νομίζει ότι το 0,45 είναι μεγαλύτερο από το 0,8). Είναι πολύ κοινή παρανόηση σε αυτή την ηλικία και χρειάζεται συγκεκριμένη εξάσκηση στη θεσιακή αξία.",
      "descriptionEn": "Solve 2-3 exercises on \"Comparing decimals\" by hand, writing out every step on paper. The most common trap on this topic: Believes a decimal with more digits is always bigger (e.g. thinks 0.45 is greater than 0.8). Very common at this age and needs targeted practice on place value.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Σύγκριση δεκαδικών”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Comparing decimals'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Σύγκριση δεκαδικών» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Comparing decimals\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],
  "division.remainder": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Διαίρεση με υπόλοιπο» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται στη διαίρεση με διψήφιο διαιρέτη, ειδικά στο να θυμηθεί το υπόλοιπο στο τέλος. Χρειάζεται βήμα-βήμα εξάσκηση στον αλγόριθμο της διαίρεσης.",
      "descriptionEn": "Solve 2-3 exercises on \"Division with remainder\" by hand, writing out every step on paper. The most common trap on this topic: Struggles with division by a 2-digit divisor, especially remembering the remainder at the end. Needs step-by-step practice with the division algorithm.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Photomath",
      "titleEn": "Ask Photomath",
      "descriptionEl": "Άνοιξε το Photomath και πες: «Δυσκολεύομαι στο “Διαίρεση με υπόλοιπο”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Photomath and say: \"I'm struggling with 'Division with remainder'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "photomath"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Διαίρεση με υπόλοιπο» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Khanmigo.",
      "descriptionEn": "Make up a brand-new exercise on \"Division with remainder\" and solve it without help. If you want, check your solution with Khanmigo.",
      "toolId": "khanmigo"
    }
  ],
  "percent.as_fraction": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Ποσοστά» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν έχει ακόμα καταλάβει καλά ότι το ποσοστό σημαίνει «τόσο στα εκατό». Μπερδεύει τη μετατροπή ποσοστού σε κλάσμα.",
      "descriptionEn": "Solve 2-3 exercises on \"Percentages\" by hand, writing out every step on paper. The most common trap on this topic: Hasn't yet fully grasped that percent means 'out of a hundred.' Confuses converting a percentage into a fraction.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Ποσοστά”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Percentages'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Ποσοστά» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Percentages\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],
  "measurement.area_perimeter_confusion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Εμβαδόν και περίμετρος» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τον τύπο του εμβαδού με τον τύπο της περιμέτρου. Χρειάζεται οπτικοποίηση της διαφοράς: η περίμετρος μετράει το 'γύρω-γύρω', το εμβαδόν μετράει την επιφάνεια.",
      "descriptionEn": "Solve 2-3 exercises on \"Area and perimeter\" by hand, writing out every step on paper. The most common trap on this topic: Mixes up the area formula with the perimeter formula. Needs a visual reminder of the difference: perimeter measures the 'way around,' area measures the surface.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Εμβαδόν και περίμετρος”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Area and perimeter'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Εμβαδόν και περίμετρος» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Area and perimeter\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],
  "history.athens-sparta-confusion": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Αθήνα vs Σπάρτη», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Athens vs Sparta\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Ρώτα το Khanmigo: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Αθήνα vs Σπάρτη”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask Khanmigo: \"What historical sources support or challenge what I remember about 'Athens vs Sparta'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "history.byzantine-confusion": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Βυζαντινή Αυτοκρατορία», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Byzantine Empire\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Ρώτα το Khanmigo: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Βυζαντινή Αυτοκρατορία”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask Khanmigo: \"What historical sources support or challenge what I remember about 'Byzantine Empire'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "grammar.subject-verb-agreement": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Συμφωνία υποκειμένου-ρήματος» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Δυσκολεύεται με τη συμφωνία υποκειμένου και ρήματος, ειδικά σε σύνθετες προτάσεις. Χρειάζεται εξάσκηση στην αναγνώριση του υποκειμένου.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Subject-verb agreement\" and underline the spot where you feel unsure. The common trap here: Struggles with subject-verb agreement, especially in complex sentences. Needs practice in identifying the subject.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Συμφωνία υποκειμένου-ρήματος”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open ChatGPT, show it your sentences, and ask: \"Do I have this wrong on 'Subject-verb agreement'? Explain why, don't just correct them for me.\"",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Συμφωνία υποκειμένου-ρήματος» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Subject-verb agreement\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "grammar.comma-usage": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Χρήση κομμάτων» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Μπερδεύεται με τη χρήση κομμάτων σε απαριθμήσεις, προτάσεις και κλήσεις. Χρειάζεται κανόνες και παραδείγματα.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Comma usage\" and underline the spot where you feel unsure. The common trap here: Confused about comma usage in lists, clauses, and addresses. Needs rules and examples.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Χρήση κομμάτων”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open ChatGPT, show it your sentences, and ask: \"Do I have this wrong on 'Comma usage'? Explain why, don't just correct them for me.\"",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Χρήση κομμάτων» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Comma usage\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "physics.force-motion-confusion": [
    {
      "titleEl": "Σκέψου ένα παράδειγμα",
      "titleEn": "Think of an example",
      "descriptionEl": "Πριν ψάξεις οτιδήποτε, βρες ένα καθημερινό παράδειγμα για «Δύναμη και κίνηση» και προσπάθησε να το εξηγήσεις με δικά σου λόγια. Η πιο συχνή παρανόηση σε αυτό το θέμα: Πιστεύει ότι χρειάζεται συνεχής δύναμη για να διατηρηθεί η κίνηση (Αριστοτελική αντίληψη). Χρειάζεται κατανόηση του 1ου νόμου του Νεύτωνα.",
      "descriptionEn": "Before looking anything up, find an everyday example related to \"Force and motion\" and try to explain it in your own words. Check whether you fall into this trap: Believes continuous force is needed to maintain motion (Aristotelian view). Needs understanding of Newton's 1st law.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και περιέγραψε το παράδειγμά σου. Ζήτησέ του να σε ρωτήσει «γιατί το πιστεύεις αυτό;» πριν σου δώσει την επιστημονική εξήγηση για «Δύναμη και κίνηση».",
      "descriptionEn": "Open Wolfram Alpha and describe your example. Ask it to question your reasoning first (\"why do you think that?\") before it gives you the scientific explanation of \"Force and motion\".",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο, με δικά σου λόγια, γιατί ισχύει το σωστό για «Δύναμη και κίνηση» και όχι αυτό που πίστευες πριν. Αν το εξηγήσεις καθαρά, το έμαθες.",
      "descriptionEn": "Explain to a parent or friend, in your own words, why the correct picture of \"Force and motion\" is true, and not what you believed before. If you can explain it clearly, you've learned it.",
      "toolId": null
    }
  ],
  "history.olympics-location": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Τόπος Αρχαίων Ολυμπιακών», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Ancient Olympics location\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Ρώτα το Khanmigo: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Τόπος Αρχαίων Ολυμπιακών”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask Khanmigo: \"What historical sources support or challenge what I remember about 'Ancient Olympics location'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "history.philosophers-confusion": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Αρχαίοι Φιλόσοφοι», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Ancient philosophers\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Ρώτα το Khanmigo: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Αρχαίοι Φιλόσοφοι”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask Khanmigo: \"What historical sources support or challenge what I remember about 'Ancient philosophers'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "physics.density-mass-confusion": [
    {
      "titleEl": "Σκέψου ένα παράδειγμα",
      "titleEn": "Think of an example",
      "descriptionEl": "Πριν ψάξεις οτιδήποτε, βρες ένα καθημερινό παράδειγμα για «Πυκνότητα vs Μάζα» και προσπάθησε να το εξηγήσεις με δικά σου λόγια. Η πιο συχνή παρανόηση σε αυτό το θέμα: Μπερδεύει τη μάζα με την πυκνότητα. Πιστεύει ότι μεγάλο αντικείμενο = μεγάλη πυκνότητα. Χρειάζεται οπτικά παραδείγματα.",
      "descriptionEn": "Before looking anything up, find an everyday example related to \"Density vs Mass\" and try to explain it in your own words. Check whether you fall into this trap: Confuses mass with density. Believes big object = high density. Needs visual examples.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και περιέγραψε το παράδειγμά σου. Ζήτησέ του να σε ρωτήσει «γιατί το πιστεύεις αυτό;» πριν σου δώσει την επιστημονική εξήγηση για «Πυκνότητα vs Μάζα».",
      "descriptionEn": "Open Wolfram Alpha and describe your example. Ask it to question your reasoning first (\"why do you think that?\") before it gives you the scientific explanation of \"Density vs Mass\".",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο, με δικά σου λόγια, γιατί ισχύει το σωστό για «Πυκνότητα vs Μάζα» και όχι αυτό που πίστευες πριν. Αν το εξηγήσεις καθαρά, το έμαθες.",
      "descriptionEn": "Explain to a parent or friend, in your own words, why the correct picture of \"Density vs Mass\" is true, and not what you believed before. If you can explain it clearly, you've learned it.",
      "toolId": null
    }
  ],
  "spelling.homophones": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Ομόηχες λέξεις» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Γράφει τις λέξεις όπως ακούγονται, χωρίς να λαμβάνει υπόψη τη σημασία ή το μέρος του λόγου. Μπερδεύει ομόηχες λέξεις όπως «λύπη» και «λείπει».",
      "descriptionEn": "Write 3-4 of your own sentences using \"Homophones\" and underline the spot where you feel unsure. The common trap here: Spells words by sound alone, ignoring meaning or part of speech. Confuses homophones like 'λύπη' (sadness) and 'λείπει' (is missing).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Ομόηχες λέξεις”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Khanmigo, show it your sentences, and ask: \"Do I have this wrong on 'Homophones'? Explain why, don't just correct them for me.\"",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Ομόηχες λέξεις» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Homophones\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "spelling.oti-otidipote": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν ««Ό,τι» και «ότι»» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Μπερδεύει το «ό,τι» (=οτιδήποτε) με το «ότι» (σύνδεσμος), επειδή ακούγονται ακριβώς ίδια.",
      "descriptionEn": "Write 3-4 of your own sentences using \"'Ó,ti' vs 'óti'\" and underline the spot where you feel unsure. The common trap here: Confuses 'ó,ti' (=whatever) with 'óti' (the conjunction 'that'), because they sound identical.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “«Ό,τι» και «ότι»”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Khanmigo, show it your sentences, and ask: \"Do I have this wrong on ''Ó,ti' vs 'óti''? Explain why, don't just correct them for me.\"",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για ««Ό,τι» και «ότι»» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"'Ó,ti' vs 'óti'\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "spelling.final-n": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Τελικό -ν» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Παραλείπει το τελικό -ν στο άρθρο «τον/έναν» επειδή στην προφορά συχνά δεν ακούγεται καθαρά.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Final -n rule\" and underline the spot where you feel unsure. The common trap here: Drops the final -n from the article 'ton/énan' because it's often not clearly heard in speech.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Τελικό -ν”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Khanmigo, show it your sentences, and ask: \"Do I have this wrong on 'Final -n rule'? Explain why, don't just correct them for me.\"",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Τελικό -ν» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Final -n rule\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "spelling.verb-ending": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Κατάληξη ρήματος -ει» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Μπερδεύει την κατάληξη -ει του ρήματος στο γ' ενικό πρόσωπο με άλλες καταλήξεις που ακούγονται παρόμοια.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Verb ending -ei\" and underline the spot where you feel unsure. The common trap here: Confuses the -ei verb ending (3rd person singular) with other similarly-sounding endings.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Κατάληξη ρήματος -ει”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Khanmigo, show it your sentences, and ask: \"Do I have this wrong on 'Verb ending -ei'? Explain why, don't just correct them for me.\"",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Κατάληξη ρήματος -ει» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Verb ending -ei\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "spelling.stem-confusion": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Θέμα λέξης» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Γράφει τη λέξη όπως την προφέρει, αγνοώντας τη σωστή γραφή του θέματός της (π.χ. «παιδιά» με «αι» αντί για «ε»).",
      "descriptionEn": "Write 3-4 of your own sentences using \"Word stem spelling\" and underline the spot where you feel unsure. The common trap here: Spells the word phonetically, ignoring the correct spelling of its stem (e.g. 'παιδιά' with 'αι' instead of 'ε').",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Θέμα λέξης”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Khanmigo, show it your sentences, and ask: \"Do I have this wrong on 'Word stem spelling'? Explain why, don't just correct them for me.\"",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Θέμα λέξης» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Word stem spelling\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "science-primary.seasons-distance": [
    {
      "titleEl": "Σκέψου το φαινόμενο",
      "titleEn": "Think about the phenomenon",
      "descriptionEl": "Πριν διαβάσεις κάτι, προσπάθησε να εξηγήσεις με δικά σου λόγια το «Αιτία των εποχών». Μετά δες αν η εξήγησή σου πέφτει σε αυτή την παγίδα: Πιστεύει ότι οι εποχές οφείλονται στην απόσταση της Γης από τον Ήλιο, ενώ στην πραγματικότητα οφείλονται στην κλίση του άξονα της Γης.",
      "descriptionEn": "Before reading anything, try to explain \"Cause of the seasons\" in your own words. Then compare it with the most common misconception on this topic: Believes seasons are caused by Earth's changing distance from the Sun, when they're actually caused by the tilt of Earth's axis.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες του την εξήγησή σου για «Αιτία των εποχών». Ζήτησέ του να σου κάνει ερωτήσεις μέχρι να βρεις μόνος/η πού κάνεις λάθος.",
      "descriptionEn": "Open Khanmigo and tell it your explanation of \"Cause of the seasons\". Ask it to keep asking you questions until you find the mistake yourself.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο το «Αιτία των εποχών» με δικά σου λόγια, χρησιμοποιώντας ένα δικό σου παράδειγμα. Αν καταλαβαίνει από την εξήγησή σου, το έμαθες.",
      "descriptionEn": "Explain \"Cause of the seasons\" to a parent or friend in your own words, using your own example. If they understand it from your explanation, you've learned it.",
      "toolId": null
    }
  ],
  "science-primary.day-night-sun-moves": [
    {
      "titleEl": "Σκέψου το φαινόμενο",
      "titleEn": "Think about the phenomenon",
      "descriptionEl": "Πριν διαβάσεις κάτι, προσπάθησε να εξηγήσεις με δικά σου λόγια το «Αιτία μέρας/νύχτας». Μετά δες αν η εξήγησή σου πέφτει σε αυτή την παγίδα: Πιστεύει ότι η μέρα και η νύχτα γίνονται επειδή ο Ήλιος κινείται γύρω από τη Γη, ενώ στην πραγματικότητα η Γη περιστρέφεται γύρω από τον άξονά της.",
      "descriptionEn": "Before reading anything, try to explain \"Cause of day/night\" in your own words. Then compare it with the most common misconception on this topic: Believes day and night happen because the Sun moves around the Earth, when actually the Earth rotates on its axis.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες του την εξήγησή σου για «Αιτία μέρας/νύχτας». Ζήτησέ του να σου κάνει ερωτήσεις μέχρι να βρεις μόνος/η πού κάνεις λάθος.",
      "descriptionEn": "Open Khanmigo and tell it your explanation of \"Cause of day/night\". Ask it to keep asking you questions until you find the mistake yourself.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο το «Αιτία μέρας/νύχτας» με δικά σου λόγια, χρησιμοποιώντας ένα δικό σου παράδειγμα. Αν καταλαβαίνει από την εξήγησή σου, το έμαθες.",
      "descriptionEn": "Explain \"Cause of day/night\" to a parent or friend in your own words, using your own example. If they understand it from your explanation, you've learned it.",
      "toolId": null
    }
  ],
  "science-primary.matter-disappears": [
    {
      "titleEl": "Σκέψου το φαινόμενο",
      "titleEn": "Think about the phenomenon",
      "descriptionEl": "Πριν διαβάσεις κάτι, προσπάθησε να εξηγήσεις με δικά σου λόγια το «Διατήρηση ύλης». Μετά δες αν η εξήγησή σου πέφτει σε αυτή την παγίδα: Πιστεύει ότι όταν κάτι διαλύεται (π.χ. η ζάχαρη στο νερό), εξαφανίζεται και χάνει τη μάζα του.",
      "descriptionEn": "Before reading anything, try to explain \"Conservation of matter\" in your own words. Then compare it with the most common misconception on this topic: Believes that when something dissolves (e.g. sugar in water), it disappears and loses its mass.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες του την εξήγησή σου για «Διατήρηση ύλης». Ζήτησέ του να σου κάνει ερωτήσεις μέχρι να βρεις μόνος/η πού κάνεις λάθος.",
      "descriptionEn": "Open Khanmigo and tell it your explanation of \"Conservation of matter\". Ask it to keep asking you questions until you find the mistake yourself.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο το «Διατήρηση ύλης» με δικά σου λόγια, χρησιμοποιώντας ένα δικό σου παράδειγμα. Αν καταλαβαίνει από την εξήγησή σου, το έμαθες.",
      "descriptionEn": "Explain \"Conservation of matter\" to a parent or friend in your own words, using your own example. If they understand it from your explanation, you've learned it.",
      "toolId": null
    }
  ],
  "science-primary.heavier-falls-faster": [
    {
      "titleEl": "Σκέψου το φαινόμενο",
      "titleEn": "Think about the phenomenon",
      "descriptionEl": "Πριν διαβάσεις κάτι, προσπάθησε να εξηγήσεις με δικά σου λόγια το «Ελεύθερη πτώση». Μετά δες αν η εξήγησή σου πέφτει σε αυτή την παγίδα: Πιστεύει ότι τα βαρύτερα αντικείμενα πέφτουν πιο γρήγορα από τα ελαφρύτερα, μπερδεύοντας το βάρος με την αντίσταση του αέρα.",
      "descriptionEn": "Before reading anything, try to explain \"Free fall\" in your own words. Then compare it with the most common misconception on this topic: Believes heavier objects fall faster than lighter ones, confusing weight with air resistance.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες του την εξήγησή σου για «Ελεύθερη πτώση». Ζήτησέ του να σου κάνει ερωτήσεις μέχρι να βρεις μόνος/η πού κάνεις λάθος.",
      "descriptionEn": "Open Wolfram Alpha and tell it your explanation of \"Free fall\". Ask it to keep asking you questions until you find the mistake yourself.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο το «Ελεύθερη πτώση» με δικά σου λόγια, χρησιμοποιώντας ένα δικό σου παράδειγμα. Αν καταλαβαίνει από την εξήγησή σου, το έμαθες.",
      "descriptionEn": "Explain \"Free fall\" to a parent or friend in your own words, using your own example. If they understand it from your explanation, you've learned it.",
      "toolId": null
    }
  ],
  "science-primary.moon-own-light": [
    {
      "titleEl": "Σκέψου το φαινόμενο",
      "titleEn": "Think about the phenomenon",
      "descriptionEl": "Πριν διαβάσεις κάτι, προσπάθησε να εξηγήσεις με δικά σου λόγια το «Φως του φεγγαριού». Μετά δες αν η εξήγησή σου πέφτει σε αυτή την παγίδα: Πιστεύει ότι το φεγγάρι φωτίζει με το δικό του φως, ενώ στην πραγματικότητα αντανακλά το φως του Ήλιου.",
      "descriptionEn": "Before reading anything, try to explain \"Moonlight\" in your own words. Then compare it with the most common misconception on this topic: Believes the Moon shines with its own light, when it actually reflects sunlight.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες του την εξήγησή σου για «Φως του φεγγαριού». Ζήτησέ του να σου κάνει ερωτήσεις μέχρι να βρεις μόνος/η πού κάνεις λάθος.",
      "descriptionEn": "Open Khanmigo and tell it your explanation of \"Moonlight\". Ask it to keep asking you questions until you find the mistake yourself.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο το «Φως του φεγγαριού» με δικά σου λόγια, χρησιμοποιώντας ένα δικό σου παράδειγμα. Αν καταλαβαίνει από την εξήγησή σου, το έμαθες.",
      "descriptionEn": "Explain \"Moonlight\" to a parent or friend in your own words, using your own example. If they understand it from your explanation, you've learned it.",
      "toolId": null
    }
  ],
  "efl-primary.third-person-s": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Γ' πρόσωπο Ενεστώτα (-s)» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Παραλείπει το -s στο γ' ενικό πρόσωπο του Ενεστώτα, επειδή στα ελληνικά το πρόσωπο δηλώνεται διαφορετικά.",
      "descriptionEn": "Write 3-4 of your own sentences using \"3rd person -s\" and underline the spot where you feel unsure. The common trap here: Omits the 3rd-person -s in Present Simple, because Greek marks person differently on the verb.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Duolingo",
      "titleEn": "Ask Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Γ' πρόσωπο Ενεστώτα (-s)”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Duolingo, show it your sentences, and ask: \"Do I have this wrong on '3rd person -s'? Explain why, don't just correct them for me.\"",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Γ' πρόσωπο Ενεστώτα (-s)» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"3rd person -s\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-primary.age-construction": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Έκφραση ηλικίας» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Λέει «I have ten years» αντί για «I am ten years old», μεταφέροντας τη δομή της ελληνικής («είμαι δέκα χρονών»).",
      "descriptionEn": "Write 3-4 of your own sentences using \"Age expressions\" and underline the spot where you feel unsure. The common trap here: Says 'I have ten years' instead of 'I am ten years old,' transferring the Greek structure ('είμαι δέκα χρονών').",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Duolingo",
      "titleEn": "Ask Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Έκφραση ηλικίας”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Duolingo, show it your sentences, and ask: \"Do I have this wrong on 'Age expressions'? Explain why, don't just correct them for me.\"",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Έκφραση ηλικίας» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Age expressions\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-primary.definite-article-generic": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Άρθρο σε γενικές έννοιες» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Βάζει «the» μπροστά από γενικά ουσιαστικά στον πληθυντικό (π.χ. «the dogs» αντί για «dogs»), όπως γίνεται στα ελληνικά.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Article with generics\" and underline the spot where you feel unsure. The common trap here: Adds 'the' before generic plural nouns (e.g. 'the dogs' instead of 'dogs'), as is done in Greek.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Duolingo",
      "titleEn": "Ask Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Άρθρο σε γενικές έννοιες”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Duolingo, show it your sentences, and ask: \"Do I have this wrong on 'Article with generics'? Explain why, don't just correct them for me.\"",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Άρθρο σε γενικές έννοιες» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Article with generics\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-primary.phonetic-spelling": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Φωνητική γραφή αγγλικών» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Γράφει τις αγγλικές λέξεις όπως ακούγονται (π.χ. «becos» αντί για «because»), επειδή τα ελληνικά είναι πιο φωνητική γλώσσα.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Phonetic spelling\" and underline the spot where you feel unsure. The common trap here: Spells English words the way they sound (e.g. 'becos' instead of 'because'), because Greek is a more phonetic language.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Duolingo",
      "titleEn": "Ask Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Φωνητική γραφή αγγλικών”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Duolingo, show it your sentences, and ask: \"Do I have this wrong on 'Phonetic spelling'? Explain why, don't just correct them for me.\"",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Φωνητική γραφή αγγλικών» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Phonetic spelling\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-primary.false-friend-sympathetic": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «False friend: sympathetic» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Νομίζει ότι το «sympathetic» σημαίνει «συμπαθητικός» (=likeable), ενώ στα αγγλικά σημαίνει «γεμάτος κατανόηση».",
      "descriptionEn": "Write 3-4 of your own sentences using \"False friend: sympathetic\" and underline the spot where you feel unsure. The common trap here: Thinks 'sympathetic' means 'συμπαθητικός' (likeable), when in English it actually means 'showing compassion/understanding.'",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Duolingo",
      "titleEn": "Ask Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “False friend: sympathetic”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Duolingo, show it your sentences, and ask: \"Do I have this wrong on 'False friend: sympathetic'? Explain why, don't just correct them for me.\"",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «False friend: sympathetic» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"False friend: sympathetic\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "algebra.minus-sign": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Πρόσημο πλην» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Αντιμετωπίζει το πρόσημο «-» μόνο ως πράξη αφαίρεσης και όχι ως κομμάτι του όρου, με αποτέλεσμα να το «χάνει» όταν λύνει εξισώσεις.",
      "descriptionEn": "Solve 2-3 exercises on \"The minus sign\" by hand, writing out every step on paper. The most common trap on this topic: Treats the '-' sign only as a subtraction operation, not as part of the term, and 'loses' it when solving equations.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Πρόσημο πλην”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'The minus sign'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Πρόσημο πλην» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Wolfram Alpha.",
      "descriptionEn": "Make up a brand-new exercise on \"The minus sign\" and solve it without help. If you want, check your solution with Wolfram Alpha.",
      "toolId": null
    }
  ],
  "algebra.equals-balance": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Ισότητα ως ισορροπία» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Αντιμετωπίζει το «=» σαν «γράψε εδώ την απάντηση» αντί για «οι δύο πλευρές ισορροπούν», με αποτέλεσμα να κάνει πράξεις μόνο στη μία πλευρά.",
      "descriptionEn": "Solve 2-3 exercises on \"Equals as balance\" by hand, writing out every step on paper. The most common trap on this topic: Treats '=' as 'write the answer here' rather than 'both sides balance,' so performs operations on only one side.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Ισότητα ως ισορροπία”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Equals as balance'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Ισότητα ως ισορροπία» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Wolfram Alpha.",
      "descriptionEn": "Make up a brand-new exercise on \"Equals as balance\" and solve it without help. If you want, check your solution with Wolfram Alpha.",
      "toolId": null
    }
  ],
  "algebra.distribute-negative": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Επιμεριστική με αρνητικό» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Όταν διανέμει ένα αρνητικό πρόσημο σε παρένθεση, το εφαρμόζει μόνο στον πρώτο όρο, όχι σε όλους.",
      "descriptionEn": "Solve 2-3 exercises on \"Distributing a negative\" by hand, writing out every step on paper. The most common trap on this topic: When distributing a negative sign over parentheses, applies it only to the first term, not to all of them.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Επιμεριστική με αρνητικό”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Distributing a negative'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Επιμεριστική με αρνητικό» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Wolfram Alpha.",
      "descriptionEn": "Make up a brand-new exercise on \"Distributing a negative\" and solve it without help. If you want, check your solution with Wolfram Alpha.",
      "toolId": null
    }
  ],
  "algebra.pythagorean-add": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Πυθαγόρειο με κάθετη πλευρά» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Στο Πυθαγόρειο θεώρημα, προσθέτει πάντα τα τετράγωνα των δύο γνωστών πλευρών, ακόμα κι όταν ζητείται μια κάθετη πλευρά (όχι η υποτείνουσα).",
      "descriptionEn": "Solve 2-3 exercises on \"Pythagorean theorem, finding a leg\" by hand, writing out every step on paper. The most common trap on this topic: In the Pythagorean theorem, always adds the squares of the two known sides, even when solving for a leg (not the hypotenuse).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Πυθαγόρειο με κάθετη πλευρά”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Pythagorean theorem, finding a leg'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Πυθαγόρειο με κάθετη πλευρά» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Wolfram Alpha.",
      "descriptionEn": "Make up a brand-new exercise on \"Pythagorean theorem, finding a leg\" and solve it without help. If you want, check your solution with Wolfram Alpha.",
      "toolId": null
    }
  ],
  "history-gym.agia-lavra": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Έναρξη της Επανάστασης», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Start of the Revolution\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Έναρξη της Επανάστασης”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'Start of the Revolution'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "history-gym.greeks-united": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Ενότητα κατά την Επανάσταση», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Unity during the Revolution\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Ενότητα κατά την Επανάσταση”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'Unity during the Revolution'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "history-gym.filiki-etaireia-leaders": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Ίδρυση Φιλικής Εταιρείας», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Founding of the Filiki Etaireia\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Ίδρυση Φιλικής Εταιρείας”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'Founding of the Filiki Etaireia'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "history-gym.kryfo-sxoleio": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Εκπαίδευση επί Τουρκοκρατίας», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Education under Ottoman rule\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Εκπαίδευση επί Τουρκοκρατίας”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'Education under Ottoman rule'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "efl-gym.present-perfect-past-simple": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Present Perfect vs Past Simple» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Χρησιμοποιεί τον Present Perfect με χρονικούς προσδιορισμούς που δηλώνουν συγκεκριμένο παρελθόν (π.χ. «yesterday»), επειδή ο ελληνικός Παρακείμενος χρησιμοποιείται πιο ελεύθερα.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Present Perfect vs Past Simple\" and underline the spot where you feel unsure. The common trap here: Uses Present Perfect with time markers that indicate a specific past time (e.g. 'yesterday'), because the Greek Παρακείμενος is used more freely.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Gemini",
      "titleEn": "Ask Gemini",
      "descriptionEl": "Άνοιξε το Gemini, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Present Perfect vs Past Simple”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Gemini, show it your sentences, and ask: \"Do I have this wrong on 'Present Perfect vs Past Simple'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Present Perfect vs Past Simple» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Present Perfect vs Past Simple\" on your own, without any tool.",
      "toolId": "chatgpt"
    }
  ],
  "efl-gym.second-conditional-would": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Δεύτερος Υποθετικός» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Βάζει «would» και στις δύο προτάσεις μιας υποθετικής (π.χ. «If I would have money»), πιστεύοντας ότι ο υποθετικός δείκτης χρειάζεται και στις δύο πλευρές.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Second Conditional\" and underline the spot where you feel unsure. The common trap here: Puts 'would' in both clauses of a conditional (e.g. 'If I would have money'), believing the hypothetical marker is needed on both sides.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Gemini",
      "titleEn": "Ask Gemini",
      "descriptionEl": "Άνοιξε το Gemini, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Δεύτερος Υποθετικός”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Gemini, show it your sentences, and ask: \"Do I have this wrong on 'Second Conditional'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Δεύτερος Υποθετικός» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Second Conditional\" on your own, without any tool.",
      "toolId": "chatgpt"
    }
  ],
  "efl-gym.preposition-interference": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Προθέσεις» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Χρησιμοποιεί προθέσεις με άμεση μετάφραση από τα ελληνικά (π.χ. «discuss about» από το «συζητώ για»), αντί για τη σωστή αγγλική δομή.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Prepositions\" and underline the spot where you feel unsure. The common trap here: Uses prepositions transferred directly from Greek (e.g. 'discuss about' from 'συζητώ για'), instead of the correct English structure.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Gemini",
      "titleEn": "Ask Gemini",
      "descriptionEl": "Άνοιξε το Gemini, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Προθέσεις”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Gemini, show it your sentences, and ask: \"Do I have this wrong on 'Prepositions'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Προθέσεις» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Prepositions\" on your own, without any tool.",
      "toolId": "chatgpt"
    }
  ],
  "efl-gym.uncountable-nouns": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Μη μετρήσιμα ουσιαστικά» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Μεταχειρίζεται μη μετρήσιμα ουσιαστικά σαν να είναι μετρήσιμα (π.χ. «informations», «an advice»), επειδή τα αντίστοιχα ελληνικά ουσιαστικά μπαίνουν σε πληθυντικό.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Uncountable nouns\" and underline the spot where you feel unsure. The common trap here: Treats uncountable nouns as countable (e.g. 'informations', 'an advice'), because the corresponding Greek nouns can be pluralized.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Gemini",
      "titleEn": "Ask Gemini",
      "descriptionEl": "Άνοιξε το Gemini, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Μη μετρήσιμα ουσιαστικά”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Gemini, show it your sentences, and ask: \"Do I have this wrong on 'Uncountable nouns'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Μη μετρήσιμα ουσιαστικά» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Uncountable nouns\" on your own, without any tool.",
      "toolId": "chatgpt"
    }
  ],
  "ekthesi.unsupported-argument": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Τεκμηρίωση επιχειρήματος» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Πιστεύει ότι ένα δυνατό επιχείρημα είναι απλώς μια έντονα διατυπωμένη άποψη, χωρίς τεκμηρίωση ή επίκληση στη λογική.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Argument evidence\" and underline the spot where you feel unsure. The common trap here: Believes a strong argument is just a forcefully stated opinion, without evidence or an appeal to reason.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Τεκμηρίωση επιχειρήματος”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open ChatGPT, show it your sentences, and ask: \"Do I have this wrong on 'Argument evidence'? Explain why, don't just correct them for me.\"",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Τεκμηρίωση επιχειρήματος» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Argument evidence\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "ekthesi.text-type-ignore": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Κειμενικά είδη» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Γράφει το ίδιο γενικό δοκίμιο ανεξάρτητα από το είδος κειμένου που ζητείται (π.χ. επιστολή, ομιλία, άρθρο), αγνοώντας τον αποδέκτη και τον σκοπό.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Text types\" and underline the spot where you feel unsure. The common trap here: Writes the same generic essay regardless of the requested text type (e.g. letter, speech, article), ignoring the addressee and purpose.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Κειμενικά είδη”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open ChatGPT, show it your sentences, and ask: \"Do I have this wrong on 'Text types'? Explain why, don't just correct them for me.\"",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Κειμενικά είδη» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Text types\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "ekthesi.register-confusion": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Επίσημο ύφος» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Χρησιμοποιεί προφορικές/καθημερινές δομές σε επίσημο γραπτό λόγο (π.χ. «το πώς» αντί για «το ότι»), χωρίς να αντιλαμβάνεται τη διαφορά ύφους.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Formal register\" and underline the spot where you feel unsure. The common trap here: Uses colloquial/spoken structures in formal written language, without recognizing the difference in register.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Επίσημο ύφος”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open ChatGPT, show it your sentences, and ask: \"Do I have this wrong on 'Formal register'? Explain why, don't just correct them for me.\"",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Επίσημο ύφος» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Formal register\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "ekthesi.intro-conclusion-function": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Δομή κειμένου» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Νομίζει ότι ο πρόλογος πρέπει απλώς να επαναλαμβάνει την εκφώνηση και ότι ο επίλογος μπορεί να εισάγει νέα επιχειρήματα, αγνοώντας τη λειτουργία κάθε μέρους.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Text structure\" and underline the spot where you feel unsure. The common trap here: Thinks the introduction should simply restate the prompt and the conclusion can introduce new arguments, missing the function of each part.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Δομή κειμένου”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open ChatGPT, show it your sentences, and ask: \"Do I have this wrong on 'Text structure'? Explain why, don't just correct them for me.\"",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Δομή κειμένου» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Text structure\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "ekthesi.summary-copying": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Περίληψη» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Γράφει περίληψη αντιγράφοντας προτάσεις του κειμένου ή προσθέτοντας προσωπική άποψη, αντί να αναδιατυπώνει αντικειμενικά τις ιδέες του συγγραφέα.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Summarizing\" and underline the spot where you feel unsure. The common trap here: Writes a summary by copying sentences from the text or adding personal opinion, instead of objectively reformulating the author's ideas.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Περίληψη”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open ChatGPT, show it your sentences, and ask: \"Do I have this wrong on 'Summarizing'? Explain why, don't just correct them for me.\"",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Περίληψη» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Summarizing\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "functions.one-formula-only": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Έννοια συνάρτησης» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Πιστεύει ότι μια συνάρτηση πρέπει να δίνεται πάντα από έναν μοναδικό τύπο, απορρίπτοντας συναρτήσεις που ορίζονται με κλάδους ή πίνακες.",
      "descriptionEn": "Solve 2-3 exercises on \"Function concept\" by hand, writing out every step on paper. The most common trap on this topic: Believes a function must always be given by a single formula, rejecting piecewise- or table-defined functions.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Έννοια συνάρτησης”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Function concept'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Έννοια συνάρτησης» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με ChatGPT.",
      "descriptionEn": "Make up a brand-new exercise on \"Function concept\" and solve it without help. If you want, check your solution with ChatGPT.",
      "toolId": "chatgpt"
    }
  ],
  "functions.quadratic-always-two-roots": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Δευτεροβάθμια εξίσωση» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Πιστεύει ότι κάθε δευτεροβάθμια εξίσωση έχει πάντα δύο πραγματικές λύσεις, αγνοώντας τον ρόλο της διακρίνουσας.",
      "descriptionEn": "Solve 2-3 exercises on \"Quadratic equations\" by hand, writing out every step on paper. The most common trap on this topic: Believes every quadratic equation always has two real solutions, ignoring the role of the discriminant.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Δευτεροβάθμια εξίσωση”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Quadratic equations'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Δευτεροβάθμια εξίσωση» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με ChatGPT.",
      "descriptionEn": "Make up a brand-new exercise on \"Quadratic equations\" and solve it without help. If you want, check your solution with ChatGPT.",
      "toolId": "chatgpt"
    }
  ],
  "functions.sqrt-drops-absolute-value": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Τετραγωνική ρίζα & απόλυτη τιμή» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Πιστεύει ότι το √(x²) ισούται πάντα με x, αγνοώντας ότι η τετραγωνική ρίζα ενός τετραγώνου δίνει την απόλυτη τιμή.",
      "descriptionEn": "Solve 2-3 exercises on \"Square roots & absolute value\" by hand, writing out every step on paper. The most common trap on this topic: Believes √(x²) always equals x, ignoring that the square root of a square gives the absolute value.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Τετραγωνική ρίζα & απόλυτη τιμή”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Square roots & absolute value'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Τετραγωνική ρίζα & απόλυτη τιμή» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με ChatGPT.",
      "descriptionEn": "Make up a brand-new exercise on \"Square roots & absolute value\" and solve it without help. If you want, check your solution with ChatGPT.",
      "toolId": "chatgpt"
    }
  ],
  "functions.vertex-value-confusion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Μέγιστο/ελάχιστο συνάρτησης» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τη μέγιστη/ελάχιστη τιμή μιας συνάρτησης με το σημείο (x) στο οποίο αυτή εμφανίζεται.",
      "descriptionEn": "Solve 2-3 exercises on \"Function max/min\" by hand, writing out every step on paper. The most common trap on this topic: Confuses a function's maximum/minimum value with the x-point where it occurs.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Μέγιστο/ελάχιστο συνάρτησης”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Function max/min'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Μέγιστο/ελάχιστο συνάρτησης» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με ChatGPT.",
      "descriptionEn": "Make up a brand-new exercise on \"Function max/min\" and solve it without help. If you want, check your solution with ChatGPT.",
      "toolId": "chatgpt"
    }
  ],
  "functions.inequality-no-sign-flip": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Ανισώσεις» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Λύνει μια ανίσωση σαν να ήταν εξίσωση, χωρίς να αντιστρέφει τη φορά της ανισότητας όταν πολλαπλασιάζει/διαιρεί με αρνητικό αριθμό.",
      "descriptionEn": "Solve 2-3 exercises on \"Inequalities\" by hand, writing out every step on paper. The most common trap on this topic: Solves an inequality as if it were an equation, without flipping the inequality sign when multiplying/dividing by a negative number.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Ανισώσεις”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Inequalities'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Ανισώσεις» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με ChatGPT.",
      "descriptionEn": "Make up a brand-new exercise on \"Inequalities\" and solve it without help. If you want, check your solution with ChatGPT.",
      "toolId": "chatgpt"
    }
  ],
  "physics-lyk.motion-implies-force": [
    {
      "titleEl": "Σκέψου ένα παράδειγμα",
      "titleEn": "Think of an example",
      "descriptionEl": "Πριν ψάξεις οτιδήποτε, βρες ένα καθημερινό παράδειγμα για «1ος Νόμος Νεύτωνα» και προσπάθησε να το εξηγήσεις με δικά σου λόγια. Η πιο συχνή παρανόηση σε αυτό το θέμα: Πιστεύει ότι ένα κινούμενο σώμα χρειάζεται πάντα μια δύναμη προς την κατεύθυνση της κίνησής του, αγνοώντας τον 1ο νόμο του Νεύτωνα.",
      "descriptionEn": "Before looking anything up, find an everyday example related to \"Newton's First Law\" and try to explain it in your own words. Check whether you fall into this trap: Believes a moving object always needs a force in its direction of motion, ignoring Newton's 1st law.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και περιέγραψε το παράδειγμά σου. Ζήτησέ του να σε ρωτήσει «γιατί το πιστεύεις αυτό;» πριν σου δώσει την επιστημονική εξήγηση για «1ος Νόμος Νεύτωνα».",
      "descriptionEn": "Open Wolfram Alpha and describe your example. Ask it to question your reasoning first (\"why do you think that?\") before it gives you the scientific explanation of \"Newton's First Law\".",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο, με δικά σου λόγια, γιατί ισχύει το σωστό για «1ος Νόμος Νεύτωνα» και όχι αυτό που πίστευες πριν. Αν το εξηγήσεις καθαρά, το έμαθες.",
      "descriptionEn": "Explain to a parent or friend, in your own words, why the correct picture of \"Newton's First Law\" is true, and not what you believed before. If you can explain it clearly, you've learned it.",
      "toolId": "chatgpt-edu"
    }
  ],
  "physics-lyk.newton-third-law-bigger-force": [
    {
      "titleEl": "Σκέψου ένα παράδειγμα",
      "titleEn": "Think of an example",
      "descriptionEl": "Πριν ψάξεις οτιδήποτε, βρες ένα καθημερινό παράδειγμα για «3ος Νόμος Νεύτωνα» και προσπάθησε να το εξηγήσεις με δικά σου λόγια. Η πιο συχνή παρανόηση σε αυτό το θέμα: Πιστεύει ότι σε μια σύγκρουση το μεγαλύτερο/βαρύτερο σώμα ασκεί μεγαλύτερη δύναμη από το μικρότερο, αγνοώντας τον 3ο νόμο του Νεύτωνα.",
      "descriptionEn": "Before looking anything up, find an everyday example related to \"Newton's Third Law\" and try to explain it in your own words. Check whether you fall into this trap: Believes that in a collision, the bigger/heavier object exerts a greater force than the smaller one, ignoring Newton's 3rd law.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και περιέγραψε το παράδειγμά σου. Ζήτησέ του να σε ρωτήσει «γιατί το πιστεύεις αυτό;» πριν σου δώσει την επιστημονική εξήγηση για «3ος Νόμος Νεύτωνα».",
      "descriptionEn": "Open Wolfram Alpha and describe your example. Ask it to question your reasoning first (\"why do you think that?\") before it gives you the scientific explanation of \"Newton's Third Law\".",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο, με δικά σου λόγια, γιατί ισχύει το σωστό για «3ος Νόμος Νεύτωνα» και όχι αυτό που πίστευες πριν. Αν το εξηγήσεις καθαρά, το έμαθες.",
      "descriptionEn": "Explain to a parent or friend, in your own words, why the correct picture of \"Newton's Third Law\" is true, and not what you believed before. If you can explain it clearly, you've learned it.",
      "toolId": "chatgpt-edu"
    }
  ],
  "physics-lyk.force-energy-same": [
    {
      "titleEl": "Σκέψου ένα παράδειγμα",
      "titleEn": "Think of an example",
      "descriptionEl": "Πριν ψάξεις οτιδήποτε, βρες ένα καθημερινό παράδειγμα για «Δύναμη vs Ενέργεια» και προσπάθησε να το εξηγήσεις με δικά σου λόγια. Η πιο συχνή παρανόηση σε αυτό το θέμα: Μπερδεύει τη δύναμη με την ενέργεια, πιστεύοντας ότι ένα κινούμενο σώμα «έχει δύναμη» που «τελειώνει».",
      "descriptionEn": "Before looking anything up, find an everyday example related to \"Force vs Energy\" and try to explain it in your own words. Check whether you fall into this trap: Confuses force with energy, believing a moving object 'has force' that 'runs out.'",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και περιέγραψε το παράδειγμά σου. Ζήτησέ του να σε ρωτήσει «γιατί το πιστεύεις αυτό;» πριν σου δώσει την επιστημονική εξήγηση για «Δύναμη vs Ενέργεια».",
      "descriptionEn": "Open Wolfram Alpha and describe your example. Ask it to question your reasoning first (\"why do you think that?\") before it gives you the scientific explanation of \"Force vs Energy\".",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο, με δικά σου λόγια, γιατί ισχύει το σωστό για «Δύναμη vs Ενέργεια» και όχι αυτό που πίστευες πριν. Αν το εξηγήσεις καθαρά, το έμαθες.",
      "descriptionEn": "Explain to a parent or friend, in your own words, why the correct picture of \"Force vs Energy\" is true, and not what you believed before. If you can explain it clearly, you've learned it.",
      "toolId": "chatgpt-edu"
    }
  ],
  "physics-lyk.energy-used-up": [
    {
      "titleEl": "Σκέψου ένα παράδειγμα",
      "titleEn": "Think of an example",
      "descriptionEl": "Πριν ψάξεις οτιδήποτε, βρες ένα καθημερινό παράδειγμα για «Διατήρηση ενέργειας» και προσπάθησε να το εξηγήσεις με δικά σου λόγια. Η πιο συχνή παρανόηση σε αυτό το θέμα: Πιστεύει ότι η ενέργεια «χρησιμοποιείται και εξαφανίζεται», αντί να μεταφέρεται σε άλλη μορφή σύμφωνα με την αρχή διατήρησης της ενέργειας.",
      "descriptionEn": "Before looking anything up, find an everyday example related to \"Conservation of energy\" and try to explain it in your own words. Check whether you fall into this trap: Believes energy 'gets used up and disappears,' instead of being transferred to another form per the conservation of energy.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και περιέγραψε το παράδειγμά σου. Ζήτησέ του να σε ρωτήσει «γιατί το πιστεύεις αυτό;» πριν σου δώσει την επιστημονική εξήγηση για «Διατήρηση ενέργειας».",
      "descriptionEn": "Open Wolfram Alpha and describe your example. Ask it to question your reasoning first (\"why do you think that?\") before it gives you the scientific explanation of \"Conservation of energy\".",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο, με δικά σου λόγια, γιατί ισχύει το σωστό για «Διατήρηση ενέργειας» και όχι αυτό που πίστευες πριν. Αν το εξηγήσεις καθαρά, το έμαθες.",
      "descriptionEn": "Explain to a parent or friend, in your own words, why the correct picture of \"Conservation of energy\" is true, and not what you believed before. If you can explain it clearly, you've learned it.",
      "toolId": "chatgpt-edu"
    }
  ],
  "physics-lyk.constant-velocity-needs-force": [
    {
      "titleEl": "Σκέψου ένα παράδειγμα",
      "titleEn": "Think of an example",
      "descriptionEl": "Πριν ψάξεις οτιδήποτε, βρες ένα καθημερινό παράδειγμα για «Συνισταμένη δύναμη» και προσπάθησε να το εξηγήσεις με δικά σου λόγια. Η πιο συχνή παρανόηση σε αυτό το θέμα: Πιστεύει ότι για να κινείται ένα σώμα με σταθερή ταχύτητα χρειάζεται μια συνεχή, μη μηδενική συνισταμένη δύναμη.",
      "descriptionEn": "Before looking anything up, find an everyday example related to \"Net force\" and try to explain it in your own words. Check whether you fall into this trap: Believes a constant net force is needed to keep an object moving at a steady velocity.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και περιέγραψε το παράδειγμά σου. Ζήτησέ του να σε ρωτήσει «γιατί το πιστεύεις αυτό;» πριν σου δώσει την επιστημονική εξήγηση για «Συνισταμένη δύναμη».",
      "descriptionEn": "Open Wolfram Alpha and describe your example. Ask it to question your reasoning first (\"why do you think that?\") before it gives you the scientific explanation of \"Net force\".",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο, με δικά σου λόγια, γιατί ισχύει το σωστό για «Συνισταμένη δύναμη» και όχι αυτό που πίστευες πριν. Αν το εξηγήσεις καθαρά, το έμαθες.",
      "descriptionEn": "Explain to a parent or friend, in your own words, why the correct picture of \"Net force\" is true, and not what you believed before. If you can explain it clearly, you've learned it.",
      "toolId": "chatgpt-edu"
    }
  ],
  "history-lyk.kryfo-sxoleio-ban": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Εκπαίδευση επί Τουρκοκρατίας», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Education under Ottoman rule\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Εκπαίδευση επί Τουρκοκρατίας”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'Education under Ottoman rule'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "history-lyk.1922-military-defeat-only": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Μικρασιατική Καταστροφή», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"The Asia Minor Catastrophe\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Μικρασιατική Καταστροφή”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'The Asia Minor Catastrophe'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "history-lyk.refugee-spontaneous": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Συνθήκη της Λωζάνης», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Treaty of Lausanne\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Συνθήκη της Λωζάνης”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'Treaty of Lausanne'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "history-lyk.greeks-majority-asia-minor": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Πληθυσμοί Μικράς Ασίας», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Asia Minor populations\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Πληθυσμοί Μικράς Ασίας”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'Asia Minor populations'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "efl-lyk.present-perfect-discourse": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Χρόνοι σε αφήγηση» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Συνεχίζει να χρησιμοποιεί τον Present Perfect για συγκεκριμένες λεπτομέρειες στο παρελθόν, αντί να περνάει στον Past Simple, λόγω επιρροής του ελληνικού Παρακείμενου.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Tenses in narrative\" and underline the spot where you feel unsure. The common trap here: Keeps using Present Perfect for specific past details instead of switching to Past Simple, due to influence from the Greek Παρακείμενος.",
      "toolId": null
    },
    {
      "titleEl": "Έλεγξε με το Grammarly",
      "titleEn": "Check with Grammarly",
      "descriptionEl": "Επικόλλησε τις προτάσεις σου στο Grammarly και δες τι υπογραμμίζει για «Χρόνοι σε αφήγηση». Σκέψου μόνος/η γιατί, πριν δεις τη διόρθωση που προτείνει.",
      "descriptionEn": "Paste your sentences into Grammarly and see what it underlines for \"Tenses in narrative\". Think through why yourself before looking at the correction it suggests.",
      "toolId": "grammarly"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Χρόνοι σε αφήγηση» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Tenses in narrative\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-lyk.reported-speech-backshift": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Πλάγιος λόγος» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Δεν εφαρμόζει τη μετατόπιση χρόνου (backshift) στον πλάγιο λόγο, αφήνοντας τα ρήματα στον ίδιο χρόνο με τον ευθύ λόγο.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Reported speech\" and underline the spot where you feel unsure. The common trap here: Doesn't apply tense backshift in reported speech, leaving verbs in the same tense as the direct speech.",
      "toolId": null
    },
    {
      "titleEl": "Έλεγξε με το Grammarly",
      "titleEn": "Check with Grammarly",
      "descriptionEl": "Επικόλλησε τις προτάσεις σου στο Grammarly και δες τι υπογραμμίζει για «Πλάγιος λόγος». Σκέψου μόνος/η γιατί, πριν δεις τη διόρθωση που προτείνει.",
      "descriptionEn": "Paste your sentences into Grammarly and see what it underlines for \"Reported speech\". Think through why yourself before looking at the correction it suggests.",
      "toolId": "grammarly"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Πλάγιος λόγος» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Reported speech\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-lyk.false-friends-advanced": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Προχωρημένα False Friends» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Μπερδεύει προχωρημένες αγγλικές λέξεις με τα ελληνικά «ψευδόφιλά» τους (π.χ. «actually» = «τώρα» αντί για «στην πραγματικότητα»).",
      "descriptionEn": "Write 3-4 of your own sentences using \"Advanced false friends\" and underline the spot where you feel unsure. The common trap here: Confuses advanced English words with their Greek 'false friends' (e.g. 'actually' = 'currently' instead of 'in fact').",
      "toolId": null
    },
    {
      "titleEl": "Έλεγξε με το Grammarly",
      "titleEn": "Check with Grammarly",
      "descriptionEl": "Επικόλλησε τις προτάσεις σου στο Grammarly και δες τι υπογραμμίζει για «Προχωρημένα False Friends». Σκέψου μόνος/η γιατί, πριν δεις τη διόρθωση που προτείνει.",
      "descriptionEn": "Paste your sentences into Grammarly and see what it underlines for \"Advanced false friends\". Think through why yourself before looking at the correction it suggests.",
      "toolId": "grammarly"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Προχωρημένα False Friends» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Advanced false friends\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-lyk.since-for-confusion": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Since vs For» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Μπερδεύει το «since» με το «for» σε προτάσεις διάρκειας, επειδή τα ελληνικά δεν κάνουν την ίδια διάκριση.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Since vs For\" and underline the spot where you feel unsure. The common trap here: Confuses 'since' with 'for' in duration sentences, because Greek doesn't make the same distinction.",
      "toolId": null
    },
    {
      "titleEl": "Έλεγξε με το Grammarly",
      "titleEn": "Check with Grammarly",
      "descriptionEl": "Επικόλλησε τις προτάσεις σου στο Grammarly και δες τι υπογραμμίζει για «Since vs For». Σκέψου μόνος/η γιατί, πριν δεις τη διόρθωση που προτείνει.",
      "descriptionEn": "Paste your sentences into Grammarly and see what it underlines for \"Since vs For\". Think through why yourself before looking at the correction it suggests.",
      "toolId": "grammarly"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Since vs For» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Since vs For\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-lyk.preposition-collocation": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Collocations με προθέσεις» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Χρησιμοποιεί λάθος προθέσεις σε συνδυασμούς επιθέτου/ρήματος (π.χ. «interested for» αντί για «interested in»), λόγω μετάφρασης από τα ελληνικά.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Preposition collocations\" and underline the spot where you feel unsure. The common trap here: Uses the wrong preposition in adjective/verb collocations (e.g. 'interested for' instead of 'interested in'), due to translation from Greek.",
      "toolId": null
    },
    {
      "titleEl": "Έλεγξε με το Grammarly",
      "titleEn": "Check with Grammarly",
      "descriptionEl": "Επικόλλησε τις προτάσεις σου στο Grammarly και δες τι υπογραμμίζει για «Collocations με προθέσεις». Σκέψου μόνος/η γιατί, πριν δεις τη διόρθωση που προτείνει.",
      "descriptionEn": "Paste your sentences into Grammarly and see what it underlines for \"Preposition collocations\". Think through why yourself before looking at the correction it suggests.",
      "toolId": "grammarly"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Collocations με προθέσεις» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Preposition collocations\" on your own, without any tool.",
      "toolId": null
    }
  ],

  "math-a-gym.rational-number-order": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Διάταξη ρητών αριθμών» με το χέρι, γράφοντάς τους σε αριθμογραμμή. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να συγκρίνει αρνητικούς με θετικούς αριθμούς, πιστεύοντας συχνά ότι το -8 είναι μεγαλύτερο από το -3.",
      "descriptionEn": "Solve 2-3 exercises on \"Ordering rational numbers\" by hand, placing them on a number line. The most common trap on this topic: Struggles to compare negative with positive numbers, often believing -8 is bigger than -3.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Διάταξη ρητών αριθμών”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Ordering rational numbers'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση με 4 ρητούς αριθμούς (θετικούς και αρνητικούς) και βάλ' τους σε σωστή σειρά χωρίς βοήθεια.",
      "descriptionEn": "Make up a brand-new exercise with 4 rational numbers (positive and negative) and put them in the correct order without help.",
      "toolId": null
    }
  ],

  "math-a-gym.absolute-value": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Απόλυτη τιμή» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Πιστεύει ότι η απόλυτη τιμή ενός αρνητικού αριθμού παραμένει αρνητική, αντί να καταλαβαίνει ότι είναι η απόστασή του από το μηδέν.",
      "descriptionEn": "Solve 2-3 exercises on \"Absolute value\" by hand, writing out every step. The most common trap on this topic: Believes the absolute value of a negative number stays negative, instead of understanding it's the distance from zero.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Απόλυτη τιμή”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Absolute value'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση με απόλυτες τιμές θετικών και αρνητικών αριθμών και λύσε την χωρίς βοήθεια.",
      "descriptionEn": "Make up a brand-new exercise with absolute values of positive and negative numbers and solve it without help.",
      "toolId": null
    }
  ],

  "math-a-gym.gcd-lcm-confusion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «ΜΚΔ vs ΕΚΠ» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τον Μέγιστο Κοινό Διαιρέτη (μικρότερος αριθμός) με το Ελάχιστο Κοινό Πολλαπλάσιο (μεγαλύτερος αριθμός).",
      "descriptionEn": "Solve 2-3 exercises on \"GCD vs LCM\" by hand, writing out every step. The most common trap on this topic: Confuses the Greatest Common Divisor (smaller number) with the Least Common Multiple (bigger number).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “ΜΚΔ vs ΕΚΠ”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'GCD vs LCM'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η δύο ζευγάρια αριθμών και βρες το ΜΚΔ και το ΕΚΠ του καθενός χωρίς βοήθεια.",
      "descriptionEn": "Make up two pairs of numbers yourself and find the GCD and LCM of each without help.",
      "toolId": null
    }
  ],

  "math-a-gym.proportion-intro": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Εισαγωγή σε αναλογίες» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει ότι σε μια αναλογία δύο κλάσματα είναι ίσα, και προσπαθεί να τη λύσει με τυχαία πράξη αντί για γινόμενο άκρων-μέσων.",
      "descriptionEn": "Solve 2-3 exercises on \"Introduction to proportions\" by hand, writing out every step. The most common trap on this topic: Doesn't understand that in a proportion two fractions are equal, and tries to solve it with a random operation instead of cross-multiplication.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Εισαγωγή σε αναλογίες”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Introduction to proportions'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα αναλογία με άγνωστο όρο και λύσε την με γινόμενο άκρων-μέσων, χωρίς βοήθεια.",
      "descriptionEn": "Make up a new proportion with an unknown term and solve it using cross-multiplication, without help.",
      "toolId": null
    }
  ],

  "math-b-gym.monomial-like-terms": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Όμοιοι μονόμιοι όροι» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Προσπαθεί να προσθέσει μονώνυμα με διαφορετικό κύριο μέρος (π.χ. 3x + 2x²) σαν να ήταν όμοιοι όροι.",
      "descriptionEn": "Solve 2-3 exercises on \"Like monomial terms\" by hand, writing out every step. The most common trap on this topic: Tries to add monomials with a different variable part (e.g. 3x + 2x²) as if they were like terms.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Όμοιοι μονόμιοι όροι”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Like monomial terms'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα παράσταση με μονώνυμα, απλοποίησέ την με το χέρι, και μετά έλεγξε τη λύση σου στο Wolfram Alpha.",
      "descriptionEn": "Make up a new expression with monomials, simplify it by hand, then check your solution with Wolfram Alpha.",
      "toolId": "wolfram-alpha"
    }
  ],

  "math-b-gym.identity-square-sum": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Ταυτότητα (α+β)²» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Απλοποιεί λανθασμένα το (α+β)² σε α²+β², ξεχνώντας τον διπλό όρο 2αβ.",
      "descriptionEn": "Solve 2-3 exercises on the \"(a+b)² identity\" by hand, writing out every step. The most common trap on this topic: Incorrectly simplifies (a+b)² to a²+b², forgetting the middle term 2ab.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Ταυτότητα (α+β)²”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with the '(a+b)² identity'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ανάπτυξε μόνος/η μια νέα παράσταση (α+β)² με το χέρι, και μετά έλεγξε τη λύση σου στο Wolfram Alpha.",
      "descriptionEn": "Expand a new (a+b)² expression by hand yourself, then check your solution with Wolfram Alpha.",
      "toolId": "wolfram-alpha"
    }
  ],

  "math-b-gym.pythagorean-application": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Εφαρμογή Πυθαγορείου θεωρήματος» με το χέρι, σχεδιάζοντας πρώτα το τρίγωνο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ποια πλευρά είναι η υποτείνουσα σε ένα ορθογώνιο τρίγωνο, και συχνά προσθέτει τα τετράγωνα λάθος πλευρών.",
      "descriptionEn": "Solve 2-3 exercises on \"Applying the Pythagorean theorem\" by hand, drawing the triangle first. The most common trap on this topic: Doesn't know which side is the hypotenuse in a right triangle, and often adds the squares of the wrong sides.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Εφαρμογή Πυθαγορείου θεωρήματος”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Applying the Pythagorean theorem'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Σχεδίασε μόνος/η ένα νέο ορθογώνιο τρίγωνο με δικά σου μήκη, βρες την τρίτη πλευρά με το χέρι, και έλεγξε τη λύση σου στο Wolfram Alpha.",
      "descriptionEn": "Draw a new right triangle with your own side lengths, find the third side by hand, and check your solution with Wolfram Alpha.",
      "toolId": "wolfram-alpha"
    }
  ],

  "math-b-gym.linear-equation-basic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Βασική εξίσωση 1ου βαθμού» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Όταν λύνει μια απλή εξίσωση, δεν εφαρμόζει την ίδια πράξη και στα δύο μέλη, χαλώντας την ισότητα.",
      "descriptionEn": "Solve 2-3 exercises on \"Basic first-degree equations\" by hand, writing out every step. The most common trap on this topic: When solving a simple equation, doesn't apply the same operation to both sides, breaking the equality.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Βασική εξίσωση 1ου βαθμού”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Basic first-degree equations'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα εξίσωση 1ου βαθμού, λύσε την με το χέρι, και έλεγξε τη λύση σου στο Wolfram Alpha.",
      "descriptionEn": "Make up a new first-degree equation, solve it by hand, and check your solution with Wolfram Alpha.",
      "toolId": "wolfram-alpha"
    }
  ],

  "glossa-a-gym.parts-of-speech": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Πάρε 2-3 προτάσεις από το βιβλίο σου και υπογράμμισε ουσιαστικά, επίθετα, ρήματα και επιρρήματα με διαφορετικό χρώμα. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να ξεχωρίσει τα μέρη του λόγου (ουσιαστικό, επίθετο, ρήμα, επίρρημα) μέσα σε μια πρόταση.",
      "descriptionEn": "Take 2-3 sentences from your textbook and underline nouns, adjectives, verbs, and adverbs in different colors. The most common trap on this topic: Struggles to tell apart parts of speech (noun, adjective, verb, adverb) within a sentence.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Μέρη του λόγου”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Δούλεψε μαζί του 2 νέες προτάσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Parts of speech'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new sentences this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Γράψε μόνος/η μια νέα πρόταση με τουλάχιστον 4 διαφορετικά μέρη του λόγου και εντόπισέ τα χωρίς βοήθεια.",
      "descriptionEn": "Write a new sentence of your own with at least 4 different parts of speech and identify them without help.",
      "toolId": null
    }
  ],

  "glossa-a-gym.opinion-vs-fact": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Διάβασε ένα σύντομο άρθρο και σημείωσε ποιες προτάσεις είναι γεγονότα και ποιες είναι απόψεις. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξεχωρίζει μια αντικειμενική πληροφορία (γεγονός) από μια προσωπική άποψη μέσα σε ένα κείμενο.",
      "descriptionEn": "Read a short article and note which sentences are facts and which are opinions. The most common trap on this topic: Doesn't distinguish objective information (a fact) from a personal opinion within a text.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Άποψη vs Γεγονός”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Δούλεψε μαζί του 2 νέα κείμενα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Opinion vs Fact'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new texts this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Γράψε μόνος/η μία πρόταση-γεγονός και μία πρόταση-άποψη πάνω στο ίδιο θέμα, και εξήγησε τη διαφορά τους.",
      "descriptionEn": "Write your own fact sentence and opinion sentence on the same topic, and explain the difference between them.",
      "toolId": null
    }
  ],

  "glossa-a-gym.paragraph-argument-basic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε μια σύντομη παράγραφο με τη γνώμη σου για ένα θέμα που σε ενδιαφέρει. Η πιο συχνή παγίδα σε αυτό το θέμα: Όταν εκφράζει άποψη, δεν την υποστηρίζει με κανέναν λόγο, απλώς την επαναλαμβάνει με διαφορετικά λόγια.",
      "descriptionEn": "Write a short paragraph with your opinion on a topic you care about. The most common trap on this topic: When expressing an opinion, doesn't support it with any reason, just repeats it in different words.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Βασικό επιχειρηματολογικό κείμενο”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Δούλεψε μαζί του την παράγραφό σου με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Basic argumentative paragraph'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on your paragraph this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Ξαναγράψε την παράγραφό σου προσθέτοντας έναν συγκεκριμένο λόγο («γιατί») που υποστηρίζει τη γνώμη σου, χωρίς βοήθεια.",
      "descriptionEn": "Rewrite your paragraph adding one specific reason (\"because\") that supports your opinion, without help.",
      "toolId": null
    }
  ],

  "glossa-a-gym.verb-mood-basic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 3 προτάσεις στην οριστική (π.χ. «Ο Γιάννης διαβάζει») και 3 στην προστακτική (π.χ. «Διάβασε!»). Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξεχωρίζει την οριστική (δήλωση γεγονότος) από την προστακτική (διαταγή/παράκληση) έγκλιση του ρήματος.",
      "descriptionEn": "Write 3 sentences in the indicative mood (e.g. \"John reads\") and 3 in the imperative (e.g. \"Read!\"). The most common trap on this topic: Doesn't distinguish the indicative (stating a fact) from the imperative (command/request) verb mood.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Έγκλιση ρήματος”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Δούλεψε μαζί του 2 νέες προτάσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Verb mood'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new sentences this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Πάρε μια πρόταση στην οριστική από το βιβλίο σου και μετάτρεψέ την σε προστακτική, χωρίς βοήθεια.",
      "descriptionEn": "Take an indicative-mood sentence from your textbook and convert it to imperative, without help.",
      "toolId": null
    }
  ],

  "glossa-b-gym.essay-intro-function": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε έναν σύντομο πρόλογο (2-3 προτάσεις) για ένα δοκίμιο πάνω σε θέμα που σου δίνει το σχολείο. Η πιο συχνή παγίδα σε αυτό το θέμα: Νομίζει ότι ο πρόλογος ενός δοκιμίου πρέπει να αναλύει ήδη το θέμα σε βάθος, αντί απλώς να το εισάγει.",
      "descriptionEn": "Write a short introduction (2-3 sentences) for an essay on a topic your school gave you. The most common trap on this topic: Thinks an essay's introduction should already analyze the topic in depth, instead of simply introducing it.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Λειτουργία πρόλογου δοκιμίου”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμο πρόλογο.» Δούλεψε μαζί του τον πρόλογό σου με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'The function of an essay introduction'. Ask me questions so I can figure it out myself, don't just hand me a ready-made intro.\" Work on your introduction this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Επικόλλησε τον πρόλογό σου στο ChatGPT και ρώτα: «Ο πρόλογός μου απλώς εισάγει το θέμα ή αναλύει ήδη πολύ; Πες μου γιατί, μη μου τον ξαναγράψεις.»",
      "descriptionEn": "Paste your introduction into ChatGPT and ask: \"Does my intro just introduce the topic, or does it already analyze too much? Tell me why, don't rewrite it for me.\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-b-gym.text-types-purpose": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Διάλεξε δύο διαφορετικά κειμενικά είδη (π.χ. επιστολή διαμαρτυρίας και προσωπικό ημερολόγιο) και γράψε τι σκοπό εξυπηρετεί το καθένα. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν συνδέει το είδος ενός κειμένου με τον σκοπό και το ύφος που του ταιριάζει.",
      "descriptionEn": "Pick two different text types (e.g. a protest letter and a personal diary entry) and write what purpose each one serves. The most common trap on this topic: Doesn't connect a text's type with the purpose and style that fit it.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Σκοπός κειμενικού είδους”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα κειμενικά είδη με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'The purpose of text types'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new text types this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Γράψε δύο προτάσεις σε λάθος ύφος για ένα κειμενικό είδος (π.χ. πολύ επίσημο ύφος σε προσωπικό ημερολόγιο) και ρώτα το ChatGPT: «Ταιριάζει αυτό το ύφος σε αυτό το είδος κειμένου; Γιατί όχι;»",
      "descriptionEn": "Write two sentences in the wrong style for a text type (e.g. very formal style in a personal diary) and ask ChatGPT: \"Does this style fit this text type? Why not?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-b-gym.argument-vs-evidence": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Πάρε μια παράγραφο επιχειρηματολογίας από το βιβλίο σου και υπογράμμισε ξεχωριστά το επιχείρημα (τη γενική θέση) και το τεκμήριο (το συγκεκριμένο στοιχείο). Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει το επιχείρημα με το τεκμήριο που το στηρίζει.",
      "descriptionEn": "Take an argumentative paragraph from your textbook and separately underline the argument (the general claim) and the evidence (the specific supporting detail). The most common trap on this topic: Confuses the argument with the evidence that supports it.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Επιχείρημα vs Τεκμήριο”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέες παραγράφους με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Argument vs Evidence'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new paragraphs this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Γράψε μόνος/η ένα επιχείρημα με ένα τεκμήριο πάνω σε θέμα της επιλογής σου, και ρώτα το ChatGPT: «Ποιο κομμάτι είναι το επιχείρημα και ποιο το τεκμήριο εδώ; Έγραψα σωστά και τα δύο;»",
      "descriptionEn": "Write your own argument with one piece of evidence on a topic of your choice, and ask ChatGPT: \"Which part is the argument and which is the evidence here? Did I write both correctly?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-b-gym.summary-vs-opinion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Διάβασε ένα σύντομο κείμενο και γράψε ξεχωριστά μια αντικειμενική περίληψή του και ένα προσωπικό σχόλιο πάνω σε αυτό. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει την αντικειμενική περίληψη ενός κειμένου με το προσωπικό σχόλιο πάνω σε αυτό.",
      "descriptionEn": "Read a short text and write a separate objective summary of it and a personal comment on it. The most common trap on this topic: Confuses an objective summary of a text with a personal comment on it.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Περίληψη vs Σχόλιο”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη περίληψη.» Δούλεψε μαζί του ένα νέο κείμενο με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Summary vs Opinion'. Ask me questions so I can figure it out myself, don't just hand me a ready-made summary.\" Work through a new text this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Επικόλλησε την περίληψη και το σχόλιό σου στο ChatGPT και ρώτα: «Η περίληψή μου έχει μέσα προσωπική γνώμη κατά λάθος; Πες μου πού, μη μου την ξαναγράψεις.»",
      "descriptionEn": "Paste your summary and your comment into ChatGPT and ask: \"Does my summary accidentally include personal opinion? Tell me where, don't rewrite it for me.\"",
      "toolId": "chatgpt"
    }
  ],

  "physics-g-gym.ohms-law": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 απλά κυκλώματα με γνωστή τάση και αντίσταση, και υπολόγισε την ένταση με το χέρι χρησιμοποιώντας τον τύπο V=IR. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει τη σχέση ανάμεσα σε τάση, ένταση και αντίσταση (V=IR), και δεν ξέρει τι συμβαίνει στην ένταση αν αυξηθεί η αντίσταση.",
      "descriptionEn": "Write 2-3 simple circuits with known voltage and resistance, and calculate the current by hand using V=IR. The most common trap on this topic: Doesn't understand the relationship between voltage, current, and resistance (V=IR), and doesn't know what happens to current when resistance increases.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Νόμος του Ωμ\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Ohm's Law'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Πάρε ένα κύκλωμα που έλυσες και έλεγξε την τιμή της έντασης στο Wolfram Alpha, γράφοντας 'V=IR solve for I' με τις δικές σου τιμές.",
      "descriptionEn": "Take a circuit you solved and check the current value in Wolfram Alpha by typing 'V=IR solve for I' with your own values.",
      "toolId": "wolfram-alpha"
    }
  ],

  "physics-g-gym.speed-velocity-formula": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 προβλήματα κίνησης με το χέρι, εφαρμόζοντας τον τύπο ταχύτητα = απόσταση / χρόνος. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τον τύπο της ταχύτητας (απόσταση/χρόνος), εφαρμόζοντάς τον λανθασμένα σε προβλήματα κίνησης.",
      "descriptionEn": "Solve 2-3 motion problems by hand, applying the formula speed = distance / time. The most common trap on this topic: Confuses the speed formula (distance/time), applying it incorrectly in motion problems.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Τύπος ταχύτητας\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Speed formula'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Πάρε ένα πρόβλημα που έλυσες και έλεγξε το αποτέλεσμα στο Wolfram Alpha.",
      "descriptionEn": "Take a problem you solved and check the result in Wolfram Alpha.",
      "toolId": "wolfram-alpha"
    }
  ],

  "physics-g-gym.energy-transformation": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Διάλεξε 3 συσκευές του σπιτιού σου (π.χ. λάμπα, σόμπα, ηχείο) και γράψε ποια μετατροπή ενέργειας γίνεται στην καθεμία. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει τις μετατροπές ενέργειας σε καθημερινές συσκευές (π.χ. ηλεκτρική σε φωτεινή/θερμική).",
      "descriptionEn": "Pick 3 devices from your home (e.g. lamp, heater, speaker) and write which energy transformation happens in each. The most common trap on this topic: Doesn't recognize energy transformations in everyday devices (e.g. electrical to light/heat).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Μετατροπή ενέργειας\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Energy transformation'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ρώτα το Wolfram Alpha να σου δείξει τη μετατροπή ενέργειας μιας συσκευής που διάλεξες, και σύγκρινε με τη δική σου απάντηση.",
      "descriptionEn": "Ask Wolfram Alpha to show you the energy transformation of a device you picked, and compare it with your own answer.",
      "toolId": "wolfram-alpha"
    }
  ],

  "chimeia-g-gym.element-vs-compound": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 3 παραδείγματα χημικών στοιχείων (π.χ. Οξυγόνο, Σίδηρος) και 3 παραδείγματα χημικών ενώσεων (π.χ. Νερό, Αλάτι), εξηγώντας τη διαφορά με δικά σου λόγια. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει το χημικό στοιχείο (ένα είδος ατόμου) με τη χημική ένωση (συνδυασμός διαφορετικών ατόμων).",
      "descriptionEn": "Write 3 examples of chemical elements (e.g. Oxygen, Iron) and 3 examples of chemical compounds (e.g. Water, Salt), explaining the difference in your own words. The most common trap on this topic: Confuses a chemical element (one type of atom) with a chemical compound (a combination of different atoms).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Στοιχείο vs Ένωση\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Element vs Compound'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ρώτα το Wolfram Alpha για τον χημικό τύπο μιας ένωσης που έγραψες, και δες από πόσα διαφορετικά στοιχεία αποτελείται.",
      "descriptionEn": "Ask Wolfram Alpha for the chemical formula of a compound you wrote, and see how many different elements it's made of.",
      "toolId": "wolfram-alpha"
    }
  ],

  "chimeia-g-gym.mixture-vs-compound": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 3 παραδείγματα μειγμάτων (π.χ. αλατόνερο, σαλάτα) και 3 παραδείγματα χημικών ενώσεων, εξηγώντας γιατί διαφέρουν. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξεχωρίζει ένα μείγμα (τα συστατικά διατηρούν τις ιδιότητές τους) από μια χημική ένωση (νέα ουσία με νέες ιδιότητες).",
      "descriptionEn": "Write 3 examples of mixtures (e.g. saltwater, salad) and 3 examples of chemical compounds, explaining why they differ. The most common trap on this topic: Doesn't distinguish a mixture (components keep their properties) from a chemical compound (a new substance with new properties).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Μείγμα vs Ένωση\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Mixture vs Compound'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ρώτα το Wolfram Alpha αν ένα υλικό που διάλεξες (π.χ. αλατόνερο) είναι μείγμα ή ένωση, και έλεγξε τη δική σου απάντηση.",
      "descriptionEn": "Ask Wolfram Alpha whether a material you picked (e.g. saltwater) is a mixture or a compound, and check your own answer.",
      "toolId": "wolfram-alpha"
    }
  ],

  "chimeia-g-gym.atom-structure": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Σχεδίασε ένα απλό άτομο (π.χ. άνθρακα) και σημείωσε πού βρίσκονται τα πρωτόνια, τα νετρόνια και τα ηλεκτρόνια. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν θυμάται πού βρίσκονται τα πρωτόνια, τα νετρόνια και τα ηλεκτρόνια μέσα στο άτομο.",
      "descriptionEn": "Draw a simple atom (e.g. carbon) and mark where the protons, neutrons, and electrons are. The most common trap on this topic: Doesn't recall where protons, neutrons, and electrons are located within the atom.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Δομή του ατόμου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Structure of the atom'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ρώτα το Wolfram Alpha 'atomic structure of carbon' και σύγκρινε με το σχέδιό σου.",
      "descriptionEn": "Ask Wolfram Alpha 'atomic structure of carbon' and compare it with your drawing.",
      "toolId": "wolfram-alpha"
    }
  ],

  "istoria-a-gym.bronze-age-civilizations": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Φτιάξε έναν πίνακα με 3 στήλες (Κυκλαδικός, Μινωικός, Μυκηναϊκός) και γράψε από τη μνήμη σου πού αναπτύχθηκε ο καθένας και ένα χαρακτηριστικό του. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τον Κυκλαδικό, τον Μινωικό και τον Μυκηναϊκό πολιτισμό μεταξύ τους, χωρίς να ξέρει ποιος αναπτύχθηκε πού.",
      "descriptionEn": "Make a 3-column table (Cycladic, Minoan, Mycenaean) and write from memory where each developed and one characteristic of each. The most common trap on this topic: Confuses the Cycladic, Minoan, and Mycenaean civilizations with each other, without knowing which developed where.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Πολιτισμοί Εποχής Χαλκού\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Bronze Age civilizations'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε σε ένα φίλο σου με 3-4 προτάσεις το θέμα \"Πολιτισμοί Εποχής Χαλκού\", χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Bronze Age civilizations\" to a friend in 3-4 sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-a-gym.archaic-democracy-path": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με τη σειρά τα βήματα που θυμάσαι προς την αθηναϊκή δημοκρατία (π.χ. Δράκων, Σόλωνας, Πεισίστρατος, Κλεισθένης). Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν γνωρίζει ότι η αθηναϊκή δημοκρατία δεν υπήρξε από την αρχή, αλλά εξελίχθηκε σταδιακά μέσα από μεταρρυθμιστές (π.χ. Σόλωνας, Κλεισθένης).",
      "descriptionEn": "Write in order the steps you remember toward Athenian democracy (e.g. Draco, Solon, Peisistratos, Cleisthenes). The most common trap on this topic: Doesn't know Athenian democracy wasn't there from the start, but evolved gradually through reformers (e.g. Solon, Cleisthenes).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Πορεία προς τη δημοκρατία\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Path toward democracy'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε σε ένα φίλο σου με 3-4 προτάσεις το θέμα \"Πορεία προς τη δημοκρατία\", χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Path toward democracy\" to a friend in 3-4 sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-a-gym.peloponnesian-war-sides": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε ποιες πόλεις-κράτη και συμμαχίες θυμάσαι ότι ήταν σε κάθε πλευρά του Πελοποννησιακού Πολέμου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν θυμάται ποιες πλευρές αντιπαρατέθηκαν στον Πελοποννησιακό Πόλεμο (Αθήνα εναντίον Σπάρτης και των συμμάχων τους).",
      "descriptionEn": "Write which city-states and alliances you remember being on each side of the Peloponnesian War. The most common trap on this topic: Doesn't recall which sides fought in the Peloponnesian War (Athens against Sparta and their allies).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Πελοποννησιακός Πόλεμος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Peloponnesian War'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε σε ένα φίλο σου με 3-4 προτάσεις το θέμα \"Πελοποννησιακός Πόλεμος\", χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Peloponnesian War\" to a friend in 3-4 sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-a-gym.alexander-legacy": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 πράγματα που θυμάσαι για το τι άφησε πίσω του ο Μέγας Αλέξανδρος, πέρα από τις μάχες. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει ότι το έργο του Μεγάλου Αλεξάνδρου ήταν κυρίως η διάδοση του ελληνικού πολιτισμού σε μια τεράστια έκταση (ελληνιστικός κόσμος).",
      "descriptionEn": "Write 2-3 things you remember about what Alexander the Great left behind, beyond the battles. The most common trap on this topic: Doesn't recognize that Alexander the Great's main legacy was spreading Greek culture across a vast territory (the Hellenistic world).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Έργο Μεγάλου Αλεξάνδρου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Alexander the Great's legacy'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε σε ένα φίλο σου με 3-4 προτάσεις το θέμα \"Έργο Μεγάλου Αλεξάνδρου\", χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Alexander the Great's legacy\" to a friend in 3-4 sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-b-gym.hellenistic-fusion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 παραδείγματα στοιχείων (τέχνη, γλώσσα, θρησκεία) που θυμάσαι ότι αναμείχθηκαν στον ελληνιστικό κόσμο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει ότι ο ελληνιστικός πολιτισμός προέκυψε από τη μείξη ελληνικών και ανατολικών στοιχείων μετά τις κατακτήσεις του Αλεξάνδρου.",
      "descriptionEn": "Write 2-3 examples of elements (art, language, religion) you remember blending in the Hellenistic world. The most common trap on this topic: Doesn't understand that Hellenistic culture arose from the blending of Greek and Eastern elements after Alexander's conquests.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ελληνιστικός πολιτισμός\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Hellenistic culture'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT τι κατάλαβες για \"Ελληνιστικός πολιτισμός\" και ρώτα: «Μου λείπει κάτι σημαντικό; Πες μου τι, μη μου το εξηγήσεις εσύ.»",
      "descriptionEn": "Explain to ChatGPT what you understood about \"Hellenistic culture\" and ask: \"Am I missing something important? Tell me what, don't explain it for me.\"",
      "toolId": "chatgpt"
    }
  ],

  "istoria-b-gym.rome-greece-conquest": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε τι θυμάσαι για το πώς η Ρώμη κατέκτησε την Ελλάδα, και τι από τον ελληνικό πολιτισμό συνέχισε να επηρεάζει τους Ρωμαίους. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν γνωρίζει ότι η Ελλάδα έγινε ρωμαϊκή επαρχία, αλλά ο ελληνικός πολιτισμός συνέχισε να επηρεάζει τη Ρώμη.",
      "descriptionEn": "Write what you remember about how Rome conquered Greece, and what Greek culture continued to influence the Romans. The most common trap on this topic: Doesn't know Greece became a Roman province, but Greek culture kept influencing Rome.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ρωμαϊκή κατάκτηση της Ελλάδας\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Roman conquest of Greece'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT τι κατάλαβες για \"Ρωμαϊκή κατάκτηση της Ελλάδας\" και ρώτα: «Μου λείπει κάτι σημαντικό; Πες μου τι, μη μου το εξηγήσεις εσύ.»",
      "descriptionEn": "Explain to ChatGPT what you understood about \"Roman conquest of Greece\" and ask: \"Am I missing something important? Tell me what, don't explain it for me.\"",
      "toolId": "chatgpt"
    }
  ],

  "istoria-b-gym.byzantium-transition": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε γιατί θυμάσαι ότι χτίστηκε η Κωνσταντινούπολη και τι σήμαινε αυτό για τη Ρωμαϊκή Αυτοκρατορία. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν συνδέει την ίδρυση της Κωνσταντινούπολης με τη μετατόπιση του κέντρου βάρους της Ρωμαϊκής Αυτοκρατορίας προς την Ανατολή.",
      "descriptionEn": "Write why you remember Constantinople being built and what that meant for the Roman Empire. The most common trap on this topic: Doesn't connect the founding of Constantinople with the shift of the Roman Empire's center of gravity to the East.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Μετάβαση στο Βυζάντιο\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Transition to Byzantium'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT τι κατάλαβες για \"Μετάβαση στο Βυζάντιο\" και ρώτα: «Μου λείπει κάτι σημαντικό; Πες μου τι, μη μου το εξηγήσεις εσύ.»",
      "descriptionEn": "Explain to ChatGPT what you understood about \"Transition to Byzantium\" and ask: \"Am I missing something important? Tell me what, don't explain it for me.\"",
      "toolId": "chatgpt"
    }
  ],

  "istoria-b-gym.medieval-feudalism": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Σχεδίασε μια απλή πυραμίδα με άρχοντα, ιππότες και υποτελείς, και εξήγησε τι έδινε ο καθένας στον άλλον. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει τη βασική δομή του φεουδαρχικού συστήματος (άρχοντας-υποτελής-γη) στη μεσαιωνική Δυτική Ευρώπη.",
      "descriptionEn": "Draw a simple pyramid with lord, knights, and vassals, and explain what each gave to the other. The most common trap on this topic: Doesn't understand the basic structure of the feudal system (lord-vassal-land) in medieval Western Europe.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Φεουδαρχία στη Δυτική Ευρώπη\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Feudalism in Western Europe'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT τι κατάλαβες για \"Φεουδαρχία στη Δυτική Ευρώπη\" και ρώτα: «Μου λείπει κάτι σημαντικό; Πες μου τι, μη μου το εξηγήσεις εσύ.»",
      "descriptionEn": "Explain to ChatGPT what you understood about \"Feudalism in Western Europe\" and ask: \"Am I missing something important? Tell me what, don't explain it for me.\"",
      "toolId": "chatgpt"
    }
  ],

  "efl-a-gym.present-cont-vs-simple": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 3 προτάσεις στο Present Continuous (κάτι που συμβαίνει τώρα) και 3 στο Present Simple (συνήθεια). Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξεχωρίζει πότε χρησιμοποιούμε Present Continuous (κάτι που συμβαίνει τώρα) και πότε Present Simple (συνήθεια).",
      "descriptionEn": "Write 3 sentences in Present Continuous (something happening now) and 3 in Present Simple (a habit). The most common trap on this topic: Doesn't distinguish when to use Present Continuous (happening now) versus Present Simple (habit).",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Present Continuous vs Simple\". Οι επαναλαμβανόμενες μικρές ασκήσεις βοηθούν να θυμάσαι τον κανόνα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Present Continuous vs Simple\" grammar. Short repeated exercises help the rule stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος διορθωμένες, με βάση αυτό που εξασκήθηκες στο Duolingo.",
      "descriptionEn": "Rewrite the sentences from step one, corrected, based on what you practiced in Duolingo.",
      "toolId": null
    }
  ],

  "efl-a-gym.past-cont-vs-simple": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 3 προτάσεις στο Past Continuous (κάτι σε εξέλιξη) και 3 στο Past Simple (ολοκληρωμένη ενέργεια). Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξεχωρίζει πότε χρησιμοποιούμε Past Continuous (κάτι που ήταν σε εξέλιξη) και πότε Past Simple (ολοκληρωμένη ενέργεια).",
      "descriptionEn": "Write 3 sentences in Past Continuous (something in progress) and 3 in Past Simple (a completed action). The most common trap on this topic: Doesn't distinguish when to use Past Continuous (something in progress) versus Past Simple (a completed action).",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Past Continuous vs Simple\". Οι επαναλαμβανόμενες μικρές ασκήσεις βοηθούν να θυμάσαι τον κανόνα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Past Continuous vs Simple\" grammar. Short repeated exercises help the rule stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος διορθωμένες, με βάση αυτό που εξασκήθηκες στο Duolingo.",
      "descriptionEn": "Rewrite the sentences from step one, corrected, based on what you practiced in Duolingo.",
      "toolId": null
    }
  ],

  "efl-a-gym.comparative-forms": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε τον συγκριτικό βαθμό 5 επιθέτων (π.χ. big, happy, beautiful) χωρίς να ελέγξεις κανόνα. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει πότε προσθέτουμε «-er» και πότε λέμε «more» για τον σχηματισμό του συγκριτικού βαθμού.",
      "descriptionEn": "Write the comparative form of 5 adjectives (e.g. big, happy, beautiful) without checking a rule. The most common trap on this topic: Doesn't know when to add '-er' versus say 'more' to form the comparative.",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Σχηματισμός συγκριτικού\". Οι επαναλαμβανόμενες μικρές ασκήσεις βοηθούν να θυμάσαι τον κανόνα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Σχηματισμός συγκριτικού\" grammar. Short repeated exercises help the rule stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος διορθωμένες, με βάση αυτό που εξασκήθηκες στο Duolingo.",
      "descriptionEn": "Rewrite the sentences from step one, corrected, based on what you practiced in Duolingo.",
      "toolId": null
    }
  ],

  "efl-a-gym.question-word-order": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 3 ερωτήσεις στα αγγλικά με βοηθητικό ρήμα (π.χ. Where do you..., What does he...). Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν σχηματίζει σωστά τη σειρά λέξεων σε ερωτήσεις με βοηθητικό ρήμα (π.χ. «Where you go?» αντί για «Where do you go?»).",
      "descriptionEn": "Write 3 English questions using an auxiliary verb (e.g. Where do you..., What does he...). The most common trap on this topic: Doesn't form questions correctly with an auxiliary verb (e.g. 'Where you go?' instead of 'Where do you go?').",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Σειρά λέξεων σε ερώτηση\". Οι επαναλαμβανόμενες μικρές ασκήσεις βοηθούν να θυμάσαι τον κανόνα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Σειρά λέξεων σε ερώτηση\" grammar. Short repeated exercises help the rule stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος διορθωμένες, με βάση αυτό που εξασκήθηκες στο Duolingo.",
      "descriptionEn": "Rewrite the sentences from step one, corrected, based on what you practiced in Duolingo.",
      "toolId": null
    }
  ],

  "efl-b-gym.present-perfect-intro": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 3 προτάσεις για εμπειρίες σου χωρίς συγκεκριμένο χρόνο (π.χ. ταξίδια, βιβλία) χρησιμοποιώντας Present Perfect. Η πιο συχνή παγίδα σε αυτό το θέμα: Χρησιμοποιεί Past Simple αντί για Present Perfect όταν μιλάει για εμπειρίες χωρίς συγκεκριμένο χρόνο (π.χ. «I have visited Paris»).",
      "descriptionEn": "Write 3 sentences about your experiences without a specific time (e.g. trips, books) using Present Perfect. The most common trap on this topic: Uses Past Simple instead of Present Perfect when talking about experiences without a specific time (e.g. 'I have visited Paris').",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Εισαγωγή στον Present Perfect\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Introduction to Present Perfect'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Gemini",
      "titleEn": "Check with Gemini",
      "descriptionEl": "Επικόλλησε τις προτάσεις σου στο Gemini και ρώτα: «Έχω λάθος στο \"Εισαγωγή στον Present Perfect\"; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Paste your sentences into Gemini and ask: \"Do I have this wrong on 'Introduction to Present Perfect'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    }
  ],

  "efl-b-gym.modals-obligation": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2 προτάσεις με 'must' (ισχυρή υποχρέωση) και 2 με 'should' (συμβουλή). Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξεχωρίζει το «must» (ισχυρή υποχρέωση) από το «should» (συμβουλή), χρησιμοποιώντας τα σαν να σημαίνουν το ίδιο.",
      "descriptionEn": "Write 2 sentences with 'must' (strong obligation) and 2 with 'should' (advice). The most common trap on this topic: Doesn't distinguish 'must' (strong obligation) from 'should' (advice), using them as if they meant the same thing.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Must vs Should\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Must vs Should'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Gemini",
      "titleEn": "Check with Gemini",
      "descriptionEl": "Επικόλλησε τις προτάσεις σου στο Gemini και ρώτα: «Έχω λάθος στο \"Must vs Should\"; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Paste your sentences into Gemini and ask: \"Do I have this wrong on 'Must vs Should'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    }
  ],

  "efl-b-gym.passive-voice-intro": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 3 προτάσεις στην παθητική φωνή, όπου δεν μας ενδιαφέρει ποιος έκανε την ενέργεια. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει πότε μια πρόταση χρειάζεται παθητική φωνή, επειδή δεν ξέρουμε (ή δεν μας ενδιαφέρει) ποιος έκανε την ενέργεια.",
      "descriptionEn": "Write 3 sentences in the passive voice, where we don't care who performed the action. The most common trap on this topic: Doesn't recognize when a sentence needs the passive voice, because we don't know (or don't care) who performed the action.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Εισαγωγή στην παθητική φωνή\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Introduction to the passive voice'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Gemini",
      "titleEn": "Check with Gemini",
      "descriptionEl": "Επικόλλησε τις προτάσεις σου στο Gemini και ρώτα: «Έχω λάθος στο \"Εισαγωγή στην παθητική φωνή\"; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Paste your sentences into Gemini and ask: \"Do I have this wrong on 'Introduction to the passive voice'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    }
  ],

  "efl-b-gym.relative-clauses": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 3 προτάσεις με αναφορικές προτάσεις, χρησιμοποιώντας σωστά το 'who' για πρόσωπα και το 'which' για πράγματα. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει το «who» (για πρόσωπα) με το «which» (για πράγματα) σε αναφορικές προτάσεις.",
      "descriptionEn": "Write 3 sentences with relative clauses, correctly using 'who' for people and 'which' for things. The most common trap on this topic: Confuses 'who' (for people) with 'which' (for things) in relative clauses.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Αναφορικές προτάσεις\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Relative clauses'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Gemini",
      "titleEn": "Check with Gemini",
      "descriptionEl": "Επικόλλησε τις προτάσεις σου στο Gemini και ρώτα: «Έχω λάθος στο \"Αναφορικές προτάσεις\"; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Paste your sentences into Gemini and ask: \"Do I have this wrong on 'Relative clauses'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    }
  ],

  "biologia-a-gym.plant-animal-cell": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Σχεδίασε ένα φυτικό και ένα ζωικό κύτταρο δίπλα-δίπλα και σημείωσε ποια οργανίδια υπάρχουν μόνο στο φυτικό. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ποια οργανίδια υπάρχουν μόνο στο φυτικό κύτταρο (π.χ. χλωροπλάστης, κυτταρικό τοίχωμα) και όχι στο ζωικό.",
      "descriptionEn": "Draw a plant cell and an animal cell side by side and mark which organelles exist only in the plant cell. The most common trap on this topic: Doesn't know which organelles exist only in plant cells (e.g. chloroplast, cell wall) and not in animal cells.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Φυτικό vs ζωικό κύτταρο\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Plant vs animal cell'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Φυτικό vs ζωικό κύτταρο\" σε ένα μικρότερο αδερφό/ξαδερφό (πραγματικό ή φανταστικό) με πολύ απλά λόγια.",
      "descriptionEn": "Explain the topic \"Plant vs animal cell\" to a younger sibling or cousin (real or imaginary) in very simple words.",
      "toolId": null
    }
  ],

  "biologia-a-gym.unicellular-nutrition": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε τι θυμάσαι για το πώς τρέφεται ένας μονοκύτταρος οργανισμός όπως η αμοιβάδα. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει πώς τρέφεται ένας μονοκύτταρος οργανισμός (π.χ. αμοιβάδα) χωρίς στόμα ή πεπτικό σύστημα.",
      "descriptionEn": "Write what you remember about how a unicellular organism like an amoeba feeds. The most common trap on this topic: Doesn't understand how a unicellular organism (e.g. amoeba) feeds without a mouth or digestive system.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Θρέψη μονοκύτταρων οργανισμών\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Nutrition in unicellular organisms'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Θρέψη μονοκύτταρων οργανισμών\" σε ένα μικρότερο αδερφό/ξαδερφό (πραγματικό ή φανταστικό) με πολύ απλά λόγια.",
      "descriptionEn": "Explain the topic \"Nutrition in unicellular organisms\" to a younger sibling or cousin (real or imaginary) in very simple words.",
      "toolId": null
    }
  ],

  "biologia-a-gym.adaptation-misconception": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Διάλεξε 2 ζώα και γράψε ένα χαρακτηριστικό τους και σε τι τα βοηθάει να επιβιώσουν. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν συνδέει ένα χαρακτηριστικό ενός οργανισμού (π.χ. καμπούρα καμήλας) με τη λειτουργία που εξυπηρετεί για την επιβίωσή του.",
      "descriptionEn": "Pick 2 animals and write one characteristic of each and how it helps them survive. The most common trap on this topic: Doesn't connect an organism's trait (e.g. a camel's hump) with the function it serves for survival.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Προσαρμογές οργανισμών\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Adaptations of organisms'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Προσαρμογές οργανισμών\" σε ένα μικρότερο αδερφό/ξαδερφό (πραγματικό ή φανταστικό) με πολύ απλά λόγια.",
      "descriptionEn": "Explain the topic \"Adaptations of organisms\" to a younger sibling or cousin (real or imaginary) in very simple words.",
      "toolId": null
    }
  ],

  "biologia-a-gym.plant-vs-animal-digestion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε πώς παίρνει τροφή ένα φυτό, χωρίς να χρησιμοποιήσεις τη λέξη 'πεπτικό σύστημα'. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι τα φυτά δεν έχουν πεπτικό σύστημα όπως τα ζώα, αλλά παράγουν τη δική τους τροφή μέσω φωτοσύνθεσης.",
      "descriptionEn": "Write how a plant gets its food, without using the phrase 'digestive system'. The most common trap on this topic: Doesn't know plants don't have a digestive system like animals, but produce their own food through photosynthesis.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Πέψη σε φυτά vs ζώα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Digestion in plants vs animals'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Πέψη σε φυτά vs ζώα\" σε ένα μικρότερο αδερφό/ξαδερφό (πραγματικό ή φανταστικό) με πολύ απλά λόγια.",
      "descriptionEn": "Explain the topic \"Digestion in plants vs animals\" to a younger sibling or cousin (real or imaginary) in very simple words.",
      "toolId": null
    }
  ],

  "biologia-a-gym.cell-membrane-function": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με δικά σου λόγια τι κάνει η κυτταρική μεμβράνη, πέρα από το να 'κρατάει το κύτταρο μαζί'. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει ότι η κυτταρική μεμβράνη ελέγχει τι μπαίνει και τι βγαίνει από το κύτταρο, δεν είναι απλώς ένα «περίβλημα».",
      "descriptionEn": "Write in your own words what the cell membrane does, beyond 'holding the cell together'. The most common trap on this topic: Doesn't understand the cell membrane controls what enters and exits the cell, not just a passive 'wrapper'.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Λειτουργία κυτταρικής μεμβράνης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Function of the cell membrane'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Λειτουργία κυτταρικής μεμβράνης\" σε ένα μικρότερο αδερφό/ξαδερφό (πραγματικό ή φανταστικό) με πολύ απλά λόγια.",
      "descriptionEn": "Explain the topic \"Function of the cell membrane\" to a younger sibling or cousin (real or imaginary) in very simple words.",
      "toolId": null
    }
  ],

  "biologia-b-gym.gas-exchange-organ": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε ποιο όργανο θυμάσαι ότι κάνει την ανταλλαγή οξυγόνου-διοξειδίου του άνθρακα, και πώς λειτουργεί με απλά λόγια. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι οι πνεύμονες είναι το όργανο όπου γίνεται η ανταλλαγή οξυγόνου-διοξειδίου του άνθρακα, μπερδεύοντάς το με άλλο όργανο.",
      "descriptionEn": "Write which organ you remember doing the oxygen-carbon dioxide exchange, and how it works in simple words. The most common trap on this topic: Doesn't know the lungs are where oxygen-carbon dioxide exchange happens, confusing it with another organ.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ανταλλαγή αερίων\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Gas exchange organ'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT τι κατάλαβες για \"Ανταλλαγή αερίων\" και ρώτα: «Είναι σωστή η εξήγησή μου; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT what you understood about \"Gas exchange organ\" and ask: \"Is my explanation correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "biologia-b-gym.heart-role": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με δικά σου λόγια ποιος είναι ο κύριος ρόλος της καρδιάς. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι ο κύριος ρόλος της καρδιάς είναι να αντλεί το αίμα σε όλο το σώμα, όχι κάποια άλλη λειτουργία.",
      "descriptionEn": "Write in your own words what the heart's main role is. The most common trap on this topic: Doesn't know the heart's main role is pumping blood throughout the body, not some other function.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ρόλος της καρδιάς\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Role of the heart'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT τι κατάλαβες για \"Ρόλος της καρδιάς\" και ρώτα: «Είναι σωστή η εξήγησή μου; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT what you understood about \"Role of the heart\" and ask: \"Is my explanation correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "biologia-b-gym.blood-function": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Κάνε μια λίστα με όλα όσα θυμάσαι ότι μεταφέρει το αίμα στο σώμα. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι το αίμα μεταφέρει πολλά διαφορετικά πράγματα (οξυγόνο, θρεπτικά, απόβλητα), όχι μόνο ένα.",
      "descriptionEn": "Make a list of everything you remember the blood carrying in the body. The most common trap on this topic: Doesn't know blood transports many different things (oxygen, nutrients, waste), not just one.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Λειτουργία του αίματος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Function of blood'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT τι κατάλαβες για \"Λειτουργία του αίματος\" και ρώτα: «Είναι σωστή η εξήγησή μου; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT what you understood about \"Function of blood\" and ask: \"Is my explanation correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "biologia-b-gym.producer-definition": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 παραδείγματα «παραγωγών» σε ένα οικοσύστημα και εξήγησε γιατί ονομάζονται έτσι. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι οι «παραγωγοί» σε ένα οικοσύστημα είναι οργανισμοί (κυρίως φυτά) που παράγουν τη δική τους τροφή.",
      "descriptionEn": "Write 2-3 examples of 'producers' in an ecosystem and explain why they're called that. The most common trap on this topic: Doesn't know 'producers' in an ecosystem are organisms (mainly plants) that make their own food.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Παραγωγοί σε οικοσύστημα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Producers in an ecosystem'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT τι κατάλαβες για \"Παραγωγοί σε οικοσύστημα\" και ρώτα: «Είναι σωστή η εξήγησή μου; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT what you understood about \"Producers in an ecosystem\" and ask: \"Is my explanation correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "biologia-b-gym.nervous-system-role": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με δικά σου λόγια τι κάνει το νευρικό σύστημα όταν αγγίζεις κάτι πολύ ζεστό. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι ο κύριος ρόλος του νευρικού συστήματος είναι η αντίληψη ερεθισμάτων και η γρήγορη ανταπόκριση σε αυτά.",
      "descriptionEn": "Write in your own words what the nervous system does when you touch something very hot. The most common trap on this topic: Doesn't know the nervous system's main role is perceiving stimuli and responding to them quickly.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ρόλος νευρικού συστήματος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Role of the nervous system'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT τι κατάλαβες για \"Ρόλος νευρικού συστήματος\" και ρώτα: «Είναι σωστή η εξήγησή μου; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT what you understood about \"Role of the nervous system\" and ask: \"Is my explanation correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "biologia-g-gym.dna-location": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Σχεδίασε ένα απλό κύτταρο και σημείωσε πού βρίσκεται το DNA. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι το DNA βρίσκεται κυρίως μέσα στον πυρήνα του κυττάρου.",
      "descriptionEn": "Draw a simple cell and mark where the DNA is located. The most common trap on this topic: Doesn't know DNA is located mainly inside the cell nucleus.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Θέση του DNA\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Location of DNA'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Θέση του DNA\" σε έναν συμμαθητή σου με 2-3 προτάσεις, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Location of DNA\" to a classmate in 2-3 sentences, without notes.",
      "toolId": null
    }
  ],

  "biologia-g-gym.inheritance-both-parents": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 χαρακτηριστικά σου και σκέψου από ποιον γονιό μπορεί να τα κληρονόμησες, ή αν είναι συνδυασμός και των δύο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι τα χαρακτηριστικά ενός παιδιού προέρχονται και από τους δύο γονείς, μέσω των γονιδίων τους.",
      "descriptionEn": "Write 2-3 of your own traits and think about which parent you may have inherited them from, or if it's a combination of both. The most common trap on this topic: Doesn't know a child's traits come from both parents, through their genes.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Κληρονομικότητα από τους γονείς\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Inheritance from parents'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Κληρονομικότητα από τους γονείς\" σε έναν συμμαθητή σου με 2-3 προτάσεις, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Inheritance from parents\" to a classmate in 2-3 sentences, without notes.",
      "toolId": null
    }
  ],

  "biologia-g-gym.biodiversity-definition": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με δικά σου λόγια τι σημαίνει «βιοποικιλότητα» και δώσε ένα παράδειγμα οικοσυστήματος με μεγάλη βιοποικιλότητα. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι η βιοποικιλότητα αναφέρεται στην ποικιλία των ειδών ζωής σε ένα οικοσύστημα, όχι σε κάτι άλλο.",
      "descriptionEn": "Write in your own words what 'biodiversity' means and give an example of an ecosystem with high biodiversity. The most common trap on this topic: Doesn't know biodiversity refers to the variety of life forms in an ecosystem, not something else.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Έννοια βιοποικιλότητας\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Concept of biodiversity'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Έννοια βιοποικιλότητας\" σε έναν συμμαθητή σου με 2-3 προτάσεις, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Concept of biodiversity\" to a classmate in 2-3 sentences, without notes.",
      "toolId": null
    }
  ],

  "biologia-g-gym.extinction-cause": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2 λόγους για τους οποίους ένα είδος μπορεί να εξαφανιστεί. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι ένα είδος εξαφανίζεται όταν δεν μπορεί πλέον να αναπαραχθεί ή να επιβιώσει επαρκώς στο περιβάλλον του.",
      "descriptionEn": "Write 2 reasons why a species might go extinct. The most common trap on this topic: Doesn't know a species goes extinct when it can no longer reproduce or survive sufficiently in its environment.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Αιτία εξαφάνισης είδους\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Cause of species extinction'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Αιτία εξαφάνισης είδους\" σε έναν συμμαθητή σου με 2-3 προτάσεις, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Cause of species extinction\" to a classmate in 2-3 sentences, without notes.",
      "toolId": null
    }
  ],

  "biologia-g-gym.reproduction-purpose": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με δικά σου λόγια γιατί οι οργανισμοί αναπαράγονται, πέρα από «επειδή το κάνουν όλοι». Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι ο βασικός βιολογικός σκοπός της αναπαραγωγής είναι η συνέχεια του είδους.",
      "descriptionEn": "Write in your own words why organisms reproduce, beyond 'because everyone does it'. The most common trap on this topic: Doesn't know the basic biological purpose of reproduction is the continuation of the species.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Σκοπός αναπαραγωγής\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Purpose of reproduction'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Σκοπός αναπαραγωγής\" σε έναν συμμαθητή σου με 2-3 προτάσεις, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Purpose of reproduction\" to a classmate in 2-3 sentences, without notes.",
      "toolId": null
    }
  ],

  "ekthesi-a.topic-sentence-missing": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε μία παράγραφο (5-6 προτάσεις) πάνω σε ένα θέμα της επιλογής σου, ξεκινώντας με μια σαφή θεματική πρόταση. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει ότι κάθε παράγραφος χρειάζεται μία θεματική πρόταση που δηλώνει το κεντρικό της νόημα· γράφει παραγράφους χωρίς σαφή εστίαση.",
      "descriptionEn": "Write one paragraph (5-6 sentences) on a topic of your choice, starting with a clear topic sentence. The most common trap on this topic: Doesn't recognize that every paragraph needs one topic sentence stating its central idea; writes paragraphs without clear focus.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Θεματική πρόταση\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Topic sentence'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναδιάβασε και έλεγξε",
      "titleEn": "Re-read and check",
      "descriptionEl": "Ξαναδιάβασε την παράγραφό σου μόνος/η, ή δώσε τη σε έναν συμμαθητή, και έλεγξε αν η πρώτη πρόταση δηλώνει καθαρά το κεντρικό νόημα.",
      "descriptionEn": "Re-read your paragraph yourself, or give it to a classmate, and check whether the first sentence clearly states the central idea.",
      "toolId": null
    }
  ],

  "ekthesi-a.development-method-confusion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Διάλεξε μια θεματική πρόταση και ανάπτυξέ την με έναν συγκεκριμένο τρόπο (π.χ. με παράδειγμα ή με αιτιολόγηση). Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τους τρόπους ανάπτυξης παραγράφου (παράδειγμα, αιτιολόγηση, σύγκριση-αντίθεση, ορισμός, διαίρεση), αφού δεν ξέρει ποιος ταιριάζει σε ποια θεματική πρόταση.",
      "descriptionEn": "Pick a topic sentence and develop it using one specific method (e.g. example or cause-effect). The most common trap on this topic: Confuses the paragraph development methods (example, cause-effect, comparison-contrast, definition, division), not knowing which fits which topic sentence.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Τρόποι ανάπτυξης παραγράφου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Paragraph development methods'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναδιάβασε και έλεγξε",
      "titleEn": "Re-read and check",
      "descriptionEl": "Ξαναδιάβασε την παράγραφό σου μόνος/η, ή δώσε τη σε έναν συμμαθητή, και έλεγξε αν ο τρόπος ανάπτυξης που διάλεξες φαίνεται καθαρά.",
      "descriptionEn": "Re-read your paragraph yourself, or give it to a classmate, and check whether the development method you chose comes through clearly.",
      "toolId": null
    }
  ],

  "ekthesi-a.unity-coherence": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε μια παράγραφο και μετά διάβασέ την ξανά, ελέγχοντας αν κάθε πρόταση συνδέεται λογικά με την προηγούμενη. Η πιο συχνή παγίδα σε αυτό το θέμα: Γράφει προτάσεις που δεν συνδέονται λογικά μεταξύ τους μέσα στην ίδια παράγραφο, ή προσθέτει άσχετες πληροφορίες με τη θεματική πρόταση.",
      "descriptionEn": "Write a paragraph, then reread it, checking whether each sentence logically connects to the previous one. The most common trap on this topic: Writes sentences that don't logically connect within the same paragraph, or adds information unrelated to the topic sentence.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Ενότητα & συνοχή παραγράφου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Paragraph unity & coherence'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναδιάβασε και έλεγξε",
      "titleEn": "Re-read and check",
      "descriptionEl": "Ξαναδιάβασε την παράγραφό σου μόνος/η, ή δώσε τη σε έναν συμμαθητή, και δες αν υπάρχουν σημεία που κόβουν τη ροή ή τη συνοχή.",
      "descriptionEn": "Re-read your paragraph yourself, or give it to a classmate, and see whether there are spots that break the flow or coherence.",
      "toolId": null
    }
  ],

  "ekthesi-a.summary-length": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Διάλεξε ένα κείμενο 200 λέξεων και γράψε περίληψή του σε ακριβώς το ζητούμενο όριο λέξεων (π.χ. 70 λέξεις). Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν τηρεί το ζητούμενο όριο λέξεων στην περίληψη· είτε την αφήνει σχεδόν όσο το πρωτότυπο είτε παραλείπει βασικές ιδέες για να χωρέσει.",
      "descriptionEn": "Pick a 200-word text and write a summary of it in exactly the required word limit (e.g. 70 words). The most common trap on this topic: Doesn't respect the required word limit in a summary; either leaves it nearly as long as the original or drops key ideas just to fit.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Όριο λέξεων περίληψης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Summary word limit'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναδιάβασε και έλεγξε",
      "titleEn": "Re-read and check",
      "descriptionEl": "Μέτρα μόνος/η τις λέξεις της περίληψής σου, και έλεγξε αν κράτησες τις πιο σημαντικές ιδέες.",
      "descriptionEn": "Count the words in your summary yourself, and check whether you kept the most important ideas.",
      "toolId": null
    }
  ],

  "ekthesi-b.persuasion-modes-confusion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Διάλεξε ένα σύντομο διαφημιστικό ή πολιτικό κείμενο και σημείωσε πού χρησιμοποιεί λογική, πού συναίσθημα, και πού το ήθος του πομπού. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει την επίκληση στη λογική (λόγος/στοιχεία), στο συναίσθημα (πάθος) και στο ήθος του πομπού, και δεν αναγνωρίζει ποιον χρησιμοποιεί ένα κείμενο.",
      "descriptionEn": "Pick a short ad or political text and mark where it uses logic, where emotion, and where the speaker's credibility. The most common trap on this topic: Confuses appeals to logic (logos/evidence), emotion (pathos), and the speaker's credibility (ethos), and can't identify which a text is using.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Τρόποι πειθούς\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Modes of persuasion'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναδιάβασε και έλεγξε",
      "titleEn": "Re-read and check",
      "descriptionEl": "Ξαναδιάβασε μόνος/η αν η δική σου ανάλυση φαίνεται σαφής και τεκμηριωμένη.",
      "descriptionEn": "Re-read it yourself and check whether your own analysis reads clearly and is well supported.",
      "toolId": null
    }
  ],

  "ekthesi-b.thesis-antithesis-missing": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε μια σύντομη παράγραφο υπέρ μιας άποψης, και μετά πρόσθεσε 2 προτάσεις που αναγνωρίζουν και απαντούν στην αντίθετη άποψη. Η πιο συχνή παγίδα σε αυτό το θέμα: Γράφει μόνο υπέρ μίας άποψης χωρίς να αναγνωρίζει ή να απαντά στο αντίθετο επιχείρημα, κάτι που αποδυναμώνει το δοκίμιο.",
      "descriptionEn": "Write a short paragraph in favor of a view, then add 2 sentences that acknowledge and respond to the opposing view. The most common trap on this topic: Argues only one side without acknowledging or answering the opposing argument, which weakens the essay.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Αντίκρουση αντίθετης άποψης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Addressing the counter-view'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναδιάβασε και έλεγξε",
      "titleEn": "Re-read and check",
      "descriptionEl": "Ξαναδιάβασε το κείμενό σου μόνος/η, ή δώσε το σε έναν συμμαθητή, και έλεγξε αν η αντίκρουση της αντίθετης άποψης είναι σαφής.",
      "descriptionEn": "Re-read your text yourself, or give it to a classmate, and check whether your response to the counter-view is clear.",
      "toolId": null
    }
  ],

  "ekthesi-b.essay-structure-imbalance": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Σχεδίασε το πλάνο ενός δοκιμίου με 3 παραγράφους επιχειρημάτων, δίνοντας περίπου ίσο αριθμό προτάσεων σε κάθε μία. Η πιο συχνή παγίδα σε αυτό το θέμα: Γράφει δοκίμιο με ένα υπερβολικά μεγάλο επιχείρημα και τα υπόλοιπα ελλιπή, χωρίς ισότιμη ανάπτυξη κάθε παραγράφου επιχειρήματος.",
      "descriptionEn": "Outline a 3-paragraph argument essay, giving roughly equal length to each paragraph. The most common trap on this topic: Writes an essay with one overdeveloped argument and the rest underdeveloped, without balanced development across argument paragraphs.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Ισορροπία δοκιμίου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Essay balance'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναδιάβασε και έλεγξε",
      "titleEn": "Re-read and check",
      "descriptionEl": "Ξαναδιάβασε το πλάνο σου μόνος/η, ή δώσε το σε έναν συμμαθητή, και έλεγξε αν κάποια παράγραφος είναι αισθητά πιο αδύναμη από τις άλλες.",
      "descriptionEn": "Re-read your outline yourself, or give it to a classmate, and check whether any paragraph is noticeably weaker than the others.",
      "toolId": null
    }
  ],

  "ekthesi-b.evidence-generic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Ξαναγράψε μια γενικόλογη πρόταση («όλοι ξέρουν ότι…») δίνοντάς της ένα συγκεκριμένο παράδειγμα, στατιστικό ή αναφορά. Η πιο συχνή παγίδα σε αυτό το θέμα: Στηρίζει τα επιχειρήματά του σε γενικόλογες φράσεις («όλοι ξέρουν ότι…») αντί για συγκεκριμένα παραδείγματα, στατιστικά ή αναφορές.",
      "descriptionEn": "Rewrite a vague sentence ('everyone knows that…') giving it one concrete example, statistic, or reference. The most common trap on this topic: Supports arguments with vague generalities ('everyone knows that…') instead of concrete examples, statistics, or references.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Συγκεκριμένα τεκμήρια\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Concrete evidence'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναδιάβασε και έλεγξε",
      "titleEn": "Re-read and check",
      "descriptionEl": "Ξαναδιάβασε τη νέα πρόταση μόνος/η, ή δώσε τη σε έναν συμμαθητή, και έλεγξε αν το τεκμήριο είναι πλέον συγκεκριμένο.",
      "descriptionEn": "Re-read the new sentence yourself, or give it to a classmate, and check whether the evidence is now concrete.",
      "toolId": null
    }
  ],

  "ekthesi-g.synthesis-sources-missing": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Πάρε 2 σύντομα κείμενα πάνω στο ίδιο θέμα και γράψε μία ενιαία παράγραφο που τα συνδυάζει, αντί να τα σχολιάσεις χωριστά. Η πιο συχνή παγίδα σε αυτό το θέμα: Όταν η εκφώνηση δίνει πολλά κείμενα/πηγές, τα σχολιάζει το ένα μετά το άλλο χωριστά αντί να τα συνθέσει σε ενιαία επιχειρηματολογία.",
      "descriptionEn": "Take 2 short texts on the same topic and write one unified paragraph combining them, instead of commenting on each separately. The most common trap on this topic: When given multiple texts/sources, comments on each one separately instead of synthesizing them into a unified argument.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT Edu",
      "titleEn": "Ask ChatGPT Edu",
      "descriptionEl": "Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα, άνοιξε το ChatGPT Edu και πες: «Δυσκολεύομαι στο \"Σύνθεση πηγών\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Αν δεν έχεις πρόσβαση, χρησιμοποίησε το κανονικό ChatGPT με την ίδια προσέγγιση.",
      "descriptionEn": "If your school participates in the pilot program, open ChatGPT Edu and say: \"I'm struggling with 'Synthesizing sources'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" If you don't have access, use regular ChatGPT the same way.",
      "toolId": "chatgpt-edu"
    },
    {
      "titleEl": "Ξαναδιάβασε και έλεγξε",
      "titleEn": "Re-read and check",
      "descriptionEl": "Ξαναδιάβασε την παράγραφό σου μόνος/η, ή δώσε τη σε έναν συμμαθητή, και έλεγξε αν διαβάζεται σαν ενιαία σκέψη ή σαν δύο χωριστά σχόλια.",
      "descriptionEn": "Re-read your paragraph yourself, or give it to a classmate, and check whether it reads as one unified idea or as two separate comments.",
      "toolId": null
    }
  ],

  "ekthesi-g.proposal-vague": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε μια πρόταση αντιμετώπισης ενός προβλήματος, φροντίζοντας να αναφέρεις ΠΟΙΟΣ θα κάνει τι, όχι μόνο τι πρέπει να αλλάξει. Η πιο συχνή παγίδα σε αυτό το θέμα: Στο τελευταίο μέρος του δοκιμίου προτείνει γενικόλογες λύσεις («πρέπει να αλλάξουμε νοοτροπία») χωρίς συγκεκριμένο, εφαρμόσιμο φορέα δράσης.",
      "descriptionEn": "Write a proposed solution to a problem, making sure to state WHO will do what, not just what should change. The most common trap on this topic: In the essay's final section, proposes vague solutions ('we must change our mindset') without a concrete, actionable agent of action.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT Edu",
      "titleEn": "Ask ChatGPT Edu",
      "descriptionEl": "Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα, άνοιξε το ChatGPT Edu και πες: «Δυσκολεύομαι στο \"Προτάσεις αντιμετώπισης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Αν δεν έχεις πρόσβαση, χρησιμοποίησε το κανονικό ChatGPT με την ίδια προσέγγιση.",
      "descriptionEn": "If your school participates in the pilot program, open ChatGPT Edu and say: \"I'm struggling with 'Proposed solutions'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" If you don't have access, use regular ChatGPT the same way.",
      "toolId": "chatgpt-edu"
    },
    {
      "titleEl": "Ξαναδιάβασε και έλεγξε",
      "titleEn": "Re-read and check",
      "descriptionEl": "Ξαναδιάβασε την πρότασή σου μόνος/η, ή δώσε τη σε έναν συμμαθητή, και έλεγξε αν είναι αρκετά συγκεκριμένη ή ακόμα γενικόλογη.",
      "descriptionEn": "Re-read your proposal yourself, or give it to a classmate, and check whether it's concrete enough or still vague.",
      "toolId": null
    }
  ],

  "ekthesi-g.critical-stance-missing": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε μια παράγραφο για ένα θέμα, προσθέτοντας ρητά τη δική σου κρίση (θετική, αρνητική ή αμφιλεγόμενη) και γιατί. Η πιο συχνή παγίδα σε αυτό το θέμα: Περιγράφει το θέμα αντί να το αξιολογεί κριτικά· λείπει η δική του κρίση για το αν κάτι είναι θετικό, αρνητικό ή αμφιλεγόμενο και γιατί.",
      "descriptionEn": "Write a paragraph on a topic, explicitly adding your own judgment (positive, negative, or contested) and why. The most common trap on this topic: Describes the topic instead of critically evaluating it; misses their own judgment on whether something is positive, negative, or contested, and why.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT Edu",
      "titleEn": "Ask ChatGPT Edu",
      "descriptionEl": "Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα, άνοιξε το ChatGPT Edu και πες: «Δυσκολεύομαι στο \"Κριτική αποτίμηση\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Αν δεν έχεις πρόσβαση, χρησιμοποίησε το κανονικό ChatGPT με την ίδια προσέγγιση.",
      "descriptionEn": "If your school participates in the pilot program, open ChatGPT Edu and say: \"I'm struggling with 'Critical evaluation'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" If you don't have access, use regular ChatGPT the same way.",
      "toolId": "chatgpt-edu"
    },
    {
      "titleEl": "Ξαναδιάβασε και έλεγξε",
      "titleEn": "Re-read and check",
      "descriptionEl": "Ξαναδιάβασε την παράγραφό σου μόνος/η, ή δώσε τη σε έναν συμμαθητή, και έλεγξε αν φαίνεται καθαρά η δική σου άποψη, όχι μόνο περιγραφή.",
      "descriptionEn": "Re-read your paragraph yourself, or give it to a classmate, and check whether your own view comes through clearly, not just description.",
      "toolId": null
    }
  ],

  "ekthesi-g.counterargument-superficial": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε μια αντίκρουση αντίθετης άποψης σε 3-4 προτάσεις, εξηγώντας ΓΙΑΤΙ το δικό σου επιχείρημα υπερισχύει. Η πιο συχνή παγίδα σε αυτό το θέμα: Αναφέρει την αντίθετη άποψη μόνο για να την απορρίψει με μία γραμμή, χωρίς να εξηγήσει γιατί το δικό του επιχείρημα υπερισχύει.",
      "descriptionEn": "Write a rebuttal of an opposing view in 3-4 sentences, explaining WHY your own argument outweighs it. The most common trap on this topic: Mentions the opposing view only to dismiss it in one line, without explaining why their own argument outweighs it.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT Edu",
      "titleEn": "Ask ChatGPT Edu",
      "descriptionEl": "Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα, άνοιξε το ChatGPT Edu και πες: «Δυσκολεύομαι στο \"Βάθος αντίκρουσης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Αν δεν έχεις πρόσβαση, χρησιμοποίησε το κανονικό ChatGPT με την ίδια προσέγγιση.",
      "descriptionEn": "If your school participates in the pilot program, open ChatGPT Edu and say: \"I'm struggling with 'Depth of rebuttal'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" If you don't have access, use regular ChatGPT the same way.",
      "toolId": "chatgpt-edu"
    },
    {
      "titleEl": "Ξαναδιάβασε και έλεγξε",
      "titleEn": "Re-read and check",
      "descriptionEl": "Ξαναδιάβασε την αντίκρουσή σου μόνος/η, ή δώσε τη σε έναν συμμαθητή, και έλεγξε αν εξηγεί επαρκώς τον λόγο, ή απλά απορρίπτει την άποψη.",
      "descriptionEn": "Re-read your rebuttal yourself, or give it to a classmate, and check whether it sufficiently explains the reason, or just dismisses the view.",
      "toolId": null
    }
  ],

  "physics-b-lyk.heat-temperature-confusion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με δικά σου λόγια τη διαφορά ανάμεσα σε θερμότητα και θερμοκρασία, με ένα καθημερινό παράδειγμα. Η πιο συχνή παγίδα σε αυτό το θέμα: Χρησιμοποιεί τη θερμότητα και τη θερμοκρασία σαν να είναι το ίδιο μέγεθος, ενώ η θερμότητα είναι μεταφερόμενη ενέργεια και η θερμοκρασία μέτρο κινητικής ενέργειας σωματιδίων.",
      "descriptionEn": "Write in your own words the difference between heat and temperature, with an everyday example. The most common trap on this topic: Treats heat and temperature as the same quantity, when heat is transferred energy and temperature measures particles' kinetic energy.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT Edu",
      "titleEn": "Ask ChatGPT Edu",
      "descriptionEl": "Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα, άνοιξε το ChatGPT Edu και πες: «Δυσκολεύομαι στο \"Θερμότητα vs Θερμοκρασία\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Αν δεν έχεις πρόσβαση, χρησιμοποίησε το κανονικό ChatGPT με την ίδια προσέγγιση.",
      "descriptionEn": "If your school participates in the pilot program, open ChatGPT Edu and say: \"I'm struggling with 'Heat vs Temperature'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" If you don't have access, use regular ChatGPT the same way.",
      "toolId": "chatgpt-edu"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ρώτα το Wolfram Alpha 'difference between heat and temperature' και σύγκρινε με τη δική σου εξήγηση.",
      "descriptionEn": "Ask Wolfram Alpha 'difference between heat and temperature' and compare with your own explanation.",
      "toolId": "wolfram-alpha"
    }
  ],

  "physics-b-lyk.current-consumed": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Σχεδίασε ένα απλό κύκλωμα με μια μπαταρία και μια λάμπα, και γράψε τι πιστεύεις ότι συμβαίνει στην ένταση πριν και μετά τη λάμπα. Η πιο συχνή παγίδα σε αυτό το θέμα: Πιστεύει ότι το ηλεκτρικό ρεύμα «καταναλώνεται» καθώς περνά από τη λάμπα, ενώ η ένταση του ρεύματος παραμένει ίδια σε όλο το απλό κύκλωμα.",
      "descriptionEn": "Draw a simple circuit with a battery and a bulb, and write what you think happens to the current before and after the bulb. The most common trap on this topic: Believes electric current gets 'used up' as it passes through the bulb, when current is actually the same throughout a simple circuit.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT Edu",
      "titleEn": "Ask ChatGPT Edu",
      "descriptionEl": "Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα, άνοιξε το ChatGPT Edu και πες: «Δυσκολεύομαι στο \"«Κατανάλωση» ρεύματος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Αν δεν έχεις πρόσβαση, χρησιμοποίησε το κανονικό ChatGPT με την ίδια προσέγγιση.",
      "descriptionEn": "If your school participates in the pilot program, open ChatGPT Edu and say: \"I'm struggling with 'Current 'used up''. Ask me questions so I can figure it out myself, don't just hand me the answer.\" If you don't have access, use regular ChatGPT the same way.",
      "toolId": "chatgpt-edu"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ρώτα το Wolfram Alpha για την ένταση ρεύματος σε ένα απλό κύκλωμα σειράς και έλεγξε αν άλλαξε από σημείο σε σημείο.",
      "descriptionEn": "Ask Wolfram Alpha about current in a simple series circuit and check whether it changed from point to point.",
      "toolId": "wolfram-alpha"
    }
  ],

  "physics-b-lyk.voltage-current-confusion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε τον ορισμό της τάσης και τον ορισμό της έντασης ρεύματος με δικά σου λόγια, χωρίς να κοιτάξεις το βιβλίο. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει την ηλεκτρική τάση (V) με την ένταση ρεύματος (Α), χρησιμοποιώντας τους όρους σαν να είναι το ίδιο πράγμα.",
      "descriptionEn": "Write the definition of voltage and the definition of current in your own words, without looking at the book. The most common trap on this topic: Confuses voltage (V) with current (A), using the terms as if they were the same thing.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT Edu",
      "titleEn": "Ask ChatGPT Edu",
      "descriptionEl": "Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα, άνοιξε το ChatGPT Edu και πες: «Δυσκολεύομαι στο \"Τάση vs Ένταση\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Αν δεν έχεις πρόσβαση, χρησιμοποίησε το κανονικό ChatGPT με την ίδια προσέγγιση.",
      "descriptionEn": "If your school participates in the pilot program, open ChatGPT Edu and say: \"I'm struggling with 'Voltage vs Current'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" If you don't have access, use regular ChatGPT the same way.",
      "toolId": "chatgpt-edu"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ρώτα το Wolfram Alpha τη μονάδα μέτρησης της τάσης και της έντασης, και έλεγξε αν τις είχες σωστά.",
      "descriptionEn": "Ask Wolfram Alpha for the units of voltage and current, and check whether you had them right.",
      "toolId": "wolfram-alpha"
    }
  ],

  "physics-b-lyk.heat-flow-direction": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2 καθημερινά παραδείγματα όπου η θερμότητα ρέει από θερμότερο προς ψυχρότερο σώμα. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν έχει παγιώσει ότι η θερμότητα ρέει πάντα αυθόρμητα από το θερμότερο προς το ψυχρότερο σώμα, ποτέ αντίστροφα.",
      "descriptionEn": "Write 2 everyday examples where heat flows from a hotter to a colder object. The most common trap on this topic: Hasn't fixed the rule that heat always flows spontaneously from hotter to colder, never the reverse.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT Edu",
      "titleEn": "Ask ChatGPT Edu",
      "descriptionEl": "Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα, άνοιξε το ChatGPT Edu και πες: «Δυσκολεύομαι στο \"Κατεύθυνση ροής θερμότητας\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Αν δεν έχεις πρόσβαση, χρησιμοποίησε το κανονικό ChatGPT με την ίδια προσέγγιση.",
      "descriptionEn": "If your school participates in the pilot program, open ChatGPT Edu and say: \"I'm struggling with 'Direction of heat flow'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" If you don't have access, use regular ChatGPT the same way.",
      "toolId": "chatgpt-edu"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ρώτα το Wolfram Alpha 'direction of heat flow' και επιβεβαίωσε τα παραδείγματά σου.",
      "descriptionEn": "Ask Wolfram Alpha 'direction of heat flow' and confirm your examples.",
      "toolId": "wolfram-alpha"
    }
  ],

  "physics-b-lyk.series-parallel-confusion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Σχεδίασε ένα κύκλωμα με 2 αντιστάσεις σε σειρά και ένα με 2 αντιστάσεις παράλληλα, και γράψε τι διαφορά περιμένεις στην ολική αντίσταση. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τη συνδεσμολογία σε σειρά με την παράλληλη σύνδεση αντιστάσεων και τις διαφορετικές τους ιδιότητες.",
      "descriptionEn": "Draw a circuit with 2 series resistors and one with 2 parallel resistors, and write what difference you expect in total resistance. The most common trap on this topic: Confuses series and parallel resistor connections and their different properties.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT Edu",
      "titleEn": "Ask ChatGPT Edu",
      "descriptionEl": "Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα, άνοιξε το ChatGPT Edu και πες: «Δυσκολεύομαι στο \"Σειρά vs Παράλληλη σύνδεση\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Αν δεν έχεις πρόσβαση, χρησιμοποίησε το κανονικό ChatGPT με την ίδια προσέγγιση.",
      "descriptionEn": "If your school participates in the pilot program, open ChatGPT Edu and say: \"I'm struggling with 'Series vs Parallel circuits'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" If you don't have access, use regular ChatGPT the same way.",
      "toolId": "chatgpt-edu"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ρώτα το Wolfram Alpha να υπολογίσει την ολική αντίσταση και για τα δύο κυκλώματά σου, με τις δικές σου τιμές.",
      "descriptionEn": "Ask Wolfram Alpha to calculate the total resistance for both your circuits, using your own values.",
      "toolId": "wolfram-alpha"
    }
  ],

  "istoria-a-lyk.polis-definition": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 3 βασικά χαρακτηριστικά της αρχαίας ελληνικής πόλης-κράτους, από τη μνήμη σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει τα βασικά χαρακτηριστικά της αρχαίας ελληνικής πόλης-κράτους (αυτόνομη πολιτική/στρατιωτική/θρησκευτική οντότητα με δικούς της νόμους).",
      "descriptionEn": "Write 3 key characteristics of the ancient Greek city-state, from memory. The most common trap on this topic: Doesn't recognize the defining features of the ancient Greek city-state (an autonomous political/military/religious unit with its own laws).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Η πόλη-κράτος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό. Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα ChatGPT Edu, μπορείς να το χρησιμοποιήσεις με τον ίδιο τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'The city-state'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together. If your school participates in the ChatGPT Edu pilot program, you can use it the same way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Η πόλη-κράτος\" σε 3-4 προτάσεις σαν να το παρουσιάζεις σε έναν συμμαθητή, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"The city-state\" in 3-4 sentences as if presenting it to a classmate, without notes.",
      "toolId": null
    }
  ],

  "istoria-a-lyk.persian-wars-cause": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με τη σειρά τα γεγονότα που θυμάσαι να οδήγησαν στην έναρξη των Περσικών Πολέμων. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν συνδέει την Ιωνική Επανάσταση με την έναρξη των Περσικών Πολέμων· βλέπει τη σύγκρουση ως ξαφνική, χωρίς προηγούμενη αιτία.",
      "descriptionEn": "Write in order the events you remember leading to the start of the Persian Wars. The most common trap on this topic: Doesn't connect the Ionian Revolt to the start of the Persian Wars; sees the conflict as sudden, without a prior cause.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Αιτίες Περσικών Πολέμων\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό. Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα ChatGPT Edu, μπορείς να το χρησιμοποιήσεις με τον ίδιο τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Causes of the Persian Wars'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together. If your school participates in the ChatGPT Edu pilot program, you can use it the same way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Perplexity",
      "titleEn": "Check with Perplexity",
      "descriptionEl": "Ρώτα το Perplexity για «Αιτίες Περσικών Πολέμων» και δες τις πηγές κάτω από την απάντηση. Σύγκρινε αν αυτό που έγραψες στο πρώτο βήμα ταιριάζει με τεκμηριωμένες πηγές, όχι μόνο με τη μνήμη σου.",
      "descriptionEn": "Ask Perplexity about \"Causes of the Persian Wars\" and check the sources under the answer. Compare whether what you wrote in step one matches documented sources, not just your memory.",
      "toolId": "perplexity"
    }
  ],

  "istoria-a-lyk.alexander-empire-unity": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε τι θυμάσαι ότι συνέβη στην αυτοκρατορία του Μεγάλου Αλεξάνδρου μετά τον θάνατό του. Η πιο συχνή παγίδα σε αυτό το θέμα: Πιστεύει ότι η αυτοκρατορία του Μεγάλου Αλεξάνδρου παρέμεινε ενωμένη μετά τον θάνατό του, ενώ στην πραγματικότητα διαλύθηκε στα ελληνιστικά βασίλεια των Διαδόχων.",
      "descriptionEn": "Write what you remember happening to Alexander the Great's empire after his death. The most common trap on this topic: Believes Alexander the Great's empire remained unified after his death, when it actually broke up into the Hellenistic kingdoms of his Successors.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Διάδοχοι Αλεξάνδρου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό. Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα ChatGPT Edu, μπορείς να το χρησιμοποιήσεις με τον ίδιο τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Alexander's Successors'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together. If your school participates in the ChatGPT Edu pilot program, you can use it the same way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Perplexity",
      "titleEn": "Check with Perplexity",
      "descriptionEl": "Ρώτα το Perplexity για «Διάδοχοι Αλεξάνδρου» και δες τις πηγές κάτω από την απάντηση. Σύγκρινε αν αυτό που έγραψες στο πρώτο βήμα ταιριάζει με τεκμηριωμένες πηγές, όχι μόνο με τη μνήμη σου.",
      "descriptionEn": "Ask Perplexity about \"Alexander's Successors\" and check the sources under the answer. Compare whether what you wrote in step one matches documented sources, not just your memory.",
      "toolId": "perplexity"
    }
  ],

  "istoria-a-lyk.direct-democracy-athens": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με δικά σου λόγια πώς λειτουργούσε η άμεση δημοκρατία στην αρχαία Αθήνα, και πώς διαφέρει από τη σημερινή. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει την αθηναϊκή άμεση δημοκρατία (οι πολίτες αποφασίζουν οι ίδιοι στην Εκκλησία του Δήμου) με τη σύγχρονη αντιπροσωπευτική δημοκρατία.",
      "descriptionEn": "Write in your own words how direct democracy worked in ancient Athens, and how it differs from today's. The most common trap on this topic: Confuses Athenian direct democracy (citizens themselves decide in the Assembly) with modern representative democracy.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Άμεση δημοκρατία\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό. Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα ChatGPT Edu, μπορείς να το χρησιμοποιήσεις με τον ίδιο τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Direct democracy'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together. If your school participates in the ChatGPT Edu pilot program, you can use it the same way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Άμεση δημοκρατία\" σε 3-4 προτάσεις σαν να το παρουσιάζεις σε έναν συμμαθητή, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Direct democracy\" in 3-4 sentences as if presenting it to a classmate, without notes.",
      "toolId": null
    }
  ],

  "istoria-b-lyk.byzantium-continuation": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε γιατί θυμάσαι ότι το Βυζάντιο θεωρείται συνέχεια της Ρωμαϊκής Αυτοκρατορίας. Η πιο συχνή παγίδα σε αυτό το θέμα: Βλέπει τη Βυζαντινή Αυτοκρατορία ως εντελώς ξεχωριστό κράτος, χωρίς να αναγνωρίζει ότι ήταν η άμεση συνέχεια της Ρωμαϊκής Αυτοκρατορίας στην Ανατολή.",
      "descriptionEn": "Write why you remember Byzantium being considered a continuation of the Roman Empire. The most common trap on this topic: Sees the Byzantine Empire as a completely separate state, without recognizing it as the direct continuation of the Roman Empire in the East.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Βυζάντιο ως συνέχεια της Ρώμης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό. Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα ChatGPT Edu, μπορείς να το χρησιμοποιήσεις με τον ίδιο τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Byzantium as Rome's continuation'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together. If your school participates in the ChatGPT Edu pilot program, you can use it the same way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Βυζάντιο ως συνέχεια της Ρώμης\" σε 3-4 προτάσεις σαν να το παρουσιάζεις σε έναν συμμαθητή, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Byzantium as Rome's continuation\" in 3-4 sentences as if presenting it to a classmate, without notes.",
      "toolId": null
    }
  ],

  "istoria-b-lyk.fall-constantinople-1453": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε τη χρονολογία και 2 λόγους για τους οποίους η Άλωση του 1453 θεωρείται σημείο-ορόσημο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν γνωρίζει τη χρονολογία ή τη σημασία της Άλωσης του 1453 ως το τέλος της Βυζαντινής Αυτοκρατορίας και σημείο-ορόσημο της ευρωπαϊκής ιστορίας.",
      "descriptionEn": "Write the date and 2 reasons why the 1453 Fall is considered a landmark event. The most common trap on this topic: Doesn't know the date or significance of the 1453 Fall as the end of the Byzantine Empire and a landmark in European history.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Άλωση της Κωνσταντινούπολης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό. Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα ChatGPT Edu, μπορείς να το χρησιμοποιήσεις με τον ίδιο τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Fall of Constantinople'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together. If your school participates in the ChatGPT Edu pilot program, you can use it the same way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Perplexity",
      "titleEn": "Check with Perplexity",
      "descriptionEl": "Ρώτα το Perplexity για «Άλωση της Κωνσταντινούπολης» και δες τις πηγές κάτω από την απάντηση. Σύγκρινε αν αυτό που έγραψες στο πρώτο βήμα ταιριάζει με τεκμηριωμένες πηγές, όχι μόνο με τη μνήμη σου.",
      "descriptionEn": "Ask Perplexity about \"Fall of Constantinople\" and check the sources under the answer. Compare whether what you wrote in step one matches documented sources, not just your memory.",
      "toolId": "perplexity"
    }
  ],

  "istoria-b-lyk.renaissance-cause": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2 παράγοντες που θυμάσαι ότι βοήθησαν στη διάδοση της Αναγέννησης στην Ευρώπη. Η πιο συχνή παγίδα σε αυτό το θέμα: Βλέπει την Αναγέννηση ως τυχαίο γεγονός, χωρίς να συνδέει τη διάδοσή της με παράγοντες όπως η μετακίνηση λογίων και χειρογράφων προς τη Δύση.",
      "descriptionEn": "Write 2 factors you remember helping the Renaissance spread across Europe. The most common trap on this topic: Sees the Renaissance as a random event, without connecting its spread to factors like the movement of scholars and manuscripts westward.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Αιτίες Αναγέννησης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό. Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα ChatGPT Edu, μπορείς να το χρησιμοποιήσεις με τον ίδιο τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Causes of the Renaissance'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together. If your school participates in the ChatGPT Edu pilot program, you can use it the same way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Perplexity",
      "titleEn": "Check with Perplexity",
      "descriptionEl": "Ρώτα το Perplexity για «Αιτίες Αναγέννησης» και δες τις πηγές κάτω από την απάντηση. Σύγκρινε αν αυτό που έγραψες στο πρώτο βήμα ταιριάζει με τεκμηριωμένες πηγές, όχι μόνο με τη μνήμη σου.",
      "descriptionEn": "Ask Perplexity about \"Causes of the Renaissance\" and check the sources under the answer. Compare whether what you wrote in step one matches documented sources, not just your memory.",
      "toolId": "perplexity"
    }
  ],

  "istoria-b-lyk.ottoman-administration": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 διαφορές που θυμάσαι στην καθημερινή ζωή των Ελλήνων υπό οθωμανική κυριαρχία, ανάλογα με την περιοχή ή την τάξη τους. Η πιο συχνή παγίδα σε αυτό το θέμα: Νομίζει ότι όλοι οι Έλληνες υπό οθωμανική κυριαρχία ζούσαν στην ίδια κατάσταση καθημερινά, αγνοώντας τις διαφορές (π.χ. προνόμια Εκκλησίας, φόρος κεφαλής, αρματολίκια).",
      "descriptionEn": "Write 2-3 differences you remember in daily life for Greeks under Ottoman rule, depending on region or class. The most common trap on this topic: Thinks all Greeks under Ottoman rule lived under identical daily conditions, ignoring differences (e.g. Church privileges, the head tax, local militias).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Οθωμανική διοίκηση Ελλήνων\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό. Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα ChatGPT Edu, μπορείς να το χρησιμοποιήσεις με τον ίδιο τρόπο.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Ottoman rule over Greeks'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together. If your school participates in the ChatGPT Edu pilot program, you can use it the same way.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Perplexity",
      "titleEn": "Check with Perplexity",
      "descriptionEl": "Ρώτα το Perplexity για «Οθωμανική διοίκηση Ελλήνων» και δες τις πηγές κάτω από την απάντηση. Σύγκρινε αν αυτό που έγραψες στο πρώτο βήμα ταιριάζει με τεκμηριωμένες πηγές, όχι μόνο με τη μνήμη σου.",
      "descriptionEn": "Ask Perplexity about \"Ottoman rule over Greeks\" and check the sources under the answer. Compare whether what you wrote in step one matches documented sources, not just your memory.",
      "toolId": "perplexity"
    }
  ],

  "efl-c-lyk.mixed-conditionals": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2 προτάσεις με μεικτό υποθετικό λόγο (υπόθεση στο παρελθόν, αποτέλεσμα στο παρόν, ή αντίστροφα). Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται με μεικτούς υποθετικούς λόγους, όπου η υπόθεση αφορά το παρελθόν και το αποτέλεσμα το παρόν (ή αντίστροφα).",
      "descriptionEn": "Write 2 sentences with a mixed conditional (past condition, present result, or vice versa). The most common trap on this topic: Struggles with mixed conditionals, where the condition is in the past but the result is in the present (or vice versa).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT Edu",
      "titleEn": "Ask ChatGPT Edu",
      "descriptionEl": "Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα, άνοιξε το ChatGPT Edu και πες: «Δυσκολεύομαι στο \"Μεικτοί υποθετικοί λόγοι\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Αν δεν έχεις πρόσβαση, χρησιμοποίησε το κανονικό ChatGPT με την ίδια προσέγγιση.",
      "descriptionEn": "If your school participates in the pilot program, open ChatGPT Edu and say: \"I'm struggling with 'Mixed conditionals'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" If you don't have access, use regular ChatGPT the same way.",
      "toolId": "chatgpt-edu"
    },
    {
      "titleEl": "Έλεγξε με το Gemini",
      "titleEn": "Check with Gemini",
      "descriptionEl": "Επικόλλησε τις προτάσεις σου στο Gemini και ρώτα: «Έχω λάθος στο \"Μεικτοί υποθετικοί λόγοι\"; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Paste your sentences into Gemini and ask: \"Do I have this wrong on 'Mixed conditionals'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    }
  ],

  "efl-c-lyk.inversion-emphasis": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2 προτάσεις με αντεστραμμένη σύνταξη για έμφαση (π.χ. ξεκινώντας με 'Never', 'Rarely', 'Not only'). Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει δομές αντεστραμμένης σύνταξης για έμφαση (π.χ. «Never have I seen…»), τυπικές σε προχωρημένο, επίσημο ύφος.",
      "descriptionEn": "Write 2 sentences using inversion for emphasis (e.g. starting with 'Never', 'Rarely', 'Not only'). The most common trap on this topic: Doesn't recognize inverted structures used for emphasis (e.g. 'Never have I seen…'), typical of advanced, formal register.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT Edu",
      "titleEn": "Ask ChatGPT Edu",
      "descriptionEl": "Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα, άνοιξε το ChatGPT Edu και πες: «Δυσκολεύομαι στο \"Αντεστραμμένη σύνταξη\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Αν δεν έχεις πρόσβαση, χρησιμοποίησε το κανονικό ChatGPT με την ίδια προσέγγιση.",
      "descriptionEn": "If your school participates in the pilot program, open ChatGPT Edu and say: \"I'm struggling with 'Inversion for emphasis'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" If you don't have access, use regular ChatGPT the same way.",
      "toolId": "chatgpt-edu"
    },
    {
      "titleEl": "Έλεγξε με το Gemini",
      "titleEn": "Check with Gemini",
      "descriptionEl": "Επικόλλησε τις προτάσεις σου στο Gemini και ρώτα: «Έχω λάθος στο \"Αντεστραμμένη σύνταξη\"; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Paste your sentences into Gemini and ask: \"Do I have this wrong on 'Inversion for emphasis'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    }
  ],

  "efl-c-lyk.academic-collocations": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 3 προτάσεις σε ακαδημαϊκό ύφος χρησιμοποιώντας τις συνάψεις 'conduct research', 'draw a conclusion', 'raise a question'. Η πιο συχνή παγίδα σε αυτό το θέμα: Χρησιμοποιεί λάθος ρήμα σε ακαδημαϊκές συνάψεις λέξεων (π.χ. «make research» αντί για «conduct/do research»).",
      "descriptionEn": "Write 3 sentences in academic style using the collocations 'conduct research', 'draw a conclusion', 'raise a question'. The most common trap on this topic: Uses the wrong verb in academic collocations (e.g. 'make research' instead of 'conduct/do research').",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT Edu",
      "titleEn": "Ask ChatGPT Edu",
      "descriptionEl": "Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα, άνοιξε το ChatGPT Edu και πες: «Δυσκολεύομαι στο \"Ακαδημαϊκές συνάψεις\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Αν δεν έχεις πρόσβαση, χρησιμοποίησε το κανονικό ChatGPT με την ίδια προσέγγιση.",
      "descriptionEn": "If your school participates in the pilot program, open ChatGPT Edu and say: \"I'm struggling with 'Academic collocations'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" If you don't have access, use regular ChatGPT the same way.",
      "toolId": "chatgpt-edu"
    },
    {
      "titleEl": "Έλεγξε με το Gemini",
      "titleEn": "Check with Gemini",
      "descriptionEl": "Επικόλλησε τις προτάσεις σου στο Gemini και ρώτα: «Έχω λάθος στο \"Ακαδημαϊκές συνάψεις\"; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Paste your sentences into Gemini and ask: \"Do I have this wrong on 'Academic collocations'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    }
  ],

  "efl-c-lyk.passive-voice-formal": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Ξαναγράψε 2 προτάσεις που έγραψες σε ενεργητική φωνή, μετατρέποντάς τες σε παθητική για πιο επίσημο ύφος. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν χρησιμοποιεί την παθητική φωνή όπου ταιριάζει σε επίσημο/ακαδημαϊκό κείμενο, κρατώντας πάντα ενεργητική σύνταξη με «I» ή «we».",
      "descriptionEn": "Rewrite 2 sentences you wrote in active voice, converting them to passive for a more formal tone. The most common trap on this topic: Doesn't use the passive voice where it fits formal/academic writing, always keeping active constructions with 'I' or 'we'.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT Edu",
      "titleEn": "Ask ChatGPT Edu",
      "descriptionEl": "Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα, άνοιξε το ChatGPT Edu και πες: «Δυσκολεύομαι στο \"Παθητική φωνή σε επίσημο ύφος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Αν δεν έχεις πρόσβαση, χρησιμοποίησε το κανονικό ChatGPT με την ίδια προσέγγιση.",
      "descriptionEn": "If your school participates in the pilot program, open ChatGPT Edu and say: \"I'm struggling with 'Passive voice in formal register'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" If you don't have access, use regular ChatGPT the same way.",
      "toolId": "chatgpt-edu"
    },
    {
      "titleEl": "Έλεγξε με το Gemini",
      "titleEn": "Check with Gemini",
      "descriptionEl": "Επικόλλησε τις προτάσεις σου στο Gemini και ρώτα: «Έχω λάθος στο \"Παθητική φωνή σε επίσημο ύφος\"; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Paste your sentences into Gemini and ask: \"Do I have this wrong on 'Passive voice in formal register'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    }
  ],

  "efl-c-lyk.phrasal-vs-formal-verb": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 3 προτάσεις με phrasal verbs (π.χ. find out, put off, look into) και μετά ξαναγράψε τις με το πιο επίσημο ισοδύναμο (discover, postpone, investigate). Η πιο συχνή παγίδα σε αυτό το θέμα: Χρησιμοποιεί καθημερινά phrasal verbs (π.χ. «find out») σε επίσημο/ακαδημαϊκό κείμενο αντί για το πιο επίσημο ισοδύναμο (π.χ. «discover»).",
      "descriptionEn": "Write 3 sentences with phrasal verbs (e.g. find out, put off, look into) then rewrite them with the more formal equivalent (discover, postpone, investigate). The most common trap on this topic: Uses everyday phrasal verbs (e.g. 'find out') in formal/academic writing instead of the more formal equivalent (e.g. 'discover').",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT Edu",
      "titleEn": "Ask ChatGPT Edu",
      "descriptionEl": "Αν το σχολείο σου συμμετέχει στο πιλοτικό πρόγραμμα, άνοιξε το ChatGPT Edu και πες: «Δυσκολεύομαι στο \"Phrasal vs επίσημο ρήμα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Αν δεν έχεις πρόσβαση, χρησιμοποίησε το κανονικό ChatGPT με την ίδια προσέγγιση.",
      "descriptionEn": "If your school participates in the pilot program, open ChatGPT Edu and say: \"I'm struggling with 'Phrasal vs formal verb'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" If you don't have access, use regular ChatGPT the same way.",
      "toolId": "chatgpt-edu"
    },
    {
      "titleEl": "Έλεγξε με το Gemini",
      "titleEn": "Check with Gemini",
      "descriptionEl": "Επικόλλησε τις προτάσεις σου στο Gemini και ρώτα: «Έχω λάθος στο \"Phrasal vs επίσημο ρήμα\"; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Paste your sentences into Gemini and ask: \"Do I have this wrong on 'Phrasal vs formal verb'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    }
  ],

  "biologia-a-lyk.homeostasis": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με δικά σου λόγια τι είναι η ομοιόσταση, με ένα παράδειγμα (π.χ. ρύθμιση θερμοκρασίας σώματος). Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι η ομοιόσταση είναι η ικανότητα του οργανισμού να διατηρεί σταθερό το εσωτερικό του περιβάλλον.",
      "descriptionEn": "Write in your own words what homeostasis is, with an example (e.g. body temperature regulation). The most common trap on this topic: Doesn't know homeostasis is the organism's ability to keep its internal environment stable.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Ομοιόσταση\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Homeostasis'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Ομοιόσταση\" σε έναν συμμαθητή σου με 2-3 προτάσεις, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Homeostasis\" to a classmate in 2-3 sentences, without notes.",
      "toolId": null
    }
  ],

  "biologia-a-lyk.red-blood-cell-role": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε τον κύριο ρόλο των ερυθρών αιμοσφαιρίων, χωρίς να κοιτάξεις το βιβλίο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι ο κύριος ρόλος των ερυθρών αιμοσφαιρίων είναι η μεταφορά οξυγόνου.",
      "descriptionEn": "Write the main role of red blood cells, without looking at the book. The most common trap on this topic: Doesn't know the main role of red blood cells is transporting oxygen.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Ρόλος ερυθρών αιμοσφαιρίων\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Role of red blood cells'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Ρόλος ερυθρών αιμοσφαιρίων\" σε έναν συμμαθητή σου με 2-3 προτάσεις, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Role of red blood cells\" to a classmate in 2-3 sentences, without notes.",
      "toolId": null
    }
  ],

  "biologia-a-lyk.immune-system": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με δικά σου λόγια πώς νομίζεις ότι το σώμα αμύνεται όταν μπει ένα μικρόβιο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι το ανοσοποιητικό σύστημα είναι υπεύθυνο για την άμυνα του οργανισμού απέναντι σε μικρόβια.",
      "descriptionEn": "Write in your own words how you think the body defends itself when a germ enters. The most common trap on this topic: Doesn't know the immune system is responsible for defending the body against pathogens.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Ανοσοποιητικό σύστημα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Immune system'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Ανοσοποιητικό σύστημα\" σε έναν συμμαθητή σου με 2-3 προτάσεις, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Immune system\" to a classmate in 2-3 sentences, without notes.",
      "toolId": null
    }
  ],

  "biologia-a-lyk.mitochondria-function": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε τι κάνει το μιτοχόνδριο μέσα στο κύτταρο, με δικά σου λόγια. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι το μιτοχόνδριο είναι το οργανίδιο που παράγει την ενέργεια (ATP) του κυττάρου.",
      "descriptionEn": "Write what the mitochondrion does inside the cell, in your own words. The most common trap on this topic: Doesn't know the mitochondrion is the organelle that produces the cell's energy (ATP).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Λειτουργία μιτοχονδρίου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Function of the mitochondrion'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Λειτουργία μιτοχονδρίου\" σε έναν συμμαθητή σου με 2-3 προτάσεις, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Function of the mitochondrion\" to a classmate in 2-3 sentences, without notes.",
      "toolId": null
    }
  ],

  "biologia-a-lyk.digestion-purpose": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε γιατί χρειάζεται το σώμα να πέψει την τροφή, πέρα από «για να τη φάει». Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι ο σκοπός της πέψης είναι να διασπάσει την τροφή ώστε να απορροφηθούν τα θρεπτικά συστατικά της.",
      "descriptionEn": "Write why the body needs to digest food, beyond 'to eat it'. The most common trap on this topic: Doesn't know digestion's purpose is breaking down food so its nutrients can be absorbed.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Σκοπός πέψης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Purpose of digestion'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Σκοπός πέψης\" σε έναν συμμαθητή σου με 2-3 προτάσεις, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Purpose of digestion\" to a classmate in 2-3 sentences, without notes.",
      "toolId": null
    }
  ],

  "biologia-b-lyk.mendel-first-law": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με δικά σου λόγια τι λέει ο πρώτος νόμος του Mendel για τον διαχωρισμό των γονιδίων. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι σύμφωνα με τον πρώτο νόμο του Mendel, τα γονίδια διαχωρίζονται κατά τη δημιουργία γαμετών.",
      "descriptionEn": "Write in your own words what Mendel's first law says about gene separation. The most common trap on this topic: Doesn't know that according to Mendel's first law, genes separate during gamete formation.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Πρώτος νόμος του Mendel\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Mendel's first law'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ρώτα το Wolfram Alpha 'Punnett square Aa x Aa' και δες αν το αποτέλεσμα ταιριάζει με αυτό που περίμενες.",
      "descriptionEn": "Ask Wolfram Alpha 'Punnett square Aa x Aa' and see whether the result matches what you expected.",
      "toolId": "wolfram-alpha"
    }
  ],

  "biologia-b-lyk.transcription-translation": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με τη σειρά τα δύο βήματα από το DNA μέχρι την πρωτεΐνη, με δικά σου λόγια. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι το DNA μεταφράζεται σε πρωτεΐνη μέσω δύο βημάτων: πρώτα μεταγραφή σε RNA, μετά μετάφραση.",
      "descriptionEn": "Write in order the two steps from DNA to protein, in your own words. The most common trap on this topic: Doesn't know DNA is translated into protein through two steps: first transcription to RNA, then translation.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Μεταγραφή & μετάφραση DNA\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Transcription & translation of DNA'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ρώτα το Wolfram Alpha 'DNA transcription translation steps' και σύγκρινε με αυτό που έγραψες.",
      "descriptionEn": "Ask Wolfram Alpha 'DNA transcription translation steps' and compare with what you wrote.",
      "toolId": "wolfram-alpha"
    }
  ],

  "biologia-b-lyk.dominant-allele": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε ένα παράδειγμα με ένα κυρίαρχο και ένα υπολειπόμενο αλληλόμορφο, και πες ποιο χαρακτηριστικό θα εκφραστεί. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι ένα επικρατές (κυρίαρχο) γονίδιο εκφράζεται ακόμα κι όταν συνυπάρχει με ένα υπολειπόμενο.",
      "descriptionEn": "Write an example with one dominant and one recessive allele, and say which trait will be expressed. The most common trap on this topic: Doesn't know a dominant allele is expressed even when paired with a recessive one.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Επικρατές γονίδιο\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Dominant allele'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ρώτα το Wolfram Alpha να λύσει το παράδειγμά σου με Punnett square και έλεγξε τη λύση σου.",
      "descriptionEn": "Ask Wolfram Alpha to solve your example with a Punnett square and check your solution.",
      "toolId": "wolfram-alpha"
    }
  ],

  "biologia-b-lyk.biotechnology-definition": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με δικά σου λόγια τι είναι η βιοτεχνολογία και δώσε ένα παράδειγμα εφαρμογής της. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι η βιοτεχνολογία χρησιμοποιεί βιολογικές διεργασίες ή οργανισμούς για την παραγωγή προϊόντων ή λύσεων.",
      "descriptionEn": "Write in your own words what biotechnology is and give an example application. The most common trap on this topic: Doesn't know biotechnology uses biological processes or organisms to produce products or solutions.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Έννοια βιοτεχνολογίας\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Concept of biotechnology'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ρώτα το Wolfram Alpha για ένα παράδειγμα βιοτεχνολογικής εφαρμογής και σύγκρινε με το δικό σου.",
      "descriptionEn": "Ask Wolfram Alpha for an example biotechnology application and compare with your own.",
      "toolId": "wolfram-alpha"
    }
  ],

  "biologia-b-lyk.heterozygous-genotype": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε τι σημαίνει ο γονότυπος Aa, και τι διαφορά έχει από τον AA και τον aa. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι ένας ετερόζυγος γονότυπος (π.χ. Aa) σημαίνει ότι το άτομο έχει ένα κυρίαρχο και ένα υπολειπόμενο αλληλόμορφο.",
      "descriptionEn": "Write what genotype Aa means, and how it differs from AA and aa. The most common trap on this topic: Doesn't know a heterozygous genotype (e.g. Aa) means the individual has one dominant and one recessive allele.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Ετερόζυγος γονότυπος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Heterozygous genotype'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ρώτα το Wolfram Alpha τη διαφορά ομόζυγου και ετερόζυγου γονότυπου και έλεγξε τη δική σου εξήγηση.",
      "descriptionEn": "Ask Wolfram Alpha the difference between homozygous and heterozygous genotypes and check your own explanation.",
      "toolId": "wolfram-alpha"
    }
  ],

  "biologia-g-lyk.antibody-source": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε ποια κύτταρα θυμάσαι ότι παράγουν τα αντισώματα. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι τα αντισώματα παράγονται από τα Β-λεμφοκύτταρα του ανοσοποιητικού συστήματος.",
      "descriptionEn": "Write which cells you remember producing antibodies. The most common trap on this topic: Doesn't know antibodies are produced by B-lymphocytes of the immune system.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Παραγωγή αντισωμάτων\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Antibody production'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Παραγωγή αντισωμάτων\" σε έναν συμμαθητή σου με 2-3 προτάσεις, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Antibody production\" to a classmate in 2-3 sentences, without notes.",
      "toolId": null
    }
  ],

  "biologia-g-lyk.natural-selection": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με δικά σου λόγια πώς λειτουργεί η φυσική επιλογή, με ένα παράδειγμα ζώου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι η φυσική επιλογή ευνοεί οργανισμούς που είναι καλύτερα προσαρμοσμένοι στο περιβάλλον τους και αναπαράγονται περισσότερο.",
      "descriptionEn": "Write in your own words how natural selection works, with an animal example. The most common trap on this topic: Doesn't know natural selection favors organisms better adapted to their environment that reproduce more.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Φυσική επιλογή\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Natural selection'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Φυσική επιλογή\" σε έναν συμμαθητή σου με 2-3 προτάσεις, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Natural selection\" to a classmate in 2-3 sentences, without notes.",
      "toolId": null
    }
  ],

  "biologia-g-lyk.vaccine-mechanism": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με δικά σου λόγια πώς νομίζεις ότι λειτουργεί ένα εμβόλιο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι ένα εμβόλιο λειτουργεί εκπαιδεύοντας το ανοσοποιητικό σύστημα να αναγνωρίζει έναν παθογόνο, χωρίς να προκαλεί πραγματική νόσο.",
      "descriptionEn": "Write in your own words how you think a vaccine works. The most common trap on this topic: Doesn't know a vaccine works by training the immune system to recognize a pathogen, without causing actual disease.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Μηχανισμός εμβολιασμού\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Vaccine mechanism'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Μηχανισμός εμβολιασμού\" σε έναν συμμαθητή σου με 2-3 προτάσεις, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Vaccine mechanism\" to a classmate in 2-3 sentences, without notes.",
      "toolId": null
    }
  ],

  "biologia-g-lyk.energy-food-chain": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Σχεδίασε μια απλή τροφική αλυσίδα (4 επίπεδα) και σημείωσε τι νομίζεις ότι συμβαίνει στην ενέργεια σε κάθε βήμα. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι η ενέργεια μειώνεται καθώς περνάει από το ένα τροφικό επίπεδο στο επόμενο σε μια τροφική αλυσίδα.",
      "descriptionEn": "Draw a simple food chain (4 levels) and note what you think happens to energy at each step. The most common trap on this topic: Doesn't know energy decreases as it passes from one trophic level to the next in a food chain.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Ενέργεια σε τροφική αλυσίδα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Energy in a food chain'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Ενέργεια σε τροφική αλυσίδα\" σε έναν συμμαθητή σου με 2-3 προτάσεις, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Energy in a food chain\" to a classmate in 2-3 sentences, without notes.",
      "toolId": null
    }
  ],

  "biologia-g-lyk.evolution-timescale": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε με δικά σου λόγια πόσο χρόνο παίρνει η εξέλιξη ενός είδους, και γιατί δεν συμβαίνει σε ένα άτομο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι η εξέλιξη ενός είδους συμβαίνει σε πολλές γενιές, μέσω σταδιακών αλλαγών στη συχνότητα γονιδίων, όχι σε ένα άτομο.",
      "descriptionEn": "Write in your own words how long a species takes to evolve, and why it doesn't happen within one individual. The most common trap on this topic: Doesn't know a species evolves over many generations through gradual gene-frequency changes, not within one individual.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT και πες: «Δυσκολεύομαι στο \"Χρονική κλίμακα εξέλιξης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του πάνω σε αυτό.",
      "descriptionEn": "Open ChatGPT and say: \"I'm struggling with 'Timescale of evolution'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work on this together.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα \"Χρονική κλίμακα εξέλιξης\" σε έναν συμμαθητή σου με 2-3 προτάσεις, χωρίς σημειώσεις.",
      "descriptionEn": "Explain the topic \"Timescale of evolution\" to a classmate in 2-3 sentences, without notes.",
      "toolId": null
    }
  ],

  "math-a-dim.number-order": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Σύγκριση αριθμών έως 20» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να συγκρίνει και να διατάξει αριθμούς έως το 20, ειδικά όταν ο μεγαλύτερος αριθμός γράφεται με λιγότερα σύμβολα φαινομενικά μπερδεμένα.",
      "descriptionEn": "Solve 2-3 exercises on \"Comparing numbers to 20\" by hand, writing out every step. The most common trap on this topic: Struggles to compare and order numbers up to 20, especially when the bigger number looks deceptively similar to a smaller one.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Σύγκριση αριθμών έως 20\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Comparing numbers to 20'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Σύγκριση αριθμών έως 20» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Comparing numbers to 20\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-a-dim.addition-crossing-ten": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Πρόσθεση με πέρασμα δεκάδας» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται στην πρόσθεση όταν το άθροισμα περνά τη δεκάδα (π.χ. 8+5), γιατί δεν έχει ακόμα αυτοματοποιήσει τη στρατηγική «συμπλήρωσε πρώτα τη δεκάδα».",
      "descriptionEn": "Solve 2-3 exercises on \"Addition crossing ten\" by hand, writing out every step. The most common trap on this topic: Struggles with addition when the sum crosses ten (e.g. 8+5), because they haven't yet automated the 'make ten first' strategy.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Πρόσθεση με πέρασμα δεκάδας\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Addition crossing ten'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Πρόσθεση με πέρασμα δεκάδας» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Addition crossing ten\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-a-dim.subtraction-borrowing-concept": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Έννοια της αφαίρεσης» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν έχει ακόμα καταλάβει την αφαίρεση ως «πόσα λείπουν για να φτάσω» και προσπαθεί να τη λύσει μόνο μηχανικά, χωρίς νόημα.",
      "descriptionEn": "Solve 2-3 exercises on \"Meaning of subtraction\" by hand, writing out every step. The most common trap on this topic: Hasn't yet grasped subtraction as 'how many more to reach the total' and tries to solve it mechanically, without meaning.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Έννοια της αφαίρεσης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Meaning of subtraction'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Έννοια της αφαίρεσης» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Meaning of subtraction\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-a-dim.shape-recognition": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Βασικά γεωμετρικά σχήματα» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει βασικά σχήματα μεταξύ τους (π.χ. τετράγωνο με ορθογώνιο), γιατί δεν έχει ακόμα σταθερό κριτήριο αναγνώρισης (ίσες πλευρές, γωνίες).",
      "descriptionEn": "Solve 2-3 exercises on \"Basic geometric shapes\" by hand, writing out every step. The most common trap on this topic: Confuses basic shapes with each other (e.g. square with rectangle), because they don't yet have a stable recognition rule (equal sides, angles).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Βασικά γεωμετρικά σχήματα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Basic geometric shapes'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το GeoGebra",
      "titleEn": "Check with GeoGebra",
      "descriptionEl": "Φτιάξε μόνος/η ένα νέο παράδειγμα για «Βασικά γεωμετρικά σχήματα» και μετά έλεγξέ το στο GeoGebra.",
      "descriptionEn": "Make up a new example on \"Basic geometric shapes\" and then check it in GeoGebra.",
      "toolId": "geogebra"
    }
  ],

  "math-a-dim.ordinal-numbers": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Τακτικοί αριθμοί» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τους τακτικούς αριθμούς (πρώτος, δεύτερος, τρίτος) με τους απλούς απαριθμητικούς (ένα, δύο, τρία).",
      "descriptionEn": "Solve 2-3 exercises on \"Ordinal numbers\" by hand, writing out every step. The most common trap on this topic: Confuses ordinal numbers (first, second, third) with plain counting numbers (one, two, three).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Τακτικοί αριθμοί\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Ordinal numbers'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Τακτικοί αριθμοί» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Ordinal numbers\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "math-a-dim.length-comparison": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Σύγκριση μήκους» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να συγκρίνει το μήκος δύο αντικειμένων όταν δεν είναι τοποθετημένα δίπλα-δίπλα με την ίδια αφετηρία.",
      "descriptionEn": "Solve 2-3 exercises on \"Comparing length\" by hand, writing out every step. The most common trap on this topic: Struggles to compare the length of two objects when they aren't aligned at the same starting point.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Σύγκριση μήκους\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Comparing length'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Σύγκριση μήκους» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Comparing length\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "math-a-dim.subtraction-crossing-ten": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Αφαίρεση με πέρασμα δεκάδας» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται στην αφαίρεση όταν χρειάζεται να «σπάσει» τη δεκάδα (π.χ. 13-5), γιατί δεν έχει ακόμα σταθερή στρατηγική.",
      "descriptionEn": "Solve 2-3 exercises on \"Subtraction crossing ten\" by hand, writing out every step. The most common trap on this topic: Struggles with subtraction when it requires 'breaking' the ten (e.g. 13-5), without a stable strategy yet.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Αφαίρεση με πέρασμα δεκάδας\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Subtraction crossing ten'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Αφαίρεση με πέρασμα δεκάδας» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Subtraction crossing ten\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-a-dim.coin-recognition": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Αναγνώριση νομισμάτων» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει την αξία απλών νομισμάτων (π.χ. μπερδεύει το κέρμα του 1 λεπτού με του 1 ευρώ βάσει μεγέθους μόνο).",
      "descriptionEn": "Solve 2-3 exercises on \"Coin recognition\" by hand, writing out every step. The most common trap on this topic: Doesn't recognize the value of simple coins (e.g. confuses a 1-cent coin with a €1 coin based on size alone).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Αναγνώριση νομισμάτων\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Coin recognition'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Αναγνώριση νομισμάτων» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Coin recognition\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "math-b-dim.place-value-tens-ones": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Δεκάδες & μονάδες» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τη θέση των δεκάδων με τη θέση των μονάδων σε αριθμούς έως το 100 (π.χ. νομίζει ότι το 40 είναι μικρότερο από το 14).",
      "descriptionEn": "Solve 2-3 exercises on \"Tens & ones\" by hand, writing out every step. The most common trap on this topic: Confuses the tens place with the ones place in numbers up to 100 (e.g. thinks 40 is smaller than 14).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Δεκάδες & μονάδες\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Tens & ones'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Δεκάδες & μονάδες» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Tens & ones\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-b-dim.multiplication-as-repeated-addition": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Πολλαπλασιασμός ως πρόσθεση» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν έχει καταλάβει ακόμα ότι ο πολλαπλασιασμός είναι μια γρήγορη πρόσθεση ίδιων αριθμών (π.χ. 3×4 = 4+4+4).",
      "descriptionEn": "Solve 2-3 exercises on \"Multiplication as repeated addition\" by hand, writing out every step. The most common trap on this topic: Hasn't yet grasped that multiplication is a fast way to add equal groups (e.g. 3×4 = 4+4+4).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Πολλαπλασιασμός ως πρόσθεση\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Multiplication as repeated addition'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Πολλαπλασιασμός ως πρόσθεση» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Multiplication as repeated addition\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-b-dim.telling-time-half-hour": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Ώρα στη μισή» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να διαβάσει την ώρα όταν ο δείκτης των λεπτών δείχνει τη μισή (π.χ. 6:30), γιατί εστιάζει μόνο στον δείκτη της ώρας.",
      "descriptionEn": "Solve 2-3 exercises on \"Telling time to the half hour\" by hand, writing out every step. The most common trap on this topic: Struggles to read the time when the minute hand is at the half (e.g. 6:30), because they focus only on the hour hand.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ώρα στη μισή\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Telling time to the half hour'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Ώρα στη μισή» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Telling time to the half hour\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-b-dim.money-counting": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Μέτρημα χρημάτων» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να συνδυάσει νομίσματα και χαρτονομίσματα διαφορετικής αξίας για να φτάσει ένα συγκεκριμένο ποσό.",
      "descriptionEn": "Solve 2-3 exercises on \"Counting money\" by hand, writing out every step. The most common trap on this topic: Struggles to combine coins and notes of different values to reach a specific total.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Μέτρημα χρημάτων\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Counting money'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Μέτρημα χρημάτων» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Counting money\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-b-dim.addition-two-digit-no-carry": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Πρόσθεση διψήφιων χωρίς κρατούμενο» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν προσθέτει σωστά δεκάδες με δεκάδες και μονάδες με μονάδες όταν προσθέτει δύο διψήφιους αριθμούς.",
      "descriptionEn": "Solve 2-3 exercises on \"Two-digit addition without carrying\" by hand, writing out every step. The most common trap on this topic: Doesn't correctly add tens with tens and ones with ones when adding two two-digit numbers.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Πρόσθεση διψήφιων χωρίς κρατούμενο\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Two-digit addition without carrying'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Πρόσθεση διψήφιων χωρίς κρατούμενο» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Two-digit addition without carrying\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-b-dim.subtraction-two-digit-borrow": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Αφαίρεση διψήφιων με δανεικό» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει τι να κάνει όταν το ψηφίο των μονάδων του αφαιρετέου είναι μεγαλύτερο από του μειωτέου (χρειάζεται «δανεικό» από τη δεκάδα).",
      "descriptionEn": "Solve 2-3 exercises on \"Two-digit subtraction with borrowing\" by hand, writing out every step. The most common trap on this topic: Doesn't know what to do when the ones digit being subtracted is bigger than the ones digit it's subtracted from (needs to 'borrow' from the tens).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Αφαίρεση διψήφιων με δανεικό\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Two-digit subtraction with borrowing'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Αφαίρεση διψήφιων με δανεικό» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Two-digit subtraction with borrowing\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-b-dim.even-odd-numbers": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Ζυγοί και μονοί αριθμοί» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξεχωρίζει ζυγούς από μονούς αριθμούς, ειδικά σε μεγαλύτερους αριθμούς (π.χ. νομίζει ότι το 24 είναι μονός).",
      "descriptionEn": "Solve 2-3 exercises on \"Even and odd numbers\" by hand, writing out every step. The most common trap on this topic: Doesn't distinguish even from odd numbers, especially in bigger numbers (e.g. thinks 24 is odd).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ζυγοί και μονοί αριθμοί\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Even and odd numbers'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Ζυγοί και μονοί αριθμοί» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Even and odd numbers\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "math-b-dim.simple-graph-reading": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Ανάγνωση απλού ραβδογράμματος» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να διαβάσει τιμές από ένα απλό ραβδόγραμμα, μπερδεύοντας το ύψος της ράβδου με τον αριθμό.",
      "descriptionEn": "Solve 2-3 exercises on \"Reading a simple bar graph\" by hand, writing out every step. The most common trap on this topic: Struggles to read values from a simple bar graph, confusing bar height with the actual number.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ανάγνωση απλού ραβδογράμματος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Reading a simple bar graph'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το GeoGebra",
      "titleEn": "Check with GeoGebra",
      "descriptionEl": "Φτιάξε μόνος/η ένα νέο παράδειγμα για «Ανάγνωση απλού ραβδογράμματος» και μετά έλεγξέ το στο GeoGebra.",
      "descriptionEn": "Make up a new example on \"Reading a simple bar graph\" and then check it in GeoGebra.",
      "toolId": "geogebra"
    }
  ],

  "math-c-dim.times-table-recall": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Προπαίδεια» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν έχει αυτοματοποιήσει ακόμα βασικές προπαίδειες (π.χ. του 6, του 7, του 8) και προσπαθεί να τις υπολογίσει κάθε φορά από την αρχή.",
      "descriptionEn": "Solve 2-3 exercises on \"Times tables\" by hand, writing out every step. The most common trap on this topic: Hasn't yet automated basic times tables (e.g. 6, 7, 8) and tries to work them out from scratch every time.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Προπαίδεια\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Times tables'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Προπαίδεια» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Times tables\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-c-dim.division-as-sharing": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Έννοια της διαίρεσης» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν έχει καταλάβει ότι η διαίρεση σημαίνει «μοιράζω δίκαια σε ίσα μέρη» και προσπαθεί να τη λύσει μηχανικά, χωρίς νόημα.",
      "descriptionEn": "Solve 2-3 exercises on \"Meaning of division\" by hand, writing out every step. The most common trap on this topic: Hasn't grasped that division means 'sharing fairly into equal groups' and tries to solve it mechanically, without meaning.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Έννοια της διαίρεσης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Meaning of division'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Έννοια της διαίρεσης» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Meaning of division\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-c-dim.measurement-units": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Μονάδες μέτρησης μήκους» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει το μέτρο με το εκατοστό (π.χ. νομίζει ότι 1 μέτρο = 10 εκατοστά αντί για 100).",
      "descriptionEn": "Solve 2-3 exercises on \"Units of length\" by hand, writing out every step. The most common trap on this topic: Confuses meters with centimeters (e.g. thinks 1 meter = 10 cm instead of 100).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Μονάδες μέτρησης μήκους\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Units of length'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Μονάδες μέτρησης μήκους» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Units of length\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-c-dim.quarter-hour": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Ώρα σε τέταρτα» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να διαβάσει την ώρα στο τέταρτο (π.χ. 4:15 ή 4:45), γιατί δεν έχει ακόμα σταθερό τρόπο να μετράει τα λεπτά ανά τεταρτημόριο.",
      "descriptionEn": "Solve 2-3 exercises on \"Telling time in quarters\" by hand, writing out every step. The most common trap on this topic: Struggles to read the time at the quarter hour (e.g. 4:15 or 4:45), without a stable way to count minutes per quarter.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ώρα σε τέταρτα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Telling time in quarters'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Ώρα σε τέταρτα» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Telling time in quarters\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-c-dim.multiplication-two-digit-by-one": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Πολλαπλασιασμός διψήφιου επί μονοψήφιο» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν πολλαπλασιάζει σωστά κάθε ψηφίο ξεχωριστά όταν πολλαπλασιάζει διψήφιο αριθμό με μονοψήφιο.",
      "descriptionEn": "Solve 2-3 exercises on \"Two-digit by one-digit multiplication\" by hand, writing out every step. The most common trap on this topic: Doesn't correctly multiply each digit separately when multiplying a two-digit number by a one-digit number.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Πολλαπλασιασμός διψήφιου επί μονοψήφιο\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Two-digit by one-digit multiplication'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Πολλαπλασιασμός διψήφιου επί μονοψήφιο» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Two-digit by one-digit multiplication\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-c-dim.weight-units": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Μονάδες βάρους» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει το κιλό με το γραμμάριο, δεν ξέρει ότι 1 κιλό = 1000 γραμμάρια.",
      "descriptionEn": "Solve 2-3 exercises on \"Units of weight\" by hand, writing out every step. The most common trap on this topic: Confuses kilograms with grams, not knowing that 1 kg = 1000 grams.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Μονάδες βάρους\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Units of weight'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Μονάδες βάρους» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Units of weight\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "math-c-dim.remainder-meaning": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Έννοια του υπολοίπου» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει τι σημαίνει το υπόλοιπο σε μια διαίρεση — ότι είναι όσα «περισσεύουν» και δεν χωράνε σε ίσα μερίδια.",
      "descriptionEn": "Solve 2-3 exercises on \"Meaning of the remainder\" by hand, writing out every step. The most common trap on this topic: Doesn't understand what the remainder in a division means — the amount 'left over' that doesn't fit into equal groups.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Έννοια του υπολοίπου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Meaning of the remainder'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Έννοια του υπολοίπου» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Meaning of the remainder\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-c-dim.simple-fraction-recognition": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Αναγνώριση απλού κλάσματος» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει οπτικά το μισό ή το τέταρτο ενός σχήματος όταν δεν είναι χωρισμένο σε ίσα μέρη με τον συνηθισμένο τρόπο.",
      "descriptionEn": "Solve 2-3 exercises on \"Recognizing simple fractions\" by hand, writing out every step. The most common trap on this topic: Doesn't visually recognize half or a quarter of a shape when it's divided into equal parts in an unfamiliar way.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Αναγνώριση απλού κλάσματος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Recognizing simple fractions'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το GeoGebra",
      "titleEn": "Check with GeoGebra",
      "descriptionEl": "Φτιάξε μόνος/η ένα νέο παράδειγμα για «Αναγνώριση απλού κλάσματος» και μετά έλεγξέ το στο GeoGebra.",
      "descriptionEn": "Make up a new example on \"Recognizing simple fractions\" and then check it in GeoGebra.",
      "toolId": "geogebra"
    }
  ],

  "math-d-dim.fraction-same-denominator": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Πρόσθεση κλασμάτων ίδιου παρονομαστή» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Όταν προσθέτει κλάσματα με ίδιο παρονομαστή, προσθέτει και τους παρονομαστές αντί να τον κρατήσει σταθερό.",
      "descriptionEn": "Solve 2-3 exercises on \"Adding fractions with the same denominator\" by hand, writing out every step. The most common trap on this topic: When adding fractions with the same denominator, adds the denominators too instead of keeping it fixed.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Πρόσθεση κλασμάτων ίδιου παρονομαστή\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Adding fractions with the same denominator'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Πρόσθεση κλασμάτων ίδιου παρονομαστή» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Adding fractions with the same denominator\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-d-dim.decimal-intro-place-value": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Εισαγωγή στους δεκαδικούς» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει ακόμα ότι το «0,5» σημαίνει το μισό ενός ακέραιου, και το μπερδεύει με άλλο, τυχαίο νόημα.",
      "descriptionEn": "Solve 2-3 exercises on \"Introduction to decimals\" by hand, writing out every step. The most common trap on this topic: Doesn't yet understand that '0.5' means half of a whole, confusing it with some other, arbitrary meaning.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Εισαγωγή στους δεκαδικούς\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Introduction to decimals'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Εισαγωγή στους δεκαδικούς» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Introduction to decimals\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-d-dim.perimeter-concept": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Έννοια της περιμέτρου» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν έχει καταλάβει ότι η περίμετρος είναι το άθροισμα όλων των πλευρών «γύρω-γύρω» από ένα σχήμα.",
      "descriptionEn": "Solve 2-3 exercises on \"Meaning of perimeter\" by hand, writing out every step. The most common trap on this topic: Hasn't grasped that perimeter is the sum of all sides 'around' a shape.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Έννοια της περιμέτρου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Meaning of perimeter'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το GeoGebra",
      "titleEn": "Check with GeoGebra",
      "descriptionEl": "Φτιάξε μόνος/η ένα νέο παράδειγμα για «Έννοια της περιμέτρου» και μετά έλεγξέ το στο GeoGebra.",
      "descriptionEn": "Make up a new example on \"Meaning of perimeter\" and then check it in GeoGebra.",
      "toolId": "geogebra"
    }
  ],

  "math-d-dim.roman-numerals": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Ρωμαϊκοί αριθμοί» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται με βασικούς ρωμαϊκούς αριθμούς (π.χ. μπερδεύει το IV με το VI).",
      "descriptionEn": "Solve 2-3 exercises on \"Roman numerals\" by hand, writing out every step. The most common trap on this topic: Struggles with basic Roman numerals (e.g. confuses IV with VI).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ρωμαϊκοί αριθμοί\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Roman numerals'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Ρωμαϊκοί αριθμοί» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Roman numerals\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-d-dim.fraction-simplify-basic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Απλοποίηση κλάσματος» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει ότι ένα κλάσμα μπορεί να γραφτεί πιο απλά διαιρώντας αριθμητή και παρονομαστή με τον ίδιο αριθμό.",
      "descriptionEn": "Solve 2-3 exercises on \"Simplifying a fraction\" by hand, writing out every step. The most common trap on this topic: Doesn't understand that a fraction can be written more simply by dividing numerator and denominator by the same number.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Απλοποίηση κλάσματος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Simplifying a fraction'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Απλοποίηση κλάσματος» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Simplifying a fraction\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-d-dim.decimal-compare": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Σύγκριση δεκαδικών» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Νομίζει ότι ο δεκαδικός με περισσότερα ψηφία είναι πάντα ο μεγαλύτερος (π.χ. πιστεύει ότι 0,25 > 0,3).",
      "descriptionEn": "Solve 2-3 exercises on \"Comparing decimals\" by hand, writing out every step. The most common trap on this topic: Thinks the decimal with more digits is always bigger (e.g. believes 0.25 > 0.3).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Σύγκριση δεκαδικών\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Comparing decimals'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Σύγκριση δεκαδικών» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Comparing decimals\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-d-dim.area-basic-concept": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Βασική έννοια εμβαδού» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει το εμβαδόν ως πλήθος τετραγωνικών μονάδων που καλύπτουν ένα σχήμα, μπερδεύοντάς το με την περίμετρο.",
      "descriptionEn": "Solve 2-3 exercises on \"Basic concept of area\" by hand, writing out every step. The most common trap on this topic: Doesn't understand area as the number of square units covering a shape, confusing it with perimeter.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Βασική έννοια εμβαδού\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Basic concept of area'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το GeoGebra",
      "titleEn": "Check with GeoGebra",
      "descriptionEl": "Φτιάξε μόνος/η ένα νέο παράδειγμα για «Βασική έννοια εμβαδού» και μετά έλεγξέ το στο GeoGebra.",
      "descriptionEn": "Make up a new example on \"Basic concept of area\" and then check it in GeoGebra.",
      "toolId": "geogebra"
    }
  ],

  "math-d-dim.multiplication-by-10-100": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Πολλαπλασιασμός με 10 και 100» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν έχει καταλάβει τον κανόνα προσθήκης μηδενικών όταν πολλαπλασιάζει με το 10 ή το 100.",
      "descriptionEn": "Solve 2-3 exercises on \"Multiplying by 10 and 100\" by hand, writing out every step. The most common trap on this topic: Hasn't grasped the rule of adding zeros when multiplying by 10 or 100.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Πολλαπλασιασμός με 10 και 100\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Multiplying by 10 and 100'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Πολλαπλασιασμός με 10 και 100» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Multiplying by 10 and 100\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-e-dim.multiply-fraction-whole": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Πολλαπλασιασμός κλάσματος με ακέραιο» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ότι όταν πολλαπλασιάζει κλάσμα με ακέραιο, πολλαπλασιάζει μόνο τον αριθμητή, κρατώντας τον παρονομαστή σταθερό.",
      "descriptionEn": "Solve 2-3 exercises on \"Multiplying a fraction by a whole number\" by hand, writing out every step. The most common trap on this topic: Doesn't know that multiplying a fraction by a whole number only multiplies the numerator, keeping the denominator fixed.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Πολλαπλασιασμός κλάσματος με ακέραιο\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Multiplying a fraction by a whole number'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Πολλαπλασιασμός κλάσματος με ακέραιο» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Multiplying a fraction by a whole number\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-e-dim.average-concept": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Έννοια του μέσου όρου» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει ότι ο μέσος όρος βρίσκεται προσθέτοντας όλες τις τιμές και διαιρώντας με το πλήθος τους.",
      "descriptionEn": "Solve 2-3 exercises on \"Concept of average\" by hand, writing out every step. The most common trap on this topic: Doesn't understand that the average is found by adding all values and dividing by how many there are.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Έννοια του μέσου όρου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Concept of average'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Έννοια του μέσου όρου» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Concept of average\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-e-dim.volume-cube-basic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Όγκος με κύβους μονάδας» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει τον όγκο ως πλήθος κύβων μονάδας που χωράνε μέσα σε ένα στερεό.",
      "descriptionEn": "Solve 2-3 exercises on \"Volume using unit cubes\" by hand, writing out every step. The most common trap on this topic: Doesn't understand volume as the number of unit cubes that fit inside a solid.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Όγκος με κύβους μονάδας\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Volume using unit cubes'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το GeoGebra",
      "titleEn": "Check with GeoGebra",
      "descriptionEl": "Φτιάξε μόνος/η ένα νέο παράδειγμα για «Όγκος με κύβους μονάδας» και μετά έλεγξέ το στο GeoGebra.",
      "descriptionEn": "Make up a new example on \"Volume using unit cubes\" and then check it in GeoGebra.",
      "toolId": "geogebra"
    }
  ],

  "math-e-dim.negative-number-intro": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Εισαγωγή σε αρνητικούς αριθμούς» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει την έννοια των αρνητικών αριθμών σε πραγματικό πλαίσιο (π.χ. θερμοκρασία κάτω από το μηδέν).",
      "descriptionEn": "Solve 2-3 exercises on \"Introduction to negative numbers\" by hand, writing out every step. The most common trap on this topic: Doesn't understand negative numbers in a real context (e.g. temperature below zero).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Εισαγωγή σε αρνητικούς αριθμούς\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Introduction to negative numbers'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Εισαγωγή σε αρνητικούς αριθμούς» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Introduction to negative numbers\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "math-st-dim.decimal-multiplication": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Πολλαπλασιασμός δεκαδικών» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν τοποθετεί σωστά την υποδιαστολή στο αποτέλεσμα όταν πολλαπλασιάζει δεκαδικούς αριθμούς.",
      "descriptionEn": "Solve 2-3 exercises on \"Multiplying decimals\" by hand, writing out every step. The most common trap on this topic: Doesn't correctly place the decimal point in the result when multiplying decimal numbers.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Πολλαπλασιασμός δεκαδικών\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Multiplying decimals'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Πολλαπλασιασμός δεκαδικών» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Multiplying decimals\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-st-dim.discount-percent": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Ποσοστά έκπτωσης» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να υπολογίσει την τελική τιμή μετά από ποσοστιαία έκπτωση, συχνά αφαιρώντας μόνο το ποσοστό αντί για το αντίστοιχο ποσό.",
      "descriptionEn": "Solve 2-3 exercises on \"Discount percentages\" by hand, writing out every step. The most common trap on this topic: Struggles to compute the final price after a percentage discount, often subtracting the percent figure itself instead of the corresponding amount.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ποσοστά έκπτωσης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Discount percentages'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Ποσοστά έκπτωσης» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Discount percentages\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-st-dim.ratio-proportion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Αναλογίες» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει ότι μια αναλογία διατηρεί τη σχέση μεγεθών σταθερή, και προσπαθεί να λύσει προβλήματα αναλογίας μόνο με πρόσθεση.",
      "descriptionEn": "Solve 2-3 exercises on \"Ratios and proportions\" by hand, writing out every step. The most common trap on this topic: Doesn't grasp that a ratio keeps the relationship between quantities constant, and tries to solve ratio problems using addition only.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Αναλογίες\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Ratios and proportions'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Αναλογίες» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Ratios and proportions\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-st-dim.volume-units": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Μονάδες όγκου/χωρητικότητας» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει το λίτρο με το κυβικό εκατοστό, δεν ξέρει ότι 1 λίτρο = 1000 κυβικά εκατοστά.",
      "descriptionEn": "Solve 2-3 exercises on \"Units of volume/capacity\" by hand, writing out every step. The most common trap on this topic: Confuses liters with cubic centimeters, not knowing that 1 liter = 1000 cubic centimeters.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Μονάδες όγκου/χωρητικότητας\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Units of volume/capacity'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Μονάδες όγκου/χωρητικότητας» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Units of volume/capacity\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-st-dim.percent-increase": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Ποσοστό αύξησης» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να υπολογίσει την τελική τιμή μετά από ποσοστιαία αύξηση, συχνά προσθέτοντας μόνο το ποσοστό αντί για το αντίστοιχο ποσό.",
      "descriptionEn": "Solve 2-3 exercises on \"Percent increase\" by hand, writing out every step. The most common trap on this topic: Struggles to compute the final value after a percentage increase, often adding just the percent figure instead of the corresponding amount.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ποσοστό αύξησης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Percent increase'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Ποσοστό αύξησης» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Percent increase\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],

  "math-st-dim.speed-distance-time-basic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Σχέση ταχύτητας-απόστασης-χρόνου» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει τη βασική σχέση: ταχύτητα = απόσταση ÷ χρόνος, και μπερδεύει ποιο μέγεθος διαιρεί με ποιο.",
      "descriptionEn": "Solve 2-3 exercises on \"Speed-distance-time relationship\" by hand, writing out every step. The most common trap on this topic: Doesn't understand the basic relationship: speed = distance ÷ time, confusing which quantity divides which.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Σχέση ταχύτητας-απόστασης-χρόνου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Speed-distance-time relationship'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Φτιάξε μόνος/η ένα νέο πρόβλημα για «Σχέση ταχύτητας-απόστασης-χρόνου», λύσε το με το χέρι, και έλεγξέ το στο Wolfram Alpha.",
      "descriptionEn": "Make up a new problem on \"Speed-distance-time relationship\", solve it by hand, and check it in Wolfram Alpha.",
      "toolId": "wolfram-alpha"
    }
  ],

  "math-st-dim.negative-number-operations": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Βασικές πράξεις με αρνητικούς» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει τι γίνεται όταν προσθέτει έναν θετικό και έναν αρνητικό αριθμό (π.χ. 5 + (-3)).",
      "descriptionEn": "Solve 2-3 exercises on \"Basic operations with negative numbers\" by hand, writing out every step. The most common trap on this topic: Doesn't know what happens when adding a positive and a negative number (e.g. 5 + (-3)).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Βασικές πράξεις με αρνητικούς\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Basic operations with negative numbers'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Φτιάξε μόνος/η ένα νέο πρόβλημα για «Βασικές πράξεις με αρνητικούς», λύσε το με το χέρι, και έλεγξέ το στο Wolfram Alpha.",
      "descriptionEn": "Make up a new problem on \"Basic operations with negative numbers\", solve it by hand, and check it in Wolfram Alpha.",
      "toolId": "wolfram-alpha"
    }
  ],

  "math-st-dim.probability-basic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Βασική πιθανότητα» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει πώς να εκφράσει μια απλή πιθανότητα ως κλάσμα (π.χ. πιθανότητα να φέρει 6 σε ένα ζάρι = 1/6).",
      "descriptionEn": "Solve 2-3 exercises on \"Basic probability\" by hand, writing out every step. The most common trap on this topic: Doesn't understand how to express a simple probability as a fraction (e.g. the chance of rolling a 6 = 1/6).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Βασική πιθανότητα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Basic probability'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Φτιάξε μόνος/η ένα νέο πρόβλημα για «Βασική πιθανότητα», λύσε το με το χέρι, και έλεγξέ το στο Wolfram Alpha.",
      "descriptionEn": "Make up a new problem on \"Basic probability\", solve it by hand, and check it in Wolfram Alpha.",
      "toolId": "wolfram-alpha"
    }
  ],

  "glossa-a-dim.letter-sound-confusion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Παρόμοια γράμματα» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει γράμματα με παρόμοιο σχήμα ή ήχο (π.χ. β/δ, μ/ν), κάτι πολύ συνηθισμένο στην πρώτη φάση εκμάθησης της γραφής.",
      "descriptionEn": "Write 2-3 of your own examples on \"Similar-looking letters\" in your notebook. The most common trap on this topic: Confuses letters with similar shape or sound (e.g. Greek β/δ, μ/ν), very common in the first stage of learning to write.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Παρόμοια γράμματα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Similar-looking letters'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Παρόμοια γράμματα» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Similar-looking letters\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-a-dim.sentence-boundary": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Όρια πρότασης» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει πού αρχίζει και πού τελειώνει μια πρόταση (κεφαλαίο γράμμα στην αρχή, τελεία στο τέλος).",
      "descriptionEn": "Write 2-3 of your own examples on \"Sentence boundaries\" in your notebook. The most common trap on this topic: Doesn't recognize where a sentence starts and ends (capital letter at the start, full stop at the end).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Όρια πρότασης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Sentence boundaries'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Όρια πρότασης» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Sentence boundaries\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-a-dim.plural-formation": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Σχηματισμός πληθυντικού» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται στον σχηματισμό του πληθυντικού απλών ουσιαστικών (π.χ. «το παιδί» → «τα παιδιά»).",
      "descriptionEn": "Write 2-3 of your own examples on \"Forming plurals\" in your notebook. The most common trap on this topic: Struggles to form the plural of simple nouns (e.g. 'το παιδί' → 'τα παιδιά').",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Σχηματισμός πληθυντικού\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Forming plurals'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Σχηματισμός πληθυντικού» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Forming plurals\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-a-dim.word-order-basic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Σειρά λέξεων σε πρόταση» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να συνθέσει μια απλή πρόταση με λογική σειρά λέξεων (υποκείμενο-ρήμα-αντικείμενο).",
      "descriptionEn": "Write 2-3 of your own examples on \"Basic word order\" in your notebook. The most common trap on this topic: Struggles to build a simple sentence with logical word order (subject-verb-object).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Σειρά λέξεων σε πρόταση\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Basic word order'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Σειρά λέξεων σε πρόταση» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Basic word order\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-a-dim.rhyming-words": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Ομοιοκαταληξία» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει πότε δύο λέξεις κάνουν ομοιοκαταληξία (τελειώνουν με τον ίδιο ήχο).",
      "descriptionEn": "Write 2-3 of your own examples on \"Rhyming words\" in your notebook. The most common trap on this topic: Doesn't recognize when two words rhyme (end with the same sound).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ομοιοκαταληξία\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Rhyming words'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Ομοιοκαταληξία» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Rhyming words\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-a-dim.singular-plural-verb": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Συμφωνία ρήματος-υποκειμένου (ενικός/πληθυντικός)» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν συμφωνεί τον αριθμό του ρήματος με το υποκείμενο (π.χ. «τα παιδιά παίζει» αντί για «παίζουν»).",
      "descriptionEn": "Write 2-3 of your own examples on \"Verb-subject agreement (singular/plural)\" in your notebook. The most common trap on this topic: Doesn't match the verb's number with the subject (e.g. 'the children plays' instead of 'play').",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Συμφωνία ρήματος-υποκειμένου (ενικός/πληθυντικός)\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Verb-subject agreement (singular/plural)'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Συμφωνία ρήματος-υποκειμένου (ενικός/πληθυντικός)» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Verb-subject agreement (singular/plural)\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-a-dim.question-mark-usage": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Χρήση ερωτηματικού» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει πότε μια πρόταση είναι ερώτηση και χρειάζεται ερωτηματικό στο τέλος.",
      "descriptionEn": "Write 2-3 of your own examples on \"Using the question mark\" in your notebook. The most common trap on this topic: Doesn't recognize when a sentence is a question and needs a question mark at the end.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Χρήση ερωτηματικού\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Using the question mark'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Χρήση ερωτηματικού» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Using the question mark\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-a-dim.opposite-words-basic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Απλά αντίθετα» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει απλά ζευγάρια αντίθετων λέξεων (μεγάλος/μικρός, ζεστός/κρύος).",
      "descriptionEn": "Write 2-3 of your own examples on \"Basic opposites\" in your notebook. The most common trap on this topic: Doesn't recognize simple pairs of opposite words (big/small, hot/cold).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Απλά αντίθετα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Basic opposites'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Απλά αντίθετα» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Basic opposites\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-b-dim.punctuation-question-exclamation": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Ερωτηματικό vs Θαυμαστικό» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει το ερωτηματικό με το θαυμαστικό, γιατί δεν ξεχωρίζει ακόμα αν μια πρόταση ρωτάει κάτι ή εκφράζει έντονο συναίσθημα.",
      "descriptionEn": "Write 2-3 of your own examples on \"Question mark vs Exclamation mark\" in your notebook. The most common trap on this topic: Confuses the question mark with the exclamation mark, not yet distinguishing whether a sentence asks something or expresses strong feeling.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ερωτηματικό vs Θαυμαστικό\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Question mark vs Exclamation mark'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Ερωτηματικό vs Θαυμαστικό» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Question mark vs Exclamation mark\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-b-dim.story-sequence": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Σειρά γεγονότων ιστορίας» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να βάλει σε λογική σειρά τα γεγονότα μιας μικρής ιστορίας (τι έγινε πρώτα, μετά, στο τέλος).",
      "descriptionEn": "Write 2-3 of your own examples on \"Story sequence\" in your notebook. The most common trap on this topic: Struggles to put the events of a short story in logical order (what happened first, next, last).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Σειρά γεγονότων ιστορίας\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Story sequence'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Σειρά γεγονότων ιστορίας» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Story sequence\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-b-dim.simple-past-tense": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Αόριστος χρόνος ρημάτων» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται στον σχηματισμό του αορίστου απλών ρημάτων (π.χ. «παίζω» → «έπαιξα»).",
      "descriptionEn": "Write 2-3 of your own examples on \"Simple past tense\" in your notebook. The most common trap on this topic: Struggles to form the simple past of common verbs (e.g. 'παίζω' [play] → 'έπαιξα' [played]).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Αόριστος χρόνος ρημάτων\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Simple past tense'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Αόριστος χρόνος ρημάτων» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Simple past tense\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-b-dim.synonym-basic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Συνώνυμα & αντίθετα» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει απλά συνώνυμα («χαρούμενος»/«ευτυχισμένος») ή αντίθετα («μεγάλος»/«μικρός») σε βασικές, καθημερινές λέξεις.",
      "descriptionEn": "Write 2-3 of your own examples on \"Synonyms & antonyms\" in your notebook. The most common trap on this topic: Doesn't recognize simple synonyms ('happy'/'glad') or antonyms ('big'/'small') among common, everyday words.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Συνώνυμα & αντίθετα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Synonyms & antonyms'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Συνώνυμα & αντίθετα» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Synonyms & antonyms\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-b-dim.capital-letter-proper-nouns": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Κεφαλαίο σε κύρια ονόματα» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν γράφει με κεφαλαίο τα κύρια ονόματα (ονόματα ανθρώπων, πόλεων) μέσα σε μια πρόταση.",
      "descriptionEn": "Write 2-3 of your own examples on \"Capital letters for proper nouns\" in your notebook. The most common trap on this topic: Doesn't capitalize proper nouns (names of people, cities) within a sentence.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Κεφαλαίο σε κύρια ονόματα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Capital letters for proper nouns'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Κεφαλαίο σε κύρια ονόματα» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Capital letters for proper nouns\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-b-dim.compound-word-basic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Απλές σύνθετες λέξεις» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει ότι μια σύνθετη λέξη αποτελείται από δύο μικρότερες λέξεις (π.χ. «ανοιχτήρι» = ανοίγω + -τήρι).",
      "descriptionEn": "Write 2-3 of your own examples on \"Basic compound words\" in your notebook. The most common trap on this topic: Doesn't recognize that a compound word is made of two smaller words.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Απλές σύνθετες λέξεις\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Basic compound words'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Απλές σύνθετες λέξεις» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Basic compound words\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-b-dim.sentence-vs-fragment": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Πλήρης πρόταση vs απόσπασμα» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξεχωρίζει μια πλήρη πρόταση (έχει υποκείμενο και ρήμα) από ένα απόσπασμα χωρίς νόημα μόνο του.",
      "descriptionEn": "Write 2-3 of your own examples on \"Complete sentence vs fragment\" in your notebook. The most common trap on this topic: Doesn't distinguish a complete sentence (has subject and verb) from a fragment that doesn't stand alone.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Πλήρης πρόταση vs απόσπασμα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Complete sentence vs fragment'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Πλήρης πρόταση vs απόσπασμα» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Complete sentence vs fragment\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-b-dim.dialogue-punctuation": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Στίξη διαλόγου» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν χρησιμοποιεί εισαγωγικά ή παύλες όταν γράφει τι είπε κάποιος σε έναν διάλογο.",
      "descriptionEn": "Write 2-3 of your own examples on \"Dialogue punctuation\" in your notebook. The most common trap on this topic: Doesn't use quotation marks or dashes when writing what someone said in a dialogue.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Στίξη διαλόγου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Dialogue punctuation'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Στίξη διαλόγου» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Dialogue punctuation\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-c-dim.description-paragraph": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Περιγραφική παράγραφος» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Όταν περιγράφει κάτι (π.χ. έναν χαρακτήρα), απαριθμεί τυχαία στοιχεία αντί να τα οργανώνει λογικά (π.χ. πρώτα εμφάνιση, μετά χαρακτήρας).",
      "descriptionEn": "Write 2-3 of your own examples on \"Descriptive paragraph\" in your notebook. The most common trap on this topic: When describing something (e.g. a character), lists random details instead of organizing them logically (e.g. appearance first, then personality).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Περιγραφική παράγραφος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Descriptive paragraph'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Περιγραφική παράγραφος» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Descriptive paragraph\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-c-dim.iota-vowel-spelling": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Ορθογραφία ι/η/υ» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τα φωνήεντα που ακούγονται ίδια (ι, η, υ, ει, οι) και γράφει τις λέξεις με το λάθος από αυτά.",
      "descriptionEn": "Write 2-3 of your own examples on \"Spelling ι/η/υ\" in your notebook. The most common trap on this topic: Confuses vowels that sound the same (ι, η, υ, ει, οι) and spells words with the wrong one.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ορθογραφία ι/η/υ\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Spelling ι/η/υ'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Ορθογραφία ι/η/υ» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Spelling ι/η/υ\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-c-dim.pronoun-reference": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Αντωνυμίες αναφοράς» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Χρησιμοποιεί αντωνυμίες («αυτός», «τον») χωρίς να είναι σαφές σε ποιον/τι αναφέρονται, μπερδεύοντας τον αναγνώστη.",
      "descriptionEn": "Write 2-3 of your own examples on \"Referential pronouns\" in your notebook. The most common trap on this topic: Uses pronouns ('he', 'it') without making clear who/what they refer to, confusing the reader.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Αντωνυμίες αναφοράς\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Referential pronouns'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Αντωνυμίες αναφοράς» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Referential pronouns\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-c-dim.adjective-agreement": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Συμφωνία επιθέτου-ουσιαστικού» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν συμφωνεί σωστά το γένος/αριθμό/πτώση επιθέτου με το ουσιαστικό (π.χ. «η όμορφος κοπέλα» αντί για «η όμορφη κοπέλα»).",
      "descriptionEn": "Write 2-3 of your own examples on \"Adjective-noun agreement\" in your notebook. The most common trap on this topic: Doesn't correctly match an adjective's gender/number/case with its noun (a common early error pattern in Greek).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Συμφωνία επιθέτου-ουσιαστικού\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Adjective-noun agreement'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Συμφωνία επιθέτου-ουσιαστικού» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Adjective-noun agreement\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-c-dim.verb-tense-consistency": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Συνέπεια χρόνου στην αφήγηση» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Αλλάζει χρόνο ρήματος μέσα στην ίδια αφήγηση χωρίς λόγο (π.χ. ξεκινά σε παρελθόντα και μπερδεύεται σε ενεστώτα).",
      "descriptionEn": "Write 2-3 of your own examples on \"Tense consistency in narration\" in your notebook. The most common trap on this topic: Switches verb tense within the same narration without reason (e.g. starts in past, drifts into present).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Συνέπεια χρόνου στην αφήγηση\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Tense consistency in narration'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Συνέπεια χρόνου στην αφήγηση» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Tense consistency in narration\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-c-dim.comma-in-list": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Κόμμα σε απαρίθμηση» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν βάζει κόμματα ανάμεσα σε στοιχεία μιας λίστας (π.χ. «Αγόρασα μήλα πορτοκάλια μπανάνες»).",
      "descriptionEn": "Write 2-3 of your own examples on \"Comma in a list\" in your notebook. The most common trap on this topic: Doesn't place commas between items in a list.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Κόμμα σε απαρίθμηση\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Comma in a list'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Κόμμα σε απαρίθμηση» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Comma in a list\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-c-dim.homophone-basic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Απλές ομόηχες λέξεις» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει απλές ομόηχες λέξεις που γράφονται διαφορετικά αλλά ακούγονται ίδια (π.χ. «μία» αριθμητικό vs «μια» άρθρο).",
      "descriptionEn": "Write 2-3 of your own examples on \"Basic homophones\" in your notebook. The most common trap on this topic: Confuses simple homophones that are spelled differently but sound the same.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Απλές ομόηχες λέξεις\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Basic homophones'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Απλές ομόηχες λέξεις» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Basic homophones\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-c-dim.title-choice": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Επιλογή κατάλληλου τίτλου» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Διαλέγει τίτλο για ένα κείμενο που είναι πολύ γενικός ή άσχετος με το περιεχόμενο, αντί να αντικατοπτρίζει την κύρια ιδέα.",
      "descriptionEn": "Write 2-3 of your own examples on \"Choosing a fitting title\" in your notebook. The most common trap on this topic: Picks a title for a text that's too generic or unrelated to the content, instead of reflecting the main idea.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Επιλογή κατάλληλου τίτλου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Choosing a fitting title'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Επιλογή κατάλληλου τίτλου» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Choosing a fitting title\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-d-dim.paragraph-structure": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Δομή αφηγηματικής παραγράφου» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Γράφει μια ιστορία χωρίς σαφή αρχή-μέση-τέλος, ξεκινώντας απευθείας στη μέση της δράσης χωρίς εισαγωγή.",
      "descriptionEn": "Write 2-3 of your own examples on \"Narrative paragraph structure\" in your notebook. The most common trap on this topic: Writes a story without a clear beginning-middle-end, diving straight into the action without an introduction.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Δομή αφηγηματικής παραγράφου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Narrative paragraph structure'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Δομή αφηγηματικής παραγράφου» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Narrative paragraph structure\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-d-dim.future-tense": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Μέλλοντας χρόνος» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται στον σχηματισμό του μέλλοντα ρημάτων (π.χ. «θα παίξω»), ειδικά όταν το ρήμα αλλάζει θέμα.",
      "descriptionEn": "Write 2-3 of your own examples on \"Future tense\" in your notebook. The most common trap on this topic: Struggles to form the future tense of verbs, especially when the verb changes stem.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Μέλλοντας χρόνος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Future tense'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Μέλλοντας χρόνος» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Future tense\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-d-dim.adjective-vs-adverb": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Επίθετο vs Επίρρημα» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει το επίθετο (περιγράφει ουσιαστικό, π.χ. «γρήγορος») με το επίρρημα (περιγράφει ρήμα, π.χ. «γρήγορα»).",
      "descriptionEn": "Write 2-3 of your own examples on \"Adjective vs Adverb\" in your notebook. The most common trap on this topic: Confuses the adjective (describes a noun) with the adverb (describes a verb).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Επίθετο vs Επίρρημα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Adjective vs Adverb'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Επίθετο vs Επίρρημα» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Adjective vs Adverb\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-d-dim.direct-indirect-speech": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Ευθύς vs Πλάγιος λόγος» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξεχωρίζει πότε ένα κείμενο μεταφέρει τα λόγια κάποιου αυτούσια (ευθύς λόγος, εισαγωγικά) και πότε αναδιατυπωμένα (πλάγιος λόγος).",
      "descriptionEn": "Write 2-3 of your own examples on \"Direct vs Indirect speech\" in your notebook. The most common trap on this topic: Doesn't distinguish when a text quotes someone's exact words (direct speech, quotation marks) versus reports them (indirect speech).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ευθύς vs Πλάγιος λόγος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Direct vs Indirect speech'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Ευθύς vs Πλάγιος λόγος» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Direct vs Indirect speech\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-d-dim.subject-predicate": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Υποκείμενο και κατηγόρημα» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει το υποκείμενο (ποιος κάνει την ενέργεια) και το κατηγόρημα (τι λέει γι' αυτόν) μέσα σε μια πρόταση.",
      "descriptionEn": "Write 2-3 of your own examples on \"Subject and predicate\" in your notebook. The most common trap on this topic: Doesn't identify the subject (who does the action) and predicate (what's said about them) in a sentence.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Υποκείμενο και κατηγόρημα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Subject and predicate'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Υποκείμενο και κατηγόρημα» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Subject and predicate\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-d-dim.paragraph-main-idea": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Κύρια ιδέα παραγράφου» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν εντοπίζει την κύρια ιδέα μιας παραγράφου, εστιάζοντας αντί αυτού σε μια δευτερεύουσα λεπτομέρεια.",
      "descriptionEn": "Write 2-3 of your own examples on \"Main idea of a paragraph\" in your notebook. The most common trap on this topic: Doesn't identify a paragraph's main idea, focusing instead on a minor detail.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Κύρια ιδέα παραγράφου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Main idea of a paragraph'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Κύρια ιδέα παραγράφου» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Main idea of a paragraph\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-d-dim.conjunction-choice": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Επιλογή κατάλληλου συνδέσμου» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Χρησιμοποιεί τον ίδιο σύνδεσμο («και») για όλες τις σχέσεις ανάμεσα σε προτάσεις, αντί να διαλέγει τον κατάλληλο (αλλά, γιατί, όμως).",
      "descriptionEn": "Write 2-3 of your own examples on \"Choosing the right conjunction\" in your notebook. The most common trap on this topic: Uses the same connector ('and') for all relationships between sentences, instead of choosing the right one (but, because, however).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Επιλογή κατάλληλου συνδέσμου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Choosing the right conjunction'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Επιλογή κατάλληλου συνδέσμου» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Choosing the right conjunction\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-d-dim.formal-informal-greeting": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Επίσημος vs ανεπίσημος χαιρετισμός» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Χρησιμοποιεί ανεπίσημο χαιρετισμό («Γεια σου») σε επιστολή προς άγνωστο ενήλικα, αντί για επίσημο («Αγαπητέ κύριε»).",
      "descriptionEn": "Write 2-3 of your own examples on \"Formal vs informal greeting\" in your notebook. The most common trap on this topic: Uses an informal greeting ('Hi') in a letter to an unfamiliar adult, instead of a formal one ('Dear Sir').",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Επίσημος vs ανεπίσημος χαιρετισμός\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Formal vs informal greeting'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Επίσημος vs ανεπίσημος χαιρετισμός» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Formal vs informal greeting\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-e-dim.simile-metaphor-basic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Απλή παρομοίωση» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει την παρομοίωση (σύγκριση με «σαν») ως λογοτεχνικό μέσο μέσα σε ένα κείμενο.",
      "descriptionEn": "Write 2-3 of your own examples on \"Basic simile\" in your notebook. The most common trap on this topic: Doesn't recognize a simile (a 'like/as' comparison) as a literary device within a text.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Απλή παρομοίωση\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Basic simile'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Απλή παρομοίωση» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Basic simile\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-e-dim.cause-effect-connector": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Σύνδεσμοι αιτίας-αποτελέσματος» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν χρησιμοποιεί σωστά συνδέσμους αιτίας-αποτελέσματος (γι' αυτό, επομένως, εξαιτίας) για να συνδέσει ιδέες.",
      "descriptionEn": "Write 2-3 of your own examples on \"Cause-effect connectors\" in your notebook. The most common trap on this topic: Doesn't correctly use cause-effect connectors (therefore, so, because of) to link ideas.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Σύνδεσμοι αιτίας-αποτελέσματος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Cause-effect connectors'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Σύνδεσμοι αιτίας-αποτελέσματος» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Cause-effect connectors\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-e-dim.formal-letter-structure": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Δομή επίσημης επιστολής» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ακολουθεί τη βασική δομή μιας επίσημης επιστολής (τόπος/ημερομηνία, χαιρετισμός, κυρίως θέμα, κλείσιμο, υπογραφή).",
      "descriptionEn": "Write 2-3 of your own examples on \"Formal letter structure\" in your notebook. The most common trap on this topic: Doesn't follow the basic structure of a formal letter (place/date, greeting, main body, closing, signature).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Δομή επίσημης επιστολής\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Formal letter structure'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Δομή επίσημης επιστολής» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Formal letter structure\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-e-dim.adjective-degree": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Βαθμοί επιθέτου» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τον συγκριτικό βαθμό («πιο όμορφος») με τον υπερθετικό («ο πιο όμορφος από όλους») ενός επιθέτου.",
      "descriptionEn": "Write 2-3 of your own examples on \"Degrees of adjectives\" in your notebook. The most common trap on this topic: Confuses the comparative degree ('more beautiful') with the superlative ('the most beautiful of all') of an adjective.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Βαθμοί επιθέτου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Degrees of adjectives'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Βαθμοί επιθέτου» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Degrees of adjectives\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-st-dim.participle-recognition": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Αναγνώριση μετοχής» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει τη μετοχή (π.χ. «τρέχοντας») ως ιδιαίτερο ρηματικό τύπο, μπερδεύοντάς τη με απλό ρήμα ή επίθετο.",
      "descriptionEn": "Write 2-3 of your own examples on \"Recognizing participles\" in your notebook. The most common trap on this topic: Doesn't recognize the participle (e.g. 'running') as a distinct verb form, confusing it with a plain verb or adjective.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Αναγνώριση μετοχής\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Recognizing participles'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Αναγνώριση μετοχής» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Recognizing participles\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-st-dim.compound-sentence-connectors": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Σύνδεσμοι σύνθετης πρότασης» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Χρησιμοποιεί λάθος σύνδεσμο για να ενώσει δύο προτάσεις (π.χ. «επειδή» αντί για «αν και» όταν εννοεί αντίθεση).",
      "descriptionEn": "Write 2-3 of your own examples on \"Compound sentence connectors\" in your notebook. The most common trap on this topic: Uses the wrong connector to join two clauses (e.g. 'because' instead of 'although' when meaning a contrast).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Σύνδεσμοι σύνθετης πρότασης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Compound sentence connectors'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Σύνδεσμοι σύνθετης πρότασης» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Compound sentence connectors\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-st-dim.literary-text-interpretation": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Ερμηνεία λογοτεχνικού κειμένου» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Διαβάζει ένα λογοτεχνικό απόσπασμα κυριολεκτικά, χωρίς να αναζητά το υπονοούμενο νόημα ή το συναίσθημα πίσω από τις λέξεις.",
      "descriptionEn": "Write 2-3 of your own examples on \"Interpreting a literary text\" in your notebook. The most common trap on this topic: Reads a literary passage literally, without looking for the implied meaning or feeling behind the words.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ερμηνεία λογοτεχνικού κειμένου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Interpreting a literary text'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Ερμηνεία λογοτεχνικού κειμένου» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Interpreting a literary text\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-st-dim.paragraph-connectors-flow": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Συνοχή ανάμεσα σε παραγράφους» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Γράφει διαδοχικές παραγράφους χωρίς καμία λέξη-γέφυρα ανάμεσά τους (π.χ. «επιπλέον», «ωστόσο»), κάνοντας το κείμενο να μοιάζει κομματιασμένο.",
      "descriptionEn": "Write 2-3 of your own examples on \"Flow between paragraphs\" in your notebook. The most common trap on this topic: Writes consecutive paragraphs with no bridging words between them (e.g. 'furthermore', 'however'), making the text feel disjointed.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Συνοχή ανάμεσα σε παραγράφους\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Flow between paragraphs'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Συνοχή ανάμεσα σε παραγράφους» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Flow between paragraphs\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-st-dim.passive-voice-basic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Βασική αναγνώριση παθητικής φωνής» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξεχωρίζει πότε ένα ρήμα είναι σε ενεργητική φωνή («έγραψε το γράμμα») και πότε σε παθητική («γράφτηκε το γράμμα»).",
      "descriptionEn": "Write 2-3 of your own examples on \"Basic passive voice recognition\" in your notebook. The most common trap on this topic: Doesn't distinguish when a verb is in active voice versus passive voice.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Βασική αναγνώριση παθητικής φωνής\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Basic passive voice recognition'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Βασική αναγνώριση παθητικής φωνής» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Basic passive voice recognition\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-st-dim.text-purpose-identification": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Αναγνώριση σκοπού κειμένου» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει αν ένα κείμενο θέλει να πληροφορήσει, να πείσει ή να διασκεδάσει τον αναγνώστη.",
      "descriptionEn": "Write 2-3 of your own examples on \"Identifying a text's purpose\" in your notebook. The most common trap on this topic: Doesn't recognize whether a text aims to inform, persuade, or entertain the reader.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Αναγνώριση σκοπού κειμένου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Identifying a text's purpose'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Αναγνώριση σκοπού κειμένου» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Identifying a text's purpose\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-st-dim.register-formal-informal": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Επίσημο vs ανεπίσημο ύφος» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξεχωρίζει πότε ένα κείμενο είναι γραμμένο σε επίσημο ύφος και πότε σε ανεπίσημο, καθημερινό ύφος.",
      "descriptionEn": "Write 2-3 of your own examples on \"Formal vs informal register\" in your notebook. The most common trap on this topic: Doesn't distinguish when a text is written in formal register versus informal, everyday register.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Επίσημο vs ανεπίσημο ύφος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Formal vs informal register'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Επίσημο vs ανεπίσημο ύφος» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Formal vs informal register\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "glossa-st-dim.conclusion-quality": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Ποιότητα επιλόγου» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Γράφει επίλογο που απλώς επαναλαμβάνει την εισαγωγή λέξη προς λέξη, αντί να συνοψίζει και να κλείνει το κείμενο ουσιαστικά.",
      "descriptionEn": "Write 2-3 of your own examples on \"Quality of a conclusion\" in your notebook. The most common trap on this topic: Writes a conclusion that just repeats the introduction word for word, instead of meaningfully summarizing and closing the text.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ποιότητα επιλόγου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Quality of a conclusion'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Ποιότητα επιλόγου» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Quality of a conclusion\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "efl-c-dim.colors-vocab": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Λεξιλόγιο χρωμάτων» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει βασικά χρώματα στα αγγλικά, ειδικά όσα μοιάζουν στην προφορά (π.χ. «purple»/«pink»).",
      "descriptionEn": "Write 2-3 of your own examples on \"Colors vocabulary\" in your notebook. The most common trap on this topic: Confuses basic colors in English, especially ones that sound similar (e.g. 'purple'/'pink').",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Λεξιλόγιο χρωμάτων\". Οι μικρές, καθημερινές ασκήσεις βοηθούν να θυμάσαι καλύτερα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Λεξιλόγιο χρωμάτων\". Short, daily exercises help it stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Λεξιλόγιο χρωμάτων» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Colors vocabulary\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "efl-c-dim.this-that": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «This vs That» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξεχωρίζει πότε λέμε «this» (κοντινό αντικείμενο) και πότε «that» (μακρινό αντικείμενο).",
      "descriptionEn": "Write 2-3 of your own examples on \"This vs That\" in your notebook. The most common trap on this topic: Doesn't distinguish when to say 'this' (nearby object) versus 'that' (far away object).",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"This vs That\". Οι μικρές, καθημερινές ασκήσεις βοηθούν να θυμάσαι καλύτερα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"This vs That\". Short, daily exercises help it stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «This vs That» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"This vs That\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "efl-c-dim.numbers-1-20": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Αριθμοί 1-20» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει αριθμούς που μοιάζουν στην προφορά στα αγγλικά (π.χ. «thirteen»/«thirty»).",
      "descriptionEn": "Write 2-3 of your own examples on \"Numbers 1-20\" in your notebook. The most common trap on this topic: Confuses numbers that sound similar in English (e.g. 'thirteen'/'thirty').",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Αριθμοί 1-20\". Οι μικρές, καθημερινές ασκήσεις βοηθούν να θυμάσαι καλύτερα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Αριθμοί 1-20\". Short, daily exercises help it stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Αριθμοί 1-20» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Numbers 1-20\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "efl-c-dim.family-vocab": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Λεξιλόγιο οικογένειας» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει βασικές λέξεις οικογένειας στα αγγλικά (π.χ. «brother»/«mother»).",
      "descriptionEn": "Write 2-3 of your own examples on \"Family vocabulary\" in your notebook. The most common trap on this topic: Confuses basic family words in English (e.g. 'brother'/'mother').",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Λεξιλόγιο οικογένειας\". Οι μικρές, καθημερινές ασκήσεις βοηθούν να θυμάσαι καλύτερα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Λεξιλόγιο οικογένειας\". Short, daily exercises help it stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Λεξιλόγιο οικογένειας» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Family vocabulary\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "efl-d-dim.present-simple-routines": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Present Simple καθημερινότητας» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να περιγράψει καθημερινές συνήθειες στον Ενεστώτα (π.χ. «I wake up at 7»), μπερδεύοντας τον χρόνο.",
      "descriptionEn": "Write 2-3 of your own examples on \"Present Simple for routines\" in your notebook. The most common trap on this topic: Struggles to describe daily routines in the Present Simple (e.g. 'I wake up at 7'), confusing the tense.",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Present Simple καθημερινότητας\". Οι μικρές, καθημερινές ασκήσεις βοηθούν να θυμάσαι καλύτερα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Present Simple καθημερινότητας\". Short, daily exercises help it stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Present Simple καθημερινότητας» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Present Simple for routines\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "efl-d-dim.house-rooms-vocab": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Λεξιλόγιο σπιτιού» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει βασικές λέξεις για δωμάτια του σπιτιού (π.χ. «kitchen»/«bathroom»).",
      "descriptionEn": "Write 2-3 of your own examples on \"House vocabulary\" in your notebook. The most common trap on this topic: Confuses basic words for rooms of the house (e.g. 'kitchen'/'bathroom').",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Λεξιλόγιο σπιτιού\". Οι μικρές, καθημερινές ασκήσεις βοηθούν να θυμάσαι καλύτερα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Λεξιλόγιο σπιτιού\". Short, daily exercises help it stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Λεξιλόγιο σπιτιού» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"House vocabulary\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "efl-d-dim.can-ability": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Can για ικανότητα» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν χρησιμοποιεί σωστά το «can» για να εκφράσει ικανότητα (π.χ. λέει «I can to swim» αντί για «I can swim»).",
      "descriptionEn": "Write 2-3 of your own examples on \"Can for ability\" in your notebook. The most common trap on this topic: Doesn't correctly use 'can' to express ability (e.g. says 'I can to swim' instead of 'I can swim').",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Can για ικανότητα\". Οι μικρές, καθημερινές ασκήσεις βοηθούν να θυμάσαι καλύτερα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Can για ικανότητα\". Short, daily exercises help it stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Can για ικανότητα» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Can for ability\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "efl-d-dim.days-months": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Μέρες & μήνες» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τη σειρά ή τα ονόματα των ημερών της εβδομάδας ή των μηνών στα αγγλικά.",
      "descriptionEn": "Write 2-3 of your own examples on \"Days & months\" in your notebook. The most common trap on this topic: Confuses the order or names of the days of the week or the months in English.",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Μέρες & μήνες\". Οι μικρές, καθημερινές ασκήσεις βοηθούν να θυμάσαι καλύτερα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Μέρες & μήνες\". Short, daily exercises help it stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Μέρες & μήνες» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Days & months\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "efl-st.past-simple-irregular": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Ανώμαλα ρήματα (Past Simple)» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Προσθέτει «-ed» σε ανώμαλα ρήματα (π.χ. «goed» αντί για «went»), εφαρμόζοντας τον κανόνα των ομαλών ρημάτων παντού.",
      "descriptionEn": "Write 2-3 of your own examples on \"Irregular verbs (Past Simple)\" in your notebook. The most common trap on this topic: Adds '-ed' to irregular verbs (e.g. 'goed' instead of 'went'), applying the regular-verb rule everywhere.",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Ανώμαλα ρήματα (Past Simple)\". Οι μικρές, καθημερινές ασκήσεις βοηθούν να θυμάσαι καλύτερα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Ανώμαλα ρήματα (Past Simple)\". Short, daily exercises help it stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Ανώμαλα ρήματα (Past Simple)» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Irregular verbs (Past Simple)\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "efl-st.comparative-superlative": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Συγκριτικός vs Υπερθετικός» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τον συγκριτικό βαθμό επιθέτου («bigger») με τον υπερθετικό («the biggest»), χρησιμοποιώντας τον λάθος όταν συγκρίνει πάνω από δύο πράγματα.",
      "descriptionEn": "Write 2-3 of your own examples on \"Comparative vs Superlative\" in your notebook. The most common trap on this topic: Confuses the comparative ('bigger') with the superlative ('the biggest'), using the wrong one when comparing more than two things.",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Συγκριτικός vs Υπερθετικός\". Οι μικρές, καθημερινές ασκήσεις βοηθούν να θυμάσαι καλύτερα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Συγκριτικός vs Υπερθετικός\". Short, daily exercises help it stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Συγκριτικός vs Υπερθετικός» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Comparative vs Superlative\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "efl-st.going-to-will": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Going to vs Will» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξεχωρίζει πότε χρησιμοποιούμε «going to» (προγραμματισμένο σχέδιο) και πότε «will» (απόφαση τη στιγμή που μιλάμε).",
      "descriptionEn": "Write 2-3 of your own examples on \"Going to vs Will\" in your notebook. The most common trap on this topic: Doesn't distinguish when to use 'going to' (a planned intention) versus 'will' (a decision made on the spot).",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Going to vs Will\". Οι μικρές, καθημερινές ασκήσεις βοηθούν να θυμάσαι καλύτερα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Going to vs Will\". Short, daily exercises help it stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Going to vs Will» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Going to vs Will\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "efl-st.countable-uncountable": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Countable vs Uncountable» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει το «much» με το «many», επειδή δεν ξεχωρίζει αν το ουσιαστικό μετριέται (countable) ή όχι (uncountable).",
      "descriptionEn": "Write 2-3 of your own examples on \"Countable vs Uncountable\" in your notebook. The most common trap on this topic: Confuses 'much' with 'many', because they can't yet tell if a noun is countable or uncountable.",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Countable vs Uncountable\". Οι μικρές, καθημερινές ασκήσεις βοηθούν να θυμάσαι καλύτερα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Countable vs Uncountable\". Short, daily exercises help it stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Countable vs Uncountable» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Countable vs Uncountable\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "efl-st.preposition-time": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Προθέσεις χρόνου» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τις προθέσεις χρόνου «in», «on», «at» (π.χ. «at Monday» αντί για «on Monday»).",
      "descriptionEn": "Write 2-3 of your own examples on \"Prepositions of time\" in your notebook. The most common trap on this topic: Confuses the time prepositions 'in', 'on', 'at' (e.g. 'at Monday' instead of 'on Monday').",
      "toolId": null
    },
    {
      "titleEl": "Εξασκήσου στο Duolingo",
      "titleEn": "Practice in Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo και κάνε 2-3 ασκήσεις πάνω σε \"Προθέσεις χρόνου\". Οι μικρές, καθημερινές ασκήσεις βοηθούν να θυμάσαι καλύτερα.",
      "descriptionEn": "Open Duolingo and do 2-3 exercises on \"Προθέσεις χρόνου\". Short, daily exercises help it stick.",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Προθέσεις χρόνου» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Prepositions of time\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-c-dim.myth-vs-history": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε από τη μνήμη σου ό,τι θυμάσαι για «Μύθος vs Ιστορία», πριν ανοίξεις το βιβλίο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξεχωρίζει τον μύθο (φανταστική αφήγηση με θεούς/ήρωες) από την ιστορία (γεγονότα που πραγματικά συνέβησαν).",
      "descriptionEn": "Write from memory what you remember about \"Myth vs History\", before opening the book. The most common trap on this topic: Doesn't distinguish myth (a fictional story with gods/heroes) from history (events that actually happened).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Μύθος vs Ιστορία\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Myth vs History'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Μύθος vs Ιστορία» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Myth vs History\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-c-dim.heracles-labors-order": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε από τη μνήμη σου ό,τι θυμάσαι για «Άθλοι του Ηρακλή», πριν ανοίξεις το βιβλίο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν θυμάται βασικά στοιχεία των άθλων του Ηρακλή (π.χ. μπερδεύει το λιοντάρι της Νεμέας με άλλο τέρας).",
      "descriptionEn": "Write from memory what you remember about \"Labors of Heracles\", before opening the book. The most common trap on this topic: Doesn't recall basic details of Heracles' labors (e.g. confuses the Nemean Lion with another monster).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Άθλοι του Ηρακλή\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Labors of Heracles'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Άθλοι του Ηρακλή» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Labors of Heracles\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-c-dim.trojan-war-cause": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε από τη μνήμη σου ό,τι θυμάσαι για «Αιτία Τρωικού Πολέμου», πριν ανοίξεις το βιβλίο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν θυμάται τι πυροδότησε τον Τρωικό Πόλεμο σύμφωνα με τον μύθο (η αρπαγή της Ελένης από τον Πάρη).",
      "descriptionEn": "Write from memory what you remember about \"Cause of the Trojan War\", before opening the book. The most common trap on this topic: Doesn't recall what triggered the Trojan War according to the myth (Paris's abduction of Helen).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Αιτία Τρωικού Πολέμου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Cause of the Trojan War'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Αιτία Τρωικού Πολέμου» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Cause of the Trojan War\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-c-dim.odysseus-journey": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε από τη μνήμη σου ό,τι θυμάσαι για «Το ταξίδι του Οδυσσέα», πριν ανοίξεις το βιβλίο. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τη σειρά ή τα πρόσωπα των περιπετειών του Οδυσσέα στο ταξίδι της επιστροφής του στην Ιθάκη.",
      "descriptionEn": "Write from memory what you remember about \"Odysseus's journey\", before opening the book. The most common trap on this topic: Confuses the order or characters in Odysseus's adventures on his journey home to Ithaca.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Το ταξίδι του Οδυσσέα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Odysseus's journey'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Το ταξίδι του Οδυσσέα» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Odysseus's journey\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-d-dim.minoan-crete": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε από τη μνήμη σου ό,τι θυμάσαι για «Μινωικός πολιτισμός», πριν ανοίξεις το βιβλίο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν συνδέει τον Μινωικό πολιτισμό με την Κρήτη και το ανάκτορο της Κνωσού, μπερδεύοντάς τον με άλλο πολιτισμό.",
      "descriptionEn": "Write from memory what you remember about \"Minoan civilization\", before opening the book. The most common trap on this topic: Doesn't connect Minoan civilization with Crete and the Palace of Knossos, confusing it with another civilization.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Μινωικός πολιτισμός\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Minoan civilization'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Μινωικός πολιτισμός» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Minoan civilization\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-d-dim.mycenaean-achaeans": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε από τη μνήμη σου ό,τι θυμάσαι για «Μυκηναίοι/Αχαιοί», πριν ανοίξεις το βιβλίο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει τους Μυκηναίους (Αχαιούς) ως τους πρώτους Έλληνες, με κέντρο τις Μυκήνες.",
      "descriptionEn": "Write from memory what you remember about \"Mycenaeans/Achaeans\", before opening the book. The most common trap on this topic: Doesn't recognize the Mycenaeans (Achaeans) as the first Greeks, centered on Mycenae.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Μυκηναίοι/Αχαιοί\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Mycenaeans/Achaeans'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Μυκηναίοι/Αχαιοί» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Mycenaeans/Achaeans\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-d-dim.polis-emergence": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε από τη μνήμη σου ό,τι θυμάσαι για «Γέννηση της πόλης-κράτους», πριν ανοίξεις το βιβλίο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει ότι η αρχαία Ελλάδα δεν ήταν ένα ενιαίο κράτος, αλλά πολλές ανεξάρτητες πόλεις-κράτη με δικούς τους νόμους.",
      "descriptionEn": "Write from memory what you remember about \"Rise of the city-state\", before opening the book. The most common trap on this topic: Doesn't understand that ancient Greece wasn't one unified state, but many independent city-states with their own laws.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Γέννηση της πόλης-κράτους\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Rise of the city-state'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Γέννηση της πόλης-κράτους» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Rise of the city-state\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-d-dim.olympic-games-origin": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε από τη μνήμη σου ό,τι θυμάσαι για «Καταγωγή Ολυμπιακών Αγώνων», πριν ανοίξεις το βιβλίο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν γνωρίζει ότι οι αρχαίοι Ολυμπιακοί Αγώνες γίνονταν στην Ολυμπία προς τιμήν του Δία, κάθε τέσσερα χρόνια.",
      "descriptionEn": "Write from memory what you remember about \"Origin of the Olympic Games\", before opening the book. The most common trap on this topic: Doesn't know that the ancient Olympic Games were held at Olympia in honor of Zeus, every four years.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Καταγωγή Ολυμπιακών Αγώνων\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Origin of the Olympic Games'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Καταγωγή Ολυμπιακών Αγώνων» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Origin of the Olympic Games\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-st-dim.revolution-year": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε από τη μνήμη σου ό,τι θυμάσαι για «Έτος Ελληνικής Επανάστασης», πριν ανοίξεις το βιβλίο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν θυμάται ότι η Ελληνική Επανάσταση ξεκίνησε το 1821.",
      "descriptionEn": "Write from memory what you remember about \"Year of the Greek Revolution\", before opening the book. The most common trap on this topic: Doesn't recall that the Greek Revolution began in 1821.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Έτος Ελληνικής Επανάστασης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Year of the Greek Revolution'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Έτος Ελληνικής Επανάστασης» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Year of the Greek Revolution\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-st-dim.kapodistrias-role": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε από τη μνήμη σου ό,τι θυμάσαι για «Ο Καποδίστριας», πριν ανοίξεις το βιβλίο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν αναγνωρίζει τον Ιωάννη Καποδίστρια ως τον πρώτο κυβερνήτη του ανεξάρτητου ελληνικού κράτους.",
      "descriptionEn": "Write from memory what you remember about \"Kapodistrias\", before opening the book. The most common trap on this topic: Doesn't recognize Ioannis Kapodistrias as the first governor of the independent Greek state.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ο Καποδίστριας\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Kapodistrias'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Ο Καποδίστριας» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Kapodistrias\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-st-dim.navarino-battle": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε από τη μνήμη σου ό,τι θυμάσαι για «Ναυμαχία του Ναβαρίνου», πριν ανοίξεις το βιβλίο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν γνωρίζει ότι η Ναυμαχία του Ναβαρίνου (1827), όπου οι Μεγάλες Δυνάμεις βοήθησαν την Ελλάδα, ήταν καθοριστική για την ανεξαρτησία.",
      "descriptionEn": "Write from memory what you remember about \"Battle of Navarino\", before opening the book. The most common trap on this topic: Doesn't know that the Battle of Navarino (1827), where the Great Powers helped Greece, was decisive for independence.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ναυμαχία του Ναβαρίνου\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Battle of Navarino'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Ναυμαχία του Ναβαρίνου» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Battle of Navarino\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "istoria-st-dim.modern-state-formation": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε από τη μνήμη σου ό,τι θυμάσαι για «Δημιουργία ελληνικού κράτους», πριν ανοίξεις το βιβλίο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει ότι το πρώτο ελεύθερο ελληνικό κράτος κάλυπτε αρχικά μικρό μέρος της σημερινής Ελλάδας, όχι όλη τη σημερινή επικράτεια.",
      "descriptionEn": "Write from memory what you remember about \"Formation of the Greek state\", before opening the book. The most common trap on this topic: Doesn't understand that the first free Greek state initially covered only a small part of present-day Greece, not the whole current territory.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Δημιουργία ελληνικού κράτους\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Formation of the Greek state'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Εξήγησε το θέμα «Δημιουργία ελληνικού κράτους» σε έναν γονιό ή αδερφό/ή με 2-3 δικές σου προτάσεις, χωρίς να κοιτάξεις σημειώσεις.",
      "descriptionEn": "Explain the topic \"Formation of the Greek state\" to a parent or sibling in 2-3 of your own sentences, without looking at notes.",
      "toolId": null
    }
  ],

  "science-st-dim.circuit-open-closed": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Ανοιχτό vs κλειστό κύκλωμα» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει ότι ένα ηλεκτρικό κύκλωμα πρέπει να είναι κλειστό (χωρίς διακοπή) για να περάσει ρεύμα και να ανάψει η λάμπα.",
      "descriptionEn": "Write 2-3 of your own examples on \"Open vs closed circuit\" in your notebook. The most common trap on this topic: Doesn't understand that an electric circuit must be closed (unbroken) for current to flow and light the bulb.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ανοιχτό vs κλειστό κύκλωμα\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Open vs closed circuit'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Ανοιχτό vs κλειστό κύκλωμα» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Open vs closed circuit\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "science-st-dim.digestive-system-order": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Σειρά πεπτικού συστήματος» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν θυμάται τη σωστή σειρά που ακολουθεί η τροφή μέσα στο πεπτικό σύστημα (στόμα, οισοφάγος, στομάχι, έντερα).",
      "descriptionEn": "Write 2-3 of your own examples on \"Order of the digestive system\" in your notebook. The most common trap on this topic: Doesn't recall the correct order food follows through the digestive system (mouth, esophagus, stomach, intestines).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Σειρά πεπτικού συστήματος\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Order of the digestive system'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Σειρά πεπτικού συστήματος» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Order of the digestive system\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "science-st-dim.renewable-vs-nonrenewable": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Ανανεώσιμες vs μη ανανεώσιμες πηγές» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει ανανεώσιμες πηγές ενέργειας (ήλιος, άνεμος) με μη ανανεώσιμες (πετρέλαιο, κάρβουνο).",
      "descriptionEn": "Write 2-3 of your own examples on \"Renewable vs non-renewable energy\" in your notebook. The most common trap on this topic: Confuses renewable energy sources (sun, wind) with non-renewable ones (oil, coal).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Ανανεώσιμες vs μη ανανεώσιμες πηγές\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Renewable vs non-renewable energy'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Ανανεώσιμες vs μη ανανεώσιμες πηγές» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Renewable vs non-renewable energy\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ],

  "science-st-dim.states-of-matter-change": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Γράψε 2-3 δικά σου παραδείγματα πάνω σε «Αλλαγές κατάστασης ύλης» στο τετράδιό σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει την τήξη (στερεό→υγρό) με την εξάτμιση (υγρό→αέριο), και δεν ξέρει ποια αλλαγή προκαλεί ποιο φαινόμενο.",
      "descriptionEn": "Write 2-3 of your own examples on \"Changes of state\" in your notebook. The most common trap on this topic: Confuses melting (solid→liquid) with evaporation (liquid→gas), unsure which change causes which phenomenon.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο \"Αλλαγές κατάστασης ύλης\". Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη απάντηση.» Δούλεψε μαζί του 2 νέα παραδείγματα με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Changes of state'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new examples this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το ChatGPT",
      "titleEn": "Check with ChatGPT",
      "descriptionEl": "Εξήγησε στο ChatGPT (μέσω γονιού) τι κατάλαβες για «Αλλαγές κατάστασης ύλης» και ρώτα: «Είναι σωστό αυτό που κατάλαβα; Τι μου λείπει;»",
      "descriptionEn": "Explain to ChatGPT (with a parent) what you understood about \"Changes of state\" and ask: \"Is what I understood correct? What am I missing?\"",
      "toolId": "chatgpt"
    }
  ]
};
