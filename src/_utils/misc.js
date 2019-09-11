export const extractNames = (list) => {
  var r = [];
  list.map(l => {
    r.push(l.label);
  })
  return r
}

export const extractId = (list, mainList) => {
  var r = [];

  if (list) {
    list.map((name) => {
      return mainList.map((main) => {
        if (name === main.label) {
          r.push(main.id)
        }
      })
    })
  } else {
    return mainList.map((m) => {
      if (m.id !== 'undefined') {
        return r.push(m.id)

      }
    })
  }

  return r;
}

export const splitService = (array) => {
  var english = [];
  var german = [];
  array.map((arr) => {
    var en = { value: arr.id, label: arr.name.en };
    var de = { value: arr.id, label: arr.name.de };
    english.push(en);
    german.push(de);
  });
  var result = { en: english, de: german };
  return result;

}

export const splitIndustries = (array) => {
  var english = [];
  var german = [];
  array.map(arr => {
    english.push(arr.name.en);
    german.push(arr.name.de);
  });
  var result = { en: english, de: german };
  return result;
}