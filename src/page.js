// Сборка страницы из блоков. Выполняется при сборке (vite.config.js), возвращает готовый HTML.
// Порядок блоков — по вайрфрейму docs/shablon-glavnaya-wireframe.md.
import { esc } from './lib/marks.js';
import { SPRITE } from './lib/ui.js';
import { renderHeader } from './sections/header.js';
import { renderHero } from './sections/hero.js';

export function renderPage(company) {
  const body = `
${SPRITE}
<a class="skip" href="#main">К содержимому</a>
${renderHeader(company)}
<main id="main">
${renderHero(company)}
</main>
<div class="toast" data-toast role="status" aria-live="polite" hidden></div>`;

  return {
    title: esc(company.meta.title),
    description: esc(company.meta.description),
    body,
  };
}
