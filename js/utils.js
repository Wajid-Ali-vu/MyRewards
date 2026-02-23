export const uid = (p='id') => `${p}-${Math.random().toString(36).slice(2,10)}`;
export const toNum = (v,d=0)=>{const n=Number(v);return Number.isFinite(n)?n:d};
export const isoDate = ()=> new Date().toISOString();
export const dayKey = ()=> new Date().toISOString().split('T')[0];
export const fmtDateTime = (v)=> new Date(v).toLocaleString();
export const fmtDate = (v)=> new Date(v).toLocaleDateString();
export const esc = (s='') => String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
export function downloadJson(name,data){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
export async function readFileJson(file){return JSON.parse(await file.text())}
