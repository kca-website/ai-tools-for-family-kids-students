import assert from 'node:assert/strict';
const tutor = await import('../api/tutor-assistant.js');
const phase8 = tutor.default?._phase8Test || tutor._phase8Test || tutor.default || {};
const { groundingSignals } = phase8;
assert.equal(typeof groundingSignals, 'function', 'groundingSignals test hook must exist');

// Regression guard for AI Study structured activities: JSON structure itself must not
// create grounding failures. Only factual content not present in the source may fail.
const source = `3.2 Δύο δυνάμεις με την ίδια διεύθυνση. Η συνισταμένη δύο δυνάμεων με ίδια κατεύθυνση έχει μέτρο ίσο με το άθροισμα των μέτρων τους. F1 = 3 N και F2 = 5 N.`;
const groundedFlashcards = JSON.stringify({cards:[
  {q:'Τι ονομάζουμε συνισταμένη δύο δυνάμεων;',a:'Μία δύναμη που μπορεί να αντικαταστήσει τις δύο δυνάμεις.'},
  {q:'Πόσες δυνάμεις εξετάζονται στο παράδειγμα;',a:'Δύο δυνάμεις.'},
  {q:'Ποιο είναι το μέτρο της F1;',a:'3 N.'},
  {q:'Ποιο είναι το μέτρο της F2;',a:'5 N.'},
  {q:'Τι ισχύει όταν οι δυνάμεις έχουν ίδια κατεύθυνση;',a:'Τα μέτρα τους προστίθενται.'},
  {q:'Ποια έννοια βρίσκουμε από τις δύο δυνάμεις;',a:'Τη συνισταμένη.'},
  {q:'Η συνισταμένη αντικαθιστά μία ή δύο δυνάμεις;',a:'Δύο δυνάμεις.'},
  {q:'Σε τι αναφέρεται ο κανόνας του παραδείγματος;',a:'Σε δυνάμεις με ίδια κατεύθυνση.'}
]});
assert.deepEqual(groundingSignals(groundedFlashcards, source, 'Task: exactly 8 flashcards'), [], 'grounded structured flashcards must not be rejected');

const hallucinated = JSON.stringify({cards:[{q:'Ποιο είναι το μέτρο της F3;',a:'12 N.'}]});
assert.ok(groundingSignals(hallucinated, source, '').length > 0, 'unsupported factual numeric/formula content must still be rejected');

console.log('AI Study Physics grounding regression passed.');
