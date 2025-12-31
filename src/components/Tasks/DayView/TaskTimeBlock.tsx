import { Task, TaskCategory, TaskTag } from '../../../utils/storage';
import { formatDuration } from '../../../utils/taskTimeUtils';

interface TaskTimeBlockProps {
  task: Task;
  categories?: TaskCategory[];
  tags?: TaskTag[];
  top: string;
  height: string;
  onClick?: () => void;
}

export default function TaskTimeBlock({
  task,
  categories = [],
  tags = [],
  top,
  height,
  onClick
}: TaskTimeBlockProps) {
  const category = task.categoryId ? categories.find(c => c.id === task.categoryId) : undefined;
  const isCompleted = task.status === 'completed' || task.completed;
  const duration = task.duration || 60;

  const priorityColors = {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#f44336'
  };

  const backgroundColor = category?.color || 
    (task.priority ? priorityColors[task.priority] : 'var(--tg-theme-button-color)');

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        left: '8px',
        right: '8px',
        top,
        height,
        minHeight: '40px',
        backgroundColor: isCompleted ? `${backgroundColor}80` : backgroundColor,
        borderRadius: '8px',
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        border: `2px solid ${isCompleted ? 'transparent' : backgroundColor}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '4px'
      }}>
        {category?.icon && (
          <span style={{ fontSize: '14px' }}>{category.icon}</span>
        )}
        <span style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#ffffff',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1
        }}>
          {task.text}
        </span>
      </div>
      
      {duration && (
        <div style={{
          fontSize: '11px',
          color: '#ffffff',
          opacity: 0.9
        }}>
          {formatDuration(duration)}
        </div>
      )}
    </div>
  );
}

