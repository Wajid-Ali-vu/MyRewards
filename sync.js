const STORAGE_KEY = 'myrewards_modern_v1';

const defaultState = {
  activeAccountId: null,
  accounts: {},
  activity: [],
  notifications: []
};

export function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedState();
  try {
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch {
    return seedState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return seedState();
}

function seedState() {
  const now = new Date().toISOString();
  const state = {
    activeAccountId: 'acc-main',
    accounts: {
      'acc-main': {
        id: 'acc-main',
        profile: { name: 'Main Rewards', email: 'main@example.com', type: 'Personal' },
        points: { total: 1280, today: 34, weekly: 210 },
        reminders: [{ id: 'r1', text: 'Do daily task', dueDate: now, done: false }],
        sessions: [{ id: 's1', title: 'Daily quiz completed', time: now }],
        loans: [
          { id: 'l1', lender: 'Main Rewards', borrower: 'Alex', amount: 40, date: now, status: 'Pending', type: 'Given' }
        ]
      }
    },
    activity: [{ id: 'a1', message: 'Workspace initialized', time: now, accountId: 'acc-main' }],
    notifications: [{ id: 'n1', text: 'Welcome to the new dashboard!', unread: true, time: now }]
  };

  // Roadmap: replace localStorage with secure cloud sync adapter with conflict-resolution policy.
  saveState(state);
  return state;
}

function normalizeState(state) {
  const clean = { ...defaultState, ...state };
  clean.accounts = clean.accounts || {};
  clean.activity = Array.isArray(clean.activity) ? clean.activity : [];
  clean.notifications = Array.isArray(clean.notifications) ? clean.notifications : [];

  const ids = Object.keys(clean.accounts);
  if (!clean.activeAccountId || !clean.accounts[clean.activeAccountId]) {
    clean.activeAccountId = ids[0] || null;
  }

  return clean;
}