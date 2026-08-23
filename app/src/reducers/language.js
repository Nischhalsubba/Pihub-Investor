import { CHANGE_LANGUAGE } from '../actions/types';
import { getLocale } from '../_utils/locale';

export default function reducer(state = getLocale(), action) {
  return action.type === CHANGE_LANGUAGE ? action.payload : state;
}
