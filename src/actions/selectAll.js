import en from "../_locale/en";
import de from "../_locale/de";

const Translate = require('react-translate-component');

export const selectAll = () => {
    let locale = Translate.getLocale();
    let selectAll = {id: 0, name: en.placeholder.selectAll};
    // not the most elegant way to translate in actions @todo fix translation
    if (locale === 'de') {
        selectAll = {id: 0, name: de.placeholder.selectAll};
    }
    return selectAll;
}