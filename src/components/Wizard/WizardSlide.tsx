import { ReactNode, useState, useEffect } from 'react';

interface WizardSlideProps {
  icon: string;
  title: string;
  description?: string;
  children: ReactNode;
  actions: ReactNode;
}

export default function WizardSlide({ 
  icon, 
  title, 
  description, 
  children, 
  actions 
}: WizardSlideProps) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    // Фиксируем viewport при монтировании
    const originalHeight = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${originalHeight * 0.01}px`);
    
    let keyboardVisible = false;
    
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        // Если viewport меньше окна более чем на 150px, считаем что клавиатура открыта
        keyboardVisible = viewportHeight < windowHeight - 150;
        setIsKeyboardVisible(keyboardVisible);
        
        // Предотвращаем движение экрана - фиксируем высоту только если клавиатура не видна
        if (!keyboardVisible) {
          document.documentElement.style.setProperty('--vh', `${originalHeight * 0.01}px`);
        }
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      handleViewportChange(); // Проверяем при монтировании
    }

    // Предотвращаем движение при взаимодействии с карточками категорий
    const preventScroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const isCard = target.closest('.wizard-card');
      
      // Блокируем скролл только на карточках, чтобы они не двигались при клике
      // Разрешаем скролл везде внутри wizard-slide-content и его дочерних элементов
      if (isCard) {
        e.preventDefault();
      }
      // Для всех остальных элементов - разрешаем скролл (не вызываем preventDefault)
    };

    // Добавляем обработчик для предотвращения движения экрана
    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
      document.removeEventListener('touchmove', preventScroll);
      document.documentElement.style.removeProperty('--vh');
    };
  }, []);

  return (
    <>
      <div 
        className="wizard-slide-content"
        style={{
          paddingBottom: isKeyboardVisible ? 0 : undefined
        }}
      >
        <div className="wizard-slide-icon">{icon}</div>
        <h2 className="wizard-slide-title">{title}</h2>
        {description && (
          <p className="wizard-slide-description">{description}</p>
        )}
        <div className="wizard-slide-body">
          {children}
        </div>
      </div>
      <div 
        className="wizard-slide-actions"
        style={{ 
          display: isKeyboardVisible ? 'none' : 'flex',
          background: isKeyboardVisible ? 'transparent' : 'linear-gradient(to top, var(--tg-theme-bg-color) 0%, var(--tg-theme-bg-color) 80%, transparent 100%)',
          padding: isKeyboardVisible ? 0 : undefined,
          height: isKeyboardVisible ? 0 : undefined
        }}
      >
        {actions}
      </div>
    </>
  );
}

