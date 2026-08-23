import en from './../_locale/en';
import de from './../_locale/de';

const listOf = value => Array.isArray(value) ? value : [];

export const extractNames = list => listOf(list).map(item => item && item.label !== undefined ? item.label : item && item.name).filter(value => value !== undefined && value !== null);

export const extractId = (list, mainList) => {
  const main = listOf(mainList);
  if (!list) return main.map(item => item && item.id).filter(id => id !== undefined && id !== 'undefined');
  const wanted = new Set(listOf(list));
  return main.filter(item => wanted.has(item.label)).map(item => item.id !== undefined ? item.id : item.value).filter(value => value !== undefined);
};

export const splitService = array => ({
  en: listOf(array).map(item => ({ value: item.id, label: item.name && item.name.en })),
  de: listOf(array).map(item => ({ value: item.id, label: item.name && item.name.de }))
});

export const splitIndustries = array => ({
  en: [en.placeholder.selectAll, ...listOf(array).map(item => item.name && item.name.en).filter(Boolean)],
  de: [de.placeholder.selectAll, ...listOf(array).map(item => item.name && item.name.de).filter(Boolean)]
});

export const getId = (mainList, list, language) => {
  const main = listOf(mainList);
  if (!list) return main.map(item => item.id).filter(value => value !== undefined);
  const wanted = new Set(listOf(list));
  return main.filter(item => item && item.name && wanted.has(item.name[language])).map(item => item.id);
};

export const dDigit = number => (`0${number}`).slice(-2);

export const extractIdCounty = (list, mainList) => {
  const wanted = new Set(listOf(list));
  return listOf(mainList).filter(item => wanted.has(item.name)).map(item => item.id);
};

export const renameKeys = (keysMap, mainObj) => listOf(mainObj).map(obj => Object.keys(obj || {}).reduce((acc, key) => ({ ...acc, [keysMap[key] || key]: obj[key] }), {}));

export const extractIdForName = (list, mainList) => {
  const main = listOf(mainList);
  if (!list) return main.map(item => item && item.id).filter(id => id !== undefined && id !== 'undefined');
  const wanted = new Set(listOf(list));
  return main.filter(item => wanted.has(item.name)).map(item => item.id !== undefined ? item.id : item.value).filter(value => value !== undefined);
};

export const findId = (list, mainList) => {
  const wanted = new Set(listOf(list));
  return listOf(mainList).filter(item => wanted.has(item.name)).map(item => item.id);
};
