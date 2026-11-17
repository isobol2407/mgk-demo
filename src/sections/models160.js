// 9. Машины до 160 л.с. Синий блок с белыми карточками-бенто, как «Разбор цены»:
// заголовок над сеткой, слева карточка с условиями льготы и кнопкой каталога,
// справа 4 модели с ценой.
import { esc } from '../lib/marks.js';
import { icon, photo, actionBtn } from '../lib/ui.js';
import { messengerLabel } from '../lib/messenger.js';
import { rub } from '../lib/format.js';

export function renderModels160(c) {
  const m = c.models160;
  if (!m?.list?.length) return '';
  const rules = m.rules.map((x) => `<li>${icon('check', 'm160__ico')}<span>${esc(x)}</span></li>`).join('');
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
            <p class="m160__specs">${x.year} · ${esc(x.engine)} · ${x.hp}\u00a0л.с.</p>
            <p class="m160__price">${rub(x.price)}</p>
          </div>
        </li>`,
    )
    .join('');
  const [main, ...others] = c.catalog.channels;
  const otherLinks = others
    .map((k) => actionBtn('catalog160', { key: k, label: messengerLabel(c, k), cls: 'btn btn--line btn--sm' }))
    .join('');
  return `
<section class="m160 section section--cobalt" id="models">
  <div class="container">
    <header class="sec-head">
      <h2 class="display h2">${esc(m.title)}${m.titleAccent ? ` <span class="h-accent">${esc(m.titleAccent)}</span>` : ''}</h2>
    </header>
    <div class="m160__bento">
      <div class="m160__rules-card card">
        <ul class="m160__rules">${rules}</ul>
        <p class="m160__note">${esc(m.note)}</p>
        <div class="m160__act">
          ${actionBtn('catalog160', { key: main, label: `Каталог одним сообщением в ${messengerLabel(c, main)}`, cls: 'btn btn--lime' })}
          <div class="m160__other">${otherLinks}</div>
        </div>
      </div>
      <div class="m160__side">
        <ul class="m160__list">${cards}</ul>
        <p class="m160__price-note">${esc(m.priceNote)}</p>
      </div>
    </div>
  </div>
</section>`;
}
