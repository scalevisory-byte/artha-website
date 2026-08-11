/* =========================================================
   ARTHA — interactions
   ========================================================= */
(function () {
  'use strict';
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 24) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    // Stagger items that share a grid parent
    var staggerParents = document.querySelectorAll('.value-grid, .service-grid, .industry-grid, .why-grid, .problem-list, .faq-list');
    staggerParents.forEach(function (parent) {
      var kids = parent.querySelectorAll('.reveal, li');
      kids.forEach(function (kid, i) { kid.style.setProperty('--d', (Math.min(i, 8) * 0.06) + 's'); });
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Progress bar + value ---------- */
  var progressFills = document.querySelectorAll('.progress-fill');
  var progressVals = document.querySelectorAll('.case-progress-val');

  function animateProgressVal(el) {
    var target = parseInt(el.dataset.progress, 10) || 0;
    if (prefersReduced) { el.textContent = target + '%'; return; }
    var start = null, duration = 1400;
    function tick(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + '%';
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function runProgress(scope) {
    scope.querySelectorAll('.progress-fill').forEach(function (f) { f.classList.add('animate'); });
    scope.querySelectorAll('.case-progress-val').forEach(function (v) { animateProgressVal(v); });
  }

  if (progressFills.length || progressVals.length) {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.case-card').forEach(runProgress);
    } else {
      var progObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runProgress(entry.target);
            progObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      document.querySelectorAll('.case-card').forEach(function (c) { progObserver.observe(c); });
    }
  }

  /* ---------- Cash-flow line draw ---------- */
  var cfLine = document.querySelector('.cf-line');
  if (cfLine) {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      cfLine.classList.add('draw');
    } else {
      var cfObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            cfLine.classList.add('draw');
            cfObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      cfObserver.observe(cfLine);
    }
  }

  /* ---------- Scroll progress bar ---------- */
  var progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    var ticking = false;
    var updateBar = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop || window.scrollY) / max * 100 : 0;
      progressBar.style.width = pct + '%';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(updateBar); ticking = true; }
    }, { passive: true });
    updateBar();
  }

  /* ---------- Hero case-card 3D tilt (desktop pointers only) ---------- */
  var tiltHost = document.querySelector('.hero-anim-card');
  var tiltCard = tiltHost ? tiltHost.querySelector('.case-card') : null;
  if (tiltHost && tiltCard && !prefersReduced && window.matchMedia('(pointer:fine)').matches) {
    var MAX = 5;
    tiltHost.addEventListener('mousemove', function (e) {
      var r = tiltHost.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      tiltHost.classList.add('tilting');
      tiltHost.style.setProperty('--rx', (px * MAX) + 'deg');
      tiltHost.style.setProperty('--ry', (-py * MAX) + 'deg');
    });
    tiltHost.addEventListener('mouseleave', function () {
      tiltHost.classList.remove('tilting');
      tiltHost.style.removeProperty('--rx');
      tiltHost.style.removeProperty('--ry');
    });
  }

  /* ---------- Sequential activation for timelines ---------- */
  var activateEls = document.querySelectorAll('.stage-timeline, .journey-map');
  if (activateEls.length) {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      activateEls.forEach(function (el) { el.classList.add('activate'); });
    } else {
      var actObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('activate');
            actObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      activateEls.forEach(function (el) { actObserver.observe(el); });
    }
  }

  /* ---------- Nav scroll-spy ---------- */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav a[href^="#"]'));
  var spySections = spyLinks.map(function (a) {
    var id = a.getAttribute('href').slice(1);
    return document.getElementById(id);
  });
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = spySections.indexOf(entry.target);
          if (idx > -1) {
            spyLinks.forEach(function (l) { l.classList.remove('active'); });
            spyLinks[idx].classList.add('active');
          }
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spySections.forEach(function (s) { if (s) spyObserver.observe(s); });
  }

  /* ---------- FAQ: single-open accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- Case form -> WhatsApp handoff ---------- */
  var caseForm = document.getElementById('caseForm');
  if (caseForm) {
    caseForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var get = function (n) {
        var f = caseForm.elements[n];
        return f ? String(f.value || '').trim() : '';
      };

      // Minimal required validation (name + phone)
      var name = get('name');
      var phone = get('phone');
      var firstInvalid = null;
      [['name', name], ['phone', phone]].forEach(function (pair) {
        var field = caseForm.elements[pair[0]];
        if (field) {
          if (!pair[1]) {
            field.setAttribute('aria-invalid', 'true');
            if (!firstInvalid) firstInvalid = field;
          } else {
            field.removeAttribute('aria-invalid');
          }
        }
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      var lines = [
        'New recovery case enquiry — ARTHA',
        '',
        'Name: ' + name,
        get('company') ? 'Company: ' + get('company') : null,
        'Phone: ' + phone,
        get('email') ? 'Email: ' + get('email') : null,
        get('amount') ? 'Outstanding amount: ₹' + get('amount') : null,
        get('overdue') ? 'Days overdue: ' + get('overdue') : null,
        get('type') ? 'Receivable type: ' + get('type') : null,
        get('debtor') ? 'Customer / debtor: ' + get('debtor') : null,
        get('description') ? 'Details: ' + get('description') : null
      ].filter(Boolean);

      var message = encodeURIComponent(lines.join('\n'));
      window.open('https://wa.me/919909993565?text=' + message, '_blank', 'noopener');
    });

    // Clear invalid state as the user types
    caseForm.querySelectorAll('input, textarea, select').forEach(function (el) {
      el.addEventListener('input', function () { el.removeAttribute('aria-invalid'); });
    });
  }
})();
