import { useState, useRef } from 'react';
import { type Section } from '../types/navigation';
import LottieAnimation from '../components/LottieAnimation';
import { clearAllStorageData } from '../utils/storage';
import { useTelegram } from '../hooks/useTelegram';

interface HomePageProps {
  onSectionChange: (section: Section) => void;
}

export default function HomePage({ onSectionChange }: HomePageProps) {
  const { tg } = useTelegram();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sections: { id: Section; label: string; icon: string; description: string }[] = [
    { 
      id: 'tasks', 
      label: 'Задачи', 
      icon: '✓',
      description: 'Управляйте своими задачами'
    },
    { 
      id: 'habits', 
      label: 'Привычки', 
      icon: '🔥',
      description: 'Отслеживайте привычки'
    },
    { 
      id: 'finance', 
      label: 'Финансы', 
      icon: '💰',
      description: 'Контролируйте финансы'
    },
    { 
      id: 'languages', 
      label: 'Языки', 
      icon: '🌍',
      description: 'Изучайте языки'
    },
    { 
      id: 'yearly-report', 
      label: 'Годовой отчет', 
      icon: '📅',
      description: 'Проанализируйте год и спланируйте следующий'
    }
  ];

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '16px 16px',
      overflow: 'hidden',
      height: '100%'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '150px', 
        marginBottom: '12px' 
      }}>
        <LottieAnimation loop={true} autoplay={true} />
      </div>
      
      <h1 
        onClick={() => {
          clickCountRef.current += 1;
          
          // Сбрасываем таймер при каждом клике
          if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
          }
          
          // Если 5 кликов за 2 секунды - показываем диалог
          if (clickCountRef.current >= 5) {
            clickCountRef.current = 0;
            setShowClearDialog(true);
          } else {
            // Сбрасываем счетчик через 2 секунды
            clickTimeoutRef.current = setTimeout(() => {
              clickCountRef.current = 0;
            }, 2000);
          }
        }}
        style={{ 
          fontSize: '28px', 
          fontWeight: '600', 
          marginBottom: '8px',
          textAlign: 'center',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        Clarity
      </h1>
      
      <p style={{ 
        fontSize: '16px', 
        color: 'var(--tg-theme-hint-color)',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        Инструменты для личной эффективности
      </p>

      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {sections.map((section) => (
          <button
            key={section.id}
            className="tg-button"
            onClick={() => onSectionChange(section.id)}
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              padding: '16px 20px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '4px'
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              width: '100%'
            }}>
              <span style={{ fontSize: '24px' }}>{section.icon}</span>
              <span style={{ fontSize: '18px', fontWeight: '500' }}>
                {section.label}
              </span>
            </div>
            <span style={{ 
              fontSize: '14px', 
              opacity: 0.8,
              marginLeft: '36px'
            }}>
              {section.description}
            </span>
          </button>
        ))}
      </div>

      {/* Диалог очистки данных */}
      {showClearDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}
        onClick={() => setShowClearDialog(false)}
        >
          <div 
            style={{
              backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '12px',
              color: 'var(--tg-theme-text-color, #000000)'
            }}>
              Очистить все данные?
            </h2>
            <p style={{
              fontSize: '14px',
              color: 'var(--tg-theme-hint-color, #999999)',
              marginBottom: '24px',
              lineHeight: '1.5'
            }}>
              Это действие удалит все ваши задачи, привычки, финансовые данные и другие сохраненные данные. Это действие нельзя отменить.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowClearDialog(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid var(--tg-theme-button-color, #3390ec)',
                  backgroundColor: 'transparent',
                  color: 'var(--tg-theme-button-color, #3390ec)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
              <button
                onClick={async () => {
                  setShowClearDialog(false);
                  await clearAllStorageData(true);
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#ff3333',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Очистить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

