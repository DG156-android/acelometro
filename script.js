document.addEventListener('DOMContentLoaded', () => {
  const deck = document.getElementById('deck');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('dots');
  const traceFill = document.getElementById('traceFill');

  // build nav dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
    dot.addEventListener('click', () => {
      slides[i].scrollIntoView({ behavior: 'smooth' });
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function setActive(index) {
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    const pct = slides.length > 1 ? (index / (slides.length - 1)) * 100 : 0;
    traceFill.setAttribute('y2', pct.toFixed(2));
  }

  // observe which slide is in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
        const idx = slides.indexOf(entry.target);
        if (idx !== -1) setActive(idx);
      }
    });
  }, { root: deck, threshold: [0.55] });

  slides.forEach((s) => observer.observe(s));

  // keyboard navigation
  let currentIndex = 0;
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      currentIndex = Math.min(currentIndex + 1, slides.length - 1);
      slides[currentIndex].scrollIntoView({ behavior: 'smooth' });
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      currentIndex = Math.max(currentIndex - 1, 0);
      slides[currentIndex].scrollIntoView({ behavior: 'smooth' });
    }
  });

  // keep currentIndex synced with scroll for keyboard nav accuracy
  deck.addEventListener('scroll', () => {
    clearTimeout(deck._scrollTimer);
    deck._scrollTimer = setTimeout(() => {
      let closest = 0;
      let closestDist = Infinity;
      slides.forEach((s, i) => {
        const dist = Math.abs(s.getBoundingClientRect().top);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      currentIndex = closest;
    }, 120);
  });

  setActive(0);
});