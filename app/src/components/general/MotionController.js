import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom-v6';
import { gsap } from 'gsap';

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const unique = nodes => Array.from(new Set(Array.from(nodes || [])));

const MotionController = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const showRouteVeil = event => {
      if (reducedMotion() || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;

      let next;
      try { next = new URL(anchor.href, window.location.href); } catch (error) { return; }
      if (next.origin !== window.location.origin) return;
      const current = new URL(window.location.href);
      if (next.pathname === current.pathname && next.search === current.search && next.hash === current.hash) return;
      if (next.pathname === current.pathname && next.search === current.search && next.hash) return;

      const veil = document.querySelector('.route-transition-veil');
      if (!veil) return;
      gsap.killTweensOf(veil);
      gsap.fromTo(veil, { autoAlpha: 0, y: 6 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.14,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    const pressTarget = event => {
      if (reducedMotion()) return;
      const target = event.target && event.target.closest
        ? event.target.closest('button, .btn, .ap-command-trigger, .ap-user-button, .ap-icon-btn, .ap-nav-action, .row-open-link')
        : null;
      if (!target || target.disabled || target.getAttribute('aria-disabled') === 'true') return;
      gsap.to(target, { scale: 0.975, duration: 0.09, ease: 'power1.out', overwrite: 'auto' });
    };

    const releaseTarget = event => {
      const target = event.target && event.target.closest
        ? event.target.closest('button, .btn, .ap-command-trigger, .ap-user-button, .ap-icon-btn, .ap-nav-action, .row-open-link')
        : null;
      if (!target) return;
      if (reducedMotion()) {
        gsap.set(target, { clearProps: 'transform' });
        return;
      }
      gsap.to(target, { scale: 1, duration: 0.18, ease: 'power3.out', overwrite: 'auto', clearProps: 'transform' });
    };

    document.addEventListener('click', showRouteVeil, true);
    document.addEventListener('pointerdown', pressTarget, true);
    document.addEventListener('pointerup', releaseTarget, true);
    document.addEventListener('pointercancel', releaseTarget, true);

    return () => {
      document.removeEventListener('click', showRouteVeil, true);
      document.removeEventListener('pointerdown', pressTarget, true);
      document.removeEventListener('pointerup', releaseTarget, true);
      document.removeEventListener('pointercancel', releaseTarget, true);
    };
  }, []);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = document.querySelector('.route-motion-scope');
    const stage = root && root.querySelector('.route-stage');
    const veil = root && root.querySelector('.route-transition-veil');
    if (!root || !stage) return undefined;

    if (reducedMotion()) {
      gsap.set(stage, { clearProps: 'transform,opacity,visibility' });
      if (veil) gsap.set(veil, { autoAlpha: 0, clearProps: 'transform' });
      return undefined;
    }

    const context = gsap.context(() => {
      const pageHead = stage.querySelector('.ap-page-head');
      const surfaceTargets = unique(stage.querySelectorAll([
        '[data-motion="metric-grid"]',
        '[data-motion="table-shell"]',
        '[data-motion="table"]',
        '[data-motion="state"]',
        '[data-motion="profile-hero"]',
        '[data-motion="profile-card"]',
        '.overview-panel',
        '.ap-inspector',
        '.ap-maturity-panel',
        '.portfolio-facts',
        '.portfolio-table',
        '.decision-table',
        '.profile-v3-person'
      ].join(',')));
      const rowTargets = unique(stage.querySelectorAll('.ap-ledger-row, .decision-row, .portfolio-row, .overview-attention-row')).slice(0, 8);
      const maturityBars = unique(stage.querySelectorAll('.ap-maturity-track > i'));

      gsap.killTweensOf([stage, veil, ...surfaceTargets, ...rowTargets, ...maturityBars]);

      const timeline = gsap.timeline({ defaults: { overwrite: 'auto' } });
      timeline.fromTo(stage, {
        autoAlpha: 0.92,
        y: 14,
        scale: 0.992,
        transformOrigin: '50% 0%'
      }, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.42,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility'
      }, 0);

      if (pageHead) {
        timeline.fromTo(pageHead, { y: 18 }, {
          y: 0,
          duration: 0.44,
          ease: 'power3.out',
          clearProps: 'transform'
        }, 0.02);
      }

      if (surfaceTargets.length) {
        timeline.fromTo(surfaceTargets, {
          autoAlpha: 0.72,
          y: 22,
          scale: 0.985,
          transformOrigin: '50% 0%'
        }, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.44,
          stagger: 0.045,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility'
        }, 0.07);
      }

      if (rowTargets.length) {
        timeline.fromTo(rowTargets, { autoAlpha: 0.78, x: 10 }, {
          autoAlpha: 1,
          x: 0,
          duration: 0.34,
          stagger: 0.035,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility'
        }, 0.16);
      }

      if (maturityBars.length) {
        timeline.fromTo(maturityBars, { scaleX: 0.12, autoAlpha: 0.55, transformOrigin: '0% 50%' }, {
          scaleX: 1,
          autoAlpha: 1,
          duration: 0.52,
          stagger: 0.05,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility'
        }, 0.2);
      }

      if (veil) {
        timeline.to(veil, {
          autoAlpha: 0,
          y: -5,
          duration: 0.2,
          ease: 'power2.in',
          clearProps: 'transform'
        }, 0.03);
      }
    }, root);

    return () => {
      context.revert();
      gsap.set(stage, { clearProps: 'transform,opacity,visibility' });
      if (veil) gsap.set(veil, { autoAlpha: 0, clearProps: 'transform' });
    };
  }, [location.pathname, location.search]);

  return <div className="route-transition-veil" aria-hidden="true" />;
};

export default MotionController;
