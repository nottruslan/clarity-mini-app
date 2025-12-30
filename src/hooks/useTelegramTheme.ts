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
    const initTheme = async () => {
      try {
        if (!themeParamsInstance) {
          const [params] = await initThemeParams();
          themeParamsInstance = params;
        }

        const themeParams = themeParamsInstance;
        
        // Устанавливаем начальную тему (isDark это getter, не метод)
        setTheme(themeParams.isDark ? 'dark' : 'light');
        
        // Инициализация CSS переменных
        updateCSSVariables(themeParams);

        // Подписка на изменения темы
        const unsubscribe = themeParams.on('change', () => {
          const newTheme = themeParams.isDark ? 'dark' : 'light';
          setTheme(newTheme);
          updateCSSVariables(themeParams);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error('Failed to initialize theme:', error);
      }
    };
    
    initTheme();
  }, []);

  return theme;
}

/**
 * Обновляет CSS переменные на основе текущей темы Telegram
 */
function updateCSSVariables(themeParams: Awaited<ReturnType<typeof initThemeParams>>[0]) {
  const root = document.documentElement;

  // Основные цвета темы (все это getters, не методы)
  const bgColor = themeParams.bgColor || '#ffffff';
  const textColor = themeParams.textColor || '#000000';
  const hintColor = themeParams.hintColor || '#999999';
  const linkColor = themeParams.linkColor || '#007AFF';
  const buttonColor = themeParams.buttonColor || '#007AFF';
  const buttonTextColor = themeParams.buttonTextColor || '#ffffff';
  const secondaryBgColor = themeParams.secondaryBgColor || '#f0f0f0';

  root.style.setProperty('--tg-theme-bg-color', bgColor);
  root.style.setProperty('--tg-theme-text-color', textColor);
  root.style.setProperty('--tg-theme-hint-color', hintColor);
  root.style.setProperty('--tg-theme-link-color', linkColor);
  root.style.setProperty('--tg-theme-button-color', buttonColor);
  root.style.setProperty('--tg-theme-button-text-color', buttonTextColor);
  root.style.setProperty('--tg-theme-secondary-bg-color', secondaryBgColor);

  // Обновляем meta theme-color для браузера
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', bgColor);
  }
}

