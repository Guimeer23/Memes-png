/* Módulo extraído de js/album.js para facilitar manutenção. Ordem definida em js/album.js. */
function ensureOpen(){const b=$("book");if(b.classList.contains("open"))return Promise.resolve();b.classList.add("open");return new Promise(r=>setTimeout(r,1000))}
async function goToCard(id){
 const s0=S[id-1];
 await ensureOpen();
 if(sel!==id)return;
 $("book").scrollIntoView({behavior:"smooth",block:"center"});
 await flipTo(s0.pg);
 if(sel!==id)return;
 const sl=document.querySelector(`.slot[data-id="${id}"]`);if(sl)sl.scrollIntoView({behavior:"smooth",block:"center"});
 toast(`Cole a #${id} ${s0.n} no espaço piscando`);
}
function toggleMulti(id){
 const i=multiSel.indexOf(id);
 if(i>=0)multiSel.splice(i,1);
 else{if(multiSel.length>=AUTO_MAX)return toast(`Máximo de ${AUTO_MAX} por vez`);multiSel.push(id)}
 render();
}
$("invNew").onclick=e=>{const m=e.target.closest(".mini");if(!m||autoRun)return;const id=+m.dataset.id;
 if(multiOn){toggleMulti(id);return}
 sel=sel==id?null:id;render();
 if(sel)goToCard(id)};
$("invDup").onclick=e=>{const m=e.target.closest(".mini");if(!m)return;const s=S[m.dataset.id-1],v=autoPrice(s);
 if(sellArm==s.id){if((A.owned[s.id]||0)<2){sellArm=null;return toast("Você precisa ficar com pelo menos 1 cópia")}A.owned[s.id]--;mission("sell");sellArm=null;gainCoins(v,m);toast(`🏪 Venda automática: +${nf(v)} 🪙`)}
 else{sellArm=s.id;toast(`Venda automática (50%): toque de novo para receber ${nf(v)} 🪙`);setTimeout(()=>sellArm=null,2500)}};
$("spread").onclick=e=>{const sl=e.target.closest(".slot");if(!sl)return;const id=+sl.dataset.id;
 if(A.pasted[id]){openCard(id);return}
 if(!sel){if(A.owned[id]>0){sel=id;render()}else return toast(`Você ainda não tem a #${id}`)}
 if(sel!=id)return toast(`Esse não é o lugar! A #${sel} vai no espaço #${sel}`);
 game(S[id-1],document.querySelector(`.slot[data-id="${id}"]`))};

