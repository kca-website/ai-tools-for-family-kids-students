import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../curriculum-resolver.js', import.meta.url), 'utf8');
const context = {
  window: {
    AITOOLSKIDS_TUTOR_CATALOG: {
      getSubjects(zone, grade) {
        if (zone !== 'middle' || grade !== 'b') return [];
        return [{
          id: 'archaia-b-gymnasiou',
          grade: 'b',
          subjectLabelEl: "Αρχαία Ελληνική Γλώσσα και Γραμματεία, Β' Γυμνασίου",
          subjectLabelEn: 'Ancient Greek',
          topics: [{ id: 'support', labelEl: 'Κατανόηση κειμένου', specialSupportAction: true }],
          curriculum: {}
        }];
      }
    },
    AITOOLSKIDS_OFFICIAL_CURRICULUM: {
      byQuiz: {
        'archaia-glossa-b-gymnasiou': {
          zone: 'middle',
          quizTitleEl: "Αρχαία Ελληνική Γλώσσα, Β' Γυμνασίου",
          quizTitleEn: 'Ancient Greek Language, 8th Grade',
          officialSectionsEl: ['Ενότητα 1 — Έναρξη'],
          coverageStatus: 'official-book-verified'
        }
      },
      getByQuizId(id) { return this.byQuiz[id] || null; },
      gapAlignment: {}
    },
    AITOOLSKIDS_GENERAL_ED_BOOK_SECTIONS_2026_2027: {
      get(id) {
        return id === 'archaia-glossa-b-gymnasiou'
          ? { sections: ['Ενότητα 1 — Έναρξη'], sourceUrl: 'https://ebooks.edu.gr/' }
          : null;
      }
    }
  },
  QUIZZES: {
    middle: {
      'archaia-glossa-b-gymnasiou': {
        id: 'archaia-glossa-b-gymnasiou',
        grades: ['b'],
        subjectLabelEl: "Αρχαία Ελληνική Γλώσσα, Β' Γυμνασίου",
        subjectLabelEn: 'Ancient Greek Language, 8th Grade'
      }
    }
  },
  GAP_TAGS: {}
};
vm.createContext(context);
vm.runInContext(source, context);

const rows = context.window.AITOOLSKIDS_CURRICULUM_RESOLVER.getSubjects('middle', 'b');
const ancient = rows.filter(x => /Αρχαία Ελληνική Γλώσσα/.test(x.subjectLabelEl || ''));
assert.equal(ancient.length, 1);
assert.equal(ancient[0].id, 'archaia-glossa-b-gymnasiou');
assert.equal(ancient[0].quizId, 'archaia-glossa-b-gymnasiou');
console.log('Ancient Greek subject dedupe smoke passed.');
