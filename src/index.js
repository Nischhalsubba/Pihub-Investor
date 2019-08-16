import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from './App';
import reducers from './reducers';
import NoMatch from './components/general/NoMatch';
import RequireInvestorAuth from './components/_auth/RequireInvestorAuth';

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
import ProductList from './components/products/List';
import AddProduct from './components/products/Add';
import EditProduct from './components/products/Edit';
import InvestedList from './components/products/InvestedList';
import AppliedList from './components/products/AppliedList';
import ViewProduct from './components/products/View';
//Product application related imports
import Applicationlist from './components/products/applications/List';
import ViewApplication from './components/products/applications/View';

//Notification related imports
import Notifications from './components/notifications/List';

const store = createStore(reducers, applyMiddleware(reduxThunk));
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/password-set" exact component={SetPassword} />
        <Route path="/forgot-password" exact component={ForgotPassword} />
        <Route path="/logout" exact component={RequireInvestorAuth(Signout)} />
        {/** --- signup related routes --- */}
        <Route path="/" exact component={Signup} />
        <Route path="/signup" exact component={Signup} />
        {/** --- start: signup protected routes (auth for these routes handled within component itself) --- */}
        <Route path="/signup/activated" exact component={SignUpActivated} />{/** Logged in and activated accounts investors only*/}
        <Route path="/signup/confirm-email" exact component={ConfirmEmail} /> {/** Logged in (there should be a token) and unconfirmed accounts only*/}
        <Route path="/signup/confirmation" exact component={Confirmation} /> {/** Logged in (there should be a token) and unconfirmed accounts only*/}
        <Route path="/signup/approval" exact component={Approval} /> {/** Logged in (there should be a token) - confirmed but waiting to e approved accounts only*/}
        {/** --- end: signup protected routes --- */}
        {/** --- end: signup related routes --- */}
        <App>
          {/** --- products related routes --- */}
          <Route path="/products" component={RequireInvestorAuth(ProductList)} />
          <Route path="/add-product" component={RequireInvestorAuth(AddProduct)} />
          <Route path="/edit-product" component={RequireInvestorAuth(EditProduct)} />
          <Route path="/products-invested" component={RequireInvestorAuth(InvestedList)} />
          <Route path="/products-applications" component={RequireInvestorAuth(AppliedList)} />
          <Route path="/product/" component={RequireInvestorAuth(ViewProduct)} />
          {/** --- product aplications related routes --- */}
          <Route path="/product/applications" component={RequireInvestorAuth(Applicationlist)} />
          <Route path="/application" component={RequireInvestorAuth(ViewApplication)} />
          {/** --- end of product related routes --- */}
          <Route path="/notifications" component={RequireInvestorAuth(Notifications)} />
        </App>
        <Route component={NoMatch} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root')
);
