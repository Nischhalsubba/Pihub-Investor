import axios from 'axios';
import { clearStoredToken, getStoredToken } from '../_utils/authToken';
import { configureDemoAdapter } from '../_utils/configureDemoAdapter';

const client = configureDemoAdapter(axios.create());
const API_HEADER_FROM = process.env.REACT_APP_API_HEADER_FROM || 'investor';

client.interceptors.request.use(config => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers.From = API_HEADER_FROM;
  if (!config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json';
  return config;
}, error => Promise.reject(error));

client.interceptors.response.use(response => response, error => {
  if (error && error.response && error.response.status === 401) {
    clearStoredToken();
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('pihub:session-expired'));
  }
  return Promise.reject(error);
});

export default client;
