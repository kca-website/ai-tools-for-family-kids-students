import fs from 'node:fs';
const path='api/schoolbook-source.js';
let s=fs.readFileSync(path,'utf8');
function mustReplace(from,to,label){ if(!s.includes(from)) throw new Error('Missing '+label); s=s.replace(from,to); }

mustReplace(
`  if (subject === "logotechnia-b-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveLiteratureBCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }`,
`  if (subject === "logotechnia-b-gymnasiou") {
    const base = BOOKS[subject].base;
    // A few anthology entries either have very short titles (which the generic
    // matcher intentionally ignores) or use case-sensitive legacy filenames.
    // Keep these six verified selections explicit and fail closed for anything else.
    const exact = [
      ["νικος αλεξης ασλανογλου", "αθηνα", "indexa_3.html"],
      ["γιωργος ιωαννου", "να σαι καλα δασκαλε", "indexB_3.html"],
      ["κλεφτικο", "του βασιλη", "indexE_2.html"],
      ["νικος κασδαγλης", "τοκιο", "indexg_4.html"],
      ["γιαννης μαγκλης", "γιατι", "indexj_2.html"],
      ["μιχαλης γκανας", "στα καμενα", "indexL_8.html"]
    ];
    for (const [author,title,path] of exact) {
      if (t.includes(author) && t.includes(title)) return [new URL(path, base).toString()];
    }
    return resolveLiteratureBCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }`,
'literature exact fallbacks');

mustReplace(
`  if (subject === "english-b-gymnasiou") {
    return resolveEnglishBCurriculumUrls(topic);
  }`,
`  if (subject === "english-a-gymnasiou") {
    const unitMatch = String(topic || "").match(/^\\s*Unit\\s+(\\d+)\\b/i);
    const unit = unitMatch ? Number(unitMatch[1]) : 0;
    if (unit === 9) {
      return ["https://www.ebooks.edu.gr/ebooks/v/html/8547/2322/Agglika_A-Gymnasiou-Proch_html-empl/index9_1.html"];
    }
  }

  if (subject === "english-b-gymnasiou") {
    return resolveEnglishBCurriculumUrls(topic);
  }`,
'English A unit 9');

mustReplace(
`  if (subject === "ekthesi-g-lykeiou") {
    const base = "https://ebooks.edu.gr/ebooks/v/html/8547/2678/Ekfrasi-Ekthesi_G-Lykeiou_html-empl/";
    const chapterMatch = String(topic || "").match(/^\\s*Κεφάλαιο\\s+(\\d+)\\b/i);
    const chapter = chapterMatch ? Number(chapterMatch[1]) : 0;
    const paths = { 1: "indexa_01.html", 2: "indexc_00.html", 3: "indexf_00.html" };
    if (paths[chapter]) return [new URL(paths[chapter], base).toString()];
    return [];
  }`,
`  if (subject === "ekthesi-g-lykeiou") {
    const base = "https://ebooks.edu.gr/ebooks/v/html/8547/2678/Ekfrasi-Ekthesi_G-Lykeiou_html-empl/";
    const chapterMatch = String(topic || "").match(/^\\s*Κεφάλαιο\\s+(\\d+)\\b/i);
    const chapter = chapterMatch ? Number(chapterMatch[1]) : 0;
    const paths = { 1: "indexa_01.html", 2: "indexc_00.html", 3: "indexf_00.html" };
    if (paths[chapter]) return [new URL(paths[chapter], base).toString()];
    if (/^\\s*Παράρτημα\\s+1\\b/i.test(String(topic || ""))) return [new URL("indexg_00.html", base).toString()];
    if (/^\\s*Παράρτημα\\s+2\\b/i.test(String(topic || ""))) return [new URL("indexi_00.html", base).toString()];
    return [];
  }`,
'G Lyceum essay appendices');

fs.writeFileSync(path,s);
console.log('Patched remaining Study grounding exceptions.');
