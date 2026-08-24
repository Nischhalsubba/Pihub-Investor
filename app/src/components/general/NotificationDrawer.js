import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { gsap } from 'gsap';
import { getNotificationCount, getNotificationList, markNotificationsAsRead } from '../../actions/notification';

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const notificationPath = notification => notification && (notification.path || notification.link || notification.url) ? (notification.path || notification.link || notification.url) : '/notifications';

const NotificationDrawer = ({ history, list, getNotificationCount: refreshCount, getNotificationList: refreshList, markNotificationsAsRead: markRead }) => {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);
  const previousFocus = useRef(null);
  const notifications = useMemo(() => list && Array.isArray(list.notificationList) ? list.notificationList : [], [list]);
  const unread = notifications.filter(item => item && Number(item.is_read) === 0);

  const refresh = () => {
    refreshList(1);
    refreshCount();
  };

  useEffect(() => {
    const openDrawer = () => {
      previousFocus.current = document.activeElement;
      setOpen(true);
      refresh();
    };
    const closeDrawer = () => setOpen(false);
    window.addEventListener('pihub:notifications-open', openDrawer);
    window.addEventListener('pihub:notifications-close', closeDrawer);
    return () => {
      window.removeEventListener('pihub:notifications-open', openDrawer);
      window.removeEventListener('pihub:notifications-close', closeDrawer);
    };
  }, []);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return undefined;
    const layer = drawer.closest('.ap-notification-layer');
    const scrim = layer && layer.querySelector('.ap-notification-scrim');
    gsap.killTweensOf([drawer, scrim]);
    if (reduceMotion()) {
      gsap.set(drawer, { x: open ? 0 : '100%', autoAlpha: open ? 1 : 0 });
      if (scrim) gsap.set(scrim, { autoAlpha: open ? 1 : 0 });
    } else if (open) {
      if (scrim) gsap.fromTo(scrim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18, ease: 'power2.out' });
      gsap.fromTo(drawer, { x: 26, autoAlpha: 0.75 }, { x: 0, autoAlpha: 1, duration: 0.32, ease: 'power3.out', overwrite: 'auto' });
    } else {
      gsap.to(drawer, { x: 28, autoAlpha: 0, duration: 0.18, ease: 'power2.in', overwrite: 'auto' });
      if (scrim) gsap.to(scrim, { autoAlpha: 0, duration: 0.14, ease: 'power1.in' });
    }

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

  const markIds = ids => {
    const clean = (ids || []).filter(Boolean);
    if (!clean.length) return;
    markRead(clean, refresh);
  };

  const openNotification = notification => {
    const path = notificationPath(notification);
    const go = () => {
      setOpen(false);
      if (path) history.push(path);
    };
    if (Number(notification.is_read) === 0) markRead([notification.id], () => { refresh(); go(); });
    else go();
  };

  return (
    <div className={`ap-notification-layer${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <button className="ap-notification-scrim" type="button" onClick={() => setOpen(false)} aria-label="Close notifications" tabIndex={open ? 0 : -1} />
      <aside className="ap-notification-drawer" ref={drawerRef} role="dialog" aria-modal="true" aria-labelledby="notification-drawer-title">
        <header className="ap-drawer-head">
          <div><span className="ap-drawer-kicker">Activity center</span><h2 id="notification-drawer-title">Notifications</h2><p>{unread.length ? `${unread.length} unread update${unread.length === 1 ? '' : 's'}` : 'You are caught up.'}</p></div>
          <button className="ap-drawer-close" type="button" onClick={() => setOpen(false)} aria-label="Close notifications"><i className="bx bx-x" aria-hidden="true" /></button>
        </header>
        <div className="ap-notification-actions">
          <button type="button" className="btn btn-link" disabled={!unread.length} onClick={() => markIds(unread.map(item => item.id))}>Mark all read</button>
          <button type="button" className="btn btn-link" onClick={() => { setOpen(false); history.push('/notifications'); }}>Open activity page</button>
        </div>
        <div className="ap-notification-feed-drawer">
          {notifications.length ? notifications.map(notification => {
            const isUnread = Number(notification.is_read) === 0;
            return <button type="button" className={`ap-notification-card${isUnread ? ' is-unread' : ''}`} key={notification.id} onClick={() => openNotification(notification)}>
              <span className="ap-notification-card-icon" aria-hidden="true"><i className={notification.icon || 'bx bx-bell'} /></span>
              <span className="ap-notification-card-copy"><strong>{notification.title || notification.notification || 'Workspace update'}</strong>{notification.message && notification.message !== notification.notification ? <span>{notification.message}</span> : null}<small>{notification.time || notification.created_at || (isUnread ? 'Unread' : 'Read')}</small></span>
              <span className="ap-notification-chevron" aria-hidden="true">›</span>
            </button>;
          }) : <div className="ap-drawer-empty"><i className="bx bx-bell-off" aria-hidden="true" /><strong>No notifications yet</strong><span>Decision, document and security updates will appear here.</span></div>}
        </div>
      </aside>
    </div>
  );
};

export default connect(state => ({ list: state.notificationList }), { getNotificationCount, getNotificationList, markNotificationsAsRead })(withRouter(NotificationDrawer));
