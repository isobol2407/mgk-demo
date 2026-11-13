// Разметка страницы уже в HTML (собирается из src/sections при сборке).
// Здесь только поведение: шапка, карусель, фильтры, переворот карточки, квиз.
import '@fontsource-variable/sofia-sans-extra-condensed/wght.css';
import '@fontsource-variable/golos-text/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/deals.css';
import './styles/breakdown.css';
import './styles/steps.css';
import './styles/pick.css';

import company from '@company';

import { initHeader } from './client/header.js';
import { initArc } from './client/arc.js';
import { initHeroVideo } from './client/hero.js';
import { initMessengerLinks } from './client/messenger.js';
import { initDeals } from './client/deals.js';
import { initFlip } from './client/flip.js';
import { initQuiz } from './client/quiz.js';

initHeader();
initMessengerLinks();
document.querySelectorAll('[data-arc]').forEach(initArc);
initHeroVideo();
document.querySelectorAll('[data-deals]').forEach((el) => initDeals(el, company));
document.querySelectorAll('[data-flip]').forEach(initFlip);
initQuiz(company);
