import { appState, saveLocal } from './state.js';
import { dayKey, uid } from './utils.js';

let notify;
export function initAlarmPermission(){ if('Notification' in window && Notification.permission==='default') Notification.requestPermission(); notify=(msg)=>window.dispatchEvent(new CustomEvent('toast',{detail:msg})); }

export function addGlobalReminder(text,due){appState.globalReminders.unshift({id:uid('gr'),text,due,done:false});saveLocal()}

export function checkAlarms(){
  const now = Date.now();
  const upcoming=[];
  const consume=(item,scope)=>{if(item.done)return; const t=new Date(item.due||item.time||item.alarm||0).getTime(); if(!t)return; if(t<=now+30*60000){upcoming.push({...item,scope}); if(t<=now){item.done=true; if('Notification' in window && Notification.permission==='granted') new Notification('MyRewards Reminder',{body:item.text||scope}); notify(`Reminder: ${item.text||scope}`)}}};
  Object.values(appState.accountsData).forEach(acc=>{(acc.reminders||[]).forEach(r=>consume(r,acc.name)); if(acc.alarm) consume({text:`${acc.name} alarm`,due:acc.alarm,done:acc.alarmDone},acc.name)});
  appState.globalReminders.forEach(r=>consume(r,'Global'));
  saveLocal();
  return upcoming.sort((a,b)=>new Date(a.due)-new Date(b.due));
}

export function startAlarmTicker(cb){setInterval(()=>cb(checkAlarms()),60000); cb(checkAlarms())}
export { dayKey };
