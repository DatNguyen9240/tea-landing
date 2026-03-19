/* ==================== HERO PRODUCT SLIDER ==================== */
(() => {
  'use strict';

  const sliderTrack = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.slide-card');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');
  const dots = dotsContainer?.querySelectorAll('.dot');
  const heroHeadline = document.getElementById('heroHeadline');
  const heroDescription = document.getElementById('heroDescription');
  const heroCta = document.getElementById('heroCta');

  const teaData = [
    {
      headline: 'LEGACY OF THE<br>GREEN LEAF',
      description: 'Handpicked from mist-laden highlands, our artisan teas capture the essence of nature — pure, untouched, and crafted with centuries of tradition.',
      cta: 'Explore Collection'
    },
    {
      headline: 'THE ART OF<br>MATCHA',
      description: 'Stone-ground from shade-grown tencha leaves in Uji, Japan. A centuries-old tradition delivering unmatched umami and vibrant energy.',
      cta: 'Discover Matcha'
    },
    {
      headline: 'GOLDEN<br>OOLONG',
      description: 'Semi-oxidized and hand-rolled in Fujian\'s ancient gardens. Complex layers of honey, orchid, and toasted sweetness unfold in every infusion.',
      cta: 'Experience Oolong'
    },
    {
      headline: 'SILVER<br>NEEDLE',
      description: 'The rarest of white teas — only the finest buds, harvested once a year at dawn. Silk-like texture, melon sweetness, pure elegance.',
      cta: 'Taste Luxury'
    }
  ];

  let currentSlide = 0;
  let isAnimating = false;

  function updateSlider(index) {
    if (isAnimating) return;
    isAnimating = true;

    slides.forEach((s, i) => s.classList.toggle('active', i === index));

    const slideWidth = slides[0]?.offsetWidth || 200;
    const gap = 20;
    const wrapperWidth = document.getElementById('sliderWrapper')?.offsetWidth || 400;
    const offset = index * (slideWidth + gap) - (wrapperWidth / 2 - slideWidth / 2 - 10);
    sliderTrack.style.transform = `translateX(${-Math.max(0, offset)}px)`;

    dots?.forEach((d, i) => d.classList.toggle('active', i === index));

    if (heroHeadline && teaData[index]) {
      heroHeadline.style.opacity = 0;
      heroHeadline.style.transform = 'translateY(15px)';
      heroDescription.style.opacity = 0;
      heroDescription.style.transform = 'translateY(10px)';

      setTimeout(() => {
        heroHeadline.innerHTML = teaData[index].headline;
        heroDescription.textContent = teaData[index].description;
        if (heroCta) heroCta.textContent = teaData[index].cta;

        heroHeadline.style.opacity = 1;
        heroHeadline.style.transform = 'translateY(0)';
        setTimeout(() => {
          heroDescription.style.opacity = 1;
          heroDescription.style.transform = 'translateY(0)';
        }, 100);
      }, 300);
    }

    setTimeout(() => { isAnimating = false; }, 600);
    currentSlide = index;
  }

  prevBtn?.addEventListener('click', () => updateSlider((currentSlide - 1 + slides.length) % slides.length));
  nextBtn?.addEventListener('click', () => updateSlider((currentSlide + 1) % slides.length));
  dots?.forEach((dot, i) => dot.addEventListener('click', () => updateSlider(i)));
  slides.forEach((slide, i) => slide.addEventListener('click', () => updateSlider(i)));

  if (heroHeadline) {
    heroHeadline.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    heroDescription.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  }

  // Auto-advance
  let autoSlideInterval = setInterval(() => {
    updateSlider((currentSlide + 1) % slides.length);
  }, 5000);

  document.querySelector('.hero-slider')?.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
  document.querySelector('.hero-slider')?.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => {
      updateSlider((currentSlide + 1) % slides.length);
    }, 5000);
  });

  /* ---------- TOUCH SWIPE ---------- */
  let touchStartX = 0;
  const sliderWrapper = document.getElementById('sliderWrapper');
  sliderWrapper?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  sliderWrapper?.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) updateSlider((currentSlide + 1) % slides.length);
      else updateSlider((currentSlide - 1 + slides.length) % slides.length);
    }
  }, { passive: true });

  // Init
  updateSlider(0);
})();
