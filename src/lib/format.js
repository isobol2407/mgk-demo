// Форматы чисел. Неразрывные пробелы, чтобы сумма и «₽» не разъезжались по строкам.
const NBSP = ' ';

// 3.98 → «3,98 млн ₽»
export const mln = (n) =>
  `${n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${NBSP}млн${NBSP}₽`;

// 3980000 → «3 980 000 ₽»
export const rub = (n) => `${Math.round(n).toLocaleString('ru-RU').replace(/\s/g, NBSP)}${NBSP}₽`;

// 48 → «48 дней», 52 → «52 дня», 41 → «41 день»
export function days(n) {
  const a = n % 10;
  const b = n % 100;
  const word = a === 1 && b !== 11 ? 'день' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'дня' : 'дней';
  return `${n}${NBSP}${word}`;
}

// 0 → «без пробега», 48000 → «48 000 км»
export const km = (n) => (n ? `${n.toLocaleString('ru-RU').replace(/\s/g, NBSP)}${NBSP}км` : 'без пробега');

// Экономия в миллионах с точностью до сотых
export const saving = (deal) => Math.round((deal.priceRu - deal.turnkey) * 100) / 100;

// К какому диапазону бюджета относится цена под ключ
export const budgetOf = (turnkey, budgets) =>
  budgets.find((b) => turnkey >= (b.min ?? 0) && turnkey < (b.max ?? Infinity))?.id ?? '';

// Строка о машине: год · объём · пробег · мощность. Один смысловой блок, не разделяем
export const carSpecs = (d) =>
  [String(d.year), d.engine ?? '', d.mileage != null ? km(d.mileage) : '', d.hp ? `${d.hp}${NBSP}л.с.` : ''].filter(Boolean);

// Строка о выдаче: «Город · дата · за N дней». Отдельный блок от строки о машине,
// формат один на весь проект
export const deliveryLine = (d) => [d.city, d.date, d.days ? `за${NBSP}${days(d.days)}` : ''].filter(Boolean);
export const deliveryText = (d) => deliveryLine(d).join(' · ');

// Тег на фото: длинный город на телефоне заменяется коротким (ЕКБ). Тег не длиннее
// 34 знаков в полной версии и 26 в короткой — иначе вылезает за фото на 375 px
export function deliveryTagHTML(d, esc) {
  const rest = `${d.city ? ' · ' : ''}${d.date}${d.days ? ` · за${NBSP}${days(d.days)}` : ''}`;
  if (!d.cityShort) return esc((d.city ?? '') + rest);
  return `<span class="tag-long">${esc(d.city)}</span><span class="tag-short">${esc(d.cityShort)}</span>${esc(rest)}`;
}
