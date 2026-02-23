import { openConfirmModal, openFormModal, openNoticeModal } from './modals.js';

export function getActiveAccount(state) {
  return state.accounts[state.activeAccountId] || null;
}

export function renderAccountSwitcher(state, onSwitch) {
  const select = document.getElementById('accountSwitcher');
  const ids = Object.keys(state.accounts);

  select.innerHTML = ids.map((id) => {
    const account = state.accounts[id];
    return `<option value="${id}" ${id === state.activeAccountId ? 'selected' : ''}>${account.profile.name}</option>`;
  }).join('');

  select.onchange = () => onSwitch(select.value);
}

export function renderAccountsView({ state, onAdd, onEdit, onDelete }) {
  const root = document.getElementById('accountsView');
  const entries = Object.values(state.accounts);

  root.innerHTML = `
    <div class="panel">
      <div class="inline-actions" style="justify-content: space-between; align-items: center;">
        <h2 class="section-title">Accounts</h2>
        <button class="btn primary" id="addAccountBtn"><i class="fa-solid fa-plus"></i> Add Account</button>
      </div>
      ${entries.length ? `<ul class="list">${entries.map(accountTemplate).join('')}</ul>` : '<div class="empty-state">No account found. Add your first account.</div>'}
    </div>
  `;

  root.querySelector('#addAccountBtn')?.addEventListener('click', () => onAdd());

  root.querySelectorAll('[data-action="edit-account"]').forEach((button) => {
    button.addEventListener('click', () => onEdit(button.dataset.id));
  });

  root.querySelectorAll('[data-action="delete-account"]').forEach((button) => {
    button.addEventListener('click', () => onDelete(button.dataset.id));
  });
}

export function promptAddAccount(onSave) {
  openFormModal({
    title: 'Add Account',
    fields: [
      { name: 'name', label: 'Account name', value: '' },
      { name: 'email', label: 'Email', type: 'email', value: '' },
      { name: 'type', label: 'Type', type: 'select', options: ['Personal', 'Work', 'Family'] }
    ],
    onSubmit: (values) => {
      if (!values.name || !values.email) {
        openNoticeModal({ title: 'Missing fields', message: 'Name and email are required.' });
        return;
      }
      onSave(values);
    }
  });
}

export function promptEditAccount(account, onSave) {
  openFormModal({
    title: 'Edit Account',
    fields: [
      { name: 'name', label: 'Account name', value: account.profile.name },
      { name: 'email', label: 'Email', type: 'email', value: account.profile.email },
      { name: 'type', label: 'Type', type: 'select', options: ['Personal', 'Work', 'Family'], value: account.profile.type }
    ],
    onSubmit: onSave
  });
}

export function promptDeleteAccount(accountName, onConfirm) {
  openConfirmModal({
    title: 'Delete account',
    message: `Delete ${accountName}? This action cannot be undone.`,
    confirmText: 'Delete',
    onConfirm
  });
}

function accountTemplate(account) {
  return `
    <li>
      <strong>${account.profile.name}</strong>
      <div class="small">${account.profile.email} • ${account.profile.type}</div>
      <div class="inline-actions" style="margin-top:.5rem;">
        <button class="btn" data-action="edit-account" data-id="${account.id}">Edit</button>
        <button class="btn danger" data-action="delete-account" data-id="${account.id}">Delete</button>
      </div>
    </li>
  `;
}