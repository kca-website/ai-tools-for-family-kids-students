import assert from 'node:assert/strict';
import {runAudit} from '../scripts/phase27-gel-uat.mjs';
// ONE official sample with a full GET -> official tutor POST -> audio POST.
// Never mistake an AI-summarized fallback for a verified whole-section audio lesson.
const base=process.env.GEL_LIVE_BASE||'https://www.aitools4kids.gr';
const report=await runAudit({base,subject:'biologia-b-lykeiou',limit:1,live:true,study:true,audio:true});
const row=report.rows.find(r=>r.subjectId==='biologia-b-lykeiou'&&r.checkedAt);
assert.ok(row,'Live sample must be checked');
console.log('PHASE39_GEL_LIVE_AUDIO_CANARY',JSON.stringify({
 subject:row.subjectId,topic:row.topic,
 mapping:row.mapping.state,retrieval:row.retrieval,
 study:row.study,audio:row.audio,checkedAt:row.checkedAt
}));
assert.equal(row.retrieval.state,'passed','official source retrieval failed');
assert.equal(row.study.state,'passed','source-grounded live tutor output failed');
assert.equal(row.audio.state,'passed','real complete-section audio verification failed (may be provider fallback or outage)');
