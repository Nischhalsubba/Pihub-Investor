export default (list, names) => {
  var r = [];
  names.map((name, i) => {
    return list.map((l, index) => {
      if (name === l.name.en) {
        return r.push(l.id);
      }
    })
  })
  return r;
}