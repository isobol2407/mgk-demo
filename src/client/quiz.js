// Квиз (блок 5). Первый вопрос стоит прямо в блоке: нажатие на вариант бюджета открывает
// модалку сразу на втором шаге. Три шага и финальный экран, вверху «Шаг N из 3».
// Финальная кнопка открывает мессенджер с сообщением, собранным из ответов. Телефон не спрашиваем.
// Модалка — нативный <dialog>: Esc закрывает, фокус остаётся внутри, после закрытия
// возвращается на кнопку, с которой открыли. Клик по фону тоже закрывает.
import { chatUrl, messengerLabel, messengerIcon } from '../lib/messenger.js';
import { copyText, toast } from './messenger.js';

export function initQuiz(company) {
  const dialog = document.querySelector('[data-quiz]');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const panes = [...dialog.querySelectorAll('[data-quiz-pane]')];
  const stepLabel = dialog.querySelector('[data-quiz-step]');
  const bars = [...dialog.querySelectorAll('.quiz__bar i')];
  const backBtn = dialog.querySelector('[data-quiz-back]');
  const msgBox = dialog.querySelector('[data-quiz-msg]');
  const go = dialog.querySelector('[data-quiz-go]');
  const goLabel = dialog.querySelector('[data-quiz-go-label]');
  const goIcon = dialog.querySelector('[data-quiz-go-icon]');
  const hint = dialog.querySelector('[data-quiz-hint]');

  const answers = { budget: '', condition: '', channel: '' };
  let step = '2';

  const press = (attr, value) =>
    dialog.querySelectorAll(`[${attr}]`).forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value)));

  function message() {
    const budget = company.quiz.budgetMsg[answers.budget] ?? '';
    const condition = company.quiz.conditions.find((c) => c.id === answers.condition)?.msg ?? '';
    return company.messages.quiz({ budget, condition });
  }

  function show(next, { focus = true } = {}) {
    step = next;
    panes.forEach((p) => (p.hidden = p.dataset.quizPane !== step));
    const n = step === 'done' ? 3 : Number(step);
    stepLabel.textContent = step === 'done' ? 'Готово' : `Шаг ${n} из 3`;
    bars.forEach((bar, i) => bar.classList.toggle('is-on', i < n));
    backBtn.hidden = step === '1';

    if (step === 'done') {
      const text = message();
      const key = answers.channel;
      msgBox.textContent = text;
      go.href = chatUrl(company, key, text);
      go.dataset.messenger = key;
      goLabel.textContent = `Открыть ${messengerLabel(company, key)}`;
      goIcon?.setAttribute('href', `#i-${messengerIcon(key)}`);
      // В Telegram текст уже в ссылке. В остальные мессенджеры его нужно вставить вручную
      const needCopy = key !== 'telegram';
      hint.hidden = !needCopy;
      if (needCopy) go.dataset.copy = text;
      else delete go.dataset.copy;
    }
    if (focus) panes.find((p) => !p.hidden)?.querySelector('.quiz__title')?.focus({ preventScroll: true });
  }

  // Открытие из блока: бюджет уже выбран, начинаем со второго шага
  document.querySelectorAll('[data-quiz-open]').forEach((btn) =>
    btn.addEventListener('click', () => {
      answers.budget = btn.dataset.quizOpen;
      answers.condition = '';
      answers.channel = '';
      press('data-quiz-budget', answers.budget);
      press('data-quiz-condition', '');
      press('data-quiz-channel', '');
      dialog.showModal();
      show('2');
    }),
  );

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) return dialog.close(); // клик по фону
    const b = e.target.closest('button');
    if (!b) return;
    if (b.matches('[data-quiz-close]')) return dialog.close();
    if (b.matches('[data-quiz-back]')) return show(step === 'done' ? '3' : String(Number(step) - 1));
    if (b.dataset.quizBudget) {
      answers.budget = b.dataset.quizBudget;
      press('data-quiz-budget', answers.budget);
      return show('2');
    }
    if (b.dataset.quizCondition) {
      answers.condition = b.dataset.quizCondition;
      press('data-quiz-condition', answers.condition);
      return show('3');
    }
    if (b.dataset.quizChannel) {
      answers.channel = b.dataset.quizChannel;
      press('data-quiz-channel', answers.channel);
      return show('done');
    }
  });

  // Финальная кнопка внутри модалки: копируем текст сами, общий обработчик до <dialog> тоже дотянется,
  // но сообщение «скопировано» должно быть видно поверх модалки, поэтому показываем его в подсказке.
  go.addEventListener('click', () => {
    if (!go.dataset.copy) return;
    copyText(go.dataset.copy).then((ok) => {
      if (ok) hint.textContent = 'Текст сообщения скопирован: вставьте его в чат.';
      else toast('Скопируйте текст сообщения вручную');
    });
  });
}
