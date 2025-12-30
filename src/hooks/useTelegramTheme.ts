import { useEffect, useState } from 'react';
import { themeParams } from '@telegram-apps/sdk-react';

export type TelegramTheme = 'light' | 'dark';

/**
 * Hook для синхронизации темы с Telegram
 * Автоматически подписывается на изменения темы и обновляет CSS переменные
 */
export function useTelegramTheme(): TelegramTheme {
  const [theme, setTheme] = useState<TelegramTheme>(
    themeParams.isDark() ? 'dark' : 'light'
  );

  useEffect(() => {
    // Инициализация CSS переменных
    updateCSSVariables();

    // Подписка на изменения темы
    const unsubscribe = themeParams.on('change', () => {
      const newTheme = themeParams.isDark() ? 'dark' : 'light';
      setTheme(newTheme);
      updateCSSVariables();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return theme;
}

/**
 * Обновляет CSS переменные на основе текущей темы Telegram
 */
function updateCSSVariables() {
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

