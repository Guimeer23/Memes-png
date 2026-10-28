/* Módulo extraído de js/album.js para facilitar manutenção. Ordem definida em js/album.js. */
async function initMarket(){
  const ok=initFirebase();
  if(ok)loadStats();
  if(!ok){
    $("mkMsg").textContent="⚙️ Troca online desativada: configure FIREBASE_CONFIG no código para ativar.";
    try{tradeUI()}catch(e){}return;
  }
  fbAuth.onAuthStateChanged(async u=>{
    fbUser=u;
    updateLoginUI();
    if(u){
      wrapFirestore();
      ME=u.uid;canW=true;
      await cloudInit();
      try{
        DB.collection("secrets").onSnapshot(s=>{s.docs.forEach(d=>{SEC[d.id]=d.data().taken||0});render()},()=>{});
        fbDb.collection("tables").onSnapshot(s=>{tbSnap=s.docs;tbSync()},()=>{});
        DB.collection("market").onSnapshot(s=>{
          MK=s.docs.map(d=>({id:d.id,...d.data()}));
          try{renderMarket()}catch(e){}
          MK.filter(l=>l.seller==ME&&l.st=="done").forEach(collect);negSync()
        },e=>{$("mkMsg").textContent="Conexão com o mercado perdida. Recarregue a página."});
      }catch(e){console.warn(e)}
      if(!$("pgRank").hidden)try{openRanking()}catch(e){}
    }else{
      DB=null;USER=null;ME=null;canW=false;MK=[];CD=null;
      setCloud("off");
      try{renderMarket()}catch(e){}
      try{tradeUI()}catch(e){}
      try{renderProfile()}catch(e){}
      closeRanking();
    }
    try{tradeUI()}catch(e){}
    try{renderProfile()}catch(e){}
  });
}
function tradeUI(){
  if(tsel&&(A.owned[tsel]||0)<2)tsel=null;
  document.querySelectorAll("#invDup .mini").forEach(m=>m.classList.toggle("sel",+m.dataset.id==tsel));
  $("nDup").textContent=`(${S.reduce((a,s)=>a+Math.max(0,(A.owned[s.id]||0)-1),0)}) · toque para anunciar`;
  $("tForm").hidden=!tsel;
  if(storeArm&&storeArm!==tsel)storeArm=null;
  if(tsel){const s=S[tsel-1];$("tSel").textContent=`${s.e} ${s.n} #${s.id} · ${TN[s.t]}`;tradeRefs(s)}
  ["tSell","tSwap"].forEach(i=>$(i).disabled=!DB||!canW);
}
$("invDup").onclick=e=>{const m=e.target.closest(".mini");if(!m)return;const id=+m.dataset.id;tsel=tsel==id?null:id;tradeUI()};
let storeArm=null,storeVal=0,storeTm=0;
function tradeRefs(s){
 const pi=priceInfo(s),ref=pi.total,bs=bandsOf(ref);
 $("tRef").innerHTML=`<div class="refBox"><div class="refTop"><span>Preço de referência</span><b>🪙 ${nf(ref)}</b></div>
  <small>Base da raridade ${nf(pi.base)}${pi.ok?` + escassez ${nf(pi.extra)}`:" · sem dados de escassez ainda (usando só a base)"}</small>
  <div class="bands">${bs.map(x=>`<button type="button" class="band" data-v="${Math.round((x.lo+x.hi)/2)}" style="--c:${x.c}"><b>${x.n}</b><span>${nf(x.lo)} – ${nf(x.hi)}</span></button>`).join("")}</div>
  <small>Faixas são só uma orientação: você define o preço que quiser. Toque numa faixa para preencher o campo.</small></div>`;
 $("tPrice").placeholder=`Preço pedido em 🪙 (referência ${nf(ref)})`;
 updPriceNote();updSwapRef();storeBtn();
}
function updPriceNote(){if(!tsel){$("tPriceNote").textContent="";return}$("tPriceNote").textContent=priceNote(+$("tPrice").value,refPrice(S[tsel-1]))}
function updSwapRef(){
 if(!tsel){$("tSwapRef").textContent="";return}
 const s=S[tsel-1],r1=refPrice(s),w=Math.floor(+$("tWant").value)||0;
 let t=`Você oferece #${s.id} ${s.n} · ref. 🪙 ${nf(r1)}`;
 if(w>=1&&w<=S.length&&w!=s.id){const q=S[w-1],r2=refPrice(q),d=r2-r1;t+=` · você quer #${q.id} ${q.n} · ref. 🪙 ${nf(r2)} (${d>0?"+":d<0?"−":"±"}${nf(Math.abs(d))})`}
 else t+=" · sem nº pedido: qualquer repetida serve";
 $("tSwapRef").textContent=t}
