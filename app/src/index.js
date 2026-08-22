import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import counterpart from 'counterpart';
import en from './_locale/en';
import de from './_locale/de';
import { getStoredToken } from './_utils/authToken';

import App from './components/App';
import AppErrorBoundary from './components/general/AppErrorBoundary';
import reducers from './reducers';
import RequireInvestorAuth from './components/_auth/RequireInvestorAuth';
import RequireNoAuth from './components/_auth/RequireNoAuth';
import RequireVerification from './components/_auth/RequireVerfication';

const Signup = React.lazy(() => import('./components/user/Signup'));
const SignUpActivated = React.lazy(() => import('./components/user/signup/Activated'));
const ConfirmEmail = React.lazy(() => import('./components/user/signup/ConfirmEmail'));
const Confirmation = React.lazy(() => import('./components/user/signup/Confirmation'));
const Approval = React.lazy(() => import('./components/user/signup/Approval'));
const Login = React.lazy(() => import('./components/user/Login'));
const ForgotPassword = React.lazy(() => import('./components/user/ForgotPassword'));
const SetPassword = React.lazy(() => import('./components/user/SetPassword'));
const Signout = React.lazy(() => import('./components/user/Signout'));
const ChangePassword = React.lazy(() => import('./components/user/signup/ChangePassword'));
const PasswordChangeSuccess = React.lazy(() => import('./components/general/PasswordChangeSuccess'));
const TermsCondition = React.lazy(() => import('./components/general/TermsCondition'));
const ProductsList = React.lazy(() => import('./components/products/List'));
const AddProduct = React.lazy(() => import('./components/products/Add'));
const EditProduct = React.lazy(() => import('./components/products/Edit'));
const InvestedList = React.lazy(() => import('./components/products/InvestedList'));
const AppliedList = React.lazy(() => import('./components/products/AppliedList'));
const ViewProduct = React.lazy(() => import('./components/products/View'));
const ApplicationList = React.lazy(() => import('./components/products/applications/List'));
const Notifications = React.lazy(() => import('./components/notifications/List'));
const ListCreditRequest = React.lazy(() => import('./components/credits/ListCreditRequests'));
const DetailCreditRequest = React.lazy(() => import('./components/credits/DetailCreditRequest'));
const CreditorDetail = React.lazy(() => import('./components/credits/CreditorDetail'));
const ViewProfile = React.lazy(() => import('./components/user/profile/ViewProfile'));
const EditProfile = React.lazy(() => import('./components/user/profile/EditProfile'));
const UnverifiedPage = React.lazy(() => import('./components/general/UnverfiedPage'));
const NoMatch = React.lazy(() => import('./components/general/NoMatch'));

counterpart.registerTranslations('en', en);
counterpart.registerTranslations('de', de);
counterpart.setLocale(localStorage.getItem('language') || navigator.language.split('-')[0] || 'de');

const store = createStore(
  reducers,
  { auth: { authenticated: getStoredToken() } },
  applyMiddleware(reduxThunk)
);

const AuthProductsList = RequireInvestorAuth(RequireVerification(ProductsList));
const AuthAddProduct = RequireInvestorAuth(RequireVerification(AddProduct));
const AuthEditProduct = RequireInvestorAuth(RequireVerification(EditProduct));
const AuthInvestedList = RequireInvestorAuth(RequireVerification(InvestedList));
const AuthAppliedList = RequireInvestorAuth(AppliedList);
const AuthViewProduct = RequireInvestorAuth(ViewProduct);
const AuthApplicationList = RequireInvestorAuth(ApplicationList);
const AuthDetailCreditRequest = RequireInvestorAuth(DetailCreditRequest);
const AuthNotifications = RequireInvestorAuth(Notifications);
const AuthCreditorDetail = RequireInvestorAuth(CreditorDetail);
const AuthCreditRequests = RequireInvestorAuth(RequireVerification(ListCreditRequest));
const AuthViewProfile = RequireInvestorAuth(ViewProfile);
const AuthEditProfile = RequireInvestorAuth(EditProfile);
const AuthUnverified = RequireInvestorAuth(UnverifiedPage);
const AuthNoMatch = RequireInvestorAuth(NoMatch);

const routePropsWithState = (props, routeState) => ({
  ...props,
  location: {
    ...props.location,
    state: { ...(props.location.state || {}), ...routeState }
  }
});

const routeId = value => encodeURIComponent(String(value || ''));
const legacyState = props => props.location && props.location.state ? props.location.state : {};

const LoadingRoute = () => (
  <div className="data-loading" role="status" aria-live="polite">Loading workspace…</div>
);

