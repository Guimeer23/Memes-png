/* Módulo extraído de js/album.js para facilitar manutenção. Ordem definida em js/album.js. */
/* ===== v1.41: busca de jogadores, amigos, rankings e perfil público ===== */
const REGN={BR:"🇧🇷 Brasil",AR:"🇦🇷 Argentina",PT:"🇵🇹 Portugal",AM:"🌎 Américas",EU:"🇪🇺 Europa",AS:"🌏 Ásia",AF:"🌍 África",OC:"🌏 Oceania",XX:"🌐 Outros"};
const pidOf=u=>String(u||"").slice(0,8).toUpperCase();
const FR=()=>{if(!Array.isArray(A.friends))A.friends=[];return A.friends};
const isFr=u=>FR().includes(u);
const normT=t=>String(t||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const avImg=(src,cls)=>src?`<img class="${cls}" src="${esc(src)}" referrerpolicy="no-referrer" alt="" onerror="this.style.visibility='hidden'">`:`<div class="${cls}"></div>`;
const selosHtml=ids=>(ids||[]).map(id=>{const s=SELOS.find(x=>x.id===id);return s?s.e:""}).join(" ");
let pvUid=null;

function copyText(t){
  const ok=()=>toast("📋 ID copiado: "+t);
  const fb=()=>{const i=document.createElement("textarea");i.value=t;i.style.cssText="position:fixed;opacity:0";document.body.appendChild(i);i.select();try{document.execCommand("copy");ok()}catch(e){toast("ID: "+t)}i.remove()};
  try{navigator.clipboard.writeText(t).then(ok,fb)}catch(e){fb()}
}

/* dados de um jogador: o próprio (ao vivo) ou da lista carregada do ranking */
function playerData(uid){
  if(uid&&uid===ME&&fbUser){
    const p=A.pasted||{};
    return{uid,name:fbUser.displayName||"Você",photo:fbUser.photoURL||"",bio:A.bio||"",title:A.title||"",selos:A.selos||[],region:detectRegion(),
      score:calcMyScore(),pastedCount:Object.keys(p).length,pasted:p,conq:A.conq||{},packs:A.packsOpened||0,trades:A.trades||0};
  }
  return rkRows.find(r=>r.uid===uid)||null;
}
function rankPos(r){
  const g=rkRows.findIndex(x=>x.uid===r.uid)+1;
  const reg=rkRows.filter(x=>x.region===r.region);
  return{g,rg:reg.findIndex(x=>x.uid===r.uid)+1};
}

/* ---- amigos ---- */
/* Solicitações de amizade no Firestore; não adiciona ninguém sem aceite. */
let socialRequests=[],socialUnsubs=[],socialTab="friends",socialBusy=false;
const socialRef=()=>fbDb.collection("friendRequests");
const socialDocId=(from,to)=>String(from)+"__"+String(to);
function socialUser(uid){return rkRows.find(r=>r.uid===uid)||{uid,name:"Jogador",photo:"",score:0,pastedCount:0};}
function socialEscBtn(uid,label,attr,extra=""){return `<button class="ghost" ${attr}="${esc(uid)}" ${extra}>${label}</button>`;}
function socialRender(){
 const list=$("socialList"),status=$("socialStatus"),count=$("socialReceivedN");
 if(!list||!status)return;
 const incoming=socialRequests.filter(x=>x.to===ME&&x.status==="pending");
 if(count)count.textContent=String(incoming.length);
 if(!fbUser||!ME){status.textContent="Entre com Google para gerenciar amizades.";list.innerHTML="";return;}
 status.textContent=socialTab==="friends"?"Amigos aceitos":socialTab==="received"?"Solicitações que aguardam sua resposta":"Solicitações enviadas";
 if(socialTab==="friends"){
   const ids=FR();
   const rows=ids.map(uid=>socialUser(uid));
   list.innerHTML=rows.length?rows.map(r=>`<div class="socialRow">${avImg(r.photo,"av")}<div class="socialWho"><b>${esc(r.name||"Jogador")}</b><small>ID ${pidOf(r.uid)}</small></div>${socialEscBtn(r.uid,"Ver perfil","data-social-profile")}${socialEscBtn(r.uid,"Remover","data-social-remove")}</div>`).join(""):'<p class="rkEmpty">Você ainda não tem amigos. Busque um jogador no ranking e envie uma solicitação.</p>';
 }else{
   const rows=socialRequests.filter(x=>socialTab==="received"?x.to===ME&&x.status==="pending":x.from===ME&&x.status==="pending");
   list.innerHTML=rows.length?rows.map(x=>{const uid=socialTab==="received"?x.from:x.to,r=socialUser(uid);return `<div class="socialRow">${avImg(r.photo,"av")}<div class="socialWho"><b>${esc(r.name||x.fromName||"Jogador")}</b><small>ID ${pidOf(uid)} · aguardando resposta</small></div>${socialEscBtn(uid,"Ver perfil","data-social-profile")}${socialTab==="received"?socialEscBtn(x.id,"Aceitar","data-social-accept"):""}${socialEscBtn(x.id,"Recusar / cancelar","data-social-decline")}</div>`}).join(""):'<p class="rkEmpty">Nenhuma solicitação pendente.</p>';
 }
}
function socialWatch(){
 socialUnsubs.forEach(fn=>{try{fn()}catch(e){}});socialUnsubs=[];
 if(!fbDb||!fbUser||!ME)return;
 const mergeSnap=sn=>{const map=new Map(socialRequests.map(x=>[x.id,x]));sn.docs.forEach(d=>map.set(d.id,{id:d.id,...d.data()}));socialRequests=[...map.values()].filter(x=>x.from===ME||x.to===ME);socialSyncAccepted();socialRender();renderSearch();renderPlayer();};
 try{
  socialUnsubs.push(socialRef().where("from","==",ME).onSnapshot(mergeSnap,e=>{console.warn("Solicitações enviadas:",e);$("socialStatus").textContent="Não foi possível ler solicitações. Verifique as regras do Firestore.";}));
  socialUnsubs.push(socialRef().where("to","==",ME).onSnapshot(mergeSnap,e=>{console.warn("Solicitações recebidas:",e);$("socialStatus").textContent="Não foi possível ler solicitações. Verifique as regras do Firestore.";}));
 }catch(e){console.warn(e);$("socialStatus").textContent="Firebase não permite acessar as solicitações. Configure as regras da coleção friendRequests.";}
}
async function toggleFriend(u){
 if(!fbUser||!ME)return toast("Entre com Google para adicionar amigos");
 if(u===ME)return toast("Esse é você 😄");
 if(isFr(u)){
   if(!confirm("Remover este jogador dos seus amigos?"))return;
   const f=FR(),i=f.indexOf(u);if(i>=0)f.splice(i,1);
   save();socialRender();renderRanking();renderPlayer();return toast("Amigo removido");
 }
 if(socialRequests.some(x=>x.from===ME&&x.to===u&&x.status==="pending"))return toast("Solicitação já enviada");
 if(socialRequests.some(x=>x.from===u&&x.to===ME&&x.status==="pending")){socialTab="received";socialRender();return toast("Esse jogador já enviou uma solicitação para você");}
 try{
  const id=socialDocId(ME,u),ref=socialRef().doc(id),sn=await ref.get();
  if(sn.exists&&sn.data().status==="pending")return toast("Solicitação já enviada");
  await ref.set({from:ME,to:u,fromName:fbUser.displayName||"Jogador",fromPhoto:fbUser.photoURL||"",status:"pending",createdAt:Date.now(),updatedAt:Date.now()});
  toast("Solicitação de amizade enviada");socialTab="sent";socialRender();
 }catch(e){console.warn("Enviar solicitação:",e);toast("Não foi possível enviar. Verifique as permissões do Firebase.");}
}
async function socialAccept(id){
 const req=socialRequests.find(x=>x.id===id);if(!req||req.to!==ME||req.status!=="pending")return;
 if(FR().length>=100)return toast("Limite de 100 amigos");
 try{
  const ref=socialRef().doc(id);
  await fbDb.runTransaction(async tx=>{const sn=await tx.get(ref);if(!sn.exists||sn.data().status!=="pending"||sn.data().to!==ME)throw new Error("Solicitação não está mais pendente");tx.update(ref,{status:"accepted",acceptedAt:Date.now(),updatedAt:Date.now()});});
  if(!FR().includes(req.from))FR().push(req.from);
  save();
  /* O remetente receberá a atualização pelo listener e sincronizará sua própria lista. */
  toast("Amizade aceita!");socialTab="friends";socialRender();renderRanking();renderPlayer();
 }catch(e){console.warn("Aceitar solicitação:",e);toast("Não foi possível aceitar. Tente novamente.");}
}
async function socialDecline(id){
 const req=socialRequests.find(x=>x.id===id);if(!req)return;
 if(req.from!==ME&&req.to!==ME)return;
 try{await socialRef().doc(id).update({status:req.to===ME?"declined":"cancelled",updatedAt:Date.now()});toast(req.to===ME?"Solicitação recusada":"Solicitação cancelada");socialRender();}
 catch(e){console.warn(e);toast("Não foi possível atualizar a solicitação.");}
}
function socialSyncAccepted(){
 socialRequests.filter(x=>x.status==="accepted"&&(x.from===ME||x.to===ME)).forEach(x=>{
  const other=x.from===ME?x.to:x.from;
  if(!FR().includes(other)&&FR().length<100){FR().push(other);save();}
 });
}
$("socialTabs")?.addEventListener("click",e=>{const b=e.target.closest("[data-social-tab]");if(!b)return;socialTab=b.dataset.socialTab;$("socialTabs").querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));socialRender();});
$("socialList")?.addEventListener("click",e=>{
 const p=e.target.closest("[data-social-profile]"),a=e.target.closest("[data-social-accept]"),d=e.target.closest("[data-social-decline]"),rm=e.target.closest("[data-social-remove]");
 if(p)return openPlayer(p.dataset.socialProfile);
 if(a)return socialAccept(a.dataset.socialAccept);
 if(d)return socialDecline(d.dataset.socialDecline);
 if(rm){const f=FR(),i=f.indexOf(rm.dataset.socialRemove);if(i>=0)f.splice(i,1);save();socialRender();renderRanking();renderPlayer();toast("Amigo removido");}
});

