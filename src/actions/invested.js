import client from './index';
import { routes } from './../_api/routes';
import { INVESTED_LIST } from '../actions/types';
export const getInvestedList = page => async dispatch => {
  try {
    const response = await client.get(
      `${routes.investedList}?page=${page}`
    );
    dispatch({
      type: INVESTED_LIST,
      payload: response.data.data
    });
  } catch (e) {
    console.log(e);
    // dispatch({
    //   type: ERROR,
    //   payload: `${e}.`
    // });
  }
};
