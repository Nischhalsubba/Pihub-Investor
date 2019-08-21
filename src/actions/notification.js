import client from './index';
import { routes } from './../_api/routes';
import { NOTIFICATION_COUNT, ERROR, LIST_NOTIFICATION } from '../actions/types';
export const getNotificationCount = () => async dispatch => {
  try {
    const response = await client.get(routes.countNotification);
    dispatch({
      type: NOTIFICATION_COUNT,
      payload: response.data
    });
  } catch (e) {
    dispatch({
      type: ERROR,
      payload: e.response.data.message
    });
  }
};

export const getNotificationList = page => async dispatch => {
  try {
    const response = await client.get(
      `${routes.getNotificationList}?page=${page}`
    );
    dispatch({
      type: LIST_NOTIFICATION,
      payload: response.data.data
    });
  } catch (e) {
    dispatch({
      type: ERROR,
      payload: e.response.data.message
    });
  }
};

export const markAsRead = (id, callback) => async dispatch => {
  try {
    let ids = { notification_ids: [id] };
    const response = await client.post(routes.markAsRead, ids);
    if (response) {
      callback();
    }
  } catch (e) {}
};
