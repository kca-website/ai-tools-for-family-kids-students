(function(){
const chapters=[
  {
    "label": "1. Οι Ρωμαίοι κυβερνούν τους Έλληνες",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index1.html"
  },
  {
    "label": "2. Οι Έλληνες «κατακτούν» τους Ρωμαίους με τον πολιτισμό τους",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index1.html"
  },
  {
    "label": "3. Η ρωμαϊκή αυτοκρατορία, μια υπερδύναμη του αρχαίου κόσμου",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index1.html"
  },
  {
    "label": "4. Η καθημερινή ζωή στην αρχαία Ρώμη",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index1.html"
  },
  {
    "label": "5. Μεγάλες αλλαγές στη διοίκηση της αυτοκρατορίας",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index2.html"
  },
  {
    "label": "6. Μια νέα πρωτεύουσα, η Κωνσταντινούπολη",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index2.html"
  },
  {
    "label": "7. Η Κωνσταντινούπολη οχυρώνεται και στολίζεται με έργα τέχνης",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index2.html"
  },
  {
    "label": "8. Ο χριστιανισμός γίνεται επίσημη θρησκεία",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index2.html"
  },
  {
    "label": "9. Η Αυτοκρατορία χωρίζεται σε Ανατολική και Δυτική",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index2.html"
  },
  {
    "label": "10. Το Παλάτι, ο Ιππόδρομος και οι Δήμοι",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index2.html"
  },
  {
    "label": "11. Η καθημερινή ζωή στο Βυζάντιο",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index2.html"
  },
  {
    "label": "12. Η εκπαίδευση στο Βυζάντιο",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index2.html"
  },
  {
    "label": "13. Ο Ιουστινιανός μεταρρυθμίζει τη διοίκηση και τη νομοθεσία",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index3.html"
  },
  {
    "label": "14. Οι Δήμοι αναστατώνουν την πρωτεύουσα με τη «στάση του νίκα»",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index3.html"
  },
  {
    "label": "15. Η Αγία Σοφία, ένα αριστούργημα της αρχιτεκτονικής",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index3.html"
  },
  {
    "label": "16. Το βυζαντινό κράτος μεγαλώνει και φτάνει στα παλιά σύνορα της αυτοκρατορίας",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index3.html"
  },
  {
    "label": "17. Οι γείτονες των Βυζαντινών",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index4.html"
  },
  {
    "label": "18. Πέρσες και Άβαροι συμμαχούν εναντίον του Βυζαντίου",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index4.html"
  },
  {
    "label": "19. Οι Βυζαντινοί και οι Άραβες",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index4.html"
  },
  {
    "label": "20. Η φύλαξη των ανατολικών συνόρων και οι Ακρίτες",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index4.html"
  },
  {
    "label": "21. Το Βυζάντιο εκχριστιανίζει τους Σλάβους",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index4.html"
  },
  {
    "label": "22. Φιλικές σχέσεις και συγκρούσεις με τους Βούλγαρους και τους Ρώσους",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index4.html"
  },
  {
    "label": "23. Η νομοθεσία και η διοίκηση εκσυγχρονίζονται",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index5.html"
  },
  {
    "label": "24. Η κρίση της εικονομαχίας διχάζει τους Βυζαντινούς",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index5.html"
  },
  {
    "label": "25. Το Βυζάντιο φτάνει στο απόγειο της ακμής του",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index5.html"
  },
  {
    "label": "26. Η ανάπτυξη των γραμμάτων και η μελέτη των αρχαίων Ελλήνων κλασσικών",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index5.html"
  },
  {
    "label": "27. Η καθημερινή ζωή στην ύπαιθρο στα χρόνια των Ισαύρων και των Μακεδόνων",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index5.html"
  },
  {
    "label": "28. Το Κράτος αντιμετωπίζει μεγάλα εσωτερικά προβλήματα",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index6.html"
  },
  {
    "label": "29. Νέοι εχθροί εμφανίζονται και αποσπούν εδάφη από την αυτοκρατορία",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index6.html"
  },
  {
    "label": "31. Η ανάκτηση της Πόλης από το Μιχαήλ Η’, τον Παλαιολόγο",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index6.html"
  },
  {
    "label": "32. Η Θεσσαλονίκη γνωρίζει μεγάλη ακμή",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index6.html"
  },
  {
    "label": "33. Οι Οθωμανοί Τούρκοι κατακτούν βυζαντινά εδάφη",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index6.html"
  },
  {
    "label": "34. Ο Κωνσταντίνος Παλαιολόγος προσπαθεί να σώσει την πρωτεύουσα",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index6.html"
  },
  {
    "label": "35. Οι Τούρκοι πολιορκούν την Κωνσταντινούπολη",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index6.html"
  },
  {
    "label": "36. Η Άλωση της Κωνσταντινούπολης από τους Τούρκους",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index6.html"
  },
  {
    "label": "37. Η βυζαντινή Κύπρος",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index7.html"
  },
  {
    "label": "38. Η διπλωματία των Βυζαντινών",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index7.html"
  },
  {
    "label": "39. Η γυναίκα στη βυζαντινή κοινωνία",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index7.html"
  },
  {
    "label": "40. Η βυζαντινή τέχνη",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index7.html"
  },
  {
    "label": "41. Η παιδεία στο Βυζάντιο",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index7.html"
  },
  {
    "label": "42. Η γλώσσα των Βυζαντινών",
    "url": "https://ebooks.edu.gr/ebooks/v/html/8547/2178/Istoria_E-Dimotikou_html-empl/index7.html"
  }
];
if(typeof window!=="undefined")window.AITOOLSKIDS_HISTORY_E_CHAPTERS=chapters;
if(typeof module!=="undefined"&&module.exports)module.exports=chapters;
})();
