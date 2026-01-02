import { type Section } from '../types/navigation';
import SectionCarousel from '../components/Home/SectionCarousel';

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
      overflow: 'hidden',
      height: '100%'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
        backgroundColor: 'var(--tg-theme-bg-color)'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          marginBottom: '8px',
          color: 'var(--tg-theme-text-color)',
          lineHeight: '1.2'
        }}>
          Clarity
        </h1>
        
        <p style={{ 
          fontSize: '16px', 
          color: 'var(--tg-theme-hint-color)',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Инструменты для личной эффективности
        </p>
      </div>

      {/* Карусель разделов */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '20px 0',
        overflow: 'hidden'
      }}>
        <SectionCarousel
          sections={sections}
          onSectionClick={onSectionChange}
        />
      </div>
    </div>
  );
}

