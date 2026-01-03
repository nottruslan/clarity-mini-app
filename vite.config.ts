import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Плагин для удаления crossorigin атрибута из HTML
function removeCrossoriginPlugin() {
  return {
    name: 'remove-crossorigin',
    writeBundle() {
      const htmlPath = join(__dirname, 'dist', 'index.html');
      try {
        let html = readFileSync(htmlPath, 'utf-8');
        // Удаляем crossorigin атрибут из script и link тегов
        html = html.replace(/\s+crossorigin/g, '');
        writeFileSync(htmlPath, html, 'utf-8');
      } catch (error) {
        console.warn('Could not remove crossorigin from HTML:', error);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), removeCrossoriginPlugin()],
  base: '/', // Явно указываем base path для корректной работы с Cloudflare прокси
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    // Убеждаемся, что ассеты используют правильные пути
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  },
  optimizeDeps: {
    include: ['recharts']
  }
});

