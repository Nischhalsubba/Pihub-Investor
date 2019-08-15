import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from './App';
import reducers from './reducers';

// Signup related imports
import Signup from './components/auth/signup/Signup';
import SignUpActivated from './components/auth/signup/Activated';
import ConfirmEmail from './components/auth/signup/ConfirmEmail';
import Confirmation from './components/auth/signup/Confirmation';
import Approval from './components/auth/signup/Approval';

import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import SetPassword from './components/auth/SetPassword';
import Signout from './components/auth/Signout';

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
        <Route path="/logout" exact component={Signout} />

        {/** --- signup related routes --- */}
        <Route path="/" exact component={Signup} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signup/activated" exact component={SignUpActivated} />
        <Route path="/signup/confirm-email" exact component={ConfirmEmail} />
        <Route path="/signup/confirmation" exact component={Confirmation} />
        <Route path="/signup/approval" exact component={Approval} />        
        {/** --- end of signup related routes --- */}
        <App>

          {/** --- products related routes --- */}
          <Route path="/products" component={ProductList} />
          <Route path="/add-product" component={AddProduct} />
          <Route path="/edit-product" component={EditProduct} />
          <Route path="/products-invested" component={InvestedList} />
          <Route path="/products-applications" component={AppliedList} />
          <Route path="/product/" component={ViewProduct} />
          {/** --- product aplications related routes --- */}
          <Route path="/product/applications" component={Applicationlist} />
          <Route path="/application" component={ViewApplication} />        
          {/** --- end of signup related routes --- */}

          <Route path="/notifications" component={Notifications} />
        </App>
        
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root')
);
