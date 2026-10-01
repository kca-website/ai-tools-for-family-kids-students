# usage: python3 remove-override.py subjectId "label"  — removes one entry from the overrides file (used to redo a review)
import sys,json
p="gel-schoolbook-manual-overrides-2026-2027.js"
sid,label=sys.argv[1],sys.argv[2]
s=open(p,encoding="utf8").read()
key='"label": '+json.dumps(label,ensure_ascii=False)
i=s.index(key)
a=s.rindex("\n  {",0,i); b=s.index("\n  }",i)+4
assert sid in s[a:i], "subject mismatch"
tail=s[b:]
if tail.startswith(","): tail=tail[1:]; 
else: a=s.rindex(",",0,a)
open(p,"w",encoding="utf8").write(s[:a]+tail)
print("removed",sid,label)
