import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

// Page transition wrapper that respects reduced-motion settings.
const baseTransition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] };

const PageTransition = ({ children, routeKey }) => {
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion
    ? {
        initial: false,
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: baseTransition
      };

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div key={routeKey || 'page'} className="page-transition" {...motionProps}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
