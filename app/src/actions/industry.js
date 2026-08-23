import client from './index';
import { routes } from './../_api/routes';
import { GET_INDUSTRY, GET_INDUSTRY_NAME, ERROR } from './types';
import { splitIndustries } from '../_utils/misc';
import { getApiErrorMessage } from '../_utils/api';

export const getIndustryList = () => async dispatch => {
  try {
    const response = await client.get(routes.getIndustryList);
    const list = response && response.data && Array.isArray(response.data.data) ? response.data.data : [];
    dispatch({ type: GET_INDUSTRY_NAME, payload: splitIndustries(list) });
    dispatch({ type: GET_INDUSTRY, payload: list });
    return list;
  } catch (error) {
    dispatch({ type: GET_INDUSTRY, payload: [] });
    dispatch({ type: GET_INDUSTRY_NAME, payload: { en: [], de: [] } });
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to load industries.') });
    return [];
  }
};
