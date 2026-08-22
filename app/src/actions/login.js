import client from './index';
import { routes } from './../_api/routes';
import { AUTH_ERROR, AUTH_USER, SCOPE } from './types';
import { decodeJwtPayload, normalizeToken } from '../_utils/authToken';

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
    if (token) {
      return token;
    }
  }

  return null;
}

function getErrorText(value) {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    if (typeof value.message === 'string') {
      return value.message;
    }
    if (typeof value.error === 'string') {
      return value.error;
    }
    if (typeof value.detail === 'string') {
      return value.detail;
    }
  }

  return '';
}

function getSigninErrorMessage(error) {
  const responseData = error && error.response && error.response.data;
  const candidates = [
    responseData && responseData.error,
    responseData && responseData.message,
    responseData && responseData.errors,
    error && error.message
  ];

  for (let index = 0; index < candidates.length; index += 1) {
    const message = getErrorText(candidates[index]);
    if (message) {
      return message;
    }
  }

  return 'Unable to reach the sign-in service. Please try again in a moment.';
}

export const signin = ({ email, password }, callback) => async dispatch => {
  dispatch({
    type: AUTH_ERROR,
    payload: ''
  });

  let token;

  try {
    const response = await client.post(routes.login, {
      email,
      password
    });

    token = extractToken(response);
    if (!token) {
      localStorage.removeItem('token');
      dispatch({ type: AUTH_USER, payload: undefined });
      dispatch({
        type: AUTH_ERROR,
        payload: 'Sign-in succeeded, but the server did not return a usable session token.'
      });
      return;
    }

    const payload = decodeJwtPayload(token);
    const scopes = payload && Array.isArray(payload.scopes) ? payload.scopes : [];
    const verified = scopes[0] !== 'unconfirmed_scope';

    localStorage.setItem('token', token);
    dispatch({
      type: SCOPE,
      payload: verified
    });
    dispatch({
      type: AUTH_USER,
      payload: token
    });
  } catch (e) {
    localStorage.removeItem('token');
    dispatch({ type: AUTH_USER, payload: undefined });
    dispatch({
      type: AUTH_ERROR,
      payload: getSigninErrorMessage(e)
    });
    return;
  }

  // Keep navigation outside the request try/catch. A render failure after a
  // successful sign-in must not be misreported as an authentication failure.
  callback();
};

export const logout = callback => async dispatch => {
  localStorage.removeItem('token');
  dispatch({
    type: AUTH_USER,
    payload: undefined
  });
  callback();
};
