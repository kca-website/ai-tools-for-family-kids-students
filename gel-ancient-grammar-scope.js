"use strict";

// Precisely select the textbook's actual numbered grammar paragraphs.
// Page-level matching alone exposes unrelated rules in study and audio.
const SUBJECT = "archaia-a-lykeiou";
const FIRST = "Παθητικός μέλλοντας και αόριστος";
const SECOND = "Μέλλοντας ρημάτων σε -ίζω";
const BOOK_PATH = "/ebooks/v/html/8547/2340/Grammatiki-Archaias-Ellinikis_Gymnasiou-Lykeiou_html-apli/";
const CHAPTER_23 = BOOK_PATH + "index_02_19.html";
const CHAPTER_25 = BOOK_PATH + "index_02_21.html";

function isScoped(subject, topic, override) {
  return subject === SUBJECT && [FIRST, SECOND].includes(topic) &&
    override?.work === "8547/283" && override?.sourceOrigin === "verified-official-book-page-2026-10-30";
}
function paragraph(text, number, next) {
  const content = String(text || "");
  const start = content.indexOf(number + ".");
  const end = content.indexOf(next + ".", start + number.length + 1);
  if (start < 0 || end <= start) return "";
  return content.slice(start, end).trim();
}
function scope(subject, topic, override, pages) {
  if (!isScoped(subject, topic, override)) return null;
  const expected = topic === FIRST ? [CHAPTER_23, CHAPTER_25] : [CHAPTER_23];
  if (!Array.isArray(pages) || pages.length !== expected.length ||
      pages.some((p, i) => {
        try {
          const url = new URL(p?.url || "");
          return url.protocol !== "https:" || url.hostname !== "ebooks.edu.gr" ||
            url.pathname !== expected[i] || !String(p?.text || "").length;
        } catch (_) { return true; }
      })) return { ok:false, error:"gel_grammar_page_identity_not_verified" };

  let segments;
  if (topic === SECOND) {
    segments = [paragraph(pages[0].text, "295", "296")];
    if (segments[0].length < 650 || !segments[0].includes("κομίζω") ||
        !segments[0].includes("κομιῶ") || !segments[0].includes("ιοῦμαι")) {
      return { ok:false, error:"gel_grammar_295_text_not_verified" };
    }
  } else {
    segments = [
      paragraph(pages[0].text, "297", "298"),
      paragraph(pages[1].text, "315", "317")
    ];
    if (segments[0].length < 550 || !/παθητ/i.test(segments[0]) ||
        segments[1].length < 700 || !/παθητ/i.test(segments[1]) ||
        !/γραφ.ή.σομαι/i.test(segments[1])) {
      return { ok:false, error:"gel_grammar_passive_297_315_not_verified" };
    }
  }
  return {
    ok:true,
    text:segments.map((t,i)=>"[Official numbered grammar paragraph: "+pages[i].url+"]\n"+t).join("\n\n"),
    selectedParagraphs:topic === SECOND ? ["§295"] : ["§297", "§315–316"]
  };
}
module.exports = Object.freeze({ SUBJECT, FIRST, SECOND, isScoped, scope });
