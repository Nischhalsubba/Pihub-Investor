export const extractNames = (list) => {
  var r = [];
  list.map(l => {
    if (l.label) {
      r.push(l.label);

    } else {
      r.push(l.name)
    }
  })
  return r
}

export const extractId = (list, mainList) => {
  var r = [];

  if (list) {
    list.map((name) => {
      return mainList.map((main) => {
        if (main.id) {
          if (name === main.label) {
            r.push(main.id)
          }
        } else if (main.value) {
          if (name === main.label) {
            r.push(main.value)
          }
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

export const getId = (mainList, list, language) => {

  var result = [];
  if (list) {
    list.map(m => {
      return mainList.map(ml => {
        if (ml.name[`${language}`] === m) {
          result.push(ml.id);
        }
      })
    })
  } else {
    return mainList.map(ml => {
      result.push(ml.id)
    })
  }
  console.log(result);
  return result;
}


export const dDigit = number => {
  return (number = ('0' + number).slice(-2));
};
