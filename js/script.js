// THE POST OFFICE - carrousel de la page d'accueil
(function () {
  var carousel = document.getElementById('carousel');
  if (!carousel) return;

  var slides = carousel.querySelectorAll('.slide');
  var dotsWrap = carousel.querySelector('.carousel-dots');
  var prevBtn = carousel.querySelector('.carousel-arrow.prev');
  var nextBtn = carousel.querySelector('.carousel-arrow.next');
  var current = 0;
  var timer = null;
  var DELAY = 5000;

  // Crée un point par photo
  var dots = [];
  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Afficher la photo ' + (i + 1));
    dot.addEventListener('click', function () {
      goTo(i);
      restart();
    });
    dotsWrap.appendChild(dot);
    dots.push(dot);
  });

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, DELAY);
  }

  prevBtn.addEventListener('click', function () { goTo(current - 1); restart(); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); restart(); });

  // Pause au survol
  carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
  carousel.addEventListener('mouseleave', restart);

  dots[0].classList.add('is-active');
  restart();
})();
