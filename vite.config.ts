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
        
        // Убираем проблемные modulepreload ссылки, которые могут вызывать проблемы с загрузкой через Cloudflare
        // Оставляем только основные скрипты, которые точно будут использованы
        html = html.replace(/<link[^>]*rel=["']modulepreload["'][^>]*>/g, '');
        
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
        
        // Добавляем обработку ошибок загрузки для основных скриптов
        html = html.replace(
          /<script type="module" src="([^"]+)"><\/script>/g,
          '<script type="module" src="$1" onerror="console.error(\'Failed to load module:\', this.src); window.location.reload();"></script>'
        );
        
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
        // Убираем manualChunks для более надежной загрузки через Cloudflare
        // Разделение на чанки может вызывать проблемы с потерей соединения
        // Vite автоматически оптимизирует разделение кода при необходимости
      }
    }
  },
  optimizeDeps: {
    include: ['recharts']
  }
});

