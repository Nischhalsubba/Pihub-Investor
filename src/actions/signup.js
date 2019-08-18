import client from './index';
import { routes } from './../_api/routes';
import {
  AUTH_ERROR,
  AUTH_USER,
  GET_NOTIFICATION_COUNT,
  USER_DETAIL
} from './types';

export const signup = (detail, callback) => async dispatch => {
  try {
    console.log(detail);
    delete detail.agreed_term;
    if (detail.company_name) {
      delete detail.company_name;
    }
    const response = await client.post(routes.signup, detail);
    // localStorage.setItem('token', response.data.message.token);
    // dispatch({
    //   type: AUTH_USER,
    //   payload: response.data.message.token
    // });
    console.log(response);
    callback();
  } catch (e) {
    console.log(e);
    // dispatch({
    //   type: AUTH_ERROR,
    //   payload: `${e.response.data.error}.`
    // });
  }
};
