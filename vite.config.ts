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
        
        // Добавляем обработку ошибок и логирование для основных скриптов
        // Retry механизм может вызывать проблемы, если файл действительно недоступен
        html = html.replace(
          /<script type="module" src="([^"]+)"><\/script>/g,
          (match, src) => {
            const scriptName = src.split('/').pop();
            // Упрощенная обработка ошибок - просто логируем, не делаем автоматический retry
            // Retry может быть добавлен позже, если нужно
            const retryId = 'module-retry-' + scriptName.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now();
            // Retry механизм для загрузки модуля при ошибке (до 3 попыток)
            return `<script type="module" src="${src}" 
              onload="console.log('[DEBUG] Module loaded:', '${scriptName}'); 
                      if (window['${retryId}']) { clearTimeout(window['${retryId}'].timeout); delete window['${retryId}']; }" 
              onerror="(function() {
                console.error('[DEBUG] Module failed:', '${scriptName}', this.src); 
                const retryKey = '${retryId}';
                if (!window[retryKey] || !window[retryKey].retryCount) {
                  window[retryKey] = { retryCount: 0, maxRetries: 3 };
                }
                if (window[retryKey].retryCount < window[retryKey].maxRetries) {
                  window[retryKey].retryCount++;
                  const delay = 1000 * window[retryKey].retryCount;
                  console.log('[DEBUG] Retrying module load:', '${scriptName}', 'attempt', window[retryKey].retryCount, 'delay', delay + 'ms');
                  window[retryKey].timeout = setTimeout(() => {
                    const script = document.createElement('script');
                    script.type = 'module';
                    script.src = '${src}';
                    script.onload = function() { 
                      console.log('[DEBUG] Module loaded after retry:', '${scriptName}'); 
                      if (window[retryKey]) { clearTimeout(window[retryKey].timeout); delete window[retryKey]; }
                    };
                    script.onerror = function() { 
                      console.error('[DEBUG] Module failed after retry:', '${scriptName}'); 
                      if (window[retryKey].retryCount >= window[retryKey].maxRetries) {
                        console.error('[DEBUG] Max retries reached for:', '${scriptName}');
                        delete window[retryKey];
                      }
                    };
                    document.body.appendChild(script);
                  }, delay);
                } else {
                  console.error('[DEBUG] Max retries reached for:', '${scriptName}');
                  delete window[retryKey];
                }
              })();"></script>`;
          }
        );
        
        // Preload ссылки не поддерживают onload/onerror события напрямую
        // Логирование будет через PerformanceObserver в index.html
        // Глобальный обработчик ошибок загрузки модулей с retry механизмом
        // Это обрабатывает ошибки для всех модулей, включая загружаемые через modulepreload
        if (!html.includes('window.moduleRetryHandler')) {
          const retryScript = `
<script>
(function() {
  // Глобальный retry механизм для всех модулей
  window.moduleRetryHandler = function(moduleSrc, retryCount) {
    retryCount = retryCount || 0;
    const maxRetries = 3;
    
    if (retryCount >= maxRetries) {
      console.error('[DEBUG] Max retries reached for module:', moduleSrc);
      return;
    }
    
    const delay = 1000 * (retryCount + 1);
    console.log('[DEBUG] Retrying module load:', moduleSrc, 'attempt', retryCount + 1, 'delay', delay + 'ms');
    
    setTimeout(() => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = moduleSrc;
      script.onload = function() {
        console.log('[DEBUG] Module loaded after retry:', moduleSrc);
      };
      script.onerror = function() {
        window.moduleRetryHandler(moduleSrc, retryCount + 1);
      };
      document.body.appendChild(script);
    }, delay);
  };
  
  // Отслеживаем ошибки загрузки модулей через PerformanceObserver
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach(entry => {
      // Проверяем только модули (JS файлы в assets)
      if (entry.name.includes('/assets/') && entry.name.endsWith('.js')) {
        const isFailed = (entry.transferSize === 0 && entry.duration === 0) || 
                        (entry.responseStatus && entry.responseStatus >= 400);
        
        if (isFailed && !entry.name.includes('telegram-web-app.js')) {
          console.error('[DEBUG] Module failed to load (PerformanceObserver):', entry.name);
          // Запускаем retry только если еще не запущен
          const retryKey = 'retry_' + entry.name.replace(/[^a-zA-Z0-9]/g, '_');
          if (!window[retryKey]) {
            window[retryKey] = true;
            window.moduleRetryHandler(entry.name, 0);
          }
        }
      }
    });
  });
  
  try {
    observer.observe({entryTypes: ['resource']});
  } catch(e) {
    console.warn('[DEBUG] PerformanceObserver not supported:', e);
  }
  
  // Дополнительная проверка через setTimeout - проверяем загруженные модули
  setTimeout(() => {
    const allScripts = Array.from(document.querySelectorAll('script[type="module"]'));
    const allPreloads = Array.from(document.querySelectorAll('link[rel="modulepreload"]'));
    const allModules = [...allScripts.map(s => s.src), ...allPreloads.map(l => l.href)].filter(Boolean);
    
    // Проверяем, что все модули загружены
    allModules.forEach(moduleSrc => {
      if (moduleSrc.includes('/assets/') && !moduleSrc.includes('telegram-web-app.js')) {
        // Проверяем через fetch, загружен ли модуль
        fetch(moduleSrc, {method: 'HEAD', cache: 'no-cache'})
          .then(() => {
            // Модуль доступен
          })
          .catch(() => {
            console.error('[DEBUG] Module not accessible:', moduleSrc);
            const retryKey = 'retry_' + moduleSrc.replace(/[^a-zA-Z0-9]/g, '_');
            if (!window[retryKey]) {
              window[retryKey] = true;
              window.moduleRetryHandler(moduleSrc, 0);
            }
          });
      }
    });
  }, 2000);
  
  // Также отслеживаем ошибки через глобальный обработчик ошибок
  window.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'SCRIPT' && e.target.type === 'module') {
      const src = e.target.src;
      if (src && src.includes('/assets/') && !src.includes('telegram-web-app.js')) {
        console.error('[DEBUG] Script module error:', src);
        window.moduleRetryHandler(src, 0);
      }
    }
  }, true);
})();
</script>`;
          
          // Вставляем скрипт перед закрывающим тегом </head>
          html = html.replace('</head>', retryScript + '\n</head>');
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
        // Умное разделение на чанки для оптимизации загрузки
        // Разделяем только большие библиотеки, чтобы основной код загружался быстрее
        manualChunks(id) {
          // Разделяем node_modules на отдельные чанки для оптимизации загрузки
          if (id.includes('node_modules')) {
            // React и React-DOM вместе (часто используются вместе)
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            // Большие библиотеки отдельно
            if (id.includes('recharts')) {
              return 'vendor-recharts';
            }
            // @dnd-kit библиотеки отдельно (большая библиотека)
            if (id.includes('@dnd-kit')) {
              return 'vendor-dnd';
            }
            // Остальные библиотеки вместе
            return 'vendor';
          }
          // Разделяем основной код на чанки для уменьшения размера основного модуля
          // Это поможет избежать обрыва соединения при загрузке большого файла
          if (id.includes('src/pages/')) {
            return 'pages';
          }
          if (id.includes('src/components/')) {
            return 'components';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['recharts']
  }
});

