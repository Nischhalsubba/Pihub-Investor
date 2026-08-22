import client from './index';
import { routes } from './../_api/routes';
import { NOTIFICATION_COUNT, ERROR, LIST_NOTIFICATION } from '../actions/types';

const normalizeNotificationCount = data => {
  const readNumber = candidate => {
    if (candidate === null || candidate === undefined || candidate === '') return null;
    const parsed = Number(candidate);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  };

  const direct = readNumber(data);
  if (direct !== null) return direct;

  if (data && typeof data === 'object') {
    const candidates = [data.count, data.total, data.unread, data.unread_count, data.data];
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index];
      const parsed = readNumber(candidate);
      if (parsed !== null) return parsed;

      if (candidate && typeof candidate === 'object') {
        const nested = readNumber(
          candidate.count !== undefined
            ? candidate.count
            : candidate.total !== undefined
              ? candidate.total
              : candidate.unread_count
        );
        if (nested !== null) return nested;
      }
    }
  }

  return 0;
};

const getErrorMessage = (error, fallback) => {
  if (error && error.response && error.response.data) {
    const data = error.response.data;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;
  }
  return fallback;
};

export const getNotificationCount = () => async dispatch => {
  try {
    const response = await client.get(routes.countNotification);
    dispatch({
      type: NOTIFICATION_COUNT,
      payload: normalizeNotificationCount(response.data)
    });
  } catch (e) {
    dispatch({
      type: NOTIFICATION_COUNT,
      payload: 0
    });
    dispatch({
      type: ERROR,
      payload: getErrorMessage(e, 'Unable to load notification count.')
    });
  }
};

export const getNotificationList = page => async dispatch => {
  try {
    const response = await client.get(
      `${routes.getNotificationList}?page=${page}`
    );
    const data = response && response.data ? response.data : {};
    dispatch({
      type: LIST_NOTIFICATION,
      payload: data.data || []
    });
  } catch (e) {
    dispatch({
      type: ERROR,
      payload: getErrorMessage(e, 'Unable to load notifications.')
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
