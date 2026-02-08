import client from './index';
import { routes } from './../_api/routes';
import { ERROR, AUTH_USER } from '../actions/types';
export const getTokenForEmail = (email, callback) => async dispatch => {
  try {
    const response = await client.post(routes.passwordReset, email);

    if (response) {
      callback(response.data.token);
    }
  } catch (e) {

    if (e.response.data.errors) {
      dispatch({
        type: ERROR,
        payload: e.response.data.errors
      })
    } else {
      dispatch({
        type: ERROR,
        payload: [e.response.data.message]
      })

    }

  }
};

export const changePasswordWithToken = (details, callback) => async dispatch => {
  try {
    const response = await client.post(routes.changePasswordWithToken, details);
    if (response) {
      localStorage.removeItem('token');
      dispatch({
        type: AUTH_USER,
        payload: undefined
      });
      callback();
    }
  } catch (e) {
    console.log(e.response.data.errors);
    dispatch({
      type: ERROR,
      payload: e.response.data.errors
    })
  }
}
