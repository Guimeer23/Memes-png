/* Módulo extraído de js/album.js para facilitar manutenção. Ordem definida em js/album.js. */
const dayKey=d=>{d=d||new Date();return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()};
const prevKey=()=>{const d=new Date();d.setDate(d.getDate()-1);return dayKey(d)};
const MPOOL=[{id:"open",e:"📦",t:"Abrir pacotes",n:[2,3],r:150},{id:"paste",e:"🖼️",t:"Colar figurinhas",n:[4,6],r:200},{id:"new",e:"✨",t:"Descobrir cartas novas",n:[2,3],r:200},{id:"sell",e:"💰",t:"Vender repetidas",n:[1,2],r:100},{id:"rare",e:"🍀",t:"Tirar carta Rara ou melhor",n:[1,1],r:300}];
function dailyM(){const t=dayKey();if(!A.dm||A.dm.d!==t){const pool=[...MPOOL].sort(()=>Math.random()-.5).slice(0,3);
 A.dm={d:t,m:pool.map(x=>{const n=x.n[Math.random()*x.n.length|0];return{id:x.id,n,p:0,c:0,r:Math.round(x.r*n/x.n[0])}})}}return A.dm}
function mission(id,n){if(!n&&n!==undefined)return;dailyM().m.forEach(x=>{if(x.id==id&&!x.c)x.p=Math.min(x.n,x.p+(n||1))});save()}
const bonusAmt=s=>300+100*Math.min(s-1,6);
const curStreak=()=>A.lastDay==dayKey()||A.lastDay==prevKey()?(A.streak||0):0;
const freeTier=()=>{const s=curStreak();return s>=7?2:s>=3?1:0};
function claimBonus(){const t=dayKey();if(A.lastDay==t)return;A.streak=A.lastDay==prevKey()?(A.streak||0)+1:1;A.lastDay=t;A.bonus=new Date().toDateString();
 const a=bonusAmt(A.streak);gainCoins(a,$("bonus"));toast(`🔥 ${A.streak} ${A.streak>1?"dias seguidos":"dia"}! +${a} 🪙`);save();renderDaily()}
function renderDaily(){const box=$("dailyBox");if(!box)return;
 const t=dayKey(),done=A.lastDay==t,s=curStreak(),next=done?s+1:(A.lastDay==prevKey()?(A.streak||0)+1:1),dm=dailyM(),ft=freeTier(),got=A.freePk==t,c=s?((s-1)%7)+1:0;
 $("bonus").textContent=done?"🎁 Bônus de hoje coletado":`🎁 Bônus diário +${bonusAmt(next)}`;
 box.innerHTML=`<h3>🔥 Sequência: ${s} dia${s==1?"":"s"} <small>· ${done?"amanhã":"hoje"}: +${bonusAmt(next)} 🪙</small></h3>
 <div class="sdots">${[1,2,3,4,5,6,7].map(i=>`<i class="${i<=c?"on":""}">${i}</i>`).join("")}</div>
 <p class="mut" style="margin:0 0 8px">Pacote grátis do dia: <b>${TN[ft]}</b>${s<7?` · com ${s<3?3:7} dias seguidos ele melhora`:""}</p>
 <button class="main" data-a="free" style="width:100%;margin-bottom:14px" ${got?"disabled":""}>${got?"🎁 Pacote de hoje já aberto":`🎁 Abrir pacote grátis · ${TN[ft]}`}</button>
 <h3>📋 Missões de hoje</h3>${dm.m.map((x,i)=>{const q=MPOOL.find(z=>z.id==x.id),ok=x.p>=x.n&&!x.c;
  return `<div class="ls"><span style="font-size:1.6rem">${q.e}</span><div class="li"><b>${q.t}</b> <small>${x.p}/${x.n} · +${x.r} 🪙</small><div class="bar" style="margin:6px 0 0"><i style="width:${x.p/x.n*100}%"></i></div></div><button class="${ok?"main":"ghost"}" data-m="${i}" ${ok?"":"disabled"}>${x.c?"✔":"Resgatar"}</button></div>`}).join("")}
 <small class="mut">Novas missões todo dia à meia-noite.</small>`}
$("dailyBox").onclick=e=>{const b=e.target.closest("button");if(!b||b.disabled)return;
 if(b.dataset.a=="free"){if(A.freePk==dayKey())return;buy(freeTier(),true)}
 else if(b.dataset.m!=null){const x=dailyM().m[+b.dataset.m];if(!x||x.c||x.p<x.n)return;x.c=1;gainCoins(x.r,b);toast(`Missão cumprida! +${x.r} 🪙`);save();renderDaily()}};
let STATS={n:0,c:{},t:0,ok:false};
async function loadStats(force){
 if(!fbDb)return false;if(!force&&Date.now()-STATS.t<90000)return false;STATS.t=Date.now();
 try{const sn=await fbDb.doc("stats/owners").get(),d=sn.exists?sn.data():{};STATS.n=d.n||0;STATS.c=d.c||{};STATS.ok=true;return true}
 catch(e){STATS.t=0;return false}}
async function syncOwners(){
 if(!fbDb||!fbUser)return;
 const cnt=A.cnt||(A.cnt={}),inc=firebase.firestore.FieldValue.increment,add=[],rem=[];
 for(const id in A.owned)if(A.owned[id]>0&&!cnt[id])add.push(id);
 for(const id in cnt)if(!(A.owned[id]>0))rem.push(id);
 if(!add.length&&!rem.length&&A.cntP)return;
 const c={};add.forEach(i=>c[i]=inc(1));rem.forEach(i=>c[i]=inc(-1));
 const up={c};if(!A.cntP)up.n=inc(1);
 await fbDb.doc("stats/owners").set(up,{merge:true});
 add.forEach(i=>cnt[i]=1);rem.forEach(i=>delete cnt[i]);A.cntP=1}
