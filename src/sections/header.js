// 0. Шапка. Низкая, без скруглённых подложек у меню. Поверх первого экрана прозрачная,
// при прокрутке сразу белая. На телефоне: логотип, иконка мессенджера, бургер и закреплённая кнопка внизу.
import { esc } from '../lib/marks.js';
import { icon, chatBtn } from '../lib/ui.js';
import { chatAttrs, primaryKey, messengerLabel, messengerIcon } from '../lib/messenger.js';

export const NAV = [
  { href: '#deals', label: 'Привезённые' },
  { href: '#price', label: 'Цена' },
  { href: '#steps', label: 'Как работаем' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#faq', label: 'Вопросы' },
  { href: '#contacts', label: 'Контакты' },
];

export function renderHeader(c) {
  const key = primaryKey(c);
  const writeLabel = `Написать в ${messengerLabel(c, key)}`;
  const links = NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('');
  // Иконки мессенджеров в шапке: основной и MAX, если он есть
  const iconKeys = [key, ...(c.messengers.max && key !== 'max' ? ['max'] : [])];
  const icons = iconKeys
    .map(
      (k, i) =>
        `<a class="icon-btn${i > 0 ? ' icon-btn--desk' : ''}" ${chatAttrs(c, k, k === key ? c.messages.write : '')} aria-label="${esc(messengerLabel(c, k))}">${icon(messengerIcon(k))}</a>`,
    )
    .join('');

  // В мобильном меню все мессенджеры компании, как в контактах
  // Главный мессенджер — большой кнопкой, остальные — ровной строкой под ней (без дубля)
  const menuMessengers = (c.contacts?.messengers ?? iconKeys)
    .filter((k) => c.messengers[k] && k !== 'avito' && k !== key)
    .map((k) => `<li><a class="mmenu__link" ${chatAttrs(c, k, k === key ? c.messages.write : '')}>${icon(messengerIcon(k))}<span>${esc(messengerLabel(c, k))}</span></a></li>`)
    .join('');

  return `
<header class="header" data-header>
  <div class="header__in container">
    <a class="logo" href="#top" translate="no" aria-label="${esc(c.name)}, к началу страницы"><svg class="logo__img" viewBox="0 0 400 70" aria-hidden="true" focusable="false"><use href="#logo-mgk"/></svg></a>
    <nav class="nav" aria-label="Основное меню"><ul>${links}</ul></nav>
    <div class="header__act">
      ${icons}
      ${chatBtn(c, { text: c.messages.write, label: 'Написать', cls: 'btn--sm header__cta', attrs: `aria-label="${esc(writeLabel)}"` })}
      <button class="burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="mmenu" data-burger><span></span><span></span></button>
    </div>
  </div>
  <div class="mmenu" id="mmenu" data-menu hidden>
    <ul>${links}</ul>
    <div class="mmenu__chat">
      ${chatBtn(c, { text: c.messages.write, label: writeLabel, cls: 'btn--cobalt btn--block' })}
      <ul class="mmenu__msg">${menuMessengers}</ul>
    </div>
  </div>
</header>
<div class="dock" data-dock>
  ${chatBtn(c, { text: c.messages.write, label: writeLabel, cls: 'btn--cobalt btn--block' })}
</div>`;
}
