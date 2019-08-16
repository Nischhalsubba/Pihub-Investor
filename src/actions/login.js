import client from './index'
import {routes} from './../_api/routes'
import {AUTH_ERROR, AUTH_USER, GET_NOTIFICATION_COUNT, USER_DETAIL} from "./types";

export const signin = ({email, password}, callback) => async dispatch => {
    try {
        const response = await client.post(routes.login, {
            email,
            password
        });
        localStorage.setItem('role', response.data.data.userInfo.role[0]);
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('email', response.data.data.userInfo.email);
        localStorage.setItem('name', response.data.data.userInfo.first_name);
        dispatch({
            type: USER_DETAIL,
            payload: response.data.data.userInfo
        });
        dispatch({
            type: AUTH_USER,
            payload: response.data.data.token
        });

        callback();
    } catch (e) {
        console.log(e);
        dispatch({
            type: AUTH_ERROR,
            payload: `* ${e}`
        });
    }
};