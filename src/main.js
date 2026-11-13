// Разметка страницы уже в HTML (собирается из src/sections при сборке).
// Здесь только поведение: шапка, карусель, фильтры, переворот карточки, квиз.
import '@fontsource-variable/sofia-sans-extra-condensed/wght.css';
import '@fontsource-variable/golos-text/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/header.css';
import './styles/hero.css';

import { initHeader } from './client/header.js';
import { initArc } from './client/arc.js';
import { initHeroVideo } from './client/hero.js';
import { initMessengerLinks } from './client/messenger.js';

initHeader();
initMessengerLinks();
document.querySelectorAll('[data-arc]').forEach(initArc);
initHeroVideo();
