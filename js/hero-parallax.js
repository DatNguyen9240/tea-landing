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

    leaf.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${posX}%;
      top: ${posYPercent}%;
      opacity: ${opacity};
      transform: rotate(${rotation}deg) translateZ(0);
    `;

    leavesContainer.appendChild(leaf);
    return leaf;
  }

  for (let i = 0; i < LEAF_COUNT; i++) createLeaf(i);


  /* ---------- 3-LAYER PARALLAX SCROLLING (rAF throttled) ---------- */
  const heroSection = document.querySelector('.hero');
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
