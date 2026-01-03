import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Плагин для оптимизации HTML после сборки
function optimizeHtmlPlugin() {
  return {
    name: 'optimize-html',
    writeBundle() {
      const htmlPath = join(__dirname, 'dist', 'index.html');
      try {
        let html = readFileSync(htmlPath, 'utf-8');
        // Удаляем crossorigin атрибут из script и link тегов (может вызывать проблемы с Cloudflare)
        html = html.replace(/\s+crossorigin/g, '');
        // Убеждаемся, что defer атрибут сохранен для telegram-web-app.js
        if (!html.includes('telegram-web-app.js')) {
          // Если скрипт был удален при сборке, добавляем его обратно
          const headMatch = html.match(/<head[^>]*>/);
          if (headMatch) {
            html = html.replace(
              headMatch[0],
              `${headMatch[0]}\n  <script src="https://telegram.org/js/telegram-web-app.js" defer onerror="console.warn('Failed to load Telegram WebApp script'); window.Telegram = window.Telegram || {};"></script>`
            );
          }
        }
        writeFileSync(htmlPath, html, 'utf-8');
      } catch (error) {
        console.warn('Could not optimize HTML:', error);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), optimizeHtmlPlugin()],
  base: '/', // Явно указываем base path для корректной работы с Cloudflare прокси
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Оптимизация для production
    minify: 'esbuild',
    cssMinify: true,
    // Увеличиваем лимит предупреждений для больших чанков
    chunkSizeWarningLimit: 1000,
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
        entryFileNames: 'assets/[name].[hash].js',
        // Оптимизация для лучшего кеширования
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'telegram-vendor': ['@tma.js/sdk']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['recharts']
  }
});

