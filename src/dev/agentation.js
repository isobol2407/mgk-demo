// Панель пометок Agentation для правок с Claude.
// Подключается только в `npm run dev` (см. main.js), в сборку не попадает.
// Пометки уходят в agentation-mcp на localhost:4747.
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Agentation } from 'agentation';

const host = document.createElement('div');
host.id = 'agentation-dev';
document.body.appendChild(host);
createRoot(host).render(createElement(Agentation, { endpoint: 'http://localhost:4747' }));
