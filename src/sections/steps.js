// 4. Как привозим и когда платите. Десктоп: таймлайн (timeline.js). Телефон: пять шагов
// со строками «Платите» и «Получаете»,
// плюс карточка договора. Отчёт об осмотре — в своём блоке «Проверка машины».
import { esc, val, askBadge } from '../lib/marks.js';
import { icon } from '../lib/ui.js';
import { timelineHTML } from './timeline.js';

// Значение шага: строка или список частей (текст и плашки), части склеиваются пробелом
const parts = (v) => (Array.isArray(v) ? v.map(val).filter(Boolean).join(' ') : val(v));

export function renderSteps(c) {
  const s = c.steps;
  const steps = s.list
    .map(
      (step, i) => `
      <li class="step">
        <span class="step__fill" aria-hidden="true"></span>
        <span class="step__n display" aria-hidden="true">${i + 1}</span>
        <div class="step__body">
          <h3 class="step__title display">${esc(step.title)}</h3>
          <dl class="step__dl">
            <div><dt>Платите</dt><dd>${parts(step.pay)}</dd></div>
            <div><dt>Получаете</dt><dd>${parts(step.get)}</dd></div>
          </dl>
        </div>
      </li>`,
    )
    .join('');

  // Заголовок один и тот же: на десктопе внутри закреплённой сцены таймлайна, на телефоне над списком
  const head = (cls) => `
    <header class="sec-head ${cls}">
      <h2 class="display h2">Как привозим машину и <span class="steps__accent">когда вы платите</span></h2>
      <p class="sub">От первого сообщения до ключей — ${esc(s.term)}.</p>
    </header>`;
  return `
<section class="steps section" id="steps">
  <div class="container">
    ${timelineHTML(c, head('steps__head--tl'))}
    ${head('steps__head--list')}
    <ol class="steps__list">${steps}</ol>
    <div class="docs">
      <article class="doc doc--contract">
        <svg class="doc__art" viewBox="0 0 160 190" aria-hidden="true">
            <g class="doc__page">
              <rect x="22" y="22" width="116" height="150" rx="3" class="doc__sheet"/>
              <rect x="38" y="42" width="56" height="6" rx="1" class="doc__head"/>
              <g class="doc__lines">
                <rect x="38" y="60" width="84" height="4" rx="1"/><rect x="38" y="70" width="76" height="4" rx="1"/>
                <rect x="38" y="80" width="84" height="4" rx="1"/><rect x="38" y="90" width="60" height="4" rx="1"/>
                <rect x="38" y="106" width="84" height="4" rx="1"/><rect x="38" y="116" width="70" height="4" rx="1"/>
              </g>
              <path d="M84 150h38" class="doc__rule" stroke-width="1.5"/>
              <path d="M88 147c4-10 8-12 9-6s-3 9 2 4 7-11 9-5-2 7 3 4 6-5 9-3" fill="none" stroke="var(--cobalt)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M54 6v36a9 9 0 0 0 18 0V12a5.5 5.5 0 0 0-11 0v28" fill="none" class="doc__clip" stroke-width="2.4" stroke-linecap="round"/>
            </g>
          </svg>
        <div class="doc__text">
          <h3 class="display h3">Договор можно прочитать заранее</h3>
          <p>Все шаги и суммы записаны в нём.</p>
        </div>
        <p class="doc__act">
          <a class="btn btn--cobalt doc__btn" href="${esc(c.contract.url)}" target="_blank" rel="noopener">${icon('doc')}<span>Прочитать договор (PDF)</span></a>
          ${c.contract.placeholder ? askBadge({ note: 'ссылка на договор: сейчас заглушка', label: 'уточнить ссылку' }) : ''}
        </p>
      </article>
    </div>
  </div>
</section>`;
}
