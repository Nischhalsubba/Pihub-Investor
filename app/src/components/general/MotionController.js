import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom-v6';
import { gsap } from 'gsap';

const MotionController = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const root = document.querySelector('.route-motion-scope');
    if (!root) return undefined;

    const context = gsap.context(() => {
      const targets = root.querySelectorAll('[data-motion="page-head"], [data-motion="metric-grid"], [data-motion="table"], [data-motion="state"]');
      if (!targets.length) return;
      gsap.fromTo(targets, { autoAlpha: 0, y: 5 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.24,
        stagger: 0.025,
        ease: 'power2.out',
        clearProps: 'transform,opacity,visibility'
      });
    }, root);

    return () => context.revert();
  }, [location.pathname, location.search]);

  return null;
};

export default MotionController;
