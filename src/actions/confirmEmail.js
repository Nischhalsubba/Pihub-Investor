import client from './index';
import { routes } from './../_api/routes';
import { ERROR } from './types';

export const confirmEmail = (token, callback) => async dispatch => {
  try {
    const response = await client.post(routes.emailVerification, { token });
    if (response) {
      callback();
    }
  } catch (e) {
    dispatch({
      type: ERROR,
      payload: 'Sorry!! Your email can not be verified right now'
    });
  }
};
