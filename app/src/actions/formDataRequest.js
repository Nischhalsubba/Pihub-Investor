import axios from 'axios';
import { clearStoredToken, getStoredToken } from '../_utils/authToken';
import { demoAxiosAdapter, isDemoMode } from '../_utils/demoMode';

const clientWithForm = axios.create();

if (isDemoMode()) clientWithForm.defaults.adapter = demoAxiosAdapter;

clientWithForm.interceptors.request.use(
  config => {
    const token = getStoredToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers.From = process.env.REACT_APP_API_HEADER_FROM || 'investor';
    return config;
  },
  error => Promise.reject(error)
);

clientWithForm.interceptors.response.use(
  response => response,
  error => {
    if (error && error.response && error.response.status === 401) {
      clearStoredToken();
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('pihub:session-expired'));
    }
    return Promise.reject(error);
  }
);

export default clientWithForm;
