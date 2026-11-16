// Ссылки на конкретные посты. В данных сделки поле postUrl, у отчёта — reportUrl.
// Пока ссылок нет, там ask(…) ([заполнить], см. docs/utochnit.md), и кнопка временно ведёт
// в канал, чтобы на демо не было мёртвых ссылок. Когда появится пост, ведёт на него.
import { isAsk } from './marks.js';

const channel = (c) => c.messengers.telegram?.channel ?? '#';
export const postHref = (c, d) => (d.postUrl && !isAsk(d.postUrl) ? d.postUrl : channel(c));
export const reportHref = (c) => {
  const u = c.steps?.report?.reportUrl;
  return u && !isAsk(u) ? u : channel(c);
};
