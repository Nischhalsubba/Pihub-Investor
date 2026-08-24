import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { animateOverlayPanel } from '../../_utils/motion';

const ContextDrawer = ({ history }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);
  const drawerRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    const onOpen = event => {
      previousFocus.current = document.activeElement;
      setContent(event.detail || {});
      setOpen(true);
    };
    const onClose = () => setOpen(false);
    window.addEventListener('pihub:context-open', onOpen);
    window.addEventListener('pihub:context-close', onClose);
    return () => {
      window.removeEventListener('pihub:context-open', onOpen);
      window.removeEventListener('pihub:context-close', onClose);
    };
  }, []);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return undefined;
    const layer = drawer.closest('.ap-context-layer');
    const scrim = layer && layer.querySelector('.ap-context-scrim');
    animateOverlayPanel({ panel: drawer, scrim, open });
    if (open) {
      const closeButton = drawer.querySelector('.ap-drawer-close');
      if (closeButton) closeButton.focus();
    } else if (previousFocus.current && previousFocus.current.focus) {
      const target = previousFocus.current;
      previousFocus.current = null;
      window.requestAnimationFrame(() => { if (document.documentElement.contains(target)) target.focus(); });
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = event => {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const facts = content && Array.isArray(content.facts) ? content.facts : [];
  const activity = content && Array.isArray(content.activity) ? content.activity : [];

  return (
    <div className={`ap-context-layer${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <button className="ap-context-scrim" type="button" onClick={() => setOpen(false)} aria-label="Close quick view" tabIndex={open ? 0 : -1} />
      <aside className="ap-context-drawer" ref={drawerRef} role="dialog" aria-modal="true" aria-labelledby="context-drawer-title">
        <header className="ap-drawer-head">
          <div><span className="ap-drawer-kicker">{content && content.kicker ? content.kicker : 'Quick view'}</span><h2 id="context-drawer-title">{content && content.title ? content.title : 'Workspace record'}</h2>{content && content.subtitle ? <p>{content.subtitle}</p> : null}</div>
          <button className="ap-drawer-close" type="button" onClick={() => setOpen(false)} aria-label="Close quick view"><i className="bx bx-x" aria-hidden="true" /></button>
        </header>
        {content && content.status ? <div className={`ap-context-status ap-status-${content.status}`}>{String(content.status).replace(/(^|[-_])\w/g, match => match.toUpperCase().replace(/[-_]/g, ' '))}</div> : null}
        {facts.length ? <section className="ap-context-section"><h3>Decision context</h3><dl>{facts.map((fact, index) => <div key={`${fact.label}-${index}`}><dt>{fact.label}</dt><dd>{fact.value === null || fact.value === undefined || fact.value === '' ? '—' : fact.value}</dd></div>)}</dl></section> : null}
        {activity.length ? <section className="ap-context-section"><h3>Recent activity</h3><div className="ap-context-timeline">{activity.slice(0, 6).map((item, index) => <div key={`${item.label}-${index}`}><i aria-hidden="true" /><span><strong>{item.label}</strong>{item.meta ? <small>{item.meta}</small> : null}</span></div>)}</div></section> : null}
        {content && content.href ? <footer className="ap-context-footer"><button type="button" className="btn btn-primary" onClick={() => { const href = content.href; setOpen(false); history.push(href); }}>{content.hrefLabel || 'Open full record'}</button></footer> : null}
      </aside>
    </div>
  );
};

export default withRouter(ContextDrawer);
