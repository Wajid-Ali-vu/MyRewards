import { isoDate, toNum, uid } from './utils.js';

export function addLoan(account,{lender,borrower,amount,date,direction,status='Active',note=''}){
  const loan={id:uid('loan'),lender,borrower,amount:toNum(amount,0),date:date||isoDate(),type:direction,status,note};
  account.loans.unshift(loan);
  account.loanLog.unshift({id:uid('llog'),action:'created',loanId:loan.id,time:isoDate(),amount:loan.amount,lender,borrower,status});
}
export function markLoanPaid(account,id){const l=account.loans.find(x=>x.id===id);if(!l)return;l.status='Paid';account.loanLog.unshift({id:uid('llog'),action:'paid',loanId:id,time:isoDate(),amount:l.amount,lender:l.lender,borrower:l.borrower,status:'Paid'})}
export function deleteLoan(account,id){const i=account.loans.findIndex(x=>x.id===id);if(i<0)return;const [l]=account.loans.splice(i,1);account.loanLog.unshift({id:uid('llog'),action:'deleted',loanId:id,time:isoDate(),amount:l.amount,lender:l.lender,borrower:l.borrower,status:l.status})}
export function filterLoans(loans,filter,query=''){
  const q=query.toLowerCase();
  return loans.filter(l=>{
    const f = filter==='All' || l.status===filter || l.type===filter;
    const s = !q || `${l.lender} ${l.borrower} ${l.note||''}`.toLowerCase().includes(q);
    return f&&s;
  });
}
export function loanSummary(loans){return loans.reduce((a,l)=>{if(l.status==='Active')a.active++;if(l.type==='Given')a.given+=l.amount;else a.taken+=l.amount;return a},{active:0,given:0,taken:0})}