function storeBtn(){
 if(!tsel)return;const s=S[tsel-1],armed=storeArm===tsel,v=armed?storeVal:autoPrice(s);
 $("tStore").classList.toggle("armed",armed);
 $("tStore").textContent=armed?`✅ Toque para confirmar: receber ${nf(v)} 🪙`:`Vender ao jogo agora · +${nf(v)} 🪙 (50% de ${nf(refPrice(s))})`}
$("tRef").onclick=e=>{const b=e.target.closest(".band");if(!b)return;$("tPrice").value=b.dataset.v;updPriceNote()};
$("tPrice").oninput=updPriceNote;$("tWant").oninput=updSwapRef;
$("tStore").onclick=()=>{
 if(!tsel)return;const id=tsel,s=S[id-1];
 if((A.owned[id]||0)<2){tradeUI();return toast("Você precisa ficar com pelo menos 1 cópia")}
 if(storeArm!==id){storeArm=id;storeVal=autoPrice(s);storeBtn();clearTimeout(storeTm);storeTm=setTimeout(()=>{storeArm=null;storeBtn()},4000);return toast(`Venda automática: toque de novo para receber ${nf(storeVal)} 🪙`)}
 const v=storeVal;storeArm=null;clearTimeout(storeTm);
 A.owned[id]--;mission("sell");toast(`🏪 Vendida ao jogo: +${nf(v)} 🪙`);gainCoins(v,$("tStore"));tradeUI()};
$("tSell").onclick=()=>postL("sell");$("tSwap").onclick=()=>postL("swap");
async function postL(kind){
  const s=tsel;if(!s||(A.owned[s]||0)<2||!DB)return;
  const price=Math.floor(+$("tPrice").value),want=Math.floor(+$("tWant").value)||0;
  if(kind=="sell"&&!(price>=1&&price<=999999))return toast("Defina um preço de 1 a 999999");
  if(kind=="swap"&&want&&(want<1||want>S.length||want==s))return toast("Número da carta inválido");
  if(MK.filter(l=>l.seller==ME&&l.st=="open").length>=10)return toast("Máximo de 10 anúncios abertos");
  A.owned[s]--;save();
  try{await DB.collection("market").add({seller:ME,sid:s,kind,price:kind=="sell"?price:0,want:kind=="swap"?want:0,st:"open",at:Date.now()});
    tsel=null;render();toast("Anúncio publicado!")}
  catch(e){A.owned[s]++;save();render();toast("Não foi possível anunciar")}}
async function buyL(id,give){
  const l=MK.find(x=>x.id==id);if(!l||l.st!="open"||l.seller==ME||!DB)return;
  if(l.kind=="sell"&&A.coins<l.price)return toast("Moedas insuficientes");
  const ref=DB.doc("market/"+id);
  try{
    const sn0=await ref.get();
    if(!sn0.exists||sn0.data().st!="open")return toast("Essa oferta não está mais disponível");
    await ref.update({st:"done",buyer:ME,give:l.kind=="swap"?give:0});
    if(l.kind=="sell")A.coins-=l.price;else A.owned[give]--;
    A.owned[l.sid]=(A.owned[l.sid]||0)+1;A.trades=(A.trades||0)+1;save();render();toast("Negócio fechado! ✔")
  }catch(e){toast("Erro ao negociar, tente de novo")}}
