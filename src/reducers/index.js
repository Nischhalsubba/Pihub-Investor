import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import user from './user';
import productsList from './productsList';
import creditRequests from './creditRequests';
import notificationCount from './notificationCount';
import errors from './errors';
const rootReducer = combineReducers({
  user,
  auth,
  productsList,
  creditRequests,
  errors,
  notificationCount,
  form: formReducer
});

export default rootReducer;
