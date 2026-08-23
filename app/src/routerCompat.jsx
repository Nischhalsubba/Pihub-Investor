import React, { useContext, useEffect, useMemo } from 'react';
import * as Router from 'react-router-dom-v6';

const normalizeTo = to => {
  if (!to || typeof to !== 'object') return { target: to, state: undefined };
  const { state, ...target } = to;
  return { target, state };
};

export const Link = React.forwardRef(({ to, state, ...props }, ref) => {
  const normalized = normalizeTo(to);
  return <Router.Link ref={ref} to={normalized.target} state={state === undefined ? normalized.state : state} {...props} />;
});
Link.displayName = 'CompatLink';

export const NavLink = React.forwardRef(({ to, state, ...props }, ref) => {
  const normalized = normalizeTo(to);
  return <Router.NavLink ref={ref} to={normalized.target} state={state === undefined ? normalized.state : state} {...props} />;
});
NavLink.displayName = 'CompatNavLink';

const useLegacyHistory = () => {
  const navigate = Router.useNavigate();
  return useMemo(() => ({
    push: (to, state) => navigate(to, { state }),
    replace: (to, state) => navigate(to, { replace: true, state }),
    goBack: () => navigate(-1),
    goForward: () => navigate(1),
    go: delta => navigate(delta)
  }), [navigate]);
};

export const useHistory = useLegacyHistory;
export const useLocation = Router.useLocation;
export const useParams = Router.useParams;
export const BrowserRouter = Router.BrowserRouter;

export const Redirect = ({ to, push = false }) => {
  const normalized = normalizeTo(to);
  return <Router.Navigate to={normalized.target} state={normalized.state} replace={!push} />;
};

export const withRouter = Component => {
  const Wrapped = props => {
    const history = useLegacyHistory();
    const location = Router.useLocation();
    const params = Router.useParams();
    return <Component {...props} history={history} location={location} match={{ params }} />;
  };
  Wrapped.displayName = `withRouter(${Component.displayName || Component.name || 'Component'})`;
  return Wrapped;
};

/*
 * Router v6 no longer exposes the v5 <Prompt> API. This compatibility layer
 * blocks SPA push/replace navigation and pairs with the form's beforeunload
 * guard, keeping unsaved work protected without binding the rest of the app
 * to an obsolete router.
 */
export const Prompt = ({ when, message }) => {
  const navigation = useContext(Router.UNSAFE_NavigationContext);
  useEffect(() => {
    if (!when || !navigation || !navigation.navigator) return undefined;
    const navigator = navigation.navigator;
    const originalPush = navigator.push;
    const originalReplace = navigator.replace;
    const confirm = () => typeof window === 'undefined' || window.confirm(typeof message === 'function' ? message() : message);

    navigator.push = (...args) => { if (confirm()) originalPush.apply(navigator, args); };
    navigator.replace = (...args) => { if (confirm()) originalReplace.apply(navigator, args); };
    return () => {
      navigator.push = originalPush;
      navigator.replace = originalReplace;
    };
  }, [navigation, message, when]);
  return null;
};

export const Route = Router.Route;
export const Routes = Router.Routes;
export const Outlet = Router.Outlet;
export const Navigate = Router.Navigate;
