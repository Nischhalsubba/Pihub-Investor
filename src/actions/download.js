import client from './index';
import { routes } from './../_api/routes';
import { ERROR } from '../actions/types';
export const downloadToken = (path) => async dispatch => {
  try {
    const response = await client.post(routes.downloadToken, { file_path: path });
    console.log(response.data.token)
    const { token } = response.data;
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', `${routes.downloadFile}?token=${token}`);


      xhr.responseType = 'arraybuffer';
      xhr.onload = function (e) {
        if (this.status === 200) {
          console.log('download', this.response)
          var blob = new Blob([this.response], { type: '' });
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'attachment.xlsx';
          link.click();
        }
      };
      xhr.send();

    }
  } catch (e) {
    dispatch({
      type: ERROR,
      payload: e.response.data.message
    });
  }
};

