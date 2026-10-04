# AI Study live grounding audit — 2026-10-04

Production endpoint: `/api/study-grounding-audit`

Policy:
- Middle school and high school: official source required; unresolved selections fail closed.
- Primary: exact official source is preferred; structure-only selections may use double-checked AI fallback.

## Summary

- Middle school: 445 total selections.
  - 95 exact catalog-mapped.
  - 350 structure-only selections live-tested.
  - 312/350 runtime-grounded.
  - 38/350 unresolved.
  - Overall safely identified: **407/445 (91.5%)**.
- High school entries currently present in this catalog: 17 total selections.
  - 15 runtime-grounded.
  - 2 unresolved.
  - Overall safely identified: **15/17 (88.2%)**.

## Middle-school unresolved selections — 38

### Mathematics C Gymnasium — 7/7 unresolved
- Α΄ Μέρος · Κεφάλαιο 1 — Αλγεβρικές παραστάσεις
- Α΄ Μέρος · Κεφάλαιο 2 — Εξισώσεις - Ανισώσεις
- Α΄ Μέρος · Κεφάλαιο 3 — Συστήματα γραμμικών εξισώσεων
- Α΄ Μέρος · Κεφάλαιο 4 — Συναρτήσεις
- Α΄ Μέρος · Κεφάλαιο 5 — Πιθανότητες
- Β΄ Μέρος · Κεφάλαιο 1 — Γεωμετρία
- Β΄ Μέρος · Κεφάλαιο 2 — Τριγωνομετρία

### Modern Greek A Gymnasium — 10/10 unresolved
- 1η ενότητα — Πρώτες μέρες σ' ένα νέο σχολείο
- 2η ενότητα — Επικοινωνία στο σχολείο
- 3η ενότητα — Ταξίδι στον κόσμο της φύσης
- 4η ενότητα — Φροντίζω για τη διατροφή και την υγεία μου
- 5η ενότητα — Γνωρίζω το μαγικό κόσμο του θεάτρου και του κινηματογράφου
- 6η ενότητα — Οι δημιουργικές δραστηριότητες στη ζωή μου
- 7η ενότητα — Ο κόσμος μέσα από την οθόνη-εικόνα
- 8η ενότητα — Αθλητισμός και Ολυμπιακοί Αγώνες: Παρακολουθώ και συμμετέχω
- 9η ενότητα — Ανακαλύπτω τη μαγεία της γνώσης
- 10η ενότητα — Γνωρίζω τον τόπο μου και τον πολιτισμό του

### Literature B Gymnasium — 6/68 unresolved
- Νίκος-Αλέξης Ασλάνογλου — «Αθήνα»
- Γιώργος Ιωάννου — «Να 'σαι καλά, δάσκαλε!»
- Κλέφτικο — «Του Βασίλη»
- Νίκος Κάσδαγλης — «Τόκιο»
- Γιάννης Μαγκλής — «Γιατί;»
- Μιχάλης Γκανάς — «Στα καμένα»

### History C Gymnasium — 14/14 unresolved
- Κεφάλαιο 1 — Οι απαρχές του κόσμου
- Κεφάλαιο 2 — Η Ελληνική Επανάσταση του 1821 στο πλαίσιο της ανάδυσης των εθνικών ιδεών και του φιλελευθερισμού στην Ευρώπη
- Κεφάλαιο 3 — Οικονομικές, κοινωνικές και πολιτικές εξελίξεις στην Ευρώπη και στον κόσμο τον 19ο αιώνα
- Κεφάλαιο 4 — Το ελληνικό κράτος από την ίδρυσή του έως τις αρχές του 20ού αιώνα
- Κεφάλαιο 5 — Επιστήμες, πνευματική και καλλιτεχνική δημιουργία κατά τον 19ο αιώνα
- Κεφάλαιο 6 — Η Ελλάδα από το κίνημα στο Γουδί (1909) έως το τέλος των Βαλκανικών Πολέμων (1913)
- Κεφάλαιο 7 — Ο Α΄ Παγκόσμιος Πόλεμος και η Ρωσική Επανάσταση (1914-1918)
- Κεφάλαιο 8 — Ο Μικρασιατικός Πόλεμος (1919-1922)
- Κεφάλαιο 9 — Η εποχή του Μεσοπολέμου (1919-1939)
- Κεφάλαιο 10 — Ο Β΄ Παγκόσμιος Πόλεμος και η Ελλάδα
- Κεφάλαιο 11 — Διεθνείς εξελίξεις από το τέλος του Β΄ Παγκοσμίου Πολέμου έως τα τέλη του 20ού αιώνα
- Κεφάλαιο 12 — Η Ελλάδα από το τέλος του Β΄ Παγκοσμίου Πολέμου έως τα τέλη του 20ού αιώνα
- Κεφάλαιο 13 — Οι προσπάθειες ενοποίησης της Ευρώπης και η Ελλάδα
- Κεφάλαιο 14 — Επιστήμες, πνευματική και καλλιτεχνική δημιουργία κατά τον 20ό αιώνα

### English A Gymnasium — 1/9 unresolved
- Unit 9 — Happy Summer Holidays!

## High-school unresolved selections — 2

### Greek Language C Lyceum — 2/5 unresolved
- Παράρτημα 1 — Διαβάζω και γράφω
- Παράρτημα 2 — Ερευνητική εργασία

## Fully runtime-grounded structure-only subjects checked

- Physics C Gymnasium — 11/11
- Modern Greek B Gymnasium — 9/9
- Modern Greek C Gymnasium — 8/8
- Geology-Geography B Gymnasium — 46/46
- Chemistry C Gymnasium — 15/15
- History B Gymnasium — 50/50
- English B Gymnasium — 18/18
- English C Gymnasium — 10/10
- Odyssey A Gymnasium — 28/28
- Ancient Greek A Gymnasium — 5/5
- Ancient Greek B Gymnasium — 12/12
- Ancient Greek C Gymnasium — 4/4
- Religious Education B Gymnasium — 16/16
- Iliad B Gymnasium — 10/10
- Biology A Lyceum — 12/12

## Exact catalog-mapped middle-school selections

95 selections are already exact-mapped in the catalog and therefore do not depend on heuristic runtime matching. They are in Mathematics B Gymnasium, Biology B Gymnasium, Physics (shared Gymnasium catalog) and Chemistry B Gymnasium.
