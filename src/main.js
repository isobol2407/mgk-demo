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
import './styles/check.css';
import './styles/calc.css';
import './styles/steps.css';
import './styles/team.css';
import './styles/reviews.css';
import './styles/models160.css';
import './styles/faq.css';
import './styles/next.css';
import './styles/pick.css';

import company from '@company';

import { initHeader } from './client/header.js';
import { initArc } from './client/arc.js';
import { initHeroVideo } from './client/hero.js';
import { initMessengerLinks } from './client/messenger.js';
import { initDeals } from './client/deals.js';
import { initFlip } from './client/flip.js';
import { initQuiz } from './client/quiz.js';
import { initActions } from './client/actions.js';
import { initMarkers } from './client/marker.js';
import { initTimeline } from './client/timeline.js';
import { initReviews } from './client/reviews.js';
import { initDemoNote } from './client/demo.js';

initHeader();
initMessengerLinks();
document.querySelectorAll('[data-arc]').forEach(initArc);
initHeroVideo();
document.querySelectorAll('[data-deals]').forEach((el) => initDeals(el, company));
document.querySelectorAll('[data-flip]').forEach(initFlip);
initActions();
initMarkers();
initTimeline();
initReviews();
initQuiz(company);
initDemoNote();

// Панель пометок для правок с Claude: только в `npm run dev`, в сборку не попадает.
if (import.meta.env.DEV) import('./dev/agentation.js');
