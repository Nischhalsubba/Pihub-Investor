export const configureDemoAdapter = client => {
  if (typeof __PIHUB_DEMO__ === 'undefined' || !__PIHUB_DEMO__) return client;
  client.defaults.adapter = config => import('./demoAdapter').then(module => module.demoAxiosAdapter(config));
  return client;
};
