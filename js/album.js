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
const radialTabs=[{id:"Friends",label:"Amigos",icon:"👥",kind:"page"}];
const ABAS_REPO="Guimeer23/Memes-png";
const ABAS_REF="refactor/v1.30.15";
function labelAba(s){return s.replace(/[-_]+/g," ").replace(/\b\w/g,m=>m.toUpperCase())}
function iconAba(s){const k=s.toLowerCase();if(k.includes("chat")||k.includes("mensag"))return "💬";if(k.includes("notific")||k.includes("aviso"))return "🔔";if(k.includes("conquist"))return "🏆";if(k.includes("perfil"))return "👤";if(k.includes("evento"))return "🎉";return "📂"}
function toggleRadialMenu(force){const menu=$("radialMenu"),btn=$("navMore");if(!menu||!btn)return;const open=typeof force==="boolean"?force:menu.hidden;menu.hidden=!open;btn.classList.toggle("on",open);btn.setAttribute("aria-expanded",String(open));}
function drawRadialTabs(){const menu=$("radialMenu");menu.innerHTML=radialTabs.map((t,i)=>{const angle=(-135+(i*(105/Math.max(1,radialTabs.length-1))))*Math.PI/180;const x=Math.round(Math.cos(angle)*0);return `<button class="radialItem" data-tab-kind="${t.kind}" data-tab-id="${t.id}" title="${t.label}"><span>${t.icon}</span><small>${t.label}</small></button>`}).join("");}
async function loadRadialTabs(){try{const u=`https://api.github.com/repos/${ABAS_REPO}/contents/jogo/abas?ref=${encodeURIComponent(ABAS_REF)}`;const res=await fetch(u,{headers:{Accept:"application/vnd.github+json"}});if(!res.ok)throw Error("GitHub API "+res.status);const dirs=await res.json();for(const d of dirs){if(d.type!=="dir"||! /^[a-z0-9_-]+$/i.test(d.name)||radialTabs.some(t=>t.id.toLowerCase()===d.name.toLowerCase()))continue;const base=`jogo/abas/${d.name}/`;let pageName=null;for(const candidate of ["index.html","Index.html","INDEX.HTML"]){const check=await fetch(`https://api.github.com/repos/${ABAS_REPO}/contents/${base}${candidate}?ref=${encodeURIComponent(ABAS_REF)}`,{headers:{Accept:"application/vnd.github+json"}});if(check.ok){pageName=candidate;break}}if(!pageName)continue;radialTabs.push({id:d.name,label:labelAba(d.name),icon:iconAba(d.name),kind:"folder",path:base+pageName})}drawRadialTabs()}catch(e){console.warn("Não foi possível carregar abas de jogo/abas:",e);drawRadialTabs()}}
function openCustomTab(t){const ov=$("customTabOverlay"),frame=$("customTabFrame");$("customTabTitle").textContent=t.label;frame.src=t.path;ov.hidden=false;document.body.style.overflow="hidden"}
function closeCustomTab(){const ov=$("customTabOverlay");ov.hidden=true;$("customTabFrame").src="about:blank";document.body.style.overflow=""}
$("navMore").onclick=()=>toggleRadialMenu();
drawRadialTabs();loadRadialTabs();
$("radialMenu").addEventListener("click",e=>{const b=e.target.closest("[data-tab-id]");if(!b)return;const t=radialTabs.find(x=>x.id===b.dataset.tabId);toggleRadialMenu(false);if(!t)return;if(t.kind==="page")page(t.id);else openCustomTab(t)});
$("customTabClose").onclick=closeCustomTab;
$("customTabOverlay").addEventListener("click",e=>{if(e.target===$("customTabOverlay"))closeCustomTab()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){toggleRadialMenu(false);if(!$("customTabOverlay").hidden)closeCustomTab()}});
document.addEventListener("click",e=>{if(!e.target.closest("#radialMenu")&&!e.target.closest("#navMore"))toggleRadialMenu(false)});
$("bonus").onclick=()=>claimBonus();
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
const vib=p=>{try{if(navigator.vibrate)navigator.vibrate(p)}catch(_){}};
const canAnim=()=>!reducedMotion()&&!!document.body.animate;
function bumpEl(el,k,d){if(el&&el.animate)el.animate([{transform:"scale(1)"},{transform:`scale(${k||1.3})`},{transform:"scale(1)"}],{duration:d||220,easing:"ease-out"})}

function openBurst(p,pk){
 const r=pk.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,h=TH[p];
 const mk=(cls,css,ms,tx)=>{const d=document.createElement("div");d.className=cls;d.style.cssText=css;if(tx)d.textContent=tx;return fxAdd(d,ms)};
 mk("flash",`background:radial-gradient(circle at ${x}px ${y}px,rgba(255,255,255,.95),hsl(${h} 95% 60%/.6) 28%,transparent 62%)`,900);
 mk("rays",`left:${x}px;top:${y}px;background:repeating-conic-gradient(hsl(${h} 95% 65%/.7) 0 ${3+p}deg,transparent ${3+p}deg 22deg)`,2400);
 [0,150].forEach(d=>setTimeout(()=>mk("ring",`left:${x}px;top:${y}px;--c:hsl(${h} 95% 65%)`,1300),d));
 for(let i=0;i<14+p*3;i++){const a=rnd(0,6.283),d=rnd(70,170+p*14);
  mk("pt dot",`left:${x}px;top:${y}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;--rot:${rnd(-540,540)}deg;--d:${rnd(.7,1.4)}s;--cc:hsl(${h+rnd(-25,25)} 95% ${rnd(55,75)}%)`,1600)}
}
function sparkPop(el,t){
 const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,h=TH[t];
 for(let i=0;i<9;i++){const a=rnd(0,6.283),d=rnd(40,85),dd=document.createElement("div");dd.className="pt dot";
  dd.style.cssText=`left:${x}px;top:${y}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;--rot:${rnd(-360,360)}deg;--d:${rnd(.45,.8)}s;--cc:hsl(${h+rnd(-15,15)} 90% 65%)`;fxAdd(dd,900)}
}

let coinDisp=null,coinFly=0,lastVib=0,cfTimer=0;
function gainCoins(amount,from){
 amount=Math.round(amount);
 let ox=innerWidth/2,oy=innerHeight*.55;
 if(from&&from.getBoundingClientRect){const r=from.getBoundingClientRect();ox=r.left+r.width/2;oy=r.top+r.height/2}
 else if(from&&from.x!=null){ox=from.x;oy=from.y}
 const before=A.coins;A.coins+=amount;save();
 const anim=amount>0&&canAnim()&&$("coins");
 if(anim&&coinDisp===null)coinDisp=before;
 render();
 if(!anim)return;
 let tgt=$("coins"),T=tgt.getBoundingClientRect();
 if(T.bottom<10||T.top>innerHeight){
  const cf=$("coinFloat");cf.classList.add("on");$("cfNum").textContent=Math.round(coinDisp);
  clearTimeout(cfTimer);tgt=cf;T=cf.getBoundingClientRect()}
 const tx=T.left+T.width/2,ty=T.top+T.height/2;
 const n=Math.max(3,Math.min(14,Math.round(Math.sqrt(amount)/1.6)));
 let remaining=amount;
 for(let i=0;i<n;i++){
  const share=i===n-1?remaining:Math.round(amount/n);remaining-=share;
  coinFly++;
  const c=document.createElement("div");c.className="gcoin";c.textContent="🪙";document.body.append(c);
  const a=-Math.PI/2+(Math.random()-.5)*2.6,d=45+Math.random()*70;
  const bx=ox+Math.cos(a)*d,by=oy+Math.sin(a)*d-10;
  const b=c.animate([{transform:`translate(${ox-12}px,${oy-12}px) scale(.2) rotate(0deg)`,opacity:0},
   {transform:`translate(${bx-12}px,${by-12}px) scale(1.15) rotate(${Math.round(Math.random()*180)}deg)`,opacity:1}],
   {duration:340,easing:"cubic-bezier(.2,.9,.3,1)",fill:"forwards"});
  b.onfinish=()=>setTimeout(()=>{
   const mx=(bx+tx)/2+(Math.random()*60-30),my=Math.min(by,ty)-50-Math.random()*40,kf=[];
   for(let k=0;k<=6;k++){const t=k/6,u=1-t,x=u*u*bx+2*u*t*mx+t*t*tx,y=u*u*by+2*u*t*my+t*t*ty;
    kf.push({transform:`translate(${x-12}px,${y-12}px) scale(${(1.15-.55*t).toFixed(2)}) rotate(${Math.round(t*360)}deg)`,offset:t})}
   const f=c.animate(kf,{duration:560,easing:"cubic-bezier(.55,.05,.8,.5)",fill:"forwards"});
   f.onfinish=()=>{c.remove();coinArrive(share,tgt)};
  },90+i*50);
  setTimeout(()=>{if(c.isConnected&&!c.getAnimations().length){c.remove()}},4000);
 }
}
function coinArrive(share,tgt){
 if(coinDisp!==null){coinDisp=Math.min(A.coins,coinDisp+share);const v=Math.round(coinDisp);$("coins").textContent=v;$("cfNum").textContent=v}
 bumpEl(tgt.id==="coinFloat"?tgt:$("coins").parentElement,1.28,200);
 const now=performance.now();if(now-lastVib>45){lastVib=now;vib(coinFly<=1?[30,40,50]:9)}
 if(--coinFly<=0){coinFly=0;coinDisp=null;$("coins").textContent=A.coins;$("cfNum").textContent=A.coins;
  clearTimeout(cfTimer);cfTimer=setTimeout(()=>$("coinFloat").classList.remove("on"),700)}
}

function collectCards(els,done){
 const tgt=$("navAlbum");
 if(!canAnim()||!els.length){done();return}
 $("actions").innerHTML="";$("hint").textContent="";
 const tr=tgt.getBoundingClientRect(),tx=tr.left+tr.width/2,ty=tr.top+tr.height/2;
 const zz=parseFloat(getComputedStyle($("cards")).getPropertyValue("--z"))||1;
 let left=els.length;
 $("open").classList.add("fadeout");
 els.forEach((el,i)=>{
  const r=el.getBoundingClientRect();
  const w=document.createElement("div");w.className="cfly";w.style.width=r.width+"px";w.style.height=r.height+"px";
  const cl2=el.cloneNode(true);cl2.className="card flip";
  cl2.style.cssText=`position:absolute;left:0;top:0;opacity:1;animation:none;pointer-events:none;--z:${zz}`;
  const inn=cl2.querySelector(".inner");if(inn)inn.style.animation="none";
  w.appendChild(cl2);document.body.append(w);el.style.visibility="hidden";
  const sx=r.left,sy=r.top,ex=tx-r.width/2,ey=ty-r.height/2,fs=Math.max(.14,28/r.width);
  const mx=(sx+ex)/2+(Math.random()*90-45),my=Math.min(sy,ey)-80-Math.random()*60,rot=(Math.random()*60-30),kf=[];
  for(let k=0;k<=6;k++){const t=k/6,u=1-t,x=u*u*sx+2*u*t*mx+t*t*ex,y=u*u*sy+2*u*t*my+t*t*ey;
   kf.push({transform:`translate(${x}px,${y}px) scale(${(1+(fs-1)*Math.pow(t,1.4)).toFixed(3)}) rotate(${(rot*t).toFixed(1)}deg)`,offset:t})}
  const a=w.animate(kf,{duration:640,delay:i*65,easing:"cubic-bezier(.45,.05,.7,.4)",fill:"both"});
  a.onfinish=()=>{w.remove();bumpEl(tgt,1.25,200);const now=performance.now();if(now-lastVib>45){lastVib=now;vib(left<=1?[25,30,45]:9)}
   if(--left<=0)setTimeout(done,200)};
 });
 setTimeout(()=>{if(left>0){left=0;document.querySelectorAll(".cfly").forEach(n=>n.remove());done()}},1200+els.length*90+800);
}

const CV={on:false,ang:0,tilt:0,v:0,tv:0,target:0,raf:0,last:0,drag:null,id:0};
function chanceTxt(s0){
 if(s0.k==="s")return `Secreta · edição de ${s0.lim}`;
 if(s0.k==="e")return `Evento ${s0.ev}`;
 const ps=[];for(let p=0;p<9;p++){const w=wt(p)[s0.t]/BY[s0.t].length;if(w>0)ps.push(w)}
 return ps.length?`Chance/carta: ${fmt(Math.min(...ps))}–${fmt(Math.max(...ps))}`:"";
}
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
function priceInfo(s){
 const base=CARD_BASE[s.t],ok=STATS.ok&&STATS.n>=1,own=ok?Math.min(STATS.n,Math.max(0,STATS.c[s.id]||0)):null,
  extra=ok?Math.round(base*1.5*(1-own/STATS.n)):0;
 return{base,extra,total:base+extra,own,n:STATS.n,ok}}
/* ===== v1.42: preço de referência, faixas de negociação e venda automática ===== */
const SELL_RATE=.5;
const BANDS=[{n:"Venda mais barata",a:.8,b:.9,c:"#2563eb"},{n:"Negociação equilibrada",a:.9,b:1.2,c:"#16a34a"},{n:"Carta muito disputada",a:1.2,b:1.5,c:"#e8432e"}];
const refPrice=s=>priceInfo(s).total;
const autoPrice=s=>Math.floor(refPrice(s)*SELL_RATE);
const bandsOf=ref=>BANDS.map(x=>({n:x.n,c:x.c,lo:Math.round(ref*x.a),hi:Math.round(ref*x.b)}));
function priceNote(price,ref){
 if(!(price>0)||!(ref>0))return"";
 const r=price/ref,pct=Math.round(r*100);
 const b=r<.8?"abaixo das faixas sugeridas":r<.9?"venda mais barata":r<=1.2?"negociação equilibrada":r<=1.5?"carta muito disputada":"acima das faixas sugeridas";
 return `${pct}% da referência · ${b}`}
const BK=[["#9ec5ff","#1f3a5f"],["#6fe3e3","#0f4b52"],["#4cd37a","#0c3a1d"],["#ffd24a","#5a3a00"],["#ff8a3c","#5a1608"],["#c04df0","#2a0c52"],["#ffb02e","#5a1a00"],["#3df5ff","#0a1e5c"],["#c78bff","#1a0838"]],BE=["⭐","🌟","🍀","🪙","💥","🔮","🔥","⚡","✨"];
function backHtml(s0,own,pgx){
 const k=s0.k,t=s0.t,h=s0.h||0;let cls="r"+t,a,b,em=BE[t];
 if(k=="s"){cls="ks";a="#ffd24a";b="#1a1200";em="🔒"}
 else if(k=="e"){cls="ke";a=`hsl(${h} 95% 66%)`;b=`hsl(${h} 70% 16%)`;em="🎉"}
 else[a,b]=BK[t];
 return `<div class="cvf bk art ${cls}" style="--a:${a};--b:${b};--h:${h}"><div class="bmed">${em}</div><div class="btier">${LB(s0)}</div>${t>=3||k!="m"?'<i class="bsh"></i>':""}</div>`}
function chanceShort(s0){const ps=[];for(let p=0;p<9;p++){const w=wt(p)[s0.t]/BY[s0.t].length;if(w>0)ps.push(w)}
 if(!ps.length)return"—";const a=fmt(Math.min(...ps)),b=fmt(Math.max(...ps));return a==b?a:a.replace("%","")+"–"+b}
