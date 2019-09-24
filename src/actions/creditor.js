import client from './index';
import { routes } from './../_api/routes';
import { ERROR, GET_CREDITOR_DETAIL } from './types';

export const getCreditor = (id, callback) => async dispatch => {
  try {
    const response = await client.get(
      `${routes.getCreditorDetail}/${id}`
    );
    console.log(response.data.data);
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


export const creditorDetail = (productId, appId, callback) => async dispatch => {
  try {
    const response = await client.get(`${routes.creditorDetail}/${productId}/applications/${appId}`);
    console.log(response.data.data)
    dispatch({
      type: GET_CREDITOR_DETAIL,
      payload: response.data.data
    });
    callback()

  } catch (e) {
    console.log('error', e);
  }
}