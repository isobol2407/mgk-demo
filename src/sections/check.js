// 6. Проверка машины. Отвечает на сомнение «а если привезут битую или со скрученным пробегом».
// Одна разметка, две раскладки (решение Ильи 18.11.2026, выбор из прототипов):
// - от 1100 px «Развилка»: пять шагов на примере Kia Mohave. У шагов результаты осмотра, после шага
//   с находкой плашка «забраковали», под ней разделитель «Если машина прошла осмотр» и шаги дальше
//   в полную силу. Справа фото случая (видео-заглушка, пост) и статья.
// - до 1100 px «Маршрут»: шаги вертикальной линией, ниже случай отчётом, статья сразу под заголовком.
import { esc } from '../lib/marks.js';
import { icon, photo, extLink } from '../lib/ui.js';
import { actionAttrs } from '../lib/actions.js';

export function renderCheck(c) {
  const ins = c.inspection;
  if (!ins) return '';
  const st = ins.story;
  const art = ins.article;
  const checks = st?.checks ?? [];
  // Шаг, на котором машину забраковали: после него плашка и развилка
  const stop = checks.find((x) => !x.ok)?.step;

  // Строка отчёта (раскладка «Маршрут»): значок и результат слева, сразу за ним — где это выяснили
  const rows = checks
    .map(
      (x) => `
          <li class="case__row${x.ok ? '' : ' case__row--bad'}">
            ${icon(x.ok ? 'check' : 'close', 'case__ico')}
            <span><b class="case__val">${esc(x.value)}</b> <span class="case__label">${esc(x.label)}</span></span>
          </li>`,
    )
    .join('');

  // Результаты у шага (раскладка «Развилка»)
  const chips = (n) =>
    checks
      .filter((x) => x.step === n)
      .map((x) => `<span class="how__chip${x.ok ? '' : ' how__chip--bad'}">${icon(x.ok ? 'check' : 'close', 'how__chip-ico')}${esc(x.value)}</span>`)
      .join('');

  let order = 0;
  const steps = ins.items
    .map((x, i) => {
      const n = i + 1;
      const res = st ? chips(n) : '';
      const step = `
        <li class="how__step" style="--i:${order++};--n:${i}">
          <span class="how__n display" aria-hidden="true">${n}</span>
          <span class="how__text"><span class="how__t">${esc(x.title)}</span><span class="how__s">${esc(x.short)}</span></span>
          ${res ? `<span class="how__res">${res}</span>` : ''}
        </li>`;
      const fork =
        st && n === stop
          ? `
        <li class="how__stop" style="--i:${order++}">${icon('close', 'how__stop-ico')}<span><b>${esc(st.title)} забраковали.</b> ${esc(st.verdict)}</span></li>
        <li class="how__fork" style="--i:${order++}"><span>Если машина прошла осмотр</span></li>`
          : '';
      return step + fork;
    })
    .join('');

  const video = st ? actionAttrs('video', { ctx: { title: `${st.title}: видео с осмотра`, postUrl: st.postUrl } }) : null;
  const story = st
    ? `
      <article class="case card">
        <div class="case__media">
          ${photo(st.photo, { alt: `${st.title} на осмотре`, sizes: '(min-width: 1100px) 480px, (min-width: 768px) 45vw, 100vw' })}
          <span class="case__tag">${icon('close')}<span>${esc(st.tag)}</span></span>
          <${video.tag} class="case__play" ${video.attrs} aria-label="Смотреть видео осмотра">${icon('play')}</${video.tag}>
        </div>
        <div class="case__body">
          <p class="case__meta">${esc(st.place)} · ${esc(st.date)}</p>
          <h3 class="case__title display">${esc(st.title)}</h3>
          <ul class="case__rows">${rows}</ul>
          <p class="case__verdict">${esc(st.verdict)}</p>
          ${extLink(esc(st.cta), st.postUrl, { cls: 'link case__link' })}
        </div>
      </article>`
    : '';

  const blog = actionAttrs('blog', { ctx: { title: art?.title, postUrl: st?.postUrl } });
  const article = art
    ? `
      <${blog.tag} class="post card" ${blog.attrs}>
        <span class="post__img">${photo(art.photo, { alt: art.photoAlt ?? '', sizes: '160px' })}</span>
        <span class="post__text">
          <span class="post__label">${esc(art.label)}</span>
          <span class="post__title">${esc(art.title)}</span>
        </span>
        <span class="post__arrow">${icon('arrow-ur')}</span>
      </${blog.tag}>`
    : '';

  return `
<section class="check section section--paper" id="check">
  <div class="container">
    <header class="sec-head">
      <h2 class="display h2">${esc(ins.title)}</h2>
      <p class="sub">${esc(ins.sub)}</p>
    </header>
    <div class="check__grid">
      <div class="check__main">
        ${st ? `<p class="check__eyebrow">На примере ${esc(st.title)} · ${esc(st.place)}, ${esc(st.date)}</p>` : ''}
        <ol class="how" data-check>${steps}</ol>
      </div>
      <div class="check__side">
        ${story}
        ${article}
      </div>
    </div>
  </div>
</section>`;
}
