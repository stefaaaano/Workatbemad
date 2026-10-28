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

// Suivi des contacts dans Google Analytics : clics sur le téléphone et l'e-mail
(function () {
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="tel:"], a[href^="mailto:"]');
    if (!link || typeof gtag !== 'function') return;
    var type = link.getAttribute('href').indexOf('tel:') === 0 ? 'telephone' : 'email';
    gtag('event', 'contact', {
      methode: type,
      emplacement: link.closest('footer') ? 'pied_de_page' : 'bandeau'
    });
  });
})();

// Bouton de contact flottant : apparait apres le premier ecran, disparait sur le pied de page
(function () {
  var btn = document.querySelector('.floating-contact');
  var footer = document.getElementById('contact');
  if (!btn || !footer) return;

  var footerVisible = false;

  function update() {
    var passeLePremierEcran = window.scrollY > window.innerHeight * 0.6;
    btn.classList.toggle('is-visible', passeLePremierEcran && !footerVisible);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      footerVisible = entries[0].isIntersecting;
      update();
    }, { rootMargin: '0px 0px -40% 0px' }).observe(footer);
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
