import axios from 'axios';
import { clearStoredToken, getStoredToken } from '../_utils/authToken';
import { configureDemoAdapter } from '../_utils/configureDemoAdapter';

const REQUEST_TIMEOUT_MS = 30_000;
const clientWithForm = configureDemoAdapter(axios.create({
  timeout: REQUEST_TIMEOUT_MS,
  withCredentials: false
}));

clientWithForm.interceptors.request.use(config => {
  config.headers = config.headers || {};
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else delete config.headers.Authorization;

  config.headers.From = process.env.REACT_APP_API_HEADER_FROM || 'investor';
  config.headers.Accept = 'application/json';
  // Do not set multipart Content-Type manually. Axios/browser must supply the
  // boundary value when serializing FormData.
  return config;
}, error => Promise.reject(error));

clientWithForm.interceptors.response.use(response => response, error => {
  if (error && error.response && error.response.status === 401) {
    clearStoredToken();
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('pihub:session-expired'));
  }
  return Promise.reject(error);
});

export default clientWithForm;