ReactDOM.render(
  <Provider store={store}>
    <AppErrorBoundary>
      <BrowserRouter>
        <React.Suspense fallback={<LoadingRoute />}>
          <Switch>
            <Route path="/login" exact component={RequireNoAuth(Login)} />
            <Route path="/set-password/:token" exact component={RequireNoAuth(SetPassword)} />
            <Route path="/forgot-password" exact component={RequireNoAuth(ForgotPassword)} />
            <Route path="/logout" exact component={RequireInvestorAuth(Signout)} />
            <Route path="/signup" exact component={RequireNoAuth(Signup)} />
            <Route path="/change-password" component={RequireInvestorAuth(ChangePassword)} />
            <Route path="/signup/activated" exact component={SignUpActivated} />
            <Route path="/signup/confirm-email" exact component={ConfirmEmail} />
            <Route path="/signup/confirmation" exact component={Confirmation} />
            <Route path="/confirm/:hash" exact component={Approval} />
            <Route path="/password-change-success" component={PasswordChangeSuccess} />
            <Route path="/terms-and-conditions" component={TermsCondition} />

            <App>
              <Switch>
                <Route path="/" exact component={AuthProductsList} />
                <Route exact path="/products" component={AuthProductsList} />
                <Route exact path="/opportunities" render={() => <Redirect to="/products" />} />
                <Route exact path="/opportunities/new" component={AuthAddProduct} />
                <Route
                  exact
                  path="/opportunities/:productId/edit"
                  render={props => <AuthEditProduct {...routePropsWithState(props, { id: props.match.params.productId })} />}
                />
                <Route
                  exact
                  path="/opportunities/:productId"
                  render={props => <AuthViewProduct {...routePropsWithState(props, { id: props.match.params.productId })} />}
                />
                <Route path="/add-product" component={AuthAddProduct} />
                <Route
                  exact
                  path="/edit-product"
                  render={props => {
                    const id = legacyState(props).id;
                    return id ? <Redirect to={`/opportunities/${routeId(id)}/edit`} /> : <AuthEditProduct {...props} />;
                  }}
                />
                <Route
                  exact
                  path="/product"
                  render={props => {
                    const id = legacyState(props).id;
                    return id ? <Redirect to={`/opportunities/${routeId(id)}`} /> : <AuthViewProduct {...props} />;
                  }}
                />
                <Route exact path="/products-invested" component={AuthInvestedList} />
                <Route exact path="/positions" render={() => <Redirect to="/products-invested" />} />
                <Route
                  exact
                  path="/positions/:productId/:applicationId"
                  render={props => <AuthCreditorDetail {...routePropsWithState(props, {
                    productId: props.match.params.productId,
                    appId: props.match.params.applicationId,
                    pId: props.match.params.productId,
                    aId: props.match.params.applicationId
                  })} />}
                />
                <Route exact path="/products-applications" component={AuthAppliedList} />
                <Route exact path="/product/applications" component={AuthApplicationList} />
                <Route exact path="/credit-request" component={AuthCreditRequests} />
                <Route exact path="/credit-requests" render={() => <Redirect to="/credit-request" />} />
                <Route
                  exact
                  path="/credit-requests/:productId/:applicationId"
                  render={props => <AuthDetailCreditRequest {...routePropsWithState(props, {
                    productId: props.match.params.productId,
                    appId: props.match.params.applicationId,
                    pId: props.match.params.productId,
                    aId: props.match.params.applicationId
                  })} />}
                />
                <Route
                  path="/application"
                  render={props => {
                    const state = legacyState(props);
                    const productId = state.pId || state.productId;
                    const applicationId = state.aId || state.appId;
                    return productId && applicationId
                      ? <Redirect to={`/credit-requests/${routeId(productId)}/${routeId(applicationId)}`} />
                      : <AuthDetailCreditRequest {...props} />;
                  }}
                />
                <Route
                  exact
                  path="/creditor/detail"
                  render={props => {
                    const state = legacyState(props);
                    const productId = state.pId || state.productId;
                    const applicationId = state.aId || state.appId;
                    return productId && applicationId
                      ? <Redirect to={`/positions/${routeId(productId)}/${routeId(applicationId)}`} />
                      : <AuthCreditorDetail {...props} />;
                  }}
                />
                <Route exact path="/notifications" component={AuthNotifications} />
                <Route path="/user/profile" component={AuthViewProfile} />
                <Route path="/user/edit-profile" component={AuthEditProfile} />
                <Route path="/account-unverified" component={AuthUnverified} />
                <Route component={AuthNoMatch} />
              </Switch>
            </App>
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    </AppErrorBoundary>
  </Provider>,
  document.querySelector('#root')
);
