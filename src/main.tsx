import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

// Инициализация обработки очереди отложенных сохранений при загрузке приложения
if (typeof window !== 'undefined') {
  // Импортируем и инициализируем после небольшой задержки, чтобы Telegram.WebApp успел инициализироваться
  setTimeout(async () => {
    const { initializePendingSavesProcessor } = await import('./utils/storage');
    initializePendingSavesProcessor();
  }, 1000);
}

// Автоматический запуск теста синхронизации, если есть параметр ?testSync в URL
if (typeof window !== 'undefined' && window.location.search.includes('testSync')) {
  // Импортируем и запускаем тест после небольшой задержки, чтобы Telegram.WebApp успел инициализироваться
  setTimeout(async () => {
    const { testSync } = await import('./utils/storage');
    console.log('🧪 [AUTO] Auto-running sync test from URL parameter...');
    testSync();
  }, 1000);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

