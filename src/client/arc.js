// Карусель привезённых машин по вогнутой дуге (блок 1). Единственный тяжёлый эффект страницы.
// Образец поведения: Curve Reel и Carousel Spotlight (getlayers.ai), код свой: CSS-трансформации
// и requestAnimationFrame, без библиотек и WebGL.
//
// pos — дробный номер карточки в центре. Карточки идут по кругу: расстояние до центра
// сворачивается в диапазон [−n/2, n/2). Центральная крупнее и смотрит на зрителя,
// соседние меньше и повёрнуты внутрь дуги. Подпись и точки меняются вместе с центральной.
//
// Управление: перетаскивание, свайп, клик по боковой карточке, стрелки, точки.
// Без действий листается сама; останавливается при наведении, фокусе и после первого действия.
// prefers-reduced-motion: плоский ряд, сама не листается, переходы без анимации.

const AUTO_REST = 2600; // пауза между шагами автолистания, мс
const AUTO_MOVE = 1300; // длительность шага автолистания, мс
const USER_MOVE = 620; // доводка после действия пользователя, мс

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function initArc(root) {
  const stage = root.querySelector('[data-arc-stage]');
  const cards = [...root.querySelectorAll('[data-arc-card]')];
  const caps = [...root.querySelectorAll('[data-arc-cap]')];
  const dots = [...root.querySelectorAll('[data-arc-dot]')];
  const n = cards.length;
  if (!stage || n < 2) return;

  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = reduceQuery.matches;
  let pos = 0;
  let active = -1;
  let rafId = 0;
  let autoTimer = 0;
  let hovering = false;
  let stopped = false; // после первого действия пользователя автолистание выключается насовсем
  let onScreen = true;
  let introDone = false; // пока идёт стартовый въезд, автолистание не запускается
  let stepPx = 300;

  const mod = (i) => ((i % n) + n) % n;

  function setActive(i) {
    active = i;
    cards.forEach((card, k) => card.classList.toggle('is-active', k === i));
    caps.forEach((cap, k) => {
      const on = k === i;
      cap.classList.toggle('is-active', on);
      cap.toggleAttribute('inert', !on);
    });
    dots.forEach((dot, k) => {
      dot.classList.toggle('is-active', k === i);
      if (k === i) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function layout() {
    const cw = cards[0].offsetWidth;
    const narrow = stage.clientWidth < 768;
    // Шаг до первого соседа больше: центральная карточка крупнее остальных
    const step1 = cw * (narrow ? 0.94 : 0.98);
    const step2 = cw * (narrow ? 0.6 : 0.58);
    stepPx = step1;
    for (let i = 0; i < n; i++) {
      let d = i - pos;
      d = ((((d + n / 2) % n) + n) % n) - n / 2; // по кругу
      const a = Math.abs(d);
      const s = Math.sign(d);
      const card = cards[i];
      if (reduce) {
        // Плоский ряд: без поворота и масштаба
        card.style.transform = `translate3d(${d * (cw + 16)}px, 0, 0)`;
        card.style.opacity = a > n / 2 - 0.6 ? '0' : '1';
      } else {
        const a1 = Math.min(a, 1);
        const a2 = clamp(a - 1, 0, 1);
        const a3 = Math.max(0, a - 2);
        const x = s * (step1 * a1 + step2 * a2 + step2 * 0.7 * a3);
        // Центральная на 15% крупнее, соседние того же размера, что раньше
        const scale = (1 - 0.27 * a1 - 0.13 * a2 - 0.06 * a3) * (1 + 0.15 * (1 - a1));
        const rotY = -s * ((narrow ? 24 : 32) * a1 + 16 * a2 + 8 * a3); // внутрь дуги
        // Дуга: центр ниже всех, края поднимаются
        const y = -((narrow ? 8 : 16) * a1 * a1 + (narrow ? 14 : 30) * a2 + 20 * a3);
        card.style.transform = `translate3d(${x}px, ${y}px, 0) rotateY(${rotY}deg) scale(${scale})`;
        card.style.opacity = String(clamp(1 - (a - 2.1) / 0.7, 0, 1));
      }
      card.style.zIndex = String(100 - Math.round(a * 10));
    }
    const idx = mod(Math.round(pos));
    if (idx !== active) setActive(idx);
  }

  function animateTo(target, duration, ease, done) {
    cancelAnimationFrame(rafId);
    if (reduce || duration <= 0) {
      pos = target;
      layout();
      done?.();
      return;
    }
    const from = pos;
    const t0 = performance.now();
    const tick = (now) => {
      const t = clamp((now - t0) / duration, 0, 1);
      pos = from + (target - from) * ease(t);
      layout();
      if (t < 1) rafId = requestAnimationFrame(tick);
      else done?.();
    };
    rafId = requestAnimationFrame(tick);
  }

  // ── Автолистание ──
  function scheduleAuto(delay = AUTO_REST) {
    clearTimeout(autoTimer);
    if (reduce || stopped || hovering || !onScreen || document.hidden || !introDone) return;
    autoTimer = setTimeout(() => {
      animateTo(Math.round(pos) + 1, AUTO_MOVE, easeInOut, () => scheduleAuto());
    }, delay);
  }
  const capsBox = root.querySelector('[data-arc-caps]');
  function stopForGood() {
    stopped = true;
    introDone = true;
    clearTimeout(autoTimer);
    // Пока карусель листается сама, подписи скринридеру не зачитываются; после действия человека зачитываются
    capsBox?.setAttribute('aria-live', 'polite');
  }

  // К карточке i по кратчайшему пути
  function goTo(i) {
    const cur = Math.round(pos);
    let delta = mod(i) - mod(cur);
    if (delta > n / 2) delta -= n;
    if (delta < -n / 2) delta += n;
    animateTo(cur + delta, USER_MOVE, easeOut);
  }
  const shift = (dir) => animateTo(Math.round(pos) + dir, USER_MOVE, easeOut);

  // ── Перетаскивание и свайп ──
  let drag = null;
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, pos0: pos, moved: false, lastX: e.clientX, lastT: e.timeStamp, v: 0, card: e.target.closest('[data-arc-card]') };
  });
  stage.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x0;
    if (!drag.moved) {
      if (Math.abs(dx) < 6) return;
      // Вертикальный жест на телефоне оставляем прокрутке страницы
      if (Math.abs(e.clientY - drag.y0) > Math.abs(dx)) {
        drag = null;
        return;
      }
      drag.moved = true;
      stopForGood();
      cancelAnimationFrame(rafId);
      stage.setPointerCapture(drag.id);
      stage.classList.add('is-dragging');
    }
    const dt = Math.max(1, e.timeStamp - drag.lastT);
    drag.v = (e.clientX - drag.lastX) / dt; // px/мс
    drag.lastX = e.clientX;
    drag.lastT = e.timeStamp;
    pos = drag.pos0 - dx / stepPx;
    layout();
  });
  const endDrag = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    stage.classList.remove('is-dragging');
    if (d.moved) {
      // Доводка до ближайшей карточки с учётом скорости жеста
      const throwBy = clamp((-d.v * 180) / stepPx, -1.5, 1.5);
      animateTo(Math.round(pos + throwBy), USER_MOVE, easeOut);
    } else if (d.card && e.type === 'pointerup') {
      const i = Number(d.card.dataset.arcCard);
      if (i !== mod(Math.round(pos))) {
        stopForGood();
        goTo(i);
      }
    }
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('dragstart', (e) => e.preventDefault());

  // ── Точки и клавиатура ──
  dots.forEach((dot) =>
    dot.addEventListener('click', () => {
      stopForGood();
      goTo(Number(dot.dataset.arcDot));
    }),
  );
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (e.target.closest('a, input, textarea, select')) return;
    e.preventDefault();
    stopForGood();
    shift(e.key === 'ArrowRight' ? 1 : -1);
  });

  // ── Паузы ──
  root.addEventListener('mouseenter', () => {
    hovering = true;
    clearTimeout(autoTimer);
  });
  root.addEventListener('mouseleave', () => {
    hovering = false;
    scheduleAuto(1200);
  });
  root.addEventListener('focusin', () => {
    hovering = true;
    clearTimeout(autoTimer);
  });
  root.addEventListener('focusout', (e) => {
    if (root.contains(e.relatedTarget)) return;
    hovering = false;
    scheduleAuto(1200);
  });
  document.addEventListener('visibilitychange', () => scheduleAuto(1200));
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) scheduleAuto(1200);
      else clearTimeout(autoTimer);
    }).observe(root);
  }
  window.addEventListener('resize', layout);
  reduceQuery.addEventListener('change', (e) => {
    reduce = e.matches;
    cancelAnimationFrame(rafId);
    pos = Math.round(pos);
    layout();
    scheduleAuto();
  });

  // ── Старт: карусель въезжает и докручивается до первой карточки, дальше листается сама ──
  if (reduce) {
    layout();
    stage.classList.add('is-ready');
    return;
  }
  pos = -1.6;
  layout();
  stage.classList.add('is-ready');
  stage.animate(
    [
      { opacity: 0, transform: 'translateY(48px)' },
      { opacity: 1, transform: 'none' },
    ],
    { duration: 900, delay: 150, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' },
  );
  animateTo(0, 1700, easeOut, () => {
    introDone = true;
    scheduleAuto(1400);
  });
}
