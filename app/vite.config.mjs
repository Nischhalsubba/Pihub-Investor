import { defineConfig, loadEnv, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const truthy = value => ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase());

const assertSecureProductionUrl = (label, value, production) => {
  const normalized = String(value || '').trim();
  if (!production || !normalized) return normalized;

  let parsed;
  try {
    parsed = new globalThis.URL(normalized);
  } catch {
    throw new Error(`${label} must be an absolute HTTPS URL in production.`);
  }

  if (parsed.protocol !== 'https:') {
    throw new Error(`${label} must use HTTPS in production.`);
  }

  return normalized;
};

const DEFAULT_APP_URLS = Object.freeze({
  borrower: 'https://pihub-borrower-nischhalsubbas-projects.vercel.app',
  advisory: 'https://pihub-advisory-nischhalsubbas-projects.vercel.app',
  admin: 'https://pihub-admin-nischhalsubbas-projects.vercel.app',
});

const legacyJsxInJs = production => ({
  name: 'pihub-legacy-jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (!/\/src\/.*\.js$/.test(id)) return null;
    const result = await transformWithOxc(code, id, {
      lang: 'jsx',
      jsx: {
        runtime: 'automatic',
        development: !production,
        refresh: !production,
      },
    });
    return { code: result.code, map: result.map };
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const read = key => process.env[key] !== undefined ? process.env[key] : env[key];
  const demoValue = read('REACT_APP_DEMO') || '';
  const production = mode === 'production';
  const apiUrl = assertSecureProductionUrl('REACT_APP_API_URL', read('REACT_APP_API_URL'), production);
  const investorAppUrl = assertSecureProductionUrl('REACT_APP_INVESTOR_APP_URL', read('REACT_APP_INVESTOR_APP_URL'), production);
  const borrowerAppUrl = assertSecureProductionUrl('REACT_APP_BORROWER_APP_URL', read('REACT_APP_BORROWER_APP_URL') || DEFAULT_APP_URLS.borrower, production);
  const advisoryAppUrl = assertSecureProductionUrl('REACT_APP_ADVISORY_APP_URL', read('REACT_APP_ADVISORY_APP_URL') || DEFAULT_APP_URLS.advisory, production);
  const adminAppUrl = assertSecureProductionUrl('REACT_APP_ADMIN_APP_URL', read('REACT_APP_ADMIN_APP_URL') || DEFAULT_APP_URLS.admin, production);
  const accessAppUrl = assertSecureProductionUrl('REACT_APP_ACCESS_APP_URL', read('REACT_APP_ACCESS_APP_URL'), production);

  return {
    plugins: [legacyJsxInJs(production), react({ include: /\.(jsx|tsx)$/ })],
    resolve: {
      alias: [
        { find: /^react-router-dom$/, replacement: fileURLToPath(new URL('./src/routerCompat.jsx', import.meta.url)) },
      ],
      dedupe: ['react', 'react-dom'],
    },
    define: {
      __PIHUB_DEMO__: JSON.stringify(truthy(demoValue)),
      __PIHUB_MODULE_ID__: JSON.stringify(read('REACT_APP_PIHUB_MODULE_ID') || 'investor'),
      __PIHUB_INVESTOR_APP_URL__: JSON.stringify(investorAppUrl),
      __PIHUB_BORROWER_APP_URL__: JSON.stringify(borrowerAppUrl),
      __PIHUB_ADVISORY_APP_URL__: JSON.stringify(advisoryAppUrl),
      __PIHUB_ADMIN_APP_URL__: JSON.stringify(adminAppUrl),
      __PIHUB_ACCESS_APP_URL__: JSON.stringify(accessAppUrl),
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
      'process.env.REACT_APP_DEMO': JSON.stringify(demoValue),
      'process.env.REACT_APP_API_URL': JSON.stringify(apiUrl),
      'process.env.REACT_APP_API_HEADER_FROM': JSON.stringify(read('REACT_APP_API_HEADER_FROM') || 'investor'),
    },
    optimizeDeps: { rolldownOptions: { moduleTypes: { '.js': 'jsx' } } },
    build: { outDir: 'dist', emptyOutDir: true, target: 'es2020', sourcemap: false, chunkSizeWarningLimit: 900 },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
      include: ['src/**/*.{test,spec}.{js,jsx}'],
      exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
      css: true,
    },
  };
});
