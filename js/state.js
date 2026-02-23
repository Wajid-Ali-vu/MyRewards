import { dayKey, isoDate, toNum, uid } from './utils.js';

const KEY_ACCOUNTS='rewards_v4_accounts';
const KEY_ORDER='rewards_v4_order';
const KEY_APP='myrewards_dashboard_v2';

export let appState={accountsData:{},accountOrder:[],activeAccountId:null,globalReminders:[],activityLog:[],settings:{darkMode:false},sync:{mode:'local'}};

function createDefaultAccount(){
  const id='acc-main';
  return {id,name:'Main Account',sub:'Personal',queries:[],qindex:0,targetPC:30,targetMobile:20,pcDone:0,mobDone:0,today:dayKey(),points:0,sessions:[],adjustments:[],alarm:'',reminders:[],loans:[],loanLog:[]};
}

function normalizeAccount(raw,id){
  const acc={...createDefaultAccount(),...raw,id};
  acc.targetPC=toNum(acc.targetPC,30); acc.targetMobile=toNum(acc.targetMobile,20);
  acc.pcDone=toNum(acc.pcDone,0); acc.mobDone=toNum(acc.mobDone,0); acc.points=toNum(acc.points,0);
  acc.reminders=Array.isArray(acc.reminders)?acc.reminders:[];
  acc.sessions=Array.isArray(acc.sessions)?acc.sessions:[];
  acc.loans=Array.isArray(acc.loans)?acc.loans:[];
  acc.loanLog=Array.isArray(acc.loanLog)?acc.loanLog:[];
  return acc;
}

function migrate(input){
  const s={...appState,...input};
  s.accountsData=s.accountsData||s.accounts||{};
  const ids=Object.keys(s.accountsData);
  const norm={}; ids.forEach(id=> norm[id]=normalizeAccount(s.accountsData[id],id));
  s.accountsData=norm;
  s.accountOrder=Array.isArray(s.accountOrder)?s.accountOrder.filter(id=>norm[id]):[];
  ids.forEach(id=>{if(!s.accountOrder.includes(id)) s.accountOrder.push(id)});
  if(!s.accountOrder.length){const def=createDefaultAccount();s.accountsData[def.id]=def;s.accountOrder=[def.id]}
  s.activeAccountId=(s.activeAccountId&&s.accountsData[s.activeAccountId])?s.activeAccountId:s.accountOrder[0];
  s.globalReminders=Array.isArray(s.globalReminders)?s.globalReminders:[];
  s.activityLog=Array.isArray(s.activityLog)?s.activityLog:[];
  s.settings={darkMode:false,...(s.settings||{})};
  return s;
}

export function loadLocal(){
  const legacyAccounts=localStorage.getItem(KEY_ACCOUNTS);
  const legacyOrder=localStorage.getItem(KEY_ORDER);
  const app=localStorage.getItem(KEY_APP);
  const parsed=app?JSON.parse(app):{accountsData:legacyAccounts?JSON.parse(legacyAccounts):{},accountOrder:legacyOrder?JSON.parse(legacyOrder):[]};
  appState=migrate(parsed);
  saveLocal();
  return appState;
}

export function saveLocal(){
  localStorage.setItem(KEY_ACCOUNTS,JSON.stringify(appState.accountsData));
  localStorage.setItem(KEY_ORDER,JSON.stringify(appState.accountOrder));
  localStorage.setItem(KEY_APP,JSON.stringify(appState));
}

export function getActiveAccount(){return appState.accountsData[appState.activeAccountId]||null}
export function setActiveAccount(id){if(appState.accountsData[id]) appState.activeAccountId=id}
export function pushActivity(text,accountId=appState.activeAccountId){appState.activityLog.unshift({id:uid('act'),text,time:isoDate(),accountId});if(appState.activityLog.length>500) appState.activityLog.length=500}
