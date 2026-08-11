// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Animated trust-strip counters (respects reduced motion)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const counters = document.querySelectorAll('.trust-num');

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10) || 0;
  const suffix = el.dataset.suffix || '';
  if (prefersReducedMotion) {
    el.textContent = target + suffix;
    return;
  }
  const duration = 900;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(target * progress);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => observer.observe(el));

// Case form -> WhatsApp handoff
const caseForm = document.getElementById('caseForm');
if (caseForm) {
  caseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(caseForm);
    const name = (data.get('name') || '').toString().trim();
    const company = (data.get('company') || '').toString().trim();
    const amount = (data.get('amount') || '').toString().trim();
    const phone = (data.get('phone') || '').toString().trim();

    const lines = [
      'New recovery case enquiry:',
      `Name: ${name}`,
      company ? `Company: ${company}` : null,
      amount ? `Amount outstanding: ₹${amount}` : null,
      `Phone: ${phone}`
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/919909993565?text=${message}`, '_blank', 'noopener');
  });
}
