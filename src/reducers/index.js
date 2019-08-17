import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import auth from './auth';
import user from './user';
import productsList from './productsList';

const rootReducer = combineReducers({
    user,
    auth,
    productsList,
    form: formReducer
});

export default rootReducer;
