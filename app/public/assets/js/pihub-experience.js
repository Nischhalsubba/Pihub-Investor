const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

function initGsap() {
  if (reducedMotion || !window.gsap) return;
  const { gsap } = window;
  gsap.defaults({ ease: 'power3.out', overwrite: 'auto' });

  const pageHead = document.querySelector('[data-motion="page-head"]');
  if (pageHead) {
    const children = pageHead.querySelectorAll('.content-head-kicker,.content-head__title,.content-head-copy,.content-head-right');
    gsap.fromTo(children,
      { y: 18, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: .58, stagger: .065, clearProps: 'transform,opacity,visibility' }
    );
  }

  const header = document.querySelector('[data-motion="header-context"]');
  if (header) gsap.from(header, { y: -8, autoAlpha: 0, duration: .42 });

  const rows = document.querySelectorAll('.content-body tbody tr');
  if (rows.length) {
    gsap.from(rows, { y: 12, autoAlpha: 0, duration: .38, stagger: .035, delay: .08, clearProps: 'transform,opacity,visibility' });
  }

  const authCard = document.querySelector('[data-motion="auth-card"]');
  if (authCard) {
    const pieces = authCard.querySelectorAll('.auth-brand,.auth-eyebrow,.page-title,.page-desc,.form-signin,.auth-foot');
    gsap.from(pieces, { y: 24, autoAlpha: 0, duration: .72, stagger: .075, clearProps: 'transform,opacity,visibility' });
  }

  const visualCopy = document.querySelector('[data-motion="auth-visual-copy"]');
  if (visualCopy) gsap.from(visualCopy.children, { y: 20, autoAlpha: 0, duration: .72, stagger: .08, delay: .26, clearProps: 'transform,opacity,visibility' });

  document.querySelectorAll('.btn,.header-notification,.dropdown-toggle').forEach(el => {
    el.addEventListener('pointerdown', () => gsap.to(el, { scale: .98, duration: .12, ease: 'power2.out' }));
    const release = () => gsap.to(el, { scale: 1, duration: .2, ease: 'power3.out', clearProps: 'transform' });
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('pointerleave', release);
  });
}

async function initCapitalField() {
  const canvas = document.getElementById('capital-field');
  if (!canvas || reducedMotion || lowPower) return;

  try {
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);

    const group = new THREE.Group();
    scene.add(group);

    const nodeGeometry = new THREE.IcosahedronGeometry(.055, 1);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xc9a45e, transparent: true, opacity: .72 });
    const nodes = [];
    const positions = [];
    const count = 32;

    for (let i = 0; i < count; i += 1) {
      const angle = i * 2.399963;
      const radius = 1.15 + (i % 8) * .22;
      const x = Math.cos(angle) * radius * 1.22;
      const y = Math.sin(angle) * radius * .75;
      const z = Math.sin(i * .73) * 1.15;
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
      node.position.set(x, y, z);
      node.material.opacity = .34 + (i % 5) * .09;
      group.add(node);
      nodes.push(node);
      positions.push(new THREE.Vector3(x, y, z));
    }

    const linePoints = [];
    for (let i = 0; i < count; i += 1) {
      for (let j = i + 1; j < count; j += 1) {
        if (positions[i].distanceTo(positions[j]) < 1.5) linePoints.push(positions[i], positions[j]);
      }
    }
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x9d814c, transparent: true, opacity: .12 });
    group.add(new THREE.LineSegments(lineGeometry, lineMaterial));

    const ringGeometry = new THREE.TorusGeometry(2.25, .008, 8, 160);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xc39a50, transparent: true, opacity: .18 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = 1.18;
    ring.rotation.y = .18;
    group.add(ring);

    let pointerX = 0;
    let pointerY = 0;
    const onPointer = e => {
      const rect = canvas.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width - .5) * .35;
      pointerY = ((e.clientY - rect.top) / rect.height - .5) * .22;
    };
    canvas.parentElement.addEventListener('pointermove', onPointer, { passive: true });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const clock = new THREE.Clock();
    let frame;
    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.y += (pointerX - group.rotation.y) * .025;
      group.rotation.x += (-pointerY - group.rotation.x) * .025;
      ring.rotation.z = t * .035;
      nodes.forEach((node, i) => {
        node.scale.setScalar(.86 + Math.sin(t * .8 + i * .7) * .12);
      });
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    const cleanup = () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.parentElement.removeEventListener('pointermove', onPointer);
      nodeGeometry.dispose();
      nodes.forEach(node => node.material.dispose());
      lineGeometry.dispose();
      lineMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
    window.addEventListener('pagehide', cleanup, { once: true });
  } catch (error) {
    canvas.style.display = 'none';
  }
}

function init() {
  initGsap();
  initCapitalField();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
