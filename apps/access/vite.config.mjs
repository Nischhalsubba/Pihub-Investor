import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({ plugins:[react()], server:{fs:{allow:[path.resolve(here,'../..')]}}, build:{outDir:'dist',emptyOutDir:true,target:'es2020',sourcemap:false,chunkSizeWarningLimit:500}, test:{globals:true,environment:'jsdom',include:['src/**/*.{test,spec}.{js,jsx}']} });
