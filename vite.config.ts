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
        
        // КРИТИЧНО: НЕ удаляем modulepreload ссылки - они критичны для правильной загрузки зависимостей
        // Vite автоматически создает правильный порядок: vendor chunks должны загрузиться до main chunk
        // Удаление preload может привести к race condition, когда main модуль загружается раньше зависимостей
        // Оставляем все preload ссылки как есть - Vite знает правильный порядок
        
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
        
        // Добавляем обработку ошибок, логирование и retry для основных скриптов
        html = html.replace(
          /<script type="module" src="([^"]+)"><\/script>/g,
          (match, src) => {
            const scriptName = src.split('/').pop();
            return `<script type="module" src="${src}" onload="console.log('[DEBUG] Module loaded:', '${scriptName}');" onerror="(function(){const s=document.createElement('script');s.type='module';s.src='${src}';s.onload=()=>console.log('[DEBUG] Module retry loaded:', '${scriptName}');s.onerror=()=>{console.error('[DEBUG] Module retry failed:', '${scriptName}');setTimeout(()=>window.location.reload(),2000);};document.head.appendChild(s);})();"></script>`;
          }
        );
        
        // Preload ссылки не поддерживают onload/onerror события напрямую
        // Логирование будет через PerformanceObserver в index.html
        
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

