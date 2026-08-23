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
      const standardTargets = root.querySelectorAll('[data-motion="page-head-react"], [data-motion="metric-grid"], [data-motion="table"], [data-motion="state"]');
      if (standardTargets.length) {
        gsap.fromTo(standardTargets, { autoAlpha: 0, y: 5 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.24,
          stagger: 0.025,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility'
        });
      }

      const profileHero = root.querySelector('[data-motion="profile-hero"]');
      if (profileHero) {
        gsap.fromTo(profileHero, { autoAlpha: 0, y: 8 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.32,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility'
        });
      }

      const profileCards = root.querySelectorAll('[data-motion="profile-card"]');
      if (profileCards.length) {
        gsap.fromTo(profileCards, { autoAlpha: 0, y: 7 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.28,
          stagger: 0.04,
          delay: profileHero ? 0.04 : 0,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility'
        });
      }

      const profilePeople = root.querySelectorAll('[data-motion="profile-person"]');
      if (profilePeople.length) {
        gsap.fromTo(profilePeople, { autoAlpha: 0, y: 4 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.22,
          stagger: 0.025,
          delay: 0.08,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility'
        });
      }
    }, root);

    return () => context.revert();
  }, [location.pathname, location.search]);

  return null;
};

export default MotionController;
