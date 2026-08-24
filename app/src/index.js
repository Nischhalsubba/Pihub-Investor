import React, { Suspense, lazy, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom-v6';
import { getStoredToken } from './_utils/authToken';
import { initializeLocale } from './_utils/locale';
import { AUTH_USER } from './actions/types';

import App from './components/App';
import AppErrorBoundary from './components/general/AppErrorBoundary';
import WorkspaceSkeleton from './components/general/WorkspaceSkeleton';
import reducers from './reducers';
import RequireInvestorAuth from './components/_auth/RequireInvestorAuth';
import RequireNoAuth from './components/_auth/RequireNoAuth';
import RequireVerification from './components/_auth/RequireVerfication';

const Signup = lazy(() => import('./components/user/Signup'));
const SignUpActivated = lazy(() => import('./components/user/signup/Activated'));
const ConfirmEmail = lazy(() => import('./components/user/signup/ConfirmEmail'));
const Confirmation = lazy(() => import('./components/user/signup/Confirmation'));
const Approval = lazy(() => import('./components/user/signup/Approval'));
const Login = lazy(() => import('./components/user/Login'));
const ForgotPassword = lazy(() => import('./components/user/ForgotPassword'));
const SetPassword = lazy(() => import('./components/user/SetPassword'));
const Signout = lazy(() => import('./components/user/Signout'));
const ChangePassword = lazy(() => import('./components/user/signup/ChangePassword'));
const PasswordChangeSuccess = lazy(() => import('./components/general/PasswordChangeSuccess'));
const TermsCondition = lazy(() => import('./components/general/TermsCondition'));
const Overview = lazy(() => import('./components/dashboard/Overview'));
const ProductsList = lazy(() => import('./components/products/List'));
const AddProduct = lazy(() => import('./components/products/Add'));
const EditProduct = lazy(() => import('./components/products/Edit'));
const InvestedList = lazy(() => import('./components/products/InvestedList'));
const AppliedList = lazy(() => import('./components/products/AppliedList'));
const ViewProduct = lazy(() => import('./components/products/View'));
const CompareOpportunities = lazy(() => import('./components/products/CompareOpportunities'));
const ApplicationList = lazy(() => import('./components/products/applications/List'));
const Notifications = lazy(() => import('./components/notifications/List'));
const ListCreditRequest = lazy(() => import('./components/credits/ListCreditRequests'));
const DetailCreditRequest = lazy(() => import('./components/credits/DetailCreditRequest'));
const CreditorDetail = lazy(() => import('./components/credits/CreditorDetail'));
const ViewProfile = lazy(() => import('./components/user/profile/ViewProfile'));
const EditProfile = lazy(() => import('./components/user/profile/EditProfile'));
const UnverifiedPage = lazy(() => import('./components/general/UnverfiedPage'));
const NoMatch = lazy(() => import('./components/general/NoMatch'));

initializeLocale();
const store = createStore(reducers, { auth: { authenticated: getStoredToken() } }, applyMiddleware(reduxThunk));
if (typeof window !== 'undefined') window.addEventListener('pihub:session-expired', () => store.dispatch({ type: AUTH_USER, payload: undefined }));

const AuthOverview = RequireInvestorAuth(RequireVerification(Overview));
const AuthProductsList = RequireInvestorAuth(RequireVerification(ProductsList));
const AuthAddProduct = RequireInvestorAuth(RequireVerification(AddProduct));
const AuthEditProduct = RequireInvestorAuth(RequireVerification(EditProduct));
const AuthInvestedList = RequireInvestorAuth(RequireVerification(InvestedList));
const AuthAppliedList = RequireInvestorAuth(AppliedList);
const AuthViewProduct = RequireInvestorAuth(ViewProduct);
const AuthCompareOpportunities = RequireInvestorAuth(RequireVerification(CompareOpportunities));
const AuthApplicationList = RequireInvestorAuth(ApplicationList);
const AuthDetailCreditRequest = RequireInvestorAuth(DetailCreditRequest);
const AuthNotifications = RequireInvestorAuth(Notifications);
const AuthCreditorDetail = RequireInvestorAuth(CreditorDetail);
const AuthCreditRequests = RequireInvestorAuth(RequireVerification(ListCreditRequest));
const AuthViewProfile = RequireInvestorAuth(ViewProfile);
const AuthEditProfile = RequireInvestorAuth(EditProfile);
const AuthUnverified = RequireInvestorAuth(UnverifiedPage);
const AuthNoMatch = RequireInvestorAuth(NoMatch);
const AuthChangePassword = RequireInvestorAuth(ChangePassword);
const AuthSignout = RequireInvestorAuth(Signout);

const LoadingRoute = () => <WorkspaceSkeleton compact />;

const LegacyElement = ({ Component, routeState }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const history = useMemo(() => ({
    push: (to, state) => navigate(to, { state }),
    replace: (to, state) => navigate(to, { replace: true, state }),
    goBack: () => navigate(-1),
    goForward: () => navigate(1),
    go: delta => navigate(delta)
  }), [navigate]);
  const extra = typeof routeState === 'function' ? routeState(params, location) : routeState;
  const routedLocation = extra ? { ...location, state: { ...(location.state || {}), ...extra } } : location;
  return <Component history={history} location={routedLocation} match={{ params }} />;
};

const LegacyOpportunity = ({ edit = false }) => {
  const location = useLocation();
  const id = location.state && location.state.id;
  return id ? <Navigate replace to={`/opportunities/${encodeURIComponent(String(id))}${edit ? '/edit' : ''}`} /> : <Navigate replace to="/products" />;
};
const LegacyApplication = ({ position = false }) => {
  const location = useLocation();
  const state = location.state || {};
  const productId = state.pId || state.productId;
  const applicationId = state.aId || state.appId;
  if (!productId || !applicationId) return <Navigate replace to={position ? '/products-invested' : '/credit-request'} />;
  return <Navigate replace to={`/${position ? 'positions' : 'credit-requests'}/${encodeURIComponent(String(productId))}/${encodeURIComponent(String(applicationId))}`} />;
};

const RouterTree = () => (
  <Suspense fallback={<LoadingRoute />}>
    <Routes>
      <Route path="/login" element={<LegacyElement Component={RequireNoAuth(Login)} />} />
      <Route path="/set-password/:token" element={<LegacyElement Component={RequireNoAuth(SetPassword)} />} />
      <Route path="/forgot-password" element={<LegacyElement Component={RequireNoAuth(ForgotPassword)} />} />
      <Route path="/signup" element={<LegacyElement Component={RequireNoAuth(Signup)} />} />
      <Route path="/signup/activated" element={<LegacyElement Component={SignUpActivated} />} />
      <Route path="/signup/confirm-email" element={<LegacyElement Component={ConfirmEmail} />} />
      <Route path="/signup/confirmation" element={<LegacyElement Component={Confirmation} />} />
      <Route path="/confirm/:hash" element={<LegacyElement Component={Approval} />} />
      <Route path="/password-change-success" element={<LegacyElement Component={PasswordChangeSuccess} />} />
      <Route path="/terms-and-conditions" element={<LegacyElement Component={TermsCondition} />} />

      <Route element={<App />}>
        <Route index element={<LegacyElement Component={AuthOverview} />} />
        <Route path="dashboard" element={<LegacyElement Component={AuthOverview} />} />
        <Route path="products" element={<LegacyElement Component={AuthProductsList} />} />
        <Route path="opportunities" element={<Navigate replace to="/products" />} />
        <Route path="opportunities/new" element={<LegacyElement Component={AuthAddProduct} />} />
        <Route path="opportunities/compare" element={<LegacyElement Component={AuthCompareOpportunities} />} />
        <Route path="opportunities/:productId/edit" element={<LegacyElement Component={AuthEditProduct} routeState={params => ({ id: params.productId })} />} />
        <Route path="opportunities/:productId" element={<LegacyElement Component={AuthViewProduct} routeState={params => ({ id: params.productId })} />} />
        <Route path="add-product" element={<Navigate replace to="/opportunities/new" />} />
        <Route path="edit-product" element={<LegacyOpportunity edit />} />
        <Route path="product" element={<LegacyOpportunity />} />
        <Route path="products-invested" element={<LegacyElement Component={AuthInvestedList} />} />
        <Route path="positions" element={<Navigate replace to="/products-invested" />} />
        <Route path="positions/:productId/:applicationId" element={<LegacyElement Component={AuthCreditorDetail} routeState={params => ({ productId: params.productId, appId: params.applicationId, pId: params.productId, aId: params.applicationId })} />} />
        <Route path="products-applications" element={<LegacyElement Component={AuthAppliedList} />} />
        <Route path="product/applications" element={<LegacyElement Component={AuthApplicationList} />} />
        <Route path="credit-request" element={<LegacyElement Component={AuthCreditRequests} />} />
        <Route path="credit-requests" element={<Navigate replace to="/credit-request" />} />
        <Route path="credit-requests/:productId/:applicationId" element={<LegacyElement Component={AuthDetailCreditRequest} routeState={params => ({ productId: params.productId, appId: params.applicationId, pId: params.productId, aId: params.applicationId })} />} />
        <Route path="application" element={<LegacyApplication />} />
        <Route path="creditor/detail" element={<LegacyApplication position />} />
        <Route path="notifications" element={<LegacyElement Component={AuthNotifications} />} />
        <Route path="user/profile" element={<LegacyElement Component={AuthViewProfile} />} />
        <Route path="user/edit-profile" element={<LegacyElement Component={AuthEditProfile} />} />
        <Route path="change-password" element={<LegacyElement Component={AuthChangePassword} />} />
        <Route path="logout" element={<LegacyElement Component={AuthSignout} />} />
        <Route path="account-unverified" element={<LegacyElement Component={AuthUnverified} />} />
        <Route path="*" element={<LegacyElement Component={AuthNoMatch} />} />
      </Route>
    </Routes>
  </Suspense>
);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppErrorBoundary>
        <BrowserRouter><RouterTree /></BrowserRouter>
      </AppErrorBoundary>
    </Provider>
  </React.StrictMode>
);
