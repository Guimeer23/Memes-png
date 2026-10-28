/* Módulo extraído de js/album.js para facilitar manutenção. Ordem definida em js/album.js. */
/* Informações centralizadas do lançamento: atualize version.json a cada versão. */
(async function loadReleaseInfo(){
  const fallback={version:"v1.30.22",date:"25/10/2026",channel:"Desenvolvimento",project:"Álbum de Figurinhas"};
  try{
    const response=await fetch("version.json?t="+Date.now());
    if(!response.ok)throw new Error("Não foi possível carregar version.json");
    const info=await response.json();
    const data={...fallback,...info};
    document.querySelectorAll("[data-version]").forEach(el=>el.textContent=data.version);
    document.querySelectorAll("[data-release-date]").forEach(el=>el.textContent=data.date);
    document.querySelectorAll("[data-channel]").forEach(el=>el.textContent=data.channel);
    document.querySelectorAll("title").forEach(el=>el.textContent=data.project+" "+data.version);
    const project=document.querySelector("#versionInfo");
    const projectRow=project&&Array.from(project.querySelectorAll("p")).find(p=>p.textContent.includes("Projeto:"));
    if(projectRow)projectRow.innerHTML="<b>Projeto:</b> "+data.project;
  }catch(error){
    document.querySelectorAll("[data-version]").forEach(el=>el.textContent=fallback.version);
    document.querySelectorAll("[data-release-date]").forEach(el=>el.textContent=fallback.date);
    console.warn("Informações da versão:",error);
  }
})();