async function cancelL(id){
  const ref=DB.doc("market/"+id);
  try{
    const sn=await ref.get();if(!sn.exists||sn.data().st!="open")return toast("Já foi negociada!");
    const d=sn.data();await ref.delete();A.owned[d.sid]=(A.owned[d.sid]||0)+1;save();render();toast("Anúncio cancelado")
  }catch(e){toast("Erro ao cancelar")}}
async function collect(l){
  if(busyC[l.id])return;busyC[l.id]=1;const ref=DB.doc("market/"+l.id);
  try{
    const sn=await ref.get();if(!sn.exists||sn.data().st!="done")return;
    const d=sn.data();await ref.delete();
    if(d.kind=="sell"){gainCoins(d.price,null);toast(`Vendeu ${S[d.sid-1].n}: +${d.price} 🪙`)}
    else{A.owned[d.give]=(A.owned[d.give]||0)+1;toast(`Troca feita: recebeu ${S[d.give-1].n}`)}
    save();render()
  }catch(e){delete busyC[l.id]}}
async function renderMarket(){try{negRender();tbUI()}catch(e){}
  if(!DB||!fbUser){$("mkList").innerHTML=`<p class="mut">Entre com Google para acessar o mercado.</p>`;return}
  const list=MK.filter(l=>l.st=="open"&&(tfilter=="mine"?l.seller==ME:l.seller!=ME&&l.kind==tfilter)).sort((a,b)=>tfilter=="sell"?a.price-b.price:b.at-a.at);
  let ps={};try{ps=await USER.profiles([...new Set(list.map(l=>l.seller))])||{}}catch(e){}
  $("mkList").innerHTML=list.map(l=>{const s=S[l.sid-1],mine=l.seller==ME,nm=esc((ps[l.seller]&&ps[l.seller].name)||"Jogador");
    const a=mine?"cancel":l.kind=="sell"?"buy":"swap";
    const dis=(a=="buy"&&(negAct(l)||A.coins<1))||!canW?"disabled":"";
    return `<div class="ls">${mini(s,1)}<div class="li"><b>${s.n}</b><small>#${s.id} · ${TN[s.t]}</small><small>${mine?"Seu anúncio":"por "+nm}</small><div>${l.kind=="sell"?`🪙 <b>${nf(l.price)}</b>`:`🔁 quer ${l.want?`#${l.want} ${S[l.want-1].n}`:"qualquer repetida"}`}</div><small class="refl">${l.kind=="sell"?`ref. 🪙 ${nf(refPrice(s))} · ${priceNote(l.price,refPrice(s))}`:`oferece ref. 🪙 ${nf(refPrice(s))}${l.want&&S[l.want-1]?` · pede ref. 🪙 ${nf(refPrice(S[l.want-1]))}`:""}`}</small></div><button class="main" data-l="${l.id}" data-a="${a}" ${dis}>${mine?"Cancelar":a=="buy"?(negAct(l)?"Em negociação":"Solicitar compra"):"Trocar"}</button></div>`}).join("")||`<p class="mut">Nenhuma oferta aqui ainda.</p>`;
  document.querySelectorAll("#tf button").forEach(b=>b.classList.toggle("on",b.dataset.f==tfilter))}
