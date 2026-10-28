/* Módulo extraído de js/album.js para facilitar manutenção. Ordem definida em js/album.js. */
/* ===== v1.43: loja de moedas (compras SIMULADAS, sem cobrança real) ===== */
const CP=[{id:"p099",p:"R$ 0,99",c:200},{id:"p150",p:"R$ 1,50",c:400},{id:"p399",p:"R$ 3,99",c:1000},{id:"p799",p:"R$ 7,99",c:2200},{id:"p1499",p:"R$ 14,99",c:4500},{id:"p2499",p:"R$ 24,99",c:8000},{id:"p3999",p:"R$ 39,99",c:15000},{id:"p5999",p:"R$ 59,99",c:25000},{id:"p8990",p:"R$ 89,90",c:40000}];
const TIER_EPICO=5,TIER_MITICO=7;
/* bônus de R$ 1,50 já resgatado? A.p150 guarda o uid da conta (ou "local" sem login); a nuvem guarda p150:true no save da conta */
const p150Done=()=>!!A.p150&&(!fbUser||A.p150==="local"||A.p150===fbUser.uid);
async function firstP150(){
 if(p150Done())return false;
 if(fbDb&&fbUser&&CD){try{const sn=await CD.get();if(sn.exists&&sn.data().p150){A.p150=fbUser.uid;return false}}catch(e){}}
 return true}
const cpBonusLine=c=>c.id==="p150"?(p150Done()?"Bônus Épico já resgatado":"🎁 + 1 pacote Épico (1ª compra)"):c.id==="p8990"?"🎁 + 1 pacote Mítico (toda compra)":"";
function renderCoinShop(){
 $("coinPk").innerHTML=CP.map((c,i)=>{const b=cpBonusLine(c);return `<button class="ghost cb" data-i="${i}"><b>🪙 ${nf(c.c)}</b><br>${c.p}${b?`<small class="cbb">${b}</small>`:""}</button>`}).join("")}
function renderBonusPk(){
 const bx=$("bpBox");if(!bx)return;const o=A.bonusPk||{},ks=Object.keys(o).filter(k=>o[k]>0);
 bx.hidden=!ks.length;
 bx.innerHTML=ks.length?`<h3>🎁 Pacotes bônus</h3><small class="mut">Ganhos nas compras simuladas de moedas</small>`+ks.map(k=>`<button class="main" data-bp="${k}" style="width:100%;margin-top:8px">Abrir pacote ${TN[k]} ×${o[k]}</button>`).join(""):""}
let cpSel=null,cpBusy=false;
function openCpConfirm(i){
 if(cpBusy)return;const c=CP[i];cpSel=i;
 const first=c.id==="p150"&&!p150Done();
 const bonus=first?"🎁 + 1 pacote Épico (primeira compra)":c.id==="p8990"?"🎁 + 1 pacote Mítico":"";
 $("buyBox").innerHTML=`<h3>Confirmar compra simulada</h3><div class="bq">${c.p}</div><div class="bc">🪙 ${nf(c.c)} moedas</div>${bonus?`<div class="bb">${bonus}</div>`:""}${c.id==="p150"&&!first?`<p class="bn" style="margin:6px 0 0">O bônus do pacote Épico vale só na primeira compra e já foi resgatado.</p>`:""}<p class="bn">Compra simulada — nenhuma cobrança real será realizada.</p><div class="bbtn"><button class="ghost" id="cpNo">Cancelar</button><button class="main" id="cpYes">Confirmar</button></div>`;
 $("buyOv").classList.add("on")}
function closeCp(){cpSel=null;$("buyOv").classList.remove("on")}
async function confirmCp(){
 if(cpBusy||cpSel==null)return;
 const c=CP[cpSel];cpSel=null;cpBusy=true;
 try{
  let tier=null;
  if(c.id==="p150"){if(await firstP150()){A.p150=fbUser?fbUser.uid:"local";tier=TIER_EPICO}}
  else if(c.id==="p8990")tier=TIER_MITICO;
  if(tier!=null){A.bonusPk=A.bonusPk||{};A.bonusPk[tier]=(A.bonusPk[tier]||0)+1}
  gainCoins(c.c,$("buyBox"));/* soma ao saldo, salva e atualiza a interface */
  if(c.id==="p150"&&tier!=null&&fbDb&&CD){try{CD.set({p150:true},{merge:true})}catch(e){}}
  renderCoinShop();renderBonusPk();
  toast(`✅ Compra simulada: +${nf(c.c)} 🪙`);
  $("buyBox").innerHTML=`<h3>✅ Compra simulada concluída</h3><div class="bq">+🪙 ${nf(c.c)}</div>${tier!=null?`<div class="bb">🎁 Pacote ${TN[tier]} adicionado aos seus pacotes bônus</div>`:""}<p class="bn">Nenhuma cobrança real foi realizada.</p><div class="bbtn">${tier!=null?`<button class="main" id="cpOpen" data-t="${tier}">Abrir pacote ${TN[tier]}</button>`:""}<button class="ghost" id="cpClose">Fechar</button></div>`;
 }finally{cpBusy=false}}
$("buyOv").addEventListener("click",e=>{
 if(e.target===$("buyOv")||e.target.closest("#cpNo")||e.target.closest("#cpClose"))return closeCp();
 if(e.target.closest("#cpYes"))return confirmCp();
 const o=e.target.closest("#cpOpen");if(o){const t=+o.dataset.t;closeCp();buy(t,"b")}});
$("coinPk").onclick=e=>{const b=e.target.closest("button[data-i]");if(b)openCpConfirm(+b.dataset.i)};
$("bpBox").onclick=e=>{const b=e.target.closest("button[data-bp]");if(b)buy(+b.dataset.bp,"b")};
$("adBtn").onclick=()=>{let n=5;const x=$("adX");$("ad").classList.add("on");x.disabled=true;
 const f=()=>{if(n>0){x.textContent=`Recompensa em ${n}s`;n--;setTimeout(f,1000)}else{x.disabled=false;x.textContent="Resgatar +100 🪙"}};f();
 x.onclick=()=>{gainCoins(100,x);$("ad").classList.remove("on");toast("+100 🪙")}};
