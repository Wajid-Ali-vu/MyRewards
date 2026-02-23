function createBaseModal({ title, bodyHtml, actions }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <h3>${title}</h3>
    <div>${bodyHtml}</div>
    <div class="modal__actions"></div>
  `;

  const actionRoot = modal.querySelector('.modal__actions');
  actions.forEach((action) => {
    const btn = document.createElement('button');
    btn.className = `btn ${action.variant || ''}`.trim();
    btn.textContent = action.label;
    btn.addEventListener('click', () => action.onClick({ close: () => overlay.remove(), modal }));
    actionRoot.appendChild(btn);
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) overlay.remove();
  });

  overlay.appendChild(modal);
  return overlay;
}

export function openFormModal({ title, fields, submitText = 'Save', onSubmit }) {
  const inputsHtml = fields.map((field) => {
    const value = field.value ?? '';
    if (field.type === 'select') {
      const options = field.options
        .map((option) => `<option value="${option}" ${option === value ? 'selected' : ''}>${option}</option>`)
        .join('');
      return `<label>${field.label}<select name="${field.name}">${options}</select></label>`;
    }
    return `<label>${field.label}<input name="${field.name}" type="${field.type || 'text'}" value="${value}" /></label>`;
  }).join('');

  const overlay = createBaseModal({
    title,
    bodyHtml: `<form class="form-grid" id="reusable-form">${inputsHtml}</form>`,
    actions: [
      { label: 'Cancel', onClick: ({ close }) => close() },
      {
        label: submitText,
        variant: 'primary',
        onClick: ({ close, modal }) => {
          const form = modal.querySelector('#reusable-form');
          const values = Object.fromEntries(new FormData(form).entries());
          onSubmit(values);
          close();
        }
      }
    ]
  });

  mountModal(overlay);
}

export function openConfirmModal({ title, message, confirmText = 'Confirm', onConfirm }) {
  const overlay = createBaseModal({
    title,
    bodyHtml: `<p>${message}</p>`,
    actions: [
      { label: 'Cancel', onClick: ({ close }) => close() },
      { label: confirmText, variant: 'danger', onClick: ({ close }) => { onConfirm(); close(); } }
    ]
  });

  mountModal(overlay);
}

export function openNoticeModal({ title, message }) {
  const overlay = createBaseModal({
    title,
    bodyHtml: `<p>${message}</p>`,
    actions: [{ label: 'Close', onClick: ({ close }) => close() }]
  });

  mountModal(overlay);
}

function mountModal(node) {
  document.getElementById('modal-root').appendChild(node);
}