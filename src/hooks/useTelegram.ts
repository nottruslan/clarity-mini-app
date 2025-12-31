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
    // Функция инициализации Telegram Web App
    const initTelegramWebApp = (): (() => void) | undefined => {
      // Проверяем наличие Telegram WebApp API
      if (!window.Telegram?.WebApp) {
        // Если Telegram WebApp недоступен (например, при разработке или тестировании),
        // все равно помечаем как готовый, чтобы приложение загрузилось
        console.warn('Telegram WebApp not available, running in fallback mode');
        setIsReady(true);
        return undefined;
      }

      const tg = window.Telegram.WebApp;
      
      // Инициализируем Telegram WebApp с обработкой ошибок
      try {
        tg.ready();
      } catch (error) {
        console.error('Error calling tg.ready():', error);
        // Продолжаем работу даже при ошибке
      }
      
      try {
        tg.expand();
      } catch (error) {
        console.error('Error calling tg.expand():', error);
        // Продолжаем работу даже при ошибке
      }
      
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
      if (tg.disableVerticalSwipes && typeof tg.disableVerticalSwipes === 'function') {
        try {
          tg.disableVerticalSwipes();
        } catch (error) {
          // Ошибка не критична, приложение должно продолжать работать
          console.warn('Could not disable vertical swipes:', error);
        }
      }

      // Устанавливаем начальный цвет header после небольшой задержки
      // чтобы убедиться, что WebApp полностью инициализирован
      setTimeout(() => {
        if (tg.setHeaderColor) {
          try {
            // Устанавливаем цвет из темы или белый по умолчанию
            // Убираем # из цвета, так как Telegram WebApp API принимает цвет в формате RRGGBB (без #)
            let headerColor = tg.themeParams?.header_bg_color || 'ffffff';
            if (headerColor.startsWith('#')) {
              headerColor = headerColor.substring(1);
            }
            
            // Валидация: цвет должен быть в формате RRGGBB (6 символов) или специальное значение
            if (headerColor === 'bg_color' || headerColor === 'secondary_bg_color' || 
                (headerColor.length === 6 && /^[0-9A-Fa-f]{6}$/.test(headerColor))) {
              tg.setHeaderColor(headerColor);
              console.log('Initial header color set to', headerColor, 'isExpanded:', tg.isExpanded);
            } else {
              console.warn('Invalid header color format:', headerColor, 'using default');
              tg.setHeaderColor('ffffff');
            }
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

      setIsReady(true);
      
      return () => {
        clearInterval(themeCheckInterval);
      };
    };

    // Функция проверки готовности Telegram WebApp API
    const isTelegramWebAppReady = (): boolean => {
      return !!(
        window.Telegram?.WebApp &&
        typeof window.Telegram.WebApp.ready === 'function' &&
        typeof window.Telegram.WebApp.expand === 'function'
      );
    };

    // Ожидаем загрузки скрипта Telegram WebApp
    // Скрипт может загружаться асинхронно, поэтому проверяем несколько раз
    let cleanup: (() => void) | undefined;
    let checkInterval: ReturnType<typeof setInterval> | undefined;

    if (isTelegramWebAppReady()) {
      // Скрипт уже загружен и готов, инициализируем сразу
      cleanup = initTelegramWebApp();
    } else {
      // Ждем загрузки скрипта
      let attempts = 0;
      const maxAttempts = 50; // 5 секунд максимум (50 * 100ms)
      checkInterval = setInterval(() => {
        attempts++;
        if (isTelegramWebAppReady()) {
          if (checkInterval) clearInterval(checkInterval);
          cleanup = initTelegramWebApp();
        } else if (attempts >= maxAttempts) {
          // Если скрипт не загрузился за 5 секунд, запускаем в fallback режиме
          if (checkInterval) clearInterval(checkInterval);
          console.warn('Telegram WebApp script not loaded after 5 seconds, running in fallback mode');
          setIsReady(true);
        }
      }, 100);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (cleanup) cleanup();
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

