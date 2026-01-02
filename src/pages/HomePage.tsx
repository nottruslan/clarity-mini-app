import { type Section } from '../types/navigation';
import LottieAnimation from '../components/LottieAnimation';
import { sectionColors } from '../utils/sectionColors';

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
    },
    { 
      id: 'books', 
      label: 'Книги', 
      icon: '📚',
      description: 'Ведите библиотеку и заметки'
    },
    { 
      id: 'diary', 
      label: 'Дневник', 
      icon: '📔',
      description: 'Записывайте ежедневные рефлексии'
    }
  ];

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      overflow: 'hidden',
      height: '100%'
    }}>
      {/* Компактный заголовок */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 16px 24px',
        flexShrink: 0
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          marginBottom: '16px',
          textAlign: 'center',
          color: 'var(--tg-theme-text-color)'
        }}>
          Clarity
        </h1>
        
        <div style={{ 
          width: '100%', 
          maxWidth: '120px', 
          marginBottom: '0'
        }}>
          <LottieAnimation loop={true} autoplay={true} />
        </div>
      </div>

      {/* Список разделов в стиле Telegram Mini Apps */}
      <div className="list" style={{ 
        width: '100%',
        flex: 1,
        overflowY: 'auto'
      }}>
        {sections.map((section, index) => {
          const colors = sectionColors[section.id];
          const isLast = index === sections.length - 1;
          
          return (
            <button
              key={section.id}
              className="list-item"
              onClick={() => onSectionChange(section.id)}
              style={{
                width: '100%',
                backgroundColor: 'var(--tg-theme-section-bg-color)',
                borderBottom: isLast 
                  ? 'none' 
                  : '1px solid var(--tg-theme-secondary-bg-color)',
                padding: '16px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '0'
              }}
            >
              {/* Иконка */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0
              }}>
                {section.icon}
              </div>
              
              {/* Название и описание */}
              <div style={{ 
                flex: 1, 
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                minWidth: 0
              }}>
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: '500', 
                  color: 'var(--tg-theme-text-color)',
                  lineHeight: '1.4'
                }}>
                  {section.label}
                </span>
                <span style={{ 
                  fontSize: '14px', 
                  color: 'var(--tg-theme-hint-color)',
                  lineHeight: '1.4'
                }}>
                  {section.description}
                </span>
              </div>
              
              {/* Стрелка */}
              <div style={{
                fontSize: '20px',
                color: 'var(--tg-theme-hint-color)',
                flexShrink: 0
              }}>
                →
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