const $=id=>document.getElementById(id),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const FXD={tabs:1,page3d:1,leafHQ:1,particles:1,shine:1,shake:1,vibe:1};
const FX=Object.assign({},FXD);
try{Object.assign(FX,JSON.parse(localStorage.getItem("albFx")||"{}"))}catch(e){}
const _vib=navigator.vibrate?navigator.vibrate.bind(navigator):null;
function fxApply(){
 const c=document.documentElement.classList;
 c.toggle("fx-noshine",!FX.shine);c.toggle("fx-noshake",!FX.shake);c.toggle("fx-notabs",!FX.tabs);
 try{if(_vib)Object.defineProperty(navigator,"vibrate",{value:FX.vibe?_vib:()=>false,configurable:true,writable:true})}catch(e){}
}
function fxSave(){try{localStorage.setItem("albFx",JSON.stringify(FX))}catch(e){}fxApply()}
fxApply();
const TN=["Básica","Média","Rara","Super Rara","Ultra Rara","Épica","Lendária","Mítica","Cósmica"];
const TH=[215,195,145,50,22,285,340,175,260],PRICE=[100,200,400,800,1200,1800,3000,5000,8000],/* PREÇO DOS PACOTES */
CARD_BASE=[150,300,600,1200,1800,2700,4500,7500,12000],/* PREÇO-BASE DAS CARTAS (entra na escassez) */
SCORE_VAL=[100,200,400,800,1600,3200,6400,12800,25600];/* só para o score do ranking (valores antigos, não mudam o ranking) */
const nf=n=>Math.round(+n||0).toLocaleString("pt-BR");
/* ===== v1.33: figurinhas com imagens (memes) hospedadas no GitHub ===== */
const IMG_BASE="https://raw.githubusercontent.com/Guimeer23/Memes-png/main/memes/";
/* img = Básica/Média/Rara · img2 = Super Rara/Ultra Rara/Épica · img3 = Lendária · img4 = Mítica · gif = Cósmica (GIF em todo lugar). Campos que faltarem usam o anterior. */
const GH={u:"Guimeer23",r:"Memes-png",b:"main"};
/* Cada pasta de memes/ no GitHub = um meme. Dentro: A, B, C, D (imagem, qualquer extensão) e um .gif. Sem rede, usa o último catálogo salvo. */
const MEME_FALLBACK=[{n:"67",img:"67/A.png",img2:"67/B.png",img3:"67/C.png",img4:"67/D.png",gif:"67/preview.gif"}];
const memeSort=l=>l.slice().sort((a,b)=>a.n<b.n?-1:a.n>b.n?1:0);
let MEMES=MEME_FALLBACK;
try{const c=JSON.parse(localStorage.getItem("albMemes")||"null");if(Array.isArray(c)&&c.length)MEMES=c}catch(e){}
MEMES=memeSort(MEMES);const MN=MEMES.map(m=>m.n);
const PG=[],S=[],CPG=[];
MEMES.forEach(m=>{for(let t=0;t<=8;t++){if(S.length%10==0)PG.push({n:"Memes"+(PG.length?" "+(PG.length+1):""),e:"😂"});S.push({id:S.length+1,e:"🖼️",n:m.n,t,pg:PG.length-1,k:"m",img:m.img,img2:m.img2,img3:m.img3,img4:m.img4,gif:m.gif})}});
const imgFile=(s,st)=>{const t=s.t,a=s.img,b=s.img2||a,c=s.img3||b,d=s.img4||c;return t<3?a:t<6?b:t==6?c:t==7?d:st?d:(s.gif||d)};
const imgUrl=(s,st)=>IMG_BASE+imgFile(s,st);
const imgErr="if(this.dataset.fb&&this.src!==this.dataset.fb){this.src=this.dataset.fb;return}this.onerror=null;var d=document.createElement('div');d.className=this.className+' imgfb';d.textContent=this.alt;this.replaceWith(d)";
const imgTag=(s,c,an)=>`<img class="${c||"mimg"}" src="${imgUrl(s)}" data-fb="${imgUrl(s,1)}" alt="${String(s.n).replace(/"/g,"&quot;")}" draggable="false" decoding="async" onerror="${imgErr}">`;
const fxk=s=>s.k=="s"||s.k=="e"||s.k=="f"?s.k:s.t,fxo=s=>{const k=fxk(s);return typeof k=="string"||k>=5?'<i class="fxo"></i>':""};
const emo=s=>s.k==="m"?imgTag(s):`<span class="e">${s.e}</span>`;
const SBG="linear-gradient(160deg,#0b0b0b,#3a2a00 55%,#d4a64a)",SEC={};
const SECR=[["👻","Fantasma Dourado",1],["👑","Rei Sem Coroa",2],["🌑","Eclipse Vivo",3],["☄️","Cometa Negro",5],["🔮","Oráculo",5],["😈","Anjo Caído",10],["⏳","Relógio do Tempo",10],["🗝️","Chave Mestra",25],["🎭","Máscara Prateada",50],["🪙","Moeda Eterna",100]];
SECR.forEach((x,i)=>S.push({id:S.length+1,e:x[0],n:x[1],t:8,pg:-1,k:"s",lim:x[2],hid:1,ck:"s"+(i+10)}));
const EV=[{n:"Halloween",f:1015,t:1102,h:25,c:[["🎃","Abóbora Sorridente"],["🦇","Morcego Noturno"],["🧙‍♀️","Bruxa"],["🕸️","Teia Sombria"]]},
{n:"Natal",f:1201,t:1226,h:140,c:[["🎅","Papai Noel"],["🦌","Rena Rudolph"],["⛄","Boneco de Neve"],["🎁","Presente"]]},
{n:"Ano Novo",f:1227,t:105,h:200,c:[["🎆","Fogos"],["🥂","Brinde"],["🕛","Meia-Noite"],["🍇","Uvas da Sorte"]]},
{n:"Carnaval",f:201,t:305,h:310,c:[["🎭","Máscara Veneziana"],["🥁","Bateria"],["💃","Passista"],["🎊","Serpentina"]]},
{n:"Festa Junina",f:601,t:705,h:50,c:[["🌽","Milho Cozido"],["🔥","Fogueira"],["🎈","Balão"],["👒","Chapéu de Palha"]]}];
EV.forEach(ev=>ev.c.forEach((c,i)=>S.push({id:S.length+1,e:c[0],n:c[1],t:[3,4,5,6][i],pg:-1,k:"e",ev:ev.n,h:ev.h,hid:1,ck:"e"+ev.n+"|"+i})));
const GR=[{e:"😂",s:0}],ALBN=S.filter(s=>!s.hid).length;
const ownOf=s=>s.hid?((A.conq||{})[s.ck]||0):(A.owned[s.id]||0);
const BY=[0,1,2,3,4,5,6,7,8].map(r=>S.filter(s=>s.k=="m"&&s.t==r));
const LB=s=>s.k=="s"?"Secreta":s.k=="e"?"Evento":TN[s.t];
const slotLbl=s=>s.k=="s"?`🔒 ${s.lim-(SEC[s.ck]||0)}/${s.lim}`:s.k=="e"?"🎉 "+s.ev:TN[s.t];
const evOn=e=>{const d=new Date(),md=(d.getMonth()+1)*100+d.getDate();return e.f<=e.t?md>=e.f&&md<=e.t:md>=e.f||md<=e.t};
function evCard(){const on=EV.filter(evOn);if(!on.length||Math.random()>.12)return null;const ev=on[Math.random()*on.length|0],x=Math.random(),i=[.5,.8,.95,1].findIndex(w=>x<w);return S.find(s=>s.k=="e"&&s.ev==ev.n&&s.t==[3,4,5,6][i])}
const bg=s=>s.k=="s"?SBG:s.k=="e"?`linear-gradient(160deg,hsl(${s.h} 85% 52%),#2b0f55)`:s.t==8?"radial-gradient(circle at 30% 20%,#fff 0 2px,transparent 3px),radial-gradient(circle at 70% 60%,#fff 0 1.5px,transparent 2.5px),linear-gradient(160deg,#3b1480,#0a0a2e 55%,#7a1fc0)":`linear-gradient(160deg,hsl(${TH[s.t]+s.id%4*7} 70% 52%),hsl(${TH[s.t]+35} 65% 28%))`;
const bc=s=>s.k=="s"?"#ffd24a":s.k=="e"?"#ff9a3c":`hsl(${TH[s.t]} 90% ${s.t?68:85}%)`;
/* v1.44: chances por raridade. Pacotes Lendário/Mítico/Cósmico (p=6,7,8) agora têm tabela própria e PODEM dar Básica/Média/Rara.
   Lendária bem mais difícil, Mítica um pouco mais difícil, Cósmica igual. Pesos relativos (%), normalizados abaixo. */
