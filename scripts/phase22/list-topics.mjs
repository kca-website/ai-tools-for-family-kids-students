import { createRequire } from "node:module"; const require = createRequire(import.meta.url);
const inv = require("/home/user/ai-tools-for-family-kids-students/gel-schoolbook-source-map-2026-2027.js");
const ov = require("/home/user/ai-tools-for-family-kids-students/gel-schoolbook-manual-overrides-2026-2027.js");
const sid = process.argv[2];
const s = inv.get(sid);
console.log(sid, "status", s.status, s.books.map(b=>b.role[0]+":"+b.work+(b.html?"H":"P")).join(" "));
s.topicMappings.forEach((t,i)=>{ const o=ov.get(sid,t.label); const st = t.status==="exact-html"&&t.confidence==="high"?"AUTO":(o?"MANUAL":(t.status==="exact-pdf"?"PDF":"--")); console.log(String(i+1).padStart(2), st.padEnd(6), t.label); });