$("tf").onclick=e=>{const b=e.target.closest("button");if(b){tfilter=b.dataset.f;renderMarket()}};
$("mkList").onclick=e=>{const b=e.target.closest("button[data-l]");if(!b)return;const l=MK.find(x=>x.id==b.dataset.l);if(!l)return;
 if(b.dataset.a=="cancel")cancelL(l.id);else if(b.dataset.a=="buy")reqDlg(l);else{
  const el=S.filter(s=>(A.owned[s.id]||0)>1&&(!l.want||s.id==l.want));
  if(!el.length)return toast(l.want?`Você precisa de uma #${l.want} repetida`:"Você não tem repetidas");
  pend=l.id;$("tgive").innerHTML=`<p class="mut">Escolha a repetida que vai entregar (a oferta vale ref. 🪙 ${nf(refPrice(S[l.sid-1]))}; o valor é só orientação, a troca é livre):</p><div class="inv">${el.map(s=>`<div class="gv">${mini(s,A.owned[s.id]-1)}<small>ref. 🪙 ${nf(refPrice(s))}</small></div>`).join("")}</div><button class="ghost" id="tgx">cancelar</button>`}};
$("tgive").onclick=e=>{if(e.target.id=="tgx"){$("tgive").innerHTML="";pend=null;return}
 const m=e.target.closest(".mini");if(m&&pend){const id=pend;pend=null;$("tgive").innerHTML="";buyL(id,+m.dataset.id)}};

/* ===== v1.45: negociação de compras (aprovação + contraproposta) e mesas de troca ===== */
const NEG_EXP=36e5,fin={},tried={},NK={};let negInit=0;
const negAct=l=>l.neg&&["pending","counter","agreed"].includes(l.neg.st)&&l.neg.exp>Date.now();
const errT=e=>toast(e==="gone"?"Anúncio não está mais disponível":typeof e=="string"?e:"Erro, tente de novo");
async function mtx(id,fn){const ref=fbDb.doc("market/"+id);
 return fbDb.runTransaction(async tx=>{const sn=await tx.get(ref);if(!sn.exists)throw"gone";const u=fn(sn.data());if(u)tx.update(ref,u);return sn.data()})}
function dlgTo(el,h){const d=$(el);d.innerHTML=h?`<div class="box" style="max-width:380px;margin:30px auto">${h}</div>`:"";d.hidden=!h}
function askP(title,id,cur,mode){
 dlgTo("negDlg",`<h3>${title}</h3><p>Preço atual da negociação: <b>🪙 ${nf(cur)}</b></p><div class="row"><input id="ndP" type="number" min="1" max="999999" value="${cur}"></div><p class="mut">Preço total: 🪙 <b id="ndT">${nf(cur)}</b> · seu saldo 🪙 ${nf(A.coins)}<br>Nada é cobrado agora: só após o acordo e a validação final.</p><div class="row"><button class="ghost" id="ndX">Cancelar</button><button class="main" id="ndOk">Confirmar e enviar</button></div>`);
 $("ndP").oninput=()=>$("ndT").textContent=nf(+$("ndP").value||0);
 $("ndX").onclick=()=>dlgTo("negDlg","");
 $("ndOk").onclick=()=>{const p=Math.floor(+$("ndP").value);dlgTo("negDlg","");mode=="req"?negReq(id,p):negAns(id,"counter",p)}}
function reqDlg(l){if(negAct(l))return toast("Já há uma negociação em andamento nesta carta");askP(`Solicitar compra: ${S[l.sid-1].n} (anunciada por 🪙 ${nf(l.price)})`,l.id,l.price,"req")}
async function negReq(id,p){
 if(!(p>=1&&p<=999999))return toast("Preço de 1 a 999999");
 if(A.coins<p)return toast("Moedas insuficientes");
 try{await mtx(id,d=>{if(d.st!="open"||d.kind!="sell")throw"Anúncio não está mais disponível";if(d.seller==ME)throw"Este anúncio é seu";
  if(negAct({neg:d.neg}))throw"Já há uma negociação em andamento nesta carta";
  return{neg:{b:ME,bn:fbUser.displayName||"Jogador",p,turn:"s",st:"pending",exp:Date.now()+NEG_EXP,at:Date.now()}}});toast("Solicitação enviada ✔")}catch(e){errT(e)}}
