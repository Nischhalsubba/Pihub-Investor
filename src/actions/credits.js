import client from './index';
import { routes } from './../_api/routes';
import { CREDIT_REQUESTS_LIST, ERROR } from '../actions/types';
export const getCreditRequestList = page => async dispatch => {
  try {
    const response = await client.get(
      `${routes.listCreditRequests}?page=${page}`
    );
    console.log(response.data.data);
    dispatch({
      type: CREDIT_REQUESTS_LIST,
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
