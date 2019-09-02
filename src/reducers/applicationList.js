import { GET_APPLICATION_LIST } from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case GET_APPLICATION_LIST:
      return { ...state, list: action.payload };
    default:
      return state;
  }
}
