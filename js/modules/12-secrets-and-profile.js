/* Módulo extraído de js/album.js para facilitar manutenção. Ordem definida em js/album.js. */
function tagBanner(sc){const b=$("fx").querySelector(".banner small");if(b)b.textContent=KL[sc.k]}
async function trySecret(p){
 if(!DB||!canW||!fbDb||Math.random()>SCH[p])return null;
 const c=S.filter(q=>q.k=="s"&&(SEC[q.ck]||0)<q.lim);if(!c.length)return null;
 let tot=c.reduce((a,q)=>a+q.lim-(SEC[q.ck]||0),0),x=Math.random()*tot,s=c[0];
 for(const q of c){x-=q.lim-(SEC[q.ck]||0);if(x<=0){s=q;break}}
 const ref=fbDb.doc("secrets/"+s.ck);
 try{
  const r=await fbDb.runTransaction(async tx=>{const sn=await tx.get(ref),t=sn.exists?(sn.data().taken||0):0;
   if(t>=s.lim)return{ok:false,t};tx.set(ref,{taken:t+1});return{ok:true,t:t+1}});
  SEC[s.ck]=r.t;return r.ok?s:null
 }catch(e){return null}}


const BIOS=[
 "Coleciono desde criancinha 🍼","Só falta a lendária 😭","Viciado em pacote 🔥","Aqui só tem figurinha boa 😎",
 "Trocando repetidas, chama!","Caçador de secretas 🔍","Meu álbum brilha mais que o seu","Pacote é vida, pacote é amor",
 "Se colar, colou. Se não, tentou","100% figurinha, 0% paciência","Fazendo história, uma figurinha por vez",
 "Vim pelo jogo, fiquei pelas lendárias","Isso aqui é vício, não hobby","Melhor colar tarde do que nunca colar",
 "Caçando a Cósmica desde 2024","Meu tesouro está aqui","Cada figurinha, uma vitória",
 "Não sou viciado, só gosto muito","Já investi mais aqui que na bolsa","Álbum cheio, coração contente",
 "Procurando a Nebulosa Viva 🌌","Sou o terror do mercado de trocas","Colo rápido, troco mais rápido",
 "Meu nome é coleção, sobrenome figurinha","Faltam 3, só faltam 3!","Rindo de nervoso com as repetidas",
 "Aqui só entra figurinha premium 💎","Meu recorde é 3 lendárias num dia","Colecionar é uma arte 🎨",
 "Todo dia um pacote novo 🌅"
];
const TITULOS=[
 "O Rei das Figurinhas","Colecionador Noturno","Caçador de Lendárias","O Sortudo","Trader Profissional",
 "Iniciante Corajoso","O Incansável","Explorador de Pacotes","Lenda Viva",
 "O Viciado","Rei do Mercado","Alquimista Moderno","Mago das Cartas","O Paciente",
 "Especialista em Secretas","Futuro Campeão","Colecionador Anônimo","O Estrategista","Caçador de Cósmicas"
];
const SELOS=[
 {id:"passeando",e:"🚶",n:"Só passeando",cond:()=>Object.keys(A.pasted).length===0},
 {id:"comecou",e:"🐌",n:"Começou ontem",cond:()=>{const c=Object.keys(A.pasted).length;return c>=1&&c<=2}},
 {id:"acumulador",e:"📦",n:"Acumulador",cond:()=>{let d=0,col=0;for(const id in A.owned){const x=A.owned[id];if(A.pasted[id]){if(x>1)d+=x-1}else d+=x;if(A.pasted[id])col++}return d>col}},
 {id:"comerciante",e:"💼",n:"Comerciante",cond:()=>{let d=0;for(const id in A.owned)if(!A.pasted[id]||A.owned[id]>1)d+=A.pasted[id]?A.owned[id]-1:A.owned[id];return d>=20}},
 {id:"sortudo",e:"🍀",n:"Sortudo",cond:()=>{const c=Object.keys(A.pasted).length;if(c>50)return false;for(const id in A.pasted){const s=S[id-1];if(s&&s.t>=6)return true}return false}},
 {id:"bancario",e:"🏦",n:"Bancário",cond:()=>A.coins>=10000},
 {id:"basic",e:"🎁",n:"Só o básico",cond:()=>(A.packsOpened||0)===0},
 {id:"absoluto",e:"🔱",n:"Lendário Absoluto",cond:()=>{let c=0;for(const id in A.pasted)c++;return c>=ALBN}},
 {id:"animais",e:"🐾",n:"Fã dos Animais",cond:()=>{let tot=0,an=0;for(const id in A.pasted){tot++;const s=S[id-1];if(s&&s.e&&/[\u{1F400}-\u{1F43F}]/u.test(s.e))an++}return tot>=10&&an/tot>=.9}},
 {id:"cacador",e:"🔒",n:"Caçador de Secretas",cond:()=>Object.keys(A.conq||{}).filter(k=>k[0]=="s").length>=3},
 {id:"viciado",e:"🎰",n:"Viciado em Pacote",cond:()=>(A.packsOpened||0)>=100},
 {id:"rico",e:"💎",n:"Rico",cond:()=>A.coins>=50000},
 {id:"novato",e:"🐣",n:"Novato Curioso",cond:()=>{const c=Object.keys(A.pasted).length;return c>=5&&c<=20}},
 {id:"dedicado",e:"📘",n:"Dedicado",cond:()=>Object.keys(A.pasted).length>=100},
 {id:"obsessivo",e:"🔥",n:"Obsessivo",cond:()=>Object.keys(A.pasted).length>=500},
 {id:"quasela",e:"🌟",n:"Quase Lá",cond:()=>Object.keys(A.pasted).length>=ALBN*.9},
 {id:"certeiro",e:"🎯",n:"Certeiro",cond:()=>(A.perfectPastes||0)>=20},
 {id:"trader",e:"🤝",n:"Bom de Troca",cond:()=>(A.trades||0)>=5},
 {id:"fantasma",e:"👻",n:"Fantasma",cond:()=>S.some(q=>q.k=="s"&&q.lim<=5&&(A.conq||{})[q.ck])},
 {id:"showman",e:"🎪",n:"Showman",cond:()=>Object.keys(A.conq||{}).filter(k=>k[0]=="e").length>=10},
];
function unlockedSelos(){return SELOS.filter(s=>{try{return s.cond()}catch(e){return false}})}
function categoriaDe(totalColadas){
 if(totalColadas===0)return{e:"😴",n:"Só passeando"};
 if(totalColadas<5)return{e:"🐌",n:"Começou ontem"};
 if(totalColadas<20)return{e:"🐣",n:"Novato Curioso"};
 if(totalColadas<50)return{e:"🌱",n:"Iniciante"};
 if(totalColadas<100)return{e:"🎯",n:"Em Ascensão"};
 if(totalColadas<300)return{e:"📘",n:"Colecionador Dedicado"};
 if(totalColadas<600)return{e:"🏅",n:"Colecionador Veterano"};
 if(totalColadas<1000)return{e:"💎",n:"Super Colecionador"};
 if(totalColadas<ALBN)return{e:"🌟",n:"Lenda Viva"};
 return{e:"👑",n:"Rei do Álbum"};
}
function renderProfile(){
 try{
 const logged=!!fbUser;
 const pastedCount=Object.keys(A.pasted).length;
 const cat=categoriaDe(pastedCount);
 const selos=unlockedSelos();
 const avatar=logged&&fbUser.photoURL?`<img class="bigav" src="${fbUser.photoURL}" referrerpolicy="no-referrer" alt="">`:`<div class="bigav" style="display:grid;place-items:center;font-size:2rem">👤</div>`;
 const nome=logged?(fbUser.displayName||"Você"):"Visitante";
 const email=logged?(fbUser.email||""):"Entre com Google no topo";
 $("pfCard").innerHTML=`
   ${avatar}
   <div class="nm">${esc(nome)}</div>
   <div class="em">${esc(email)}</div>
   ${logged?`<div class="em">ID: <b>${pidOf(fbUser.uid)}</b></div>`:""}
   ${A.title?`<div class="cat">🎭 ${esc(A.title)}</div>`:""}
   <div class="cat" style="color:var(--mut);font-size:.8rem;font-weight:600">${cat.e} ${cat.n}</div>
   ${A.bio?`<div class="bioShow">"${esc(A.bio)}"</div>`:""}
   <div class="pfStats">
     <div class="stt"><b>${pastedCount}/${ALBN}</b><small>Coladas</small></div>
     <div class="stt"><b>${calcMyScore().toLocaleString('pt-BR')}</b><small>Score</small></div>
     <div class="stt"><b>${A.coins.toLocaleString('pt-BR')}</b><small>Moedas</small></div>
     <div class="stt"><b>${A.packsOpened||0}</b><small>Pacotes</small></div>
     <div class="stt"><b>${A.trades||0}</b><small>Trocas</small></div>
   </div>`;
 const cq=A.conq||{},hs=S.filter(q=>q.hid),ch=q=>{const n=cq[q.ck]||0;
  return `<div class="seloChip cq ${n?"on":"locked"}"><span class="e">${n?q.e:"❓"}</span> ${n?esc(q.n):"???"}<small>${q.k=="s"?"Edição de "+q.lim:esc(q.ev)}${n>1?" · ×"+n:""}</small></div>`};
 $("pfConqCount").textContent=`(${hs.filter(q=>cq[q.ck]).length}/${hs.length})`;
 $("pfConqSec").innerHTML=hs.filter(q=>q.k=="s").map(ch).join("");
 $("pfConqEv").innerHTML=hs.filter(q=>q.k=="e").map(ch).join("");
 const canEdit=logged;
 $("pfBioBox").hidden=!canEdit;$("pfTitleBox").hidden=!canEdit;$("pfSeloBox").hidden=!canEdit;
 if(!canEdit)return;
 const cur=A.bio||"";
 $("pfCustom").value=BIOS.includes(cur)?"":cur;
 $("pfBioList").innerHTML=BIOS.map(b=>`<button class="bioItem ${cur===b?"on":""}" data-b="${esc(b)}">${esc(b)}</button>`).join("");
 $("pfTitleList").innerHTML=TITULOS.map(t=>`<button class="titleChip ${A.title===t?"on":""}" data-t="${esc(t)}">🎭 ${esc(t)}</button>`).join("");
 $("pfSeloCount").textContent=`(${selos.length} desbloqueados · ${A.selos.length}/3 exibidos)`;
 $("pfSeloList").innerHTML=SELOS.map(s=>{
   const un=selos.some(x=>x.id===s.id);
   const on=A.selos.includes(s.id);
   return `<button class="seloChip ${on?"on":""} ${un?"":"locked"}" data-s="${s.id}"><span class="e">${s.e}</span> ${esc(s.n)}</button>`
 }).join("");
 }catch(e){console.warn("renderProfile:",e)}
}
$("pfBioList").onclick=e=>{const b=e.target.closest("button[data-b]");if(!b)return;A.bio=b.dataset.b;$("pfCustom").value="";save();renderProfile();toast("Bio atualizada!")};
$("pfSaveCustom").onclick=()=>{const v=$("pfCustom").value.trim();A.bio=v;save();renderProfile();toast(v?"Bio salva!":"Bio limpa")};
$("pfTitleList").onclick=e=>{const b=e.target.closest("button[data-t]");if(!b)return;const t=b.dataset.t;A.title=A.title===t?"":t;save();renderProfile();toast(A.title?"Título definido!":"Título removido")};
$("pfSeloList").onclick=e=>{
 const b=e.target.closest("button[data-s]");if(!b||b.classList.contains("locked"))return;
 const id=b.dataset.s;const i=A.selos.indexOf(id);
 if(i>=0)A.selos.splice(i,1);
 else{if(A.selos.length>=3)return toast("Máximo 3 selos");A.selos.push(id)}
 save();renderProfile()
};

