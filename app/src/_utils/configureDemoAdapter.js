export const configureDemoAdapter = client => {
  if (typeof __PIHUB_DEMO__ === 'undefined' || !__PIHUB_DEMO__) return client;
  client.defaults.adapter = config => Promise.all([
    import('./demoAdapter'),
    import('./demoWorkspaceSeed')
  ]).then(([adapterModule, seedModule]) => {
    seedModule.ensureDemoWorkspaceData();
    const method = String(config && config.method || 'get').toLowerCase();
    const path = String(config && config.url || '').split('?')[0].replace(/\/$/, '');
    const match = method === 'delete' ? path.match(/\/investor\/product\/([^/]+)$/) : null;
    if (match) seedModule.rememberDeletedDemoSeed(decodeURIComponent(match[1]));
    return adapterModule.demoAxiosAdapter(config);
  });
  return client;
};
