!function(){"use strict";const e=[{scientificName:"Parus Major",germanName:"Kohlmeise"},{scientificName:"Cyanistes Caeruleus",germanName:"Blaumeise"},{scientificName:"Periparus Ater",germanName:"Tannenmeise"},{scientificName:"Dendrocopos Major",germanName:"Buntspecht"},{scientificName:"Troglodytes Troglodytes",germanName:"Zaunkönig"},{scientificName:"Erithacus Rubecula",germanName:"Rotkehlchen"},{scientificName:"Phylloscopus Collybita",germanName:"Zilpzalp"},{scientificName:"Sitta Europaea",germanName:"Kleiber"},{scientificName:"Garrulus Glandarius",germanName:"Eichelhäher"}];function n(n){for(let t of e)if(n===t.scientificName)return t}function t(e){return{soundFileUrl:e.file,recorderName:e.rec,englishName:e.en,genericName:e.gen,scientificName:e.sp}}var i=function(e,n,t,i){return new(t||(t=Promise))(function(r,s){function o(e){try{a(i.next(e))}catch(e){s(e)}}function c(e){try{a(i.throw(e))}catch(e){s(e)}}function a(e){var n;e.done?r(e.value):(n=e.value,n instanceof t?n:new t(function(e){e(n)})).then(o,c)}a((i=i.apply(e,n||[])).next())})};function r(e){return`${e.birdQueryName} area:europe q:A type:song`}function s(e){return Math.floor(Math.random()*e)}class o{constructor(e){this.birdsInQuiz=e,this.numRecordingsMap=new Map,this.recordingsMap=new Map}maybeGetNumRecordings(e){return this.numRecordingsMap.get(e)}maybeGetBirdRecording(e,n){return this.recordingsMap.get([e,n])}saveResult(e,n){this.numRecordingsMap.set(e,n.numRecordings);for(let t=0;t<n.recordings.length;t++){const i=n.recordings[t],r=t+100*(n.page-1);this.recordingsMap.set([e,r],i)}}}class c{constructor(e){this.birdsInQuiz=e,this.storage=new o(e)}getNumRecordingsInXenoCanto(e){return i(this,void 0,void 0,function*(){const n=this.storage.maybeGetNumRecordings(e);if(!n){const n=yield this.fetchApiResponse({query:r({birdQueryName:this.birdsInQuiz[e].scientificName}),pageNumber:1});return this.storage.saveResult(e,n),n.numRecordings}return n})}getBirdRecording(e,n){return i(this,void 0,void 0,function*(){const t=this.storage.maybeGetBirdRecording(e,n);if(!t){const t=yield this.fetchApiResponse({query:r({birdQueryName:this.birdsInQuiz[e].scientificName}),pageNumber:n/100+1});return this.storage.saveResult(e,t),t.recordings[n%100]}return t})}fetchApiResponse(e){return fetch(function(e){return`https://jsonp.afeld.me/?url=${`https://www.xeno-canto.org/api/2/recordings?query=${e.query}&page=${e.pageNumber}`}`}(e)).then(e=>e.json()).then(e=>(function(e){return{numRecordings:parseInt(e.numRecordings),page:e.page,numPages:e.numPages,recordings:e.recordings.map(t)}})(e))}}class a{constructor(e,n){this.birdsInQuiz=e,this.fetcher=new c(e),this.numOptions=n}getNewRound(){return i(this,void 0,void 0,function*(){const e=function(e,n){if(n>=e)return[-999999];const t=Array(e).fill(void 0).map((e,n)=>n);for(let i=0;i<n-1;i++){const n=i+s(e-i),r=t[i],o=t[n];t[i]=o,t[n]=r}return t.slice(0,n)}(this.birdsInQuiz.length,this.numOptions),n=e.map(e=>this.birdsInQuiz[e]),t=e[s(this.numOptions)],i=s(yield this.fetcher.getNumRecordingsInXenoCanto(t)),r=yield this.fetcher.getBirdRecording(t,i);return{correctBird:this.birdsInQuiz[t],recording:r,birdOptions:n}})}}function u(e){d(),e.getNewRound().then(e=>{!function(e,n,t){d();const i=document.getElementById("audio");i.src=t.soundFileUrl,i.play();const r=document.getElementById("choices");for(const t of n){const n=t.scientificName===e.scientificName,i=document.createElement("button");i.textContent=t.germanName,i.addEventListener("click",e=>{const i=document.getElementById("congratulation-p");i.textContent=`${t.germanName} is ${n?"the":"NOT"} correct answer`}),r.appendChild(i)}}(e.correctBird,e.birdOptions,e.recording)})}function d(){const e=document.getElementById("choices");for(;e.firstChild;)e.removeChild(e.firstChild);document.getElementById("congratulation-p").textContent=""}document.addEventListener("DOMContentLoaded",function(){const t=function(t){const i=t.get("species");if(!i)return e;let r=[];for(let e of i.split(",")){const t=n(e);null!=t&&r.push(t)}return r}(new URLSearchParams(document.location.search.substring(1))),i=new a(t,Math.min(t.length,4));!function(e){document.getElementById("next-question").addEventListener("click",n=>{u(e)})}(i),u(i)})}();
