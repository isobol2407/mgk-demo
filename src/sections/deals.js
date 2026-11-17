// 2. Привезённые машины. Лента карточек сделок с двумя фильтрами: бюджет и «новые / с пробегом».
// Только уже привезённые машины, без предложений из каталога. Фильтра по стране нет.
import { esc, val, demoBadge, isAsk, isHidden } from '../lib/marks.js';
import { icon, photo, actionBtn, extLink, proofHTML } from '../lib/ui.js';
import { primaryKey, messengerLabel, chatAttrs } from '../lib/messenger.js';
import { mln, saving, budgetOf, carSpecs, deliveryTagHTML } from '../lib/format.js';
import { postHref } from '../lib/links.js';

function dealCardHTML(c, d) {
  return `
    <article class="deal card" data-deal data-budget="${budgetOf(d.turnkey, c.budgets)}" data-condition="${d.condition}">
      <div class="deal__media">
        ${photo(d.photo, { alt: `${d.model}, ${d.year}${d.cityIn ? `: выдача ${d.cityIn}` : ''}`, sizes: '(min-width: 1100px) 380px, (min-width: 768px) 45vw, 80vw' })}
        <span class="photo-tag deal__tag">${deliveryTagHTML(d, esc)}</span>
        ${d.badge ? `<p class="deal__badge">${icon('check')}<span>${esc(d.badge)}</span></p>` : ''}
      </div>
      <div class="deal__body">
        <h3 class="deal__model display">${esc(d.model)}</h3>
        <p class="deal__specs">${carSpecs(d).map(esc).join(' · ')}</p>
        <dl class="prices">
          ${d.priceRu ? `<div class="prices__row"><dt>Такая же в России</dt><dd>${mln(d.priceRu)}</dd></div>` : ''}
          <div class="prices__row prices__row--total"><dt>Под ключ ${esc(d.from)}</dt><dd><span class="money">${mln(d.turnkey)}</span></dd></div>
          ${d.priceRu ? `<div class="prices__row prices__row--save"><dt>Экономия${d.demo ? ` ${demoBadge()}` : ''}</dt><dd>${mln(saving(d))}</dd></div>` : ''}
        </dl>
        <div class="deal__act">
          ${actionBtn('same', { ctx: { model: d.model, year: d.year }, label: 'Хочу такую же', cls: 'btn btn--cobalt btn--sm' })}
          ${extLink('Пост о выдаче', postHref(c, d), { cls: 'link link--muted' })}
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
        <p class="sub deals__sub">Реальные сделки с ценой под ключ. По каждой машине — пост в Telegram с фото и описанием. ${extLink(`Все машины в ${esc(label)}`, channel)}</p>
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
    ${c.deals.filter((d) => d.inLists !== false).map((d) => dealCardHTML(c, d)).join('')}
    <div class="deal deal--state" data-state="few" hidden>
      <p class="deal__state-text display">В этом бюджете показали не всё. Остальные машины — в Telegram-канале</p>
      <a class="btn btn--white" href="${esc(channel)}" target="_blank" rel="noopener">${icon('tg')}<span>Открыть канал</span></a>
    </div>
    <div class="deal deal--state" data-state="empty" hidden>
      <p class="deal__state-text display">В этом бюджете пока не привозили. Напишите модель, и мы сообщим, когда такая появится по вашей цене</p>
      ${actionBtn('watch', { label: 'Следить в Telegram', cls: 'btn btn--white' })}
    </div>
    <a class="deal deal--state deal--end" data-state="end" href="${esc(channel)}" target="_blank" rel="noopener">
      <span class="deal__state-text display">${isHidden(c.dealsMore) ? 'Остальные машины' : `Ещё ${val(c.dealsMore)} машин`} — в Telegram-канале</span>
      <span class="deal__end-arrow">${icon('arrow-ur')}</span>
    </a>
  </div>
  <div class="container">
    <form class="watch" data-action-form onsubmit="return false" aria-labelledby="watch-title">
      <div class="watch__text">
        <h3 class="watch__title display" id="watch-title">Ищете конкретную модель?</h3>
        <p>Скажите, какую машину и за сколько хотите. Напишем, когда такая появится на аукционе или пройдёт наш осмотр.</p>
      </div>
      <label class="field"><span class="vh">Модель</span><input name="model" type="text" placeholder="Модель" autocomplete="off" /></label>
      <label class="field"><span class="vh">Бюджет под ключ до</span><input name="budget" type="text" inputmode="numeric" placeholder="Бюджет под ключ до" autocomplete="off" /></label>
      ${actionBtn('watch', { label: 'Следить в Telegram', cls: 'btn btn--cobalt' })}
    </form>
  </div>
</section>`;
}
