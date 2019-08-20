import { NOTIFICATION_COUNT } from '../actions/types';

export default function(state = 0, action) {
  switch (action.type) {
    case NOTIFICATION_COUNT:
      return action.payload;
    default:
      return state;
  }
}
