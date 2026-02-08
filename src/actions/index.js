import axios from 'axios';
import jwt from 'jsonwebtoken';
import { isDemo, mockRequest } from '../_api/mock';

const API_HEADER_FROM = process.env.REACT_APP_API_HEADER_FROM || 'investor';

const jsonClient = axios.create();

jsonClient.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    config.headers.From = API_HEADER_FROM;
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => Promise.reject(error)
);

const client = {
  get: (url, config) =>
    isDemo() ? mockRequest('get', url, null, config) : jsonClient.get(url, config),
  post: (url, data, config) =>
    isDemo() ? mockRequest('post', url, data, config) : jsonClient.post(url, data, config),
  put: (url, data, config) =>
    isDemo() ? mockRequest('put', url, data, config) : jsonClient.put(url, data, config),
  delete: (url, config) =>
    isDemo() ? mockRequest('delete', url, null, config) : jsonClient.delete(url, config),
  all: promises => Promise.all(promises)
};

export default client;
