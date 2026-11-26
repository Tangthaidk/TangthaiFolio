// Shared script for project case-study pages.

// ── MISSING IMAGE PLACEHOLDERS ───────────────────────────
// Any project image whose file doesn't exist yet becomes a striped box
// that shows the file path it expects. Add the file and it appears.
document
  .querySelectorAll('.gallery-item img, .iphone-frame img, .instruction-step img')
  .forEach(img => {
    const showPlaceholder = () => {
      const box = document.createElement('div');
      box.className = 'img-placeholder';
      box.textContent = 'Add image: ' + img.getAttribute('src');
      img.replaceWith(box);
    };
    if (img.complete && img.naturalWidth === 0) showPlaceholder();
    else img.addEventListener('error', showPlaceholder);
  });

// ── CAROUSEL (only on pages that have one) ───────────────
if (document.getElementById('carouselTrack')) {
  // ── CAROUSEL ──────────────────────────────────────────
  const track    = document.getElementById('carouselTrack');
  const outer    = document.getElementById('carouselOuter');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('carouselDots');
  const counter  = document.getElementById('carouselCounter');
  const slides   = track.querySelectorAll('.iphone-slide');
  const total    = slides.length;
  let current    = 0;
  let startX     = 0;
  let isDragging = false;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Screen ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function getSlideWidth() {
    const slide = slides[0];
    const style = window.getComputedStyle(slide);
    return slide.offsetWidth + parseInt(style.marginRight || 0) + 32; // gap = 32px
  }

  function goTo(n) {
    current = Math.max(0, Math.min(n, total - 1));
    track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    counter.textContent = `${current + 1} / ${total}`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch/mouse swipe
  outer.addEventListener('pointerdown', e => { startX = e.clientX; isDragging = true; outer.setPointerCapture(e.pointerId); });
  outer.addEventListener('pointerup',   e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });
  outer.addEventListener('pointercancel', () => { isDragging = false; });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft')  goTo(current - 1);
  });

  // Init
  goTo(0);

  // Recalc on resize
  window.addEventListener('resize', () => goTo(current));
}
