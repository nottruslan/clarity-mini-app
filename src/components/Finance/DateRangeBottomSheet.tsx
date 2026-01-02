import { useState, useEffect, useRef } from 'react';
import GradientButton from '../Wizard/GradientButton';

interface DateRangeBottomSheetProps {
  startDate?: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format
  onApply: (startDate: string, endDate: string) => void;
  onClose: () => void;
}

export default function DateRangeBottomSheet({
  startDate,
  endDate,
  onApply,
  onClose
}: DateRangeBottomSheetProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [localStartDate, setLocalStartDate] = useState<string>(startDate || '');
  const [localEndDate, setLocalEndDate] = useState<string>(endDate || '');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Отслеживаем открытие клавиатуры
  useEffect(() => {
    let keyboardVisible = false;
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        keyboardVisible = viewportHeight < windowHeight - 150;
        setIsKeyboardVisible(keyboardVisible);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      handleViewportChange();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    if (sheetRef.current) {
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.style.transform = 'translateY(0)';
        }
      }, 10);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(100%)';
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  const handleApply = () => {
    if (localStartDate && localEndDate) {
      onApply(localStartDate, localEndDate);
      handleClose();
    }
  };

  return (
    <div 
      ref={backdropRef}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          backgroundColor: 'var(--tg-theme-bg-color)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '8px 0',
          paddingBottom: isKeyboardVisible ? '8px' : 'calc(8px + env(safe-area-inset-bottom))',
          transform: 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Индикатор */}
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: 'var(--tg-theme-hint-color)',
            borderRadius: '2px',
            margin: '8px auto 16px',
            opacity: 0.3
          }}
        />

        {/* Контент */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1 }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--tg-theme-text-color)',
            margin: 0
          }}>
            Выбрать период
          </h3>

          {/* Поле "От" */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              display: 'block',
              color: 'var(--tg-theme-text-color)',
              width: '100%',
              maxWidth: '100%'
            }}>
              От
            </label>
            <input
              type="date"
              value={localStartDate}
              onChange={(e) => setLocalStartDate(e.target.value)}
              className="wizard-input"
              style={{ 
                marginTop: 0, 
                fontFamily: 'inherit',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Поле "До" */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              display: 'block',
              color: 'var(--tg-theme-text-color)',
              width: '100%',
              maxWidth: '100%'
            }}>
              До
            </label>
            <input
              type="date"
              value={localEndDate}
              onChange={(e) => setLocalEndDate(e.target.value)}
              className="wizard-input"
              style={{ 
                marginTop: 0, 
                fontFamily: 'inherit',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Кнопки */}
          <div style={{ display: 'flex', gap: '12px', width: '100%', paddingBottom: '8px' }}>
            <GradientButton
              variant="secondary"
              onClick={handleClose}
            >
              Отмена
            </GradientButton>
            <GradientButton
              onClick={handleApply}
              disabled={!localStartDate || !localEndDate}
            >
              Применить
            </GradientButton>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

