/* Módulo extraído de js/album.js para facilitar manutenção. Ordem definida em js/album.js. */
/* Configuração e estado do Firebase: preservados da versão estável v1.30.15. */
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
