// 4. Этапы и оплата. Пять шагов, у каждого строки «Платите» и «Получаете»,
// плюс карточки договора и отчёта об осмотре.
import { esc, val, askBadge } from '../lib/marks.js';
import { icon, photo, extLink } from '../lib/ui.js';

// Значение шага: строка или список частей (текст и плашки), части склеиваются пробелом
const parts = (v) => (Array.isArray(v) ? v.map(val).filter(Boolean).join(' ') : val(v));

export function renderSteps(c) {
  const s = c.steps;
  const steps = s.list
    .map(
      (step, i) => `
      <li class="step">
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
  const reportPhotos = s.report.photos
    .map((p, i) => `<span class="snap" style="--tilt:${[-4, 3, -2][i % 3]}deg">${photo(p, { alt: 'Фото из отчёта об осмотре', sizes: '160px', widths: [480, 960] })}</span>`)
    .join('');

  return `
<section class="steps section" id="steps">
  <div class="container">
    <header class="sec-head">
      <h2 class="display h2">Когда вы платите и что получаете</h2>
      <p class="sub">От первого сообщения до ключей — ${esc(s.term)}.</p>
    </header>
    <ol class="steps__list">${steps}</ol>
    <div class="docs">
      <article class="doc doc--contract">
        <svg class="doc__art" viewBox="0 0 160 190" aria-hidden="true">
            <g transform="rotate(4 80 95)">
              <rect x="22" y="22" width="116" height="150" rx="3" fill="var(--white)" stroke="var(--line)"/>
              <rect x="38" y="42" width="56" height="6" rx="1" fill="var(--ink)"/>
              <g fill="var(--line)">
                <rect x="38" y="60" width="84" height="4" rx="1"/><rect x="38" y="70" width="76" height="4" rx="1"/>
                <rect x="38" y="80" width="84" height="4" rx="1"/><rect x="38" y="90" width="60" height="4" rx="1"/>
                <rect x="38" y="106" width="84" height="4" rx="1"/><rect x="38" y="116" width="70" height="4" rx="1"/>
              </g>
              <path d="M84 150h38" stroke="var(--line)" stroke-width="1.5"/>
              <path d="M88 147c4-10 8-12 9-6s-3 9 2 4 7-11 9-5-2 7 3 4 6-5 9-3" fill="none" stroke="var(--cobalt)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <path d="M54 6v36a9 9 0 0 0 18 0V12a5.5 5.5 0 0 0-11 0v28" fill="none" stroke="var(--ink-2)" stroke-width="2.4" stroke-linecap="round"/>
          </svg>
        <div class="doc__text">
          <h3 class="display h3">Договор можно прочитать заранее</h3>
          <p>Все шаги и суммы записаны в нём.</p>
        </div>
        <p class="doc__act">
          <a class="btn btn--cobalt" href="${esc(c.contract.url)}" target="_blank" rel="noopener">${icon('doc')}<span>Прочитать договор (PDF)</span></a>
          ${c.contract.placeholder ? askBadge({ note: 'ссылка на договор: сейчас заглушка', label: 'уточнить ссылку' }) : ''}
        </p>
      </article>
      <article class="doc doc--report">
        <div class="doc__text">
          <h3 class="display h3">Так выглядит отчёт об осмотре</h3>
          <p>Фото, видео и заключение специалиста до выкупа.</p>
        </div>
        <div class="doc__bottom">
          <p class="doc__act">${extLink('Пример отчёта в Telegram', s.report.url, { cls: 'link' })}${s.report.placeholder ? ` ${askBadge({ note: 'ссылка на пример отчёта и фото: сейчас заглушки', label: 'уточнить' })}` : ''}</p>
          <div class="doc__snaps" aria-hidden="true">${reportPhotos}</div>
        </div>
      </article>
    </div>
  </div>
</section>`;
}
