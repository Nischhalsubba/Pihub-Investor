import client from './index';
import { routes } from './../_api/routes';
import { ERROR, CLEAR_ERROR } from './types';
import { getApiErrorMessage } from '../_utils/api';

export const uploadFile = (doc, pId, aId, callback) => async dispatch => {
  dispatch({ type: CLEAR_ERROR, payload: null });
  try {
    const files = doc && Array.isArray(doc.files) ? doc.files : [];
    if (!files.length) {
      dispatch({ type: ERROR, payload: 'Choose at least one file to upload.' });
      return false;
    }

    const body = new FormData();
    files.forEach((file, index) => body.append(`files[${index}]`, file));
    const response = await client.post(`${routes.uploadFile}/${pId}/applications/${aId}/files`, body);

    if (response && callback) callback();
    return true;
  } catch (error) {
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to upload the selected documents.') });
    return false;
  }
};
