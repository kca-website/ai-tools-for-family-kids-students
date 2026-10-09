const assert = require('node:assert/strict');
const fs = require('node:fs');
const handler = require('../api/schoolbook-source');
const { extractPhysicsGPage, VERSION } = require('../physics-g-schoolbook');
const { scopePhysicsGAnnualTopic } = handler._test;
const catalog = require('../general-education-book-sections-2026-2027');
const BASE = 'https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/';
const realFormula = Buffer.from(fs.readFileSync(__dirname + '/fixtures/physics-g-ohm-image.txt', 'utf8').trim(), 'base64');
const prose = 'Η αντίσταση του αγωγού παραμένει σταθερή όταν διατηρείται σταθερή η θερμοκρασία. ';
const html = `<div id="eclass_ebook_body"><p class="title">2.3 Ηλεκτρικά δίπολα</p><p>${prose.repeat(650)}</p>
<p>Νόμος του Ωμ</p><p><img src="images/img2_39.jpg" alt="εικόνα" width="310" height="50"></p>
<p>ισχύει ο νόμος του Ωμ για κάθε ηλεκτρικό δίπολο;</p><p>ΕΚΤΟΣ μικρόκοσμος</p>
<p class="title">2.4 Παράγοντες από τους οποίους εξαρτάται η αντίσταση</p><p>ΕΚΤΟΣ υλικό αγωγού</p>
<p class="title">2.5 Εφαρμογές αρχών διατήρησης στη μελέτη απλών</p><p>ΕΚΤΟΣ λαμπτήρες</p>
<p>Σύνδεση αντιστατών</p><p>Σύνδεση δύο αντιστατών σε σειρά</p><p>Παράλληλη σύνδεση αντιστατών</p><p>ΤΕΛΟΣ επιλεγμένης θεωρίας.</p>
<p>Ερωτήσεις</p><p>ΕΚΤΟΣ γενικές ερωτήσεις κεφαλαίου</p></div>`;
global.fetch = async url => new Response(String(url).endsWith('.html') ? html : realFormula, {status:200});

(async () => {
  const texts = [];
  for (const purpose of ['', 'audio']) {
    let status, body;
    await handler({method:'GET',query:{subject:'fysiki-g-gymnasiou',topic:'Αντίσταση, νόμος του Ohm και συνδεσμολογία',purpose}}, {
      setHeader(){},status(value){status=value;return this},json(value){body=value}
    });
    assert.equal(status, 200, JSON.stringify(body));
    assert.equal(body.sourceCompleteness.parserVersion, VERSION);
    assert.equal(body.sourceCompleteness.sourceChars, body.text.length);
    assert.equal(body.annualScopeVerified, true);
    assert.ok(body.text.length > 42000, 'large selected units must not be capped');
    assert.match(body.text, /V = I · R/);
    assert.match(body.text, /ΤΕΛΟΣ επιλεγμένης θεωρίας/);
    assert.doesNotMatch(body.text, /ΕΚΤΟΣ|Unverified official formula/);
    texts.push(body.text);
  }
  assert.equal(texts[0], texts[1], 'all study actions and audio use the same complete source');
  // A changed known image cannot receive yesterday's trusted transcription.
  await assert.rejects(extractPhysicsGPage('<div id="eclass_ebook_body"><img src="images/img2_34.jpg" alt="εικόνα"></div>', BASE+'index2.html'), /official_formula_changed/);
  const oscillations = scopePhysicsGAnnualTopic('4.1 Ταλαντώσεις\nΠαράδειγμα ταλάντωσης\nΠοιες είναι οι προϋποθέσεις ώστε ένα σώμα να κάνει ταλάντωση\nΕΚΤΟΣ\n4.2 Μεγέθη που χαρακτηρίζουν μια ταλάντωση\nΠερίοδος και συχνότητα\n4.3 Ενέργεια και ταλάντωση\nΕΚΤΟΣ', 'oscillations').text;
  assert.match(oscillations, /Παράδειγμα ταλάντωσης|Περίοδος και συχνότητα/);
  assert.doesNotMatch(oscillations, /4\.3|ΕΚΤΟΣ/);
  const waves = scopePhysicsGAnnualTopic('5.1 Μηχανικά κύματα\n5.3 Χαρακτηριστικά μεγέθη του κύματος\nΜήκος κύματος\nΠόσο γρήγορα διαδίδεται ένα κύμα;\nΕΚΤΟΣ απόδειξη. Η προηγούμενη σχέση παίρνει τη μορφή: υ=λ · f\nΗ σχέση αυτή ονομάζεται θεμελιώδης νόμος της κυματικής\nΗ ταχύτητα:\nΕΚΤΟΣ\n5.4 Ήχος\nΟ ήχος είναι κύμα\n5.5 Υποκειμενικά χαρακτηριστικά\nΧροιά\nΕρωτήσεις\nΕΚΤΟΣ', 'waves-sound').text;
  assert.match(waves, /υ=λ · f/);
  assert.match(waves, /Χροιά/);
  assert.doesNotMatch(waves, /ΕΚΤΟΣ|απόδειξη/);
  const labels = catalog.get('fysiki-g-gymnasiou').sections;
  assert.equal(labels.length, 8);
  assert.ok(labels.every(label => handler._test.physicsGAnnualTopicKey(label)), 'every selectable unit must apply the annual scope');
  console.log('PASS Physics G: complete source, verified image formula, changed-image rejection, annual exclusions, eight units, identical audio source.');
})().catch(error => { console.error(error); process.exitCode=1; });
