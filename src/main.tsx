import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initMiniApp, initViewport, initThemeParams, initCloudStorage } from '@telegram-apps/sdk-react';
import { App } from './App';
import './index.css';
import '@telegram-apps/telegram-ui/dist/styles.css';

/**
 * Entry Point приложения
 * Инициализирует Telegram Mini App SDK перед запуском React
 */

// Инициализация Telegram SDK
const [miniApp] = initMiniApp();
const [viewport] = initViewport();
const [themeParams] = initThemeParams();
const [cloudStorage] = initCloudStorage();

// Готовность приложения
miniApp.ready();

// Разворачиваем viewport на весь экран
viewport.expand();

// Устанавливаем цвета header (опционально)
miniApp.setHeaderColor('#000000');

// Включаем closing confirmation (опционально)
miniApp.enableClosingConfirmation();

// Монтируем React приложение
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Debug информация в консоль (можно убрать в production)
if (import.meta.env.DEV) {
  console.log('🚀 Clarity Mini App initialized');
  console.log('📱 Platform:', miniApp.platform());
  console.log('🎨 Theme:', themeParams.isDark() ? 'dark' : 'light');
  console.log('📐 Viewport:', {
    width: viewport.width,
    height: viewport.height,
    isExpanded: viewport.isExpanded,
  });
  console.log('☁️ CloudStorage available:', !!cloudStorage);
}

