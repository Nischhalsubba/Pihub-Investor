import axios from 'axios';
import jwt from 'jsonwebtoken';

let client;
axios.interceptors.request.use(
    async config => {
        //if token in localstorage add to all axios call

        config.headers.From = process.env.REACT_APP_API_HEADER_FROM;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
export default client = axios;