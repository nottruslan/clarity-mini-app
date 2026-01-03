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
        
        // Оставляем modulepreload только для vendor чанков (они загружаются первыми)
        // Убираем preload для основного entry файла, так как он загружается сразу
        const preloadRegex = /<link[^>]*rel=["']modulepreload["'][^>]*>/g;
        const preloadMatches = html.match(preloadRegex);
        if (preloadMatches) {
          // Оставляем только preload для vendor файлов
          preloadMatches.forEach(match => {
            if (!match.includes('vendor')) {
              html = html.replace(match, '');
            }
          });
        }
        
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
        // Умное разделение на чанки для оптимизации загрузки
        // Разделяем только большие библиотеки, чтобы основной код загружался быстрее
        manualChunks(id) {
          // Разделяем node_modules на отдельные чанки только для больших библиотек
          if (id.includes('node_modules')) {
            // React и React-DOM вместе (часто используются вместе)
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            // Большие библиотеки отдельно
            if (id.includes('recharts')) {
              return 'vendor-recharts';
            }
            // Остальные библиотеки вместе
            return 'vendor';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['recharts']
  }
});

