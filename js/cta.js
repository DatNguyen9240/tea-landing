/* ==================== CTA FORM ==================== */
(() => {
  'use strict';

  const ctaForm = document.getElementById('ctaForm');
  ctaForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = ctaForm.querySelector('.btn-primary');
    const input = ctaForm.querySelector('input');
    btn.textContent = 'Đã Đăng Ký ✓';
    btn.style.background = 'linear-gradient(135deg, #2d6a2d, #4a7c4a)';
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Đăng Ký';
      btn.style.background = '';
    }, 3000);
  });
})();
