import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

// #region agent log
const logEndpoint = 'http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5';
const log = (msg: string, data?: any, hypothesisId?: string) => {
  fetch(logEndpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx',message:msg,data:data||{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:hypothesisId||'B'})}).catch(()=>{});
};
log('main.tsx loaded', {hasWindow: typeof window !== 'undefined', hasRoot: !!document.getElementById('root')}, 'B');
// #endregion

// Инициализация обработки очереди отложенных сохранений при загрузке приложения
if (typeof window !== 'undefined') {
  // #region agent log
  const storageInitStart = Date.now();
  log('Starting storage init', {timestamp: storageInitStart}, 'E');
  // #endregion
  
  // Импортируем и инициализируем после небольшой задержки, чтобы Telegram.WebApp успел инициализироваться
  setTimeout(async () => {
    try {
      // #region agent log
      log('Importing storage utils', {}, 'E');
      // #endregion
      const { initializePendingSavesProcessor } = await import('./utils/storage');
      // #region agent log
      log('Storage utils imported', {loadTime: Date.now() - storageInitStart}, 'E');
      // #endregion
      initializePendingSavesProcessor();
      // #region agent log
      log('Storage processor initialized', {}, 'E');
      // #endregion
    } catch (err) {
      // #region agent log
      log('Storage init error', {error: err?.toString(), loadTime: Date.now() - storageInitStart}, 'E');
      // #endregion
    }
  }, 1000);
}

// #region agent log
const renderStart = Date.now();
log('Starting React render', {hasRoot: !!document.getElementById('root')}, 'B');
// #endregion

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    // #region agent log
    log('Root element not found', {}, 'B');
    // #endregion
    throw new Error('Root element not found');
  }
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // #region agent log
  log('React render completed', {renderTime: Date.now() - renderStart}, 'B');
  // #endregion
} catch (err) {
  // #region agent log
  log('React render error', {error: err?.toString(), renderTime: Date.now() - renderStart}, 'B');
  // #endregion
  throw err;
}

