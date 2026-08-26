import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function PlatformRouteMotion({ routeKey, children }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (!root.current) return undefined;
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.fromTo(root.current,
          { autoAlpha: 0, y: 8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.24,
            ease: 'power2.out',
            overwrite: 'auto',
            clearProps: 'transform,opacity,visibility',
          });
      }, root);
      return () => context.revert();
    });

    media.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(root.current, { clearProps: 'all' });
    });

    return () => media.revert();
  }, [routeKey]);

  return <div className="ph-route-stage" ref={root} data-route={routeKey}>{children}</div>;
}
