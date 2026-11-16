// 3. Разбор цены, вариант 3А. Бенто из четырёх карточек: машина, диаграмма, выгода, условия.
// Порядок: полоса машины → пять статей расхода → выгода → условия (решение Ильи 14.11.2026).
// Диаграмма переворачивается в таблицу с полным расчётом. На телефоне переворота нет:
// таблица раскрывается под диаграммой.
import { esc, val, demoBadge, isAsk, askBadge, isHidden } from '../lib/marks.js';
import { icon, photo } from '../lib/ui.js';
import { postHref } from '../lib/links.js';
import { rub, carSpecs, deliveryText } from '../lib/format.js';

// Сегменты диаграммы: оттенки одного кобальта, от самого тёмного к самому светлому
const SEGMENT_COLORS = ['var(--cobalt)', 'var(--cobalt-80)', 'var(--cobalt-60)', 'var(--cobalt-40)', 'var(--cobalt-20)'];

// А. Машина. На телефоне узкая полоса: маленькое фото, машин выше и так много.
// От 900 px — карточка с крупным фото, как раньше. Вся карточка ведёт на пост о выдаче.
function carCard(c, d) {
  const inner = `
      <span class="car__photo">${photo(d.photo, { alt: `${d.model}, ${d.year}`, sizes: '(min-width: 900px) 480px, 160px' })}</span>
      <span class="car__body">
        <span class="car__model display">${esc(d.model)}${d.demo ? ` ${demoBadge()}` : ''}</span>
        <span class="car__specs">${carSpecs(d).map(esc).join(' · ')}</span>
      </span>
      <span class="car__side">
        <span class="car__line">Выдали: ${esc(deliveryText(d))}</span>
        <span class="link link--muted car__link">Пост о выдаче${icon('arrow-ur')}</span>
      </span>`;
  return `<a class="car card" href="${esc(postHref(c, d))}" target="_blank" rel="noopener">${inner}</a>`;
}

function detailsHTML(row) {
  if (isAsk(row.details)) return `<p>Что входит: ${askBadge(row.details)}</p>`;
  if (Array.isArray(row.details)) return `<ul>${row.details.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  return row.details ? `<p>${esc(row.details)}</p>` : '';
}

function calcCard(c, d, b) {
  const bar = b.rows.map((r, i) => `<span style="--share:${r.share};--c:${SEGMENT_COLORS[i]}"></span>`).join('');
  const legend = b.rows.map((r, i) => `<li><i style="--c:${SEGMENT_COLORS[i]}"></i>${esc(r.label)}</li>`).join('');
  const rows = b.rows
    .map((r, i) => {
      const cells = `
              <span class="calc__name"><i style="--c:${SEGMENT_COLORS[i]}"></i>${esc(r.label)}</span>
              <span class="calc__payee">${esc(r.payee)}${r.payeeNote ? ` ${askBadge(r.payeeNote)}` : ''}</span>
              <span class="calc__sum">${rub(r.sum)}</span>`;
      // Раскрывается только строка, у которой есть что показать
      if (!r.details || isHidden(r.details)) return `<li class="calc__item"><div class="calc__row">${cells}</div></li>`;
      return `
          <li class="calc__item">
            <button class="calc__row" type="button" aria-expanded="false" aria-controls="calc-${r.key}" data-calc-row>${cells}
              ${icon('chevron-d', 'calc__chev')}
            </button>
            <div class="calc__more" id="calc-${r.key}" hidden>${detailsHTML(r)}</div>
          </li>`;
    })
    .join('');
  return `
    <div class="flip" data-flip>
      <div class="flip__in">
        <div class="flip__face flip__front" data-flip-front>
          <h3 class="display h3">Пять статей расхода</h3>
          <div class="bar" role="img" aria-label="Диаграмма без цифр: самая большая статья — машина, самая маленькая — ${esc(b.rows.at(-1).label.toLowerCase())}">${bar}</div>
          <ul class="legend">${legend}</ul>
          <p class="flip__note">Четыре статьи вы платите напрямую: продавцу, перевозчику, таможне и брокеру.</p>
          <button class="btn btn--line flip__btn" type="button" aria-expanded="false" aria-controls="calc-back" data-flip-open><span>Посмотреть расчёт подробно</span>${icon('chevron-d', 'flip__ico-m')}${icon('flip', 'flip__ico-d')}</button>
        </div>
        <div class="flip__face flip__back" id="calc-back" data-flip-back>
          <div class="flip__back-in">
            <div class="calc">
              <div class="calc__head" aria-hidden="true"><span>Статья</span><span>Кому платите</span><span>Сумма ${demoBadge()}</span></div>
              <ul class="calc__list">${rows}</ul>
              <p class="calc__total"><span>Итого под ключ ${esc(d.cityIn)}</span><b>${rub(b.total)}</b></p>
            </div>
            <p class="calc__note">Расчёт на ${esc(d.date)}${isHidden(b.rate) ? '' : `, курс ${val(b.rate)} ${esc(b.rateUnit)}`}. Сегодня сумма будет другой.</p>
            <p class="calc__note">Не входит: ${esc(b.excluded.charAt(0).toLowerCase() + b.excluded.slice(1))}</p>
            <button class="btn btn--line flip__btn flip__btn--back" type="button" data-flip-close>${icon('flip')}<span>Вернуться к схеме</span></button>
          </div>
        </div>
      </div>
    </div>`;
}

function gainCard(d, b) {
  return `
    <div class="gain on-ink">
      <p class="gain__label"><span>Выгода покупателя</span>${d.demo ? demoBadge() : ''}</p>
      <p class="gain__sum display">${rub(b.priceRu - b.total)}</p>
      <dl class="gain__rows">
        <div><dt>Такая же в России</dt><dd>${rub(b.priceRu)}</dd></div>
        <div><dt>Под ключ ${esc(d.from)}</dt><dd>${rub(b.total)}</dd></div>
      </dl>
      ${isHidden(b.priceRuSource) && isHidden(b.priceRuDate) ? '' : `<p class="gain__src">Цена в России: ${val(b.priceRuSource)}, ${val(b.priceRuDate)}</p>`}
    </div>`;
}

function conditionsCard(c, b) {
  const items = b.conditions.map((x) => `<li><b>${esc(x.if)}</b> — ${esc(x.then)}</li>`).join('');
  return `
    <div class="cond card">
      <h3 class="display h3">Если что-то пошло не так</h3>
      <ul class="cond__list">${items}</ul>
      <a class="btn btn--cobalt" href="#calc">${icon('arrow-down')}<span>Рассчитать мою машину</span></a>
    </div>`;
}

export function renderBreakdown(c) {
  const b = c.breakdown;
  const d = c.deals.find((x) => x.id === b.dealId);
  if (!d) return '';
  return `
<section class="price section section--cobalt" id="price">
  <div class="container">
    <header class="sec-head">
      <h2 class="display h2">Из чего складывается цена под ключ</h2>
      <p class="sub">На примере машины, которую мы выдали ${esc(d.cityIn)} ${esc(b.dateLong)}.</p>
    </header>
    <div class="bento">
      ${carCard(c, d)}
      ${calcCard(c, d, b)}
      ${gainCard(d, b)}
      ${conditionsCard(c, b)}
    </div>
  </div>
</section>`;
}
