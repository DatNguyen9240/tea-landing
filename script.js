/* ==================== PREMIUM TEA — 3 LAYER PARALLAX ==================== */
(() => {
  'use strict';

  /* ---------- NAVBAR ---------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

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

  /* ---------- DECORATIVE LEAF LAYER (between sky and hills) ---------- */
  const leavesContainer = document.getElementById('leavesContainer');
  const leafSrc = 'images/leaf.png';
  const LEAF_COUNT = window.innerWidth < 768 ? 14 : 28;

  // 3 depth sub-layers: back (smaller, blurry), mid, front (biggest, sharp)
  const depthLayers = [
    { sizeMin: 60,  sizeMax: 100, opacityMin: 0.2,  opacityMax: 0.4,  blur: 2.5, yMin: 5,  yMax: 65 },
    { sizeMin: 80,  sizeMax: 130, opacityMin: 0.35, opacityMax: 0.6,  blur: 1,   yMin: 10, yMax: 70 },
    { sizeMin: 110, sizeMax: 180, opacityMin: 0.55, opacityMax: 0.85, blur: 0,   yMin: 8,  yMax: 75 },
  ];

  function createLeaf(index) {
    const leaf = document.createElement('div');
    leaf.className = 'floating-leaf';
    const img = document.createElement('img');
    img.src = leafSrc;
    img.alt = '';
    leaf.appendChild(img);

    const layer = depthLayers[index % depthLayers.length];
    const size = layer.sizeMin + Math.random() * (layer.sizeMax - layer.sizeMin);
    const posX = (index / LEAF_COUNT) * 110 - 5 + (Math.random() * 8 - 4);
    const posYPercent = layer.yMin + Math.random() * (layer.yMax - layer.yMin);
    const rotation = Math.random() * 160 - 80;
    const opacity = layer.opacityMin + Math.random() * (layer.opacityMax - layer.opacityMin);
    const swayDuration = 3 + Math.random() * 5;
    const swayDelay = Math.random() * 4;
    const swayAmount = 5 + Math.random() * 12;
    const rotSway = 4 + Math.random() * 12;

    leaf.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${posX}%;
      top: ${posYPercent}%;
      opacity: ${opacity};
      transform: rotate(${rotation}deg);
      filter: blur(${layer.blur}px) drop-shadow(0 2px 8px rgba(0,0,0,0.12));
      --sway: ${swayAmount}px;
      --rot-sway: ${rotSway}deg;
      --base-rot: ${rotation}deg;
      animation: leafSway ${swayDuration}s ${swayDelay}s ease-in-out infinite alternate;
    `;

    leavesContainer.appendChild(leaf);
    return leaf;
  }

  // Inject leaf sway keyframes
  const leafStyles = document.createElement('style');
  leafStyles.textContent = `
    @keyframes leafSway {
      0%   { transform: rotate(var(--base-rot)) translateY(0) translateX(0); }
      100% { transform: rotate(calc(var(--base-rot) + var(--rot-sway))) translateY(var(--sway)) translateX(calc(var(--sway) * 0.6)); }
    }
  `;
  document.head.appendChild(leafStyles);

  for (let i = 0; i < LEAF_COUNT; i++) createLeaf(i);

  /* ---------- 3-LAYER PARALLAX SCROLLING ---------- */
  const heroSky = document.querySelector('.hero-sky-img');
  const heroHills = document.querySelector('.hero-hills-img');
  const heroText = document.querySelector('.hero-text');
  const heroSlider = document.querySelector('.hero-slider');
  const heroOverlay = document.querySelector('.hero-overlay');

  function handleParallax() {
    const scrollY = window.scrollY;
    const heroEl = document.querySelector('.hero');
    const heroHeight = heroEl?.offsetHeight || window.innerHeight;
    const ratio = Math.min(scrollY / heroHeight, 1);

    // Calculate max leaf travel: stop at top of the story section
    const storySection = document.getElementById('story');
    const maxLeafTravel = storySection
      ? storySection.offsetTop - heroHeight * 0.5
      : heroHeight;

    // Layer 1: Sky moves slowest (distant)
    if (heroSky) {
      heroSky.style.transform = `scale(1.15) translateY(${scrollY * 0.12}px)`;
    }

    // Layer 2: Leaves scroll down inside hero — hills (z-12) cover them naturally
    if (leavesContainer) {
      leavesContainer.style.transform = `translateY(${scrollY * 0.7}px)`;
    }

    // Layer 3: Hills barely move (grounded foreground)
    if (heroHills) {
      heroHills.style.transform = `scale(1.05) translateY(${scrollY * 0.05}px)`;
    }

    // Content fades out as you scroll
    if (heroText) {
      heroText.style.transform = `translateY(${scrollY * 0.15}px)`;
      heroText.style.opacity = 1 - ratio * 1.3;
    }
    if (heroSlider) {
      heroSlider.style.transform = `translateY(${scrollY * 0.1}px)`;
      heroSlider.style.opacity = 1 - ratio * 1.2;
    }
    if (heroOverlay) {
      heroOverlay.style.opacity = Math.min(0.5 + ratio * 0.5, 1);
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  /* ---------- HERO PRODUCT SLIDER ---------- */
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

  /* ---------- SCROLL REVEAL ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

  /* ---------- ORIGIN PARALLAX ---------- */
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

  /* ---------- CTA FORM ---------- */
  const ctaForm = document.getElementById('ctaForm');
  ctaForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = ctaForm.querySelector('.btn-primary');
    const input = ctaForm.querySelector('input');
    btn.textContent = 'Subscribed ✓';
    btn.style.background = 'linear-gradient(135deg, #2d6a2d, #4a7c4a)';
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
    }, 3000);
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

  /* ---------- INIT ---------- */
  updateSlider(0);
  handleParallax();

})();
