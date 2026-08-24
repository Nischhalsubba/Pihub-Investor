import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

export const MOTION = Object.freeze({
  quick: 0.12,
  press: 0.14,
  standard: 0.2,
  panel: 0.28,
  route: 0.3,
  easeEnter: 'power3.out',
  easeStandard: 'power2.out',
  easeExit: 'power2.in'
});

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const animateOverlayPanel = ({ panel, scrim, open }) => {
  if (!panel) return;
  gsap.killTweensOf([panel, scrim].filter(Boolean));
  if (prefersReducedMotion()) {
    gsap.set(panel, { x: 0, autoAlpha: open ? 1 : 0 });
    if (scrim) gsap.set(scrim, { autoAlpha: open ? 1 : 0 });
    return;
  }
  if (open) {
    if (scrim) gsap.fromTo(scrim, { autoAlpha: 0 }, { autoAlpha: 1, duration: MOTION.standard, ease: MOTION.easeStandard });
    gsap.set(panel, { x: 24, autoAlpha: 1 });
    gsap.to(panel, { x: 0, duration: MOTION.panel, ease: MOTION.easeEnter, overwrite: 'auto', clearProps: 'transform' });
    return;
  }
  gsap.to(panel, {
    x: 24,
    duration: MOTION.quick,
    ease: MOTION.easeExit,
    overwrite: 'auto',
    onComplete: () => gsap.set(panel, { x: 0, autoAlpha: 0 })
  });
  if (scrim) gsap.to(scrim, { autoAlpha: 0, duration: MOTION.quick, ease: MOTION.easeExit });
};

export const captureLayout = targets => {
  if (prefersReducedMotion() || typeof window === 'undefined' || window.innerWidth <= 820 || !targets || !targets.length) return null;
  return Flip.getState(targets);
};

export const playLayoutFlip = (state, targets) => {
  if (!state) return;
  window.requestAnimationFrame(() => Flip.from(state, {
    duration: MOTION.panel,
    ease: MOTION.easeEnter,
    absolute: false,
    nested: true,
    prune: true,
    onComplete: () => gsap.set(targets, { clearProps: 'transform' })
  }));
};

export { gsap };
