/* Módulo extraído de js/album.js para facilitar manutenção. Ordem definida em js/album.js. */
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
