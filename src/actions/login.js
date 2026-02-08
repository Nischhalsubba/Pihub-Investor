import jwt from 'jsonwebtoken';

import client from './index';
import { routes } from './../_api/routes';
import { AUTH_ERROR, AUTH_USER, SCOPE } from './types';
export const signin = ({ email, password }, callback) => async dispatch => {
  try {
    const response = await client.post(routes.login, {
      email,
      password
    });
    const { scopes } = jwt.decode(response.data.message.token);
    let verfied;
    if (scopes[0] === 'unconfirmed_scope') {
      verfied = false
    } else {
      verfied = true
    }
    localStorage.setItem('token', response.data.message.token);
    dispatch({
      type: SCOPE,
      payload: verfied
    })
    dispatch({
      type: AUTH_USER,
      payload: response.data.message.token
    });
    callback();
  } catch (e) {
    const errorMessage =
      (e && e.response && e.response.data && e.response.data.error) ||
      'Unable to sign in. Please try again.';
    dispatch({
      type: AUTH_ERROR,
      payload: `${errorMessage}.`
    });
  }
};

export const logout = callback => async dispatch => {
  localStorage.removeItem('token');
  dispatch({
    type: AUTH_USER,
    payload: undefined
  });
  callback();
};
