import client from './index';
import { routes } from './../_api/routes';
import { CLEAR_ERROR, ERROR, INVESTED_LIST } from '../actions/types';
import { getApiErrorMessage, normalizePagedCollection } from '../_utils/api';

export const getInvestedList = page => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  try {
    const response = await client.get(routes.investedList, { params: { page: page || 1 } });
    const payload = normalizePagedCollection(response && response.data, ['investments', 'positions']);
    dispatch({ type: INVESTED_LIST, payload: payload.data });
  } catch (error) {
    dispatch({ type: INVESTED_LIST, payload: [] });
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to load invested positions right now.') });
  }
};
