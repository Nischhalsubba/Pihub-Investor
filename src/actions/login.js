import client from './index';
import { routes } from './../_api/routes';
import { AUTH_ERROR, AUTH_USER, SCOPE } from './types';

function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map(character =>
          `%${('00' + character.charCodeAt(0).toString(16)).slice(-2)}`
        )
        .join('')
    );

    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

export const signin = ({ email, password }, callback) => async dispatch => {
  try {
    const response = await client.post(routes.login, {
      email,
      password
    });
    const payload = decodeJwtPayload(response.data.message.token);
    const scopes = payload && Array.isArray(payload.scopes) ? payload.scopes : [];
    const verfied = scopes[0] !== 'unconfirmed_scope';

    localStorage.setItem('token', response.data.message.token);
    dispatch({
      type: SCOPE,
      payload: verfied
    });
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

export const logout = callback => async dispatch => {
  localStorage.removeItem('token');
  dispatch({
    type: AUTH_USER,
    payload: undefined
  });
  callback();
};