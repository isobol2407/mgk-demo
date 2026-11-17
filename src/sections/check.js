// 6. Проверка машины. Отвечает на сомнение «а если привезут битую или со скрученным пробегом».
// Слева главное по смыслу: пять шагов проверки, у каждого одна строка, и карточка-ссылка на статью.
// Справа доказательство: реальный случай отказа (Kia Mohave) коротким отчётом. На фото — кнопка
// видео (демо: по клику модалка «здесь будет видео осмотра»). Длинных абзацев в блоке нет.
import { esc } from '../lib/marks.js';
import { icon, photo, extLink } from '../lib/ui.js';
import { actionAttrs } from '../lib/actions.js';

export function renderCheck(c) {
  const ins = c.inspection;
  if (!ins) return '';
  const st = ins.story;
  const art = ins.article;

  // Строка отчёта: значок и результат слева, сразу за ним — где это выяснили
  const checks = (st?.checks ?? [])
    .map(
      (x) => `
          <li class="case__row${x.ok ? '' : ' case__row--bad'}">
            ${icon(x.ok ? 'check' : 'close', 'case__ico')}
            <span><b class="case__val">${esc(x.value)}</b> <span class="case__label">${esc(x.label)}</span></span>
          </li>`,
    )
    .join('');

  const video = st ? actionAttrs('video', { ctx: { title: `${st.title}: видео с осмотра`, postUrl: st.postUrl } }) : null;
  const story = st
    ? `
    <article class="case card">
      <div class="case__media">
        ${photo(st.photo, { alt: `${st.title} на осмотре`, sizes: '(min-width: 1100px) 360px, (min-width: 768px) 45vw, 100vw' })}
        <span class="case__tag">${icon('close')}<span>${esc(st.tag)}</span></span>
        <${video.tag} class="case__play" ${video.attrs} aria-label="Смотреть видео осмотра">${icon('play')}</${video.tag}>
      </div>
      <div class="case__body">
        <p class="case__meta">${esc(st.place)} · ${esc(st.date)}</p>
        <h3 class="case__title display">${esc(st.title)}</h3>
        <ul class="case__rows">${checks}</ul>
        <p class="case__verdict">${esc(st.verdict)}</p>
        ${extLink(esc(st.cta), st.postUrl, { cls: 'link case__link' })}
      </div>
    </article>`
    : '';

  const steps = ins.items
    .map(
      (x, i) => `
        <li class="how__step">
          <span class="how__n display" aria-hidden="true">${i + 1}</span>
          <span class="how__t">${esc(x.title)}</span>
          <span class="how__s">${esc(x.short)}</span>
        </li>`,
    )
    .join('');

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
      <div class="how">
        <ol class="how__list">${steps}</ol>
        ${article}
      </div>
      ${story}
    </div>
  </div>
</section>`;
}
