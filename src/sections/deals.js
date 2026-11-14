// 2. Привезённые машины. Лента карточек сделок с двумя фильтрами: бюджет и «новые / с пробегом».
// Только уже привезённые машины, без предложений из каталога. Фильтра по стране нет.
import { esc, val, demoBadge, isAsk, isHidden } from '../lib/marks.js';
import { icon, photo, chatBtn, extLink, proofHTML } from '../lib/ui.js';
import { primaryKey, messengerLabel, chatAttrs } from '../lib/messenger.js';
import { mln, saving, budgetOf, carSpecs, deliveryTagHTML } from '../lib/format.js';

function dealCardHTML(c, d) {
  return `
    <article class="deal card" data-deal data-budget="${budgetOf(d.turnkey, c.budgets)}" data-condition="${d.condition}">
      <div class="deal__media">
        ${photo(d.photo, { alt: `${d.model}, ${d.year}: выдача ${d.cityIn}`, sizes: '(min-width: 1100px) 380px, (min-width: 768px) 45vw, 80vw' })}
        <span class="photo-tag deal__tag">${deliveryTagHTML(d, esc)}</span>
        ${d.badge ? `<p class="deal__badge">${icon('check')}<span>${esc(d.badge)}</span></p>` : ''}
      </div>
      <div class="deal__body">
        <h3 class="deal__model display">${esc(d.model)}</h3>
        <p class="deal__specs">${carSpecs(d).map(esc).join(' · ')}</p>
        <dl class="prices">
          <div class="prices__row"><dt>Такая же в России</dt><dd>${mln(d.priceRu)}</dd></div>
          <div class="prices__row"><dt>Под ключ ${esc(d.from)}</dt><dd>${mln(d.turnkey)}</dd></div>
          <div class="prices__row prices__row--save"><dt>Экономия${d.demo ? ` ${demoBadge()}` : ''}</dt><dd>${mln(saving(d))}</dd></div>
        </dl>
        <div class="deal__act">
          ${chatBtn(c, { text: c.messages.sameCar(d), label: 'Хочу такую же', cls: 'btn--cobalt btn--sm' })}
          ${extLink('Пост о выдаче', d.post, { cls: 'link link--muted' })}
        </div>
      </div>
    </article>`;
}

export function renderDeals(c) {
  const key = primaryKey(c);
  const label = messengerLabel(c, key);
  const channel = c.messengers.telegram?.channel ?? '#';
  const chips = c.budgets
    .map((b) => `<button class="chip" type="button" aria-pressed="false" data-budget-filter="${b.id}">${esc(b.label)}</button>`)
    .join('');
  const seg = [
    ['all', 'Все'],
    ['new', 'Новые'],
    ['used', 'С пробегом'],
  ]
    .map(([id, text], i) => `<button class="seg__btn" type="button" aria-pressed="${i === 0}" data-condition-filter="${id}">${text}</button>`)
    .join('');

  return `
<section class="deals section section--paper" id="deals" data-deals>
  <div class="container">
    <header class="deals__head">
      <div>
        <h2 class="display h2">Что уже привезли на ваш бюджет</h2>
        <p class="sub deals__sub">По каждой машине: цена под ключ и срок. Подробный отчёт о выдаче — в постах в Telegram. ${extLink(`Все машины в ${esc(label)}`, channel)}</p>
      </div>
      ${proofHTML(c, { variant: 'links', cls: 'deals__proof' })}
    </header>
    <div class="deals__bar">
      <div class="chips" role="group" aria-label="Бюджет под ключ">${chips}</div>
      <div class="seg" role="group" aria-label="Состояние машины">${seg}</div>
      <div class="deals__nav">
        <button class="arrow" type="button" aria-label="Предыдущие машины" data-rail-prev disabled>${icon('chevron-l')}</button>
        <button class="arrow" type="button" aria-label="Следующие машины" data-rail-next>${icon('chevron-r')}</button>
      </div>
    </div>
    <p class="vh" aria-live="polite" data-deals-status></p>
  </div>
  <div class="rail" data-rail tabindex="0" role="group" aria-label="Лента привезённых машин">
    ${c.deals.map((d) => dealCardHTML(c, d)).join('')}
    <div class="deal deal--state" data-state="few" hidden>
      <p class="deal__state-text display">В этом бюджете показали не всё. Остальные машины — в Telegram-канале</p>
      <a class="btn btn--white" href="${esc(channel)}" target="_blank" rel="noopener">${icon('tg')}<span>Открыть канал</span></a>
    </div>
    <div class="deal deal--state" data-state="empty" hidden>
      <p class="deal__state-text display">В этом бюджете пока не привозили. Напишите, посчитаем под вас</p>
      <a class="btn btn--white" ${chatAttrs(c, key, c.messages.budget)} data-empty-link>${icon('tg')}<span>Написать в ${esc(label)}</span></a>
    </div>
    <a class="deal deal--state deal--end" data-state="end" href="${esc(channel)}" target="_blank" rel="noopener">
      <span class="deal__state-text display">${isHidden(c.dealsMore) ? 'Остальные машины' : `Ещё ${val(c.dealsMore)} машин`} — в Telegram-канале</span>
      <span class="deal__end-arrow">${icon('arrow-ur')}</span>
    </a>
  </div>
</section>`;
}