function fitCv(){
 const c=$("cvCard");if(!c)return;
 const pe=c.querySelector(".pe"),art=c.querySelector(".part");
 if(pe&&art)pe.style.fontSize=Math.max(14,Math.floor(Math.min(art.clientHeight*.68,art.clientWidth*.5)))+"px";
 const fs=e=>parseFloat(getComputedStyle(e).fontSize),
  shr=(e,bad,min)=>{let f=fs(e);while(bad()&&f>min){f-=.25;e.style.fontSize=f+"px"}return f};
 c.querySelectorAll(".pnm,.psp").forEach(e=>shr(e,()=>e.scrollWidth>e.clientWidth+.5,3));
 c.querySelectorAll(".btier").forEach(e=>shr(e,()=>e.scrollWidth>e.clientWidth+.5,3));
 const pf=c.querySelector(".pft");if(pf)shr(pf,()=>pf.scrollWidth>pf.clientWidth+.5,3);
 const rows=[...c.querySelectorAll(".pr")];let m=99;
 rows.forEach(r=>{const sp=r.querySelector("span");m=Math.min(m,shr(r,()=>r.scrollWidth>r.clientWidth+.5||sp.scrollWidth>sp.clientWidth+.5,3))});
 rows.forEach(r=>r.style.fontSize=m+"px")}
function cvFaces(s0){
 const h=s0.k==="e"?s0.h:TH[s0.t],pgx=s0.hid?{e:s0.k=="s"?"🔒":"🎉",n:"Conquista"}:PG[s0.pg],own=ownOf(s0),em=s0.t>=2?BC[s0.t][2]:"⭐";
 const pi=priceInfo(s0),cr=s0.k=="s"?["Edição",`${s0.lim} un.`]:s0.k=="e"?["Evento",s0.ev]:["Chance",chanceShort(s0)];
 const front=`<div class="cvf fr pk" style="background:${bg(s0)};border-color:${bc(s0)};${s0.t>=5?`box-shadow:0 0 22px hsl(${TH[s0.t]} 100% 60%)`:""}"><div class="ph1"><span class="pnm">${s0.n}</span><span class="ppr">🪙 ${pi.total}</span></div><div class="part"><span class="pid">#${s0.id}</span>${s0.k==="m"?imgTag(s0,"pimg",1):`<span class="pe">${s0.e}</span>`}</div><div class="psp">${pgx.e} ${pgx.n}${s0.hid?"":` · p. ${s0.pg*2+1}–${s0.pg*2+2}`}</div><div class="pbox"><div class="pr"><b>Raridade</b><span>${LB(s0)}</span></div><div class="pr"><b>${cr[0]}</b><span>${cr[1]}</span></div><div class="pr"><b>Donos</b><span>${pi.ok?pi.own+" de "+pi.n:"—"}</span></div><div class="pr"><b>Valor</b><span>${pi.base}${pi.extra?" +"+pi.extra:""}</span></div></div><div class="pft"><span>Você: ×${own}</span><span>${s0.hid?"conquista ✔":A.pasted[s0.id]?"colada ✔":"não colada"}</span></div></div>`;
 const back=backHtml(s0,own,pgx);
 return front+back;
}
function sizeCv(){const z=Math.max(1.2,Math.min(3.2,innerWidth*.66/96,innerHeight*.56/144));$("cv").style.setProperty("--cz",z.toFixed(2))}
function applyCv(){
 const a=CV.ang,card=$("cvCard"),n=((a%360)+360)%360,rad=a*Math.PI/180;
 card.style.transform=`rotateX(${CV.tilt.toFixed(2)}deg) rotateY(${a.toFixed(2)}deg)`;
 AM.flip(rad);card.style.setProperty("--sx",(130-n/360*260).toFixed(1)+"%");card.style.setProperty("--dim",(1-.28*Math.abs(Math.sin(rad))).toFixed(3));
 const f=card.querySelector(".fr");if(f){f.style.setProperty("--sx",(130-n/360*260).toFixed(1)+"%");f.style.setProperty("--ho",S[CV.id-1].t>=3?".9":".25")}
}
function cvLoop(ts){
 if(!CV.on||CV.drag)return;
 const dt=Math.min((ts-CV.last)/1000||.016,1/30);CV.last=ts;
 const k=150,c=2*.8*Math.sqrt(k),n=4,h=dt/n;
 for(let j=0;j<n;j++){
  CV.v+=(-k*(CV.ang-CV.target)-c*CV.v)*h;CV.ang+=CV.v*h;
  CV.tv+=(-k*CV.tilt-c*CV.tv)*h;CV.tilt+=CV.tv*h}
 applyCv();
 if(Math.abs(CV.ang-CV.target)<.15&&Math.abs(CV.v)<1&&Math.abs(CV.tilt)<.15&&Math.abs(CV.tv)<1){CV.ang=CV.target;CV.tilt=0;applyCv();return}
 CV.raf=requestAnimationFrame(cvLoop);
}
function cvGo(){cancelAnimationFrame(CV.raf);CV.last=performance.now();CV.raf=requestAnimationFrame(cvLoop)}
function fxN(css,kf,dur,delay,ease,html){const e=document.createElement("div");
 e.style.cssText="position:absolute;left:0;top:0;opacity:0;pointer-events:none;will-change:transform,opacity;"+css;if(html!=null)e.innerHTML=html;
 $("cvfx").appendChild(e);const a=e.animate(kf,{duration:dur,delay:delay||0,easing:ease||"ease-out",fill:"both"});a.onfinish=()=>e.remove();return e}
const TR=(x,y,x2)=>`translate(${x}px,${y}px)`;
function fxDots(cx,cy,n,cols,d0,d1,dur,sz){for(let i=0;i<n;i++){const a=rnd(0,6.283),d=rnd(d0,d1),z=rnd(sz[0],sz[1]),c=cols[i%cols.length];
 fxN(`width:${z}px;height:${z}px;border-radius:50%;background:${c};box-shadow:0 0 ${z*2}px ${c}`,[{transform:TR(cx,cy)+" scale(1)",opacity:1},{transform:TR(cx+Math.cos(a)*d,cy+Math.sin(a)*d)+" scale(.2)",opacity:0}],dur*rnd(.7,1.1),rnd(0,120))}}
function fxRing(cx,cy,c,z,dur,delay,bw){fxN(`width:${z}px;height:${z}px;border-radius:50%;border:${bw||3}px solid ${c};box-shadow:0 0 18px ${c},inset 0 0 14px ${c}`,[{transform:TR(cx-z/2,cy-z/2)+" scale(.15)",opacity:.95},{transform:TR(cx-z/2,cy-z/2)+" scale(1)",opacity:0}],dur,delay)}
function fxEmo(cx,cy,ch,z,x1,y1,dur,delay,rot,css){fxN(`font-size:${z}px;line-height:1;${css||""}`,[{transform:TR(cx,cy)+" scale(.3)",opacity:0},{opacity:1,offset:.2},{transform:TR(cx+x1,cy+y1)+` scale(1) rotate(${rot||0}deg)`,opacity:0}],dur,delay,"cubic-bezier(.2,.7,.4,1)",ch)}
function fxSpark(cx,cy,r0,r1,c,dur,delay){const a=rnd(0,6.283),d=a*180/Math.PI;
 fxN(`width:${rnd(10,22)}px;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,${c});box-shadow:0 0 6px ${c}`,[{transform:TR(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0)+` rotate(${d}deg)`,opacity:1},{transform:TR(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1)+` rotate(${d}deg)`,opacity:0}],dur,delay)}
function fxSpiral(cx,cy,n,cols,rmin,rmax,dur,arms){for(let i=0;i<n;i++){const a0=(i%arms)*(360/arms)+rnd(-12,12),r=rnd(rmin,rmax),z=rnd(2,4.5),c=cols[i%cols.length];
 fxN(`width:${z}px;height:${z}px;border-radius:50%;background:${c};box-shadow:0 0 ${z*3}px ${c}`,[{transform:TR(cx,cy)+` rotate(${a0}deg) translateX(0px)`,opacity:0},{opacity:1,offset:.2},{transform:TR(cx,cy)+` rotate(${a0+480}deg) translateX(${r}px)`,opacity:0}],dur,i*14,"cubic-bezier(.25,.6,.3,1)")}}
function fxFace(kf,dur){document.querySelectorAll("#cvCard .cvf").forEach(f=>f.animate(kf,{duration:dur}))}
const fxGlow=(p,sat)=>fxFace([{filter:"brightness(1)"},{filter:`brightness(${p||1.7}) saturate(${sat||1.5})`,offset:.3},{filter:"brightness(1)"}],750);
function fxShake(px){$("cvStage").animate([{transform:"translate(0,0)"},{transform:`translate(${-px}px,${px/2}px)`},{transform:`translate(${px}px,${-px/2}px)`},{transform:`translate(${-px/2}px,${px}px)`},{transform:"translate(0,0)"}],{duration:450,easing:"ease-out"})}
function fxBolt(x0,y0,x1,y1,delay,wd){const pts=[[x0,y0]],n=9,len=Math.hypot(x1-x0,y1-y0),nx=-(y1-y0)/len,ny=(x1-x0)/len;
 for(let i=1;i<n;i++){const k=i/n,j=rnd(-1,1)*len*.07;pts.push([x0+(x1-x0)*k+nx*j,y0+(y1-y0)*k+ny*j])}pts.push([x1,y1]);
 const P=pts.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" "),ln=(c,w,x)=>`<polyline points="${P}" fill="none" stroke="${c}" stroke-width="${w*(wd||1)}" stroke-linejoin="round" stroke-linecap="round" ${x||""}/>`;
 fxN("width:100%;height:100%;mix-blend-mode:screen",[{opacity:0},{opacity:1,offset:.1},{opacity:.35,offset:.3},{opacity:1,offset:.45},{opacity:0}],520,delay,"linear",
  `<svg style="position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible">${ln("#2a6cff",9,'opacity=".6" style="filter:blur(3px)"')}${ln("#3df5ff",4)}${ln("#fff",1.7)}</svg>`)}
