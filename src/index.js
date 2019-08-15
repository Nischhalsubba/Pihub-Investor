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

//Product related imports
import ProductList from './components/products/List';
import AddProducts from './components/products/Add';

//Notification related imports
import Notifications from './components/notifications/List';

const store = createStore(reducers, applyMiddleware(reduxThunk));
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Signup} />
        <Route path="/login" exact component={Login} />
        {/** --- signup related routes --- */}
        <Route path="/signup/activated" exact component={SignUpActivated} />
        <Route path="/signup/confirm-email" exact component={ConfirmEmail} />
        <Route path="/signup/confirmation" exact component={Confirmation} />
        <Route path="/signup/approval" exact component={Approval} />        
        {/** --- end of signup related routes --- */}
        <App>
          <Route path="/products" component={ProductList} />
          <Route path="/add_product" component={AddProducts} />
          <Route path="/notifications" component={Notifications} />
        </App>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root')
);
