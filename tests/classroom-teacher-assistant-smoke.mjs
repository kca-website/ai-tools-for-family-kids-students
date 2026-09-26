import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});

try{
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
    const page=await browser.newPage({viewport});
    await page.goto(`${BASE}/classroom.html`,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForURL(/\/teacher-assistant\.html(?:\?.*)?$/,{timeout:10000});
    assert.match(await page.locator('h1').innerText(),/Εκπαιδευτικό υλικό|AI Teacher Assistant/i,'classroom redirect must land on Teacher Assistant');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    assert.ok(overflow<=1,`Teacher assistant redirect target horizontal overflow: ${overflow}`);
    await page.close();
  }

  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(`${BASE}/teacher-assistant.html`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('.task.active[data-task="lesson"]');
  assert.equal(await page.locator('script[src*="js.puter.com"]').count(),0,'Puter must not load before explicit consent/connect');
  assert.match(await page.locator('.privacy').innerText(),/Μην εισάγεις ονοματεπώνυμα/);
  assert.equal(await page.evaluate(()=>localStorage.length),0,'Teacher assistant must not create localStorage history');
  assert.equal(await page.evaluate(()=>sessionStorage.length),0,'Teacher assistant must not create sessionStorage history');

  await page.selectOption('#context','gel');
  await page.selectOption('#grade','a');
  const biologyOption=await page.locator('#subject option').evaluateAll((options)=>options.find(o=>/Βιολογία/.test(o.textContent||''))?.value||'');
  assert.ok(biologyOption,'Teacher Assistant GEL A Biology subject missing');
  await page.selectOption('#subject',biologyOption);
  await page.waitForTimeout(80);
  const biologyUnits=await page.locator('#unit option').allInnerTexts();
  assert.equal(biologyUnits.length,14,'Teacher Assistant GEL A Biology should expose 14 documented mapped topics');
  assert.match(await page.locator('#curriculumNote').innerText(),/αναλυτικό χάρτη/i,'Teacher Assistant must label GEL Biology topics as a documented navigation map');
  assert.ok(await page.locator('#curriculumNote a[href^="https://"]').count()>=1,'Teacher Assistant mapped curriculum must expose a source link');

  assert.equal(await page.locator('#groqBtn').count(),1,'Teacher Assistant must expose the account-free Groq generation route');
  assert.equal(await page.locator('#generationProgress').count(),1,'Teacher Assistant must expose a visible generation-progress state');
  assert.equal(await page.locator('#generationProgress').isHidden(),true,'Generation-progress state must be hidden before generation starts');
  assert.equal(await page.evaluate(()=>typeof startGeneration==='function'&&typeof stopGeneration==='function'),true,'Generation lifecycle helpers must be available');
  assert.equal(await page.locator('.task[data-task="assessment"]').count(),1,'Teacher Assistant must expose the dedicated assessment-sheet task');
  await page.locator('.task[data-task="assessment"]').click();
  assert.equal(await page.locator('#assessmentOptions').isVisible(),true,'Assessment controls must appear when assessment task is selected');
  const assessmentTools=await page.locator('#teacherToolsGrid').textContent();
  assert.match(assessmentTools,/Wayground/,'Assessment recommendations must include Wayground');
  assert.match(assessmentTools,/Formative/,'Assessment recommendations must include Formative');
  assert.doesNotMatch(assessmentTools,/Quizlet/,'Quizlet must not be a core assessment-sheet recommendation');
  await page.selectOption('#assessmentKind','diagnostic');
  await page.selectOption('#assessmentDifficulty','mixed');
  await page.selectOption('#assessmentCount','8');
  await page.selectOption('#assessmentScale','20');
  const assessmentPrompt=await page.evaluate(()=>promptText());
  assert.match(assessmentPrompt,/Διαγνωστική αξιολόγηση/,'Assessment prompt must include selected assessment kind');
  assert.match(assessmentPrompt,/8 ερωτήσεις/,'Assessment prompt must include selected question count');
  assert.match(assessmentPrompt,/Φύλλο μαθητή/,'Assessment prompt must require a separate student sheet');
  assert.match(assessmentPrompt,/κλειδί απαντήσεων/,'Assessment prompt must require teacher answer key');
  assert.equal(await page.locator('#puterBtn').count(),1,'Teacher Assistant must expose Puter only as an explicit alternative');
  assert.equal(await page.locator('.task[data-task="video"]').count(),1,'Teacher Assistant must expose an educational-video task');
  await page.locator('.task[data-task="video"]').click();
  assert.equal(await page.locator('#videoOptions').isVisible(),true,'Video controls must appear when educational-video task is selected');
  assert.equal(await page.locator('#standardGenerationControls').isHidden(),true,'Video task must use one direct creation action instead of the generic provider chooser');
  assert.equal(await page.locator('#videoCreateBtn').count(),1,'Video prototype needs one direct create-video button');
  assert.equal(await page.locator('#videoDuration option').count(),6,'Video duration selector must include 30s through 5 minutes');
  await page.selectOption('#videoDuration','300');
  assert.equal(await page.locator('#videoLongNotice').isVisible(),true,'Long video choices must show a visible time/use notice');
  assert.match(await page.locator('#videoLongNotice').innerText(),/εξαγωγή χρειάζεται περίπου όσο το μήκος του βίντεο/i,'Long video notice must explain real-time export cost');
  assert.equal(await page.evaluate(()=>window.AITOOLSKIDS_TEACHER_VIDEO.sceneCount()),22,'Five-minute videos should plan about 22 scenes');
  assert.equal(await page.evaluate(()=>window.AITOOLSKIDS_TEACHER_VIDEO.wordTarget()),'560–650','Five-minute videos should request long-form narration');
  assert.equal(await page.evaluate(()=>window.AITOOLSKIDS_TEACHER_VIDEO.outputTokenBudget()),4800,'Five-minute videos need a larger bounded storyboard output budget');
  const longPrompt=await page.evaluate(()=>window.AITOOLSKIDS_TEACHER_VIDEO.buildPrompt());
  assert.match(longPrompt,/300 δευτερόλεπτα/,'Five-minute prompt must carry the selected duration');
  assert.match(longPrompt,/Ακριβώς 22 σκηνές/,'Five-minute prompt must request the long-form scene count');
  await page.selectOption('#videoDuration','60');
  assert.equal(await page.locator('#videoLongNotice').isHidden(),true,'Short video choices should not show the long-duration notice');
  assert.equal(await page.locator('#videoCanvas').count(),1,'Video prototype needs a 16:9 preview canvas');
  assert.equal(await page.locator('#videoTimeline').count(),1,'Video prototype needs a visible timeline so the full preview is trackable');
  assert.equal(await page.locator('#videoExportBtn').count(),1,'Video prototype needs an export action');
  assert.equal(await page.locator('#videoFilePreview').count(),1,'Exported video must be reviewable with native video controls');
  assert.equal(await page.locator('#videoSaveBtn').count(),1,'Exported video needs a mobile-friendly save/share fallback');
  assert.equal(await page.locator('#videoFullscreenBtn').count(),1,'Video prototype needs a fullscreen control');
  assert.equal(await page.locator('#videoExportMp4Btn').count(),1,'Video prototype needs an MP4 export action');
  assert.equal(await page.locator('#videoMp4Download').count(),1,'Video prototype needs an MP4 download target');
  assert.equal(await page.locator('#videoSubtitleSize').inputValue(),'large','Large subtitles should be the default accessibility setting');
  assert.equal(await page.locator('#videoSubtitleContrast').inputValue(),'high','High subtitle contrast should be the default');
  assert.equal(await page.locator('#videoSubtitles').count(),1,'Video prototype needs a subtitle selector');
  assert.equal(await page.locator('#videoSourceMode').count(),1,'Video prototype needs a source-mode selector');
  await page.selectOption('#videoSourceMode','own');
  assert.equal(await page.locator('#videoOwnMaterialPanel').isVisible(),true,'Own-material panel must appear for teacher-supplied content');
  assert.equal(await page.locator('#videoOwnMaterial').count(),1,'Teacher must be able to paste their own source text');
  assert.equal(await page.locator('#videoOwnFile').count(),1,'Teacher must be able to load PDF/TXT source material');
  assert.equal(await page.locator('#videoOwnPolicy').count(),1,'Teacher must choose faithful vs improved use of their material');
  await page.fill('#videoOwnMaterial','Η πίεση είναι δύναμη ανά μονάδα επιφάνειας. Παράδειγμα: τακούνι και αθλητικό παπούτσι.');
  const ownPrompt=await page.evaluate(()=>window.AITOOLSKIDS_TEACHER_VIDEO.buildPrompt());
  assert.match(ownPrompt,/Υλικό που έδωσε ο εκπαιδευτικός/,'Own-source prompt must identify teacher material');
  assert.match(ownPrompt,/τακούνι και αθλητικό παπούτσι/,'Own-source prompt must use the supplied teacher text');
  await page.selectOption('#videoSourceMode','curriculum');
  assert.equal(await page.locator('#videoSubtitles').inputValue(),'el','Greek subtitles should be enabled by default');
  assert.equal(await page.locator('#videoVttDownload').count(),1,'Video prototype needs a separate VTT subtitle download');
  assert.equal(await page.evaluate(()=>typeof window.AITOOLSKIDS_TEACHER_VIDEO?.buildPrompt==='function'),true,'Video prototype runtime must expose its prompt builder');
  assert.equal(await page.evaluate(()=>typeof window.AITOOLSKIDS_TEACHER_VIDEO?.buildVtt==='function'),true,'Video prototype runtime must expose VTT subtitle generation');
  assert.equal(await page.evaluate(()=>typeof window.AITOOLSKIDS_TEACHER_VIDEO?.exportMp4==='function'),true,'Video prototype runtime must expose MP4 export');
  assert.equal(await page.evaluate(()=>typeof window.AITOOLSKIDS_TEACHER_VIDEO?.toggleFullscreen==='function'),true,'Video prototype runtime must expose fullscreen support');
  assert.equal(await page.evaluate(()=>typeof window.AITOOLSKIDS_TEACHER_VIDEO?.addScene==='function'),true,'Video runtime must expose storyboard editing');
  assert.equal(await page.evaluate(()=>typeof window.AITOOLSKIDS_TEACHER_VIDEO?.regenerateScene==='function'),true,'Video runtime must support regenerating one scene');
  assert.equal(await page.locator('#videoAddSceneBtn').count(),1,'Storyboard editor needs an add-scene action');
  assert.equal(await page.locator('#videoRefreshNarrationBtn').count(),1,'Edited narration needs a refresh-audio action');
  assert.equal(await page.evaluate(()=>typeof window.AITOOLSKIDS_TEACHER_VIDEO?.supportedMime==='function'),true,'Video export must use runtime codec detection');
  assert.deepEqual(await page.evaluate(()=>window.AITOOLSKIDS_TEACHER_VIDEO.subtitleChunks('Αυτό είναι ένα απλό παράδειγμα με αρκετές λέξεις για υπότιτλους.',5)),['Αυτό είναι ένα απλό παράδειγμα','με αρκετές λέξεις για υπότιτλους.'],'Subtitle chunking should keep readable short captions');
  assert.equal(await page.evaluate(()=>{
    const scenes=Array.from({length:12},(_,i)=>({title:'S'+i,onscreen:'x',narration:'αφήγηση '+i,symbol:'✨',visual:'κίνηση'}));
    return window.AITOOLSKIDS_TEACHER_VIDEO.extractJson(JSON.stringify({title:'Long',scenes})).scenes.length;
  }),12,'Long-form storyboard parser must preserve more than eight scenes');
  const videoPrompt=await page.evaluate(()=>window.AITOOLSKIDS_TEACHER_VIDEO.buildPrompt());
  assert.match(videoPrompt,/JSON/,'Video prompt must request structured scene output');
  assert.match(videoPrompt,/σχολική ενότητα|ενότητα/i,'Video prompt must remain grounded in the selected curriculum topic');
  await page.locator('.task[data-task="assessment"]').click();
  assert.equal(await page.locator('#teacherToolsDetails').count(),1,'Teacher Assistant must expose a collapsible specialised-tools section');
  assert.equal(await page.locator('#teacherToolsDetails').getAttribute('open'),null,'Specialised-tools section should be collapsed by default');
  assert.ok(await page.locator('#teacherToolsGrid .teacher-tool-card').count()>=2,'Teacher Assistant should render specialised tool recommendations');
  assert.match(await page.locator('#teacherToolsSummary').innerText(),/Βιολογία|Σχέδιο μαθήματος/,'Recommendations should react to task/subject context');
  const toolGuideHrefs=await page.locator('#teacherToolsGrid a').evaluateAll((links)=>links.map(a=>a.getAttribute('href')||''));
  assert.ok(toolGuideHrefs.every(h=>/^\/tools\/.+\.html$/.test(h)),'Teacher tool recommendations should route through local tool guide pages');
  assert.equal(await page.locator('script[src*="js.puter.com"]').count(),0,'Puter must remain unloaded until the user explicitly chooses it');

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=1,`Teacher assistant mobile horizontal overflow: ${overflow}`);
  assert.deepEqual(errors,[],`Teacher assistant browser errors: ${errors.join('\n')}`);
  await page.close();

  console.log('Classroom teacher-job navigator + stateless AI Teacher Assistant smoke passed.');
}finally{
  await browser.close();
}
