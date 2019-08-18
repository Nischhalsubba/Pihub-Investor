import { ERROR } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case ERROR:
      return { ...state, errors: action.payload };

    default:
      return state;
  }
}
