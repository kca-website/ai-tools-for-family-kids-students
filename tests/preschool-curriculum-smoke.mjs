import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PRESCHOOL_CURRICULUM, getAllPreschoolSubunits } = require("../preschool-curriculum-data.js");
const { resolvePreschoolCurriculum } = require("../preschool-curriculum-mapper.js");

const all = getAllPreschoolSubunits();

assert.equal(PRESCHOOL_CURRICULUM.fields.length, 4, "Expected 4 official thematic fields");
assert.equal(PRESCHOOL_CURRICULUM.fields.reduce((n, field) => n + field.units.length, 0), 9, "Expected 9 official thematic units");
assert.equal(all.length, 26, "Expected 26 official subunits");
assert.equal(new Set(all.map(item => item.id)).size, 26, "Subunit IDs must be unique");

for (const field of PRESCHOOL_CURRICULUM.fields) {
  assert.match(field.source, /^https:\/\/elearning\.iep\.edu\.gr\//, "Every field must point to an IEP source");
}

const byTitle = new Map(all.map(item => [item.title, item.id]));
const firstId = ({ idea, mode = "learn", focus = "auto" }) => {
  const result = resolvePreschoolCurriculum({ idea, mode, focus, limit: 3 });
  assert.ok(result.length > 0, `No mapping for: ${idea}`);
  return byTitle.get(result[0].subunit);
};

const canonical = [
  ["oral-communication", "παραμύθι για ένα αρκουδάκι"],
  ["written-communication", "φτιάχνουμε μια πινακίδα με γράμματα"],
  ["multilingual-communication", "χαιρετισμός σε άλλη γλώσσα"],
  ["ict-familiarisation", "γνωριμία με πληκτρολόγιο και ποντίκι"],
  ["programming-digital-play", "ρομπότ με σειρά εντολών"],
  ["information-digital-creation", "φτιάχνουμε ψηφιακή ιστορία"],
  ["sense-of-self", "τι μου αρέσει και τι μπορώ να κάνω"],
  ["emotional-awareness", "χαρά λύπη θυμός φόβος"],
  ["interpersonal-relationships", "φιλία και συνεργασία"],
  ["history-culture", "κάστρο και παλιά αντικείμενα"],
  ["natural-built-environment", "η γειτονιά και το πάρκο μας"],
  ["social-economic-life", "επαγγέλματα και κατάστημα"],
  ["geometry-measurement", "κύκλος τρίγωνο τετράγωνο και μήκος"],
  ["numbers-operations-algebra", "αριθμοί μέχρι το 5 και μέτρημα"],
  ["stochastic-mathematics", "ταξινόμηση δεδομένων σε πίνακα"],
  ["living-organisms", "φυτά ζώα και σπόροι"],
  ["matter-phenomena", "νερό πάγος και τι λιώνει"],
  ["earth-solar-space", "γη φεγγάρι πλανήτες και διάστημα"],
  ["tools-equipment-devices", "εργαλεία μηχανές και συσκευές"],
  ["construction-everyday-life", "χτίζω μια γέφυρα με τουβλάκια"],
  ["body-movement", "κίνηση ισορροπία και άλματα"],
  ["physically-active-life", "περπάτημα και παιχνίδι έξω"],
  ["sport-culture-creative-movement", "παραδοσιακός χορός και κινητικό παιχνίδι"],
  ["visual-arts", "ζωγραφική με χρώματα και κολάζ"],
  ["theatre", "κουκλοθέατρο και παιχνίδι ρόλων"],
  ["music", "μουσική ρυθμός και παλαμάκια"]
];

for (const [expected, idea] of canonical) {
  assert.equal(firstId({ idea }), expected, `Unexpected mapping for: ${idea}`);
}

// Cross-curricular / focus regressions.
assert.equal(firstId({ idea: "χρώματα", focus: "math" }), "stochastic-mathematics");
assert.equal(firstId({ idea: "μουσική και ρυθμός", mode: "offline", focus: "movement" }), "sport-culture-creative-movement");
assert.equal(firstId({ idea: "διάστημα", mode: "story", focus: "science" }), "earth-solar-space");
assert.equal(firstId({ idea: "σχήματα", focus: "language" }), "oral-communication");

const animalStory = resolvePreschoolCurriculum({ idea: "ζώα", mode: "story", focus: "auto", limit: 3 });
assert.ok(animalStory.some(item => item.subunit === "Ζωντανοί Οργανισμοί"));
assert.ok(animalStory.some(item => item.subunit === "Προφορική Επικοινωνία"));

const robot = resolvePreschoolCurriculum({ idea: "ρομπότ", mode: "learn", focus: "technology", limit: 3 });
assert.ok(robot.some(item => item.subunit === "Ανακάλυψη, Προγραμματισμός και Ψηφιακό Παιχνίδι"));
assert.ok(robot.some(item => item.unit === "Τεχνολογία Κατασκευών"));

console.log("preschool-curriculum-smoke: ok");
