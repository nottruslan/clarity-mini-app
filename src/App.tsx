import { useState, useEffect } from 'react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { initMiniApp, initViewport } from '@telegram-apps/sdk-react';
import { Layout } from './components/Layout';
import { Welcome } from './components/Welcome';
import { AppShell } from './components/AppShell';
import { useTelegramTheme } from './hooks/useTelegramTheme';
import { useOnboarding } from './hooks/useOnboarding';

/**
 * Главный компонент приложения
 * Управляет переключением между Welcome экраном и основным AppShell
 * Использует CloudStorage для определения первого запуска
 */
export function App() {
  const theme = useTelegramTheme();
  const { isOnboardingComplete, isLoading, completeOnboarding } = useOnboarding();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSDKReady, setIsSDKReady] = useState(false);

  // Отладка: отслеживаем изменения isOnboardingComplete
  useEffect(() => {
    console.log('isOnboardingComplete changed:', isOnboardingComplete);
    console.log('isLoading:', isLoading);
  }, [isOnboardingComplete, isLoading]);

  // Инициализация Telegram SDK
  useEffect(() => {
    const initSDK = async () => {
      try {
        const [miniApp] = initMiniApp();
        miniApp.ready();
        
        // Инициализируем viewport (может быть Promise)
        try {
          const [viewportPromise] = initViewport();
          if (viewportPromise instanceof Promise) {
            const viewport = await viewportPromise;
            if (viewport && typeof viewport.expand === 'function') {
              viewport.expand();
            }
          }
        } catch (viewportError) {
          // Viewport expand не критичен
          console.warn('Viewport expand failed:', viewportError);
        }
        
        setIsSDKReady(true);
        
        if (import.meta.env.DEV) {
          console.log('🚀 Clarity Mini App initialized');
        }
      } catch (error) {
        console.error('Failed to initialize SDK:', error);
        // Продолжаем работу даже если SDK не инициализировался (для разработки в браузере)
        setIsSDKReady(true);
      }
    };
    
    initSDK();
  }, []);

  const handleWelcomeComplete = async () => {
    console.log('handleWelcomeComplete called');
    setIsTransitioning(true);
    // Сначала сохраняем в CloudStorage
    console.log('Calling completeOnboarding...');
    await completeOnboarding();
    console.log('completeOnboarding finished');
    // Даем время на анимацию fade out перед переключением
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  // Показываем загрузку пока SDK и CloudStorage инициализируются
  if (!isSDKReady || isLoading) {
    return (
      <AppRoot appearance={theme}>
        <Layout>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                opacity: 0.5,
              }}
            >
              ⏳
            </div>
          </div>
        </Layout>
      </AppRoot>
    );
  }

  return (
    <AppRoot appearance={theme}>
      <Layout>
        <div
          className={isTransitioning ? 'fade-slide-exit-active' : ''}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          {!isOnboardingComplete ? (
            <Welcome onComplete={handleWelcomeComplete} />
          ) : (
            <div className={isTransitioning ? '' : 'fade-slide-enter-active'}>
              <AppShell />
            </div>
          )}
        </div>
      </Layout>
    </AppRoot>
  );
}

