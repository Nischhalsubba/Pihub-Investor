import axios from 'axios';

function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map(character =>
          `%${('00' + character.charCodeAt(0).toString(16)).slice(-2)}`
        )
        .join('')
    );

    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

let clientWithForm;
axios.interceptors.request.use(
  async config => {
    // If a token exists and its decoded expiry is still valid, add it to API calls.
    const token = localStorage.getItem('token');
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
        config.headers.Authorization = `Bearer ${token}`;
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