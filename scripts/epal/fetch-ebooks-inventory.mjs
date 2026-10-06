// Fetches the official ebooks.edu.gr (ΙΤΥΕ «Διόφαντος») PDF textbook inventory for
// Α΄/Β΄/Γ΄ ΕΠΑΛ (classcodes K10.T/K11.T/K12.T). Each manifestation lists the official
// courses (μαθήματα) it is assigned to, which is the subject→book evidence used by
// build-epal-schoolbook-catalog.mjs.
import fs from "node:fs";
import path from "node:path";
import { ROOT, EPAL_GRADE_CLASSCODES } from "./lib.mjs";

const OUT = path.join(ROOT, "scripts/epal/ebooks-epal-inventory.json");

function apiUrl(classcode) {
  const q = [
    "query_field[]=course.lom.classification-grade",
    "query_field[]=expression.lom.classification-digitalExpression",
    "query_field[]=manifestation.lom.lifecycle-status",
    "query_op[]=equals", "query_op[]=in_val", "query_op[]=equals",
    `query_val[]=${classcode}`, "query_val[]='4','17','18'", "query_val[]=1",
    "limit=-1", "offset=0", "expand=all%2Cmetadata", "filters=none", "selected_columns=m1.*",
    "selected_elements='title','technical-location','relation-hasThumbnail','identifier'",
    "selected_collections='course','work','expression','manifestation'"
  ].join("&");
  return "https://ebooks.edu.gr/ebooks/rest/get-items-info-2?" + q;
}

// Non-EPAL books that the official ΙΕΠ 2026–27 EPAL guidance explicitly assigns to an EPAL
// course (see GUIDANCE_EXTRA_BOOKS in subject-courses.mjs). Only these works are kept.
const EXTRA_SOURCES = [{ grade: "gym-c", classcode: "K09", works: ["OIKONOMIKA", "ΟΙΚΟΝΟΜΙΚΑ"] }];

const books = [];
for (const [grade, classcode] of [...Object.entries(EPAL_GRADE_CLASSCODES), ...EXTRA_SOURCES.map((x) => [x.grade, x.classcode])]) {
  const extra = EXTRA_SOURCES.find((x) => x.grade === grade);
  const res = await fetch(apiUrl(classcode), { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${classcode}: HTTP ${res.status}`);
  for (const item of await res.json()) {
    const md = Object.fromEntries((item.metadata || []).map((m) => [m.key, m.value]));
    if (extra && !extra.works.includes(md["work.dc.title"])) continue;
    const courses = [...new Set((item.Courses || []).flatMap((c) =>
      (c.metadataCourse || []).filter((m) => m.key === "course.dc.title").map((m) => m.value)))].sort();
    books.push({
      grade, classcode,
      work: md["work.dc.title"] || "",
      workId: md["work.dc.identifier.uri"] || "",
      manifestationId: md["manifestation.dc.identifier.uri"] || "",
      viewUrl: "https://ebooks.edu.gr/ebooks" + item.manifestation_view_url,
      downloadUrl: "https://ebooks.edu.gr/ebooks" + item.manifestation_download_url,
      file: String(item.manifestation_download_url || "").split("/").pop(),
      courses
    });
  }
}
books.sort((a, b) => (a.grade + a.file).localeCompare(b.grade + b.file));
fs.writeFileSync(OUT, JSON.stringify({ source: "https://ebooks.edu.gr/ebooks/v2/allcourses.jsp", fetchedAt: new Date().toISOString().slice(0, 10), books }, null, 1) + "\n");
console.log(`EBOOKS_EPAL_INVENTORY=${books.length} -> ${path.relative(ROOT, OUT)}`);
