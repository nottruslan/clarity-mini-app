import { useEffect, useState } from 'react';
import AnimatedLogo from './AnimatedLogo';

interface SplashScreenProps {
  isLoading: boolean;
  onComplete: () => void;
}

export default function SplashScreen({ isLoading, onComplete }: SplashScreenProps) {
  const [show, setShow] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // Показываем ровно 3 секунды
    const timer = setTimeout(() => {
      setShow(false);
      // Даем время на crossfade анимацию
      setTimeout(() => {
        onComplete();
      }, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

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
        backgroundColor: '#ffffff',
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

