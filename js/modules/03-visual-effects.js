/* Módulo extraído de js/album.js para facilitar manutenção. Ordem definida em js/album.js. */
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
