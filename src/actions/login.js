import client from './index';
import { routes } from './../_api/routes';
import {
  AUTH_ERROR,
  AUTH_USER,
  GET_NOTIFICATION_COUNT,
  USER_DETAIL
} from './types';
export const signin = ({ email, password }, callback) => async dispatch => {
  try {
    const response = await client.post(routes.login, {
      email,
      password
    });

    localStorage.setItem('token', response.data.message.token);
    dispatch({
      type: AUTH_USER,
      payload: response.data.message.token
    });
    callback();
  } catch (e) {
    dispatch({
      type: AUTH_ERROR,
      payload: `${e.response.data.error}.`
    });
  }
};
