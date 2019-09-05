export const extractNames = (list) => {
  console.log(list);
  var r = [];
  list.map(l => {
    r.push(l.label);
  })
  return r
}

export const extractId = (list, mainList) => {
  var r = [];
  list.map((name) => {
    return mainList.map((main) => {
      if (name === main.label) {
        r.push(main.id)
      }
    })
  })
  return r;
}