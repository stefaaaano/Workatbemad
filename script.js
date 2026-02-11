// script.js (sostituisci tutto con questo)

(function(){
  const slides = Array.from(document.querySelectorAll('.hero__slide'));
  if (!slides.length) return;

  const prevNext = Array.from(document.querySelectorAll('.hero__btn'));
  let i = slides.findIndex(s => s.classList.contains('is-active'));
  if (i < 0) i = 0;

  const setActive = (nextIndex) => {
    slides[i].classList.remove('is-active');
    i = (nextIndex + slides.length) % slides.length;
    slides[i].classList.add('is-active');
  };

  const step = (dir = 1) => setActive(i + dir);

  // autoplay
  const INTERVAL = 4500;
  let t = setInterval(() => step(1), INTERVAL);

  // manual controls
  prevNext.forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = Number(btn.dataset.dir || 1);
      step(dir);
      clearInterval(t);
      t = setInterval(() => step(1), INTERVAL);
    });
  });

  // pause on hover (desktop)
  const hero = document.querySelector('.hero');
  if (hero){
    hero.addEventListener('mouseenter', () => clearInterval(t));
    hero.addEventListener('mouseleave', () => {
      clearInterval(t);
      t = setInterval(() => step(1), INTERVAL);
    });
  }

  // respect reduced motion
  const rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rm){
    clearInterval(t);
  }
})();
(function(){
  const track = document.querySelector('[data-strip-track]');
  const prev = document.querySelector('[data-strip-prev]');
  const next = document.querySelector('[data-strip-next]');
  if (!track || !prev || !next) return;

  const step = () => {
    // larghezza di una “card” = primo elemento visibile
    const item = track.querySelector('.strip__item');
    if (!item) return 0;
    const styles = getComputedStyle(item);
    const w = item.getBoundingClientRect().width;
    const borderR = parseFloat(styles.borderRightWidth) || 0;
    return w + borderR;
  };

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -step(), behavior: 'smooth' });
  });

  next.addEventListener('click', () => {
    track.scrollBy({ left: step(), behavior: 'smooth' });
  });
})();
