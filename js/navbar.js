/* ==================== NAVBAR ==================== */
(() => {
  'use strict';

  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  let isScrolled = false;
  let ticking = false;

  function updateNavbar() {
    const shouldBeScrolled = window.scrollY > 60;
    // Only touch the DOM when state actually changes
    if (shouldBeScrolled !== isScrolled) {
      isScrolled = shouldBeScrolled;
      navbar.classList.toggle('scrolled', isScrolled);
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateNavbar);
    }
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
})();
