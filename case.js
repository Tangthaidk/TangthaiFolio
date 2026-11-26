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

// ── STACKED CAROUSEL (only on pages that have one) ──────
// The active phone sits in the centre. The others fan out to each side,
// smaller and dimmer, and the order wraps around endlessly.
const stage = document.getElementById('carouselStage');
if (stage) {
  const slides   = Array.from(stage.querySelectorAll('.iphone-slide'));
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('carouselDots');
  const counter  = document.getElementById('carouselCounter');
  const total    = slides.length;
  const half     = Math.floor(total / 2);
  let active     = 0;

  // Build dots
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Screen ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function render() {
    const peek = parseFloat(getComputedStyle(stage).getPropertyValue('--peek')) || 130;
    slides.forEach((slide, i) => {
      // Shortest way round, so the ends wrap seamlessly
      let offset = i - active;
      if (offset > half)  offset -= total;
      if (offset < -half) offset += total;
      const dist = Math.abs(offset);

      slide.style.transform = `translateX(${offset * peek}px) scale(${1 - dist * 0.12})`;
      slide.style.zIndex    = total - dist;
      slide.style.filter    = `brightness(${1 - dist * 0.25})`;
      slide.style.opacity   = dist > 2 ? '0' : '1';
      slide.style.pointerEvents = dist > 2 ? 'none' : 'auto';
      slide.classList.toggle('is-active', offset === 0);
      slide.setAttribute('aria-hidden', offset === 0 ? 'false' : 'true');
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === active));
    counter.textContent = `${active + 1} / ${total}`;
  }

  function goTo(n) {
    active = (n + total) % total;
    render();
  }

  prevBtn.addEventListener('click', () => goTo(active - 1));
  nextBtn.addEventListener('click', () => goTo(active + 1));

  // Tap a side phone to bring it to the centre
  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => { if (i !== active) goTo(i); });
  });

  // Swipe or drag (mouse and touch)
  let startX = null;
  stage.addEventListener('pointerdown', e => { startX = e.clientX; });
  window.addEventListener('pointerup', e => {
    if (startX === null) return;
    const diff = e.clientX - startX;
    startX = null;
    if (Math.abs(diff) > 40) goTo(diff < 0 ? active + 1 : active - 1);
  });
  window.addEventListener('pointercancel', () => { startX = null; });

  // Keyboard arrows
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goTo(active + 1);
    if (e.key === 'ArrowLeft')  goTo(active - 1);
  });

  goTo(0);
  window.addEventListener('resize', render);
}
