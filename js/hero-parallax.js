/* ==================== DECORATIVE LEAVES + PARALLAX ==================== */
(() => {
  'use strict';

  /* ---------- DECORATIVE LEAF LAYER (between sky and hills) ---------- */
  const leavesContainer = document.getElementById('leavesContainer');
  const leafSrc = 'images/leaf.png';
  const LEAF_COUNT = window.innerWidth < 768 ? 14 : 28;

  // 3 depth sub-layers: back (smaller, blurry), mid, front (biggest, sharp)
  const depthLayers = [
    { sizeMin: 60, sizeMax: 100, opacityMin: 0.2, opacityMax: 0.4, blur: 2.5, yMin: 5, yMax: 65 },
    { sizeMin: 80, sizeMax: 130, opacityMin: 0.35, opacityMax: 0.6, blur: 1, yMin: 10, yMax: 70 },
    { sizeMin: 110, sizeMax: 180, opacityMin: 0.55, opacityMax: 0.85, blur: 0, yMin: 8, yMax: 75 },
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

    // Layer 1: Sky moves slowest (distant)
    if (heroSky) {
      heroSky.style.transform = `scale(1.15) translateY(${scrollY * 0.12}px)`;
    }

    // Layer 2: Leaves scroll down inside hero
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

  // Init
  handleParallax();
})();
