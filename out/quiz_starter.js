!function(){"use strict";const e=[{queryName:"Parus Major",germanName:"Kohlmeise",searchParamCode:"km"},{queryName:"Cyanistes Caeruleus",germanName:"Blaumeise",searchParamCode:"bm"},{queryName:"Periparus ater",germanName:"Tannenmeise",searchParamCode:"tm"},{queryName:"Dendrocopos major",germanName:"Buntspecht",searchParamCode:"bs"},{queryName:"Troglodytes troglodytes",germanName:"Zaunkönig",searchParamCode:"zk"},{queryName:"Erithacus rubecula",germanName:"Rotkehlchen",searchParamCode:"rk"},{queryName:"Phylloscopus collybita",germanName:"Zilpzalp",searchParamCode:"zz"},{queryName:"Sitta europaea",germanName:"Kleiber",searchParamCode:"kl"},{queryName:"Garrulus glandarius",germanName:"Eichelhäher",searchParamCode:"eh"}];function a(){let a=new URL("./quiz.html",document.baseURI);a.searchParams.set("species",function(){const a=[];for(let r of e){const e=document.getElementById(`specie-${r.searchParamCode}`);e.checked&&a.push(r)}return a}().map(e=>e.searchParamCode).join(",")),document.location.href=a.href}function r(e){const a=document.createElement("div"),r=document.createElement("input"),n=document.createElement("label");return r.type="checkbox",r.id=`specie-${e.searchParamCode}`,n.innerText=e.germanName,a.appendChild(r),a.appendChild(n),a}document.addEventListener("DOMContentLoaded",function(){var n;null===(n=document.getElementById("start-quiz"))||void 0===n||n.addEventListener("click",a),function(){const a=document.getElementById("species-list");for(let n of e)null==a||a.appendChild(r(n))}()})}();
