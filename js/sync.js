import { appState, saveLocal } from './state.js';

const firebaseConfig={apiKey:"AIzaSyDiSNTF50jv3JtFyO2or_wH2wvKooRIQw8",authDomain:"myrewards-7b777.firebaseapp.com",projectId:"myrewards-7b777",storageBucket:"myrewards-7b777.firebasestorage.app",messagingSenderId:"435751610864",appId:"1:435751610864:web:0397a7ff1ea5d4b4229535",measurementId:"G-9B866N9PPM"};
const appId='my-rewards-tracker';
let refs={};

export async function startSync(onRemoteUpdate){
  try{
    const appMod=await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js');
    const authMod=await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js');
    const fsMod=await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js');
    const app=appMod.initializeApp(firebaseConfig);
    const auth=authMod.getAuth(app);
    const db=fsMod.getFirestore(app);
    refs={auth,db,authMod,fsMod};
    authMod.onAuthStateChanged(auth,async(user)=>{
      if(!user){appState.sync.mode='local';saveLocal();onRemoteUpdate?.();return}
      appState.sync.mode='online';
      const base=['artifacts',appId,'users',user.uid];
      const col=fsMod.collection(db,...base,'rewards_accounts');
      const meta=fsMod.doc(db,...base,'metadata','sorting');
      const snap=await fsMod.getDocs(col);
      if(!snap.empty){
        const data={}; snap.forEach(d=>data[d.id]=d.data());
        appState.accountsData={...appState.accountsData,...data};
      }
      const metaSnap=await fsMod.getDoc(meta); if(metaSnap.exists()) appState.accountOrder=metaSnap.data().order||appState.accountOrder;
      saveLocal(); onRemoteUpdate?.();
    });
  }catch(e){console.warn('Sync unavailable',e); appState.sync.mode='local';}
}

export async function syncNow(){
  if(appState.sync.mode!=='online'||!refs.auth?.currentUser)return;
  const {fsMod,db,auth}=refs; const user=auth.currentUser; const base=['artifacts',appId,'users',user.uid];
  const batch=fsMod.writeBatch(db);
  Object.entries(appState.accountsData).forEach(([id,val])=>batch.set(fsMod.doc(db,...base,'rewards_accounts',id),val));
  batch.set(fsMod.doc(db,...base,'metadata','sorting'),{order:appState.accountOrder});
  await batch.commit();
}
