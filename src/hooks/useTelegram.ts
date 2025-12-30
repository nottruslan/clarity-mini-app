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

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [webApp, setWebApp] = useState<any>(null);

  useEffect(() => {
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
            // Устанавливаем белый цвет по умолчанию
            tg.setHeaderColor('#ffffff');
            console.log('Initial header color set to white, isExpanded:', tg.isExpanded);
          } catch (error) {
            console.error('Error setting initial header color:', error);
          }
        }
      }, 200);
    }
    
    setIsReady(true);
  }, []);

  return {
    isReady,
    user,
    webApp,
    tg: window.Telegram?.WebApp || null
  };
}

