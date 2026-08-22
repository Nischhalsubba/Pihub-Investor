(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function getGsap() {
    return window.gsap || null;
  }

  function animateRoute() {
    if (reducedMotion.matches) return;
    const gsap = getGsap();
    if (!gsap) return;

    const head = document.querySelector('.ap-page-head');
    if (head) {
      const pieces = head.querySelectorAll('.ap-folio,.ap-page-title,.ap-page-action');
      gsap.killTweensOf(pieces);
      gsap.fromTo(pieces,
        { y: 9, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: .32, stagger: .035, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }
      );
    }

    const tape = Array.from(document.querySelectorAll('.ap-capital-tape .ap-metric')).slice(0, 6);
    if (tape.length) {
      gsap.killTweensOf(tape);
      gsap.fromTo(tape,
        { y: 6, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: .24, stagger: .028, delay: .035, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }
      );
    }

    const surfaces = Array.from(document.querySelectorAll('.ap-ledger,.ap-inspector,.ap-queue,.ap-analysis-rail,.ap-maturity-panel,.ap-position-list,.ap-identity-sheet,.ap-profile-side')).slice(0, 5);
    if (surfaces.length) {
      gsap.killTweensOf(surfaces);
      gsap.fromTo(surfaces,
        { y: 8, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: .28, stagger: .035, delay: .06, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }
      );
    }

    const rows = Array.from(document.querySelectorAll('.ap-ledger-row,.ap-queue-row,.ap-position-row,.ap-maturity-row')).slice(0, 8);
    if (rows.length) {
      gsap.killTweensOf(rows);
      gsap.fromTo(rows,
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
      const target = event.target.closest('.ap-primary,.ap-search-submit,.ap-command-trigger,.ap-icon-btn,.ap-nav-action,.ap-command-row');
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
    window.addEventListener('pihub:route-ready', animateRoute);
    window.requestAnimationFrame(animateRoute);
    window.addEventListener('pagehide', function () {
      window.removeEventListener('pihub:route-ready', animateRoute);
    }, { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
