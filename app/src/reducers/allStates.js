import { GET_ALL_STATES, GET_ALL_STATES_WITH_ID } from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case GET_ALL_STATES:
      return { ...state, list: action.payload };
    case GET_ALL_STATES_WITH_ID:
      return { ...state, all: action.payload }
    default:
      return state;
  }
}
