import client from './index';
import { routes } from './../_api/routes';
import { ERROR, GET_CREDITOR_DETAIL } from './types';

export const getCreditor = (id, callback) => async dispatch => {
  try {
    const response = await client.get(
      `${routes.getCreditorDetail}/${id}`
    );

    dispatch({
      type: GET_CREDITOR_DETAIL,
      payload: response.data.data
    })
    callback()
  } catch (e) {
    dispatch({
      type: ERROR,
      payload: 'Unable to fetch detail now'
    });
  }
};


export const creditorDetail = (pId, aId, callback) => async dispatch => {
  try {
    const response = await client.get(`${routes.creditorDetail}/${pId}/applications/${aId}`);

    dispatch({
      type: GET_CREDITOR_DETAIL,
      payload: response.data.data
    });
    callback()

  } catch (e) {
    console.log('error', e);
  }
}