function cvTap(){
 if(!CV.on)return;const s0=S[CV.id-1],t=s0.t,now=performance.now();
 if(now<(CV.fxT||0))return;CV.fxT=now+(t>=6?1500:t>=3?650:280);
 const q=$("cvStage").getBoundingClientRect(),cx=q.left+q.width/2,cy=q.top+q.height/2,w=q.width,h=q.height,
  col=s0.k=="s"?["#ffd24a","#b8860b"]:t>=2?BC[t]:t==1?["#6fe3e3","#9ff"]:["#9ec5ff","#fff"],W=innerWidth,H=innerHeight,mx=Math.max(w,h);
 if(reducedMotion()){fxRing(cx,cy,col[0],mx*1.1,600);return}
 const key=s0.k=="s"||s0.k=="e"?s0.k:t;if(key!==0&&key!==1){cvBurst2(key,s0,cx,cy,w,h,mx);return}
 if(t==0){fxDots(cx,cy,10,["#fff",col[0]],w*.35,w*.75,550,[3,5]);fxRing(cx,cy,"rgba(255,255,255,.7)",w*.9,550,0,2);vib(8)}
 else if(t==1){fxRing(cx,cy,col[0],mx*1.15,650);fxDots(cx,cy,14,[col[0],"#fff"],w*.4,w*.9,650,[3,6]);vib(10)}
 else if(t==2){for(let i=0;i<11;i++)fxEmo(cx+rnd(-w/2,w/2),cy+h*.3,"🍀",rnd(18,30),rnd(-45,45),-rnd(110,220),rnd(1100,1600),i*60,rnd(-140,140));fxDots(cx,cy,10,[col[0],"#fff"],w*.4,w,800,[3,5]);fxGlow(1.4,1.3);vib(14)}
 else if(t==3){fxGlow(1.8,1.5);fxRing(cx,cy,col[0],mx*1.3,800);
  for(let i=0;i<16;i++){const dx=rnd(-w*.9,w*.9);fxN("font-size:26px;line-height:1",[{transform:TR(cx,cy-h*.3)+" scale(.4)",opacity:0},{transform:TR(cx+dx*.5,cy-h*.3-rnd(70,160))+" scale(1)",opacity:1,offset:.28},{transform:TR(cx+dx,cy+h*.95)+" rotate(540deg)",opacity:0}],rnd(1100,1500),i*45,"cubic-bezier(.3,.6,.5,1)","🪙")}vib(16)}
 else if(t==4){fxGlow(1.9,1.7);fxShake(7);fxRing(cx,cy,col[0],mx*1.7,700);fxRing(cx,cy,col[1],mx*1.2,600,120,4);
  for(let i=0;i<22;i++)fxSpark(cx,cy,w*.25,rnd(w*.8,w*1.5),i%2?col[0]:"#ffe27a",rnd(500,800),rnd(0,100));
  fxN("font-size:76px;line-height:1",[{transform:TR(cx-38,cy-38)+" scale(.2)",opacity:1},{transform:TR(cx-38,cy-38)+" scale(1.5)",opacity:1,offset:.4},{transform:TR(cx-38,cy-38)+" scale(1.9)",opacity:0}],700,0,"ease-out","💥");vib(22)}
 else if(t==5){const R=mx*1.25;fxGlow(1.6,1.6);
  fxN(`width:${R}px;height:${R}px;border-radius:50%;border:2px dashed #c04df0;box-shadow:0 0 22px #c04df0,inset 0 0 22px rgba(192,77,240,.55)`,[{transform:TR(cx-R/2,cy-R/2)+" scale(.4) rotate(0)",opacity:0},{opacity:.95,offset:.25},{transform:TR(cx-R/2,cy-R/2)+" scale(1.12) rotate(200deg)",opacity:0}],1400);
  fxN(`width:${R*.72}px;height:${R*.72}px;border-radius:50%;border:2px dotted #ff8bff;box-shadow:0 0 16px #c04df0`,[{transform:TR(cx-R*.36,cy-R*.36)+" scale(.4) rotate(0)",opacity:0},{opacity:.9,offset:.25},{transform:TR(cx-R*.36,cy-R*.36)+" scale(1.15) rotate(-260deg)",opacity:0}],1400,80);
  "✦ᚠᚨᛉᛟᚱᛞ✦ᛋ".split("").forEach((g,i)=>{const a=i/8*6.283;fxEmo(cx+Math.cos(a)*R*.4-10,cy+Math.sin(a)*R*.4-10,g,20,0,-12,1200,i*70,0,"color:#e6b8ff;text-shadow:0 0 10px #c04df0")});
  fxSpiral(cx,cy,26,["#c04df0","#e6b8ff","#8f5bff"],mx*.5,mx*1.1,1300,2);vib([20,30,30])}
 else if(t==6){fxGlow(1.7,1.6);fxShake(4);const hs=mx*2.1;
  fxN(`width:${hs}px;height:${hs}px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,70,.85),rgba(255,90,0,.45) 40%,transparent 68%);mix-blend-mode:screen`,[{transform:TR(cx-hs/2,cy-hs/2)+" scale(.4)",opacity:0},{transform:TR(cx-hs/2,cy-hs/2)+" scale(1)",opacity:.9,offset:.35},{transform:TR(cx-hs/2,cy-hs/2)+" scale(1.15)",opacity:0}],1700);
  for(let i=0;i<30;i++){const z=rnd(16,34),x=cx+rnd(-w/2,w/2)-z/2,y=cy+h*.45;
   fxN(`width:${z}px;height:${z*1.7}px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:radial-gradient(ellipse at 50% 72%,#fff7b0 0,#ffc53a 28%,#ff6a00 58%,rgba(255,40,0,0) 74%);mix-blend-mode:screen;filter:blur(1px)`,
   [{transform:TR(x,y)+" scale(.5,.6)",opacity:0},{opacity:.95,offset:.2},{transform:TR(x+rnd(-16,16),y-rnd(h*.35,h*.6))+" scale(1.05,1.2)",opacity:.9,offset:.55},{transform:TR(x+rnd(-30,30),y-h*1.05)+" scale(.3,.5)",opacity:0}],rnd(1100,1800),rnd(0,650))}
  for(let i=0;i<36;i++){const z=rnd(2,4.5),x=cx+rnd(-w/2,w/2),y=cy+h*.4;fxN(`width:${z}px;height:${z}px;border-radius:50%;background:#ffd24a;box-shadow:0 0 8px #ff9a1f`,[{transform:TR(x,y),opacity:0},{opacity:1,offset:.15},{transform:TR(x+rnd(-50,50),y-rnd(h*.6,h*1.3)),opacity:0}],rnd(1200,2300),rnd(0,800),"cubic-bezier(.2,.6,.3,1)")}
  fxRing(cx,cy,"#ffb02e",mx*1.6,900,0,4);fxRing(cx,cy,"#ff4d00",mx*1.1,800,160,3);vib([30,40,60,40,90])}
 else if(t==7){fxGlow(1.9,1.4);fxShake(6);
  fxN("width:100%;height:100%;background:radial-gradient(circle at 50% 45%,#bff9ff,rgba(42,108,255,.55) 45%,rgba(0,0,0,0) 75%);mix-blend-mode:screen",[{opacity:0},{opacity:.9,offset:.08},{opacity:.2,offset:.2},{opacity:.8,offset:.3},{opacity:0}],900,0,"linear");
  [0,130,270].forEach((d,i)=>{const x0=cx+rnd(-w*1.4,w*1.4);fxBolt(x0,-10,cx+rnd(-w*.3,w*.3),cy+rnd(-h*.2,h*.3),d,1);if(i<2)fxBolt(cx+rnd(-w*.4,w*.4),cy-h*.2,cx+rnd(-w*1.3,w*1.3),cy+rnd(h*.2,h*.9),d+60,.55)});
  for(let i=0;i<26;i++)fxSpark(cx,cy,w*.35,rnd(w*.8,w*1.6),i%2?"#3df5ff":"#fff",rnd(350,650),rnd(0,260));
  fxRing(cx,cy,"#3df5ff",mx*1.6,800,0,3);fxRing(cx,cy,"#2a6cff",mx*1.2,700,140,2);vib([20,20,20,20,80])}
 else if(t==8){fxFace([{filter:"hue-rotate(0deg) brightness(1)"},{filter:"hue-rotate(180deg) brightness(1.5) saturate(1.7)",offset:.5},{filter:"hue-rotate(360deg) brightness(1)"}],1500);fxShake(3);
  const nb=mx*2.4;fxN(`width:${nb}px;height:${nb}px;border-radius:50%;background:radial-gradient(circle at 38% 38%,rgba(255,107,214,.85),transparent 55%),radial-gradient(circle at 66% 62%,rgba(90,110,255,.85),transparent 55%),radial-gradient(circle,rgba(190,130,255,.6),transparent 66%);mix-blend-mode:screen`,
   [{transform:TR(cx-nb/2,cy-nb/2)+" scale(.2) rotate(0)",opacity:0,filter:"hue-rotate(0deg)"},{opacity:.9,offset:.3},{transform:TR(cx-nb/2,cy-nb/2)+" scale(1) rotate(130deg)",opacity:0,filter:"hue-rotate(240deg)"}],2000);
  fxSpiral(cx,cy,72,["#fff","#ffb3f0","#8fe9ff","#c9a8ff"],mx*.6,Math.max(W,H)*.7,1900,3);
  [300,190,50].forEach((hh,i)=>fxRing(cx,cy,`hsl(${hh} 95% 65%)`,mx*2.3,1400,i*150,2));
  for(let i=0;i<4;i++){const x0=rnd(-80,W*.6),y0=rnd(0,H*.4);fxN("width:120px;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,#fff);box-shadow:0 0 8px #bfa8ff",[{transform:TR(x0,y0)+" rotate(25deg)",opacity:0},{opacity:1,offset:.15},{transform:TR(x0+520,y0+243)+" rotate(25deg)",opacity:0}],900,i*220+rnd(0,120),"ease-in")}
  for(let i=0;i<12;i++)fxEmo(cx+rnd(-w*.7,w*.7),cy+rnd(-h*.6,h*.6),"✨",rnd(16,30),rnd(-20,20),-rnd(20,60),rnd(900,1500),rnd(0,700),rnd(-40,40));
  vib([30,30,30,30,30,30,120])}
}
const AM=(()=>{
const SV=x=>`<svg viewBox="-150 -150 300 300" style="width:100%;height:100%;overflow:visible"><defs>${[["gB","#2a8cff"],["gG","#ffd24a"],["gO","#ff7a2e"],["gP","#a64dff"],["gC","#3df5ff"],["gM","#ff3df0"],["gW","#ffffff"]].map(([i,c])=>`<radialGradient id="${i}"><stop offset="0" stop-color="${c}" stop-opacity=".85"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join("")}<radialGradient id="gV"><stop offset="0" stop-color="#000"/><stop offset=".55" stop-color="#2a0d00"/><stop offset=".9" stop-color="#ff9a1f" stop-opacity=".8"/><stop offset="1" stop-color="#ff9a1f" stop-opacity="0"/></radialGradient><radialGradient id="gE"><stop offset="0" stop-color="#000"/><stop offset=".72" stop-color="#000"/><stop offset=".8" stop-color="#ffd24a"/><stop offset=".9" stop-color="#b8860b" stop-opacity=".45"/><stop offset="1" stop-color="#b8860b" stop-opacity="0"/></radialGradient></defs>${x}</svg>`;
const aT=(t,v,d,x)=>`<animateTransform attributeName="transform" type="${t}" values="${v}" dur="${d}s" repeatCount="indefinite" ${x||""}/>`;
const aA=(a,v,d,x)=>`<animate attributeName="${a}" values="${v}" dur="${d}s" repeatCount="indefinite" ${x||""}/>`;
const rot=(d,rev)=>aT("rotate",rev?"360;0":"0;360",d);
const el=(rx,ry)=>`M${-rx} 0A${rx} ${ry} 0 1 1 ${rx} 0A${rx} ${ry} 0 1 1 ${-rx} 0`;
const f1=n=>(+n).toFixed(1),rr=(a,b)=>a+Math.random()*(b-a),PI=Math.PI;
const GL="ᚠᛉᚨᛟᚱᛞᛗᛜᚷᚺᛇᛏ";
const glyphs=(n,r,sz,c)=>{let s="";for(let i=0;i<n;i++)s+=`<text transform="rotate(${i*360/n}) translate(0,${-r})" font-size="${sz}" fill="${c}" text-anchor="middle" style="font-family:serif">${GL[i%GL.length]}</text>`;return s};
const bolt=(x0,y0,x1,y1)=>{const n=8,L=Math.hypot(x1-x0,y1-y0),nx=-(y1-y0)/L,ny=(x1-x0)/L;let p=[[x0,y0]];for(let i=1;i<n;i++){const k=i/n,j=rr(-1,1)*L*.08;p.push([x0+(x1-x0)*k+nx*j,y0+(y1-y0)*k+ny*j])}p.push([x1,y1]);return p.map(a=>f1(a[0])+","+f1(a[1])).join(" ")};
const flick=(d,b)=>aA("opacity","0;0;1;.25;1;0;0",d,`begin="${b}s" keyTimes="0;.55;.58;.64;.7;.78;1"`);
const star=(x,y,c,r,d)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}">${aA("opacity",".15;1;.15",d,`begin="-${f1(rr(0,d))}s"`)}</circle>`;
const fwk=(pts,cs,d,o0)=>{let b="";pts.forEach(([x,y],k)=>{const c=cs[k%cs.length],c2=cs[(k+2)%cs.length],o=(o0||0)+k*.55;let r="";for(let i=0;i<14;i++){const a=i*PI/7;r+=`<line x1="${f1(Math.cos(a)*7)}" y1="${f1(Math.sin(a)*7)}" x2="${f1(Math.cos(a)*30)}" y2="${f1(Math.sin(a)*30)}" stroke="${i%2?c:c2}" stroke-width="2.2" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`}
 b+=`<g transform="translate(${x},${y})"><g opacity="0">${r}<circle r="3" fill="#fff"/>${aT("scale",".1;1;1.15",d,`begin="${o}s" keyTimes="0;.5;1" calcMode="spline" keySplines=".1 .7 .3 1;.3 0 .7 1"`)}${aA("opacity","0;1;.9;0",d,`begin="${o}s" keyTimes="0;.08;.6;1"`)}</g></g>`});return b};
const drift=(inner,x0,y0,x1,y1,d,extra)=>`<g>${aT("translate",`${x0},${y0};${x1},${y1}`,d,`begin="-${f1(rr(0,d))}s"`)}${inner}</g>`;
const web=(x,y,sx)=>{let p="";const R=[16,30,46];for(let k=0;k<5;k++){const a=k*PI/8;p+=`M${x} ${y}L${f1(x+sx*Math.cos(a)*50)} ${f1(y+Math.sin(a)*50)}`}
 R.forEach(r=>{for(let k=0;k<4;k++){const a=k*PI/8,b=(k+1)*PI/8;p+=`M${f1(x+sx*Math.cos(a)*r)} ${f1(y+Math.sin(a)*r)}Q${f1(x+sx*Math.cos((a+b)/2)*r*.86)} ${f1(y+Math.sin((a+b)/2)*r*.86)} ${f1(x+sx*Math.cos(b)*r)} ${f1(y+Math.sin(b)*r)}`}});
 return`<path d="${p}" fill="none" stroke="#e6dcf5" stroke-opacity=".55" stroke-width=".7"/><g transform="translate(${x+sx*26},${y+8})"><g>${aT("translate","0,0;0,26;0,0",5,`begin="-${f1(rr(0,3))}s"`)}<line x1="0" y1="-8" x2="0" y2="0" stroke="#e6dcf5" stroke-opacity=".6" stroke-width=".5"/><circle r="2.6" fill="#120a1e"/><circle cx="-1" cy="-.6" r=".5" fill="#ff4d4d"/><circle cx="1" cy="-.6" r=".5" fill="#ff4d4d"/></g></g>`};
const bat=(y0,d,s,dir)=>`<g><animateMotion dur="${d}s" begin="-${f1(rr(0,d))}s" repeatCount="indefinite" path="M${-170*dir} ${y0}C${-60*dir} ${y0-70} ${60*dir} ${y0+60} ${170*dir} ${y0-30}"/><g transform="scale(${s})"><g>${aT("scale","1 1;1 .4;1 1",.32)}<path d="M0 0C-4-5-10-6-17-2-12-2-10 1-8 4-6 1-3 1 0 4 3 1 6 1 8 4 10 1 12-2 17-2 10-6 4-5 0 0Z" fill="#150a22" stroke="#6b2bd9" stroke-width=".6"/></g></g></g>`;
const EVB={
Halloween(x){let b=`<circle r="120" fill="url(#gO)" opacity=".3">${aA("opacity",".18;.42;.22;.38;.18",3.1)}</circle><g transform="translate(46,-100)"><circle r="46" fill="url(#gO)" opacity=".5"/><circle r="26" fill="#ffd9a0"/><circle cx="-8" cy="-6" r="5" fill="#f0b878" opacity=".6"/><circle cx="8" cy="8" r="3.4" fill="#f0b878" opacity=".6"/><circle cx="6" cy="-10" r="2.4" fill="#f0b878" opacity=".6"/></g>`,f="";
 for(let i=0;i<3;i++)b+=`<ellipse rx="95" ry="14" fill="#cdb8ff" opacity=".13" cy="${-60+i*70}">${aT("translate",`${-40},0;${40},0;${-40},0`,9+i*3)}${aA("opacity",".06;.18;.06",6+i)}</ellipse>`;
 b+=web(-74,-146,1)+web(74,-146,-1);
 for(let i=0;i<2+x;i++)b+=bat(f1(rr(-130,110)),rr(5,9),f1(rr(.9,1.5)),i%2?1:-1);
 [[-70,90],[66,30],[-62,-30]].forEach(([ex,ey],i)=>b+=`<g transform="translate(${ex},${ey})" fill="#ffd24a" opacity="0"><ellipse cx="-3.5" rx="2" ry="1.2"/><ellipse cx="3.5" rx="2" ry="1.2"/>${aA("opacity","0;0;1;1;0;0",5+i,`begin="${i*1.6}s" keyTimes="0;.3;.34;.6;.64;1"`)}</g>`);
 const gh=`<g opacity=".8"><path d="M-8 6V-4a8 8 0 0 1 16 0V6l-4-3-4 3-4-3-4 3Z" fill="#efe8ff"/><circle cx="-3" cy="-3" r="1.4" fill="#1b0b2e"/><circle cx="3" cy="-3" r="1.4" fill="#1b0b2e"/><ellipse cy="1.5" rx="1.5" ry="2" fill="#1b0b2e"/></g>`;
 for(let i=0;i<1+x;i++)f+=`<g>${aT("translate",`${f1(rr(-80,80))},150;${f1(rr(-80,80))},-170`,rr(9,14),`begin="-${f1(rr(0,9))}s"`)}<g transform="scale(${f1(rr(1.4,2.2))})">${gh}${aT("rotate","-8;8;-8",2.4)}</g></g>`;
 return[b,f]},
Natal(x){let b=`<circle cx="-30" r="115" fill="#1fbf5f" opacity=".2">${aA("opacity",".1;.3;.1",3.4)}</circle><circle cx="30" r="115" fill="#ff3b3b" opacity=".2">${aA("opacity",".3;.1;.3",3.4)}</circle>`,f="";
 let cr="";for(let i=0;i<6;i++)cr+=`<g transform="rotate(${i*60})"><path d="M0 0V-86M0-30l-12-12M0-30l12-12M0-54l-14-14M0-54l14-14" /></g>`;
 b+=`<g fill="none" stroke="#bfe9ff" stroke-opacity=".4" stroke-width="1.6" stroke-linecap="round">${rot(60)}${cr}</g>`;
 const gar=(y0,sag,off)=>{let s=`<path d="M-110 ${y0}Q0 ${y0+sag} 110 ${y0}" fill="none" stroke="#1b6b3a" stroke-width="2"/>`;const cols=["#ff3b3b","#ffd24a","#3df58a","#3d9bff"];for(let i=0;i<=10;i++){const t=i/10,px=-110+220*t,py=(1-t)*(1-t)*y0+2*t*(1-t)*(y0+sag)+t*t*y0,c=cols[(i+off)%4];s+=`<g transform="translate(${f1(px)},${f1(py)})"><rect x="-1" y="0" width="2" height="3" fill="#1b6b3a"/><ellipse cy="7" rx="2.8" ry="4" fill="${c}"/><ellipse cy="7" rx="7" ry="8" fill="${c}" opacity=".3">${aA("opacity",".1;.5;.1",1.6,`begin="-${(i%4)*.4}s"`)}</ellipse></g>`}return s};
 f+=gar(-112,34,0)+gar(112,-30,2);
 for(let i=0;i<12+x*6;i++){const s=f1(rr(.8,2.4)),fl=`<circle r="${s}" fill="#fff" opacity="${f1(rr(.5,.95))}"/>`;if(i%3)b+=drift(fl,f1(rr(-150,150)),-160,f1(rr(-150,150)),160,rr(5,10));else f+=drift(fl,f1(rr(-150,150)),-160,f1(rr(-150,150)),160,rr(5,10))}
 return[b,f]},
"Ano Novo"(x){let b=`<circle r="120" fill="url(#gB)" opacity=".3"/><circle r="104" fill="#06103a" opacity=".55"/><g fill="none" stroke="#ffd24a"><circle r="100" stroke-width="1.6"/><circle r="94" stroke-width=".6" stroke-dasharray="2 4"/></g>`,f="";
 for(let i=0;i<12;i++)b+=`<line x1="0" y1="-90" x2="0" y2="${i%3?-84:-79}" stroke="#ffe27a" stroke-width="${i%3?1.2:2.4}" transform="rotate(${i*30})"/>`;
 b+=`<g stroke="#ffe27a" stroke-linecap="round"><line y2="-66" stroke-width="2.6">${rot(8)}</line><line y2="-48" stroke-width="3.4">${rot(96)}</line></g><circle r="3" fill="#ffd24a"/>`;
 b+=fwk([[-64,-94],[66,-62],[-68,54],[60,96],[0,-130],[0,130]],["#ffd24a","#fff","#9fd2ff","#ffe27a"],3.2);
 for(let i=0;i<10+x*4;i++){const r=f1(rr(1.4,3.4)),c=`<circle r="${r}" fill="none" stroke="#ffe9a0" stroke-width=".8" opacity=".8"/>`,xx=f1(rr(-120,120)),s=drift(c,xx,170,f1(+xx+rr(-12,12)),-170,rr(4,8));if(i%2)b+=s;else f+=s}
 for(let i=0;i<8;i++)f+=drift(`<rect width="3" height="6" fill="${i%2?"#ffd24a":"#fff"}">${aT("rotate","0;360",rr(1,2))}</rect>`,f1(rr(-110,110)),-170,f1(rr(-110,110)),170,rr(6,10));
 return[b,f]},
Carnaval(x){const cs=["#ff2fb0","#ffd24a","#3df5ff","#7dff4a","#ff7a1a"];let b="",f="";
 [[-70,-150,-14,14,"#ff2fb0",3.4],[70,-150,14,-14,"#3df5ff",4.1],[0,-150,-8,8,"#ffd24a",5.2]].forEach(([ax,ay,a0,a1,c,d])=>b+=`<path d="M${ax} ${ay}L${ax-34} 150L${ax+34} 150Z" fill="${c}" opacity=".18" style="mix-blend-mode:screen">${aT("rotate",`${a0} ${ax} ${ay};${a1} ${ax} ${ay};${a0} ${ax} ${ay}`,d)}</path>`);
 b+=fwk([[-62,-92],[64,-58],[-66,44],[58,96]],cs,3.2);
 for(let i=0;i<10+x*2;i++){const c=cs[i%5],xx=f1(rr(-110,110)),d=rr(5,8),s=`<g>${aT("translate",`${xx},-170;${f1(+xx+rr(-30,30))},170`,d,`begin="-${f1(rr(0,d))}s"`)}<g>${aT("rotate","-25;25;-25",rr(1.2,2.4))}<path d="M0 0q7 10 0 20t0 20t0 20t0 20" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round"/></g></g>`;if(i%2)f+=s;else b+=s}
 for(let i=0;i<16+x*4;i++){const c=cs[i%5],s=drift(`<rect width="4" height="2.4" fill="${c}">${aT("rotate","0;360",rr(.7,1.6))}</rect>`,f1(rr(-140,140)),-170,f1(rr(-140,140)),170,rr(4,7));if(i%2)f+=s;else b+=s}
 return[b,f]},
"Festa Junina"(x){let b=`<circle cy="130" r="120" fill="url(#gO)" opacity=".4">${aA("opacity",".25;.5;.3;.45;.25",1.3)}</circle>`,f="";
 let st=`<path d="M-112 -118Q0 -86 112 -118" fill="none" stroke="#7a4a1c" stroke-width="1.4"/>`;const cols=["#ff3b3b","#ffd24a","#3d9bff","#3df58a","#ff7a1a","#ff5fa2"];
 for(let i=0;i<=10;i++){const t=(i+.5)/11,px=-112+224*t,py=(1-t)*(1-t)*-118+2*t*(1-t)*-86+t*t*-118;st+=`<path d="M-6 0H6L0 14Z" fill="${cols[i%6]}" stroke="#fff3" stroke-width=".4" transform="translate(${f1(px)} ${f1(py)})">${aT("rotate",`-7 0 0;7 0 0;-7 0 0`,rr(1.6,2.6),`begin="-${f1(rr(0,2))}s"`)}</path>`}
 b+=st;
 for(let i=0;i<2+x;i++){const c=["#ff5a2e","#ffb02e","#ff3b8a","#3d9bff"][i%4],xx=f1(rr(-110,110)),d=rr(14,22),ln=`<g>${aT("translate",`${xx},180;${f1(+xx+rr(-26,26))},-190`,d,`begin="-${f1(rr(0,d))}s"`)}<g transform="scale(${f1(rr(1.1,1.7))})"><circle cy="-2" r="16" fill="url(#gO)" opacity=".6"/><path d="M-7-12Q-12 0-5 10H5Q12 0 7-12Z" fill="${c}" stroke="#fff6" stroke-width=".5"/><path d="M-4-12V10M4-12V10" stroke="#0003" stroke-width=".5"/><ellipse cy="12" rx="2" ry="3.4" fill="#ffe27a">${aA("ry","2.4;4;2.4",.4)}</ellipse></g></g>`;b+=ln}
 b+=`<line x1="-26" y1="146" x2="26" y2="128" stroke="#5a3210" stroke-width="5" stroke-linecap="round"/><line x1="26" y1="146" x2="-26" y2="128" stroke="#7a4a1c" stroke-width="5" stroke-linecap="round"/>`;
 [[-16,1,"#d92b00",34],[16,1.05,"#d92b00",36],[0,1.35,"#ff6a00",46],[-8,.95,"#ffb02e",32],[9,1,"#ffb02e",30],[0,.8,"#fff3b0",24]].forEach(([fx,s,c,h],i)=>f+=`<g transform="translate(${fx},140)"><path d="M0 0C-9 -6 -7 ${-h*.6} 0 ${-h}C7 ${-h*.6} 9 -6 0 0Z" fill="${c}" opacity=".92" style="mix-blend-mode:screen">${aT("scale",`1 1;.82 1.2;1.12 .88;1 1`,rr(.5,.9),`begin="-${f1(rr(0,.5))}s"`)}</path></g>`);
 for(let i=0;i<10+x*4;i++){const d=rr(1.6,3.2),bg=`begin="-${f1(rr(0,3))}s"`;f+=`<circle cx="${f1(rr(-30,30))}" cy="130" r="${f1(rr(.7,1.8))}" fill="#ffd24a" opacity="0">${aT("translate",`0,0;${f1(rr(-30,30))},${-f1(rr(90,200))}`,d,bg)}${aA("opacity","0;1;0",d,bg)}</circle>`}
 return[b,f]}
};
const B={
0(){const f=`<defs><clipPath id="cpC"><rect x="-48" y="-72" width="96" height="144" rx="10"/></clipPath></defs><g clip-path="url(#cpC)"><g opacity="0"><rect x="-7" y="-110" width="12" height="220" fill="#fff" opacity=".5" transform="rotate(25)"/>${aT("translate","-90,0;90,0;90,0",3.8,'keyTimes="0;.5;1"')}${aA("opacity","0;1;0;0",3.8,'keyTimes="0;.15;.5;1"')}</g></g>`,
 b=`<rect x="-50" y="-74" width="100" height="148" rx="12" fill="none" stroke="#9ec5ff">${aA("opacity",".12;.32;.12",3.2)}</rect>`+star(-60,-50,"#cfe3ff",1.4,2.6)+star(58,40,"#cfe3ff",1.2,3.1)+star(-52,66,"#fff",1,2.2);
 return[b,f]},
1(){const sw=(o,d)=>`<g opacity="0"><rect x="-7" y="-110" width="14" height="220" fill="#eaffff" opacity=".6" transform="rotate(25)"/>${aT("translate","-90,0;90,0;90,0",d,`begin="${o}s" keyTimes="0;.5;1"`)}${aA("opacity","0;1;0;0",d,`begin="${o}s" keyTimes="0;.15;.5;1"`)}</g>`,
 f=`<defs><clipPath id="cpC"><rect x="-48" y="-72" width="96" height="144" rx="10"/></clipPath></defs><g clip-path="url(#cpC)">${sw(0,3)}${sw(1.5,3)}</g>`;
 let b=`<circle r="105" fill="url(#gC)" opacity=".28">${aA("opacity",".15;.35;.15",2.8)}</circle>`;
 [0,1.3].forEach(o=>b+=`<rect x="-48" y="-72" width="96" height="144" rx="10" fill="none" stroke="#6fe3e3" stroke-width="1.6" opacity="0">${aT("scale","1;1.55",2.6,`begin="${o}s"`)}${aA("opacity",".7;0",2.6,`begin="${o}s"`)}</rect>`);
 [[-58,-56],[60,-30],[-62,34],[56,62],[0,-88],[8,90],[-30,100],[38,-92]].forEach(([x,y],i)=>b+=`<g transform="translate(${x},${y})"><path d="M0-6 1.6-1.6 6 0 1.6 1.6 0 6-1.6 1.6-6 0-1.6-1.6Z" fill="#bffcff">${aT("scale",".1;1;.1",rr(1.6,2.8),`begin="-${f1(rr(0,2))}s"`)}</path></g>`);
 return[b,f]},
2(){let b=`<circle r="108" fill="url(#gB)" opacity=".5">${aA("opacity",".3;.6;.3",3)}</circle>`,f="";
 [[86,24,20,5.2],[94,30,-52,7],[80,20,82,4.4]].forEach(([rx,ry,a,d])=>{const p=el(rx,ry),m=o=>`<g><animateMotion dur="${d}s" begin="${o}s" repeatCount="indefinite" path="${p}"/><circle r="8" fill="url(#gB)"/><circle r="2.5" fill="#fff"/></g>`;
  b+=`<g transform="rotate(${a})"><path d="${p}" fill="none" stroke="#6fb4ff" stroke-opacity=".4" stroke-dasharray="3 5"/></g>`;f+=`<g transform="rotate(${a})">${m(0)}${m(-d/2)}</g>`});
 let sp="";for(let i=0;i<64;i++){const a=i*.34,r=16+i*1.4;sp+=`<circle cx="${f1(Math.cos(a)*r)}" cy="${f1(Math.sin(a)*r*.8)}" r="${f1(.5+i/64*1.7)}"/>`}
 return[b+`<g fill="#8fd0ff" opacity=".75">${sp}${rot(9)}</g>`,f]},
3(){const rc=`<rect x="-51" y="-75" width="102" height="150" rx="12" pathLength="100" fill="none"`;
 let b=`<circle r="120" fill="url(#gG)" opacity=".35">${aA("opacity",".2;.45;.2",2.4)}</circle><rect x="-57" y="-81" width="114" height="162" rx="18" fill="none" stroke="#ffb02e" stroke-width="9" opacity=".25">${aA("opacity",".12;.35;.12",2.4)}</rect>`,
 f=`${rc} stroke="#ffd24a" stroke-opacity=".55" stroke-width="1.3"/>`;
 [0,50].forEach(o=>{f+=`${rc} stroke="#ffb02e" stroke-opacity=".5" stroke-width="7" stroke-linecap="round" stroke-dasharray="18 82">${aA("stroke-dashoffset",`${-o};${-o-100}`,2.6)}</rect>${rc} stroke="#fffbe0" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="14 86">${aA("stroke-dashoffset",`${-o};${-o-100}`,2.6)}</rect>`});
 return[b,f]},
4(){let tk="",b=`<circle r="118" fill="url(#gO)" opacity=".35"/>`;
 for(let i=0;i<48;i++){const a=i*PI/24,l=i%4?3:7;tk+=`<line x1="${f1(Math.cos(a)*104)}" y1="${f1(Math.sin(a)*104)}" x2="${f1(Math.cos(a)*(104+l))}" y2="${f1(Math.sin(a)*(104+l))}"/>`}
 const tri=[0,1,2].map(i=>{const a=(i*120-90)*PI/180;return f1(Math.cos(a)*88)+","+f1(Math.sin(a)*88)}).join(" ");
 b+=`<g fill="none" stroke="#ff9a4c" stroke-width="1.3"><g>${rot(40)}<circle r="100"/><circle r="95" stroke-dasharray="2 4"/><g stroke-width=".9">${tk}</g></g><g>${rot(18,1)}<polygon points="${tri}"/><polygon points="${tri}" transform="rotate(180)"/></g><g>${rot(26)}<circle r="70" stroke-dasharray="12 7" stroke="#ffd0a0"/><g fill="#ffb36b" stroke="none">${glyphs(8,60,9,"#ffb36b")}</g></g><circle r="46" stroke="#e8432e" stroke-width="2" opacity=".7">${aA("r","44;52;44",2.2)}</circle></g>`;
 return[b,""]},
5(){let b=`<circle r="115" fill="url(#gP)" opacity=".4">${aA("opacity",".25;.5;.25",2.6)}</circle><path d="M0 -150L7 -112-5 -82 9 -40-7 -4 8 36-4 72 6 110 0 150" fill="none" stroke="#a64dff" stroke-linejoin="round" opacity=".4">${aA("stroke-width","8;22;8",2.2)}</path><path d="M0 -150L7 -112-5 -82 9 -40-7 -4 8 36-4 72 6 110 0 150" fill="none" stroke="#f0d6ff" stroke-width="1.6" stroke-linejoin="round">${aA("opacity",".6;1;.6",.9)}</path><g>${rot(30)}<circle r="97" fill="none" stroke="#c04df0" stroke-dasharray="1 5" stroke-width="2"/>${glyphs(12,92,13,"#e6b8ff")}</g>`,f="";
 [[-125,-140,-62,-20,2.3,0],[125,-120,60,10,3.1,-1],[-110,130,-56,50,2.7,-.6]].forEach(([x0,y0,x1,y1,d,o])=>{const p=bolt(x0,y0,x1,y1);f+=`<g opacity="0"><polyline points="${p}" fill="none" stroke="#a64dff" stroke-width="7" stroke-linecap="round" opacity=".5"/><polyline points="${p}" fill="none" stroke="#f6e6ff" stroke-width="1.8" stroke-linejoin="round"/>${flick(d,o)}</g>`});
 return[b,f]},
6(){let b=`<circle r="125" fill="url(#gO)" opacity=".3">${aA("opacity",".2;.4;.2",3)}</circle><circle r="94" fill="url(#gV)"/>`,f="";
 for(let i=0;i<5;i++){const d=4;b+=`<circle fill="none" stroke="#ffc53a"><animate attributeName="r" values="24;118" dur="${d}s" begin="-${i*d/5}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.9;0" dur="${d}s" begin="-${i*d/5}s" repeatCount="indefinite"/><animate attributeName="stroke-width" values="1;5" dur="${d}s" begin="-${i*d/5}s" repeatCount="indefinite"/></circle>`}
 b+=`<g fill="none"><g>${rot(14)}<circle r="100" stroke="#ff9a1f" stroke-width="5" stroke-dasharray="40 14 8 14"/></g><g>${rot(9,1)}<circle r="86" stroke="#ffe27a" stroke-width="2" stroke-dasharray="3 6"/></g><g>${rot(20)}<circle r="72" stroke="#ff4d00" stroke-width="6" stroke-dasharray="26 40" opacity=".7"/></g></g>`;
 const sh=(i,front)=>{const r=rr(78,118),d=rr(7,15),n=5+(i%3);const pts=[...Array(n)].map((_,j)=>{const a=j/n*2*PI,q=rr(3.5,8);return f1(Math.cos(a)*q)+","+f1(Math.sin(a)*q)}).join(" ");return`<g transform="rotate(${rr(0,360)}) scale(1,.7)"><g>${rot(d,i%2)}<g transform="translate(${f1(r)},0)"><polygon points="${pts}" fill="${i%2?"#ffd24a":"#ff7a2e"}" stroke="#fff3b0" stroke-width=".6">${aT("rotate","0;360",rr(3,6))}</polygon></g></g></g>`};
 for(let i=0;i<7;i++)b+=sh(i);for(let i=0;i<7;i++)f+=sh(i+7);
 return[b,f]},
7(){return[`<circle r="120" fill="url(#gC)" opacity=".38">${aA("opacity",".25;.5;.25",3)}</circle><circle cx="30" cy="40" r="105" fill="url(#gM)" opacity=".3">${aA("opacity",".18;.4;.18",3.7)}</circle><g fill="none" stroke="#3df5ff" opacity=".3"><circle r="104" stroke-dasharray="3 9">${rot(30)}</circle><circle r="96" stroke="#ff3df0" stroke-dasharray="2 12">${rot(22,1)}</circle></g><g id="dgG"></g>`,""]},
8(){let b=`<g style="mix-blend-mode:screen"><g>${rot(90)}<circle cx="-40" cy="-30" r="100" fill="#ff6bd6" opacity=".4"/><circle cx="45" cy="35" r="105" fill="#5a6eff" opacity=".4"/><circle cx="0" cy="55" r="80" fill="#9d5bff" opacity=".35"/></g></g>`,f="";
 for(let i=0;i<26;i++)b+=star(f1(rr(-145,145)),f1(rr(-145,145)),i%3?"#fff":"#bfe9ff",f1(rr(.5,1.4)),rr(1.5,4));
 let g="";for(let a=0;a<3;a++)for(let i=0;i<34;i++){const s=i/34,ang=a*2.094+s*3.3,r=8+s*96+rr(-3,3);g+=`<circle cx="${f1(Math.cos(ang)*r)}" cy="${f1(Math.sin(ang)*r)}" r="${f1(1.9-s*1.1)}" fill="${["#fff","#ffb3f0","#8fe9ff"][i%3]}" opacity="${f1(1-s*.5)}"/>`}
 b+=`<g transform="rotate(-24) scale(1,.55)"><g>${rot(60)}${g}<circle r="22" fill="url(#gW)"/></g></g>`;
 b+=`<g fill="none" stroke="#c9a8ff" opacity=".55" stroke-dasharray="2 6"><g transform="rotate(-28)"><path d="${el(128,34)}">${rot(1)}</path></g></g><g fill="none" stroke="#8fe9ff" opacity=".4"><g transform="rotate(32)"><path d="${el(118,26)}" stroke-dasharray="14 10"/></g></g>`;
 [[[-60,-122],[-28,-106],[6,-126],[40,-108],[62,-128]],[[-58,118],[-22,132],[14,112],[50,128]],[[-70,-30],[-64,18]]].forEach(c=>{b+=`<polyline points="${c.map(p=>p.join(",")).join(" ")}" fill="none" stroke="#bfa8ff" stroke-opacity=".5" stroke-width=".8"/>`+c.map(p=>star(p[0],p[1],"#fff",2,rr(1.6,3))).join("")});
 const pp=el(100,38);f=`<g transform="rotate(-18)"><g><animateMotion dur="26s" repeatCount="indefinite" path="${pp}"/><ellipse rx="15" ry="4.5" fill="none" stroke="#ffd0f0" stroke-width="1.3" transform="rotate(-20)"/><circle r="7.5" fill="#7a5bff"/><circle r="7.5" fill="url(#gM)" opacity=".7"/></g></g>`;
 for(let i=0;i<2;i++)f+=`<g opacity="0"><line x1="0" y1="0" x2="-38" y2="-14" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><animateTransform attributeName="transform" type="translate" values="${i?"-60,-90;80,-30":"80,100;-70,50"}" dur="5s" begin="${i*2.4+1}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0;0" keyTimes="0;.08;.2;1" dur="5s" begin="${i*2.4+1}s" repeatCount="indefinite"/></g>`;
 return[b,f]},
s(){let ry="";for(let i=0;i<28;i++){const a=i*PI/14,r0=84,r1=r0+rr(8,30);ry+=`<line x1="${f1(Math.cos(a)*r0)}" y1="${f1(Math.sin(a)*r0)}" x2="${f1(Math.cos(a)*r1)}" y2="${f1(Math.sin(a)*r1)}" opacity="${f1(rr(.3,.9))}"/>`}
 let b=`<circle r="118" fill="url(#gE)">${aA("opacity",".8;1;.8",3.4)}</circle><g stroke="#ffd24a" stroke-width="1" stroke-linecap="round">${rot(80)}${ry}</g><g fill="none" stroke="#d4a64a" stroke-opacity=".7"><circle r="98" stroke-dasharray="1 7" stroke-width="2">${rot(50,1)}</circle><circle r="104" stroke-width=".6"/></g>`;
 [0,90,180,270].forEach(a=>b+=`<g transform="rotate(${a}) translate(0,-98)"><path d="M0-6 4 0 0 6-4 0Z" fill="#ffd24a">${aA("opacity",".4;1;.4",2.6,`begin="-${a/60}s"`)}</path></g>`);
 [[-90,-40,30,8],[80,50,26,10],[-20,100,34,12]].forEach(([x,y,r,d],i)=>b+=`<ellipse rx="${r*2}" ry="${r*.5}" fill="#000" opacity=".5" cx="${x}" cy="${y}">${aT("translate",`0,0;${i%2?-40:40},${i%2?12:-14};0,0`,d)}</ellipse>`);
 let f="";for(let i=0;i<8;i++)f+=`<circle cx="${f1(rr(-60,60))}" cy="70" r="${f1(rr(.8,1.8))}" fill="#ffd24a" opacity="0">${aT("translate",`0,0;${f1(rr(-10,10))},-160`,rr(4,7),`begin="${f1(rr(0,5))}s"`)}${aA("opacity","0;.9;0",rr(4,7),`begin="${f1(rr(0,5))}s"`)}</circle>`;
 return[b,f]},
e(s0){const x=Math.max(1,(s0.t||3)-2),fn=EVB[s0.ev];return fn?fn(x):EVB.Carnaval(x)}
};
const DG={on:0,N:50,SG:5.4};
function dBuild(g){const N=DG.N;let s="",bl="",pk="";
 for(let i=0;i<N-1;i++){const h=f1(185+130*i/N);s+=`<path class="s" fill="hsl(${h} 90% ${f1(50-8*i/N+(i%2?2.5:-2.5))}%)" stroke="hsl(${h} 95% 78%)" stroke-width=".35"/>`;bl+=`<path class="b" fill="hsl(${f1(+h+25)} 80% 88%)" opacity=".85"/>`}
 for(let i=0;i<16;i++)pk+=`<circle class="k" r="1.4" fill="${i%2?"#3df5ff":"#ff3df0"}"/>`;
 let cl="";[[-40,-60,0],[50,50,1],[-30,70,2]].forEach(([x,y,i])=>cl+=`<ellipse cx="${x}" cy="${y}" rx="60" ry="14" fill="url(#gW)" opacity=".16">${aT("translate",`-30,0;30,0;-30,0`,10+i*3)}</ellipse>`);
 const jw=`<g class="jw"><path d="M-4 4C6 7 16 7 26 3L27 5.5C19 12 6 12-4 9Z" fill="#0fb8d4" stroke="#c8fbff" stroke-width=".35"/><path d="M11 5l.8-2.2.8 2.2M17 4.6l.7-2 .7 2" fill="#fff"/><path class="tg" d="M14 7q7 3 14 0" fill="none" stroke="#ff3d6e" stroke-width="1.6" stroke-linecap="round"/></g>`;
 g.innerHTML=cl+`<path class="gl" fill="none" stroke="#3df5ff" stroke-width="19" stroke-linecap="round" stroke-linejoin="round" opacity=".14"/><path class="lg" fill="none" stroke="#19d8f0" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path class="tl" fill="none" stroke="#ff3df0" stroke-width="2" stroke-linecap="round"/>${s}${bl}<path class="sc" fill="none" stroke="#02243a" stroke-width=".55" stroke-linecap="round" opacity=".5"/><path class="sd" fill="none" stroke="#021a30" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" opacity=".3"/><path class="hl" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".34"/><path class="mn" fill="#ff9a3c" stroke="#ffe27a" stroke-width=".3" stroke-linejoin="round"/><path class="sp" fill="#ff3df0" stroke="#ffb3f6" stroke-width=".4" stroke-linejoin="round"/><path class="cw" fill="none" stroke="#ffd24a" stroke-width="1.3" stroke-linecap="round"/>${pk}<g class="hd"><path class="w1" fill="none" stroke="#ff7af2" stroke-width="1.4" stroke-linecap="round"/><path class="w2" fill="none" stroke="#ff7af2" stroke-width="1.4" stroke-linecap="round"/><path class="w3" fill="none" stroke="#ffd0fa" stroke-width="1" stroke-linecap="round"/><path class="w4" fill="none" stroke="#ffd0fa" stroke-width="1" stroke-linecap="round"/><path d="M-8-6Q-14-12-24-10Q-17-7-15-4Q-24-4-26 2Q-18 1-14 4Q-22 8-22 14Q-12 9-8 6Z" fill="#ff3df0"/><path d="M-8-4Q-13-8-19-7Q-14-4-13-2Q-18-1-19 3Q-13 2-10 4Z" fill="#ff9a3c"/><path d="M0-6C2-14-2-22-10-27-6-20-5-13-6-6Z" fill="#b8901c"/><path d="M-3-6C-4-16-12-24-22-26-16-20-12-14-9-6Z" fill="#ffd24a" stroke="#fff3b0" stroke-width=".4"/><path d="M-9-14C-12-18-17-18-21-16-16-15-13-13-11-11Z" fill="#ffe27a"/><path d="M-12-20-8-16" stroke="#ffe27a" stroke-width="1.2"/><path d="M-6 3Q-14 2-19 7Q-12 8-8 6Z" fill="#12b8d4"/><path d="M-4 6L-11 15 3 9Z" fill="#ff3df0"/><path d="M8 9Q4 17-4 19 4 15 4 9Z" fill="#ff7af2"/>${jw}<path d="M-10-6C-2-10 8-9 14-7L21-6C25-6 28-4 28-1 28 1 26 2.4 22 3L-9 6Z" fill="#12e6ff" stroke="#c8fbff" stroke-width=".4"/><path d="M-9 1.4C2 3 14 3 26 2.2" fill="none" stroke="#066" stroke-width=".7"/><path d="M-9-5C-2-9 8-8 14-6L21-5C24-5 27-3.6 27-1.5 20-3 6-4-8-3Z" fill="#fff" opacity=".24"/><path d="M-9 2C2 3.4 14 3.4 26 2.4 26 2.6 24 4 22 3L-9 6Z" fill="#06404f" opacity=".38"/><path d="M-7-2q2 2 4 0M-3-3.4q2 2 4 0M-7 1q2 2 4 0M-3-.2q2 2 4 0M13-3q2 2 4 0M14 .2q2 2 4 0" fill="none" stroke="#0a7f9a" stroke-width=".5" opacity=".65"/><path d="M2-6q7-4 14-1" fill="none" stroke="#0a7f9a" stroke-width="1.2"/><path d="M3-5.4Q8-9.6 14-6.6" fill="none" stroke="#055a70" stroke-width="1.1" stroke-linecap="round"/><path d="M19 2.6l1.2 4 1.2-4M24 2.2l1 3.2 1-3.2" fill="#fff"/><circle cx="25.5" cy="-3.2" r="2.2" fill="#0fb8d4"/><circle cx="26" cy="-2.6" r=".8" fill="#052a3a"/><circle cx="8" cy="-3.2" r="7" fill="#ffd24a" opacity=".14"/><circle cx="8" cy="-3.2" r="4.4" fill="#ffd24a" opacity=".32"/><ellipse cx="8" cy="-3.2" rx="3" ry="2.1" fill="#ffd24a"/><ellipse cx="8.4" cy="-3.2" rx=".7" ry="1.8" fill="#000"/><circle cx="7.2" cy="-4" r=".6" fill="#fff"/></g>`;
 const q=c=>[...g.querySelectorAll(c)];Object.assign(DG,{seg:q(".s"),bel:q(".b"),pk:q(".k"),gl:q(".gl")[0],lg:q(".lg")[0],cw:q(".cw")[0],tl:q(".tl")[0],mn:q(".mn")[0],sp:q(".sp")[0],hd:q(".hd")[0],jw:q(".jw")[0],sc:q(".sc")[0],sd:q(".sd")[0],hl:q(".hl")[0],w1:q(".w1")[0],w2:q(".w2")[0],w3:q(".w3")[0],w4:q(".w4")[0]});
 DG.P=[...Array(N)].map((_,i)=>[72,-i*DG.SG]);DG.t=0;DG.sp_=1;DG.bo=0;DG.l=0}
function dTick(ts){if(!DG.on)return;DG.raf=requestAnimationFrame(dTick);if(document.hidden){DG.l=0;return}
 const dt=Math.min((ts-(DG.l||ts))/1000,.05);DG.l=ts;DG.bo-=dt;DG.sp_+=((DG.bo>0?2.7:1)-DG.sp_)*Math.min(1,dt*4);DG.t+=dt*DG.sp_;
 const t=DG.t,P=DG.P,N=DG.N,SG=DG.SG,k=1+.09*Math.sin(t*1.7),a=t*.6,hx=Math.cos(a)*74*k,hy=Math.sin(a)*112*k,L=Math.hypot(hx,hy)||1,wv=Math.sin(t*3.1)*13;
 P[0]=[hx+hx/L*wv,hy+hy/L*wv];
 for(let i=1;i<N;i++){const dx=P[i][0]-P[i-1][0],dy=P[i][1]-P[i-1][1],d=Math.hypot(dx,dy)||1;P[i][0]=P[i-1][0]+dx/d*SG;P[i][1]=P[i-1][1]+dy/d*SG}
 const T=[],Lf=[],Rt=[],W=[],F=n=>n.toFixed(1);
 for(let i=0;i<N;i++){const p=P[i],A=P[Math.max(0,i-1)],Bq=P[Math.min(N-1,i+1)];let tx=A[0]-Bq[0],ty=A[1]-Bq[1];const d=Math.hypot(tx,ty)||1;tx/=d;ty/=d;T.push([tx,ty]);const w=7.4*Math.pow(1-i/N,.7)+.9;W.push(w);Lf.push([p[0]-ty*w,p[1]+tx*w]);Rt.push([p[0]+ty*w,p[1]-tx*w])}
 const Q=(p,q)=>`${F(p[0])} ${F(p[1])}L${F(q[0])} ${F(q[1])}`;
 DG.seg.forEach((s,i)=>s.setAttribute("d",`M${Q(Lf[i],Lf[i+1])}L${Q(Rt[i+1],Rt[i])}Z`));
 DG.bel.forEach((s,i)=>{const w0=W[i]*.42,w1=W[i+1]*.42,p=P[i],q=P[i+1],a=T[i],b=T[i+1];s.setAttribute("d",`M${F(p[0]-a[1]*w0)} ${F(p[1]+a[0]*w0)}L${F(q[0]-b[1]*w1)} ${F(q[1]+b[0]*w1)}L${F(q[0]+b[1]*w1)} ${F(q[1]-b[0]*w1)}L${F(p[0]+a[1]*w0)} ${F(p[1]-a[0]*w0)}Z`)});
 let scp="",sdp="",hlp="";
 for(let i=0;i<N-1;i++){const tg=T[i],p=P[i],w=W[i];
  scp+=`M${F(Lf[i][0])} ${F(Lf[i][1])}Q${F(p[0]-tg[0]*w*.95)} ${F(p[1]-tg[1]*w*.95)} ${F(Rt[i][0])} ${F(Rt[i][1])}`;
  sdp+=(i?"L":"M")+F(p[0]+tg[1]*w*.66)+" "+F(p[1]-tg[0]*w*.66);
  hlp+=(i?"L":"M")+F(p[0]-tg[1]*w*.55)+" "+F(p[1]+tg[0]*w*.55)}
 DG.sc.setAttribute("d",scp);DG.sd.setAttribute("d",sdp);DG.hl.setAttribute("d",hlp);
 const pl=P.map((p,i)=>(i?"L":"M")+F(p[0])+" "+F(p[1])).join("");DG.gl.setAttribute("d",pl);
 const tipOf=(base,out,tg,s)=>[base[0]+out[0]*s*.7-tg[0]*s*1.2,base[1]+out[1]*s*.7-tg[1]*s*1.2];
 let sp="",mn="";
 for(let i=1;i<N-2;i++){const tg=T[i],oL=[-tg[1],tg[0]],oR=[tg[1],-tg[0]];
  if(i<13){const s=11*Math.pow(1-i/13,.5)+4;[[Lf,oL],[Rt,oR]].forEach(([S,o])=>{const p=S[i],q=S[i+1],tp=tipOf(p,o,tg,s*(1+.15*Math.sin(t*5+i)));mn+=`M${Q(p,q)}L${F(tp[0])} ${F(tp[1])}Z`})}
  else if(i%2==0){const s=Math.pow(1-i/N,.6)*6+1.6,S=i%4?Lf:Rt,o=i%4?oL:oR,p=S[i],q=S[i+1],tp=tipOf(p,o,tg,s);sp+=`M${Q(p,q)}L${F(tp[0])} ${F(tp[1])}Z`}}
 DG.sp.setAttribute("d",sp);DG.mn.setAttribute("d",mn);
 let lg="",cw="";[[9,0],[12,2],[28,1],[31,3]].forEach(([i,j])=>{const p=P[i],tg=T[i],w=W[i];[1,-1].forEach(sd=>{if(j%2&&sd>0)return;const o=[-tg[1]*sd,tg[0]*sd],sw=Math.sin(t*4+i*.7+sd)*6,sh=[p[0]+o[0]*w,p[1]+o[1]*w],el=[sh[0]+o[0]*8-tg[0]*4,sh[1]+o[1]*8-tg[1]*4],ft=[el[0]+o[0]*6-tg[0]*(3+sw),el[1]+o[1]*6-tg[1]*(3+sw)];
  lg+=`M${Q(sh,el)}L${F(ft[0])} ${F(ft[1])}`;[-1,0,1].forEach(c=>{cw+=`M${F(ft[0])} ${F(ft[1])}l${F(o[0]*3.4-tg[0]*(1.6-c*1.4)+tg[1]*sd*c*1.4*0)} ${F(o[1]*3.4-tg[1]*(1.6-c*1.4))}`})})});
 DG.lg.setAttribute("d",lg);DG.cw.setAttribute("d",cw);
 const e=P[N-1],[ex,ey]=T[N-1];let tl="";[-1,0,1].forEach(c=>{const nx=-ey,ny=ex;tl+=`M${F(e[0])} ${F(e[1])}Q${F(e[0]-ex*9+nx*c*8)} ${F(e[1]-ey*9+ny*c*8)} ${F(e[0]-ex*19+nx*c*12)} ${F(e[1]-ey*19+ny*c*12)}`});DG.tl.setAttribute("d",tl);
 DG.pk.forEach((c,i)=>{const j=3+i*2.6|0,p=P[Math.min(N-1,j)],tg=T[Math.min(N-1,j)],s=Math.sin(t*2+i*1.7)*(W[Math.min(N-1,j)]+9);c.setAttribute("cx",F(p[0]-tg[1]*s));c.setAttribute("cy",F(p[1]+tg[0]*s));c.setAttribute("opacity",(.3+.7*Math.abs(Math.sin(t*3+i))).toFixed(2))});
 const hr=Math.atan2(P[0][1]-P[3][1],P[0][0]-P[3][0]),hh=hr*180/PI,s=Math.sin(t*3.1),s2=Math.sin(t*2.3+1);
 DG.hd.setAttribute("transform",`translate(${F(P[0][0])} ${F(P[0][1])}) rotate(${F(hh)}) scale(1.4)`);
 DG.jw.setAttribute("transform",`rotate(${F(5+5*Math.sin(t*1.6))} 0 4)`);
 const wh=(sd,len,c0,cv,ph)=>{let th=c0*PI/180*sd,x=24,y=sd*-1.5+(sd>0?3:0),d=`M${F(x)} ${F(y)}`;for(let j=0;j<10;j++){th-=sd*cv*PI/180*(1+j*.12)+Math.sin(t*3.2-j*.55+ph)*.07;x+=Math.cos(th)*len;y+=Math.sin(th)*len;d+=`L${F(x)} ${F(y)}`}return d};
 DG.w1.setAttribute("d",wh(-1,4.4,-40,9,0));DG.w2.setAttribute("d",wh(1,4.4,-40,9,1.7));DG.w3.setAttribute("d",wh(-1,3.4,-15,12,.8));DG.w4.setAttribute("d",wh(1,3.4,-15,12,2.4));}
const st={};
return{
 build(key,s0){const fn=B[key];return fn?fn(s0):["",""]},
 open(s0){this.close();if(!FX.particles)return;
  const key=s0.k=="s"||s0.k=="e"?s0.k:s0.t;
  const[b,f]=this.build(key,s0),bg=$("cvBg"),fg=$("cvFg");
  bg.innerHTML=`<div class="ab">${SV(b)}</div>`;fg.innerHTML=f?`<div class="ab">${SV(f)}</div>`:"";fg.classList.toggle("fol",key===0||key===1||key===3);
  this.place();setTimeout(()=>this.place(),320);
  if(key===7){const g=bg.querySelector("#dgG");dBuild(g);DG.on=1;DG.raf=requestAnimationFrame(dTick)}},
 close(){DG.on=0;cancelAnimationFrame(DG.raf);const a=$("cvBg"),c=$("cvFg");if(a)a.innerHTML="";if(c)c.innerHTML=""},
 place(){const q=$("cvStage").getBoundingClientRect();["cvBg","cvFg"].forEach(i=>{const a=$(i).firstChild;if(a){a.style.left=f1(q.left+q.width/2)+"px";a.style.top=f1(q.top+q.height/2)+"px"}})},
 flip(rad){$("cvFg").style.setProperty("--ca",Math.max(.05,Math.abs(Math.cos(rad))).toFixed(3))},
 boost(){DG.bo=1.4},
 pause(p){document.querySelectorAll("#cvBg svg,#cvFg svg").forEach(s=>{try{p?s.pauseAnimations():s.unpauseAnimations()}catch(e){}})}
}})();
document.addEventListener("visibilitychange",()=>AM.pause(document.hidden));
const EVC={Halloween:["#ff7a1a","#8f5bff"],Natal:["#ff3b3b","#3df58a"],"Ano Novo":["#ffd24a","#9fd2ff"],Carnaval:["#ff2fb0","#3df5ff"],"Festa Junina":["#ffb02e","#ff4d00"]};
function cvBurst2(k,s0,cx,cy,w,h,mx){
 const hu=s0.h||0,[a,b]={2:["#3d9bff","#bfe3ff"],3:["#ffd24a","#fff6c8"],4:["#ff8a3c","#e8432e"],5:["#c04df0","#e6b8ff"],6:["#ffb02e","#ff4d00"],7:["#3df5ff","#ff3df0"],8:["#c78bff","#ff6bd6"],s:["#ffd24a","#ffffff"],e:EVC[s0.ev]||[`hsl(${hu} 95% 62%)`,"#ffd24a"]}[k],str=typeof k=="string",n=str?6:k;
 fxGlow(1.4+n*.07,1.4);if(n>=4)fxShake(n>=7?7:4);
 fxRing(cx,cy,a,mx*1.3,800);fxRing(cx,cy,b,mx*1.8,1000,120,2);
 if(k==2)fxSpiral(cx,cy,32,[a,b,"#fff"],mx*.5,mx*1.1,1200,2);
 if(k==3)for(let i=0;i<22;i++)fxSpark(cx,cy,w*.4,rnd(w,w*1.7),i%2?a:b,rnd(500,800),rnd(0,120));
 if(k==4)[1,2,3].forEach(i=>fxRing(cx,cy,i%2?a:b,mx*(1+i*.35),900,i*110,3));
 if(k==5){fxSpiral(cx,cy,26,[a,b,"#8f5bff"],mx*.5,mx*1.1,1300,2);[0,120,260].forEach(d=>fxBolt(cx+rnd(-w,w),-10,cx+rnd(-w*.3,w*.3),cy+rnd(-h*.2,h*.3),d,1))}
 if(k==6){[0,1,2].forEach(i=>fxRing(cx,cy,i%2?a:b,mx*(1.2+i*.5),1000,i*180,4));fxDots(cx,cy,26,[a,b,"#fff3b0"],w*.5,w*1.4,1100,[3,6])}
 if(k==7){AM.boost();fxSpiral(cx,cy,40,[a,b,"#fff"],mx*.5,mx*1.2,1300,3);fxDots(cx,cy,24,[a,b],w*.5,w*1.5,1000,[3,6])}
 if(k==8){fxFace([{filter:"hue-rotate(0deg) brightness(1)"},{filter:"hue-rotate(180deg) brightness(1.5) saturate(1.7)",offset:.5},{filter:"hue-rotate(360deg) brightness(1)"}],1500);fxSpiral(cx,cy,64,["#fff","#ffb3f0","#8fe9ff","#c9a8ff"],mx*.6,Math.max(innerWidth,innerHeight)*.7,1900,3);fxN("width:100%;height:100%;background:radial-gradient(circle,rgba(255,255,255,.7),transparent 60%);mix-blend-mode:screen",[{opacity:0},{opacity:.8,offset:.15},{opacity:0}],900)}
 if(k=="s"){fxN("width:100%;height:100%;background:radial-gradient(circle at 50% 50%,transparent 20%,rgba(0,0,0,.85))",[{opacity:0},{opacity:1,offset:.25},{opacity:0}],1100);fxDots(cx,cy,18,["#ffd24a","#b8860b"],w*.5,w*1.3,1100,[2,4])}
 if(k=="e")for(let i=0;i<4;i++)fxDots(cx+rnd(-w,w),cy+rnd(-h*.7,h*.7),16,[a,b,"#ff5fa2","#4cf0ff","#fff"],20,rnd(50,90),900,[3,5]);
 vib(n>=6?[20,30,40]:14)}

