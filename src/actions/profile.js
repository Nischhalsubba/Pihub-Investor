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
    console.log(details)
    var body = new FormData();
    Object.keys(details).map(field => {
      if (field !== 'company_logo_link' && field !== 'profile_pic_link' && field !== 'status' && field !== 'id' && field !== 'document_link') {
        body.append(`${field}`, details[`${field}`])

      }
    });
    details.document.map((file, index) => {
      body.append('document', file)
    });
    body.append('profile_pic', null);
    body.append('company_logo', null);
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