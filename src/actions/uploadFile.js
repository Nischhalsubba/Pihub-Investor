import client from './index';
import { routes } from './../_api/routes';
import { ERROR } from './types';

export const uploadFile = (doc, pId, aId, callback) => async dispatch => {
  try {
    var body = new FormData();
    body.append('files[0]', doc[0]);
    const response = await client.post(`${routes.uploadFile}/${pId}/applications/${aId}/files`, body);

    if (response) {
      callback();
    }
  } catch (e) {
    console.log(e);
  }
};
