import { loadState, resetState, saveState } from './sync.js';
import {
  getActiveAccount,
  promptAddAccount,
  promptDeleteAccount,
  promptEditAccount,
  renderAccountsView,
  renderAccountSwitcher
} from './accounts.js';
import {
  bindNotificationsPanel,
  renderActivityView,
  renderDashboardView,
  renderNotificationsPanel,
  renderSettingsView
} from './dashboard.js';
import { promptAddLoan, renderLoansView } from './loans.js';
import { openNoticeModal } from './modals.js';

let state = loadState();
let route = 'dashboard';
let loanFilter = 'All';

boot();

function boot() {
  bindStaticEvents();
  renderAll();
  setLoading(false);

  // Roadmap: support real-time sync heartbeat and device-level conflict inspector.
}

function bindStaticEvents() {
  document.querySelectorAll('.nav-link').forEach((button) => {
    button.addEventListener('click', () => {
      route = button.dataset.route;
      renderRoute();
    });
  });

  document.getElementById('open-notifications').addEventListener('click', () => {
    route = 'activity';
    renderRoute(true);
  });

  document.getElementById('openSettingsFromProfile').addEventListener('click', () => {
    route = 'settings';
    renderRoute();
  });

  document.getElementById('clearDataBtn').addEventListener('click', () => {
    state = resetState();
    toast('Local data reset');
    renderAll();
  });

  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('is-open');
  });
}

function renderAll() {
  renderAccountSwitcher(state, (accountId) => {
    state.activeAccountId = accountId;
    logActivity(`Switched to account ${state.accounts[accountId].profile.name}`);
    persistAndRender();
  });

  renderDashboardView(state);
  renderActivityView(state);

  renderAccountsView({
    state,
    onAdd: handleAddAccount,
    onEdit: handleEditAccount,
    onDelete: handleDeleteAccount
  });

  renderLoansSection();

  renderSettingsView(state, ({ text }) => {
    addNotification(text);
    persistAndRender();
  });

  renderNotificationCenterInActivity();
  renderRoute();
}

function renderNotificationCenterInActivity() {
  const root = document.getElementById('activityView');
  root.insertAdjacentHTML('beforeend', renderNotificationsPanel(state));
  bindNotificationsPanel(() => {
    state.notifications = state.notifications.map((item) => ({ ...item, unread: false }));
    persistAndRender();
  });
  syncNotificationBadge();
}

function renderRoute(openNotifications = false) {
  document.querySelectorAll('.view').forEach((view) => view.classList.remove('is-visible'));
  document.querySelectorAll('.nav-link').forEach((link) => link.classList.remove('is-active'));

  const targetId = `${route}View`;
  const target = document.getElementById(targetId);
  if (target) target.classList.add('is-visible');

  const nav = document.querySelector(`[data-route="${route}"]`);
  if (nav) nav.classList.add('is-active');

  if (openNotifications) {
    document.querySelector('#activityView .panel:last-child')?.scrollIntoView({ behavior: 'smooth' });
  }
}

function handleAddAccount() {
  promptAddAccount((values) => {
    const id = `acc-${crypto.randomUUID().slice(0, 8)}`;
    state.accounts[id] = {
      id,
      profile: { name: values.name, email: values.email, type: values.type },
      points: { total: 0, today: 0, weekly: 0 },
      reminders: [],
      sessions: [],
      loans: []
    };
    state.activeAccountId = id;
    logActivity(`Created account ${values.name}`);
    toast('Account created');
    persistAndRender();
  });
}

function handleEditAccount(accountId) {
  const account = state.accounts[accountId];
  if (!account) return;

  promptEditAccount(account, (values) => {
    account.profile = { name: values.name, email: values.email, type: values.type };
    logActivity(`Updated account ${values.name}`);
    toast('Account updated');
    persistAndRender();
  });
}

function handleDeleteAccount(accountId) {
  const account = state.accounts[accountId];
  if (!account) return;

  const accountCount = Object.keys(state.accounts).length;
  if (accountCount <= 1) {
    openNoticeModal({ title: 'Cannot delete', message: 'At least one account is required.' });
    return;
  }

  promptDeleteAccount(account.profile.name, () => {
    delete state.accounts[accountId];
    if (state.activeAccountId === accountId) {
      state.activeAccountId = Object.keys(state.accounts)[0];
    }
    logActivity(`Deleted account ${account.profile.name}`);
    toast('Account deleted');
    persistAndRender();
  });
}

function renderLoansSection() {
  renderLoansView({
    state,
    selectedFilter: loanFilter,
    onFilter: (filter) => {
      loanFilter = filter;
      renderLoansSection();
    },
    onAddLoan: handleAddLoan
  });
}

function handleAddLoan() {
  const account = getActiveAccount(state);
  if (!account) return;

  promptAddLoan((values) => {
    account.loans.push({
      id: `loan-${crypto.randomUUID().slice(0, 8)}`,
      lender: values.lender,
      borrower: values.borrower,
      amount: Number(values.amount || 0),
      date: values.date || new Date().toISOString(),
      type: values.type,
      status: values.status
    });
    logActivity(`Added loan (${values.type}) ${values.lender} → ${values.borrower}`);
    addNotification(`New loan added for ${account.profile.name}`);
    toast('Loan added');
    persistAndRender();
  });
}

function logActivity(message) {
  state.activity.push({
    id: `activity-${crypto.randomUUID().slice(0, 8)}`,
    message,
    time: new Date().toISOString(),
    accountId: state.activeAccountId
  });
}

function addNotification(text) {
  state.notifications.unshift({
    id: `notification-${crypto.randomUUID().slice(0, 8)}`,
    text,
    unread: true,
    time: new Date().toISOString()
  });
}

function syncNotificationBadge() {
  const badge = document.getElementById('notificationBadge');
  const unread = state.notifications.filter((item) => item.unread).length;
  badge.textContent = unread;
  badge.classList.toggle('hidden', unread === 0);
}

function persistAndRender() {
  saveState(state);
  renderAll();
}

function setLoading(isLoading) {
  document.getElementById('app-loader').classList.toggle('hidden', !isLoading);
}

function toast(message) {
  const root = document.getElementById('toast-container');
  const node = document.createElement('div');
  node.className = 'toast';
  node.textContent = message;
  root.appendChild(node);
  setTimeout(() => node.remove(), 2600);
<<<<<<< HEAD
}
=======
}
>>>>>>> 4aa1183961d7d50d19c8bac59600b8e76863f00e
