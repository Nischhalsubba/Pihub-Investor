import { defineConfig, loadEnv, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const truthy = value => ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase());

const normalizeLegacyBrowserImports = code => code.replace(
  /const\s+([A-Za-z_$][\w$]*)\s*=\s*require\((['"])react-translate-component\2\);?/g,
  "import $1 from 'react-translate-component';"
);

const legacyJsxInJs = production => ({
  name: 'pihub-legacy-jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (!/\/src\/.*\.js$/.test(id)) return null;
    // The historical CRA source tree contains two legacy conventions that a
    // browser-native Vite dev server cannot execute directly: JSX in .js files
    // and a small number of CommonJS translation imports. Normalize only that
    // known browser-safe package here, then let Oxc parse the module as JSX.
    const normalizedCode = normalizeLegacyBrowserImports(code);
    const result = await transformWithOxc(normalizedCode, id, {
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
    plugins: [
      legacyJsxInJs(production),
      react({ include: /\.(jsx|tsx)$/ })
    ],
    resolve: {
      alias: {
        'react-router-dom': fileURLToPath(new URL('./src/routerCompat.jsx', import.meta.url))
      }
    },
    define: {
      __PIHUB_DEMO__: JSON.stringify(truthy(demoValue)),
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
      'process.env.REACT_APP_DEMO': JSON.stringify(demoValue),
      'process.env.REACT_APP_API_URL': JSON.stringify(read('REACT_APP_API_URL') || ''),
      'process.env.REACT_APP_API_HEADER_FROM': JSON.stringify(read('REACT_APP_API_HEADER_FROM') || 'investor')
    },
    optimizeDeps: {
      rolldownOptions: {
        moduleTypes: {
          '.js': 'jsx'
        }
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      target: 'es2020',
      sourcemap: false,
      chunkSizeWarningLimit: 900
    },
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
