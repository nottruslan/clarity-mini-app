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
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        // Если viewport меньше окна более чем на 150px, считаем что клавиатура открыта
        setIsKeyboardVisible(viewportHeight < windowHeight - 150);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      handleViewportChange(); // Проверяем при монтировании
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

  return (
    <>
      <div className="wizard-slide-content">
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
          display: isKeyboardVisible ? 'none' : 'flex'
        }}
      >
        {actions}
      </div>
    </>
  );
}

