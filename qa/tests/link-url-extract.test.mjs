import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { extractHttpUrls } from '../scripts/link-url-extract.mjs';
test('URL extraction preserves Wikimedia parentheses and strips Markdown wrappers', ()=>{
  const p='https://commons.wikimedia.org/wiki/File:View_of_the_Pnyx_plateau_in_Athens_(50959890047).jpg';
  const q='https://commons.wikimedia.org/wiki/File:Thermometer_(PSF).png';
  assert.deepEqual(extractHttpUrls('source:"'+p+'" [image]('+q+')'),[p,q]);
  assert.deepEqual(extractHttpUrls('Visit (https://example.org/a?x=1&amp;y=2).'),['https://example.org/a?x=1&y=2']);
});
test('teacher animation references point to actual textbook sections',()=>{
  const text=fs.readFileSync(new URL('../../teacher-assistant.html',import.meta.url),'utf8');
  for(const suffix of ['Biologia_B-G-Gymnasiou_html-empl/index3_2.html','Fysiki_B-Gymnasiou_html-empl/index5_1.html','Fysiki_B-Gymnasiou_html-empl/index6_2.html','Fysiki_B-Gymnasiou_html-empl/index7_1.html','Fysiki_B-Gymnasiou_html-empl/index8_1.html'])assert.ok(text.includes(suffix),suffix);
  assert.doesNotMatch(text,/Biologia_B-G-Gymnasiou_html-empl\/index3\.html|Fysiki_B-Gymnasiou_html-empl\/index[5678]\.html/);
});