async function negAns(id,act,p){
 if(act=="buyerOk")return finalize(id,true);
 if(act=="finish")return finalize(id,false);
 try{await mtx(id,d=>{const n=d.neg;
  if(act=="clear"){if(d.seller!=ME&&(!n||n.b!=ME))throw"Sem permissão";return{neg:null}}
  if(!negAct({neg:n}))throw"Negociação expirada ou encerrada";
  const isS=d.seller==ME,isB=n.b==ME;if(!isS&&!isB)throw"Sem permissão";
  if(act=="cancel")return{neg:{...n,st:"cancelled",turn:null}};
  if(n.st=="agreed")throw"Já foi aceita";
  if((n.turn=="s")!=isS)throw"Aguarde a resposta da outra parte";
  if(act=="refuse")return{neg:{...n,st:"refused",turn:null}};
  if(act=="accept"&&isS)return{neg:{...n,st:"agreed",turn:"b",exp:Date.now()+NEG_EXP}};
  if(act=="counter"){if(!(p>=1&&p<=999999))throw"Preço inválido";return{neg:{...n,p,st:"counter",turn:isS?"b":"s",exp:Date.now()+NEG_EXP}}}
  throw"Ação inválida"})}catch(e){errT(e)}}
async function finalize(id,acc){
 if(fin[id])return;fin[id]=1;
 try{let price=0,sid=0;
  await mtx(id,d=>{const n=d.neg;if(d.st!="open"||!n||!negAct({neg:n})||n.b!=ME)throw"Negociação não está mais válida";
   if(!(n.st=="agreed"||(acc&&n.st=="counter"&&n.turn=="b")))throw"Ainda não há acordo";
   if(A.coins<n.p)throw"Saldo insuficiente para concluir";
   price=n.p;sid=d.sid;return{st:"done",buyer:ME,price:n.p,neg:{...n,st:"done",turn:null}}});
  A.coins-=price;A.owned[sid]=(A.owned[sid]||0)+1;A.trades=(A.trades||0)+1;save();render();toast(`Compra concluída por ${nf(price)} 🪙 ✔`)
 }catch(e){errT(e)}finally{setTimeout(()=>delete fin[id],3000)}}
async function cancelL(id){const ref=fbDb.doc("market/"+id);
 try{const d=await fbDb.runTransaction(async tx=>{const sn=await tx.get(ref);if(!sn.exists||sn.data().st!="open")throw"Já foi negociada!";tx.delete(ref);return sn.data()});
  A.owned[d.sid]=(A.owned[d.sid]||0)+1;save();render();toast("Anúncio cancelado")}catch(e){errT(e)}}
function negLbl(l){const n=l.neg,r=n.st;if(r=="refused")return"Recusada";if(r=="cancelled")return"Cancelada";if(r=="done")return"Concluída";
 if(n.exp<=Date.now())return"Expirada";if(r=="agreed")return"Aceita";
 if(r=="pending")return"Pendente";return (n.turn=="s")==(l.seller==ME)?"Contraproposta recebida":"Contraproposta enviada — aguardando resposta"}
function negRender(){const el=$("negList");if(!el)return;
 const L=MK.filter(l=>l.neg&&(l.seller==ME||l.neg.b==ME)&&l.neg.st!="done");
 el.innerHTML=L.map(l=>{const n=l.neg,s=S[l.sid-1],isS=l.seller==ME,act=negAct(l),mine=act&&n.st!="agreed"&&(n.turn=="s")==isS,B=(a,t,c)=>`<button class="${c||"ghost"}" data-ng="${a}" data-id="${l.id}">${t}</button>`;
  const btn=!act?B("clear","Limpar"):n.st=="agreed"?(isS?"Aguardando o comprador concluir":B("finish","Concluir compra","main"))+B("cancel","Cancelar"):mine?(isS?B("accept","Aceitar","main"):B("buyerOk","Aceitar","main"))+B("counter","Contraproposta")+B("refuse","Recusar"):B("cancel","Cancelar");
  return `<div class="ls">${mini(s,1)}<div class="li"><b>${s.n}</b><small>${isS?"Comprador: "+esc(n.bn||"Jogador"):"Você é o comprador"} · anunciada 🪙 ${nf(l.price)}</small><div>Preço atual: 🪙 <b>${nf(n.p)}</b>${n.st=="agreed"?" (valor final acordado)":""}</div><small><b>${negLbl(l)}</b></small><div class="row">${btn}</div></div></div>`}).join("")||`<p class="mut">Nenhuma negociação.</p>`}
