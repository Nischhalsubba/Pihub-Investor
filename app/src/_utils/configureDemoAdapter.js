const enrichDecisionCollections = (response, path, method, seedModule) => {
  if (method !== 'get' || !response || !response.data || !Array.isArray(response.data.data)) return response;
  if (!/\/investor\/(credit-requested-products|invested-products)$/.test(path)) return response;
  const byId = new Map(seedModule.getDemoWorkspaceProducts().map(product => [String(product.id), product]));
  const data = response.data.data.map(row => {
    const product = byId.get(String(row && row.product_id));
    if (!product) return row;
    return {
      ...row,
      owner: row.owner || product.owner,
      risk_band: row.risk_band || product.risk_band,
      expected_yield_bps: row.expected_yield_bps || product.expected_yield_bps,
      next_review_at: row.next_review_at || product.next_review_at
    };
  });
  return { ...response, data: { ...response.data, data } };
};

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
    return adapterModule.demoAxiosAdapter(config).then(response => enrichDecisionCollections(response, path, method, seedModule));
  });
  return client;
};
