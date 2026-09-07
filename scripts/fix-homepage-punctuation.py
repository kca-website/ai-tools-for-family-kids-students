from pathlib import Path

replacements = {
    'app.js': [
        ('ποιο είναι το επόμενο σωστό βήμα — με ή χωρίς AI.', 'ποιο είναι το επόμενο σωστό βήμα, με ή χωρίς AI.'),
        ('Δείξε μου πώς να το μάθω — όχι τη λύση', 'Δείξε μου πώς να το μάθω, όχι τη λύση'),
        ('what the next right step is — with or without AI.', 'what the next right step is, with or without AI.'),
        ('Show me how to learn it — not the answer', 'Show me how to learn it, not the answer'),
    ],
    'index.html': [
        ('ποιο είναι το επόμενο σωστό βήμα — με ή χωρίς AI.', 'ποιο είναι το επόμενο σωστό βήμα, με ή χωρίς AI.'),
        ('Βρες τι χρειάζεται εξάσκηση και το επόμενο σωστό βήμα — με ή χωρίς AI.', 'Βρες τι χρειάζεται εξάσκηση και το επόμενο σωστό βήμα, με ή χωρίς AI.'),
        ('Δείξε μου πώς να το μάθω — όχι τη λύση', 'Δείξε μου πώς να το μάθω, όχι τη λύση'),
    ],
}

for filename, pairs in replacements.items():
    path = Path(filename)
    text = path.read_text(encoding='utf-8')
    changed = False
    for old, new in pairs:
        if old in text:
            text = text.replace(old, new)
            changed = True
    if not changed:
        raise SystemExit(f'No expected punctuation found in {filename}')
    path.write_text(text, encoding='utf-8')

print('Homepage em-dash punctuation removed from source copy.')
