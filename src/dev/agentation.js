// Панель пометок Agentation для правок с Claude.
// Подключается только в `npm run dev` (см. main.js), в сборку не попадает.
// Пометки уходят в agentation-mcp на порт 4747 того же компьютера, с которого открыт сайт:
// на Mac это localhost, с телефона по Wi-Fi — IP Mac.
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Agentation } from 'agentation';

const endpoint = `http://${location.hostname}:4747`;
const host = document.createElement('div');
host.id = 'agentation-dev';
document.body.appendChild(host);
createRoot(host).render(createElement(Agentation, { endpoint }));
