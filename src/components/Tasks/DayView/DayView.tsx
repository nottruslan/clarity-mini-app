import { Task, TaskCategory, TaskTag } from '../../../utils/storage';
import { getTasksForDay, sortTasksByTime, getTaskStartMinutes, getTaskDuration, formatTime } from '../../../utils/taskTimeUtils';
import TaskTimeBlock from './TaskTimeBlock';
import EmptyState from '../../EmptyState';

interface DayViewProps {
  tasks: Task[];
  categories?: TaskCategory[];
  tags?: TaskTag[];
  date: Date;
  onTaskClick?: (task: Task) => void;
  dayStartMinutes?: number;
  dayEndMinutes?: number;
}

export default function DayView({
  tasks,
  categories = [],
  tags = [],
  date,
  onTaskClick,
  dayStartMinutes = 360, // 6:00
  dayEndMinutes = 1440 // 24:00
}: DayViewProps) {
  const dayTasks = getTasksForDay(tasks, date);
  const sortedTasks = sortTasksByTime(dayTasks, date);

  // Генерируем временные слоты для отображения
  const hours: number[] = [];
  for (let h = Math.floor(dayStartMinutes / 60); h < Math.ceil(dayEndMinutes / 60); h++) {
    hours.push(h * 60);
  }

  if (sortedTasks.length === 0) {
    return (
      <EmptyState 
        message={`На ${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} нет запланированных задач`}
      />
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      overflow: 'hidden'
    }}>
      {/* Временная шкала */}
      <div style={{
        width: '60px',
        flexShrink: 0,
        paddingTop: '40px',
        borderRight: '1px solid var(--tg-theme-secondary-bg-color)'
      }}>
        {hours.map(minutes => {
          if (minutes % 60 !== 0) return null; // Показываем только целые часы
          return (
            <div
              key={minutes}
              style={{
                height: '60px',
                display: 'flex',
                alignItems: 'flex-start',
                paddingTop: '4px',
                paddingRight: '8px',
                justifyContent: 'flex-end'
              }}
            >
              <span style={{
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color)',
                fontWeight: '500'
              }}>
                {formatTime(minutes)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Область задач */}
      <div style={{
        flex: 1,
        position: 'relative',
        paddingTop: '40px',
        overflowY: 'auto' as const,
        WebkitOverflowScrolling: 'touch' as any
      }}>
        {sortedTasks.map(task => {
          const startMinutes = getTaskStartMinutes(task, date);
          const duration = getTaskDuration(task) || 60; // По умолчанию 1 час
          
          if (startMinutes === null) return null;

          const top = ((startMinutes - dayStartMinutes) / (dayEndMinutes - dayStartMinutes)) * 100;
          const height = (duration / (dayEndMinutes - dayStartMinutes)) * 100;

          return (
            <TaskTimeBlock
              key={task.id}
              task={task}
              categories={categories}
              tags={tags}
              top={`${Math.max(0, top)}%`}
              height={`${Math.min(100 - top, height)}%`}
              onClick={() => onTaskClick?.(task)}
            />
          );
        })}
      </div>
    </div>
  );
}

