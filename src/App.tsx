import { useState, useEffect } from 'react';
import { AppRoot } from '@telegram-apps/telegram-ui';
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

  const handleWelcomeComplete = async () => {
    setIsTransitioning(true);
    // Даем время на анимацию fade out
    setTimeout(async () => {
      await completeOnboarding();
      setIsTransitioning(false);
    }, 300);
  };

  // Показываем загрузку пока проверяем CloudStorage
  if (isLoading) {
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

