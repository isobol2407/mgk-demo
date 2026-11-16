// Кнопки захвата лида в демо-режиме: клик по [data-action] открывает модалку
// «Что произойдёт дальше». Шаги и заголовок берутся из src/lib/actions.js.
// Нативный <dialog>: Esc закрывает, фокус внутри, после закрытия возвращается на кнопку.
// Клик по фону тоже закрывает. Подсвечивается мессенджер, на который нажали.
import { ACTIONS, DEMO_MODE } from '../lib/actions.js';
import { typograph } from '../lib/typo.js';

let dialog;
let lastTrigger = null;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Открыть модалку из кода (например, после квиза)
export function openNext(id, { key = 'telegram', ctx = {}, trigger = null } = {}) {
  const a = ACTIONS[id];
  if (!dialog || !a) return;
  lastTrigger = trigger ?? document.activeElement;
  const title = typeof a.title === 'function' ? a.title(ctx) : a.title;
  dialog.querySelector('[data-next-sub]').innerHTML = typograph(esc(title));
  dialog.querySelector('[data-next-steps]').innerHTML = a
    .steps(ctx)
    .map((s) => `<li>${typograph(esc(s))}</li>`)
    .join('');
  dialog.querySelectorAll('[data-next-key]').forEach((el) => el.classList.toggle('is-on', el.dataset.nextKey === key));
  if (!dialog.open) dialog.showModal();
  dialog.querySelector('.next__title')?.focus({ preventScroll: true });
}

// Значения из полей рядом с кнопкой (модель, бюджет, ссылка) попадают в контекст
function formCtx(btn) {
  const form = btn.closest('[data-action-form]');
  if (!form) return {};
  const out = {};
  form.querySelectorAll('input[name]').forEach((i) => i.value.trim() && (out[i.name] = i.value.trim()));
  return out;
}

export function initActions() {
  dialog = document.querySelector('[data-next]');
  if (!dialog || typeof dialog.showModal !== 'function' || !DEMO_MODE) return;

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    e.preventDefault();
    let ctx = {};
    try {
      ctx = JSON.parse(btn.dataset.ctx || '{}');
    } catch {
      ctx = {};
    }
    openNext(btn.dataset.action, { key: btn.dataset.key, ctx: { ...ctx, ...formCtx(btn) }, trigger: btn });
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('[data-next-close]')) dialog.close();
  });
  dialog.addEventListener('close', () => lastTrigger?.focus?.({ preventScroll: true }));
}
