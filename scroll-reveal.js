(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionPreference.matches || !('IntersectionObserver' in window)) return;

  const pending = new Set();
  const reveal = (element) => {
    element.classList.remove('is-pending');
    pending.delete(element);
    observer.unobserve(element);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) reveal(entry.target);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -24px 0px' });

  const targets = document.querySelectorAll([
    '.trust-inner', '.section-heading', '.step', '.shot', '.use-case',
    '.language-copy', '.language-list', '.offline-card', '.faq-list', '.final-cta'
  ].join(', '));

  targets.forEach((element) => {
    // Leave content already in view visible, including restored scroll positions.
    if (element.getBoundingClientRect().top < window.innerHeight - 24) return;

    if (element.matches('.step, .shot, .use-case')) {
      const index = Array.from(element.parentElement.children).indexOf(element);
      element.style.setProperty('--reveal-delay', `${Math.min(index * 80, 160)}ms`);
    }

    element.classList.add('scroll-reveal', 'is-pending');
    pending.add(element);
    observer.observe(element);
  });

  // Keyboard focus must never land on content that is still transparent.
  document.addEventListener('focusin', (event) => {
    const element = event.target.closest('.scroll-reveal.is-pending');
    if (!element) return;
    element.style.setProperty('--reveal-delay', '0ms');
    reveal(element);
  });

  motionPreference.addEventListener('change', (event) => {
    if (!event.matches) return;
    pending.forEach(reveal);
    observer.disconnect();
  });
})();