function openCard(id){
 const s0=S[id-1];if(!s0)return;
 CV.on=true;CV.id=id;CV.ang=reducedMotion()?0:-60;CV.target=0;CV.tilt=0;CV.v=0;CV.tv=0;CV.drag=null;
 $("cvCard").innerHTML=cvFaces(s0);sizeCv();$("cv").classList.add("on");applyCv();fitCv();cvGo();vib(10);AM.open(s0);
 loadStats().then(r=>{if(r&&CV.on&&CV.id===id){$("cvCard").innerHTML=cvFaces(s0);applyCv();fitCv()}});
}
function closeCard(){CV.on=false;AM.close();$("cvfx").innerHTML="";cancelAnimationFrame(CV.raf);$("cv").classList.remove("on")}
(function(){
 const cv=$("cv");
 cv.addEventListener("pointerdown",e=>{
  if(!CV.on||e.target.closest("button"))return;
  cancelAnimationFrame(CV.raf);
  CV.drag={id:e.pointerId,x0:e.clientX,y0:e.clientY,a0:CV.ang,moved:false,hist:[[performance.now(),CV.ang]]};
  try{cv.setPointerCapture(e.pointerId)}catch(_){}
 });
 cv.addEventListener("pointermove",e=>{
  const d=CV.drag;if(!d||e.pointerId!==d.id)return;
  const dx=e.clientX-d.x0,dy=e.clientY-d.y0;
  if(!d.moved&&Math.hypot(dx,dy)>6)d.moved=true;
  if(!d.moved)return;
  CV.ang=d.a0+dx*.8;CV.tilt=Math.max(-22,Math.min(22,-dy*.12));
  const now=performance.now();d.hist.push([now,CV.ang]);while(d.hist.length>2&&now-d.hist[0][0]>120)d.hist.shift();
  applyCv();
 });
 const up=e=>{
  const d=CV.drag;if(!d||e.pointerId!==d.id)return;CV.drag=null;
  if(!d.moved){CV.v=0;const q=$("cvStage").getBoundingClientRect();if(e.clientX>=q.left&&e.clientX<=q.right&&e.clientY>=q.top&&e.clientY<=q.bottom)cvTap()}
  else{const h0=d.hist[0],h1=d.hist[d.hist.length-1],dt=(h1[0]-h0[0])/1000,vel=dt>0?(h1[1]-h0[1])/dt:0;
   CV.target=Math.round((CV.ang+Math.max(-1400,Math.min(1400,vel))*.22)/180)*180;CV.v=Math.max(-900,Math.min(900,vel))*.4;vib(8)}
  cvGo();
 };
 cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
 $("cvFlip").onclick=()=>{CV.target=(Math.round(CV.ang/180)+1)*180;cvGo()};
 $("cvClose").onclick=closeCard;
 addEventListener("resize",()=>{if(CV.on){sizeCv();fitCv();AM.place()}});
})();
(function(){
 let timer=null,fired=false,sx=0,sy=0;
 const hold=box=>{
  box.addEventListener("pointerdown",e=>{const m=e.target.closest(".mini");if(!m||autoRun)return;fired=false;sx=e.clientX;sy=e.clientY;clearTimeout(timer);
   timer=setTimeout(()=>{fired=true;openCard(+m.dataset.id)},480)});
  const cancel=()=>clearTimeout(timer);
  box.addEventListener("pointermove",e=>{if(Math.hypot(e.clientX-sx,e.clientY-sy)>9)cancel()});
  ["pointerup","pointercancel","pointerleave"].forEach(ev=>box.addEventListener(ev,cancel));
  box.addEventListener("click",e=>{if(fired){fired=false;e.stopPropagation();e.preventDefault()}},true);
  box.addEventListener("contextmenu",e=>{if(e.target.closest(".mini"))e.preventDefault()});
 };
 hold($("invNew"));hold($("invDup"));
})();
$("packs").onclick=e=>{const b=e.target.closest("button");if(b)buy(+b.dataset.p)};
function zig(top){const p=[],y=44;p.push(top?"0 0":"0 100%",top?"100% 0":"100% 100%");for(let i=14;i>=0;i--)p.push(`${i/14*100}% ${y+(i%2?0:9)}px`);return`polygon(${p.join(",")})`}
$("pTop").style.clipPath=zig(true);$("pBody").style.clipPath=zig(false);
async function buy(p,free){
 if(!free&&A.coins<PRICE[p])return toast("Moedas insuficientes");
 if(buying)return;if(free==="b"&&!((A.bonusPk||{})[p]>0))return toast("Você não tem esse pacote bônus");buying=true;A.coins-=free?0:PRICE[p];if(free===true)A.freePk=dayKey();if(free==="b"){A.bonusPk[p]--;renderBonusPk()}A.packsOpened=(A.packsOpened||0)+1;mission("open");curP=p;save();render();
 const w=wt(p),wx=wt(p,3),seen={};
 const cnt=(()=>{const x=Math.random();let e=p<8?(x<EXP[p]?1:0):(x<.02?2:x<.12?1:0);if(!e&&((A.dry||0)>=24||(!(A.exN||0)&&(A.dry||0)>=2)))e=1;if(e)A.exN=(A.exN||0)+1;A.dry=e?0:(A.dry||0)+1;save();return COUNT[p]+e})();
 cur=Array.from({length:cnt},(_,i)=>{const s=pick(i>=COUNT[p]?wx:w),nw=!A.owned[s.id]&&!seen[s.id];seen[s.id]=1;return{s,nw,x:i>=COUNT[p]}});flipped=0;extraShown=false;
 {const ev=evCard();if(ev)cur.push({s:ev,nw:!ownOf(ev),x:true});const sx=await trySecret(p);if(sx)cur.push({s:sx,nw:!ownOf(sx),x:true})}
 const pk=$("pack");pk.className="";pk.style.setProperty("--h",TH[p]);
 pk.querySelector(".logo").innerHTML=`<b>${TN[p].toUpperCase()}</b><span>PACOTE · ${COUNT[p]} FIGURINHAS</span><i>${PEM[p]}</i><em>${"★".repeat(Math.min(5,Math.ceil((p+1)/2)))}</em>`;
 $("stage").style.setProperty("--h",TH[p]);$("stage").classList.remove("dealt");
 $("cards").innerHTML="";$("actions").innerHTML="";$("hint").textContent="Toque no pacote para abrir";{const xo=$("xs");if(xo)xo.remove()}$("open").classList.remove("dark");$("cards").classList.remove("dimmed");buying=false;$("open").classList.add("on")}
