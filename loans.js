import { getActiveAccount } from './accounts.js';
import { openFormModal } from './modals.js';

const FILTERS = ['All', 'Given', 'Taken', 'Pending', 'Paid'];

export function renderLoansView({ state, selectedFilter, onFilter, onAddLoan }) {
  const root = document.getElementById('loansView');
  const account = getActiveAccount(state);

  if (!account) {
    root.innerHTML = '<div class="empty-state">Select an account to manage loans.</div>';
    return;
  }

  const loans = account.loans || [];
  const filtered = loans.filter((loan) => {
    if (selectedFilter === 'All') return true;
    return loan.type === selectedFilter || loan.status === selectedFilter;
  });

  root.innerHTML = `
    <div class="panel">
      <div class="inline-actions" style="justify-content: space-between; align-items:center;">
        <h2 class="section-title">Loan manager</h2>
        <button id="addLoanBtn" class="btn primary">Add Loan</button>
      </div>
      <div class="filters">
        ${FILTERS.map((filter) => `<button class="filter-pill ${filter === selectedFilter ? 'is-active' : ''}" data-loan-filter="${filter}">${filter}</button>`).join('')}
      </div>
      ${filtered.length ? `<ul class="list">${filtered.map(loanTemplate).join('')}</ul>` : '<div class="empty-state">No loans found for this filter.</div>'}
    </div>
  `;

  root.querySelectorAll('[data-loan-filter]').forEach((button) => {
    button.addEventListener('click', () => onFilter(button.dataset.loanFilter));
  });

  root.querySelector('#addLoanBtn')?.addEventListener('click', onAddLoan);
}

export function promptAddLoan(onSubmit) {
  openFormModal({
    title: 'Add Loan',
    fields: [
      { name: 'lender', label: 'Lender' },
      { name: 'borrower', label: 'Borrower' },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'type', label: 'Type', type: 'select', options: ['Given', 'Taken'] },
      { name: 'status', label: 'Due status', type: 'select', options: ['Pending', 'Paid'] }
    ],
    onSubmit
  });
}

function loanTemplate(loan) {
  return `
    <li>
      <strong>${loan.lender} → ${loan.borrower}</strong>
      <div class="small">Amount: ${Number(loan.amount).toFixed(2)} • ${loan.type} • ${loan.status}</div>
      <div class="small">Date: ${new Date(loan.date).toLocaleDateString()}</div>
    </li>
  `;
<<<<<<< HEAD
}
=======
}
>>>>>>> 4aa1183961d7d50d19c8bac59600b8e76863f00e