const WT_HI={6:[12,18,25,22,14,7.9,.8,.4,.05],7:[9,15,22,24,17,10.5,1.3,.65,.08],8:[6,11,19,25,20,15.9,2,1,.13]};
const wt=(p,m=0)=>{const k=1.5-p*.13125,base=WT_HI[p]||TN.map((_,r)=>Math.exp(-k*r)*(r==8?.03:r==7?.175:r==6?.6:1)),w=base.map((x,r)=>r<m?0:x),s=w.reduce((a,b)=>a+b);return w.map(x=>x/s)};
const pick=w=>{let x=Math.random(),r=0;while(r<8&&(x>w[r]||w[r]==0)){x-=w[r];r++}const a=BY[r];return a[Math.random()*a.length|0]};
const COUNT=[3,4,5,6,6,7,8,9,10];
const EXP=[.02,.025,.03,.035,.04,.045,.05,.055];
const fmt=x=>{const p=x*100;return(p>=10?p.toFixed(0):p>=1?p.toFixed(1):p>=.01?p.toFixed(2):x?"<0.01":"0")+"%"};
let A={coins:500,owned:{},pasted:{},bonus:"",bio:"",title:"",selos:[],packsOpened:0,perfectFusions:0,trades:0,conq:{}};
try{A=Object.assign(A,JSON.parse(localStorage.getItem("alb3")||"null")||{coins:JSON.parse(localStorage.getItem("alb2")||"{}").coins||500})}catch(e){}
if(!Array.isArray(A.selos))A.selos=[];
if(!Array.isArray(A.friends))A.friends=[];
function migConq(){if(!A.conq||typeof A.conq!="object")A.conq={};
 const leg=!Array.isArray(A.mo),old=leg?["67"]:A.mo,lim=old.length*9;
 if(leg)[A.owned,A.pasted].forEach(o=>{for(const id of Object.keys(o||{})){const n=+id;if(n>9&&n<=39){const j=n-10,ev=EV[(j-10)>>2],ck=j<10?"s"+(j+10):ev?"e"+ev.n+"|"+((j-10)%4):null;if(ck)A.conq[ck]=Math.max(A.conq[ck]||0,+o[id]||1)}}});
 ["owned","pasted"].forEach(k=>{const o=A[k]||{},r={};for(const id of Object.keys(o)){const n=+id;if(n<1||n>lim)continue;const j=MN.indexOf(old[(n-1)/9|0]);if(j>=0)r[j*9+(n-1)%9+1]=o[id]}A[k]=r});
 A.mo=MN.slice();try{localStorage.setItem("alb3",JSON.stringify(A))}catch(e){}}