$("pack").onclick=()=>{const best=Math.max(...cur.filter(c=>!c.x).map(c=>c.s.t)),pk=$("pack");$("hint").textContent="";
 const tearIt=()=>{pk.classList.remove("shake","shake2");pk.classList.add("tear","t"+curP);packFx(curP,pk);openBurst(curP,pk);vib(40);if(best>=2)burst(best,pk);setTimeout(()=>{pk.classList.add("gone");showCards()},750)};
 if(best>=2){pk.classList.add("shake","aura"+best);$("hint").textContent="Algo especial está vindo…";if(navigator.vibrate)navigator.vibrate([60,40,60,40,60,40,150]);setTimeout(()=>pk.classList.add("shake2"),(500+best*110)*.55);setTimeout(tearIt,500+best*110)}else{pk.classList.add("shake");vib(22);setTimeout(tearIt,380)}};
const BC={2:["#4cd37a","#1b8f4a","🍀","RARA"],3:["#ffd24a","#f29a00","🪙","SUPER RARA"],4:["#ff8a3c","#e8432e","💥","ULTRA RARA"],5:["#c04df0","#6b2bd9","🔮","ÉPICA"],6:["#ffb02e","#ff4d00","🔥","LENDÁRIA"],7:["#3df5ff","#2a6cff","⚡","MÍTICA"],8:["#c78bff","#ff6bd6","✨","CÓSMICA"]};
function showCards(){
 $("cards").style.setProperty("--z",(n=>n>9?.68:n>6?.8:n>4?.92:1)(cur.filter(c=>!c.x).length));$("cards").innerHTML=cur.map(({s,nw},i)=>`<div class="card ${s.t>=3?"holo":""}" style="animation-delay:${i*.1}s"><span class="new ${nw?"":"dup"}">${nw?"NOVA!":"REPETIDA"}</span><div class="inner"><div class="face back">⭐</div><div class="face front" style="background:${bg(s)};border-color:${bc(s)};${s.t>=5?`box-shadow:0 0 22px hsl(${TH[s.t]} 100% 60%)`:""}"><span class="n">#${s.id}</span>${emo(s)}<div style="width:100%"><div class="r">${LB(s)}</div><div class="nm">${s.n}</div></div></div></div></div>`).join("");
 [...$("cards").children].forEach((el,i)=>{el.dataset.i=i;el.onclick=()=>flip(el);if(cur[i].x){el.classList.add("xhid");return}el.classList.add("in");if(cur[i].s.t>=5){el.classList.add("omen");el.style.setProperty("--oc",BC[cur[i].s.t][0]);el.style.setProperty("--od",(1.2+Math.random()*3.5).toFixed(1)+"s")}});
 {const pr=$("pack").getBoundingClientRect(),pcx=pr.left+pr.width/2,pcy=pr.top+pr.height/2,zz=parseFloat($("cards").style.getPropertyValue("--z"))||1;
  [...$("cards").children].forEach(el=>{if(el.classList.contains("xhid"))return;const q=el.getBoundingClientRect();
   el.style.setProperty("--dx",((pcx-(q.left+q.width/2))/zz).toFixed(1)+"px");el.style.setProperty("--dy",((pcy-(q.top+q.height/2))/zz).toFixed(1)+"px");el.style.setProperty("--dr",(Math.random()*50-25).toFixed(0)+"deg")});
  $("stage").classList.add("dealt")}
 $("hint").textContent="Toque nas cartas para virar · toque de novo para ver o verso";
 $("actions").innerHTML=`<button class="ghost" id="fa">Virar todas</button>`;
 $("fa").onclick=()=>[...document.querySelectorAll(".card:not(.flip):not(.xhid)")].forEach((el,i)=>setTimeout(()=>flip(el),i*180))}
