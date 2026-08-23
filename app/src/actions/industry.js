import client from './index';
import { routes } from './../_api/routes';
import { CLEAR_ERROR, ERROR, GET_INDUSTRY, GET_INDUSTRY_NAME } from '../actions/types';
import { splitIndustries } from '../_utils/misc';
import { getApiErrorMessage } from '../_utils/api';

export const getIndustryList = () => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  try {
    const response = await client.get(routes.getIndustryList);
    const list = response && response.data && Array.isArray(response.data.data) ? response.data.data : [];
    dispatch({ type: GET_INDUSTRY_NAME, payload: splitIndustries(list) });
    dispatch({ type: GET_INDUSTRY, payload: list });
  } catch (error) {
    dispatch({ type: GET_INDUSTRY_NAME, payload: { en: [], de: [] } });
    dispatch({ type: GET_INDUSTRY, payload: [] });
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to load industry options.') });
  }
};