migConq();
let sel=null,sellArm=null,tt,PGI=0,curP=0,extraShown=false,buying=false;
let cur=null,flipped=0;
let rkFilter="global",rkSize=50,rkRows=[],rkUnsub=null;
const save=()=>{A.at=Date.now();try{localStorage.setItem("alb3",JSON.stringify(A))}catch(e){}if(typeof cloudPush=="function")cloudPush()};
async function syncMemes(){try{
 if(Date.now()-(+localStorage.getItem("albMemesAt")||0)<120000)return;
 const r=await fetch(`https://api.github.com/repos/${GH.u}/${GH.r}/git/trees/${GH.b}?recursive=1`);if(!r.ok)return;
 const j=await r.json(),dirs={};localStorage.setItem("albMemesAt",Date.now());
 (j.tree||[]).forEach(f=>{const m=/^memes\/([^/]+)\/([^/]+)$/.exec(f.path);if(m&&f.type=="blob")(dirs[m[1]]=dirs[m[1]]||[]).push(m[2])});
 const found=Object.keys(dirs).map(n=>{const fs=dirs[n].sort(),im=fs.filter(x=>/\.(png|jpe?g|webp|gif)$/i.test(x)),gif=im.find(x=>/\.gif$/i.test(x)),st=im.filter(x=>!/\.gif$/i.test(x)),
   L=c=>st.find(x=>x.replace(/\.[^.]+$/," ").trim().toUpperCase()==c),a=L("A")||st[0]||gif,p=x=>x?n+"/"+x:undefined;
  /* Cada pasta conta como um meme mesmo antes de receber imagens. */
  const label=n.replace(/[-_]+/g," ").replace(/\b\w/g,c=>c.toUpperCase());
  return {n:label,img:p(a),img2:p(L("B")),img3:p(L("C")),img4:p(L("D")),gif:p(gif)};
 });
 const by={};MEMES.forEach(m=>by[m.n]=m);found.forEach(m=>by[m.n]=m);
 const nl=memeSort(Object.values(by)),sig=JSON.stringify(nl);
 if(sig===JSON.stringify(MEMES))return;
 localStorage.setItem("albMemes",sig);
 if(cur||buying)toast("🆕 Novos memes! Reabra o álbum para ver");else{toast("🆕 Novos memes! Atualizando…");setTimeout(()=>location.reload(),1400)}
}catch(e){}}
function toast(m){const t=$("toast");t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),3000)}
const mini=(s,x)=>`<div class="mini fx fx${fxk(s)} ${sel==s.id?"sel":""}" data-id="${s.id}" style="background:${bg(s)};border-color:${bc(s)};--fh:${s.h||0}">${emo(s)}#${s.id}<span>${LB(s)}</span>${x>1?`<i class="x">x${x}</i>`:""}</div>`;
function render(){
 $("coins").textContent=(coinDisp!==null&&coinDisp<A.coins)?Math.round(coinDisp):A.coins;
 const nw=S.filter(s=>A.owned[s.id]>0&&!A.pasted[s.id]),dp=S.filter(s=>A.owned[s.id]>1);
 multiSel=multiSel.filter(id=>nw.some(s=>s.id===id));
 {const sorted=[...multiSel].sort((a,b)=>a-b),sc=$("invNew").scrollLeft;
  $("invNew").innerHTML=nw.map(s=>{let h=mini(s,1);const k=sorted.indexOf(s.id);
   if(multiOn&&k>=0)h=h.replace('class="mini ','class="mini msel ').replace(/<\/div>$/,`<i class="mk">${k+1}</i></div>`);return h}).join("");
  $("invNew").scrollLeft=sc}
 $("nNew").textContent=multiOn?`(${nw.length}) · toque para marcar (máx. ${AUTO_MAX})`:`(${nw.length}) · toque: escolher · segure: ver`;
 autoUI(nw);
 $("invDup").innerHTML=dp.map(s=>mini(s,A.owned[s.id]-1)).join("");$("nDup").textContent=`(${dp.reduce((a,s)=>a+A.owned[s.id]-1,0)}) · toque 2x para vender`;
 if(!pageTurning){paintHalf(PGI,0);paintHalf(PGI,1)}
 const k=Object.keys(A.pasted).length;$("cnt").textContent=`${k}/${ALBN}`;$("fill").style.width=k/ALBN*100+"%";
 $("packs").innerHTML=TN.map((n,p)=>`<div class="pk" style="--h:${TH[p]}"><div class="mp"><span class="mpe">${PEM[p]}</span><span class="mpn">${n}</span></div><div class="pi"><b>Pacote ${n}</b><small>${COUNT[p]} figurinhas · extra Super Rara+ ${p<8?+(EXP[p]*100).toFixed(1)+"%: +1":"12%: +1 ou +2"} · ${nf(PRICE[p])} 🪙</small><div class="rt">${wt(p).map((x,r)=>`<span style="color:hsl(${TH[r]} 70% 50%)">${TN[r]} ${fmt(x)}</span>`).join("")}</div><button class="main" data-p="${p}" ${A.coins<PRICE[p]?"disabled":""}>Comprar</button></div></div>`).join("");
 $("bonus").disabled=A.bonus==new Date().toDateString();try{renderDaily()}catch(e){console.warn("daily:",e)}pageUI()}