function flip(el){if(el.classList.contains("flip")){const c0=cur&&cur[+el.dataset.i];if(c0&&Date.now()-(+el.dataset.ft||0)>900)openCard(c0.s.id);return}
 if(el.dataset.l||el.classList.contains("xhid")||(el.classList.contains("walk")&&!el.classList.contains("lit")))return;const sc=cur[+el.dataset.i].s;
 if(sc.t>=5){el.dataset.l=1;charge(el,sc,()=>doFlip(el,sc));return}doFlip(el,sc)}
function doFlip(el,sc){el.classList.add("flip");el.dataset.ft=Date.now();if(sc.t>=2){reveal(el,sc);if(sc.k!="m")tagBanner(sc)}else{sparkPop(el,sc.t);vib(12)}
 const gN=cur.filter(c=>!c.x).length;if(!extraShown&&cur.length>gN&&flipped+1==gN){flipped++;setTimeout(extraScene,sc.t>=5?3000:sc.t>=2?2000:1000);return}
 if(++flipped==cur.length)setTimeout(()=>{$("hint").textContent="";$("actions").innerHTML=`<button class="main" id="k1">Guardar no inventário</button><button class="main" id="k2" style="background:#4f46e5">Guardar e ir ao álbum</button>`;
  $("k1").onclick=()=>keep(0);$("k2").onclick=()=>keep(1)},800)}
