/* ==================== ORIGIN PARALLAX ==================== */
(() => {
  'use strict';

  const originBg = document.querySelector('.origin-bg img');
  if (originBg) {
    window.addEventListener('scroll', () => {
      const section = document.querySelector('.origin-section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        originBg.style.transform = `scale(1.15) translateY(${progress * 60 - 30}px)`;
      }
    }, { passive: true });
  }
})();
