import client from './index';
import { routes } from './../_api/routes';
import { GET_SERVICE, ERROR } from './types';
import { splitService } from '../_utils/misc';
import { getApiErrorMessage } from '../_utils/api';

export const getServiceList = () => async dispatch => {
  try {
    const response = await client.get(routes.getService);
    const list = response && response.data && Array.isArray(response.data.data) ? response.data.data : [];
    const service = splitService(list);
    dispatch({ type: GET_SERVICE, payload: service });
    return service;
  } catch (error) {
    dispatch({ type: GET_SERVICE, payload: { en: [], de: [] } });
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to load facility types.') });
    return { en: [], de: [] };
  }
};
