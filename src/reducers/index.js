import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import auth from './auth';
import user from './user';

const rootReducer = combineReducers({
    user,
    auth,
    form: formReducer
});

export default rootReducer;
