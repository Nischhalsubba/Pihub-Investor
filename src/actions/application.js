import client from './index';
import { routes } from './../_api/routes';
import { GET_APPLICATION_LIST, ERROR } from '../actions/types';
export const getApplicationList = id => async dispatch => {
  try {
    const response = await client.get(
      `${routes.getApplicationList}/${id}/applications`
    );
    console.log('application', response.data.data);
    dispatch({
      type: GET_APPLICATION_LIST,
      payload: response.data
    });
  } catch (e) {
    console.log(e);
    // dispatch({
    //   type: ERROR,
    //   payload: `${e}.`
    // });
  }
};
