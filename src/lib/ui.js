// Общие кусочки разметки для секций. Здесь только строки HTML, без обращения к DOM:
// файл выполняется при сборке (см. vite.config.js).
import { esc, isAsk, askBadge } from './marks.js';
import { chatAttrs, messengerIcon } from './messenger.js';

export const icon = (name, cls = '') =>
  `<svg class="i${cls ? ` ${cls}` : ''}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

// Фото из public/media: два размера WebP, размеры заданы, чтобы вёрстка не прыгала.
export function photo(name, { alt = '', widths = [480, 960], ratio = 3 / 2, sizes = '100vw', cls = '', eager = false } = {}) {
  const [w1, w2] = widths;
  return `<img${cls ? ` class="${cls}"` : ''} src="/media/${name}-${w1}.webp" srcset="/media/${name}-${w1}.webp ${w1}w, /media/${name}-${w2}.webp ${w2}w" sizes="${sizes}" width="${w2}" height="${Math.round(w2 / ratio)}" alt="${esc(alt)}" decoding="async"${eager ? '' : ' loading="lazy"'} draggable="false" />`;
}

// Кнопка в мессенджер: всегда с иконкой мессенджера, чтобы было видно, куда попадёшь.
export function chatBtn(company, { key = company.messengers.primary, text = '', label, cls = 'btn--cobalt', attrs = '' }) {
  return `<a class="btn ${cls}" ${chatAttrs(company, key, text)}${attrs ? ` ${attrs}` : ''}>${icon(messengerIcon(key))}<span>${esc(label)}</span></a>`;
}

// Внешняя ссылка со стрелкой. Если адреса нет (ask), вместо ссылки текст с плашкой «уточнить».
export function extLink(label, url, { cls = 'link', arrow = 'arrow-ur' } = {}) {
  if (isAsk(url)) return `<span class="${cls} is-todo">${label} ${askBadge(url)}</span>`;
  const external = /^https?:/.test(url);
  return `<a class="${cls}" href="${esc(url)}"${external ? ' target="_blank" rel="noopener"' : ''}>${label}${arrow ? icon(arrow) : ''}</a>`;
}

export const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;

export const SPRITE = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-tg" viewBox="0 0 24 24"><path fill="currentColor" d="M21.4 4.2 2.9 11.4c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.8.8s.6-.2.9-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.4-1.5Zm-3.3 3.5-8.7 7.9-.3 3.6-1.6-5 9.9-6.3c.5-.3.9-.1.7-.2Z"/></symbol>
  <symbol id="i-max" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 3.5c-4.7 0-8.5 3.4-8.5 7.8 0 2.2 1 4.2 2.6 5.6L5.5 20.5l3.8-1.6c.9.3 1.8.4 2.7.4 4.7 0 8.5-3.5 8.5-7.9S16.7 3.5 12 3.5Z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M8.5 13.5v-4l3.5 3 3.5-3v4"/></symbol>
  <symbol id="i-vk" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M7 9c.4 3.6 2.2 6 5.2 6V9m0 3.2c1.6-.3 2.9-1.6 3.6-3.2m-3.6 3.2c1.9.3 3.2 1.4 3.9 2.8"/></symbol>
  <symbol id="i-avito" viewBox="0 0 24 24"><circle cx="8" cy="8" r="4.2" fill="currentColor"/><circle cx="17.2" cy="7.2" r="2.6" fill="currentColor"/><circle cx="7.2" cy="17.4" r="2" fill="currentColor"/><circle cx="16.4" cy="16.2" r="3.6" fill="currentColor"/></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M6.6 3.5h2.6l1.3 4-2 1.3a12 12 0 0 0 6.7 6.7l1.3-2 4 1.3v2.6a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 4.6 5.6a2 2 0 0 1 2-2.1Z"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24"><path fill="currentColor" d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8L12 3Z"/></symbol>
  <symbol id="i-arrow-down" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-6-6 6 6 6-6"/></symbol>
  <symbol id="i-arrow-ur" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M8 7h9v9"/></symbol>
  <symbol id="i-chevron-l" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m15 6-6 6 6 6"/></symbol>
  <symbol id="i-chevron-r" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/></symbol>
  <symbol id="i-chevron-d" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></symbol>
  <symbol id="i-doc" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20V3.5Zm7 0v4h4M9.5 12.5h5m-5 3.5h5"/></symbol>
  <symbol id="i-flip" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 21s6.5-5.6 6.5-10.5a6.5 6.5 0 0 0-13 0C5.5 15.4 12 21 12 21Z"/><circle cx="12" cy="10.5" r="2.3" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
</svg>`;
