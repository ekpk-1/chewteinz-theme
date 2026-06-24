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

  // -------------------------------------------------------------- //
  // Homepage waitlist signup                                       //
  // -------------------------------------------------------------- //
  document.addEventListener('submit', function (e) {
    var form = e.target.closest && e.target.closest('[data-waitlist-form]');
    if (!form) return;
    e.preventDefault();

    var input = form.querySelector('input[type="email"]');
    var errorEl = form.parentNode.querySelector('[data-waitlist-error]');
    var successEl = form.parentNode.querySelector('[data-waitlist-success]');
    var button = form.querySelector('button[type="submit"]');
    var email = input ? input.value.trim() : '';
    var settings = window.chewteinzSettings || {};
    var listId = settings.klaviyoSubscribeListId;
    var source = form.getAttribute('data-source') || 'Homepage waitlist';

    function showError(message) {
      if (successEl) successEl.hidden = true;
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.hidden = false;
      }
      if (button) {
        button.disabled = false;
        button.textContent = button.getAttribute('data-label') || 'Notify me';
      }
    }

    if (errorEl) errorEl.hidden = true;
    if (successEl) successEl.hidden = true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    if (!listId) {
      showError('Email signup is not configured yet.');
      return;
    }

    if (button) {
      button.setAttribute('data-label', button.textContent);
      button.disabled = true;
      button.textContent = 'Joining...';
    }

    var formBody =
      'g=' + encodeURIComponent(listId) +
      '&email=' + encodeURIComponent(email.toLowerCase()) +
      '&$source=' + encodeURIComponent(source);

    fetch('https://manage.kmail-lists.com/ajax/subscriptions/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to subscribe');
        form.reset();
        form.hidden = true;
        if (successEl) successEl.hidden = false;
      })
      .catch(function (err) {
        showError(err.message || 'Something went wrong. Please try again.');
      });
  });
})();
