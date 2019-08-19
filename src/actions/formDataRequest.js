import axios from 'axios';
import jwt from 'jsonwebtoken';

let clientWithForm;
axios.interceptors.request.use(
  async config => {
    //if token in localstorage and has not expired add to all axios call
    if (localStorage.getItem('token')) {
      const { exp } = jwt.decode(localStorage.getItem('token'));
      if (exp * 1000 > Date.now()) {
        config.headers.Authorization =
          `Bearer ` + localStorage.getItem('token');
      }
    }
    config.headers.From = process.env.REACT_APP_API_HEADER_FROM;
    config.headers['Content-Type'] = 'multipart/form-data';
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
export default (clientWithForm = axios);
