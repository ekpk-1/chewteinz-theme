/*
 * ChewTeinz theme interactions.
 * Mirrors prototype/scripts/prototype.js for the redesigned theme.
 *
 *   - Sticky header — adds .is-scrolled past 8px
 *   - Mobile menu toggle (driven by [data-menu-toggle] + #mobile-menu)
 *   - Reveal-on-scroll (.reveal -> .is-in via IntersectionObserver)
 *   - Flavour swatches single-select within a .swatches group
 *
 * Cart drawer + modals are handled by the existing assets/cart.js and
 * assets/modals.js respectively. Don't duplicate that logic here.
 */
(function () {
  'use strict';

  // -------------------------------------------------------------- //
  // Sticky header                                                  //
  // -------------------------------------------------------------- //
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // -------------------------------------------------------------- //
  // Mobile menu                                                    //
  // -------------------------------------------------------------- //
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('is-open');
      mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      var useEl = menuToggle.querySelector('use');
      if (useEl) useEl.setAttribute('href', open ? '#i-x' : '#i-menu');
    });
    Array.prototype.forEach.call(mobileMenu.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        var useEl = menuToggle.querySelector('use');
        if (useEl) useEl.setAttribute('href', '#i-menu');
      });
    });
  }

  // -------------------------------------------------------------- //
  // Flavour swatches                                               //
  // -------------------------------------------------------------- //
  Array.prototype.forEach.call(document.querySelectorAll('.swatches'), function (group) {
    group.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.swatch');
      if (!btn) return;
      Array.prototype.forEach.call(group.querySelectorAll('.swatch'), function (s) {
        s.classList.remove('is-active');
        s.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
    });
  });

  // -------------------------------------------------------------- //
  // Reveal on scroll                                               //
  // -------------------------------------------------------------- //
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -80px 0px' }
    );
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  }
})();
