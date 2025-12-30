import { useEffect } from 'react';
import Lottie from 'lottie-react';
import { initMainButton } from '@telegram-apps/sdk-react';
import animationData from '../assets/welcome-animation.json';

interface WelcomeProps {
  onComplete: () => void;
}

/**
 * Welcome/Onboarding экран
 * Показывается один раз при первом запуске приложения
 * Использует Telegram MainButton для CTA
 */
export function Welcome({ onComplete }: WelcomeProps) {
  useEffect(() => {
    try {
      const [mainButton] = initMainButton();
      
      // Настройка MainButton
      mainButton.setText('Начать');
      mainButton.enable();
      mainButton.show();

      // Обработчик нажатия
      const handleClick = () => {
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
    }
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
      {/* Lottie Animation */}
      <div
        style={{
          width: '200px',
          height: '200px',
          marginBottom: '20px',
        }}
      >
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
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

