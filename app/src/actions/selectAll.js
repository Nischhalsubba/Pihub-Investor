import en from '../_locale/en';
import de from '../_locale/de';
import { getLocale } from '../_utils/locale';

export const selectAll = () => {
  const locale = getLocale();
  return { id: 0, name: locale === 'de' ? de.placeholder.selectAll : en.placeholder.selectAll };
};