$("negList").onclick=e=>{const b=e.target.closest("button[data-ng]");if(!b)return;const l=MK.find(x=>x.id==b.dataset.id);if(!l)return;
 if(b.dataset.ng=="counter")askP("Contraproposta",l.id,l.neg.p,"counter");else negAns(l.id,b.dataset.ng)};
function negSync(){
 MK.forEach(l=>{const n=l.neg;if(!n||(l.seller!=ME&&n.b!=ME))return;const k=l.id,sig=n.st+n.p+n.turn+n.at,old=NK[k];NK[k]=sig;
  if(negInit&&old!==sig&&negAct(l)){const isS=l.seller==ME,nm=S[l.sid-1].n;
   if(isS&&n.st=="pending")toast(`💬 ${n.bn||"Jogador"} quer comprar ${nm} por ${nf(n.p)} 🪙`);
   else if(n.st=="counter"&&(n.turn=="s")==isS)toast(`💬 Contraproposta em ${nm}: ${nf(n.p)} 🪙`);
   else if(n.st=="agreed"&&!isS)toast(`✅ Vendedor aceitou ${nf(n.p)} 🪙 por ${nm}`)}
  if(negInit&&old!==undefined&&old!==sig&&["refused","cancelled"].includes(n.st))toast(`Negociação de ${S[l.sid-1].n}: ${n.st=="refused"?"recusada":"cancelada"}`);
  if(n.b==ME&&n.st=="agreed"&&negAct(l)&&!tried[l.id+n.exp]){tried[l.id+n.exp]=1;finalize(l.id,false)}});
 Object.keys(NK).forEach(k=>{if(!MK.find(l=>l.id==k)){if(negInit)toast("Um anúncio em negociação foi concluído ou retirado");delete NK[k]}});
 negInit=1;negRender()}

/* ----- mesas de troca ----- */
const TBN=6,tbCol=()=>fbDb.collection("tables");let TB={},mySeat=null,claimed={},cdTm=0;
const tbRef=i=>fbDb.doc("tables/t"+i),TBS=Date.now();
const sideOf=d=>d.a==ME?"a":d.b==ME?"b":null;
async function ttx(i,fn){return fbDb.runTransaction(async tx=>{const ref=tbRef(i),sn=await tx.get(ref);if(!sn.exists)throw"Mesa indisponível";const u=fn(sn.data());if(u)tx.update(ref,u);return sn.data()})}
async function sit(i){if(mySeat)return toast("Você já está sentado em uma mesa");
 try{await fbDb.runTransaction(async tx=>{const ref=tbRef(i),sn=await tx.get(ref),d=sn.exists?sn.data():{},now=Date.now(),me={u:ME,n:fbUser.displayName||"Jogador",h:now};
  const live=[{u:d.a,n:d.an,h:d.ha},{u:d.b,n:d.bn,h:d.hb}].filter(x=>x.u&&now-(x.h||0)<6e4);
  if(d.st=="done")throw"Mesa finalizando, tente em instantes";
  if(live.some(x=>x.u==ME)||live.length>1)throw"Mesa ocupada";
  const base={oa:0,ob:0,ca:false,cb:false,go:0};
  tx.set(ref,live.length?{a:live[0].u,an:live[0].n,ha:live[0].h,b:ME,bn:me.n,hb:now,st:"trading",...base}:{a:ME,an:me.n,ha:now,b:null,st:"waiting",...base})});
  mySeat=i;toast("Você sentou. Pode navegar livremente.");tbUI()}catch(e){errT(e)}}
