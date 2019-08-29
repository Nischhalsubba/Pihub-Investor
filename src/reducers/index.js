import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import user from './user';
import productsList from './productsList';
import singleProduct from './singleProduct';
import creditRequests from './creditRequests';
import notificationCount from './notificationCount';
import notificationList from './notificationList';
import errors from './errors';
import pagination from './pagination';
const rootReducer = combineReducers({
  user,
  auth,
  productsList,
  singleProduct,
  creditRequests,
  errors,
  notificationCount,
  notificationList,
  pagination,
  form: formReducer
});

export default rootReducer;
