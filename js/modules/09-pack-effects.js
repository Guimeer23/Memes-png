/* Módulo extraído de js/album.js para facilitar manutenção. Ordem definida em js/album.js. */
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