async function leave(){const i=mySeat;if(!i)return;mySeat=null;
 try{await fbDb.runTransaction(async tx=>{const ref=tbRef(i),sn=await tx.get(ref);if(!sn.exists)return;const d=sn.data();if(d.st=="done"||!sideOf(d))return;
  const o=d.a==ME?{u:d.b,n:d.bn,h:d.hb}:{u:d.a,n:d.an,h:d.ha};
  tx.set(ref,o.u?{a:o.u,an:o.n,ha:o.h,b:null,st:"waiting",oa:0,ob:0,ca:false,cb:false,go:0}:{a:null,b:null,st:"free"})})}catch(e){}
 dlgTo("tbDlg","");tbUI()}
setInterval(()=>{const d=mySeat&&TB[mySeat];if(d&&fbDb){const s=sideOf(d);if(s)fbDb.doc("tables/t"+mySeat).update({["h"+s]:Date.now()}).catch(()=>{})}},2e4);
addEventListener("pagehide",()=>{try{leave()}catch(e){}});
function tbOffer(c){const i=mySeat;if(!i||(A.owned[c]||0)<2)return toast("Você precisa de uma cópia repetida");
 ttx(i,d=>{const s=sideOf(d);if(!s||d.st!="trading")throw"Troca não está ativa";return{["o"+s]:c,ca:false,cb:false,go:0}}).catch(errT)}
function tbConf(on){const i=mySeat;if(!i)return;
 ttx(i,d=>{const s=sideOf(d);if(!s||d.st!="trading")throw"Troca não está ativa";
  if(on){if(!d.oa||!d.ob)throw"Os dois precisam escolher uma carta";if((A.owned[d["o"+s]]||0)<2)throw"Você não tem mais essa repetida";
   const o=s=="a"?"cb":"ca";return{["c"+s]:true,go:d[o]?Date.now():0}}
  return{["c"+s]:false,go:0}}).catch(errT)}
async function tbDone(i){
 try{await ttx(i,d=>{if(d.st!="trading"||!d.ca||!d.cb||!d.go||Date.now()-d.go<3000)throw"x";
  if((A.owned[d["o"+sideOf(d)]]||0)<2)throw"Você não tem mais essa repetida";return{st:"done",ka:false,kb:false}})}catch(e){if(e!=="x"&&typeof e=="string")toast(e)}}
async function tbClaim(i,d){const s=sideOf(d);if(!s||d["k"+s]||claimed[i+d.go])return;claimed[i+d.go]=1;
 const give=d["o"+s],get=d[s=="a"?"ob":"oa"];
 try{await ttx(i,x=>{if(x.st!="done"||x["k"+s])throw"x";const both=x[s=="a"?"kb":"ka"];
  return both?{st:"free",a:null,b:null,an:null,bn:null,oa:0,ob:0,ca:false,cb:false,go:0,ka:false,kb:false}:{["k"+s]:true}});
  A.owned[give]=Math.max(0,(A.owned[give]||0)-1);A.owned[get]=(A.owned[get]||0)+1;A.trades=(A.trades||0)+1;mySeat=null;save();render();dlgTo("tbDlg","");toast(`Troca concluída: recebeu ${S[get-1].n} ✔`);tbUI()
 }catch(e){}}
function tbSync(){
 TB={};tbSnap.forEach(x=>TB[x.id.slice(1)]=x.data());
 let seat=null;for(const i in TB){const d=TB[i];if(sideOf(d)&&d.st!="free"){seat=i;if(d.st=="done")tbClaim(i,d)}}
 if(mySeat&&!seat&&Date.now()-TBS>0)mySeat=null;if(seat)mySeat=seat;tbUI()}
