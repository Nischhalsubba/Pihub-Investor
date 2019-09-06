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
import industryList from './industryList';
import applicationList from './applicationList';
import applicationDetail from './applicationDetail';
import investment from './investment';
import language from './language';
import creditorDetail from './creditorDetail';
const rootReducer = combineReducers({
  user,
  auth,
  language,
  productsList,
  singleProduct,
  creditRequests,
  errors,
  notificationCount,
  notificationList,
  pagination,
  industryList,
  applicationList,
  applicationDetail,
  investment,
  creditorDetail,
  form: formReducer
});

export default rootReducer;
