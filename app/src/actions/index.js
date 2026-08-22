import axios from 'axios';
import { getStoredToken } from '../_utils/authToken';

const API_HEADER_FROM = process.env.REACT_APP_API_HEADER_FROM || 'investor';
const client = axios.create();

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
