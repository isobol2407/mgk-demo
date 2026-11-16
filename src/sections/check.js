// 6. Проверка машины. Отвечает на сомнение «а если привезут битую или со скрученным пробегом».
// Слева снимки из отчёта об осмотре, справа три проверки и ссылка на пример отчёта.
import { esc } from '../lib/marks.js';
import { icon, photo, extLink } from '../lib/ui.js';
import { reportHref } from '../lib/links.js';

export function renderCheck(c) {
  const ins = c.inspection;
  if (!ins) return '';
  const report = c.steps.report;
  const snaps = report.photos
    .map(
      (p, i) =>
        `<span class="snap check__snap" style="--tilt:${[-5, 3, -2][i % 3]}deg">${photo(p, { alt: 'Фото из отчёта об осмотре', sizes: '(min-width: 900px) 280px, 45vw' })}</span>`,
    )
    .join('');
  const items = ins.items
    .map(
      (x) => `
        <li class="check__item">
          ${icon('check', 'check__ico')}
          <div><h3 class="check__name">${esc(x.title)}</h3><p>${esc(x.text)}</p></div>
        </li>`,
    )
    .join('');
  return `
<section class="check section section--paper" id="check">
  <div class="container check__grid">
    <div class="check__photos" aria-hidden="true">${snaps}</div>
    <div class="check__body">
      <h2 class="display h2">${esc(ins.title)}</h2>
      <p class="sub">${esc(ins.sub)}</p>
      <ul class="check__list">${items}</ul>
      ${extLink('Пример отчёта в Telegram', reportHref(c), { cls: 'link check__link' })}
    </div>
  </div>
</section>`;
}
