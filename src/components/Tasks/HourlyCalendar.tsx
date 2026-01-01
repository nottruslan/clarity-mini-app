import { type Task } from '../../utils/storage';

interface HourlyCalendarProps {
  date: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function HourlyCalendar({ date, tasks, onTaskClick }: HourlyCalendarProps) {
  // Получаем задачи для этого дня
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const dayTasks = tasks.filter(task => {
    if (!task.date) return false;
    const taskDate = new Date(task.date);
    return taskDate >= dayStart && taskDate <= dayEnd;
  });

  // Задачи с временем
  const tasksWithTime = dayTasks.filter(task => task.time);
  
  // Задачи без времени
  const tasksWithoutTime = dayTasks.filter(task => !task.time);

  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes; // минуты с начала дня
  };

  const getTimeBlockStyle = (task: Task) => {
    if (!task.time) return {};
    
    const startMinutes = parseTime(task.time);
    const topPercent = (startMinutes / (24 * 60)) * 100;
    
    // Предполагаем длительность 1 час, если не указана
    const durationMinutes = 60;
    const heightPercent = (durationMinutes / (24 * 60)) * 100;

    return {
      position: 'absolute' as const,
      top: `${topPercent}%`,
      height: `${heightPercent}%`,
      left: '60px',
      right: '16px',
      backgroundColor: task.priority === 'high' 
        ? 'rgba(244, 67, 54, 0.2)'
        : task.priority === 'medium'
        ? 'rgba(255, 193, 7, 0.2)'
        : task.priority === 'low'
        ? 'rgba(76, 175, 80, 0.2)'
        : 'var(--tg-theme-secondary-bg-color)',
      borderLeft: `4px solid ${
        task.priority === 'high'
          ? '#f44336'
          : task.priority === 'medium'
          ? '#ffc107'
          : task.priority === 'low'
          ? '#4caf50'
          : 'var(--tg-theme-hint-color)'
      }`,
      borderRadius: '8px',
      padding: '8px 12px',
      cursor: 'pointer',
      overflow: 'hidden'
    };
  };

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Задачи без времени */}
      {tasksWithoutTime.length > 0 && (
        <div style={{
          padding: '16px',
          borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
          backgroundColor: 'var(--tg-theme-bg-color)'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--tg-theme-hint-color)',
            marginBottom: '12px',
            textTransform: 'uppercase'
          }}>
            Без времени
          </div>
          {tasksWithoutTime.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              style={{
                padding: '12px',
                backgroundColor: 'var(--tg-theme-section-bg-color)',
                borderRadius: '8px',
                marginBottom: '8px',
                cursor: 'pointer',
                border: '1px solid var(--tg-theme-secondary-bg-color)'
              }}
            >
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--tg-theme-text-color)',
                wordBreak: 'break-word'
              }}>
                {task.pinned && '📌 '}
                {task.priority === 'high' && '🔴 '}
                {task.priority === 'medium' && '🟡 '}
                {task.priority === 'low' && '🟢 '}
                {task.title}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Почасовой календарь */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        position: 'relative',
        padding: '16px 0'
      }}>
        <div style={{ position: 'relative', minHeight: '2400px' }}>
          {/* Часы */}
          {Array.from({ length: 24 }, (_, hour) => (
            <div
              key={hour}
              style={{
                position: 'absolute',
                top: `${(hour / 24) * 100}%`,
                left: '0',
                width: '50px',
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color)',
                textAlign: 'right',
                paddingRight: '12px'
              }}
            >
              {formatHour(hour)}
            </div>
          ))}

          {/* Линии часов */}
          {Array.from({ length: 24 }, (_, hour) => (
            <div
              key={`line-${hour}`}
              style={{
                position: 'absolute',
                top: `${(hour / 24) * 100}%`,
                left: '60px',
                right: '16px',
                height: '1px',
                backgroundColor: hour % 6 === 0
                  ? 'var(--tg-theme-hint-color)'
                  : 'var(--tg-theme-secondary-bg-color)',
                opacity: 0.3
              }}
            />
          ))}

          {/* Задачи с временем */}
          {tasksWithTime.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              style={getTimeBlockStyle(task)}
            >
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--tg-theme-text-color)',
                wordBreak: 'break-word',
                marginBottom: '4px'
              }}>
                {task.pinned && '📌 '}
                {task.title}
              </div>
              {task.time && (
                <div style={{
                  fontSize: '12px',
                  color: 'var(--tg-theme-hint-color)'
                }}>
                  {task.time}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

