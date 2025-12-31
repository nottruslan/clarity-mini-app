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

export interface TelegramInitError {
  message: string;
  code: 'SCRIPT_NOT_LOADED' | 'WEBAPP_NOT_AVAILABLE' | 'USER_NOT_AUTHORIZED' | 'INIT_DATA_MISSING' | 'TIMEOUT';
  details?: any;
}

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [webApp, setWebApp] = useState<any>(null);
  const [themeParams, setThemeParams] = useState<TelegramThemeParams | null>(null);
  const [initError, setInitError] = useState<TelegramInitError | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let retryCount = 0;
    let isInitialized = false;
    const maxRetries = 5; // Увеличено для мобильных устройств
    const retryDelay = 500; // Уменьшена задержка для более быстрой проверки
    const initTimeout = 10000; // Увеличено до 10 секунд для мобильных устройств

    const logInitStep = (step: string, data?: any) => {
      console.log(`[Telegram Init] ${step}`, data || '');
    };

    const logError = (error: TelegramInitError) => {
      console.error(`[Telegram Init Error] ${error.code}: ${error.message}`, error.details);
      setInitError(error);
    };

    const tryInitialize = () => {
      if (isInitialized) return;
      setIsInitializing(true);
      setInitError(null);

      // Проверка 1: Загрузка скрипта
      // В мобильном приложении Telegram скрипт может быть уже доступен,
      // но WebApp может еще не быть инициализирован
      if (!window.Telegram) {
        logInitStep('Checking for Telegram script...', { 
          available: false,
          retryCount,
          userAgent: navigator.userAgent 
        });
        
        if (retryCount < maxRetries) {
          retryCount++;
          logInitStep(`Retrying initialization (${retryCount}/${maxRetries})...`);
          timeoutId = setTimeout(tryInitialize, retryDelay);
          return;
        } else {
          logError({
            code: 'SCRIPT_NOT_LOADED',
            message: 'Скрипт Telegram Web App не загружен. Проверьте подключение к интернету и настройки браузера.',
            details: { retries: retryCount, userAgent: navigator.userAgent }
          });
          setIsInitializing(false);
          // В fallback режиме все равно помечаем как готовый для разработки
          setIsReady(true);
          return;
        }
      }

      // Проверка 1.5: В мобильном приложении WebApp может быть доступен не сразу
      if (!window.Telegram.WebApp && retryCount < maxRetries) {
        logInitStep('Telegram script found, but WebApp not ready yet...', { retryCount });
        retryCount++;
        timeoutId = setTimeout(tryInitialize, retryDelay);
        return;
      }

      logInitStep('Telegram script found');

      // Проверка 2: Наличие WebApp
      if (!window.Telegram.WebApp) {
        logError({
          code: 'WEBAPP_NOT_AVAILABLE',
          message: 'Telegram WebApp недоступен. Убедитесь, что приложение открыто через Telegram.',
          details: { hasTelegram: !!window.Telegram }
        });
        setIsInitializing(false);
        setIsReady(true); // Fallback режим
        return;
      }

      const tg = window.Telegram.WebApp;
      logInitStep('WebApp found', {
        version: tg.version,
        platform: tg.platform,
        colorScheme: tg.colorScheme
      });

      // Проверка 3: Наличие initData
      if (!tg.initDataUnsafe) {
        logError({
          code: 'INIT_DATA_MISSING',
          message: 'Данные инициализации отсутствуют. Приложение может работать некорректно.',
          details: { hasWebApp: true }
        });
      } else {
        logInitStep('Init data found', {
          hasUser: !!tg.initDataUnsafe.user
        });
      }

      // Проверка 4: Наличие пользователя
      if (!tg.initDataUnsafe?.user) {
        logError({
          code: 'USER_NOT_AUTHORIZED',
          message: 'Пользователь не авторизован. Убедитесь, что вы открыли приложение через Telegram.',
          details: { hasInitData: !!tg.initDataUnsafe }
        });
        // Не блокируем приложение, но логируем проблему
      } else {
        const tgUser = tg.initDataUnsafe.user;
        logInitStep('User data found', {
          id: tgUser.id,
          firstName: tgUser.first_name,
          username: tgUser.username
        });
        
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

      try {
        // Инициализация WebApp
        tg.ready();
        logInitStep('WebApp.ready() called');
        
        tg.expand();
        logInitStep('WebApp.expand() called', { isExpanded: tg.isExpanded });
        
        setWebApp(tg);
      } catch (error) {
        logError({
          code: 'WEBAPP_NOT_AVAILABLE',
          message: 'Ошибка при инициализации WebApp',
          details: { error }
        });
      }

      // Получаем параметры темы
      if (tg.themeParams) {
        logInitStep('Theme params found', Object.keys(tg.themeParams));
        setThemeParams(tg.themeParams);
        
        // Применяем тему к CSS переменным
        const root = document.documentElement;
        const applyTheme = (params: any) => {
          if (params.bg_color) {
            root.style.setProperty('--tg-theme-bg-color', params.bg_color);
          }
          if (params.text_color) {
            root.style.setProperty('--tg-theme-text-color', params.text_color);
          }
          if (params.hint_color) {
            root.style.setProperty('--tg-theme-hint-color', params.hint_color);
          }
          if (params.button_color) {
            root.style.setProperty('--tg-theme-button-color', params.button_color);
          }
          if (params.button_text_color) {
            root.style.setProperty('--tg-theme-button-text-color', params.button_text_color);
          }
          if (params.secondary_bg_color) {
            root.style.setProperty('--tg-theme-secondary-bg-color', params.secondary_bg_color);
          }
          if (params.section_bg_color) {
            root.style.setProperty('--tg-theme-section-bg-color', params.section_bg_color);
          }
          if (params.destructive_text_color) {
            root.style.setProperty('--tg-theme-destructive-text-color', params.destructive_text_color);
          }
        };
        
        applyTheme(tg.themeParams);
      } else {
        logInitStep('Theme params not found');
      }
      
      // Предотвращаем закрытие приложения при свайпе вниз
      if (tg.disableVerticalSwipes) {
        try {
          tg.disableVerticalSwipes();
          logInitStep('Vertical swipes disabled');
        } catch (error) {
          console.error('[Telegram Init] Error disabling vertical swipes:', error);
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
            logInitStep('Initial header color set', { headerColor, isExpanded: tg.isExpanded });
          } catch (error) {
            console.error('[Telegram Init] Error setting initial header color:', error);
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

      logInitStep('Initialization completed successfully');
      isInitialized = true;
      setIsInitializing(false);
      setIsReady(true);
      
      return () => {
        clearInterval(themeCheckInterval);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    };

    // Устанавливаем таймаут на инициализацию
    const initTimeoutId = setTimeout(() => {
      if (!isInitialized) {
        logError({
          code: 'TIMEOUT',
          message: 'Превышено время ожидания инициализации Telegram Web App',
          details: { timeout: initTimeout }
        });
        isInitialized = true;
        setIsInitializing(false);
        setIsReady(true); // Fallback режим
      }
    }, initTimeout);

    // Запускаем инициализацию
    tryInitialize();

    return () => {
      isInitialized = true;
      clearTimeout(initTimeoutId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return {
    isReady,
    user,
    webApp,
    themeParams,
    initError,
    isInitializing,
    tg: window.Telegram?.WebApp || null
  };
}

