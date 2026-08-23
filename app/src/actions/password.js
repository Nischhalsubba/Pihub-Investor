import client from './index';
import { routes } from './../_api/routes';
import { ERROR, AUTH_USER } from './types';
import { clearStoredToken } from '../_utils/authToken';
import { getApiErrorMessage } from '../_utils/api';

const tokenFrom = response => {
  const data = response && response.data;
  return (data && data.token) || (data && data.data && data.data.token) || (data && data.message && data.message.token) || null;
};

export const getTokenForEmail = (email, callback) => async dispatch => {
  dispatch({ type: ERROR, payload: null });
  try {
    const response = await client.post(routes.passwordReset, email);
    const token = tokenFrom(response);
    if (!token) throw new Error('The recovery service did not return a reset token.');
    callback(token);
    return token;
  } catch (error) {
    dispatch({ type: ERROR, payload: [getApiErrorMessage(error, 'Unable to start password recovery.')] });
    return null;
  }
};

export const changePasswordWithToken = (details, callback) => async dispatch => {
  dispatch({ type: ERROR, payload: null });
  try {
    await client.post(routes.changePasswordWithToken, details);
    clearStoredToken();
    dispatch({ type: AUTH_USER, payload: undefined });
    callback();
    return true;
  } catch (error) {
    dispatch({ type: ERROR, payload: [getApiErrorMessage(error, 'Unable to update the password.')] });
    return false;
  }
};
