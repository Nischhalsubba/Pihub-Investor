(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function getGsap() {
    return window.gsap || null;
  }

  function animateAnalyticalDetails() {
    if (reducedMotion.matches) return;
    const gsap = getGsap();
    if (!gsap) return;

    const folio = document.querySelector('.ap-folio');
    if (folio) {
      gsap.killTweensOf(folio);
      gsap.fromTo(
        folio,
        { y: 6, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: .24, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }
      );
    }

    const rows = Array.from(document.querySelectorAll('.ap-ledger-row,.ap-queue-row,.ap-position-row,.ap-maturity-row')).slice(0, 8);
    if (rows.length) {
      gsap.killTweensOf(rows);
      gsap.fromTo(
        rows,
        { x: -4, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: .2, stagger: .024, delay: .09, ease: 'power2.out', clearProps: 'transform,opacity,visibility' }
      );
    }
  }

  function initPressFeedback() {
    document.addEventListener('pointerdown', function (event) {
      if (reducedMotion.matches) return;
      const gsap = getGsap();
      if (!gsap || !event.target || !event.target.closest) return;
      const target = event.target.closest('.ap-search-submit,.ap-command-trigger,.ap-command-row,.ap-filter-tabs button');
      if (!target) return;

      gsap.to(target, { scale: .985, duration: .1, ease: 'power2.out', overwrite: 'auto' });
      const release = function () {
        gsap.to(target, { scale: 1, duration: .14, ease: 'power3.out', overwrite: 'auto', clearProps: 'transform' });
        window.removeEventListener('pointerup', release);
        window.removeEventListener('pointercancel', release);
      };

      window.addEventListener('pointerup', release);
      window.addEventListener('pointercancel', release);
    });
  }

  function init() {
    initPressFeedback();
    window.addEventListener('pihub:route-ready', animateAnalyticalDetails);
    window.requestAnimationFrame(animateAnalyticalDetails);
    window.addEventListener('pagehide', function () {
      window.removeEventListener('pihub:route-ready', animateAnalyticalDetails);
    }, { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
