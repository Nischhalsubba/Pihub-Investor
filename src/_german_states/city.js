export default state => {
  if (state.value === '1') {
    return [{ label: 'kathmandu', id: '1' }];
  } else {
    return [{ label: 'Berlin', id: '1' }, { label: 'Schalke', id: '2' }];
  }
};
