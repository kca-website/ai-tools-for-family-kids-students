const assert=require('node:assert/strict');
const handler=require('../api/schoolbook-source.js');
const chapter13='<h2>13. Ο Ιουστινιανός μεταρρυθμίζει<br>τη διοίκηση και τη νομοθεσία</h2><p>'+('Κωδικοποίησε τους νόμους και οργάνωσε τη διοίκηση. '.repeat(25))+'</p>';
const chapter14='<h2>14. Οι Δήμοι αναστατώνουν την πρωτεύουσα με τη «στάση του νίκα»</h2><p>'+('Οι δήμοι εξεγέρθηκαν. '.repeat(40))+'</p>';
global.fetch=async()=>new Response(chapter13+chapter14);
(async()=>{
  for(const subject of ['history-e-dimotikou','istoria-e-dimotikou']){
    const result=await handler.resolveOfficialSchoolbookSource(subject,'Ο Ιουστινιανός μεταρρυθμίζει τη διοίκηση και τη νομοθεσία');
    assert.equal(result.status,200);
    assert.equal(result.body.grounded,true);
    assert.match(result.body.text,/Κωδικοποίησε/);
    assert.doesNotMatch(result.body.text,/εξεγέρθηκαν/);
  }
  const missing=await handler.resolveOfficialSchoolbookSource('history-e-dimotikou','Ανύπαρκτο κεφάλαιο');
  assert.equal(missing.body.grounded,false);
  console.log('History E aliases resolve exact chapters and exclude neighbouring chapter text');
})().catch(error=>{console.error(error);process.exitCode=1});
