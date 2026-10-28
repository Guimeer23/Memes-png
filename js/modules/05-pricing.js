/* Módulo extraído de js/album.js para facilitar manutenção. Ordem definida em js/album.js. */
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
