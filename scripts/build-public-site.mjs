// Build an explicit static-only output without removing server dependencies from the source tree.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'scripts','public-site-manifest.json'),'utf8'));
const dest=path.join(root,'dist-public');
const entries=manifest.publicFiles;
const approved=new Set(entries);
if(approved.size!==entries.length)throw Error('Duplicate public asset');
const forbidden=new Set(manifest.serverOnlyRootFiles);
for(const p of entries){
  if(!p||path.isAbsolute(p)||p.split('/').some(x=>!x||x==='..'||x.startsWith('.'))||forbidden.has(p)||/^(api|scripts|tests|qa|benchmark|docs|reports|node_modules)\//.test(p)||/^(?:vercel|package(?:-lock)?)\.json$/.test(p))throw Error('Unsafe public path '+p);
  const st=fs.lstatSync(path.join(root,p));
  if(!st.isFile()||st.isSymbolicLink())throw Error('Public asset is not a regular file '+p);
}
for(const p of ['index.html','404.html','robots.txt','sitemap-index.xml','manifest.webmanifest','service-worker.js','assets/preschool-motion/u2netp.onnx','assets/preschool-motion/ort-wasm-simd-threaded.wasm','en/special-education.html'])if(!approved.has(p))throw Error('Required public asset missing '+p);
// Explicit browser script/style sources must survive packaging. No silent loss of linked assets.
for(const p of entries.filter(x=>x.endsWith('.html'))){
  const html=fs.readFileSync(path.join(root,p),'utf8');
  for(const match of html.matchAll(/<(?:script|link)\b[^>]*?\b(?:src|href)\s*=\s*["'](\/(?!\/)[^"']+\.(?:js|mjs|css)(?:[?#][^"']*)?)["']/gi)){
    const target=match[1].slice(1).split(/[?#]/)[0];
    if(!approved.has(target)&&!target.startsWith('_vercel/'))throw Error(p+' references missing static asset '+target);
  }
}
if(!process.argv.includes('--check')){
  fs.rmSync(dest,{recursive:true,force:true});
  fs.mkdirSync(dest,{recursive:true});
  for(const p of entries){const out=path.join(dest,p);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(path.join(root,p),out);}
}
console.log('Public asset manifest: '+entries.length+' explicit files; '+forbidden.size+' server-only root files excluded.');
