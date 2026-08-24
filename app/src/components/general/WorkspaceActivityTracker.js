import { useEffect } from 'react';
import { useLocation } from 'react-router-dom-v6';
import { rememberWorkspaceItem } from '../../_utils/workspacePreferences';

const routeMeta = pathname => {
  if (pathname === '/' || pathname === '/dashboard') return { type: 'page', label: 'Overview', meta: 'Investor workspace' };
  if (pathname === '/products') return { type: 'page', label: 'Opportunity book', meta: 'All opportunities' };
  if (pathname === '/credit-request') return { type: 'page', label: 'Credit requests', meta: 'Decision queue' };
  if (pathname === '/products-invested') return { type: 'page', label: 'Invested positions', meta: 'Portfolio exposure' };
  if (pathname === '/user/profile') return { type: 'page', label: 'Institution profile', meta: 'Identity and governance' };
  if (pathname === '/user/edit-profile') return { type: 'page', label: 'Edit institution profile', meta: 'Institution settings' };
  if (pathname === '/notifications') return { type: 'page', label: 'Notifications', meta: 'Workspace activity' };
  if (pathname === '/opportunities/new') return { type: 'action', label: 'Register opportunity', meta: 'New opportunity' };
  if (/^\/opportunities\/[^/]+$/.test(pathname)) {
    const id = decodeURIComponent(pathname.split('/').pop());
    return { type: 'opportunity', label: `Opportunity ${id}`, meta: 'Opportunity record' };
  }
  if (/^\/credit-requests\/[^/]+\/[^/]+$/.test(pathname)) {
    const parts = pathname.split('/').filter(Boolean);
    return { type: 'credit', label: `Credit request ${decodeURIComponent(parts[2])}`, meta: `Opportunity ${decodeURIComponent(parts[1])}` };
  }
  if (/^\/positions\/[^/]+\/[^/]+$/.test(pathname)) {
    const parts = pathname.split('/').filter(Boolean);
    return { type: 'position', label: `Position ${decodeURIComponent(parts[2])}`, meta: `Opportunity ${decodeURIComponent(parts[1])}` };
  }
  return null;
};

const WorkspaceActivityTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const meta = routeMeta(location.pathname);
    if (!meta) return;
    rememberWorkspaceItem({ ...meta, path: `${location.pathname}${location.search || ''}` });
  }, [location.pathname, location.search]);

  return null;
};

export default WorkspaceActivityTracker;
