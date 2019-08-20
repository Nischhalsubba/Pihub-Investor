import client from './index';
import { routes } from './../_api/routes';
import { NOTIFICATION_COUNT, ERROR } from '../actions/types';
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
