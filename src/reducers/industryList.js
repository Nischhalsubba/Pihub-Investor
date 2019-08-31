import { GET_INDUSTRY } from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case GET_INDUSTRY:
      return { ...state, list: action.payload };
    default:
      return state;
  }
}
