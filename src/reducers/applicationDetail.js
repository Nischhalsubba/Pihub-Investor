import { GET_APPLICATION_DETAIL } from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case GET_APPLICATION_DETAIL:
      return { ...state, detail: action.payload };
    default:
      return state;
  }
}
