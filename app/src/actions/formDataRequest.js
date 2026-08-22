import axios from 'axios';
import { getStoredToken } from '../_utils/authToken';

const clientWithForm = axios.create();

clientWithForm.interceptors.request.use(
  async config => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers.From = process.env.REACT_APP_API_HEADER_FROM || 'investor';
    // Do not set multipart/form-data manually. The browser must add the
    // boundary for FormData requests.
    return config;
  },
  error => Promise.reject(error)
);

export default clientWithForm;
