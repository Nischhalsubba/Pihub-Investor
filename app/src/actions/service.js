import client from './index';
import { routes } from './../_api/routes';
import { CLEAR_ERROR, ERROR, GET_SERVICE } from './types';
import { splitService } from '../_utils/misc';
import { getApiErrorMessage } from '../_utils/api';

export const getServiceList = () => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  try {
    const response = await client.get(routes.getService);
    const list = response && response.data && Array.isArray(response.data.data) ? response.data.data : [];
    dispatch({ type: GET_SERVICE, payload: splitService(list) });
  } catch (error) {
    dispatch({ type: GET_SERVICE, payload: { en: [], de: [] } });
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to load facility options.') });
  }
};
