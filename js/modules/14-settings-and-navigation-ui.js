/* Módulo extraído de js/album.js para facilitar manutenção. Ordem definida em js/album.js. */
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

