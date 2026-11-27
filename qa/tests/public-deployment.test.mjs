import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../../',import.meta.url));
test('public deployment is manifest-limited and server-only files are excluded',()=>{
  const v=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
  assert.equal(v.outputDirectory,'dist-public');
  assert.equal(v.buildCommand,'node scripts/build-public-site.mjs');
  const m=JSON.parse(fs.readFileSync(path.join(root,'scripts/public-site-manifest.json'),'utf8'));
  for(const p of ['ai-provider-router.js','teacher-web-evidence.js','study-runtime-cache.js','package.json','vercel.json','api/tutor-assistant.js','qa/REPORT.md','scripts/build-public-site.mjs']){
    assert.ok(!m.publicFiles.includes(p),p);
  }
  const run=spawnSync(process.execPath,['scripts/build-public-site.mjs','--check'],{cwd:root,encoding:'utf8'});
  assert.equal(run.status,0,run.stdout+'\n'+run.stderr);
});
