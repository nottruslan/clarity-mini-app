import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import '@telegram-apps/telegram-ui/dist/styles.css';

/**
 * Entry Point приложения
 * Простая инициализация без сложной логики SDK
 */

// Монтируем React приложение
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

