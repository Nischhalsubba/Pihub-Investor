const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const lowPower = Boolean(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);

let activePress = null;
let threeSession = null;
let threeCanvas = null;
let threeStarting = false;
let syncFrame = null;

const shouldReduceMotion = () => reducedMotionQuery.matches;

function getGsap() {
  return window.gsap || null;
}

function markAnimated(element) {
  if (element) element.dataset.piAnimated = 'true';
}

function wasAnimated(element) {
  return element && element.dataset.piAnimated === 'true';
}

function animateAuthIfNeeded() {
  if (shouldReduceMotion()) return;
  const gsap = getGsap();
  if (!gsap) return;

  const authCard = document.querySelector('[data-motion="auth-card"]');
  if (authCard && !wasAnimated(authCard)) {
    markAnimated(authCard);
    const pieces = authCard.querySelectorAll('.auth-brand,.auth-eyebrow,.page-title,.page-desc,.form-signin,.auth-foot');
    gsap.from(pieces, {
      y: 16,
      autoAlpha: 0,
      duration: .46,
      stagger: .045,
      ease: 'power3.out',
      clearProps: 'transform,opacity,visibility'
    });
  }

  const visualCopy = document.querySelector('[data-motion="auth-visual-copy"]');
  if (visualCopy && !wasAnimated(visualCopy)) {
    markAnimated(visualCopy);
    gsap.from(visualCopy.children, {
      y: 14,
      autoAlpha: 0,
      duration: .52,
      stagger: .05,
      delay: .12,
      ease: 'power3.out',
      clearProps: 'transform,opacity,visibility'
    });
  }
}

function animateRoute() {
  if (shouldReduceMotion()) return;
  const gsap = getGsap();
  if (!gsap) return;

  gsap.defaults({ ease: 'power3.out', overwrite: 'auto' });

  const pageHead = document.querySelector('[data-motion="page-head"]');
  if (pageHead) {
    const pieces = pageHead.querySelectorAll('.content-head-kicker,.content-head__title,.content-head-copy,.content-head-right');
    gsap.fromTo(
      pieces,
      { y: 12, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: .34, stagger: .035, clearProps: 'transform,opacity,visibility' }
    );
  }

  const metricCards = Array.from(document.querySelectorAll('[data-motion="metric-grid"] .metric-card,[data-motion="metric-grid"] > article')).slice(0, 6);
  if (metricCards.length) {
    gsap.fromTo(
      metricCards,
      { y: 10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: .3, stagger: .035, delay: .04, clearProps: 'transform,opacity,visibility' }
    );
  }

  const surfaces = Array.from(document.querySelectorAll('[data-motion="table-shell"]')).slice(0, 4);
  if (surfaces.length) {
    gsap.fromTo(
      surfaces,
      { y: 10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: .32, stagger: .035, delay: .07, clearProps: 'transform,opacity,visibility' }
    );
  }

  const rows = Array.from(document.querySelectorAll('.table-shell tbody tr')).slice(0, 8);
  if (rows.length) {
    gsap.fromTo(
      rows,
      { y: 7, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: .24, stagger: .028, delay: .11, clearProps: 'transform,opacity,visibility' }
    );
  }

  const headerContext = document.querySelector('[data-motion="header-context"]');
  if (headerContext) {
    gsap.fromTo(headerContext, { y: -5, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .24, clearProps: 'transform,opacity,visibility' });
  }
}

function initPressFeedback() {
  document.addEventListener('pointerdown', event => {
    if (shouldReduceMotion()) return;
    const gsap = getGsap();
    if (!gsap || !event.target || !event.target.closest) return;
    const target = event.target.closest('.btn,.header-notification,.dropdown-toggle,.status-segment,.sidebar-action');
    if (!target) return;
    activePress = target;
    gsap.to(target, { scale: .985, duration: .1, ease: 'power2.out', overwrite: 'auto' });
  });

  const release = () => {
    if (!activePress) return;
    const gsap = getGsap();
    if (gsap && !shouldReduceMotion()) {
      gsap.to(activePress, {
        scale: 1,
        duration: .16,
        ease: 'power3.out',
        overwrite: 'auto',
        clearProps: 'transform'
      });
    } else {
      activePress.style.transform = '';
    }
    activePress = null;
  };

  document.addEventListener('pointerup', release);
  document.addEventListener('pointercancel', release);
  window.addEventListener('blur', release);
}

