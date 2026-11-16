// 9. Машины до 160 л.с. Отвечает на «почему сейчас и какую брать»: слева условия
// льготного утильсбора, справа 4 модели с ценой, внизу каталог одним сообщением.
import { esc } from '../lib/marks.js';
import { icon, photo, chatBtn } from '../lib/ui.js';
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
          ${photo(x.photo, { alt: `${x.model}, ${x.year}`, sizes: '(min-width: 1100px) 300px, (min-width: 768px) 45vw, 80vw' })}
          <div class="m160__body">
            <h3 class="m160__model display">${esc(x.model)}</h3>
            <p class="m160__specs">${x.year} · ${esc(x.engine)} · ${x.hp} л.с.</p>
            <p class="m160__price">${rub(x.price)}</p>
          </div>
        </li>`,
    )
    .join('');
  const [main, ...others] = c.catalog.channels;
  const otherLinks = others
    .map((k) => chatBtn(c, { key: k, text: c.messages.catalog, label: messengerLabel(c, k), cls: 'btn--line btn--sm' }))
    .join('');
  return `
<section class="m160 section" id="models">
  <div class="container m160__grid">
    <div class="m160__intro">
      <h2 class="display h2">${esc(m.title)}</h2>
      <ul class="m160__rules">${rules}</ul>
      <p class="m160__note">${esc(m.note)}</p>
    </div>
    <div class="m160__side">
      <ul class="m160__list">${cards}</ul>
      <p class="m160__price-note">${esc(m.priceNote)}</p>
      <div class="m160__act">
        ${chatBtn(c, { key: main, text: c.messages.catalog, label: `Каталог одним сообщением в ${messengerLabel(c, main)}`, cls: 'btn--cobalt' })}
        <div class="m160__other">${otherLinks}</div>
      </div>
    </div>
  </div>
</section>`;
}
