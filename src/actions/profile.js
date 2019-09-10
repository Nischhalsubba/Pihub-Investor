import client from './index';
import { routes } from './../_api/routes';
import { GET_PROFILE } from '../actions/types';
export const getProfile = id => async dispatch => {
  try {
    const response = await client.get(routes.getProfile);
    dispatch({
      type: GET_PROFILE,
      payload: response.data.data
    });
  } catch (e) {
    console.log(e);
  }
};