async function createCapitalField(canvas) {
  if (!canvas || shouldReduceMotion() || lowPower) return null;

  try {
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
    if (!document.documentElement.contains(canvas) || shouldReduceMotion()) return null;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 50);
    camera.position.set(0, .15, 7.4);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;

    const root = new THREE.Group();
    root.rotation.x = -.08;
    scene.add(root);

    const surfaceGeometry = new THREE.PlaneGeometry(7.6, 5.4, 42, 30);
    const surfaceMaterial = new THREE.ShaderMaterial({
      transparent: true,
      wireframe: true,
      uniforms: {
        uTime: { value: 0 },
        uAccent: { value: new THREE.Color(0x4979ee) },
        uOpacity: { value: .115 }
      },
      vertexShader: `
        uniform float uTime;
        varying float vWave;
        void main() {
          vec3 p = position;
          float waveA = sin((p.x * 1.25) + (uTime * 0.34)) * 0.09;
          float waveB = cos((p.y * 1.55) - (uTime * 0.26)) * 0.07;
          p.z += waveA + waveB;
          vWave = waveA + waveB;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uAccent;
        uniform float uOpacity;
        varying float vWave;
        void main() {
          float strength = clamp(0.72 + vWave * 1.8, 0.42, 1.0);
          gl_FragColor = vec4(uAccent * strength, uOpacity);
        }
      `
    });
    const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    surface.rotation.x = -1.03;
    surface.position.set(.7, .85, -1.7);
    root.add(surface);

    const pointCount = 56;
    const pointPositions = new Float32Array(pointCount * 3);
    const vectors = [];
    for (let i = 0; i < pointCount; i += 1) {
      const angle = i * 2.399963229728653;
      const radius = 1.15 + (i % 9) * .24;
      const x = Math.cos(angle) * radius * 1.35 + .4;
      const y = Math.sin(angle) * radius * .72 - .2;
      const z = Math.sin(i * .63) * .9 + .2;
      pointPositions[i * 3] = x;
      pointPositions[i * 3 + 1] = y;
      pointPositions[i * 3 + 2] = z;
      vectors.push(new THREE.Vector3(x, y, z));
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x82a5ff,
      size: .055,
      sizeAttenuation: true,
      transparent: true,
      opacity: .68,
      depthWrite: false
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    root.add(points);

    const lineVertices = [];
    for (let i = 0; i < vectors.length; i += 1) {
      for (let j = i + 1; j < vectors.length; j += 1) {
        if (vectors[i].distanceToSquared(vectors[j]) < 1.25) {
          lineVertices.push(vectors[i].x, vectors[i].y, vectors[i].z, vectors[j].x, vectors[j].y, vectors[j].z);
        }
      }
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineVertices, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3d68c9, transparent: true, opacity: .13, depthWrite: false });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    root.add(lines);

    let pointerX = 0;
    let pointerY = 0;
    const container = canvas.parentElement;
    const onPointerMove = event => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerX = ((event.clientX - rect.left) / rect.width - .5) * .18;
      pointerY = ((event.clientY - rect.top) / rect.height - .5) * .11;
    };
    container.addEventListener('pointermove', onPointerMove, { passive: true });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    let resizeObserver = null;
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();

    const clock = new THREE.Clock();
    let frame = null;
    let running = true;

    const renderFrame = () => {
      if (!running) return;
      const delta = Math.min(clock.getDelta(), .05);
      const elapsed = clock.elapsedTime;
      surfaceMaterial.uniforms.uTime.value = elapsed;
      root.rotation.y += (pointerX - root.rotation.y) * Math.min(1, delta * 2.5);
      root.rotation.x += ((-.08 - pointerY) - root.rotation.x) * Math.min(1, delta * 2.5);
      points.rotation.z = Math.sin(elapsed * .09) * .035;
      lines.rotation.z = points.rotation.z;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(renderFrame);
    };

    const start = () => {
      if (running || shouldReduceMotion()) return;
      running = true;
      clock.start();
      frame = window.requestAnimationFrame(renderFrame);
    };

    const stop = () => {
      running = false;
      clock.stop();
      if (frame) window.cancelAnimationFrame(frame);
      frame = null;
    };

    const onVisibility = () => {
      if (document.hidden || shouldReduceMotion()) stop();
      else if (document.documentElement.contains(canvas)) start();
    };
    document.addEventListener('visibilitychange', onVisibility);
    frame = window.requestAnimationFrame(renderFrame);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
      container.removeEventListener('pointermove', onPointerMove);
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', resize);
      surfaceGeometry.dispose();
      surfaceMaterial.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      if (renderer.forceContextLoss) renderer.forceContextLoss();
    };
  } catch (error) {
    canvas.style.display = 'none';
    return null;
  }
}

function teardownCapitalField() {
  if (threeSession) threeSession();
  threeSession = null;
  threeCanvas = null;
  threeStarting = false;
}

async function syncCapitalField() {
  const canvas = document.getElementById('capital-field');

  if (!canvas || shouldReduceMotion() || lowPower) {
    if (threeSession || threeCanvas) teardownCapitalField();
    return;
  }

  if (threeSession && threeCanvas === canvas) return;
  if (threeSession && threeCanvas !== canvas) teardownCapitalField();
  if (threeStarting) return;

  threeStarting = true;
  threeCanvas = canvas;
  const cleanup = await createCapitalField(canvas);
  threeStarting = false;

  if (canvas !== threeCanvas || !document.documentElement.contains(canvas)) {
    if (cleanup) cleanup();
    return;
  }
  threeSession = cleanup;
}

function syncExperience() {
  if (syncFrame) window.cancelAnimationFrame(syncFrame);
  syncFrame = window.requestAnimationFrame(() => {
    syncFrame = null;
    animateAuthIfNeeded();
    syncCapitalField();
  });
}

function init() {
  initPressFeedback();
  window.addEventListener('pihub:route-ready', animateRoute);
  window.addEventListener('load', animateRoute, { once: true });

  const root = document.getElementById('root');
  let observer = null;
  if (root && 'MutationObserver' in window) {
    observer = new MutationObserver(syncExperience);
    observer.observe(root, { childList: true, subtree: true });
  }

  const onMotionPreferenceChange = () => {
    if (shouldReduceMotion()) teardownCapitalField();
    else syncExperience();
  };
  if (reducedMotionQuery.addEventListener) reducedMotionQuery.addEventListener('change', onMotionPreferenceChange);

  syncExperience();
  window.requestAnimationFrame(animateRoute);

  window.addEventListener('pagehide', () => {
    teardownCapitalField();
    if (observer) observer.disconnect();
    window.removeEventListener('pihub:route-ready', animateRoute);
    if (reducedMotionQuery.removeEventListener) reducedMotionQuery.removeEventListener('change', onMotionPreferenceChange);
  }, { once: true });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
