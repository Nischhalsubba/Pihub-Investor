import { GET_SERVICE } from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case GET_SERVICE:
      return action.payload
    default:
      return state;
  }
}
