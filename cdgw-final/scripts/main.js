// ===== NAV SCROLL BORDER =====
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ===== MOBILE NAV TOGGLE =====
const toggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      toggle.focus();
    }
  });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===== SCROLL REVEAL =====
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-q').forEach((btn, i) => {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-a');
  if (answer && !answer.id) answer.id = `faq-a-${i}`;
  if (answer) btn.setAttribute('aria-controls', answer.id);

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
  });

  btn.addEventListener('keydown', e => {
    if (e.key === 'Escape' && item.classList.contains('open')) {
      item.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
});

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('success-msg');
const formError = document.getElementById('form-error');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fname = form.querySelector('[name="first_name"]');
    const email = form.querySelector('[name="email"]');
    const situation = form.querySelector('[name="situation"]');

    [fname, email, situation].forEach(el => { if(el) el.removeAttribute('aria-invalid'); });

    const errors = [];
    if (fname && !fname.value.trim()) errors.push(fname);
    if (email && (!email.value.trim() || !email.value.includes('@'))) errors.push(email);
    if (situation && !situation.value.trim()) errors.push(situation);

    if (errors.length) {
      errors.forEach(el => el.setAttribute('aria-invalid', 'true'));
      if (formError) { formError.style.display = 'block'; formError.focus(); }
      return;
    }
    if (formError) formError.style.display = 'none';
    if (form && successMsg) { form.style.display = 'none'; successMsg.style.display = 'block'; }
  });
}

// ===== SKIP LINK =====
const skipLink = document.querySelector('.skip-link');
if (skipLink) {
  skipLink.addEventListener('click', e => {
    const target = document.getElementById('main-content');
    if (target) { e.preventDefault(); target.focus(); target.scrollIntoView(); }
  });
}

// ===== ACTIVE NAV LINK =====
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0].split('/').pop() || 'index.html';
    if (href === path) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
  });
})();

// ===== SMOOTH SCROLL for same-page anchors =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      if (!el.getAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
  });
});
