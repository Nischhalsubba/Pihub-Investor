export default (list, names) => {
  console.log(list)
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