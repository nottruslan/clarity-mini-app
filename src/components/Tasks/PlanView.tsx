import { useState } from 'react';
import { useCloudStorage } from '../../hooks/useCloudStorage';
import { type Task } from '../../utils/storage';
import HourlyCalendar from './HourlyCalendar';
import TaskDetails from './TaskDetails';
import EmptyState from '../EmptyState';

interface PlanViewProps {
  storage: ReturnType<typeof useCloudStorage>;
}

export default function PlanView({ storage }: PlanViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Объединяем активные и выполненные задачи для календаря
  const allTasks = [...storage.tasksData.tasks, ...storage.tasksData.completedTasks];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowDetails(true);
  };

  return (
    <>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Навигация по дням */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
          backgroundColor: 'var(--tg-theme-bg-color)'
        }}>
          <button
            onClick={goToPreviousDay}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--tg-theme-button-color)',
              backgroundColor: 'transparent',
              color: 'var(--tg-theme-button-color)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              minWidth: '60px'
            }}
          >
            ←
          </button>
          
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--tg-theme-text-color)',
              marginBottom: '4px'
            }}>
              {formatDate(currentDate)}
            </div>
            <button
              onClick={goToToday}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                border: '1px solid var(--tg-theme-hint-color)',
                backgroundColor: 'transparent',
                color: 'var(--tg-theme-hint-color)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Сегодня
            </button>
          </div>

          <button
            onClick={goToNextDay}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--tg-theme-button-color)',
              backgroundColor: 'transparent',
              color: 'var(--tg-theme-button-color)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              minWidth: '60px'
            }}
          >
            →
          </button>
        </div>

        {/* Календарь */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {allTasks.length === 0 ? (
            <EmptyState
              message="Нет задач для отображения в календаре"
            />
          ) : (
            <HourlyCalendar
              date={currentDate}
              tasks={allTasks}
              onTaskClick={handleTaskClick}
            />
          )}
        </div>
      </div>

      {/* Детали задачи */}
      {showDetails && selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => {
            setShowDetails(false);
            setSelectedTask(null);
          }}
        />
      )}
    </>
  );
}

