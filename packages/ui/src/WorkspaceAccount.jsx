import React, { useEffect, useRef, useState } from 'react';

const initials = name => String(name || '').split(' ').filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase();

export default function WorkspaceAccount({ user, onLogout, onHome, secondaryAction }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  useEffect(() => {
    const pointer = event => { if (open && root.current && !root.current.contains(event.target)) setOpen(false); };
    const key = event => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', pointer); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', pointer); document.removeEventListener('keydown', key); };
  }, [open]);
  return <div className="ph-account" ref={root}>
    <button className="ph-user-card" type="button" aria-haspopup="menu" aria-expanded={open} aria-label="Open account menu" onClick={() => setOpen(value => !value)}>
      <span className="ph-avatar" aria-hidden="true">{initials(user.name)}</span>
      <span className="ph-user-copy"><strong>{user.name}</strong><small>{user.organization} · {user.role}</small></span>
      <span className="ph-account-chevron" aria-hidden="true">⌄</span>
    </button>
    {open ? <div className="ph-account-menu" role="menu">
      <div className="ph-account-menu-head"><strong>{user.name}</strong><span>{user.role}</span></div>
      <button type="button" role="menuitem" onClick={() => { setOpen(false); onHome(); }}>Workspace overview</button>
      {secondaryAction ? <button type="button" role="menuitem" onClick={() => { setOpen(false); secondaryAction.onSelect(); }}>{secondaryAction.label}</button> : null}
      <div className="ph-account-menu-divider" role="separator" />
      <button className="is-danger" type="button" role="menuitem" onClick={onLogout}>Sign out</button>
    </div> : null}
  </div>;
}
