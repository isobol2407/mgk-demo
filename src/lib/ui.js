// Общие кусочки разметки для секций. Здесь только строки HTML, без обращения к DOM:
// файл выполняется при сборке (см. vite.config.js).
import { esc, val, isAsk, isHidden, askBadge } from './marks.js';
import { chatAttrs, messengerIcon } from './messenger.js';
import { actionAttrs } from './actions.js';

export const icon = (name, cls = '') =>
  `<svg class="i${cls ? ` ${cls}` : ''}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

// Фото из public/media: два размера WebP, размеры заданы, чтобы вёрстка не прыгала.
export function photo(name, { alt = '', widths = [480, 960], ratio = 3 / 2, sizes = '100vw', cls = '', eager = false } = {}) {
  const [w1, w2] = widths;
  return `<img${cls ? ` class="${cls}"` : ''} src="media/${name}-${w1}.webp" srcset="media/${name}-${w1}.webp ${w1}w, media/${name}-${w2}.webp ${w2}w" sizes="${sizes}" width="${w2}" height="${Math.round(w2 / ratio)}" alt="${esc(alt)}" decoding="async"${eager ? '' : ' loading="lazy"'} draggable="false" />`;
}

// Кнопка в мессенджер: всегда с иконкой мессенджера, чтобы было видно, куда попадёшь.
export function chatBtn(company, { key = company.messengers.primary, text = '', label, cls = 'btn--cobalt', attrs = '' }) {
  return `<a class="btn ${cls}" ${chatAttrs(company, key, text)}${attrs ? ` ${attrs}` : ''}>${icon(messengerIcon(key))}<span>${esc(label)}</span></a>`;
}

// Кнопка захвата лида (см. src/lib/actions.js): в демо открывает модалку «Что произойдёт дальше»,
// в бою ведёт в бота. Иконка мессенджера, как у всех кнопок «в мессенджер».
export function actionBtn(id, { key = 'telegram', ctx = {}, label, cls = 'btn btn--cobalt', iconKey = true } = {}) {
  const { tag, attrs } = actionAttrs(id, { key, ctx });
  const ico = iconKey ? icon(messengerIcon(key)) : '';
  return `<${tag} class="${cls}" ${attrs}>${ico}<span>${esc(label)}</span></${tag}>`;
}

// Внешняя ссылка со стрелкой. Если адреса нет (ask), вместо ссылки текст с плашкой «уточнить».
export function extLink(label, url, { cls = 'link', arrow = 'arrow-ur' } = {}) {
  if (isAsk(url)) return `<span class="${cls} is-todo">${label} ${askBadge(url)}</span>`;
  const external = /^https?:/.test(url);
  return `<a class="${cls}" href="${esc(url)}"${external ? ' target="_blank" rel="noopener"' : ''}>${label}${arrow ? icon(arrow) : ''}</a>`;
}

// Плашки доверия: рейтинги Яндекс.Карт и Авито плюс подписчики канала. Один компонент
// для первого экрана и ленты сделок; цвет задаёт фон секции (см. .proof в base.css).
export function proofHTML(c, { cls = '', variant = 'pills' } = {}) {
  const y = c.ratings?.yandex;
  const a = c.ratings?.avito;
  const tg = c.messengers?.telegram;
  // pills: плашки (первый экран). links: тихие ссылки столбиком (лента сделок), чтобы
  // не путались с фильтрами рядом: плашка с рамкой читается как кнопка интерфейса.
  const itemCls = variant === 'links' ? 'proof-link' : 'proof__item';
  const item = (url, inner) =>
    isAsk(url) || !url ? `<span class="${itemCls}">${inner}</span>` : `<a class="${itemCls}" href="${esc(url)}" target="_blank" rel="noopener">${inner}${variant === 'links' ? icon('arrow-ur') : ''}</a>`;
  const items = [];
  if (y && !isHidden(y.rating)) items.push(item(y.url, `<span>${val(y.rating)}${icon('star', 'proof__star')} на Яндекс.Картах</span>`));
  if (a && !isHidden(a.rating)) items.push(item(a.url, `<span>${val(a.rating)}${icon('star', 'proof__star')} на Авито</span>`));
  if (tg?.channel && !isHidden(tg.subscribers)) items.push(item(tg.channel, `${icon('tg')}<span>${val(tg.subscribers)} в Telegram</span>`));
  const listCls = variant === 'links' ? 'proof-links' : 'proof';
  return items.length ? `<ul class="${listCls}${cls ? ` ${cls}` : ''}">${items.map((i) => `<li>${i}</li>`).join('')}</ul>` : '';
}

export const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;

// Логотип МГК — с их сайта (mgk-auto.ru, MGK-logo-digital), одноцветный: красится цветом текста.
// Иконки VK и MAX официальные: VK из Simple Icons, MAX — контур знака с max.ru/favicon.svg (одноцветный).
export const SPRITE = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-tg" viewBox="0 0 24 24"><path fill="currentColor" d="M21.4 4.2 2.9 11.4c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.8.8s.6-.2.9-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.4-1.5Zm-3.3 3.5-8.7 7.9-.3 3.6-1.6-5 9.9-6.3c.5-.3.9-.1.7-.2Z"/></symbol>
  <symbol id="i-max" viewBox="0 0 100 100"><path fill="currentColor" fill-rule="evenodd" d="M50.7571 0.261719C78.2929 0.261719 99.8857 22.5974 99.8857 50.1474C99.8857 77.6974 77.6071 99.4903 51.0214 99.4903C41.5857 99.4903 37.0143 98.1617 29.65 92.9474C29.1429 92.5903 28.45 92.6831 28.0214 93.1403C22.3571 99.1831 7.85 103.426 7.18571 95.176C7.18571 80.7903 0 71.4474 0 49.876C0 21.5546 23.2214 0.261719 50.7571 0.261719ZM51.5286 24.8117C38.4643 24.126 28.2643 33.1974 26.0143 47.3831C24.15 59.1332 27.45 73.4546 30.2786 74.176C31.4786 74.4832 34.3571 72.276 36.4571 70.2974C36.85 69.926 37.45 69.8617 37.9071 70.1474C41.1786 72.1474 44.8786 73.6474 48.9571 73.8617C62.3714 74.5617 74.2571 64.0617 74.9643 50.6474C75.6643 37.2331 64.9429 25.5046 51.5286 24.8046V24.8117Z"/></symbol>
  <symbol id="i-vk" viewBox="0 0 24 24"><path fill="currentColor" d="m9.489.004.729-.003h3.564l.73.003.914.01.433.007.418.011.403.014.388.016.374.021.36.025.345.03.333.033c1.74.196 2.933.616 3.833 1.516.9.9 1.32 2.092 1.516 3.833l.034.333.029.346.025.36.02.373.025.588.012.41.013.644.009.915.004.98-.001 3.313-.003.73-.01.914-.007.433-.011.418-.014.403-.016.388-.021.374-.025.36-.03.345-.033.333c-.196 1.74-.616 2.933-1.516 3.833-.9.9-2.092 1.32-3.833 1.516l-.333.034-.346.029-.36.025-.373.02-.588.025-.41.012-.644.013-.915.009-.98.004-3.313-.001-.73-.003-.914-.01-.433-.007-.418-.011-.403-.014-.388-.016-.374-.021-.36-.025-.345-.03-.333-.033c-1.74-.196-2.933-.616-3.833-1.516-.9-.9-1.32-2.092-1.516-3.833l-.034-.333-.029-.346-.025-.36-.02-.373-.025-.588-.012-.41-.013-.644-.009-.915-.004-.98.001-3.313.003-.73.01-.914.007-.433.011-.418.014-.403.016-.388.021-.374.025-.36.03-.345.033-.333c.196-1.74.616-2.933 1.516-3.833.9-.9 2.092-1.32 3.833-1.516l.333-.034.346-.029.36-.025.373-.02.588-.025.41-.012.644-.013.915-.009ZM6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z"/></symbol>
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
  <symbol id="logo-mgk" viewBox="50 215 400 70"><path fill="currentColor" fill-rule="evenodd" d="M386.1,252.5c0.5,0.4,0.8,1,0.8,1.7c0,1.7-1,2.5-2.9,2.5h-6v-4.8h6C384.9,251.9,385.6,252.1,386.1,252.5z M386,245.8c0-1.5-0.9-2.3-2.8-2.3H378v4.7h5.3C385.1,248.2,386,247.4,386,245.8z M357.1,243.4c-1.9,0-3.5,0.6-4.8,1.9 c-1.3,1.3-1.9,2.9-1.9,4.8c0,1.9,0.6,3.5,1.9,4.8c1.3,1.3,2.9,1.9,4.8,1.9c1.9,0,3.5-0.6,4.8-1.9c1.3-1.3,1.9-2.9,1.9-4.8 c0-1.9-0.6-3.5-1.9-4.8C360.6,244,359.1,243.4,357.1,243.4z M450,218.3v63.5c0,1.5-1.2,2.7-2.7,2.7H339.6c-1.1,0-2-0.6-2.5-1.6 L321.8,250l15.3-32.9c0.5-1,1.4-1.6,2.5-1.6h107.7C448.8,215.5,450,216.7,450,218.3z M368.3,239.6h-4.5v3c-1.7-2.4-4.2-3.5-7.4-3.5 c-2.9,0-5.4,1.1-7.4,3.2c-2.1,2.1-3.1,4.8-3.1,7.9c0,3.1,1,5.7,3.1,7.9c2,2.1,4.5,3.2,7.4,3.2c3.2,0,5.7-1.2,7.4-3.6v3h4.5V239.6z M391.3,254.7c0-2.3-1-3.9-3.1-4.8c1.5-1,2.2-2.4,2.2-4.4c0-1.7-0.6-3.1-1.8-4.2c-1.2-1.1-2.9-1.6-5-1.6h-9.9v21.1h10.8 c2.2,0,3.9-0.6,5.1-1.7C390.8,257.9,391.3,256.5,391.3,254.7z M410.5,239.6h-18.3v4.4h6.9v16.7h4.5V244h6.9V239.6z M433.8,250.1 c0-3.1-1.1-5.7-3.2-7.9c-2.1-2.1-4.8-3.2-7.9-3.2c-3.1,0-5.7,1.1-7.9,3.2c-2.2,2.1-3.2,4.8-3.2,7.9c0,3.1,1.1,5.7,3.2,7.9 c2.2,2.1,4.8,3.2,7.9,3.2c3.1,0,5.8-1.1,7.9-3.2C432.7,255.9,433.8,253.3,433.8,250.1z M422.7,243.5c-1.9,0-3.4,0.6-4.7,1.9 c-1.3,1.3-1.9,2.9-1.9,4.8c0,1.9,0.6,3.5,1.9,4.8c1.3,1.3,2.8,1.9,4.7,1.9c1.9,0,3.4-0.6,4.7-1.9c1.3-1.3,1.9-2.9,1.9-4.8 c0-1.9-0.6-3.5-1.9-4.8C426.1,244.1,424.5,243.5,422.7,243.5z M127.7,216.9l-5.1,20.4h-5v-20c0-1-0.8-1.7-1.7-1.7H68.1 c-0.8,0-1.5,0.5-1.7,1.3l-16.3,65.4c-0.3,1.1,0.6,2.2,1.7,2.2h29c0.8,0,1.5-0.5,1.7-1.3l9-36.1h5.8v35.7c0,1,0.8,1.7,1.7,1.7 l31.4,0c0.8,0,1.5-0.5,1.7-1.3l9-36.1h5.9v35.7c0,1,0.8,1.7,1.7,1.7h28.1c1,0,1.7-0.8,1.7-1.7v-65.5c0-1-0.8-1.7-1.7-1.7l-47.4,0 C128.6,215.5,127.9,216.1,127.7,216.9z M296.7,216.5l-13.8,29.6h-5.4v-28.8c0-1-0.8-1.7-1.7-1.7h-28.1c-1,0-1.7,0.8-1.7,1.7v65.5 c0,1,0.8,1.7,1.7,1.7h28.1c1,0,1.7-0.8,1.7-1.7v-28.8h5.4l13.8,29.6c0.3,0.6,0.9,1,1.6,1h29.9c1.3,0,2.1-1.3,1.6-2.5l-14.9-32 l14.9-32c0.5-1.2-0.3-2.5-1.6-2.5h-29.9C297.6,215.5,297,215.9,296.7,216.5z M183.5,238.2v44.5c0,1,0.8,1.7,1.7,1.7h28.1 c1,0,1.7-0.8,1.7-1.7v-35.7h25.7c1,0,1.7-0.8,1.7-1.7v-28.1c0-1-0.8-1.7-1.7-1.7h-39.3c-0.5,0-1.1,0.3-1.4,0.7l-16.1,21 C183.6,237.5,183.5,237.8,183.5,238.2z"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/><path fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="m7.5 12.3 3 3 6-6.3"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 21s6.5-5.6 6.5-10.5a6.5 6.5 0 0 0-13 0C5.5 15.4 12 21 12 21Z"/><circle cx="12" cy="10.5" r="2.3" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
</svg>`;
