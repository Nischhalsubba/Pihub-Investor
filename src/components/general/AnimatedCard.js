import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Shared card wrapper with reduced-motion support for hover and entry.
const baseTransition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] };

const AnimatedCard = ({ children, className = '', delay = 0 }) => {
  const reduceMotion = useReducedMotion();
  const hoverMotion = reduceMotion
    ? {}
    : {
        y: -2,
        boxShadow: '0 16px 36px rgba(15, 23, 42, 0.12)'
      };

  return (
    <motion.div
      className={`card-surface ${className}`.trim()}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...baseTransition, delay }}
      whileHover={hoverMotion}
      whileTap={reduceMotion ? {} : { y: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
