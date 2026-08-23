import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const truthy = value => ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase());

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const read = key => process.env[key] !== undefined ? process.env[key] : env[key];
  const demoValue = read('REACT_APP_DEMO') || '';

  return {
    resolve: {
      alias: {
        'react-router-dom': fileURLToPath(new URL('./src/routerCompat.jsx', import.meta.url))
      }
    },
    define: {
      __PIHUB_DEMO__: JSON.stringify(truthy(demoValue)),
      'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
      'process.env.REACT_APP_DEMO': JSON.stringify(demoValue),
      'process.env.REACT_APP_API_URL': JSON.stringify(read('REACT_APP_API_URL') || ''),
      'process.env.REACT_APP_API_HEADER_FROM': JSON.stringify(read('REACT_APP_API_HEADER_FROM') || 'investor')
    },
    esbuild: {
      jsx: 'automatic',
      loader: 'jsx',
      include: /src\/.*\.jsx?$/
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: { '.js': 'jsx' }
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
      css: true
    }
  };
});
