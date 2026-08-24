import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ToastRegion = () => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  useEffect(() => {
    const remove = id => {
      const node = document.querySelector(`[data-toast-id="${id}"]`);
      const finish = () => setToasts(items => items.filter(item => item.id !== id));
      if (!node || reduceMotion()) { finish(); return; }
      gsap.to(node, { autoAlpha: 0, x: 18, duration: 0.16, ease: 'power2.in', onComplete: finish, overwrite: 'auto' });
    };

    const onToast = event => {
      const detail = event.detail || {};
      if (!detail.message) return;
      const toast = { id: detail.id || `${Date.now()}`, type: detail.type || 'info', title: detail.title || '', message: detail.message };
      setToasts(items => [...items.filter(item => item.id !== toast.id), toast].slice(-4));
      window.requestAnimationFrame(() => {
        const node = document.querySelector(`[data-toast-id="${toast.id}"]`);
        if (node && !reduceMotion()) gsap.fromTo(node, { autoAlpha: 0, x: 18, scale: 0.985 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.28, ease: 'power3.out', clearProps: 'transform,opacity,visibility' });
      });
      const timer = window.setTimeout(() => remove(toast.id), Math.max(1800, Number(detail.duration) || 4200));
      timers.current.set(toast.id, timer);
    };

    window.addEventListener('pihub:toast', onToast);
    return () => {
      window.removeEventListener('pihub:toast', onToast);
      timers.current.forEach(timer => window.clearTimeout(timer));
      timers.current.clear();
    };
  }, []);

  const dismiss = id => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setToasts(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="ap-toast-region" aria-live="polite" aria-atomic="false">
      {toasts.map(toast => (
        <article className={`ap-toast ap-toast-${toast.type}`} data-toast-id={toast.id} key={toast.id} role="status">
          <span className="ap-toast-icon" aria-hidden="true"><i className={toast.type === 'success' ? 'bx bx-check' : toast.type === 'error' ? 'bx bx-error-circle' : 'bx bx-info-circle'} /></span>
          <span className="ap-toast-copy">{toast.title ? <strong>{toast.title}</strong> : null}<span>{toast.message}</span></span>
          <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification"><i className="bx bx-x" aria-hidden="true" /></button>
        </article>
      ))}
    </div>
  );
};

export default ToastRegion;
