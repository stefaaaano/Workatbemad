/* The Post Office Workspace — comportements légers, sans dépendance.
   Le contenu reste entièrement lisible si ce fichier ne s'exécute pas. */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supportsIO = 'IntersectionObserver' in window;
  var contact = document.getElementById('contact');
  var bar = document.querySelector('.cta-bar');

  /* ---------- révélation des sections au défilement ---------- */
  var cibles = [].slice.call(document.querySelectorAll('.reveal'));

  function tout_montrer() {
    cibles.forEach(function (el) { el.classList.add('is-visible'); });
  }

  if (reduce || !supportsIO) {
    tout_montrer();
  } else {
    var vue = new IntersectionObserver(function (entrees, obs) {
      entrees.forEach(function (e) {
        // une section plus haute que l'écran n'atteint jamais 15 % : on se rabat
        // alors sur la hauteur réellement visible.
        var assez = e.intersectionRatio >= 0.15 ||
                    e.intersectionRect.height >= window.innerHeight * 0.35;
        if (e.isIntersecting && assez) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: [0, 0.05, 0.15] });

    cibles.forEach(function (el) { vue.observe(el); });

    // filet de sécurité : ce qui est déjà à l'écran au chargement
    window.setTimeout(function () {
      cibles.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add('is-visible'); }
      });
    }, 1200);
  }

  /* ---------- barre de contact ---------- */
  if (bar && contact) {
    // elle s'efface dès que le bloc de contact est à l'écran : elle n'y sert plus.
    if (supportsIO) {
      new IntersectionObserver(function (entrees) {
        entrees.forEach(function (e) {
          bar.classList.toggle('is-hidden', e.isIntersecting);
        });
      }, { threshold: 0, rootMargin: '0px 0px -25% 0px' }).observe(contact);
    }

    // à l'arrivée sur #contact, le focus clavier suit le regard.
    var donner_le_focus = function () {
      try { contact.focus({ preventScroll: true }); } catch (e) { contact.focus(); }
    };

    bar.addEventListener('click', function () {
      if (reduce) { window.setTimeout(donner_le_focus, 0); return; }
      if ('onscrollend' in window) {
        window.addEventListener('scrollend', donner_le_focus, { once: true });
      } else {
        window.setTimeout(donner_le_focus, 700);
      }
    });

    window.addEventListener('hashchange', function () {
      if (location.hash === '#contact') { donner_le_focus(); }
    });
  }
})();
