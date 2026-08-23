import React, { useEffect, useRef } from 'react';

const AuthAtmosphere = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return undefined;
    const visual = canvas.closest('.auth-visual');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      if (visual) visual.dataset.atmosphere = 'static';
      return undefined;
    }

    let disposed = false;
    let frame = 0;
    let resizeObserver;
    let renderer;
    let geometry;
    let material;
    let points;

    const start = async () => {
      const THREE = await import('three');
      if (disposed) return;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 30);
      camera.position.z = 6;

      const count = 84;
      const positions = new Float32Array(count * 3);
      for (let index = 0; index < count; index += 1) {
        positions[index * 3] = (Math.random() - 0.5) * 7.5;
        positions[index * 3 + 1] = (Math.random() - 0.5) * 4.8;
        positions[index * 3 + 2] = (Math.random() - 0.5) * 1.5;
      }
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      material = new THREE.PointsMaterial({ color: 0x6483ff, size: 0.035, transparent: true, opacity: 0.62, depthWrite: false });
      points = new THREE.Points(geometry, material);
      scene.add(points);

      const resize = () => {
        const width = Math.max(1, canvas.clientWidth);
        const height = Math.max(1, canvas.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      resize();

      const render = time => {
        if (disposed) return;
        if (!document.hidden) {
          points.rotation.y = time * 0.000015;
          points.rotation.x = Math.sin(time * 0.0001) * 0.03;
          renderer.render(scene, camera);
        }
        frame = window.requestAnimationFrame(render);
      };
      frame = window.requestAnimationFrame(render);
      if (visual) visual.dataset.atmosphere = 'webgl';
    };

    start().catch(() => {
      if (visual) visual.dataset.atmosphere = 'static';
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      if (resizeObserver) resizeObserver.disconnect();
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" />;
};

export default AuthAtmosphere;
