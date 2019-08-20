import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import counterpart from 'counterpart';
import en from './_locale/en';
import de from './_locale/de';

import App from './components/App';
import reducers from './reducers';
import NoMatch from './components/general/NoMatch';
import RequireInvestorAuth from './components/_auth/RequireInvestorAuth';
import RequireNoAuth from './components/_auth/RequireNoAuth';

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
      authenticated: localStorage.getItem('token')
    }
  },
  applyMiddleware(reduxThunk)
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        {/** ___ Start: NO AUTH ROUTES --- Authenticated users should be redirected to home screen ---*/}
        <Route path="/login" exact component={RequireNoAuth(Login)} />
        <Route
          path="/password-set"
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
        <Route path="/signup/approval" exact component={Approval} />{' '}
        {/** Logged in (there should be a token) - confirmed but waiting to e approved accounts only*/}
        {/** --- End: signup protected routes ___ */}
        <App>
          {/** ___ Start: Authenticated User's routes --- */}
          <Route path="/" exact component={RequireInvestorAuth(ProductsList)} />
          <Route
            exact
            path="/products"
            component={RequireInvestorAuth(ProductsList)}
          />
          <Route
            path="/add-product"
            component={RequireInvestorAuth(AddProduct)}
          />
          <Route
            exact
            path="/edit-product"
            component={RequireInvestorAuth(EditProduct)}
          />
          <Route
            exact
            path="/products-invested"
            component={RequireInvestorAuth(InvestedList)}
          />
          <Route
            exact
            path="/products-applications"
            component={RequireInvestorAuth(AppliedList)}
          />
          <Route
            exact
            path="/product/"
            component={RequireInvestorAuth(ViewProduct)}
          />
          <Route
            exact
            path="/product/applications"
            component={RequireInvestorAuth(ApplicationList)}
          />
          <Route
            path="/application"
            component={RequireInvestorAuth(ViewApplication)}
          />
          <Route
            exact
            path="/notifications"
            component={RequireInvestorAuth(Notifications)}
          />
          {/* Credit requests related route definition */}
          <Route
            exact
            path="/credit-request"
            component={RequireInvestorAuth(ListCreditRequest)}
          />
          <Route
            exact
            path="/credit-request/detail"
            component={RequireInvestorAuth(DetailCreditRequest)}
          />
          {/** --- End: Authenticated User's routes ___ */}
        </App>
        <Route component={NoMatch} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root')
);
