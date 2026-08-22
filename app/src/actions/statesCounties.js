import client from './index';
import { routes } from './../_api/routes';
import { CLEAR_ERROR, ERROR, GET_ALL_STATES, GET_ALL_STATES_WITH_ID, GET_COUNTIES, GET_COUNTIES_NAME } from '../actions/types';
import { extractNames } from '../_utils/misc';
import { getApiErrorMessage } from '../_utils/api';
import en from './../_locale/en';
import de from './../_locale/de';
const Translate = require('react-translate-component');

const selectAllOption = () => ({
  id: 0,
  name: Translate.getLocale() === 'de' ? de.placeholder.selectAll : en.placeholder.selectAll
});

export const getCounties = (stateIds = []) => async dispatch => {
  const ids = (Array.isArray(stateIds) ? stateIds : [stateIds]).filter(id => id !== undefined && id !== null && String(id) !== '0');
  if (!ids.length) {
    dispatch({ type: GET_COUNTIES, payload: [] });
    dispatch({ type: GET_COUNTIES_NAME, payload: [] });
    return;
  }

  dispatch({ type: CLEAR_ERROR });
  try {
    const responses = await Promise.all(ids.map(id => client.get(`${routes.getStateCounties}/${encodeURIComponent(id)}/counties`)));
    const seen = new Set();
    const counties = [];
    responses.forEach(response => {
      const data = response && response.data && Array.isArray(response.data.data) ? response.data.data : [];
      data.forEach(county => {
        if (!county || seen.has(String(county.id))) return;
        seen.add(String(county.id));
        counties.push(county);
      });
    });
    const list = counties.length ? [selectAllOption(), ...counties] : [];
    dispatch({ type: GET_COUNTIES, payload: list });
    dispatch({ type: GET_COUNTIES_NAME, payload: extractNames(list) });
  } catch (error) {
    dispatch({ type: GET_COUNTIES, payload: [] });
    dispatch({ type: GET_COUNTIES_NAME, payload: [] });
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to load county options.') });
  }
};

export const getAllState = () => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  try {
    const response = await client.get(routes.getStateCounties);
    const data = response && response.data && Array.isArray(response.data.data) ? response.data.data : [];
    const states = data.length ? [selectAllOption(), ...data] : [];
    dispatch({ type: GET_ALL_STATES_WITH_ID, payload: states });
    dispatch({ type: GET_ALL_STATES, payload: extractNames(states) });
  } catch (error) {
    dispatch({ type: GET_ALL_STATES_WITH_ID, payload: [] });
    dispatch({ type: GET_ALL_STATES, payload: [] });
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to load state options.') });
  }
};
