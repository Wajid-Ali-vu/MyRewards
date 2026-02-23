import { getActiveAccount } from './accounts.js';

export function renderDashboardView(state) {
  const root = document.getElementById('dashboardView');
  const account = getActiveAccount(state);

  if (!account) {
    root.innerHTML = '<div class="empty-state">No account selected.</div>';
    return;
  }

  const pending = account.reminders.filter((r) => !r.done).length;
  root.innerHTML = `
    <div class="cards">
      <article class="card"><h3>Total points</h3><strong>${account.points.total}</strong></article>
      <article class="card"><h3>Today’s progress</h3><strong>${account.points.today}</strong></article>
      <article class="card"><h3>Weekly stats</h3><strong>${account.points.weekly}</strong></article>
      <article class="card"><h3>Pending reminders</h3><strong>${pending}</strong></article>
    </div>

    <section class="panel">
      <h2 class="section-title">Recent timeline</h2>
      ${renderTimeline(account.sessions)}
    </section>
  `;

  // Roadmap: add chart integration with trend lines and forecast analytics.
}

export function renderActivityView(state) {
  const root = document.getElementById('activityView');
  const rows = state.activity
    .slice()
    .reverse()
    .map((item) => `<li><strong>${item.message}</strong><div class="small">${new Date(item.time).toLocaleString()}</div></li>`)
    .join('');

  root.innerHTML = `
    <div class="panel">
      <h2 class="section-title">Activity log</h2>
      ${rows ? `<ul class="timeline">${rows}</ul>` : '<div class="empty-state">No activity yet.</div>'}
    </div>
  `;
}

export function renderSettingsView(state, onAddNotification) {
  const root = document.getElementById('settingsView');
  root.innerHTML = `
    <div class="panel">
      <h2 class="section-title">Settings</h2>
      <p class="small">Configure local behavior and reminders.</p>
      <div class="inline-actions">
        <button id="testReminderBtn" class="btn">Create test reminder notification</button>
      </div>
    </div>
  `;

  root.querySelector('#testReminderBtn')?.addEventListener('click', () => {
    onAddNotification({ text: 'Reminder: check today\'s rewards tasks.' });
  });

  // Roadmap: add theme toggle, onboarding checklists, and account health insights.
}

export function renderNotificationsPanel(state, onMarkAllRead) {
  const unread = state.notifications.filter((n) => n.unread).length;
  const html = state.notifications.length
    ? `<ul class="list">${state.notifications.map(notificationTemplate).join('')}</ul>`
    : '<div class="empty-state">No notifications.</div>';

  return `
    <div class="panel">
      <div class="inline-actions" style="justify-content: space-between; align-items:center;">
        <h2 class="section-title">Notification center</h2>
        <button class="btn" id="markAllReadBtn">Mark all read</button>
      </div>
      <p class="small">Unread: ${unread}</p>
      ${html}
    </div>
  `;
}

export function bindNotificationsPanel(onMarkAllRead) {
  document.getElementById('markAllReadBtn')?.addEventListener('click', onMarkAllRead);
}

function renderTimeline(items) {
  if (!items.length) return '<div class="empty-state">No recent sessions.</div>';

  return `
    <ul class="timeline">
      ${items.slice().reverse().map((item) => `
        <li>
          <strong>${item.title}</strong>
          <div class="small">${new Date(item.time).toLocaleString()}</div>
        </li>
      `).join('')}
    </ul>
  `;
}

function notificationTemplate(item) {
  return `
    <li>
      <strong>${item.text}</strong>
      <div class="small">${new Date(item.time).toLocaleString()} ${item.unread ? '• Unread' : '• Read'}</div>
    </li>
  `;
}