// Release regression orchestrator. Never calls a real AI provider intentionally.
// CI runs with no provider credentials. Live probes are a separate operation.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = fileURLToPath(new URL('../', import.meta.url));
const dir = path.join(root, 'qa', 'results', 'release-gate');
fs.mkdirSync(dir,{recursive:true});
const mode = process.argv[2];
if (!['offline','browser'].includes(mode)) throw new Error('Use offline or browser');
const rows=[];
const env={...process.env};
for(const k of Object.keys(env)) if(/(?:API_KEY|AI_TOKEN|LLM_ACCOUNT_ID|AI_PROVIDER_ORDER|BASE_URL)/i.test(k)) delete env[k];
const run=(id,args,{cwd=root,timeout=120000,json=null}={})=>{
  console.log('START '+id);
  const started=Date.now();
  const r=spawnSync(process.execPath,args,{cwd,env,encoding:'utf8',timeout,maxBuffer:64*1024*1024});
  const out=r.stdout||'',err=r.stderr||'';
  fs.writeFileSync(path.join(dir,id+'.log'),out+'\n'+err+(r.error?'\n'+r.error.message:''));
  if(json && out.trim()) fs.writeFileSync(path.join(dir,json),out);
  const ok=r.status===0&&!r.error;
  rows.push({id,status:ok?'PASS':'FAIL',exit:r.status,signal:r.signal,seconds:Math.round((Date.now()-started)/1000)});
  console.log((ok?'PASS ':'FAIL ')+id);
  if(!ok) {
    for (const line of out.split('\n').filter(l=>l.includes('SEO_DRIFT '))) console.log(line);
    console.error((out+'\n'+err).slice(-3000));
  }
};
if(mode==='offline'){
  const paths=spawnSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8'});
  if(paths.status!==0) throw new Error('Cannot inventory tracked source files');
  for(const f of paths.stdout.split('\0').filter(f=>/^(?:api\/[^/]+|[^/]+)\.(?:js|mjs|cjs)$/.test(f))){
    run('syntax-'+f.replaceAll('/','__'),['--check',f]);
  }
  run('schoolbook-mapping-integrity',['scripts/grounding-coverage-report.mjs','--strict'],{json:'grounding-audit.json'});
  run('g-gym-science-schoolbook-grounding',['tests/g-gym-science-schoolbook-grounding.mjs']);
  const staticTests=[
    'quality-upgrade-smoke.mjs','brand-case-smoke.mjs',
    'repository-data-integrity-smoke.mjs',
    'ai-study-source-policy-smoke.mjs',
    'ai-answer-check.test.cjs','verified-explanation-smoke.mjs',
    'ai-provider-router-smoke.mjs','gemini-fallback.mjs',
    'whole-section-audio-regression.cjs','audio-provider-fallback.cjs',
    'special-education-data-smoke.mjs','eneegyl-study-grounding-smoke.mjs',
    'phase11d-epal-grounding-audit.mjs',
    'phase40-teacher-source-server.mjs','phase41-teacher-online-search-server.mjs',
    'teacher-material-lab-smoke.mjs','preschool-curriculum-smoke.mjs',
    'higher-education-data-smoke.mjs','university-source-contract.cjs',
    'misconception-evidence-integrity.mjs','study-cache-safety-smoke.mjs'
  ];
  for(const f of staticTests) run(f,['tests/'+f]);
  const qaTests=fs.readdirSync(path.join(root,'qa','tests')).filter(f=>f.endsWith('.mjs'));
  for(const f of qaTests) run('qa-'+f,['--test','tests/'+f],{cwd:path.join(root,'qa'),timeout:180000});
}else{
  const cwd=path.join(root,'qa');
  fs.rmSync(path.join(cwd,'results','playwright-report.json'),{force:true});
  run('playwright-full',['node_modules/@playwright/test/cli.js','test','--project=chromium-desktop','--project=chromium-mobile375','--retries=0'],{cwd,timeout:900000});
  // Playwright may return zero for an expected failure. That is not proof of readiness.
  const reportPath=path.join(cwd,'results','playwright-report.json');
  try{
    const report=JSON.parse(fs.readFileSync(reportPath,'utf8'));
    let expectedFailures=0,skipped=0,executed=0,knownOutOfScope=0,unexpected=0;
    const diagnostics=[];
    const clean=s=>String(s||'').replace(/\x1b\[[0-9;]*m/g,'').slice(0,2000);
    function walk(suites){
      for(const s of suites||[]){
        for(const spec of s.specs||[])for(const t of spec.tests||[]){
          const title=spec.title||'', file=spec.file||s.file||'', project=t.projectName||'';
          if(t.expectedStatus==='failed') expectedFailures++;
          if(t.expectedStatus==='skipped'||t.status==='skipped'||!t.results?.length) {
            // Only the explicit real-deployment-only suite and desktop-only exclusion
            // of a mobile touch-target test are out of scope here. All other skips fail.
            const known=(file.endsWith('04-privacy.spec.mjs') && /^GET \/.* is not served$/.test(title))
              || (file.endsWith('05-a11y.spec.mjs') && project==='chromium-desktop' && title.startsWith('touch targets on mobile'));
            if(known) knownOutOfScope++;
            else {skipped++; diagnostics.push({file,title,project,status:'unexpected-skip',annotations:t.annotations});}
          } else {
            executed++;
            if(t.status==='unexpected'||t.status==='flaky'||t.results.some(r=>r.status==='failed'||r.status==='timedOut'||r.status==='interrupted')){
              unexpected++;
              diagnostics.push({file,title,project,status:t.status,errors:t.results.flatMap(r=>(r.errors||[]).map(e=>clean(e.message||e.stack)))});
            }
          }
        }
        walk(s.suites);
      }
    }
    walk(report.suites);
    const counts={executed,expectedFailures,skipped,knownOutOfScope,unexpected,stats:report.stats};
    fs.writeFileSync(path.join(dir,'browser-diagnostics.json'),JSON.stringify({counts,diagnostics},null,2));
    console.log('BROWSER_COUNTS '+JSON.stringify(counts));
    for(const d of diagnostics) console.log('BROWSER_DIAGNOSTIC '+JSON.stringify(d));
    rows.push({id:'playwright-completeness',status:executed>0&&expectedFailures===0&&skipped===0&&unexpected===0?'PASS':'FAIL',...counts});
  }catch(e){rows.push({id:'playwright-completeness',status:'FAIL',error:String(e.message)});}
  // Modern standalone tests use the same local server started by CI.
  for(const f of ['curriculum-resolver-smoke.mjs','ai-help-trust-boundary-smoke.mjs','phase39-gel-own-text-guard.mjs','phase40-teacher-real-source-ui.mjs','phase41-teacher-online-search-ui.mjs','navigation-v11-smoke.mjs','mobile-home-pwa-smoke.mjs','curriculum-cross-surface-parity-smoke.mjs']){
    run(f,['tests/'+f],{timeout:240000});
  }
}
const summary={mode,generatedAt:new Date().toISOString(),pass:rows.filter(r=>r.status==='PASS').length,fail:rows.filter(r=>r.status==='FAIL').length,rows};
fs.writeFileSync(path.join(dir,mode+'-summary.json'),JSON.stringify(summary,null,2));
console.log(JSON.stringify({mode,pass:summary.pass,fail:summary.fail}));
process.exitCode=summary.fail?1:0;