/* ---- busca por nome ou ID ---- */
function rkFind(q){
  q=String(q||"").trim().replace(/^#/,"");
  if(q.length<2)return[];
  const ql=q.toLowerCase(),qn=normT(q),out=[];
  rkRows.forEach(r=>{
    const id=pidOf(r.uid).toLowerCase(),full=String(r.uid).toLowerCase(),nm=normT(r.name);
    let s=0;
    if(full===ql||id===ql)s=100;
    else if(nm===qn)s=90;
    else if(nm.startsWith(qn))s=70;
    else if(q.length>=4&&id.startsWith(ql))s=65;
    else if(nm.split(" ").some(w=>w.startsWith(qn)))s=60;
    else if(nm.includes(qn))s=40;
    if(s)out.push({r,s});
  });
  return out.sort((a,b)=>b.s-a.s||b.r.score-a.r.score).slice(0,10).map(x=>x.r);
}
function rkRowHtml(r,pos,o){
  o=o||{};
  const cat=categoriaDe(r.pastedCount),isMe=r.uid===ME,fr=isFr(r.uid);
  const full=r.name||"Anônimo",nm=o.fullName?full:full.split(" ")[0];
  const sl=selosHtml(r.selos);
  return `<div class="rkRow ${isMe?"me":""}" data-uid="${esc(r.uid)}">
    ${pos!=null?`<div class="pos">${pos}</div>`:""}
    ${avImg(r.photo,"av")}
    <div class="body">
      <div class="nm">${esc(nm)}${isMe?" (você)":""}${fr?` <span class="fr">👥</span>`:""} ${r.title?`<span class="tag">${esc(r.title)}</span>`:""}</div>
      <div class="bio">${o.showId?`ID ${pidOf(r.uid)} · `:""}${cat.e} ${cat.n}${r.bio&&!o.showId?` · "${esc(r.bio)}"`:""}</div>
      ${sl?`<div class="selos">${sl}</div>`:""}
    </div>
    <div class="sc">${r.score.toLocaleString("pt-BR")}</div>
    ${o.btn&&!isMe?`<button class="ghost fbtn ${fr?"on":""}" data-fr="${esc(r.uid)}" title="${fr?"Remover dos amigos":"Adicionar aos amigos"}">${fr?"✓":"➕"}</button>`:""}
  </div>`;
}
function renderSearch(){
  const box=$("rkRes"),q=$("rkQ").value.trim();
  if(q.length<2){box.innerHTML="";return}
  if(!fbUser){box.innerHTML=`<p class="rkEmpty">Entre com Google para buscar jogadores.</p>`;return}
  if(!rkRows.length){box.innerHTML=`<p class="rkEmpty">Carregando jogadores…</p>`;return}
  const res=rkFind(q);
  box.innerHTML=res.length
    ?`<div class="rkResHd">Resultados · toque para ver o progresso</div>`+res.map(r=>rkRowHtml(r,null,{fullName:1,showId:1,btn:1})).join("")
    :`<p class="rkEmpty">Nenhum jogador encontrado para "${esc(q)}".<br>Confira o nome ou peça o ID (aparece no perfil e no topo do ranking).</p>`;
}

/* ---- perfil público (progresso de qualquer jogador) ---- */
function openPlayer(uid){
  if(!playerData(uid))return toast("Jogador não encontrado");
  pvUid=uid;renderPlayer();$("pvOv").classList.add("on");
}
function closePlayer(){pvUid=null;const o=$("pvOv");if(o)o.classList.remove("on")}
function renderPlayer(){
  if(!pvUid)return;
  const r=playerData(pvUid);
  if(!r){closePlayer();return}
  const me=r.uid===ME,cat=categoriaDe(r.pastedCount),pct=Math.min(100,r.pastedCount/ALBN*100),p=r.pasted||{},cq=r.conq||{};
  const pos=rankPos(r),fr=isFr(r.uid);
  const rar=BY.map((arr,t)=>{
    const tot=arr.length,got=arr.filter(s=>p[s.id]).length;
    return `<div class="pvRar"><span>${TN[t]}</span><i><u style="width:${tot?got/tot*100:0}%;background:hsl(${TH[t]} 80% 50%)"></u></i><b>${got}/${tot}</b></div>`;
  }).join("");
  const hs=S.filter(s=>s.hid),gotH=hs.filter(s=>cq[s.ck]).length;
  const hid=hs.map(s=>cq[s.ck]?`<span class="on" title="${esc(s.n)}">${s.e}</span>`:`<span>❓</span>`).join("");
  const map=S.filter(s=>!s.hid).map(s=>p[s.id]?`<i style="background:hsl(${TH[s.t]} 80% 50%)"></i>`:"<i></i>").join("");
  const sl=(r.selos||[]).map(id=>SELOS.find(x=>x.id===id)).filter(Boolean).map(s=>`<span class="seloChip on"><span class="e">${s.e}</span> ${esc(s.n)}</span>`).join("");
  $("pvBox").innerHTML=`
    <div class="pvTop"><button class="ghost" id="pvClose">✕ Fechar</button></div>
    <div class="pvHead">
      ${avImg(r.photo,"pvAv")}
      <div class="pvNm">${esc(r.name||"Anônimo")}${me?" (você)":""}</div>
      ${r.title?`<div class="pvTag">🎭 ${esc(r.title)}</div>`:""}
      <div class="pvCat">${cat.e} ${cat.n} · ${REGN[r.region]||REGN.XX}</div>
      ${r.bio?`<div class="pvBio">"${esc(r.bio)}"</div>`:""}
      <div class="pvId">ID <b>${pidOf(r.uid)}</b><button class="ghost" id="pvCopy">📋 Copiar</button></div>
    </div>
    <div class="pvPos"><span>🌎 Global <b>#${pos.g||"—"}</b></span><span>${REGN[r.region]||REGN.XX} <b>#${pos.rg||"—"}</b></span></div>
    <div class="box">
      <h3>📒 Progresso do álbum <small>${r.pastedCount}/${ALBN} · ${pct.toFixed(1).replace(".",",")}%</small></h3>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="pvMap">${map}</div>
    </div>
    <div class="pvStats">
      <div><b>${r.pastedCount}</b><small>Coladas</small></div>
      <div><b>${r.score.toLocaleString("pt-BR")}</b><small>Score</small></div>
      <div><b>${r.packs||0}</b><small>Pacotes</small></div>
      <div><b>${r.trades||0}</b><small>Trocas</small></div>
    </div>
    <div class="box"><h3>💎 Por raridade</h3>${rar}</div>
    <div class="box"><h3>🔒 Secretas e eventos <small>${gotH}/${hs.length}</small></h3><div class="pvHid">${hid}</div></div>
    ${sl?`<div class="box"><h3>🎖️ Selos exibidos</h3><div class="pvSelos">${sl}</div></div>`:""}
    ${me?"":`<div style="text-align:center"><button class="main" id="pvFr" style="${fr?"background:#16a34a":""}">${fr?"✓ Amigo · toque para remover":"➕ Adicionar aos amigos"}</button></div>`}`;
}
$("pvOv").addEventListener("click",e=>{
  if(e.target===$("pvOv")||e.target.closest("#pvClose"))return closePlayer();
  if(e.target.closest("#pvCopy"))return copyText(pidOf(pvUid));
  if(e.target.closest("#pvFr"))return toggleFriend(pvUid);
});

/* ---- ranking ---- */
function openRanking(){
  if(!fbDb||!fbUser){
    $("rkList").innerHTML=`<p class="rkEmpty">Entre com Google para ver o ranking.</p>`;
    $("rkPodium").innerHTML="";$("rkMe").innerHTML="";$("rkInfo").textContent="";$("rkMyId").innerHTML="";
    return;
  }
  renderRanking();
  if(rkUnsub)return;
  try{
    socialWatch();
    rkUnsub=fbDb.collection("saves").onSnapshot(sn=>{
      rkRows=sn.docs.map(d=>{
        const data=d.data();
        let score=0,pastedCount=0,pasted={},conq={},packs=0,trades=0;
        if(data.a){
          try{
            const parsed=JSON.parse(data.a);
            pasted=parsed.pasted||{};conq=parsed.conq||{};
            packs=parsed.packsOpened||0;trades=parsed.trades||0;
            score=calcScoreFromPasted(pasted);
            pastedCount=Object.keys(pasted).length;
          }catch(e){score=0;pastedCount=0}
        }
        return{
          uid:d.id,name:data.name||"Anônimo",photo:data.photo||"",bio:data.bio||"",title:data.title||"",
          selos:Array.isArray(data.selos)?data.selos:[],region:data.region||"XX",updated:data.updated||0,
          score,pastedCount,pasted,conq,packs,trades
        };
      }).sort((a,b)=>b.score-a.score);
      socialSyncAccepted();renderRanking();renderSearch();renderPlayer();socialRender();
    },e=>{
      console.warn("Ranking erro:",e);
      $("rkList").innerHTML=`<p class="rkEmpty">Erro ao carregar ranking.</p>`;
    });
  }catch(e){console.warn(e)}
}
function closeRanking(){
  socialUnsubs.forEach(fn=>{try{fn()}catch(e){}});socialUnsubs=[];
  if(rkUnsub){try{rkUnsub()}catch(e){}rkUnsub=null}
  closePlayer();
}
function renderRanking(){
  try{
  if(!fbUser){
    $("rkList").innerHTML=`<p class="rkEmpty">Entre com Google para ver o ranking.</p>`;
    $("rkPodium").innerHTML="";$("rkMe").innerHTML="";$("rkInfo").textContent="";$("rkMyId").innerHTML="";
    renderSearch();
    return;
  }
  const myReg=detectRegion();
  $("rkRegBtn").textContent=REGN[myReg]||"🌐 Regional";
  $("rkMyId").innerHTML=`Seu ID: <b>${pidOf(ME||fbUser.uid)}</b> <button class="ghost" id="rkCopy">📋 Copiar</button> <span>· passe para seus amigos te adicionarem</span>`;
  let rows=rkRows;
  if(rkFilter==="regional"){
    rows=rows.filter(r=>r.region===myReg);
    $("rkInfo").textContent=`· ${REGN[myReg]||"Região"}`;
  }else if(rkFilter==="friends"){
    const f=FR();
    rows=rows.filter(r=>r.uid===ME||f.includes(r.uid));
    if(ME&&!rows.some(r=>r.uid===ME)){const m=playerData(ME);if(m)rows=rows.concat(m).sort((a,b)=>b.score-a.score)}
    $("rkInfo").textContent=`· Amigos (${f.length})`;
  }else if(rkFilter==="weekly"){
    const cutoff=Date.now()-7*24*60*60*1000;
    rows=rows.filter(r=>r.updated>=cutoff);
    $("rkInfo").textContent="· Últimos 7 dias";
  }else{
    $("rkInfo").textContent="· Global";
  }
  /* minha posição vale na lista inteira, mesmo fora do Top */
  if(ME){
    const myIdx=rows.findIndex(r=>r.uid===ME);
    const me=playerData(ME);
    $("rkMe").innerHTML=me?rkRowHtml(me,myIdx>=0?"#"+(myIdx+1):"—",{fullName:1}):"";
  }else $("rkMe").innerHTML="";

  rows=rows.slice(0,rkSize);
  const top3=rows.slice(0,3);
  const medal=["🥇","🥈","🥉"],cls=["first","second","third"];
  $("rkPodium").innerHTML=top3.length?`<div class="podium">${[1,0,2].map(i=>{
    const r=top3[i];
    if(!r)return`<div></div>`;
    const cat=categoriaDe(r.pastedCount),sl=selosHtml(r.selos);
    return `<div class="p ${cls[i]}" data-uid="${esc(r.uid)}">
      <div class="medal">${medal[i]}</div>
      ${avImg(r.photo,"av")}
      <div class="nm">${esc((r.name||"Anônimo").split(" ")[0])}${isFr(r.uid)?" 👥":""}</div>
      <div class="cat">${cat.e} ${cat.n}</div>
      <div class="sc">${r.score.toLocaleString("pt-BR")}</div>
      ${r.bio?`<div class="bio">"${esc(r.bio)}"</div>`:""}
      ${sl?`<div class="selos">${sl}</div>`:""}
    </div>`;
  }).join("")}</div>`:"";
  const rest=rows.slice(3);
  let html=rest.map((r,i)=>rkRowHtml(r,"#"+(i+4),{btn:1})).join("");
  if(!html&&!top3.length){
    html=rkFilter==="friends"
      ?`<p class="rkEmpty">👥 Você ainda não tem amigos.<br>Busque pelo nome ou ID no campo acima e toque em ➕.</p>`
      :`<p class="rkEmpty">Ninguém aqui ainda.</p>`;
  }else if(rkFilter==="friends"&&FR().length===0){
    html+=`<p class="rkEmpty">Adicione amigos buscando pelo nome ou ID no campo acima.</p>`;
  }
  $("rkList").innerHTML=html;
  }catch(e){console.warn("renderRanking:",e)}
}
$("pgRank").addEventListener("click",e=>{
  const fb=e.target.closest("[data-fr]");
  if(fb){e.stopPropagation();toggleFriend(fb.dataset.fr);renderSearch();return}
  if(e.target.closest("#rkCopy"))return copyText(pidOf(ME||(fbUser&&fbUser.uid)));
  const row=e.target.closest("[data-uid]");
  if(row)openPlayer(row.dataset.uid);
});
$("pgFriends").addEventListener("click",e=>{const fb=e.target.closest("[data-fr]");if(fb){e.stopPropagation();toggleFriend(fb.dataset.fr);return}const row=e.target.closest("[data-uid]");if(row)openPlayer(row.dataset.uid)});
$("rkQ").addEventListener("input",renderSearch);
$("rkQ").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();$("rkQgo").click()}});
$("rkQgo").onclick=()=>{
  const q=$("rkQ").value.trim();
  if(q.length<2)return toast("Digite pelo menos 2 letras do nome ou o ID");
  if(!fbUser)return toast("Entre com Google para buscar jogadores");
  renderSearch();$("rkQ").blur();
};
$("rkFilters").onclick=e=>{
  const b=e.target.closest("button");if(!b)return;
  rkFilter=b.dataset.f;
  document.querySelectorAll("#rkFilters button").forEach(x=>x.classList.toggle("on",x.dataset.f===rkFilter));
  renderRanking();
};
$("rkSize").onclick=e=>{
  const b=e.target.closest("button");if(!b)return;
  rkSize=+b.dataset.s;
  document.querySelectorAll("#rkSize button").forEach(x=>x.classList.toggle("on",+x.dataset.s===rkSize));
  renderRanking();
};

try{renderCoinShop();renderBonusPk()}catch(e){console.warn(e)}
render();
syncMemes().then(()=>{render()});
initMarket();

