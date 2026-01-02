import { useEffect, useState } from 'react';
import AnimatedLogo from './AnimatedLogo';

interface SplashScreenProps {
  isLoading: boolean;
  onComplete: () => void;
}

export default function SplashScreen({ isLoading, onComplete }: SplashScreenProps) {
  const [show, setShow] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // Минимум 2 секунды
    const minTimer = setTimeout(() => {
      setMinTimePassed(true);
    }, 2000);

    return () => clearTimeout(minTimer);
  }, []);

  useEffect(() => {
    // Проверяем, прошло ли минимум 2 секунды И данные загрузились
    if (minTimePassed && !isLoading) {
      // Небольшая задержка для плавного перехода
      const fadeTimer = setTimeout(() => {
        setShow(false);
        // Даем время на crossfade анимацию
        setTimeout(() => {
          onComplete();
        }, 300);
      }, 100);

      return () => clearTimeout(fadeTimer);
    }
  }, [minTimePassed, isLoading, onComplete]);

  if (!show) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--tg-theme-button-color, #673ab7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100000,
        opacity: show ? 1 : 0,
        transition: 'opacity 0.3s ease-out'
      }}
    >
      <AnimatedLogo size={250} />
    </div>
  );
}

