export const configureDemoAdapter = client => {
  if (typeof __PIHUB_DEMO__ === 'undefined' || !__PIHUB_DEMO__) return client;
  client.defaults.adapter = config => Promise.all([
    import('./demoAdapter'),
    import('./demoWorkspaceSeed')
  ]).then(([adapterModule, seedModule]) => {
    seedModule.ensureDemoWorkspaceData();
    return adapterModule.demoAxiosAdapter(config);
  });
  return client;
};
