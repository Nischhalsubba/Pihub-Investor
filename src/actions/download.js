import client from './index';
import { routes } from './../_api/routes';
import { ERROR } from '../actions/types';
export const downloadToken = (path, fileName, fileType) => async dispatch => {
  try {
    let name = fileName.split('.')[0] || 'attachment';
    let type = fileType || 'pdf';

    const response = await client.post(routes.downloadToken, { file_path: path });
    const { token } = response.data;
    if (token) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', `${routes.downloadFile}?token=${token}`);


      xhr.responseType = 'arraybuffer';
      xhr.onload = function (e) {
        if (this.status === 200) {
          let blob = new Blob([this.response], { type: '' });
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `${name}.${type}`
          link.click();
        }
      };
      xhr.send();

    }
  } catch (e) {
    dispatch({
      type: ERROR,
      payload: e.response? e.response.data.message: 'Unable to download the file!'
    });
  }
};

