// 2. Привезённые машины. Лента карточек сделок с двумя фильтрами: бюджет и «новые / с пробегом».
// Только уже привезённые машины, без предложений из каталога. Фильтра по стране нет.
import { esc, val, demoBadge, isAsk, isHidden } from '../lib/marks.js';
import { icon, photo, actionBtn, extLink, proofHTML } from '../lib/ui.js';
import { primaryKey, messengerLabel, chatAttrs } from '../lib/messenger.js';
import { mln, saving, budgetOf, carSpecs, deliveryTagHTML } from '../lib/format.js';

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
          <div class="prices__row"><dt>Под ключ ${esc(d.from)}</dt><dd>${mln(d.turnkey)}</dd></div>
          ${d.priceRu ? `<div class="prices__row prices__row--save"><dt>Экономия${d.demo ? ` ${demoBadge()}` : ''}</dt><dd><span class="money">${mln(saving(d))}</span></dd></div>` : ''}
        </dl>
        <div class="deal__act">
          ${actionBtn('same', { ctx: { model: d.model, year: d.year }, label: 'Хочу такую же', cls: 'btn btn--cobalt btn--sm' })}
        </div>
      </div>
    </article>`;
}

// Карточка «Ищете конкретную модель?» стоит в ленте третьей: справа видно, что машины продолжаются
function watchCardHTML(c) {
  const chips = c.budgets
    .map((b, i) => `<label class="watch__chip"><input type="radio" name="budget" value="${esc(b.label)}"${i === 0 ? ' checked' : ''} /><span>${esc(b.label)}</span></label>`)
    .join('');
  return `
    <form class="deal deal--watch" data-watch-card data-action-form onsubmit="return false" aria-labelledby="watch-title">
      <h3 class="watch__title display" id="watch-title">Скажите, какая машина нужна, — сообщим, когда появится</h3>
      <div class="watch__fields">
        <label class="field"><span class="vh">Модель</span><input name="model" type="text" placeholder="Модель" autocomplete="off" /></label>
        <fieldset class="watch__chips"><legend class="vh">Бюджет под ключ</legend>${chips}</fieldset>
      </div>
      ${actionBtn('watch', { label: 'Следить в Telegram', cls: 'btn btn--lime btn--block' })}
    </form>`;
}
function dealsWithWatch(c) {
  const cards = c.deals.filter((d) => d.inLists !== false).map((d) => dealCardHTML(c, d));
  cards.splice(2, 0, watchCardHTML(c));
  return cards.join('');
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
    ${dealsWithWatch(c)}
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
</section>`;
}
