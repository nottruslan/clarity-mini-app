import { useState, useRef } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import InBoxView from '../components/Tasks/InBoxView';
import TasksView from '../components/Tasks/TasksView';
import PlanView from '../components/Tasks/PlanView';

interface TasksPageProps {
  storage: ReturnType<typeof useCloudStorage>;
}

const sectionTitles = ['InBox', 'Задачи', 'План'];

export default function TasksPage({ storage }: TasksPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < sectionTitles.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Информационный блок */}
      <div style={{
        padding: '16px',
        backgroundColor: 'var(--tg-theme-secondary-bg-color)',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)'
      }}>
        <div style={{
          fontSize: '14px',
          color: 'var(--tg-theme-text-color)',
          lineHeight: '1.5'
        }}>
          <div style={{ marginBottom: '8px', fontWeight: '500' }}>
            💡 Как работать с задачами:
          </div>
          <div style={{ fontSize: '13px', color: 'var(--tg-theme-hint-color)' }}>
            <div style={{ marginBottom: '4px' }}>
              • В <strong>InBox</strong> вносите быстрые задачи, когда что-то вспомнили, но нет времени отсортировать
            </div>
            <div style={{ marginBottom: '4px' }}>
              • Из InBox можно перенести в <strong>Задачи</strong> и сделать более детальное описание
            </div>
            <div>
              • Дальше укажите время и разместите в <strong>План</strong> на день
            </div>
          </div>
        </div>
      </div>

      {/* Заголовки разделов */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 16px',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
        backgroundColor: 'var(--tg-theme-bg-color)'
      }}>
        {sectionTitles.map((title, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              fontSize: '16px',
              fontWeight: currentSlide === index ? '600' : '400',
              color: currentSlide === index 
                ? 'var(--tg-theme-button-color)' 
                : 'var(--tg-theme-hint-color)',
              cursor: 'pointer',
              padding: '8px 12px',
              borderBottom: currentSlide === index 
                ? '2px solid var(--tg-theme-button-color)' 
                : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            {title}
          </div>
        ))}
      </div>

      {/* Контейнер со слайдами */}
      <div
        className="slide-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`slide ${currentSlide === 0 ? 'active' : currentSlide > 0 ? 'prev' : 'next'}`}>
          <InBoxView storage={storage} />
        </div>
        <div className={`slide ${currentSlide === 1 ? 'active' : currentSlide > 1 ? 'prev' : 'next'}`}>
          <TasksView storage={storage} />
        </div>
        <div className={`slide ${currentSlide === 2 ? 'active' : currentSlide > 2 ? 'prev' : 'next'}`}>
          <PlanView storage={storage} />
        </div>
      </div>
    </div>
  );
}

