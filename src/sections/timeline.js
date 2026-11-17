// Таймлайн «Как привозим» по референсу gohelper.io: шкала дней, этапы полосками, в конце
// плашка «Ключи у вас». Поведение (закрепление и прокрутка вбок) — src/client/timeline.js.
// Показывается от 1024 px; на телефоне вместо него обычный список шагов (steps.js).
import { esc } from '../lib/marks.js';

export function timelineHTML(c, head = '') {
  const t = c.steps.timeline;
  if (!t) return '';
  const D = t.days;
  const pos = (d) => `${(d / D) * 100}%`;
  const phases = t.phases
    .map((p) => `<div class="tl__phase" style="left:${pos(p.from)};width:${pos(p.to - p.from)}"><span class="tl__phase-t">${esc(p.title)}</span></div>`)
    .join('');
  const ticks = Array.from({ length: Math.floor(D / 7) + 1 }, (_, i) => i * 7)
    .map((d) => `<span class="tl__tick" style="left:${pos(d)}">${d === 0 ? 'день 1' : d}</span>`)
    .join('');
  const bars = t.bars
    .map(
      (b, i) => `
        <div class="tl__bar" data-tl-bar data-from="${b.from}" data-to="${b.to}" style="--row:${i};left:${pos(b.from)};width:${pos(b.to - b.from)}">
          <span class="tl__bar-t">${esc(b.label)}</span>${b.pay ? `<span class="tl__pay">${esc(b.pay)}</span>` : ''}
        </div>`,
    )
    .join('');
  const m = t.milestone;
  const a = t.after;
  return `
    <div class="tl" data-tl data-days="${D}">
      <div class="tl__stage" data-tl-stage>
        ${head}
        <div class="tl__card">
          <div class="tl__track" data-tl-track style="--rows:${t.bars.length + 1}">
            <div class="tl__phases">${phases}</div>
            <div class="tl__ticks">${ticks}</div>
            <div class="tl__grid">
              ${bars}
              <div class="tl__bar tl__bar--after" data-tl-bar data-from="${a.from}" data-to="${D + 2}" style="--row:${t.bars.length};left:${pos(a.from)};width:${pos(D - a.from)}"><span class="tl__bar-t">${esc(a.label)}</span></div>
              <div class="tl__goal" data-tl-goal data-day="${m.day}" style="left:${pos(m.day)}">
                <span class="tl__goal-t display">${esc(m.label)}</span>${m.pay ? `<span class="tl__pay">${esc(m.pay)}</span>` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}
