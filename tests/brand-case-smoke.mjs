import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const forbidden="AI"+"TOOLS4KIDS";
const allowedExt=new Set([".html",".js",".mjs",".md",".json",".css",".txt",".webmanifest",".xml"]);
const skipDirs=new Set([".git","node_modules",".vercel"]);
const offenders=[];

function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(skipDirs.has(entry.name)) continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()){walk(full);continue;}
    const ext=path.extname(entry.name);
    if(!allowedExt.has(ext) && !entry.name.endsWith(".webmanifest")) continue;
    const content=fs.readFileSync(full,"utf8");
    content.split(/\r?\n/).forEach((line,index)=>{
      if(line.includes(forbidden)){
        offenders.push(path.relative(root,full)+":"+(index+1)+": "+line.trim().slice(0,240));
      }
    });
  }
}
walk(root);
if(offenders.length){
  console.error("Uppercase visible brand literal found. Use aitools4kids instead:\n"+offenders.join("\n"));
  process.exit(1);
}
console.log("Brand case smoke passed: visible brand casing is aitools4kids.");
