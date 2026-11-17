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
  // Информационная модалка (например, блог): без выбора мессенджера, свой заголовок, подпись и ссылка
  const info = a.kind === 'info';
  dialog.querySelector('[data-next-heading]').innerHTML = typograph(esc(a.heading ?? defaults.heading));
  dialog.querySelector('[data-next-choice]').hidden = info;
  dialog.querySelector('[data-next-demo]').innerHTML = typograph(esc(a.demo ?? defaults.demo));
  // link: функция в конфиге — своя ссылка; вернула null — ссылки нет; нет функции — ссылка на канал
  const link = a.link ? a.link(ctx) : defaults.link;
  const linkEl = dialog.querySelector('[data-next-link]');
  linkEl.hidden = !link;
  if (link) {
    linkEl.href = link.url;
    linkEl.querySelector('[data-next-link-label]').textContent = link.label;
  }
  if (!dialog.open) dialog.showModal();
  dialog.querySelector('.next__title')?.focus({ preventScroll: true });
}

// Значения из полей рядом с кнопкой (модель, бюджет, ссылка) попадают в контекст
function formCtx(btn) {
  const form = btn.closest('[data-action-form]');
  if (!form) return {};
  const out = {};
  form.querySelectorAll('input[name]').forEach((i) => {
    if ((i.type === 'radio' || i.type === 'checkbox') && !i.checked) return;
    if (i.value.trim()) out[i.name] = i.value.trim();
  });
  return out;
}

// Исходные тексты модалки «Что произойдёт дальше»: возвращаются после информационных модалок
let defaults = {};

export function initActions() {
  dialog = document.querySelector('[data-next]');
  if (dialog) {
    const linkEl = dialog.querySelector('[data-next-link]');
    defaults = {
      heading: dialog.querySelector('[data-next-heading]')?.textContent,
      demo: dialog.querySelector('[data-next-demo]')?.textContent,
      link: { url: linkEl?.getAttribute('href'), label: linkEl?.querySelector('[data-next-link-label]')?.textContent },
    };
  }
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
