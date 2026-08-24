import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const shortcuts = [
  ['Ctrl/Cmd K', 'Open global search'],
  ['/', 'Open global search'],
  ['G then O', 'Go to Overview'],
  ['G then P', 'Go to Opportunities'],
  ['G then C', 'Go to Credit requests'],
  ['G then I', 'Go to Invested positions'],
  ['N then O', 'Register a new opportunity'],
  ['?', 'Show keyboard shortcuts'],
  ['Esc', 'Close the active overlay']
];

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ShortcutHelp = () => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    const onOpen = () => {
      previousFocus.current = document.activeElement;
      setOpen(true);
    };
    window.addEventListener('pihub:shortcuts-open', onOpen);
    return () => window.removeEventListener('pihub:shortcuts-open', onOpen);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const dialog = dialogRef.current;
    const layer = dialog && dialog.closest('.ap-shortcut-layer');
    const scrim = layer && layer.querySelector('.ap-shortcut-scrim');
    const firstButton = dialog && dialog.querySelector('button');
    if (firstButton) firstButton.focus();
    if (!reduceMotion() && dialog) {
      gsap.fromTo(dialog, { autoAlpha: 0, y: 14, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, ease: 'power3.out', clearProps: 'transform,opacity,visibility' });
      if (scrim) gsap.fromTo(scrim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18, ease: 'power2.out' });
    }
    const onKeyDown = event => {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open || !previousFocus.current || !previousFocus.current.focus) return;
    const target = previousFocus.current;
    previousFocus.current = null;
    window.requestAnimationFrame(() => { if (document.documentElement.contains(target)) target.focus(); });
  }, [open]);

  if (!open) return null;
  return (
    <div className="ap-shortcut-layer" role="presentation">
      <button className="ap-shortcut-scrim" type="button" aria-label="Close keyboard shortcuts" onClick={() => setOpen(false)} />
      <section className="ap-shortcut-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="shortcut-help-title">
        <header><div><span className="ap-drawer-kicker">Power user</span><h2 id="shortcut-help-title">Keyboard shortcuts</h2><p>Navigate the investor workspace without leaving the keyboard.</p></div><button type="button" className="ap-drawer-close" onClick={() => setOpen(false)} aria-label="Close keyboard shortcuts"><i className="bx bx-x" aria-hidden="true" /></button></header>
        <div className="ap-shortcut-grid">{shortcuts.map(([keys, label]) => <div className="ap-shortcut-row" key={keys}><span>{label}</span><kbd>{keys}</kbd></div>)}</div>
      </section>
    </div>
  );
};

export default ShortcutHelp;
