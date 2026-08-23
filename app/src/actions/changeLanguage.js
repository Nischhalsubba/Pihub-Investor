import { CHANGE_LANGUAGE } from './types';
import { setLocale } from '../_utils/locale';

export const changeLanguage = language => dispatch => {
  const locale = setLocale(language);
  dispatch({ type: CHANGE_LANGUAGE, payload: locale });
  return locale;
};
