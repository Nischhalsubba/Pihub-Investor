import { INVESTED_LIST } from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case INVESTED_LIST:
      return { ...state, list: action.payload };
    default:
      return state;
  }
}
