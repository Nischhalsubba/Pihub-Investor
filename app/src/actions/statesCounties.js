import client from './index';
import { routes } from './../_api/routes';
import { GET_ALL_STATES, GET_ALL_STATES_WITH_ID, GET_COUNTIES, GET_COUNTIES_NAME, ERROR } from './types';
import { extractNames } from '../_utils/misc';
import { translate } from '../_utils/locale';
import { getApiErrorMessage } from '../_utils/api';

const selectAll = () => ({ id: 0, name: translate('placeholder.selectAll') || 'Select all' });

export const getCounties = stateIds => async dispatch => {
  const ids = Array.isArray(stateIds) ? stateIds.filter(id => Number(id) !== 0) : [];
  if (!ids.length) {
    dispatch({ type: GET_COUNTIES, payload: [] });
    dispatch({ type: GET_COUNTIES_NAME, payload: [] });
    return [];
  }

  try {
    const responses = await Promise.all(ids.map(id => client.get(`${routes.getStateCounties}/${encodeURIComponent(id)}/counties`)));
    const counties = responses.flatMap(response => response && response.data && Array.isArray(response.data.data) ? response.data.data : []);
    const list = counties.length ? [selectAll(), ...counties] : [];
    dispatch({ type: GET_COUNTIES, payload: list });
    dispatch({ type: GET_COUNTIES_NAME, payload: extractNames(list) });
    return list;
  } catch (error) {
    dispatch({ type: GET_COUNTIES, payload: [] });
    dispatch({ type: GET_COUNTIES_NAME, payload: [] });
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to load counties.') });
    return [];
  }
};

export const getAllState = () => async dispatch => {
  try {
    const response = await client.get(routes.getStateCounties);
    const states = response && response.data && Array.isArray(response.data.data) ? response.data.data : [];
    const list = states.length ? [selectAll(), ...states] : [];
    dispatch({ type: GET_ALL_STATES_WITH_ID, payload: list });
    dispatch({ type: GET_ALL_STATES, payload: extractNames(list) });
    return list;
  } catch (error) {
    dispatch({ type: GET_ALL_STATES_WITH_ID, payload: [] });
    dispatch({ type: GET_ALL_STATES, payload: [] });
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to load states.') });
    return [];
  }
};
