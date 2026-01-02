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


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

