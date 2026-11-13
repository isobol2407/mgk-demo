import { isAsk } from './marks.js';

// Ссылка в чат мессенджера с готовым текстом.
// Готовый текст в самой ссылке умеет только Telegram (t.me/<username>?text=…), и только для личного
// аккаунта или бота, не для канала. Для MAX и ВКонтакте ссылка открывает чат, а текст страница
// копирует в буфер по клику (см. src/client/messenger.js): человеку остаётся вставить его.
export function chatUrl(company, key, text = '') {
  const m = company.messengers[key];
  if (!m) return '#';
  if (key === 'telegram') {
    if (isAsk(m.chat)) return '#';
    return `https://t.me/${m.chat}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
  }
  return m.chat || m.url || '#';
}

// Атрибуты ссылки-кнопки в мессенджер: href, новая вкладка и текст для копирования.
export function chatAttrs(company, key, text = '') {
  const copy = key !== 'telegram' && text ? ` data-copy="${text.replace(/"/g, '&quot;')}"` : '';
  return `href="${chatUrl(company, key, text)}" target="_blank" rel="noopener" data-messenger="${key}"${copy}`;
}

export const primaryKey = (company) => company.messengers.primary || 'telegram';
export const messengerLabel = (company, key) => company.messengers[key]?.label ?? key;
export const messengerIcon = (key) => ({ telegram: 'tg', max: 'max', vk: 'vk', avito: 'avito' })[key] ?? 'tg';
