// Сборка страницы из блоков. Выполняется при сборке (vite.config.js), возвращает готовый HTML.
// Порядок блоков — по вайрфрейму docs/shablon-glavnaya-wireframe.md.
import { esc, configureMarks } from './lib/marks.js';
import { SPRITE } from './lib/ui.js';
import { typograph } from './lib/typo.js';
import { renderHeader } from './sections/header.js';
import { renderHero } from './sections/hero.js';
import { renderDeals } from './sections/deals.js';
import { renderBreakdown } from './sections/breakdown.js';
import { renderSteps } from './sections/steps.js';
import { renderCheck } from './sections/check.js';
import { renderPick, renderQuiz, renderDemoNote } from './sections/pick.js';

export function renderPage(company) {
  configureMarks({ showAsk: company.display?.showAsk ?? true });
  const body = `
${SPRITE}
<a class="skip" href="#main">К содержимому</a>
${renderHeader(company)}
<main id="main">
${renderHero(company)}
${renderDeals(company)}
${renderBreakdown(company)}
${renderCheck(company)}
${renderSteps(company)}
${renderPick(company)}
</main>
${renderDemoNote(company)}
${renderQuiz(company)}
<div class="toast" data-toast role="status" aria-live="polite" hidden></div>`;

  return {
    title: esc(company.meta.title),
    description: esc(company.meta.description),
    // Неразрывные пробелы: короткие слова, числа, тире (src/lib/typo.js)
    body: typograph(body),
  };
}