function pageUI(){
 const p=PG[PGI];
 if(!pageTurning)[0,1].forEach(k=>{const ids=S.filter(s=>s.pg==PGI).slice(k*5,k*5+5),c=ids.filter(s=>A.pasted[s.id]).length;
  $(k?"tR":"tL").textContent=`${p.e} ${p.n}${k?" · cont.":""}`;$(k?"nR":"nL").textContent=`${c}/${ids.length} coladas`;$(k?"pnR":"pnL").textContent=PGI*2+k+1});
 $("chips").innerHTML=GR.map((g,j)=>{const nx=j+1<GR.length?GR[j+1].s:PG.length,on=PGI>=g.s&&PGI<nx;return `<button class="chip ${on?"on":""}" data-i="${on?PGI:g.s}">${g.e}</button>`}).join("");
 $("prev").disabled=PGI==0;$("next").disabled=PGI==PG.length-1;$("pj").placeholder=`1–${PG.length}`;
 const ae=EV.filter(evOn).map(e=>e.c[0][0]+" "+e.n).join(", ");
 $("dry").textContent=((A.exN||0)?`Carta extra garantida após 25 pacotes sem extra (sequência: ${A.dry||0}/24)`:`Sua 1ª carta extra vem garantida até o 3º pacote (abertos: ${A.dry||0})`)+(ae?` · 🎉 Evento ativo: ${ae}`:"");
 try{tradeUI()}catch(e){console.warn("tradeUI:",e)}
}
let pageTurning=false,pendingTurn=null,chain=null;
let multiOn=false,multiSel=[],autoRun=false,autoStop=false;
const AUTO_MAX=20,AUTO_COINS=25;
const STRIPS=12,SPRING={drag:{k:520,z:.85},free:{k:170,z:1}};
const clamp01=v=>Math.max(0,Math.min(1,v));
function slotsHtml(pi,h){
 return S.filter(s=>s.pg==pi).slice(h*5,h*5+5).map(s=>{const c=A.pasted[s.id];
  return `<div class="slot ${c?"has fx fx"+fxk(s):""} ${sel==s.id?"target":""}" data-id="${s.id}" style="--c:hsl(${TH[s.t]} 80% 55%);--fh:${s.h||0}">${c?`<div class="st" style="background:${bg(s)};border-color:${bc(s)};--x:${c.x}px;--y:${c.y}px;--r:${c.r}deg">${emo(s)}<span class="t">${s.n}</span>${fxo(s)}</div>`:`<b>${s.id}</b><small>${slotLbl(s)}</small>`}</div>`}).join("");
}
function paintHalf(pi,h){
 const p=PG[pi],ids=S.filter(s=>s.pg==pi).slice(h*5,h*5+5);
 $(h?"gridR":"gridL").innerHTML=slotsHtml(pi,h);
 $(h?"tR":"tL").textContent=`${p.e} ${p.n}${h?" · cont.":""}`;
 $(h?"nR":"nL").textContent=`${ids.filter(s=>A.pasted[s.id]).length}/${ids.length} coladas`;
 $(h?"pnR":"pnL").textContent=pi*2+h+1;
}
function buildPageNode(pi,h){
 const d=document.createElement("div");
 d.className="pg "+(h?"R":"L");
 d.innerHTML='<div class="ph"><h2></h2><small></small></div><div class="grid"></div><div class="pn"></div>';
 const p=PG[pi],ids=S.filter(s=>s.pg==pi).slice(h*5,h*5+5);
 d.querySelector(".grid").innerHTML=slotsHtml(pi,h);
 d.querySelector(".ph h2").textContent=`${p.e} ${p.n}${h?" · cont.":""}`;
 d.querySelector(".ph small").textContent=`${ids.filter(s=>A.pasted[s.id]).length}/${ids.length} coladas`;
 d.querySelector(".pn").textContent=pi*2+h+1;
 return d;
}
function runPending(){
 if(pendingTurn!==null){const n=pendingTurn;pendingTurn=null;if(n!==PGI)setTimeout(()=>goLeaf(n),0)}
}
function endTurn(target){
 pageTurning=false;
 PGI=cl(target,0,PG.length-1);
 if(chain&&PGI!==chain.target){paintHalf(PGI,0);paintHalf(PGI,1);chainStep();return}
 render();
 if(chain){chainStep();return}
 runPending();
}
function createTurn(old,i,fwd){
 const spread=$("spread"),pw=$("pgR").offsetWidth,N=((chain&&chain.n>2)||!FX.leafHQ)?6:STRIPS,sw=pw/N;
 const frontNode=buildPageNode(old,fwd?1:0),backNode=buildPageNode(i,fwd?0:1);
 const leaf=document.createElement("div");leaf.className="leaf "+(fwd?"fw":"bw");
 const strips=[];let parent=leaf;
 for(let k=0;k<N;k++){
  const st=document.createElement("div");st.className="lstrip";st.style.width=sw+"px";
  if(fwd){st.style.left=(k?"100%":"0")}else{st.style.right=(k?"100%":"0")}
  const mkFace=(cls,node,off)=>{
   const f=document.createElement("div");f.className="lface "+cls;
   f.style.width=(sw+1)+"px";f.style[fwd?"left":"right"]="0";if(cls==="b")f.style.transformOrigin=(fwd?sw/2:(sw+1)-sw/2)+"px 50%";
   const n=node.cloneNode(true);
   n.style.cssText=`position:absolute;top:0;height:100%;width:${pw}px;${fwd?"left":"right"}:auto;left:${off}px`;
   f.appendChild(n);return f};
  const offF=fwd?-k*sw:-(N-1-k)*sw,offB=fwd?-(N-1-k)*sw:-k*sw;
  st.append(mkFace("f",frontNode,offF),mkFace("b",backNode,offB));
  parent.appendChild(st);strips.push(st);parent=st;
 }
 const sh1=document.createElement("div");sh1.className="tsh "+(fwd?"pos-r":"pos-l");
 const sh2=document.createElement("div");sh2.className="tsh "+(fwd?"pos-l":"pos-r");
 paintHalf(i,fwd?1:0);
 spread.append(sh1,sh2,leaf);
 return {leaf,strips,sh1,sh2,fwd,old,i,N,pw,
  p:0,v:0,target:0,k:SPRING.free.k,z:SPRING.free.z,mode:"free",yRel:.5,raf:0,last:0};
}
function applyTurn(T){
 const p=clamp01(T.p),dir=T.fwd?-1:1,N=T.N;
 const base=p*180,bend=40*Math.sin(Math.PI*p);
 const lag=Math.max(-16,Math.min(16,T.v*7));
 let prev=0;
 T.strips.forEach((st,k)=>{
  const t=(k+.5)/N;
  let phi=base+bend*(t-.5)*2-lag*t*Math.sin(Math.PI*p)*1.4;
  phi=Math.max(0,Math.min(180,phi));
  if(p>=.999)phi=180;if(p<=.001)phi=0;
  if(k>0&&phi<prev-2)phi=prev-2;
  st.style.transform=`rotateY(${dir*(phi-prev)}deg)`;
  st.style.setProperty("--sh",(.55*Math.pow(Math.sin(phi*Math.PI/180),1.2)).toFixed(3));
  prev=phi;
 });
 T.leaf.style.transform=`rotateX(${((.5-T.yRel)*9*Math.sin(Math.PI*p)).toFixed(2)}deg)`;
 T.sh1.style.opacity=(Math.max(0,1-p*1.7)*.9).toFixed(3);
 T.sh2.style.opacity=(Math.max(0,(p-.35)/.65)*.9).toFixed(3);
}
function stepTurn(T,ts){
 const dt=Math.min((ts-T.last)/1000||.016,1/30);T.last=ts;
 const n=4,h=dt/n,w=Math.sqrt(T.k),c=2*T.z*w;
 for(let j=0;j<n;j++){const a=-T.k*(T.p-T.target)-c*T.v;T.v+=a*h;T.p+=T.v*h;
  if(T.p>1){T.p=1;if(T.v>0)T.v=0}if(T.p<0){T.p=0;if(T.v<0)T.v=0}}
 applyTurn(T);
 if(T.mode==="free"&&((Math.abs(T.p-T.target)<.0015&&Math.abs(T.v)<.02)||(T.finishAt&&T.target===1&&T.p>=T.finishAt))){finishTurn(T);return}
 T.raf=requestAnimationFrame(ts2=>stepTurn(T,ts2));
}
function runTurn(T){T.last=performance.now();T.raf=requestAnimationFrame(ts=>stepTurn(T,ts))}
function finishTurn(T){
 cancelAnimationFrame(T.raf);
 [T.leaf,T.sh1,T.sh2].forEach(n=>n.remove());
 $("spread").classList.remove("dragging");
 curTurn=null;
 endTurn(T.target>=.5?T.i:T.old);
}
let curTurn=null;
const lastTarget=()=>pendingTurn!==null?pendingTurn:(chain?chain.target:(curTurn?curTurn.i:PGI));
const reducedMotion=()=>!FX.page3d||(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);

