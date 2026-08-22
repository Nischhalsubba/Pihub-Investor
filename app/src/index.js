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
import NoMatch from './components/general/NoMatch';
import TermsCondition from './components/general/TermsCondition';
import RequireInvestorAuth from './components/_auth/RequireInvestorAuth';
import RequireNoAuth from './components/_auth/RequireNoAuth';
import RequireVerification from './components/_auth/RequireVerfication';
// Sign-up related imports
import Signup from './components/user/Signup';
import SignUpActivated from './components/user/signup/Activated';
import ConfirmEmail from './components/user/signup/ConfirmEmail';
import Confirmation from './components/user/signup/Confirmation';
import Approval from './components/user/signup/Approval';

import Login from './components/user/Login';
import ForgotPassword from './components/user/ForgotPassword';
import SetPassword from './components/user/SetPassword';
import Signout from './components/user/Signout';

import ChangePassword from './components/user/signup/ChangePassword';
import PasswordChangeSuccess from './components/general/PasswordChangeSuccess';
//Product related imports
import ProductsList from './components/products/List';
import AddProduct from './components/products/Add';
import EditProduct from './components/products/Edit';
import InvestedList from './components/products/InvestedList';
import AppliedList from './components/products/AppliedList';
import ViewProduct from './components/products/View';
//Product application related imports
import ApplicationList from './components/products/applications/List';
import ViewApplication from './components/products/applications/View';

//Notification related imports
import Notifications from './components/notifications/List';
//Credit related
import ListCreditRequest from './components/credits/ListCreditRequests';
import DetailCreditRequest from './components/credits/DetailCreditRequest';
import CreditorDetail from './components/credits/CreditorDetail';
//Profile
import ViewProfile from './components/user/profile/ViewProfile';
import EditProfile from './components/user/profile/EditProfile';
import UnverifiedPage from './components/general/UnverfiedPage';
//End of component import
counterpart.registerTranslations('en', en);
counterpart.registerTranslations('de', de);
counterpart.setLocale(
  localStorage.getItem('language') || navigator.language.split('-')[0] || 'de'
);

const store = createStore(
  reducers,
  {
    auth: {
      authenticated: getStoredToken()
    }
  },
  applyMiddleware(reduxThunk)
);

ReactDOM.render(
  <Provider store={store}>
    <AppErrorBoundary>
      <BrowserRouter>
        <Switch>
          {/** ___ Start: NO AUTH ROUTES --- Authenticated users should be redirected to home screen ---*/}
          <Route path="/login" exact component={RequireNoAuth(Login)} />
          <Route
            path="/set-password/:token"
            exact
            component={RequireNoAuth(SetPassword)}
          />
          <Route
            path="/forgot-password"
            exact
            component={RequireNoAuth(ForgotPassword)}
          />
          <Route path="/logout" exact component={RequireInvestorAuth(Signout)} />
          <Route path="/signup" exact component={RequireNoAuth(Signup)} />
          <Route path='/change-password' component={RequireInvestorAuth(ChangePassword)} />
          {/** --- End: NO AUTH ROUTES --- Authenticated users should be redirected to home screen ___ */}
          {/** ___ Start: signup protected routes (auth for these routes handled within component itself) --- */}
          <Route path="/signup/activated" exact component={SignUpActivated} />
          {/** Logged in and activated accounts investors only*/}
          <Route
            path="/signup/confirm-email"
            exact
            component={ConfirmEmail}
          />{' '}
          {/** Logged in (there should be a token) and unconfirmed accounts only*/}
          <Route path="/signup/confirmation" exact component={Confirmation} />{' '}
          {/** Logged in (there should be a token) and unconfirmed accounts only*/}
          <Route path="/confirm/:hash" exact component={Approval} />{' '}
          {/** Logged in (there should be a token) - confirmed but waiting to e approved accounts only*/}
          <Route path='/password-change-success' component={PasswordChangeSuccess} />
          {/** --- End: signup protected routes ___ */}
          <Route path='/terms-and-conditions' component={TermsCondition} />

          <App>
            {/** ___ Start: Authenticated User's routes --- */}
            <Route path="/" exact component={RequireInvestorAuth(RequireVerification(ProductsList))} />
            <Route
              exact
              path="/products"
              component={RequireInvestorAuth(RequireVerification(ProductsList))}
            />
            <Route
              path="/add-product"
              component={RequireInvestorAuth(RequireVerification(AddProduct))}
            />
            <Route
              exact
              path="/edit-product"
              component={RequireInvestorAuth(RequireVerification(EditProduct))}
            />
            <Route
              exact
              path="/products-invested"
              component={RequireInvestorAuth(RequireVerification(InvestedList))}
            />
            <Route
              exact
              path="/products-applications"
              component={RequireInvestorAuth(AppliedList)}
            />
            <Route
              exact
              path="/product"
              component={RequireInvestorAuth(ViewProduct)}
            />
            <Route
              exact
              path="/product/applications"
              component={RequireInvestorAuth(ApplicationList)}
            />
            <Route
              path="/application"
              component={RequireInvestorAuth(DetailCreditRequest)}
            />
            <Route
              exact
              path="/notifications"
              component={RequireInvestorAuth(Notifications)}
            />
            {/* Credit requests related route definition */}
            <Route path="/creditor/detail" exact component={RequireInvestorAuth(CreditorDetail)} />
            <Route
              exact
              path="/credit-request"
              component={RequireInvestorAuth(RequireVerification(ListCreditRequest))}
            />
            {/* Profile */}
            <Route path='/user/profile' component={RequireInvestorAuth(ViewProfile)} />
            <Route path='/user/edit-profile' component={RequireInvestorAuth(EditProfile)} />
            <Route path='/account-unverified' component={RequireInvestorAuth(UnverifiedPage)} />
            {/* <Redirect from="/credit-request/detail" to="/product" /> */}
            {/** --- End: Authenticated User's routes ___ */}
          </App>
          {/* <Route component={NoMatch} /> */}
        </Switch>
      </BrowserRouter>
    </AppErrorBoundary>
  </Provider>,
  document.querySelector('#root')
);
