import client from './index';
import { routes } from './../_api/routes';
import { ERROR } from './types';

function collectMessages(value, messages) {
  if (value === null || value === undefined || value === '') {
    return;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    messages.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    value.forEach(item => collectMessages(item, messages));
    return;
  }

  if (typeof value === 'object') {
    // Prefer the backend's human-readable message when it sends a structured
    // error such as { code, message }.
    if (typeof value.message === 'string') {
      messages.push(value.message);
      return;
    }

    Object.keys(value).forEach(key => collectMessages(value[key], messages));
  }
}

function getSignupErrors(error) {
  const responseData = error && error.response && error.response.data;
  const messages = [];

  if (responseData) {
    collectMessages(responseData.errors, messages);
    if (!messages.length) collectMessages(responseData.error, messages);
    if (!messages.length) collectMessages(responseData.message, messages);
  }

  if (!messages.length && error && error.message) {
    collectMessages(error.message, messages);
  }

  return messages.length
    ? messages
    : ['Unable to reach the registration service. Please try again in a moment.'];
}

export const signup = (detail, callback) => async dispatch => {
  dispatch({ type: ERROR, payload: null });

  // Preserve the original backend contract without mutating redux-form's
  // values object. The legacy registration API accepts the identity and
  // credential fields; company/phone were historically not submitted.
  const payload = { ...detail };
  delete payload.agreed_term;
  delete payload.company_name;
  delete payload.phone_number;

  try {
    await client.post(routes.signup, payload);
    callback();
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: getSignupErrors(error)
    });
  }
};
