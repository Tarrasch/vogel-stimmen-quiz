!function(){"use strict";const e=[{queryName:"Parus Major",germanName:"Kohlmeise",searchParamCode:"km"},{queryName:"Cyanistes Caeruleus",germanName:"Blaumeise",searchParamCode:"bm"},{queryName:"Periparus ater",germanName:"Tannenmeise",searchParamCode:"tm"},{queryName:"Dendrocopos major",germanName:"Buntspecht",searchParamCode:"bs"},{queryName:"Troglodytes troglodytes",germanName:"Zaunkönig",searchParamCode:"zk"},{queryName:"Erithacus rubecula",germanName:"Rotkehlchen",searchParamCode:"rk"},{queryName:"Phylloscopus collybita",germanName:"Zilpzalp",searchParamCode:"zz"},{queryName:"Sitta europaea",germanName:"Kleiber",searchParamCode:"kl"},{queryName:"Garrulus glandarius",germanName:"Eichelhäher",searchParamCode:"eh"}];function r(r){for(let a of e)if(r===a.searchParamCode)return a}function a(e){return{soundFileUrl:`https:${e.file}`,recorderName:e.rec,englishName:e.en,genericName:e.gen,scientificName:e.sp}}function n(e){return Math.floor(Math.random()*e)}console.log("Got here!"),document.addEventListener("DOMContentLoaded",function(){let t=function(a){const n=a.get("species");if(!n)return e;let t=[];for(let e of n.split(",")){const a=r(e);null!=a&&t.push(a)}return t}(new URLSearchParams(document.location.search.substring(1))),o=(m=t)[n(m.length)];var m,s,u;fetch((u={birdQueryName:o.queryName},s=`${u.birdQueryName} area:europe q:A type:song`,`https://jsonp.afeld.me/?url=${`https://www.xeno-canto.org/api/2/recordings?query=${s}`}`)).then(e=>e.json()).then(e=>{let r=function(e){return e.recordings[n(e.recordings.length)]}(function(e){return{numRecordings:parseInt(e.numRecordings),page:e.page,numPages:e.numPages,recordings:e.recordings.map(a)}}(e));!function(e,r,a){let n=document.getElementById("audio");n.src=a.soundFileUrl,n.play();let t=document.getElementById("choices");for(let a of r){let r=a.queryName===e.queryName,n=document.createElement("button");n.textContent=a.germanName,n.addEventListener("click",e=>{document.getElementById("congratulation-p").textContent=`${a.germanName} is ${r?"the":"NOT"} correct answer`}),t.appendChild(n)}}(o,t,r)})})}();
