import client from './index';
import { routes } from './../_api/routes';
import { GET_PROFILE, ERROR } from '../actions/types';
export const getProfile = id => async dispatch => {
  try {
    const response = await client.get(routes.getProfile);
    dispatch({
      type: GET_PROFILE,
      payload: response.data.data
    });
  } catch (e) {
    console.log(e);
  }
};

export const editProfile = (details, callback) => async dispatch => {
  try {
    var body = new FormData();
    Object.keys(details).forEach(field => {
      if (field !== 'company_logo_link' && field !== 'profile_pic_link' && field !== 'status' && field !== 'id' && field !== 'document_link') {
        body.append(`${field}`, details[`${field}`])

      }
    });
    if (details.document) {
      details.document.forEach((file) => {
        body.append('document', file)
      });
    } else {
      body.append('document', null)
    }

    if (details.company_logo) {
      body.append('company_logo', details.company_logo);
    } else {
      body.append('company_logo', null)
    }
    body.append('profile_pic', null);
    body.append('_method', 'put');
    const response = await client.post(routes.getProfile, body);
    if (response) {
      callback();
    }
  } catch (e) {
    console.log(e.response.data.message)
    dispatch({
      type: ERROR,
      payload: [e.response.data.message]
    })
  }
}
