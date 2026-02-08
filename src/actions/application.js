import client from './index';
import { routes } from './../_api/routes';
import { GET_APPLICATION_LIST, GET_APPLICATION_DETAIL } from '../actions/types';
export const getApplicationList = id => async dispatch => {
  try {
    const response = await client.get(
      `${routes.getApplicationList}/${id}/applications`
    );
    dispatch({
      type: GET_APPLICATION_LIST,
      payload: response.data
    });
  } catch (e) {
    console.log(e);
  }
};

export const getApplicationDetail = (pID, aId) => async dispatch => {
  try {
    const response = await client.get(`${routes.getApplicationDetail}/${pID}/applications/${aId}`);
    dispatch({
      type: GET_APPLICATION_DETAIL,
      payload: response.data.data
    })
  } catch (e) {
    console.log('e');
  }
}
