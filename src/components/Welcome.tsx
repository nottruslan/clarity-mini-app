import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { initMainButton } from '@telegram-apps/sdk-react';
// Временно используем заглушку, пока не будет добавлена реальная анимация с персонажем
// import animationData from '../assets/welcome-animation.json';

interface WelcomeProps {
  onComplete: () => void;
}

/**
 * Welcome/Onboarding экран
 * Показывается один раз при первом запуске приложения
 * Использует Telegram MainButton для CTA
 */
export function Welcome({ onComplete }: WelcomeProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  // Загружаем анимацию с персонажем
  useEffect(() => {
    // Вариант 1: Загрузка по URL (раскомментируй и укажи ссылку на Lottie JSON)
    // Пример: https://lottie.host/embed/abc123.json
    // fetch('https://lottie.host/embed/...')
    //   .then(res => res.json())
    //   .then(data => setAnimationData(data))
    //   .catch(() => {
    //     console.warn('Failed to load animation from URL');
    //   });

    // Вариант 2: Локальный файл (добавь файл welcome-animation.json в src/assets/)
    // Файл должен содержать Lottie анимацию с персонажем в Telegram стиле
    // См. ANIMATION_INSTRUCTIONS.md для инструкций
    const loadAnimation = async () => {
      try {
        const module = await import('../assets/welcome-animation.json');
        setAnimationData(module.default);
      } catch (error) {
        console.warn('Animation file not found. Add welcome-animation.json to src/assets/');
        console.warn('See ANIMATION_INSTRUCTIONS.md for details');
      }
    };
    loadAnimation();
  }, []);

  useEffect(() => {
    const setupMainButton = async () => {
      try {
        const result = initMainButton();
        const [mainButton] = result instanceof Promise ? await result : result;
        
        // Настройка MainButton
        mainButton.setText('Начать');
        mainButton.enable();
        mainButton.show();

        // Обработчик нажатия
        const handleClick = () => {
          console.log('MainButton clicked, calling onComplete');
          onComplete();
        };

        mainButton.on('click', handleClick);

        // Cleanup при размонтировании
        return () => {
          mainButton.off('click', handleClick);
          mainButton.hide();
        };
      } catch (error) {
        console.error('Failed to initialize MainButton:', error);
        // Fallback: добавляем обычную кнопку если MainButton не работает
      }
    };
    
    setupMainButton();
  }, [onComplete]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: 'var(--tg-theme-bg-color)',
        gap: '32px',
      }}
    >
      {/* Lottie Animation с персонажем */}
      <div
        style={{
          width: '280px',
          height: '280px',
          marginBottom: '20px',
        }}
      >
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--tg-theme-hint-color)',
              fontSize: '14px',
            }}
          >
            Загрузка...
          </div>
        )}
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: '28px',
          fontWeight: '700',
          color: 'var(--tg-theme-text-color)',
          textAlign: 'center',
          marginBottom: '8px',
        }}
      >
        Clarity
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: '17px',
          fontWeight: '400',
          color: 'var(--tg-theme-hint-color)',
          textAlign: 'center',
          lineHeight: '1.5',
          maxWidth: '320px',
        }}
      >
        Управляй своей жизнью в одном месте внутри Telegram
      </p>

      {/* Features List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
          maxWidth: '320px',
        }}
      >
        <FeatureItem icon="✓" text="Записывай и выполняй задачи" />
        <FeatureItem icon="🔄" text="Отслеживай привычки" />
        <FeatureItem icon="💰" text="Фиксируй доходы и расходы" />
        <FeatureItem icon="🌍" text="Изучай языки" />
      </div>

      {/* Fallback кнопка (если MainButton не работает) */}
      <button
        onClick={onComplete}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          backgroundColor: 'var(--tg-theme-button-color, #007AFF)',
          color: 'var(--tg-theme-button-text-color, #FFFFFF)',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Начать
      </button>

      {/* Spacer для MainButton */}
      <div style={{ height: '80px' }} />
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'var(--tg-theme-secondary-bg-color)',
        borderRadius: '12px',
      }}
    >
      <span style={{ fontSize: '24px' }}>{icon}</span>
      <span
        style={{
          fontSize: '15px',
          color: 'var(--tg-theme-text-color)',
        }}
      >
        {text}
      </span>
    </div>
  );
}

