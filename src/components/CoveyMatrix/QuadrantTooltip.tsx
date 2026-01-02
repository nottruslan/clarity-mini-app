import { useEffect, useRef } from 'react';

interface QuadrantTooltipProps {
  quadrant: 'q1' | 'q2' | 'q3' | 'q4';
  title: string;
  description: string;
  onClose: () => void;
}

const quadrantExamples = {
  q1: ['Срочные дедлайны', 'Критические проблемы', 'Неотложные звонки'],
  q2: ['Планирование целей', 'Развитие навыков', 'Важные проекты', 'Здоровье'],
  q3: ['Отвлекающие звонки', 'Некоторые письма', 'Неважные встречи'],
  q4: ['Просмотр соцсетей', 'Бесконечная переписка', 'Пустая активность']
};

export default function QuadrantTooltip({
  quadrant,
  title,
  description,
  onClose
}: QuadrantTooltipProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

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
        zIndex: 10000,
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
          padding: '8px 0 20px',
          paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
          transform: 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
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
        
        <div style={{ padding: '0 20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600' }}>
            {title}
          </h3>
          
          <p style={{
            margin: '0 0 16px 0',
            fontSize: '14px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.5'
          }}>
            {description}
          </p>

          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            color: 'var(--tg-theme-text-color)'
          }}>
            Примеры:
          </div>
          
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            fontSize: '14px',
            color: 'var(--tg-theme-hint-color)',
            lineHeight: '1.8'
          }}>
            {quadrantExamples[quadrant].map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
