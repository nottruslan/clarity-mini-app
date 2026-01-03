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
            // Используем единый глобальный retry механизм
            return `<script type="module" src="${src}" 
              onload="console.log('[DEBUG] Module loaded:', '${scriptName}');" 
              onerror="(function() {
                console.error('[DEBUG] Module failed:', '${scriptName}', this.src); 
                // Используем глобальный retry обработчик
                if (window.moduleRetryHandler) {
                  window.moduleRetryHandler(this.src, 0);
                } else {
                  // Если глобальный обработчик еще не загружен, ждем немного и пробуем снова
                  setTimeout(() => {
                    if (window.moduleRetryHandler) {
                      window.moduleRetryHandler(this.src, 0);
                    } else {
                      console.error('[DEBUG] Global retry handler not available');
                    }
                  }, 500);
                }
              })();"></script>`;
          }
        );
        
        // Preload ссылки не поддерживают onload/onerror события напрямую
        // Логирование будет через PerformanceObserver в index.html
        // Глобальный обработчик ошибок загрузки модулей с retry механизмом
        // Это обрабатывает ошибки для всех модулей, включая загружаемые через modulepreload
        // Проверяем, что глобальный обработчик еще не вставлен (ищем определение функции, а не просто упоминание)
        if (!html.includes('window.moduleRetryHandler = function')) {
          const retryScript = `
<script>
(function() {
  // Глобальный retry механизм для всех модулей
  // Глобальный retry механизм с защитой от дублирования
  window.moduleRetryAttempts = window.moduleRetryAttempts || {};
  
  window.moduleRetryHandler = function(moduleSrc, retryCount) {
    retryCount = retryCount || 0;
    const maxRetries = 5; // Увеличиваем до 5 попыток
    
    // Защита от дублирования - проверяем, не запущен ли уже retry для этого модуля
    const retryKey = 'retry_' + moduleSrc.replace(/[^a-zA-Z0-9]/g, '_');
    if (window.moduleRetryAttempts[retryKey] && window.moduleRetryAttempts[retryKey].inProgress) {
      console.log('[DEBUG] Retry already in progress for:', moduleSrc);
      return;
    }
    
    if (retryCount >= maxRetries) {
      console.error('[DEBUG] Max retries reached for module:', moduleSrc);
      if (window.moduleRetryAttempts[retryKey]) {
        delete window.moduleRetryAttempts[retryKey];
      }
      return;
    }
    
    // Помечаем, что retry запущен
    window.moduleRetryAttempts[retryKey] = { inProgress: true, retryCount: retryCount };
    
    const delay = 1000 * (retryCount + 1);
    console.log('[DEBUG] Retrying module load:', moduleSrc, 'attempt', retryCount + 1, '/', maxRetries, 'delay', delay + 'ms');
    
    setTimeout(() => {
      // Удаляем старый скрипт, если он есть
      const oldScripts = Array.from(document.querySelectorAll('script[type="module"]')).filter(s => s.src === moduleSrc);
      oldScripts.forEach(s => {
        s.onerror = null;
        s.onload = null;
        if (s.parentNode) {
          s.parentNode.removeChild(s);
        }
      });
      
      const script = document.createElement('script');
      script.type = 'module';
      script.src = moduleSrc;
      script.onload = function() {
        console.log('[DEBUG] Module loaded after retry:', moduleSrc);
        if (window.moduleRetryAttempts[retryKey]) {
          delete window.moduleRetryAttempts[retryKey];
        }
      };
      script.onerror = function(e) {
        console.error('[DEBUG] Module failed after retry:', moduleSrc, 'attempt', retryCount + 1);
        // Снимаем флаг inProgress, чтобы можно было повторить
        if (window.moduleRetryAttempts[retryKey]) {
          window.moduleRetryAttempts[retryKey].inProgress = false;
        }
        window.moduleRetryHandler(moduleSrc, retryCount + 1);
      };
      document.head.appendChild(script); // Добавляем в head, а не body
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
  // НО только для ошибок загрузки, не для ошибок выполнения
  window.addEventListener('error', (e) => {
    // Проверяем, что это ошибка загрузки модуля, а не ошибка выполнения
    if (e.target && e.target.tagName === 'SCRIPT' && e.target.type === 'module') {
      const src = e.target.src;
      if (src && src.includes('/assets/') && !src.includes('telegram-web-app.js')) {
        // Проверяем, что это действительно ошибка загрузки (нет сообщения об ошибке выполнения)
        // Ошибки загрузки обычно не имеют message или имеют специфичные сообщения
        const isLoadError = !e.message || 
                           e.message.includes('Failed to load') || 
                           e.message.includes('Loading') ||
                           e.message.includes('network') ||
                           e.message.includes('connection');
        
        if (isLoadError) {
          console.error('[DEBUG] Script module load error:', src);
          // Небольшая задержка, чтобы избежать конфликта с встроенным onerror
          setTimeout(() => {
            window.moduleRetryHandler(src, 0);
          }, 100);
        }
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

