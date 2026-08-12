import { LIST_NOTIFICATION } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case LIST_NOTIFICATION:
      return { ...state, notificationList: action.payload };
    default:
      return state;
  }
}
