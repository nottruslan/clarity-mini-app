import { type Section } from '../types/navigation';
import LottieAnimation from '../components/LottieAnimation';

interface HomePageProps {
  onSectionChange: (section: Section) => void;
}

export default function HomePage({ onSectionChange }: HomePageProps) {
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
    },
    { 
      id: 'covey-matrix', 
      label: 'Матрица Эйзенхауэра', 
      icon: '⚡',
      description: 'Организуйте задачи по важности и срочности'
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
      <h1 style={{ 
        fontSize: '28px', 
        fontWeight: '600', 
        marginBottom: '8px',
        textAlign: 'center'
      }}>
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
        maxWidth: '150px', 
        marginBottom: '32px' 
      }}>
        <LottieAnimation loop={true} autoplay={true} />
      </div>

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
            onClick={() => onSectionChange(section.id)}
            style={{
              width: '100%',
              backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
              color: 'var(--tg-theme-text-color, #000000)',
              border: '1px solid var(--tg-theme-button-color, #3390ec)',
              borderRadius: '10px',
              padding: '16px 20px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '4px',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              fontSize: '16px',
              fontWeight: '500',
              minHeight: '44px'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              width: '100%'
            }}>
              <span style={{ fontSize: '24px' }}>{section.icon}</span>
              <span style={{ fontSize: '18px', fontWeight: '500', color: 'var(--tg-theme-text-color, #000000)' }}>
                {section.label}
              </span>
            </div>
            <span style={{ 
              fontSize: '14px', 
              opacity: 0.8,
              marginLeft: '36px',
              color: 'var(--tg-theme-hint-color, #999999)'
            }}>
              {section.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

