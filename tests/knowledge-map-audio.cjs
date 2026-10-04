const assert = require('node:assert/strict');
const { createKnowledgeMapLesson } = require('../whole-section-audio-knowledge');

const source = [
  'Τα φυτά αναπαράγονται με μονογονία ή αμφιγονία. Ένα παράδειγμα μονογονίας είναι ένα κλαδί γερανιού που φυτεύεται στο χώμα.',
  'Στα αγγειόσπερμα τα σπέρματα βρίσκονται μέσα σε καρπό. Η φωτογραφία δείχνει έναν κήπο με πολλά φυτά.'
].join('\n\n');

async function fakeGenerate(args) {
  const system = args.messages[0].content;
  const input = JSON.parse(args.messages.at(-1).content);
  if (system.includes('source-grounded knowledge map')) {
    const rows = input.sentences;
    return { ok:true, text:JSON.stringify({ ideas:[
      { id:'tmp1', idea:'Τα φυτά μπορούν να αναπαράγονται με μονογονία ή αμφιγονία.', type:'relationship', importance:'core', evidenceIds:[rows[0].id] },
      { id:'tmp2', idea:'Το κλαδί γερανιού είναι παράδειγμα μονογονίας.', type:'fact', importance:'supporting', evidenceIds:[rows[1].id] },
      { id:'tmp3', idea:'Στα αγγειόσπερμα τα σπέρματα βρίσκονται μέσα σε καρπό.', type:'definition', importance:'core', evidenceIds:[rows[2].id] }
    ]})};
  }
  if (system.includes('minimum sufficient set of ideas')) {
    return { ok:true, text:JSON.stringify({ coreIdeaIds:['k1','k3'] }) };
  }
  if (system.includes('Write a natural, concise spoken school lesson')) {
    return { ok:true, text:JSON.stringify({ sentences:[
      { text:'Τα φυτά μπορούν να αναπαράγονται με μονογονία ή αμφιγονία, ενώ στα αγγειόσπερμα τα σπέρματα βρίσκονται μέσα σε καρπό.', ideaIds:['k1','k3'] }
    ]})};
  }
  if (system.includes('Independently verify a synthesized spoken lesson')) {
    return { ok:true, text:JSON.stringify({ sentences:[{index:0,supported:true,concise:true,reason:''}], coreIdeas:[{id:'k1',covered:true},{id:'k3',covered:true}] }) };
  }
  throw new Error('unexpected test stage');
}

(async()=>{
  const result = await createKnowledgeMapLesson({ source, topic:'Αναπαραγωγή φυτών', generate:fakeGenerate });
  assert.equal(result.mode,'verified-knowledge-synthesis');
  assert.equal(result.verification.ideasExtracted,3);
  assert.equal(result.verification.coreIdeas,2);
  assert.match(result.text,/μονογονία ή αμφιγονία/);
  assert.match(result.text,/αγγειόσπερμα/);
  assert.doesNotMatch(result.text,/κλαδί γερανιού|φωτογραφία|κήπο/);
  assert.ok(result.verification.compressionRatio < 0.8);
  console.log('knowledge-map audio regression passed');
})().catch(err=>{ console.error(err); process.exit(1); });
