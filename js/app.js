import { initAlarmPermission, startAlarmTicker, checkAlarms } from './alarms.js';
import { loadLocal, saveLocal } from './state.js';
import { startSync, syncNow } from './sync.js';
import { bindGlobalEvents, render } from './ui.js';

loadLocal();
bindGlobalEvents();
render();
initAlarmPermission();
startAlarmTicker(()=>render());
startSync(()=>render());

window.checkAlarms=checkAlarms;
window.render=render;
window.loadLocal=loadLocal;
window.saveLocal=saveLocal;
window.startSync=startSync;

window.addEventListener('beforeunload',()=>{syncNow().catch(()=>{});});
