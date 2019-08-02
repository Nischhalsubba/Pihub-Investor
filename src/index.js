import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from './App';
import reducers from './reducers';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Test from './components/general/Test';
const store = createStore(reducers, applyMiddleware(reduxThunk));
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/" exact component={Signup} />
      <Route path="/login" exact component={Login} />
      <Switch>
        <App>
          <Route path="/test" component={Test} />
        </App>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root')
);
