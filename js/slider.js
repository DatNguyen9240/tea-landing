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
      headline: 'DI SẢN CỦA<br>LÁ XANH',
      description: 'Hái tay từ vùng cao sương mù, trà thủ công của chúng tôi lưu giữ tinh hoa thiên nhiên — tinh khiết, nguyên bản, và được chế tác qua hàng thế kỷ truyền thống.',
      cta: 'Khám Phá Bộ Sưu Tập'
    },
    {
      headline: 'NGHỆ THUẬT<br>MATCHA',
      description: 'Xay đá từ lá tencha trồng trong bóng râm tại Uji, Nhật Bản. Truyền thống hàng thế kỷ mang đến vị umami đậm đà và năng lượng rực rỡ.',
      cta: 'Khám Phá Matcha'
    },
    {
      headline: 'Ô LONG<br>VÀNG',
      description: 'Bán oxy hóa và cuộn tay trong vườn trà cổ Phúc Kiến. Từng tầng hương mật ong, lan, và ngọt nướng lan tỏa trong từng lần pha.',
      cta: 'Trải Nghiệm Ô Long'
    },
    {
      headline: 'BẠCH<br>KIM CHÂM',
      description: 'Trà trắng quý hiếm nhất — chỉ những búp non tinh túy, thu hoạch mỗi năm một lần vào lúc bình minh. Mịn như lụa, ngọt dưa, thuần khiết tuyệt đối.',
      cta: 'Thưởng Thức Cao Cấp'
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

  // Init — deferred to avoid forced reflow from offsetWidth reads
  requestAnimationFrame(() => updateSlider(0));
})();
