import { SCOPE } from '../actions/types';

export default function (state = false, action) {
  switch (action.type) {
    case SCOPE:
      return action.payload
    default:
      return state;
  }
}
