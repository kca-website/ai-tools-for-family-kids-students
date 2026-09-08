from pathlib import Path

files = {
    'app.js': [
        (
            'heroSubtitle: "Όταν ένα παιδί δεν έχει καταλάβει κάτι, ξεκίνα εδώ: δες τι χρειάζεται εξάσκηση και ποιο είναι το επόμενο σωστό βήμα, με ή χωρίς AI. Για μαθητές 6 έως 18, γονείς και εκπαιδευτικούς.",',
            'heroSubtitle: "Δες σε 2 λεπτά πού χρειάζεται λίγη παραπάνω εξάσκηση ο μαθητής ή ο γονιός και ποιο δωρεάν AI εργαλείο ταιριάζει ακριβώς εκεί. Για γονείς, μαθητές 6 έως 18 αλλά και εκπαιδευτικούς.",'
        ),
        (
            'heroSubtitle: "When a child has not understood something, start here: see what needs practice and what the next right step is, with or without AI. For students aged 6–18, parents and educators.",',
            'heroSubtitle: "See in 2 minutes where the student or the parent could use a bit more practice, and which free AI tool fits exactly there. For parents, students 6 to 18, and educators.",'
        ),
    ],
    'index.html': [
        (
            '          Όταν ένα παιδί δεν έχει καταλάβει κάτι, ξεκίνα εδώ: δες τι χρειάζεται εξάσκηση\n          και ποιο είναι το επόμενο σωστό βήμα, με ή χωρίς AI. Για μαθητές 6 έως 18,\n          γονείς και εκπαιδευτικούς.',
            '          Δες σε 2 λεπτά πού χρειάζεται λίγη παραπάνω εξάσκηση ο μαθητής ή ο γονιός\n          και ποιο δωρεάν AI εργαλείο ταιριάζει ακριβώς εκεί. Για γονείς, μαθητές 6 έως 18\n          αλλά και εκπαιδευτικούς.'
        ),
    ],
}

for filename, replacements in files.items():
    path = Path(filename)
    text = path.read_text(encoding='utf-8')
    for old, new in replacements:
        if old not in text:
            raise SystemExit(f'Expected current hero copy not found in {filename}')
        text = text.replace(old, new, 1)
    path.write_text(text, encoding='utf-8')

print('Restored the pre-positioning homepage hero subtitle in EL/EN source copy.')
