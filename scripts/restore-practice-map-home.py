from pathlib import Path
import subprocess

BASE = "0527e644841a30218756191d9986aa9c4ebc6818"


def old_file(path: str) -> str:
    return subprocess.check_output(["git", "show", f"{BASE}:{path}"], text=True)

# Restore the app strings and homepage CSS exactly as they were before the
# tools-first rearrangement. Those files were changed only by that homepage PR.
Path("app.js").write_text(old_file("app.js"), encoding="utf-8")
Path("styles.css").write_text(old_file("styles.css"), encoding="utf-8")
Path("tests/home-positioning-smoke.mjs").write_text(old_file("tests/home-positioning-smoke.mjs"), encoding="utf-8")

# In index.html restore only the visible homepage section. Keep the newer SEO
# title/meta/schema/noscript wording that does not alter what the visitor sees.
path = Path("index.html")
current = path.read_text(encoding="utf-8")
old = old_file("index.html")
start_marker = '    <section id="zoneSelectView">'
end_marker = '    <!-- ΒΗΜΑ 2: Ζώνη επιλεγμένη -> επιλογή ρόλου + λίστα εργαλείων -->'

for text, label in ((current, "current"), (old, "old")):
    if start_marker not in text or end_marker not in text:
        raise SystemExit(f"missing homepage markers in {label} index.html")

c_start = current.index(start_marker)
c_end = current.index(end_marker, c_start)
o_start = old.index(start_marker)
o_end = old.index(end_marker, o_start)
restored = current[:c_start] + old[o_start:o_end] + current[c_end:]
path.write_text(restored, encoding="utf-8")

print("Restored original visible homepage Practice Map layout and wording while keeping newer SEO metadata.")
