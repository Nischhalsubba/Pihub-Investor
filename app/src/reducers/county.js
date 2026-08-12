import { GET_COUNTIES, GET_COUNTIES_NAME } from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case GET_COUNTIES:
      return { ...state, list: action.payload };
    case GET_COUNTIES_NAME:
      return { ...state, name: action.payload }
    default:
      return state;
  }
}
