/* ============================================
   CHAD BITES - NAVIGATION JS
   Hamburger menu, scroll behavior, component loader
   ============================================ */

(function() {
  'use strict';

  // --- Load shared components (nav + footer) ---
  function loadComponent(id, url) {
    var el = document.getElementById(id);
    if (!el) return Promise.resolve();
    return fetch(url)
      .then(function(r) { return r.text(); })
      .then(function(html) {
        el.innerHTML = html;
      })
      .catch(function() {
        console.warn('Could not load component:', url);
      });
  }

  function initNav() {
    var hamburger = document.getElementById('hamburger-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function() {
      var isOpen = mobileMenu.classList.toggle('is-open');
      hamburger.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    var links = mobileMenu.querySelectorAll('a');
    links.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });

    // Header scroll effect
    var header = document.getElementById('site-header');
    if (header) {
      var lastScroll = 0;
      window.addEventListener('scroll', function() {
        var currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
          header.style.background = 'rgba(10, 11, 20, 0.95)';
        } else {
          header.style.background = 'rgba(10, 11, 20, 0.8)';
        }
        lastScroll = currentScroll;
      }, { passive: true });
    }
  }

  // --- Scroll animations ---
  function initScrollAnimations() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-in').forEach(function(el) {
      observer.observe(el);
    });
  }

  // --- Gauge animations ---
  function initGauges() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var fills = entry.target.querySelectorAll('[data-target]');
          fills.forEach(function(fill, i) {
            setTimeout(function() {
              var target = fill.getAttribute('data-target');
              var circumference = fill.getAttribute('data-circumference') || '534';
              fill.style.strokeDasharray = target + ', ' + circumference;
            }, i * 120);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.hero-gauge-ring, .stats-scroll').forEach(function(el) {
      observer.observe(el);
    });
  }

  // --- FAQ accordion ---
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var item = btn.closest('.faq-item');
        var wasOpen = item.classList.contains('is-open');

        // Close all
        document.querySelectorAll('.faq-item.is-open').forEach(function(openItem) {
          openItem.classList.remove('is-open');
        });

        // Toggle clicked
        if (!wasOpen) {
          item.classList.add('is-open');
        }
      });
    });
  }

  // --- Initialize ---
  document.addEventListener('DOMContentLoaded', function() {
    var navContainer = document.getElementById('nav-component');
    var footerContainer = document.getElementById('footer-component');

    var promises = [];
    if (navContainer) promises.push(loadComponent('nav-component', 'shared/nav.html'));
    if (footerContainer) promises.push(loadComponent('footer-component', 'shared/footer.html'));

    if (promises.length > 0) {
      Promise.all(promises).then(function() {
        initNav();
        initScrollAnimations();
        initGauges();
        initFAQ();
      });
    } else {
      initNav();
      initScrollAnimations();
      initGauges();
      initFAQ();
    }
  });
})();
