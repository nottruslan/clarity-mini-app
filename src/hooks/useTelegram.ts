import { useEffect, useState } from 'react';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
}

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [webApp, setWebApp] = useState<any>(null);
  const [themeParams, setThemeParams] = useState<TelegramThemeParams | null>(null);

  useEffect(() => {
    // Проверяем флаг пропуска загрузки
    const skipLoading = sessionStorage.getItem('clarity_skip_loading');
    if (skipLoading === 'true') {
      console.warn('⚠️ Пропуск инициализации Telegram WebApp (пользователь выбрал пропустить)');
      setIsReady(true);
      return;
    }
    
    const initStartTime = Date.now();
    let timeoutId: ReturnType<typeof setTimeout>;
    
    // Таймаут на инициализацию - 5 секунд
    timeoutId = setTimeout(() => {
      const initTime = Date.now() - initStartTime;
      console.warn(`⚠️ Таймаут инициализации Telegram WebApp (${initTime}ms). Переход в fallback режим.`);
      setIsReady(true);
    }, 5000);
    
    // Инициализация Telegram Web App
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      setWebApp(tg);
      
      // Получаем данные пользователя
      if (tg.initDataUnsafe?.user) {
        const tgUser = tg.initDataUnsafe.user;
        setUser({
          id: tgUser.id,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name,
          username: tgUser.username,
          language_code: tgUser.language_code,
          is_premium: tgUser.is_premium,
          photo_url: tgUser.photo_url
        });
      }

      // Получаем параметры темы
      if (tg.themeParams) {
        setThemeParams(tg.themeParams);
        
        // Применяем тему к CSS переменным
        const root = document.documentElement;
        if (tg.themeParams.bg_color) {
          root.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
        }
        if (tg.themeParams.text_color) {
          root.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
        }
        if (tg.themeParams.hint_color) {
          root.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color);
        }
        if (tg.themeParams.button_color) {
          root.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
        }
        if (tg.themeParams.button_text_color) {
          root.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
        }
        if (tg.themeParams.secondary_bg_color) {
          root.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color);
        }
        if (tg.themeParams.section_bg_color) {
          root.style.setProperty('--tg-theme-section-bg-color', tg.themeParams.section_bg_color);
        }
        if (tg.themeParams.destructive_text_color) {
          root.style.setProperty('--tg-theme-destructive-text-color', tg.themeParams.destructive_text_color);
        }
      }
      
      // Предотвращаем закрытие приложения при свайпе вниз
      if (tg.disableVerticalSwipes) {
        try {
          tg.disableVerticalSwipes();
        } catch (error) {
          console.error('Error disabling vertical swipes:', error);
        }
      }

      // Устанавливаем начальный цвет header после небольшой задержки
      // чтобы убедиться, что WebApp полностью инициализирован
      setTimeout(() => {
        if (tg.setHeaderColor) {
          try {
            // Устанавливаем цвет из темы или белый по умолчанию
            const headerColor = tg.themeParams?.header_bg_color || '#ffffff';
            tg.setHeaderColor(headerColor);
            console.log('Initial header color set to', headerColor, 'isExpanded:', tg.isExpanded);
          } catch (error) {
            console.error('Error setting initial header color:', error);
          }
        }
      }, 200);

      // Периодически проверяем изменения темы (fallback)
      // Telegram Web App может изменять тему динамически
      let lastThemeParams = JSON.stringify(tg.themeParams || {});
      const themeCheckInterval = setInterval(() => {
        if (tg.themeParams) {
          const currentParams = JSON.stringify(tg.themeParams);
          if (currentParams !== lastThemeParams) {
            lastThemeParams = currentParams;
            setThemeParams(tg.themeParams);
            // Обновляем CSS переменные при изменении темы
            const root = document.documentElement;
            if (tg.themeParams.bg_color) {
              root.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
            }
            if (tg.themeParams.text_color) {
              root.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
            }
            if (tg.themeParams.hint_color) {
              root.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color);
            }
            if (tg.themeParams.button_color) {
              root.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
            }
            if (tg.themeParams.button_text_color) {
              root.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
            }
            if (tg.themeParams.secondary_bg_color) {
              root.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color);
            }
            if (tg.themeParams.section_bg_color) {
              root.style.setProperty('--tg-theme-section-bg-color', tg.themeParams.section_bg_color);
            }
            if (tg.themeParams.destructive_text_color) {
              root.style.setProperty('--tg-theme-destructive-text-color', tg.themeParams.destructive_text_color);
            }
          }
        }
      }, 1000);

      const initTime = Date.now() - initStartTime;
      console.log(`✅ Telegram WebApp инициализирован за ${initTime}ms`);
      
      clearTimeout(timeoutId);
      setIsReady(true);
      
      return () => {
        clearInterval(themeCheckInterval);
        clearTimeout(timeoutId);
      };
    } else {
      // Если Telegram WebApp недоступен (например, при разработке или тестировании),
      // все равно помечаем как готовый, чтобы приложение загрузилось
      console.warn('Telegram WebApp not available, running in fallback mode');
      clearTimeout(timeoutId);
      setIsReady(true);
    }
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    isReady,
    user,
    webApp,
    themeParams,
    tg: window.Telegram?.WebApp || null
  };
}