function beginTurn(i,o){
 o=o||{};
 try{
  pageTurning=true;
  const T=createTurn(PGI,i,i>PGI);
  curTurn=T;T.target=1;T.v=o.v||1.1;if(o.k)T.k=o.k;T.finishAt=o.finishAt||0;
  applyTurn(T);runTurn(T);
 }catch(err){
  console.warn("beginTurn erro:",err);
  if(curTurn){cancelAnimationFrame(curTurn.raf);[curTurn.leaf,curTurn.sh1,curTurn.sh2].forEach(n=>n.remove());curTurn=null}
  endTurn(i);
 }
}
function goLeaf(i){
 i=cl(i,0,PG.length-1);
 if(pageTurning||chain){pendingTurn=i;return}
 if(i===PGI)return;
 if(Math.abs(i-PGI)>1){flipTo(i);return}
 if(reducedMotion()||$("pgAlbum").hidden){PGI=i;render();return}
 beginTurn(i);
}
function flipPlan(n,fast){
 const leaves=Math.min(n,16);
 const budget=Math.min(fast?1.2:2,.45+.14*leaves);
 return {stride:Math.max(1,Math.ceil(n/leaves)),budget};
}
function flipTo(target,opt){
 target=cl(target,0,PG.length-1);
 return new Promise(res=>{
  if(reducedMotion()||$("pgAlbum").hidden){if(!pageTurning){PGI=target;render()}res();return}
  if(chain){
   const n=Math.abs(target-PGI),pl=flipPlan(n,chain.fast);
   chain.target=target;chain.res.push(res);chain.n=n;chain.stride=pl.stride;chain.deadline=performance.now()+pl.budget*1000;return}
  if(target===PGI&&!pageTurning){res();return}
  const n=Math.abs(target-PGI),fast=!!(opt&&opt.fast),pl=flipPlan(n,fast);
  chain={target,res:[res],n,fast,stride:pl.stride,deadline:performance.now()+pl.budget*1000};
  if(!pageTurning)chainStep();
 });
}
function chainStep(){
 if(!chain)return;
 if(PGI===chain.target){const c=chain;chain=null;c.res.forEach(f=>f());runPending();return}
 const dir=chain.target>PGI?1:-1,n=Math.abs(chain.target-PGI);
 const next=PGI+dir*Math.min(chain.stride,n);
 if(chain.n<=1&&!chain.fast){beginTurn(next,{});return}
 const leavesLeft=Math.max(1,Math.ceil(n/chain.stride));
 const left=Math.max(.12,(chain.deadline-performance.now())/1000);
 const tb=Math.max(.07,Math.min(chain.fast?.3:.45,left/leavesLeft));
 beginTurn(next,{k:Math.pow(5.2/tb,2),v:2.5,finishAt:.97});
}

