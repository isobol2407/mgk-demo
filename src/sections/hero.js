// 1. Обещание. Кобальтовый экран: заголовок со снимками между словами, справа колонка с оффером,
// ниже карусель привезённых машин по дуге. Заголовок — обычный текст в h1, снимки стоят в потоке строки.
import { esc, val, demoBadge, isAsk, isHidden } from '../lib/marks.js';
import { icon, photo, chatBtn, extLink, proofHTML } from '../lib/ui.js';
import { primaryKey } from '../lib/messenger.js';
import { mln, saving, km } from '../lib/format.js';

// Снимки стоят внутри h1, поэтому для скринридера скрыты: заголовок читается как чистый текст.
function shotHTML(shot, i) {
  const cls = `shot shot--${shot.type}${shot.mobile === false ? ' shot--desk' : ''}`;
  const style = `--tilt:${shot.tilt ?? 0}deg;--i:${i}`;
  if (shot.type === 'video') {
    // Видео без звука, зациклено. Постер держит место, пока файл не загрузился.
    // preload="none": файл подтягивает скрипт после появления заголовка (src/client/hero.js).
    const cap =
      (shot.caption ? `<span class="shot__cap">${esc(shot.caption)}</span>` : '') + (shot.demo ? demoBadge() : '');
    return `<span class="${cls}" style="${style}" data-shot aria-hidden="true">
      <video class="shot__media" muted loop playsinline preload="none" poster="/media/${shot.poster}-480.webp" width="480" height="360" tabindex="-1" data-hero-video><source src="${shot.src}" type="video/mp4" /></video>${cap}</span>`;
  }
  return `<span class="${cls}" style="${style}" data-shot aria-hidden="true">${photo(shot.src, { alt: '', widths: [240, 480], ratio: 4 / 3, sizes: '160px', cls: 'shot__media' })}</span>`;
}

function titleHTML(c) {
  const lines = c.hero.title.map((line) =>
    line
      .map((part) => (typeof part === 'string' ? `<span class="hero__w">${esc(part)}</span>` : shotHTML(c.hero.shots[part.shot], part.shot)))
      .join(' '),
  );
  // Между строками обычный пробел и перенос, который работает только от 768 px
  return lines.join(' <br class="hero__br" />');
}

function arcHTML(c) {
  const deals = c.deals.slice(0, 6);
  const key = primaryKey(c);
  const cards = deals
    .map(
      (d, i) => `
      <button class="arc__card" type="button" data-arc-card="${i}" aria-label="${esc(`${d.model}, ${d.year}`)}" tabindex="-1">
        ${photo(d.photo, { alt: `${d.model}, ${d.year}: выдача ${d.cityIn}`, sizes: '(min-width: 768px) 440px, 80vw', eager: true })}
        <span class="arc__spec">${[d.year, d.mileage != null ? km(d.mileage) : '', d.hp ? `${d.hp}\u00a0л.с.` : ''].filter(Boolean).join(' · ')}</span>
      </button>`,
    )
    .join('');
  const caps = deals
    .map(
      (d, i) => `
      <div class="arc__cap${i === 0 ? ' is-active' : ''}" data-arc-cap="${i}"${i === 0 ? '' : ' inert'}>
        <p class="arc__l1"><span>${esc(d.model)}</span> · <span>${esc(d.city)} · ${esc(d.date)}</span></p>
        <p class="arc__l2">Экономия ${mln(saving(d))}${d.demo ? ` ${demoBadge()}` : ''}</p>
        <div class="arc__act">
          ${chatBtn(c, { key, text: c.messages.sameCar(d), label: 'Хочу такую же', cls: 'btn--white btn--sm' })}
          ${extLink('Пост о выдаче', d.post, { cls: 'link link--on-cobalt' })}
        </div>
      </div>`,
    )
    .join('');
  const dots = deals
    .map((d, i) => `<button class="arc__dot${i === 0 ? ' is-active' : ''}" type="button" data-arc-dot="${i}" aria-label="${esc(`${d.model}, ${d.year}`)}"${i === 0 ? ' aria-current="true"' : ''}></button>`)
    .join('');
  return `
  <div class="arc" data-arc role="group" aria-roledescription="карусель" aria-label="Привезённые машины. Листайте стрелками" tabindex="0">
    <div class="arc__stage" data-arc-stage>${cards}</div>
    <div class="arc__foot container">
      <div class="arc__dots">${dots}</div>
      <div class="arc__caps" aria-live="off" data-arc-caps>${caps}</div>
    </div>
  </div>`;
}

export function renderHero(c) {
  const key = primaryKey(c);
  const facts = c.hero.facts.map((f) => `<li>${val(f)}</li>`).join('');
  return `
<section class="hero" id="top" data-hero>
  <div class="hero__top container">
    <h1 class="hero__title">${titleHTML(c)}</h1>
    <div class="hero__aside">
      <p class="hero__lead">${esc(c.hero.lead)}</p>
      <div class="hero__cta">
        ${chatBtn(c, { key, text: c.messages.pick, label: c.hero.cta, cls: 'btn--white btn--lg', attrs: 'data-hero-cta' })}
        <a class="link link--on-cobalt" href="${esc(c.contract.url)}" target="_blank" rel="noopener">${icon('doc')}Прочитать договор</a>
      </div>
      ${proofHTML(c)}
    </div>
    <ul class="hero__facts">${facts}</ul>
  </div>
  ${arcHTML(c)}
</section>`;
}
