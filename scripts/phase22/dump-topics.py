# usage: python3 dump-topics.py quizId  — prints the [el,en] topic pairs of a subject block in gel-2026-2027-update.js as JSON
import sys,json
s=open("gel-2026-2027-update.js",encoding="utf8").read()
q=s.index('"quizId": "%s"'%sys.argv[1]); t=s.rindex('"topics": [',0,q); e=s.index('\n      ],\n      "source"',t)
print(json.dumps(json.loads(s[t+len('"topics": '):e+len('\n      ]')]),ensure_ascii=False,indent=1))
