import client from './index';
import { routes } from './../_api/routes';
import { ERROR } from './types';

export const confirmEmail = (token, callback, failureCallback) => async dispatch => {
  try {
    const response = await client.post(routes.emailVerification, { token });
    if (response) {
      callback();
    }
  } catch (e) {
    failureCallback();
  }
};
