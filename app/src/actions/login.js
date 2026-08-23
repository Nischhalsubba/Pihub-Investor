import client from './index';
import { routes } from './../_api/routes';
import { AUTH_ERROR, AUTH_USER, SCOPE } from './types';
import { clearStoredToken, decodeJwtPayload, normalizeToken, setStoredToken } from '../_utils/authToken';
import { getApiErrorMessage } from '../_utils/api';

function extractToken(response) {
  const data = response && response.data;
  const candidates = [
    data && data.message && data.message.token,
    data && data.data && data.data.token,
    data && data.token,
    data && data.access_token
  ];

  for (let index = 0; index < candidates.length; index += 1) {
    const token = normalizeToken(candidates[index]);
    if (token) return token;
  }
  return null;
}

export const signin = ({ email, password }, callback) => async dispatch => {
  dispatch({ type: AUTH_ERROR, payload: '' });

  try {
    const response = await client.post(routes.login, { email, password });
    const token = extractToken(response);

    if (!token) {
      clearStoredToken();
      dispatch({ type: AUTH_USER, payload: undefined });
      dispatch({ type: AUTH_ERROR, payload: 'Sign-in succeeded, but the server did not return a usable session token.' });
      return;
    }

    const payload = decodeJwtPayload(token);
    const scopes = payload && Array.isArray(payload.scopes) ? payload.scopes : [];
    setStoredToken(token);
    dispatch({ type: SCOPE, payload: scopes[0] !== 'unconfirmed_scope' });
    dispatch({ type: AUTH_USER, payload: token });
  } catch (error) {
    clearStoredToken();
    dispatch({ type: AUTH_USER, payload: undefined });
    dispatch({
      type: AUTH_ERROR,
      payload: getApiErrorMessage(error, 'Unable to reach the sign-in service. Please try again in a moment.')
    });
    return;
  }

  callback();
};

export const logout = callback => async dispatch => {
  clearStoredToken();
  dispatch({ type: AUTH_USER, payload: undefined });
  callback();
};
