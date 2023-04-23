!function(){"use strict";function e(e,t){if(t>e)return console.log("ERROR!!! outputLength > max"),[-999999];const i=Array(e).fill(void 0).map(((e,n)=>n));return function(e){for(let t=0;t<e.length-1;t++){const i=t+n(e.length-t);[e[t],e[i]]=[e[i],e[t]]}}(i),i.slice(0,t)}function n(e){return t(e,Math.random())}function t(e,n=Math.random()){return Math.floor(n*e)}function i(i){const r=e(i.numBirdsInQuiz,i.numOptions),o=Math.random();return{optionIndexes:r,correctOptionIndex:r[n(i.numOptions)],getStartIndexFromNumRecordings:e=>t(e,o)}}function r(e){return{soundFileUrl:e.file,recorderName:e.rec,englishName:e.en,genericName:e.gen,scientificName:e.sp,id:e.id,url:e.url,also:(n=e.also,1===n.length&&""===n[0]?[]:n)};var n}var o=function(e,n,t,i){return new(t||(t=Promise))((function(r,o){function s(e){try{u(i.next(e))}catch(e){o(e)}}function c(e){try{u(i.throw(e))}catch(e){o(e)}}function u(e){var n;e.done?r(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(s,c)}u((i=i.apply(e,n||[])).next())}))};function s(e){return`${e.birdQueryName} area:europe q:A type:song`}class c{constructor(e){this.birdsInQuiz=e,this.numRecordingsMap=new Map,this.recordingsMap=new Map}maybeGetNumRecordings(e){return this.numRecordingsMap.get(e)}maybeGetBirdRecording(e,n){return this.recordingsMap.get(`${e}-${n}`)}saveResult(e,n){this.numRecordingsMap.set(e,n.numRecordings);for(let t=0;t<n.recordings.length;t++){const i=n.recordings[t],r=t+500*(n.page-1);this.recordingsMap.set(`${e}-${r}`,i)}}}class u{constructor(e){this.birdsInQuiz=e,this.storage=new c(e)}getNumRecordingsInXenoCanto(e){return o(this,void 0,void 0,(function*(){const n=this.storage.maybeGetNumRecordings(e);if(!n){const n=yield this.fetchApiResponse({query:s({birdQueryName:this.birdsInQuiz[e].scientificName}),pageNumber:1});return this.storage.saveResult(e,n),n.numRecordings}return n}))}getBirdRecording(e,n){return o(this,void 0,void 0,(function*(){const t=this.storage.maybeGetBirdRecording(e,n);if(!t){const t=yield this.fetchApiResponse({query:s({birdQueryName:this.birdsInQuiz[e].scientificName}),pageNumber:Math.trunc(n/500+1)});return this.storage.saveResult(e,t),t.recordings[n%500]}return t}))}fetchApiResponse(e){return fetch(function(e){return`https://famous-hull-347520.ue.r.appspot.com/simple-xeno-canto?query=${e.query}&page=${e.pageNumber}`}(e)).then((e=>e.json())).then((e=>{return n=e,{numRecordings:parseInt(n.numRecordings),page:n.page,numPages:n.numPages,recordings:n.recordings.map(r)};var n}))}}class a{constructor(e,n){this.birdsInQuiz=e,this.fetcher=new u(e),this.numOptions=n;const t=e.length;this.nextRandomData=i({numBirdsInQuiz:t,numOptions:n})}getGoodBirdRecording(e){return o(this,void 0,void 0,(function*(){const n=e.correctOptionIndex,t=yield this.fetcher.getNumRecordingsInXenoCanto(n);let i=e.getStartIndexFromNumRecordings(t),r=0;for(;;){const e=yield this.fetcher.getBirdRecording(n,i),o=r>=30;if(0===e.also.length||o)return e;i=(i+1)%t,r++}}))}getNewRoundUsingRandomData(e){return o(this,void 0,void 0,(function*(){const n=e.optionIndexes.map((e=>this.birdsInQuiz[e])),t=yield this.getGoodBirdRecording(e);return{correctBird:this.birdsInQuiz[e.correctOptionIndex],recording:t,birdOptions:n}}))}preFetchNextRound(){this.getNewRoundUsingRandomData(this.nextRandomData)}getNewRound(){return o(this,void 0,void 0,(function*(){const e=yield this.getNewRoundUsingRandomData(this.nextRandomData);return this.nextRandomData=i({numBirdsInQuiz:this.birdsInQuiz.length,numOptions:this.numOptions}),e}))}}var d;!function(e){e[e.EASY=0]="EASY",e[e.MEDIUM=1]="MEDIUM",e[e.HARD=2]="HARD"}(d||(d={}));const m=[{scientificName:"Anas Platyrhynchos",germanName:"Stockente",difficulty:d.EASY},{scientificName:"Cinclus Cinclus",germanName:"Wasseramsel",difficulty:d.HARD},{scientificName:"Cyanistes Caeruleus",germanName:"Blaumeise",difficulty:d.EASY},{scientificName:"Erithacus Rubecula",germanName:"Rotkehlchen",difficulty:d.MEDIUM},{scientificName:"Fringilla Coelebs",germanName:"Buchfink",difficulty:d.EASY},{scientificName:"Hirundo Rustica",germanName:"Rauchschwalbe",difficulty:d.MEDIUM},{scientificName:"Parus Major",germanName:"Kohlmeise",difficulty:d.EASY},{scientificName:"Periparus Ater",germanName:"Tannenmeise",difficulty:d.MEDIUM},{scientificName:"Phylloscopus Collybita",germanName:"Zilpzalp",difficulty:d.EASY},{scientificName:"Regulus Ignicapilla",germanName:"Sommergoldhähnchen",difficulty:d.HARD},{scientificName:"Regulus Regulus",germanName:"Wintergoldhähnchen",difficulty:d.HARD},{scientificName:"Troglodytes Troglodytes",germanName:"Zaunkönig",difficulty:d.MEDIUM}];function f(e){const n=e.get("species");if(!n)return m;let t=[];for(let e of n.split(",")){const n=l(e);null!=n&&t.push(n)}return t}function l(e){for(let n of m)if(e===n.scientificName)return n}function g(e){const n=parseInt(e.get("numOptions")||"4");return Number.isNaN(n)?4:n}function h(){return document.getElementById("answer-p")}function p(){return document.getElementById("recordist-attribution")}function N(){return Array.from(document.getElementsByClassName("choice-button"))}function R(e){e.outerHTML=e.outerHTML}function y(e){I(),e.getNewRound().then((n=>{e.preFetchNextRound(),function(e,n,t){I();const i=document.getElementById("audio");i.src=t.soundFileUrl,i.play();for(let i=0;i<n.length;i++){const r=n[i],o=N()[i],s=r.scientificName===e.scientificName;o.textContent=r.germanName,o.addEventListener("click",(e=>{b(r,s,t)}))}}(n.correctBird,n.birdOptions,n.recording)}))}function I(){for(const e of N())e.disabled=!1,e.textContent="",R(e);h().textContent="",p().textContent="",p().href=""}function b(e,n,t){if(h().textContent=`${e.germanName} ist ${n?"RICHTIG":"FALSCH"}`,n){p().textContent=`Aufname XC${t.id} [${t.recorderName}]`,p().href=`https:${t.url}`;const n=N().filter((n=>n.textContent!==e.germanName));for(const e of n)e.disabled=!0}}document.addEventListener("DOMContentLoaded",(function(){const e=new URLSearchParams(document.location.search.substring(1)),n=function(e){return{species:f(e),numOptions:g(e)}}(e),t=n.species,i=new a(t,Math.min(t.length,n.numOptions));!function(e){const n=document.getElementById("choices");for(let t=0;t<e;t++){const e=document.createElement("button");e.className="choice-button",n.appendChild(e)}}(i.numOptions),function(e){const n=new URL("quiz_starter.html",document.URL);n.search=e.toString(),document.getElementById("edit-quiz").setAttribute("href",n.href)}(e),function(e){document.getElementById("next-question").addEventListener("click",(n=>{y(e)}))}(i),y(i)}))}();
