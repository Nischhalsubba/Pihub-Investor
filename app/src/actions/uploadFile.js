import client from './index';
import { routes } from './../_api/routes';
import { ERROR } from './types';

export const uploadFile = (doc, pId, aId, callback) => async dispatch => {
  try {
    let body = new FormData();
    if(doc.files.length > 0) {
      doc.files.forEach(function (file, index) {
        body.append(`files[${index}]`, file);
      });
    }
    const response = await client.post(`${routes.uploadFile}/${pId}/applications/${aId}/files`, body);

    if (response) {
      callback();
    }
  } catch (e) {
    console.log(e);
  }
};
