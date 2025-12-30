import { useEffect, useState } from 'react';
import { initThemeParams } from '@telegram-apps/sdk-react';

export type TelegramTheme = 'light' | 'dark';

let themeParamsInstance: ReturnType<typeof initThemeParams>[0] | null = null;

/**
 * Hook для синхронизации темы с Telegram
 * Автоматически подписывается на изменения темы и обновляет CSS переменные
 */
export function useTelegramTheme(): TelegramTheme {
  const [theme, setTheme] = useState<TelegramTheme>('light');

  useEffect(() => {
    try {
      if (!themeParamsInstance) {
        const [params] = initThemeParams();
        themeParamsInstance = params;
      }

      const themeParams = themeParamsInstance;
      
      // Устанавливаем начальную тему
      setTheme(themeParams.isDark() ? 'dark' : 'light');
      
      // Инициализация CSS переменных
      updateCSSVariables(themeParams);

      // Подписка на изменения темы
      const unsubscribe = themeParams.on('change', () => {
        const newTheme = themeParams.isDark() ? 'dark' : 'light';
        setTheme(newTheme);
        updateCSSVariables(themeParams);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error('Failed to initialize theme:', error);
    }
  }, []);

  return theme;
}

/**
 * Обновляет CSS переменные на основе текущей темы Telegram
 */
function updateCSSVariables(themeParams: ReturnType<typeof initThemeParams>[0]) {
  const root = document.documentElement;

  // Основные цвета темы
  root.style.setProperty('--tg-theme-bg-color', themeParams.backgroundColor());
  root.style.setProperty('--tg-theme-text-color', themeParams.textColor());
  root.style.setProperty('--tg-theme-hint-color', themeParams.hintColor());
  root.style.setProperty('--tg-theme-link-color', themeParams.linkColor());
  root.style.setProperty('--tg-theme-button-color', themeParams.buttonColor());
  root.style.setProperty('--tg-theme-button-text-color', themeParams.buttonTextColor());
  root.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondaryBackgroundColor());

  // Обновляем meta theme-color для браузера
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', themeParams.backgroundColor());
  }
}

