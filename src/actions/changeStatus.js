import client from './index';
import { routes } from './../_api/routes';
import { ERROR } from './types';

export const changeStatus = (pId, aId, status, callback) => async dispatch => {
  try {
    const response = await client.put(
      `${routes.changeStatusOfRequest}/${pId}/applications/${aId}`,
      { status }
    );
    if (response) {
      callback();
    }
  } catch (e) {
    dispatch({
      type: ERROR,
      payload: 'Error occured while changing the status !'
    });
  }
};
