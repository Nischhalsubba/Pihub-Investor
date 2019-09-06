export default (list, names) => {
  var r = [];

  if (names) {
    names.map((name, i) => {
      return list.map((l, index) => {
        if (name === l.name.en) {
          return r.push(l.id);
        }
      })
    })
  } else {
    list.map((l, i) => {
      return r.push(l.id)
    })
  }

  return r;
}