from pathlib import Path
p = Path('index.html')
text = p.read_text(encoding='utf-8')
old = '<div class="hero__learning-loop" aria-labelledby="heroFlowLabel">'
new = '<div class="hero__learning-loop" role="group" aria-labelledby="heroFlowLabel">'
if text.count(old) != 1:
    raise SystemExit(f'expected one learning-loop wrapper, found {text.count(old)}')
p.write_text(text.replace(old, new, 1), encoding='utf-8')
print('homepage learning-loop accessibility role added')
