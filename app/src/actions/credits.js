import client from './index';
import { routes } from './../_api/routes';
import { CLEAR_ERROR, CREDIT_REQUESTS_LIST, ERROR } from '../actions/types';
import { getApiErrorMessage, normalizePagedCollection } from '../_utils/api';

export const getCreditRequestList = page => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  try {
    const response = await client.get(routes.listCreditRequests, { params: { page: page || 1 } });
    dispatch({
      type: CREDIT_REQUESTS_LIST,
      payload: normalizePagedCollection(response && response.data, ['creditRequests'])
    });
  } catch (error) {
    dispatch({ type: CREDIT_REQUESTS_LIST, payload: { data: [], meta: {} } });
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to load credit requests right now.') });
  }
};