function keep(go){
 const els=[...document.querySelectorAll("#cards .card:not(.xhid), #xs .card")];
 const n=cur.length,nw=cur.filter(c=>c.nw).length;
 mission("new",nw);mission("rare",cur.filter(c=>c.s.t>=2).length);cur.forEach(c=>{if(c.s.hid)A.conq[c.s.ck]=(A.conq[c.s.ck]||0)+1;else A.owned[c.s.id]=(A.owned[c.s.id]||0)+1});save();cur=null;
 const fin=()=>{$("open").classList.remove("on","dark","fadeout");render();if(go)page("Album");
  toast(`${n} figurinha${n>1?"s":""} guardada${n>1?"s":""}${nw?` · ${nw} nova${nw>1?"s":""} ✨`:""}`)};
 collectCards(els,fin)}
let M=null,gyro=false,g0=null,perm=false,tgt={x:0,y:0};
addEventListener("deviceorientation",e=>{if(!M||e.gamma==null)return;gyro=true;if(!g0)g0={g:e.gamma,b:e.beta};
 tgt.x=cl((e.gamma-g0.g)/22,-1.5,1.5);tgt.y=cl((e.beta-g0.b)/22,-1.5,1.5)});
$("mg").addEventListener("pointermove",e=>{if(!M||gyro)return;const r=$("mgBox").getBoundingClientRect();
 tgt.x=cl((e.clientX-(r.left+r.width/2))/150,-1.5,1.5);tgt.y=cl((e.clientY-(r.top+r.height/2))/200,-1.5,1.5)});
$("mgBtn").onclick=async e=>{e.stopPropagation();try{perm=(await DeviceOrientationEvent.requestPermission())=="granted"}catch(_){}$("mgBtn").style.display="none";g0=null};
function game(s,slot){
 const st=$("mgSt");st.className="";st.removeAttribute("style");st.style.background=bg(s);st.style.borderColor=bc(s);
 st.innerHTML=`${emo(s)}<span class="t">${s.n}</span>`;$("mgSlot").textContent=s.id;
 M={s,Z:200/slot.getBoundingClientRect().width,x:Math.random()*160-80,y:-190,vx:0,vy:0,t:0,rot:0,on:Date.now(),done:false};
 g0=null;gyro=false;tgt={x:0,y:0};
 const need=typeof DeviceOrientationEvent!="undefined"&&typeof DeviceOrientationEvent.requestPermission=="function"&&!perm;
 $("mgBtn").style.display=need?"block":"none";
 $("mgMsg").innerHTML=need?"Ative o giroscópio para jogar":"📱 Incline o celular para mover a figurinha<br>👆 Toque na tela para colar<br><small style=\"opacity:.6\">(sem giroscópio: mova o mouse/dedo)</small>";
 $("mg").classList.add("on");requestAnimationFrame(tick)}
function tick(){if(!M)return;const m=M;m.t+=.016;
 m.vx+=tgt.x*.35+Math.sin(m.t*1.7)*.05;m.vy+=tgt.y*.35+Math.cos(m.t*1.3)*.05;m.vx*=.9;m.vy*=.9;
 const bx=Math.min(150,innerWidth/2-50),by=Math.min(200,innerHeight/2-90);
 m.x=cl(m.x+m.vx,-bx,bx);m.y=cl(m.y+m.vy,-by,by);m.rot=cl(m.vx*3+Math.sin(m.t*1.1)*7,-40,40);
 if(!m.done)$("mgSt").style.transform=`translate(${m.x}px,${m.y}px) rotate(${m.rot}deg) scale(1.2)`;
 requestAnimationFrame(tick)}
$("mg").addEventListener("click",()=>{
 const m=M;if(!m||m.done||Date.now()-m.on<600)return;
 const st=$("mgSt"),dx=m.x,dy=m.y,rot=Math.round(m.rot);m.done=true;
 if(Math.abs(dx)>105||Math.abs(dy)>150){
  $("mgMsg").textContent="Errou o espaço! Tente de novo 😅";
  st.style.transition="transform .45s,opacity .45s";st.style.opacity=0;
  st.style.transform=`translate(${dx}px,${dy+90}px) rotate(${rot*2}deg) scale(.7)`;
  setTimeout(()=>{st.style.transition="none";st.style.opacity=1;Object.assign(m,{x:Math.random()*160-80,y:-190,vx:0,vy:0,on:Date.now(),done:false})},500);return}
 st.classList.add("stuck");st.style.transform=`translate(${dx}px,${dy}px) rotate(${rot}deg) scale(1)`;
 if(navigator.vibrate)navigator.vibrate(40);
 const off=Math.hypot(dx,dy),a=Math.abs(rot);
 const g=Math.round(cl(1-off/80*.6-a/30*.4,0,1)*100);
 $("mgMsg").textContent=(off<14&&a<4?"Perfeito! 🎯":off<40&&a<12?"Boa colagem! 👍":"Ficou torta! 😅")+` +${g} 🪙`;
 setTimeout(()=>{A.pasted[m.s.id]={r:rot,x:Math.round(dx/m.Z),y:Math.round(dy/m.Z)};mission("paste");save();
  M=null;sel=null;$("mg").classList.remove("on");render();
  const n=document.querySelector(`.slot[data-id="${m.s.id}"] .st`);if(n)n.classList.add("pop");toast(`Colada! +${g} 🪙`);
  if(g>0)gainCoins(g,document.querySelector(`.slot[data-id="${m.s.id}"]`)||null)},1100)});
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
$("cover").onclick=()=>$("book").classList.add("open");
const rnd=(a,b)=>a+Math.random()*(b-a);
function fxAdd(el,ms){if(!FX.particles&&!el.classList.contains("banner"))return el;$("fx").append(el);setTimeout(()=>el.remove(),ms);return el}
function charge(el,sc,cb){el.classList.add("charge");el.style.setProperty("--cc",BC[sc.t][0]);if(navigator.vibrate)navigator.vibrate(300);setTimeout(cb,900)}
function burst(t,el){
 const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,c=BC[t];
 const mk=(cls,css,ms,tx)=>{const d=document.createElement("div");d.className=cls;d.style.cssText=css;if(tx)d.textContent=tx;return fxAdd(d,ms)};
 if(t==8)mk("warp","",2300);
 mk("flash",`background:radial-gradient(circle at ${x}px ${y}px,#fff,${c[0]} 25%,transparent 70%)`,1300);
 if(t>=3)mk("rays",`left:${x}px;top:${y}px;background:repeating-conic-gradient(${c[0]}cc 0 ${2+t}deg,transparent ${2+t}deg ${24-t}deg)`,2300);
 for(let i=0;i<Math.max(1,t-3);i++)setTimeout(()=>mk("ring",`left:${x}px;top:${y}px;--c:${i%2?c[1]:c[0]}`,1300),i*170);
 for(let i=0;i<10+(t-2)*10;i++){const a=rnd(0,6.283),d=rnd(80,120+t*40),st=t==8&&i%2;
  mk("pt"+(st?" star":""),`left:${x}px;top:${y}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;--rot:${rnd(-360,360)}deg;--d:${rnd(.9,1.8)}s;${t==8?`filter:hue-rotate(${rnd(0,360)}deg)`:""}`,2000,st?"":[c[2],"✨","⭐"][i%3])}}
function reveal(el,sc){const t=sc.t,c=BC[t];
 el.classList.remove("charge");el.classList.add("hype"+t);burst(t,el);
 if(t>=5){const st=$("stage");st.classList.remove("quake");void st.offsetWidth;st.classList.add("quake")}
 $("fx").querySelectorAll(".banner").forEach(x=>x.remove());
 const b=document.createElement("div");b.className="banner";b.style.cssText=`--g1:${c[0]};--g2:${c[1]}`;
 b.innerHTML=`<small>${c[2]} ${c[3]} ${c[2]}</small><b>${sc.n}</b>`;fxAdd(b,2700);
 if(navigator.vibrate)navigator.vibrate(t>=7?[80,40,80,40,200]:t>=5?[80,40,120]:[60])}
