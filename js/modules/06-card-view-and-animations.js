/* Módulo extraído de js/album.js para facilitar manutenção. Ordem definida em js/album.js. */
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
