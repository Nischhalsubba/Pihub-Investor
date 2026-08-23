import client from './index';
import { routes } from './../_api/routes';
import { CLEAR_ERROR, ERROR, GET_PROFILE } from '../actions/types';
import { getApiErrorMessage } from '../_utils/api';

export const getProfile = () => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  try {
    const response = await client.get(routes.getProfile);
    dispatch({ type: GET_PROFILE, payload: response.data.data });
  } catch (error) {
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to load the institution profile right now.') });
  }
};

export const editProfile = (details, callback) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  try {
    const body = new FormData();
    Object.keys(details).forEach(field => {
      if (!['company_logo_link', 'profile_pic_link', 'status', 'id', 'document_link', 'document', 'company_logo'].includes(field)) {
        const value = details[field];
        if (value !== undefined) body.append(field, value === null ? '' : value);
      }
    });

    if (Array.isArray(details.document)) {
      details.document.forEach(file => body.append('document', file));
    }
    if (details.company_logo) body.append('company_logo', details.company_logo);

    body.append('_method', 'put');
    const response = await client.post(routes.getProfile, body);
    if (response) callback();
  } catch (error) {
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to save the institution profile.') });
  }
};
