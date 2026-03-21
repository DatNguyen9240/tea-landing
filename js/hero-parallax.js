/* ==================== DECORATIVE LEAVES + PARALLAX ==================== */
(() => {
  'use strict';

  /* ---------- DECORATIVE LEAF LAYER (between sky and hills) ---------- */
  const leavesContainer = document.getElementById('leavesContainer');
  const leafSrc = 'images/leaf.webp';
  const LEAF_COUNT = window.matchMedia('(max-width: 767px)').matches ? 5 : 8;

  // 3 depth sub-layers: back (smaller), mid, front (biggest, sharp)
  // Using opacity for depth illusion (much cheaper than CSS blur filter)
  const depthLayers = [
    { sizeMin: 55, sizeMax: 95, opacityMin: 0.3, opacityMax: 0.5, yMin: 5, yMax: 65 },
    { sizeMin: 75, sizeMax: 125, opacityMin: 0.45, opacityMax: 0.7, yMin: 10, yMax: 70 },
    { sizeMin: 105, sizeMax: 170, opacityMin: 0.65, opacityMax: 0.9, yMin: 8, yMax: 75 },
  ];

  function createLeaf(index) {
    const leaf = document.createElement('div');
    leaf.className = 'floating-leaf';
    const img = document.createElement('img');
    img.src = leafSrc;
    img.alt = '';
    img.loading = 'lazy';
    leaf.appendChild(img);

    const layer = depthLayers[index % depthLayers.length];
    const size = layer.sizeMin + Math.random() * (layer.sizeMax - layer.sizeMin);
    const posX = (index / LEAF_COUNT) * 110 - 5 + (Math.random() * 8 - 4);
    const posYPercent = layer.yMin + Math.random() * (layer.yMax - layer.yMin);
    const rotation = Math.random() * 160 - 80;
    const opacity = layer.opacityMin + Math.random() * (layer.opacityMax - layer.opacityMin);
    const swayDuration = 4 + Math.random() * 5;
    const swayDelay = Math.random() * 4;
    const swayAmount = 5 + Math.random() * 10;
    const rotSway = 3 + Math.random() * 8;

    leaf.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${posX}%;
      top: ${posYPercent}%;
      opacity: ${opacity};
      transform: rotate(${rotation}deg) translateZ(0);
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
      0%   { transform: rotate(var(--base-rot)) translateY(0) translateX(0) translateZ(0); }
      100% { transform: rotate(calc(var(--base-rot) + var(--rot-sway))) translateY(var(--sway)) translateX(calc(var(--sway) * 0.6)) translateZ(0); }
    }
  `;
  document.head.appendChild(leafStyles);

  for (let i = 0; i < LEAF_COUNT; i++) createLeaf(i);

  /* ---------- PAUSE LEAF ANIMATIONS WHEN HERO IS OFF-SCREEN ---------- */
  const heroSection = document.querySelector('.hero');
  if (heroSection && leavesContainer) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        // Pause all leaf CSS animations when hero is not visible
        leavesContainer.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
        // Also pause each leaf's individual animation
        const state = entry.isIntersecting ? 'running' : 'paused';
        const leaves = leavesContainer.querySelectorAll('.floating-leaf');
        leaves.forEach(leaf => { leaf.style.animationPlayState = state; });
      },
      { threshold: 0 }
    );
    heroObserver.observe(heroSection);
  }

  /* ---------- 3-LAYER PARALLAX SCROLLING (rAF throttled) ---------- */
  const heroSky = document.querySelector('.hero-sky-img');
  const heroHills = document.querySelector('.hero-hills-img');
  const heroText = document.querySelector('.hero-text');
  const heroSlider = document.querySelector('.hero-slider');

  let ticking = false;

  let heroHeight = 900;
  requestAnimationFrame(() => {
    heroHeight = heroSection?.offsetHeight || window.innerHeight;
  });
  window.addEventListener('resize', () => {
    heroHeight = heroSection?.offsetHeight || window.innerHeight;
  }, { passive: true });

  function handleParallax() {
    const scrollY = window.scrollY;

    // Early exit: don't compute if scrolled past hero
    if (scrollY > heroHeight) {
      ticking = false;
      return;
    }

    // Layer 1: Sky moves slowest (distant)
    if (heroSky) {
      heroSky.style.transform = `scale(1.15) translateY(${scrollY * 0.12}px) translateZ(0)`;
    }

    // Layer 2: Leaves scroll down inside hero
    if (leavesContainer) {
      leavesContainer.style.transform = `translateY(${scrollY * 0.7}px) translateZ(0)`;
    }

    // Layer 3: Hills barely move (grounded foreground)
    if (heroHills) {
      heroHills.style.transform = `scale(1.05) translateY(${scrollY * 0.05}px) translateZ(0)`;
    }

    // Content moves up slightly as you scroll
    if (heroText) {
      heroText.style.transform = `translateY(${scrollY * 0.15}px) translateZ(0)`;
    }
    if (heroSlider) {
      heroSlider.style.transform = `translateY(${scrollY * 0.1}px) translateZ(0)`;
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(handleParallax);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Init — deferred to avoid forced reflow
  requestAnimationFrame(handleParallax);
})();
