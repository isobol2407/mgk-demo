// Квиз «Подберём под бюджет»: 6 шагов, вверху «Шаг N из 6», кнопка «Назад».
//   1 бюджет · 2 для чего · 3 новая или с пробегом · 4 модель (можно пропустить)
//   5 когда нужна · 6 куда прислать подборку.
// Открывается с первого шага (кнопка «Подобрать машину» на первом экране) или со второго,
// если бюджет выбран прямо в блоке «Не выбрали машину?». После выбора мессенджера квиз
// закрывается и открывается модалка «Что произойдёт дальше» со сводкой ответов.
// Модалка — нативный <dialog>: Esc закрывает, фокус внутри, после закрытия возвращается.
import { openNext } from './actions.js';
import { closeDialog } from './dialog.js';

const STEPS = 6;

export function initQuiz(company) {
  const dialog = document.querySelector('[data-quiz]');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const q = company.quiz;
  const panes = [...dialog.querySelectorAll('[data-quiz-pane]')];
  const stepLabel = dialog.querySelector('[data-quiz-step]');
  const bars = [...dialog.querySelectorAll('.quiz__bar i')];
  const backBtn = dialog.querySelector('[data-quiz-back]');
  const modelInput = dialog.querySelector('[data-quiz-model]');
  const modelForm = dialog.querySelector('[data-quiz-model-form]');

  let answers = {};
  let step = 1;
  let opener = null;

  const press = (attr, value) =>
    dialog.querySelectorAll(`[${attr}]`).forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value)));

  // Смена шага (решение Ильи 19.11.2026): новый шаг проявляется за 150 мс со сдвигом 8 px
  // по направлению — вперёд справа, «Назад» слева; при reduced-motion только проявление.
  // При открытии квиза первый шаг не анимируется.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function show(n, animate = true) {
    const dir = Math.sign(n - step) || 1;
    step = n;
    panes.forEach((p) => (p.hidden = Number(p.dataset.quizPane) !== step));
    const shown = panes.find((p) => !p.hidden);
    if (animate && shown?.animate) {
      const x = reduceMotion.matches ? 0 : 8 * dir;
      shown.animate(
        [{ opacity: 0, transform: `translateX(${x}px)` }, { opacity: 1, transform: 'none' }],
        { duration: 150, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
    }
    stepLabel.textContent = `Шаг ${step} из ${STEPS}`;
    bars.forEach((bar, i) => bar.classList.toggle('is-on', i < step));
    backBtn.hidden = step === 1;
    const pane = panes.find((p) => !p.hidden);
    if (step === 4) modelInput?.focus({ preventScroll: true });
    else pane?.querySelector('.quiz__title')?.focus({ preventScroll: true });
  }

  // Сводка для менеджера: «Бюджет 3–5 млн, для семьи, новая, модель Mazda CX-5, в ближайший месяц»
  function summary() {
    const find = (list, id) => list.find((x) => x.id === id)?.msg;
    const parts = [
      q.budgetMsg[answers.budget],
      find(q.purposes, answers.purpose),
      find(q.conditions, answers.condition),
      answers.model ? `модель ${answers.model}` : '',
      find(q.timings, answers.timing),
    ].filter(Boolean);
    const text = parts.join(', ');
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function open(fromStep, budget = '') {
    opener = document.activeElement;
    answers = { budget };
    ['data-quiz-budget', 'data-quiz-purpose', 'data-quiz-condition', 'data-quiz-timing', 'data-quiz-channel'].forEach((a) => press(a, ''));
    if (budget) press('data-quiz-budget', budget);
    if (modelInput) modelInput.value = '';
    dialog.showModal();
    step = fromStep;
    show(fromStep, false);
  }

  document.querySelectorAll('[data-quiz-start]').forEach((btn) => btn.addEventListener('click', () => open(1)));
  document.querySelectorAll('[data-quiz-open]').forEach((btn) => btn.addEventListener('click', () => open(2, btn.dataset.quizOpen)));

  // Каждый вариант записывает ответ и ведёт на следующий шаг
  const pick = { 'data-quiz-budget': ['budget', 2], 'data-quiz-purpose': ['purpose', 3], 'data-quiz-condition': ['condition', 4], 'data-quiz-timing': ['timing', 6] };

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) return closeDialog(dialog); // клик по фону
    const b = e.target.closest('button');
    if (!b) return;
    if (b.matches('[data-quiz-close]')) return closeDialog(dialog);
    if (b.matches('[data-quiz-back]')) return show(Math.max(1, step - 1));
    if (b.matches('[data-quiz-skip]')) {
      answers.model = '';
      return show(5);
    }
    for (const [attr, [field, next]] of Object.entries(pick)) {
      if (b.hasAttribute(attr)) {
        answers[field] = b.getAttribute(attr);
        press(attr, answers[field]);
        return show(next);
      }
    }
    if (b.dataset.quizChannel) {
      answers.channel = b.dataset.quizChannel;
      press('data-quiz-channel', answers.channel);
      const ctx = { summary: summary(), id: [answers.budget, answers.purpose, answers.condition, answers.timing].join('_') };
      dialog.close();
      openNext('quiz_done', { key: answers.channel, ctx, trigger: opener });
    }
  });

  modelForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    answers.model = modelInput.value.trim();
    show(5);
  });

  // После обычного закрытия фокус возвращается на кнопку, с которой открыли
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) opener?.focus?.({ preventScroll: true });
  });
}
