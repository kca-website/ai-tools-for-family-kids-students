import fs from 'node:fs';

const path='api/schoolbook-source.js';
let s=fs.readFileSync(path,'utf8');

const oldBlock=`  const reviewPath = subject === "mathimatika-b-gymnasiou" ? mathBReviewPath(topic) : "";
  const characterChapter = CHARACTER_CHAPTERS.find(c=>c.subject.replace('history-','istoria-')===subject&&normalize(c.labelEl)===normalize(topic));
  const book =
    (characterChapter ? {title:'Ιστορία '+(characterChapter.grade==='d'?'Δ΄':'ΣΤ΄')+' Δημοτικού',mode:'linkedSection',officialSourceRequired:true,annualScopeVerified:false} : null) ||
    (reviewPath ? { ...BOOKS[subject], title: "Μαθηματικά Α΄ Γυμνασίου — επανάληψη για Β΄ (μη εξεταστέο)", base: MATH_B_REVIEW_BASE } : null) ||
    BOOKS[subject] ||
    buildCatalogBook(subject) ||
    buildGelInventoryBook(gelInventory);`;

const newBlock=`  const reviewPath = subject === "mathimatika-b-gymnasiou" ? mathBReviewPath(topic) : "";
  const characterChapter = CHARACTER_CHAPTERS.find(c=>c.subject.replace('history-','istoria-')===subject&&normalize(c.labelEl)===normalize(topic));
  const catalogBook = buildCatalogBook(subject);
  // Prefer an exact catalog allowlist for the selected topic over older diagnostic
  // modes. This lets broad Study chapter selections use their verified official
  // page set without weakening the diagnostic resolver for other topic labels.
  const catalogHasExactTopic = !!(catalogBook?.sectionSources && resolveExplicitSectionUrls(catalogBook, topic).length);
  const glossaAUnitBook = subject === "glossa-a-gymnasiou" && unitNumber(topic)
    ? { ...BOOKS[subject], mode: "modernGreekA", multi: true, mappingStatus: "official-book-unit-grounded" }
    : null;
  const book =
    (characterChapter ? {title:'Ιστορία '+(characterChapter.grade==='d'?'Δ΄':'ΣΤ΄')+' Δημοτικού',mode:'linkedSection',officialSourceRequired:true,annualScopeVerified:false} : null) ||
    (reviewPath ? { ...BOOKS[subject], title: "Μαθηματικά Α΄ Γυμνασίου — επανάληψη για Β΄ (μη εξεταστέο)", base: MATH_B_REVIEW_BASE } : null) ||
    (catalogHasExactTopic ? catalogBook : null) ||
    glossaAUnitBook ||
    BOOKS[subject] ||
    catalogBook ||
    buildGelInventoryBook(gelInventory);`;

if(!s.includes(oldBlock)) throw new Error('book selection block not found');
s=s.replace(oldBlock,newBlock);
fs.writeFileSync(path,s);
console.log('Patched Study resolver: exact catalog mappings now override legacy diagnostic modes; A Gym Greek unit selections use whole-unit discovery.');