let tbSnap=[];
function tbUI(){const el=$("tbList");if(!el)return;
 if(!fbDb||!ME){el.innerHTML=`<p class="mut">Entre com Google para usar as mesas.</p>`;return}
 el.innerHTML=Array.from({length:TBN},(_,k)=>{const i=k+1,d=TB[i]||{st:"free"},now=Date.now(),mine=mySeat==i,
  n=[d.a&&now-(d.ha||0)<6e4&&d.an,d.b&&now-(d.hb||0)<6e4&&d.bn].filter(Boolean).map(esc).join(" e ");
  const stt=d.st=="trading"?"🤝 Em troca":n?"🪑 1 jogador aguardando":"✅ Livre";
  return `<div class="ls"><div class="li"><b>Mesa ${i}</b><small>${stt}${n?" · "+n:""}</small></div>${mine?`<button class="ghost" data-tb="leave">Sair</button>`:`<button class="main" data-tb="${i}" ${mySeat||d.st=="trading"||d.st=="done"?"disabled":""}>Sentar</button>`}</div>`}).join("");
 const d=mySeat&&TB[mySeat];
 if(!d||d.st!="trading"||!sideOf(d)){dlgTo("tbDlg","");clearInterval(cdTm);return}
 const s=sideOf(d),o=s=="a"?"b":"a",om=d[o+"n"==="bn"?"bn":"an"],my=d["o"+s],ot=d["o"+o],mc=d["c"+s],oc=d["c"+o],dups=S.filter(x=>(A.owned[x.id]||0)>1);
 dlgTo("tbDlg",`<h3>🤝 Troca com ${esc(s=="a"?d.bn:d.an)}</h3><p class="mut">A troca só conclui com as duas confirmações e 3 s de contagem. Sair cancela sem transferir nada.</p>
 <b>Sua oferta:</b> ${my?mini(S[my-1],1)+" "+S[my-1].n:"—"}<br><b>Oferta dele(a):</b> ${ot?mini(S[ot-1],1)+" "+S[ot-1].n:"aguardando…"}
 <p>Você: ${mc?"✅ confirmou":"⏳"} · Outro: ${oc?"✅ confirmou":"⏳"}</p><div id="cdN" style="font-size:1.6rem;font-weight:800"></div>
 <div class="inv" id="tbInv">${dups.map(x=>`<div data-c="${x.id}" class="${x.id==my?"sel":""}">${mini(x,A.owned[x.id]-1)}</div>`).join("")||"<span class=mut>Sem repetidas</span>"}</div>
 <div class="row"><button class="ghost" data-tb="leave">Cancelar troca</button>${mc?`<button class="ghost" data-tb="unc">Desfazer confirmação</button>`:`<button class="main" data-tb="conf">Confirmar oferta</button>`}</div>`);
 clearInterval(cdTm);if(d.ca&&d.cb&&d.go){const tick=()=>{const r=3-(Date.now()-d.go)/1e3,e=$("cdN");if(e)e.textContent=r>0?`Concluindo em ${Math.ceil(r)}…`:"Validando…";if(r<=0){clearInterval(cdTm);tbDone(mySeat)}};tick();cdTm=setInterval(tick,250)}}
document.addEventListener("click",e=>{const b=e.target.closest("[data-tb]"),c=e.target.closest("#tbInv [data-c]");
 if(c)return tbOffer(+c.dataset.c);if(!b)return;const a=b.dataset.tb;
 a=="leave"?leave():a=="conf"?tbConf(true):a=="unc"?tbConf(false):sit(+a)});

const SCH=[.0004,.0006,.0009,.0013,.0018,.0025,.0035,.005,.01],KL={s:"🔒 SECRETA",e:"🎉 EVENTO"};
