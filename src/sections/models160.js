// 9. Машины до 160 л.с. Синий блок: заголовок в две строки. На десктопе две колонки:
// слева столбиком три условия льготы и лаймовая карточка-кнопка «Получить каталог»,
// справа четыре модели с ценой (2×2). Условия не стоят над машинами, чтобы не читались
// как описание конкретной машины.
import { esc } from '../lib/marks.js';
import { icon, photo } from '../lib/ui.js';
import { actionAttrs } from '../lib/actions.js';
import { messengerIcon } from '../lib/messenger.js';
import { rub } from '../lib/format.js';

export function renderModels160(c) {
  const m = c.models160;
  if (!m?.list?.length) return '';
  const rules = m.rules
    .map((x) => `<li class="m160__rule card">${icon('check', 'm160__ico')}<span>${esc(x)}</span></li>`)
    .join('');
  const cards = m.list
    .map(
      (x) => `
        <li class="m160__card card">
          <div class="m160__media">
            ${photo(x.photo, { alt: `${x.model}, ${x.year}`, sizes: '(min-width: 1100px) 300px, (min-width: 768px) 45vw, 80vw' })}
            <span class="m160__tag">${icon('check')}<span>до 160 л.с.</span></span>
          </div>
          <div class="m160__body">
            <h3 class="m160__model display">${esc(x.model)}</h3>
            <p class="m160__specs">${x.year} · ${esc(x.engine)} · ${x.hp} л.с.</p>
            <p class="m160__price">${rub(x.price)}</p>
          </div>
        </li>`,
    )
    .join('');
  // Карточка-кнопка: нажимается вся карточка, иконки только показывают, куда придёт каталог
  const { tag, attrs } = actionAttrs('catalog160', {});
  const icons = c.catalog.channels.map((k) => icon(messengerIcon(k))).join('');
  const cta = `
    <div class="m160__cta-wrap">
      <${tag} class="m160__cta" ${attrs}>
        <span class="m160__cta-t display">Получить каталог</span>
        <span class="m160__cta-sub">Модели и цены под ключ одним сообщением</span>
        <span class="m160__cta-icons" aria-label="Telegram, MAX или ВКонтакте">${icons}</span>
      </${tag}>
    </div>`;
  return `
<section class="m160 section section--cobalt" id="models">
  <div class="container">
    <header class="sec-head">
      <h2 class="display h2">${esc(m.title)}${m.titleAccent ? ` <span class="h-accent">${esc(m.titleAccent)}</span>` : ''}</h2>
      <p class="sub">${esc(m.note)}</p>
    </header>
    <div class="m160__layout">
      <div class="m160__side">
        <ul class="m160__rules">${rules}</ul>
        ${cta}
      </div>
      <ul class="m160__list">${cards}</ul>
    </div>
  </div>
</section>`;
}
