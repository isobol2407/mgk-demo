// Три вида значений в данных компании:
//   'текст'            реальный факт, показывается как есть;
//   demo('3,98 млн ₽') цифра-пример, рядом плашка «демо»;
//   ask('рейтинг')     данных нет, на месте значения плашка «уточнить» (вопрос для созвона).
// Второй аргумент ask меняет подпись плашки, например ask('кому платит клиент', 'уточнить, кому').

export const demo = (value) => ({ mark: 'demo', value });
export const ask = (note = '', label = 'уточнить') => ({ mark: 'ask', note, label });

// showAsk: false — показ дизайна клиенту, плашек «уточнить» нет, строки без данных скрыты.
// showAsk: true — подготовка к созвону, на месте пустых значений видны плашки.
// Задаётся в файле компании (display.showAsk), список вопросов лежит в docs/utochnit.md.
export const settings = { showAsk: true };
export const configureMarks = (opts = {}) => Object.assign(settings, opts);

export const isMark = (v) => Boolean(v && typeof v === 'object' && v.mark);
export const isAsk = (v) => isMark(v) && v.mark === 'ask';
export const isDemo = (v) => isMark(v) && v.mark === 'demo';
// Значения нет и плашка спрятана: место нужно убрать из вёрстки целиком
export const isHidden = (v) => isAsk(v) && !settings.showAsk;

export const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export const demoBadge = () => '<span class="mark mark--demo">демо</span>';
export const askBadge = (v) =>
  !settings.showAsk
    ? ''
    : `<span class="mark mark--ask"${v?.note ? ` title="${esc(v.note)}"` : ''}>${esc(v?.label ?? 'уточнить')}</span>`;

// Значение в HTML. Обычный текст экранируется, помеченные значения получают плашку.
export function val(v) {
  if (isAsk(v)) return askBadge(v);
  if (isDemo(v)) return `${esc(v.value)}&nbsp;${demoBadge()}`;
  return esc(v ?? '');
}

// Только текст значения, без плашки (для alt, aria-label, сообщений в мессенджер).
export const plain = (v) => (isAsk(v) ? '' : isDemo(v) ? String(v.value) : String(v ?? ''));