const PF=[["fall","#9aa4b2","#4ea8de",""],["burst","#4ea8de","#9ee7ff","✨"],["rise","#43c27a","#b6f5c9","🍃"],["coin","#ffd24a","#f29a00","🪙"],["spiral","#ff8a3c","#ffd0a0","⭐"],["geyser","#c04df0","#f0b3ff","🔮"],["fire","#ff7a1f","#ffd24a","🔥"],["bolt","#3df5ff","#fff","⚡"],["warp","#c78bff","#fff","✨"]];
function packFx(p,pk){
 const [k,c1,c2,em]=PF[p],r=pk.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+60;
 const mk=(cls,css,ms,tx)=>{const d=document.createElement("div");d.className=cls;d.style.cssText=css;if(tx)d.textContent=tx;return fxAdd(d,ms)};
 if(k=="bolt"){for(let i=0;i<6;i++)setTimeout(()=>{mk("bolt",`left:${rnd(8,80)}%;top:${rnd(5,65)}%;font-size:${rnd(3,6)}rem`,350,"⚡");mk("flash",`background:${c1}`,200)},i*130);return}
 if(k=="warp")mk("warp","",1500);
 for(let i=0;i<(k=="warp"?34:22);i++){const a=rnd(0,6.283),d=rnd(60,220),col=i%2?c1:c2;
  mk("pf "+k,`left:${x+rnd(-90,90)}px;top:${y}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;--x:${rnd(-80,80)}px;--a0:${a}rad;--r:${d}px;--rot:${rnd(-360,360)}deg;--d:${rnd(.9,1.6)}s;color:${col};${k=="fall"?`background:${col}`:""}`,2000,k=="fall"?"":em)}
 if(k=="burst"||k=="spiral")for(let i=0;i<2;i++)setTimeout(()=>mk("ring",`left:${x}px;top:${y}px;--c:${c1}`,1300),i*200)}
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function extraScene(){
 extraShown=true;$("actions").innerHTML="";$("hint").textContent="";
 const n=cur.filter(c=>c.x).length;
 $("open").classList.add("dark");$("cards").classList.add("dimmed");
 const xs=document.createElement("div");xs.id="xs";xs.style.setProperty("--z",1.15);$("stage").append(xs);
 const sp=document.createElement("div");sp.className="spot";fxAdd(sp,3300);
 const ex=[...$("cards").querySelectorAll(".xhid")];
 ex.forEach(el=>{el.classList.remove("xhid","in");el.classList.add("walk");xs.append(el)});
 if(navigator.vibrate)navigator.vibrate([50,300,50,300,50,300,50,300,120]);
 setTimeout(()=>{
  ex.forEach(el=>el.classList.add("lit"));
  const r=xs.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  const f=document.createElement("div");f.className="flash";f.style.background="radial-gradient(circle at 50% 50%,#fff,#ffd24a 25%,transparent 70%)";fxAdd(f,1300);
  [0,200].forEach(d=>setTimeout(()=>{const g=document.createElement("div");g.className="ring";g.style.cssText=`left:${cx}px;top:${cy}px;--c:#ffd24a`;fxAdd(g,1300)},d));
  $("fx").querySelectorAll(".banner").forEach(x=>x.remove());
  const b=document.createElement("div");b.className="banner";b.style.cssText="--g1:#ffd24a;--g2:#ff8a3c";
  b.innerHTML=`<small>⭐ CARTA EXTRA ⭐</small><b>${n>1?"+"+n+" extras":"+1 extra"}</b>`;fxAdd(b,2700);
  if(navigator.vibrate)navigator.vibrate([120,60,200]);
  $("hint").textContent="Toque para virar";
  $("actions").innerHTML=`<button class="ghost" id="fa">Virar todas</button>`;
  $("fa").onclick=()=>[...document.querySelectorAll("#xs .card:not(.flip)")].forEach((el,i)=>setTimeout(()=>flip(el),i*180))
 },2500)}

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBvcN1d7LdddISd1fptsfULLG8lHXDwm1A",
  authDomain: "meme-colect.firebaseapp.com",
  projectId: "meme-colect",
  storageBucket: "meme-colect.firebasestorage.app",
  messagingSenderId: "608496775691",
  appId: "1:608496775691:web:509094e78876fd03cf0d0e",
  measurementId: "G-550B5CQ0XK"
};

let fbApp=null,fbAuth=null,fbDb=null,fbUser=null;
let CD=null,CS="off",cTimer=null,cBusy=false,cDirty=false,applying=false;
let DB=null,USER=null,ME=null,canW=false,MK=[],tsel=null,tfilter="sell",pend=null;
const busyC={};

function setCloud(s){CS=s;$("cloud").textContent={off:"☁️",ok:"☁️✓",err:"☁️!",sync:"☁️…"}[s]||"☁️"}
function initFirebase(){
  try{
    if(!FIREBASE_CONFIG.apiKey||FIREBASE_CONFIG.apiKey.startsWith("SUA_"))return false;
    fbApp=firebase.initializeApp(FIREBASE_CONFIG);
    fbAuth=firebase.auth();
    fbDb=firebase.firestore();
    return true;
  }catch(e){console.warn("Firebase não configurado:",e);return false}
}
const RARITY_BONUS={6:1.5,7:2,8:3};
function calcScoreFromPasted(pasted){
  if(!pasted)return 0;
  let val=0,cnt=0,rar=0;
  for(const id in pasted){
    const s=S[id-1];if(!s)continue;
    const p=SCORE_VAL[s.t]||0;
    const mult=RARITY_BONUS[s.t]||1;
    val+=p*mult;cnt++;
    if(s.t>=6)rar++;
  }
  return Math.floor(val+cnt*100+rar*500);
}
function calcMyScore(){return calcScoreFromPasted(A.pasted)}
function detectRegion(){
  try{
    const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||"";
    if(/^America\/(Sao_Paulo|Fortaleza|Recife|Bahia|Belem|Manaus|Cuiaba|Campo_Grande|Rio_Branco|Porto_Velho|Boa_Vista|Noronha|Maceio|Araguaina|Santarem)/.test(tz))return"BR";
    if(tz.startsWith("America/Argentina"))return"AR";
    if(tz.startsWith("Europe/Lisbon"))return"PT";
    if(tz.startsWith("America/"))return"AM";
    if(tz.startsWith("Europe/"))return"EU";
    if(tz.startsWith("Asia/"))return"AS";
    if(tz.startsWith("Africa/"))return"AF";
    if(tz.startsWith("Australia/")||tz.startsWith("Pacific/"))return"OC";
    return"XX";
  }catch(e){return"XX"}
}
function cloudPush(){
  if(!CD||applying)return;
  cDirty=true;setCloud("sync");
  clearTimeout(cTimer);cTimer=setTimeout(cloudFlush,1200);
}
async function cloudFlush(){
  if(!CD)return;
  if(cBusy){cTimer=setTimeout(cloudFlush,800);return}
  cBusy=true;cDirty=false;
  try{
    try{await syncOwners()}catch(e){console.warn("stats:",e)}
    await CD.set({
      a:JSON.stringify(A),
      at:A.at||0,
      name:fbUser?.displayName||"",
      photo:fbUser?.photoURL||"",
      bio:A.bio||"",
      title:A.title||"",
      selos:Array.isArray(A.selos)?A.selos:[],
      score:calcMyScore(),
      region:detectRegion(),
      pastedCount:Object.keys(A.pasted).length,
      updated:Date.now(),
      ...(p150Done()?{p150:true}:{})
    },{merge:true});
    setCloud("ok");
  }catch(e){console.warn(e);setCloud("err")}
  cBusy=false;
}
async function cloudInit(){
  if(!fbDb||!fbUser)return;
  CD=fbDb.collection("saves").doc(fbUser.uid);
  try{
    const sn=await CD.get();
    if(sn.exists){
      const d=sn.data();
      if(d.p150&&fbUser)A.p150=fbUser.uid;
      if((d.at||0)>(A.at||0)){
        applying=true;
        try{Object.assign(A,JSON.parse(d.a));migConq()}catch(e){}
        if(d.bio!=null)A.bio=d.bio;
        if(d.title!=null)A.title=d.title;
        if(Array.isArray(d.selos))A.selos=d.selos;
        if(!Array.isArray(A.friends))A.friends=[];
        applying=false;
        try{localStorage.setItem("alb3",JSON.stringify(A))}catch(e){}
        render();renderProfile();toast("☁️ Progresso carregado da sua conta Google");
      }else{cloudPush()}
    }else{cloudPush()}
    setCloud("ok");loadStats(true);try{renderCoinShop();renderBonusPk()}catch(e){}
  }catch(e){console.warn(e);setCloud("err")}
}
addEventListener("visibilitychange",()=>{if(document.hidden&&cDirty)cloudFlush()});

function updateLoginUI(){
  const btn=$("loginBtn"),ic=$("loginIcon"),lb=$("loginLabel");
  if(fbUser){
    btn.classList.add("on");
    ic.innerHTML=fbUser.photoURL?`<img src="${fbUser.photoURL}" referrerpolicy="no-referrer" alt="">`:"✅";
    lb.style.display="inline";
    lb.textContent=(fbUser.displayName||"Conta").split(" ")[0];
    btn.title="Perfil ("+fbUser.email+")";
  }else{
    btn.classList.remove("on");
    ic.textContent="👤";
    lb.style.display="none";
    btn.title="Entrar com Google";
  }
}
async function doLogin(){
  if(!fbAuth){toast("⚙️ Firebase não inicializou");return}
  try{
    const provider=new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({prompt:"select_account"});
    await fbAuth.signInWithPopup(provider);
    toast("✅ Login realizado!");
  }catch(e){console.warn(e);toast("Erro: "+(e.code||e.message||"desconhecido"))}
}
async function doLogout(){
  if(!fbAuth)return;
  try{await fbAuth.signOut();toast("Você saiu da conta")}catch(e){}
}
$("loginBtn").onclick=()=>{fbUser?page("Profile"):doLogin()};
$("pfLogout").onclick=()=>{doLogout();page("Album")};
$("cloud").onclick=()=>{
  if(!fbUser)return toast("👤 Entre com Google para salvar na nuvem");
  if(CS=="ok"){cloudFlush();toast("☁️ Progresso salvo na sua conta")}
  else if(CS=="err")toast("☁️ Erro ao salvar. Tentarei de novo.");
  else toast("☁️ Sincronizando…");
};
function wrapFirestore(){
  DB={
    collection:(name)=>({
      add:(data)=>fbDb.collection(name).add(data).then(r=>({id:r.id})),
      doc:(id)=>fbDb.collection(name).doc(id),
      onSnapshot:(cb,err)=>fbDb.collection(name).onSnapshot(cb,err)
    }),
    doc:(path)=>fbDb.doc(path)
  };
  USER={
    id:async()=>fbUser?fbUser.uid:null,
    can:async()=>true,
    profiles:async(uids)=>{
      const out={};
      await Promise.all(uids.map(async u=>{
        try{const s=await fbDb.collection("saves").doc(u).get();
          if(s.exists)out[u]={name:s.data().name||"Jogador"}}catch(e){}
      }));
      return out;
    }
  };
}
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

(function(){
  const TT={missions:"📋 Missões e bônus diário",settings:"⚙️ Configurações",terms:"📜 Termos de uso",credits:"🏅 Créditos"};
  const menu=$("menuOv"),sub=$("subOv");
  $("menuBtn").onclick=()=>menu.classList.add("on");
  menu.onclick=e=>{if(e.target===menu)menu.classList.remove("on")};
  function setTheme(t){
    const r=document.documentElement;
    if(t=="auto")r.removeAttribute("data-theme");else r.setAttribute("data-theme",t);
    try{localStorage.setItem("albTheme",t)}catch(e){}
    document.querySelectorAll("#themeBtns button").forEach(b=>b.classList.toggle("on",b.dataset.t==t));
  }
  function openSub(id){
    menu.classList.remove("on");
    document.querySelectorAll("#subOv .subp").forEach(x=>x.hidden=x.id!=="sub_"+id);
    $("subTitle").textContent=TT[id]||"";
    sub.classList.add("on");sub.scrollTop=0;
    if(id=="missions"){try{renderDaily()}catch(e){console.warn(e)}}
    if(id=="settings"){$("setAcc").textContent=fbUser?("Conectado: "+(fbUser.email||"conta Google")):"Não conectado. Use o botão de perfil no topo para entrar com Google."}
  }
  document.querySelectorAll("#menuDr button[data-sub]").forEach(b=>b.onclick=()=>openSub(b.dataset.sub));
  $("subBack").onclick=()=>sub.classList.remove("on");
  $("themeBtns").onclick=e=>{const b=e.target.closest("button");if(b)setTheme(b.dataset.t)};
  let t0="auto";try{t0=localStorage.getItem("albTheme")||"auto"}catch(e){}
  setTheme(t0);

  const book=$("book"),pb=$("pasteBox"),nav=document.querySelector("nav");
  document.body.appendChild(pb);
  function sync(){pb.hidden=!book.classList.contains("open")||$("pgAlbum").hidden;navH();fitLock()}
  new MutationObserver(sync).observe(book,{attributes:true,attributeFilter:["class"]});
  $("pasteTgl").onclick=()=>pb.classList.toggle("min");
  function navH(){document.documentElement.style.setProperty("--navh",nav.offsetHeight+"px")}

  function fitLock(){
    const h=document.documentElement;h.classList.remove("noscroll");
    if($("pgAlbum").hidden)return;
    scrollTo(0,0);
    const bottom=$("pgAlbum").getBoundingClientRect().bottom+nav.offsetHeight;
    if(bottom<=innerHeight+4)h.classList.add("noscroll");
  }
  window.fitLock=fitLock;
  addEventListener("resize",()=>{navH();fitLock()});
  if(window.ResizeObserver)new ResizeObserver(()=>fitLock()).observe($("pgAlbum"));
  addEventListener("scroll",()=>{if(document.documentElement.classList.contains("noscroll")&&scrollY)scrollTo(0,0)},{passive:true});
  const ind=document.createElement("i");ind.className="navInd";nav.appendChild(ind);
  function placeInd(n){const b=$("nav"+n);if(!b){ind.style.opacity=0;return}const w=b.offsetWidth;ind.style.opacity=1;ind.style.width=(w*.42)+"px";ind.style.transform=`translateX(${b.offsetLeft+w*.29}px)`}
  const ORDER={Album:0,Shop:1,Trade:2,Rank:3,Profile:4};
  let curPg="Album",tok=0;
  function enter(n,dir){
    const ne=$("pg"+n);
    if(FX.tabs){ne.style.setProperty("--dx",(dir*30)+"px");ne.classList.remove("pgIn");void ne.offsetWidth;ne.classList.add("pgIn");setTimeout(()=>ne.classList.remove("pgIn"),380)}
    sync();setTimeout(fitLock,0);
  }
  const _page=page;
  window.page=page=function(n){
    const from=curPg;
    ["Album","Shop","Trade","Rank"].forEach(k=>{const b=$("nav"+k);if(b)b.classList.toggle("on",k==n)});
    placeInd(n);
    if(n===from){_page(n);sync();setTimeout(fitLock,0);return}
    const dir=ORDER[n]>=ORDER[from]?1:-1,my=++tok;
    if(!FX.tabs){_page(n);curPg=n;enter(n,dir);return}
    const fe=$("pg"+from);
    fe.style.setProperty("--dx",(-dir*22)+"px");fe.classList.add("pgOut");pb.hidden=true;
    setTimeout(()=>{fe.classList.remove("pgOut");if(my!==tok)return;_page(n);curPg=n;enter(n,dir)},130);
  };
  setTimeout(()=>placeInd("Album"),60);addEventListener("resize",()=>placeInd(curPg));
  $("navAlbum").onclick=()=>page("Album");$("navShop").onclick=()=>page("Shop");$("navTrade").onclick=()=>page("Trade");$("navRank").onclick=()=>page("Rank");
  sync();
})();

(function(){
  const ROWS=[["tabs","Transições entre abas","Animação suave ao trocar de aba"],
   ["page3d","Folha 3D realista","Desligado: as páginas trocam na hora"],
   ["leafHQ","Folha em alta qualidade","Desligue se a virada de página engasgar"],
   ["particles","Partículas e explosões","Raios, anéis e confete ao abrir pacotes"],
   ["shine","Brilhos animados","Reflexos nas cartas e brilhos contínuos"],
   ["shake","Tremor de tela","Sacudida ao sair carta rara"],
   ["vibe","Vibração","Vibração do aparelho nos efeitos"]];
  const PRE={saver:{tabs:0,page3d:0,leafHQ:0,particles:0,shine:0,shake:0,vibe:1},
   bal:{tabs:1,page3d:1,leafHQ:0,particles:1,shine:0,shake:0,vibe:1},
   max:{tabs:1,page3d:1,leafHQ:1,particles:1,shine:1,shake:1,vibe:1}};
  function paint(){
    $("fxList").innerHTML=ROWS.map(r=>`<div class="swr"><div><b>${r[1]}</b><small>${r[2]}</small></div><button class="sw ${FX[r[0]]?"on":""}" role="switch" aria-checked="${!!FX[r[0]]}" data-k="${r[0]}"><i></i></button></div>`).join("");
    document.querySelectorAll("#fxPresets button").forEach(b=>{const p=PRE[b.dataset.p];b.classList.toggle("on",Object.keys(p).every(k=>!!FX[k]==!!p[k]))});
  }
  $("fxList").onclick=e=>{const b=e.target.closest(".sw");if(!b)return;const k=b.dataset.k;FX[k]=FX[k]?0:1;fxSave();paint()};
  $("fxPresets").onclick=e=>{const b=e.target.closest("button");if(!b)return;Object.assign(FX,PRE[b.dataset.p]);fxSave();paint();toast("Gráficos atualizados")};
  paint();
})();