let drag=null,suppressSpreadClick=false;
function dragSetP(d,x,y,now){
 const raw=d.T.fwd?(d.x0-x):(x-d.x0);
 d.T.target=clamp01(raw/(d.T.pw*1.5));d.T.yRel=clamp01((y-d.top)/d.h);
 d.hist.push([now,d.T.target]);while(d.hist.length>2&&now-d.hist[0][0]>110)d.hist.shift();
}
function startDrag(d,e,fwd){
 const target=fwd?PGI+1:PGI-1;
 if(target<0||target>=PG.length||pageTurning)return false;
 pageTurning=true;
 const T=createTurn(PGI,target,fwd);
 Object.assign(T,{mode:"drag",k:SPRING.drag.k,z:SPRING.drag.z});
 curTurn=T;d.T=T;
 const r=$("spread").getBoundingClientRect();d.top=r.top;d.h=r.height||1;
 $("spread").classList.add("dragging");
 try{$("spread").setPointerCapture(e.pointerId)}catch(_){}
 suppressSpreadClick=true;
 applyTurn(T);runTurn(T);
 return true;
}
function releaseDrag(cancelled){
 const d=drag;drag=null;if(!d)return;
 setTimeout(()=>suppressSpreadClick=false,350);
 if(!d.T){return}
 const T=d.T,now=performance.now(),h0=d.hist[0],h1=d.hist[d.hist.length-1];
 const vel=(h1&&h0&&h1[0]>h0[0]&&now-h1[0]<120)?(h1[1]-h0[1])/((h1[0]-h0[0])/1000):0;
 const complete=!cancelled&&(T.target+vel*.15>.5);
 Object.assign(T,{mode:"free",k:SPRING.free.k,z:SPRING.free.z,target:complete?1:0});
 T.v=Math.max(-4,Math.min(4,T.v+vel*.35));
}
(function(){
 const sp=$("spread");
 sp.addEventListener("pointerdown",e=>{
  if(e.pointerType==="mouse"&&e.button!==0)return;
  if(drag||pageTurning)return;
  drag={id:e.pointerId,x0:e.clientX,y0:e.clientY,T:null,hist:[],top:0,h:1,swiped:false};
 });
 sp.addEventListener("pointermove",e=>{
  const d=drag;if(!d||e.pointerId!==d.id)return;
  const dx=e.clientX-d.x0,dy=e.clientY-d.y0;
  if(!d.T){
   if(Math.abs(dx)<8||Math.abs(dx)<Math.abs(dy)*1.2)return;
   if(reducedMotion()){d.swiped=true;return}
   if(!startDrag(d,e,dx<0)){drag=null;return}
  }
  dragSetP(d,e.clientX,e.clientY,performance.now());
 });
 const up=e=>{
  const d=drag;if(!d||e.pointerId!==d.id)return;
  if(d.swiped&&!d.T){const dx=e.clientX-d.x0;if(Math.abs(dx)>55){suppressSpreadClick=true;setTimeout(()=>suppressSpreadClick=false,350);goLeaf(PGI+(dx<0?1:-1))}drag=null;return}
  releaseDrag(e.type==="pointercancel");
 };
 sp.addEventListener("pointerup",up);
 sp.addEventListener("pointercancel",up);
 sp.addEventListener("lostpointercapture",e=>{if(drag&&drag.T&&e.pointerId===drag.id)releaseDrag(false)});
})();
$("spread").addEventListener("click",e=>{
 if(!suppressSpreadClick)return;
 e.preventDefault();e.stopPropagation();
},true);
$("prev").addEventListener("click",()=>goLeaf(lastTarget()-1));
$("next").addEventListener("click",()=>goLeaf(lastTarget()+1));
$("pj").addEventListener("change",e=>{
 const n=Number.parseInt(e.target.value,10);
 if(Number.isFinite(n)&&n>=1&&n<=PG.length)goLeaf(n-1);
 else toast(`Digite uma página entre 1 e ${PG.length}`);
 e.target.value="";
});
$("pj").addEventListener("keydown",e=>{
 if(e.key==="Enter"){e.preventDefault();e.target.blur();e.target.dispatchEvent(new Event("change"))}
});
$("chips").addEventListener("click",e=>{
 const b=e.target.closest(".chip");if(!b)return;
 const n=Number.parseInt(b.dataset.i,10);
 if(Number.isFinite(n))goLeaf(n);
});
document.addEventListener("keydown",e=>{
 if($("cv").classList.contains("on")){if(e.key==="Escape")closeCard();return}
 if(e.target&&/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return;
 if($("pgAlbum").hidden)return;
 if(e.key==="ArrowRight")goLeaf(lastTarget()+1);
 else if(e.key==="ArrowLeft")goLeaf(lastTarget()-1);
});
function page(n){
  ["Album","Shop","Trade","Rank","Friends","Profile"].forEach(k=>{$("pg"+k).hidden=k!=n;{const nb=$("nav"+k);if(nb)nb.classList.toggle("on",k==n)}});
  scrollTo(0,0);
  try{ if(n=="Trade"){renderMarket();loadStats().then(r=>{if(r){tradeUI();renderMarket()}}).catch(()=>{})} }catch(e){console.warn(e)}
  try{ if(n=="Profile")renderProfile(); }catch(e){console.warn(e)}
  try{ if(n=="Rank")openRanking(); else closeRanking(); }catch(e){console.warn(e)}
}
$("navAlbum").onclick=()=>page("Album");$("navShop").onclick=()=>page("Shop");$("navTrade").onclick=()=>page("Trade");
$("navRank").onclick=()=>page("Rank");
const radialTabs=[];
