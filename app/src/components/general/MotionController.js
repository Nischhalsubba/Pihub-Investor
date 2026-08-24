import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom-v6';
import { gsap, MOTION, prefersReducedMotion } from '../../_utils/motion';

const unique = nodes => Array.from(new Set(Array.from(nodes || [])));

const MotionController = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const interactiveSelector = 'button, .btn, .ap-command-trigger, .ap-user-button, .ap-icon-btn, .ap-nav-item, .ap-nav-action, .row-open-link, .ap-notification-card, .ap-quick-view-btn';

    const showRouteVeil = event => {
      if (prefersReducedMotion() || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
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
      gsap.fromTo(veil, { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: MOTION.quick, ease: MOTION.easeStandard, overwrite: 'auto' });
    };

    const pressTarget = event => {
      if (prefersReducedMotion()) return;
      const target = event.target && event.target.closest ? event.target.closest(interactiveSelector) : null;
      if (!target || target.disabled || target.getAttribute('aria-disabled') === 'true') return;
      gsap.to(target, { scale: 0.98, duration: MOTION.quick, ease: MOTION.easeStandard, overwrite: 'auto', transformOrigin: '50% 50%' });
    };

    const releaseTarget = event => {
      const target = event.target && event.target.closest ? event.target.closest(interactiveSelector) : null;
      if (!target) return;
      if (prefersReducedMotion()) { gsap.set(target, { clearProps: 'transform' }); return; }
      gsap.to(target, { scale: 1, duration: MOTION.press, ease: MOTION.easeEnter, overwrite: 'auto', clearProps: 'transform' });
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

    const maturityBars = unique(stage.querySelectorAll('.ap-maturity-track > i'));
    const dataBars = unique(stage.querySelectorAll('.ap-bar-track > i, .ap-pipeline-strip > span'));
    const trendLines = unique(stage.querySelectorAll('.ap-capital-trend polyline'));
    if (prefersReducedMotion()) {
      gsap.set([stage, ...maturityBars, ...dataBars, ...trendLines], { clearProps: 'transform,opacity,visibility' });
      if (veil) gsap.set(veil, { autoAlpha: 0, clearProps: 'transform' });
      return undefined;
    }

    const context = gsap.context(() => {
      const pageHead = stage.querySelector('.ap-page-head');
      const surfaceTargets = unique(stage.querySelectorAll('[data-motion="metric-grid"], [data-motion="table-shell"], [data-motion="table"], [data-motion="state"], [data-motion="profile-hero"], [data-motion="profile-card"], .overview-panel, .ap-inspector, .ap-maturity-panel, .portfolio-facts, .portfolio-table, .decision-table, .profile-v3-person, .ap-compare-table'));
      const rowTargets = unique(stage.querySelectorAll('.ap-ledger-row, .decision-row, .portfolio-row, .overview-attention-row, .ap-activity-item')).slice(0, 10);
      gsap.killTweensOf([stage, veil, ...surfaceTargets, ...rowTargets, ...maturityBars, ...dataBars, ...trendLines]);

      const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
      gsap.set(stage, { autoAlpha: 1 });
      tl.fromTo(stage, { y: 10, scale: 0.996, transformOrigin: '50% 0%' }, { y: 0, scale: 1, duration: MOTION.route, ease: MOTION.easeEnter, clearProps: 'transform' }, 0);
      if (pageHead) tl.fromTo(pageHead, { y: 12 }, { y: 0, duration: MOTION.panel, ease: MOTION.easeEnter, clearProps: 'transform' }, 0.01);
      if (surfaceTargets.length) tl.fromTo(surfaceTargets, { y: 14 }, { y: 0, duration: MOTION.panel, stagger: 0.035, ease: MOTION.easeEnter, clearProps: 'transform' }, 0.04);
      if (rowTargets.length) tl.fromTo(rowTargets, { x: 7 }, { x: 0, duration: MOTION.standard, stagger: 0.025, ease: MOTION.easeStandard, clearProps: 'transform' }, 0.1);
      if (maturityBars.length) tl.fromTo(maturityBars, { scaleX: 0.12, transformOrigin: '0% 50%' }, { scaleX: 1, duration: MOTION.panel, stagger: 0.035, ease: MOTION.easeEnter, clearProps: 'transform' }, 0.12);
      if (dataBars.length) tl.fromTo(dataBars, { scaleX: 0.08, transformOrigin: '0% 50%' }, { scaleX: 1, duration: MOTION.panel, stagger: 0.025, ease: MOTION.easeEnter, clearProps: 'transform' }, 0.12);
      if (trendLines.length) tl.fromTo(trendLines, { y: 4 }, { y: 0, duration: MOTION.panel, ease: MOTION.easeEnter, clearProps: 'transform' }, 0.14);
      if (veil) tl.to(veil, { autoAlpha: 0, y: -3, duration: MOTION.quick, ease: MOTION.easeExit, clearProps: 'transform' }, 0.02);
    }, root);

    return () => {
      context.revert();
      gsap.set([stage, ...maturityBars, ...dataBars, ...trendLines], { clearProps: 'transform,opacity,visibility' });
      if (veil) gsap.set(veil, { autoAlpha: 0, clearProps: 'transform' });
    };
  }, [location.pathname, location.search]);

  return <div className="route-transition-veil" aria-hidden="true" />;
};

export default MotionController;
