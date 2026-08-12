import { GET_INDUSTRY, GET_INDUSTRY_NAME } from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case GET_INDUSTRY:
      return { ...state, list: action.payload };
    case GET_INDUSTRY_NAME:
      return { ...state, names: action.payload }
    default:
      return state;
  }
}