function autoUI(nw){
 const n=nw.length,k=multiSel.length;
 $("btnMulti").textContent=multiOn?"✖ Cancelar seleção":"☑️ Escolher várias";
 $("btnMulti").classList.toggle("on",multiOn);
 $("btnMulti").disabled=autoRun||(!n&&!multiOn);
 $("btnAuto").textContent=`⚡ Colar automático (${Math.min(AUTO_MAX,n)})`;
 $("btnAuto").disabled=autoRun||!n;
 $("btnPaste").hidden=!multiOn;
 $("btnPaste").textContent=`Colar ${k} selecionada${k==1?"":"s"}`;
 $("btnPaste").disabled=autoRun||!k;
}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function ensureSlotVisible(id){
 const sl=document.querySelector(`.slot[data-id="${id}"]`);if(!sl)return;
 const r=sl.getBoundingClientRect();
 if(r.top<70||r.bottom>innerHeight-190){sl.scrollIntoView({behavior:"smooth",block:"center"});await wait(450)}
}
function flyPaste(s0,dur){
 return new Promise(res=>{
  const slot=document.querySelector(`.slot[data-id="${s0.id}"]`);
  let el=null,fin=false;
  const land=()=>{
   if(fin)return;fin=true;
   if(el)el.remove();
   A.pasted[s0.id]={r:rot,x:ox,y:oy};mission("paste");save();
   const q0=document.querySelector(`.slot[data-id="${s0.id}"]`);
   let org=null;if(q0){const q=q0.getBoundingClientRect();org={x:q.left+q.width/2,y:q.top+q.height/2}}
   gainCoins(AUTO_COINS,org);
   const n=document.querySelector(`.slot[data-id="${s0.id}"] .st`);if(n)n.classList.add("pop");
   vib(15);
   setTimeout(res,90);
  };
  const rot=Math.round(Math.random()*8-4),ox=Math.round(Math.random()*6-3),oy=Math.round(Math.random()*6-3);
  if(!slot||!document.body.animate){land();return}
  const r=slot.getBoundingClientRect(),b=$("aBasket").getBoundingClientRect();
  el=document.createElement("div");el.className="fly";
  el.style.width=r.width+"px";el.style.height=r.height+"px";
  el.innerHTML=`<div class="st" style="background:${bg(s0)};border-color:${bc(s0)};--x:0px;--y:0px;--r:0deg">${emo(s0)}<span class="t">${s0.n}</span></div>`;
  document.body.append(el);
  const tx=r.left,ty=r.top,sx=b.left+b.width/2-r.width/2,sy=b.top+b.height/2-r.height/2;
  const a=el.animate([
   {transform:`translate(${sx}px,${sy}px) scale(.4) rotate(-25deg)`,opacity:0,offset:0},
   {transform:`translate(${sx+(tx-sx)*.35}px,${sy+(ty-sy)*.45-60}px) scale(.8) rotate(-8deg)`,opacity:1,offset:.3},
   {transform:`translate(${tx}px,${ty-26}px) scale(1.28) rotate(${rot}deg)`,opacity:1,offset:.72},
   {transform:`translate(${tx+ox}px,${ty+oy}px) scale(1) rotate(${rot}deg)`,opacity:1,offset:1}
  ],{duration:dur,easing:"cubic-bezier(.4,.1,.3,1)",fill:"forwards"});
  a.onfinish=land;setTimeout(land,dur+500);
 });
}
async function runAuto(ids){
 if(autoRun)return;
 autoRun=true;autoStop=false;sel=null;multiOn=false;multiSel=[];
 const total=ids.length,dur=Math.max(420,700-total*14);let done=0,earned=0;
 $("autoShield").classList.add("on");$("autoHud").classList.add("on");
 $("aStop").disabled=false;$("aStop").textContent="Parar";
 const hud=()=>{$("aN").textContent=`${done}/${total}`;$("aC").textContent=earned};
 hud();render();
 try{
  await ensureOpen();
  $("book").scrollIntoView({behavior:"smooth",block:"center"});await wait(380);
  for(const id of ids){
   if(autoStop)break;
   if(!(A.owned[id]>0)||A.pasted[id])continue;
   const moved=S[id-1].pg!==PGI;
   await flipTo(S[id-1].pg,{fast:true});
   if(autoStop)break;
   await wait(moved?110:40);
   await ensureSlotVisible(id);
   await flyPaste(S[id-1],dur);
   done++;earned+=AUTO_COINS;hud();
  }
 }catch(err){console.warn("colagem automática:",err)}
 finally{
  autoRun=false;
  $("autoShield").classList.remove("on");$("autoHud").classList.remove("on");
  render();
  toast(autoStop?`⏹ Interrompido: ${done} de ${total} coladas · +${earned} 🪙`:done?`✅ ${done} figurinha${done==1?"":"s"} colada${done==1?"":"s"}! +${earned} 🪙`:"Nenhuma figurinha colada");
 }
}
$("btnMulti").onclick=()=>{if(autoRun)return;multiOn=!multiOn;multiSel=[];if(multiOn)sel=null;render();if(multiOn)toast(`Toque nas figurinhas para marcar (máx. ${AUTO_MAX})`)};
$("btnPaste").onclick=()=>{if(autoRun||!multiSel.length)return;runAuto([...multiSel].sort((a,b)=>a-b))};
$("btnAuto").onclick=()=>{if(autoRun)return;
 const ids=S.filter(s=>A.owned[s.id]>0&&!A.pasted[s.id]).slice(0,AUTO_MAX).map(s=>s.id);
 if(!ids.length)return toast("Nada para colar");runAuto(ids)};
$("aStop").onclick=()=>{autoStop=true;$("aStop").disabled=true;$("aStop").textContent="Parando…"};

const PEM=["🐭","🦊","🐼","🦁","🐋","🦚","🐉","🐙","🌌"];
