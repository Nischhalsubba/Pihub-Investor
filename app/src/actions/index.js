import axios from 'axios';
import { getStoredToken } from '../_utils/authToken';
import { demoAxiosAdapter, isDemoMode } from '../_utils/demoMode';

const API_HEADER_FROM = process.env.REACT_APP_API_HEADER_FROM || 'investor';
const client = axios.create();

if (isDemoMode()) {
  client.defaults.adapter = demoAxiosAdapter;
}

client.interceptors.request.use(
  async config => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers.From = API_HEADER_FROM;
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => Promise.reject(error)
);

export default client;
