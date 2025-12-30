import { useEffect, useState } from 'react';
import { init, retrieveLaunchParams } from '@tma.js/sdk';

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
    init()
      .then(() => {
        const launchParams = retrieveLaunchParams();
        setUser(launchParams.initData?.user || null);
        
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          tg.ready();
          tg.expand();
          setWebApp(tg);
        }
        
        setIsReady(true);
      })
      .catch((error) => {
        console.error('Failed to initialize Telegram SDK:', error);
        setIsReady(true); // Продолжаем работу даже при ошибке
      });
  }, []);

  return {
    isReady,
    user,
    webApp,
    tg: window.Telegram?.WebApp || null
  };
}

