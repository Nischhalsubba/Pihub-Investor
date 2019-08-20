import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import user from './user';
import productsList from './productsList';
import creditRequests from './creditRequests';
import errors from './errors';
const rootReducer = combineReducers({
  user,
  auth,
  productsList,
  creditRequests,
  errors,
  form: formReducer
});

export default rootReducer;
