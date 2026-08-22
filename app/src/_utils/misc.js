import en from './../_locale/en';
import de from './../_locale/de';

const listOf = value => Array.isArray(value) ? value : [];

export const extractNames = list => listOf(list)
  .map(item => item && (item.label !== undefined ? item.label : item.name))
  .filter(value => value !== undefined && value !== null);

export const extractId = (list, mainList) => {
  const source = listOf(mainList);
  if (!Array.isArray(list)) return source.map(item => item && (item.id !== undefined ? item.id : item.value)).filter(value => value !== undefined);
  const selected = new Set(list.map(String));
  return source
    .filter(item => item && selected.has(String(item.label)))
    .map(item => item.id !== undefined ? item.id : item.value)
    .filter(value => value !== undefined);
};

export const splitService = array => {
  const source = listOf(array);
  return {
    en: source.map(item => ({ value: item.id, label: item.name && item.name.en ? item.name.en : '' })),
    de: source.map(item => ({ value: item.id, label: item.name && item.name.de ? item.name.de : '' }))
  };
};

export const splitIndustries = array => {
  const source = listOf(array);
  return {
    en: [en.placeholder.selectAll, ...source.map(item => item.name && item.name.en).filter(Boolean)],
    de: [de.placeholder.selectAll, ...source.map(item => item.name && item.name.de).filter(Boolean)]
  };
};

export const getId = (mainList, list, language) => {
  const source = listOf(mainList);
  if (!Array.isArray(list)) return source.map(item => item.id).filter(value => value !== undefined);
  const selected = new Set(list.map(String));
  return source
    .filter(item => item && item.name && selected.has(String(item.name[language])))
    .map(item => item.id);
};

export const dDigit = number => (`0${number}`).slice(-2);

export const extractIdCounty = (list, mainList) => {
  const selected = new Set(listOf(list).map(String));
  return listOf(mainList)
    .filter(item => item && selected.has(String(item.name)))
    .map(item => item.id);
};

export const renameKeys = (keysMap, mainObj) => listOf(mainObj).map(obj => Object.keys(obj || {}).reduce((acc, key) => ({
  ...acc,
  [keysMap[key] || key]: obj[key]
}), {}));

export const extractIdForName = (list, mainList) => {
  const source = listOf(mainList);
  if (!Array.isArray(list)) return source.map(item => item && (item.id !== undefined ? item.id : item.value)).filter(value => value !== undefined);
  const selected = new Set(list.map(String));
  return source
    .filter(item => item && selected.has(String(item.name)))
    .map(item => item.id !== undefined ? item.id : item.value)
    .filter(value => value !== undefined);
};

export const findId = (list, mainList) => {
  const selected = new Set(listOf(list).map(String));
  return listOf(mainList).filter(item => item && selected.has(String(item.name))).map(item => item.id);
};
