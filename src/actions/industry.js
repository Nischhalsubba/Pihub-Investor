import client from './index';
import { routes } from './../_api/routes';
import { GET_INDUSTRY } from '../actions/types';
export const getIndustryList = page => async dispatch => {
  try {
    const response = await client.get(
      `${routes.getIndustryList}?page=${page}`
    );
    console.log('indus', response.data.data);
    dispatch({
      type: GET_INDUSTRY,
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
