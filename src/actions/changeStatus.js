import client from './index';
import { routes } from './../_api/routes';
import { ERROR } from './types';

export const changeStatus = (id, status, callback) => async dispatch => {
  try {
    const response = await client.put(
      `${routes.changeStatusOfRequest}/${id}/change-status`,
      { status }
    );
    if (response) {
      console.log(response);
    }
  } catch (e) {
    dispatch({
      type: ERROR,
      payload: 'Error occured while changing the status !'
    });
  }
};
