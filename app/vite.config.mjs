import { defineConfig, loadEnv, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const truthy = value => ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase());

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
        refresh: !production
      }
    });
    return { code: result.code, map: result.map };
  }
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const read = key => process.env[key] !== undefined ? process.env[key] : env[key];
  const demoValue = read('REACT_APP_DEMO') || '';
  const production = mode === 'production';

  return {
    plugins: [legacyJsxInJs(production), react({ include: /\.(jsx|tsx)$/ })],
    resolve: {
      alias: {
        'react-router-dom': fileURLToPath(new URL('./src/routerCompat.jsx', import.meta.url))
      }
    },
    define: {
      __PIHUB_DEMO__: JSON.stringify(truthy(demoValue)),
      __PIHUB_MODULE_ID__: JSON.stringify(read('REACT_APP_PIHUB_MODULE_ID') || 'investor'),
      __PIHUB_INVESTOR_APP_URL__: JSON.stringify(read('REACT_APP_INVESTOR_APP_URL') || ''),
      __PIHUB_BORROWER_APP_URL__: JSON.stringify(read('REACT_APP_BORROWER_APP_URL') || ''),
      __PIHUB_ADVISORY_APP_URL__: JSON.stringify(read('REACT_APP_ADVISORY_APP_URL') || ''),
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
      'process.env.REACT_APP_DEMO': JSON.stringify(demoValue),
      'process.env.REACT_APP_API_URL': JSON.stringify(read('REACT_APP_API_URL') || ''),
      'process.env.REACT_APP_API_HEADER_FROM': JSON.stringify(read('REACT_APP_API_HEADER_FROM') || 'investor')
    },
    optimizeDeps: { rolldownOptions: { moduleTypes: { '.js': 'jsx' } } },
    build: { outDir: 'dist', emptyOutDir: true, target: 'es2020', sourcemap: false, chunkSizeWarningLimit: 900 },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
      include: ['src/**/*.{test,spec}.{js,jsx}'],
      exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
      css: true
    }
  };
});
