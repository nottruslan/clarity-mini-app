import { type Task } from '../../utils/storage';

interface TaskItemProps {
  task: Task;
  onToggleComplete: () => void;
  onOpenDetails: () => void;
  onOpenMenu: () => void;
}

export default function TaskItem({ task, onToggleComplete, onOpenDetails, onOpenMenu }: TaskItemProps) {
  const getPriorityIcon = () => {
    if (!task.priority) return '';
    switch (task.priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '';
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div
      className="list-item"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer'
      }}
      onClick={onOpenDetails}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => {
          e.stopPropagation();
          onToggleComplete();
        }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '20px',
          height: '20px',
          cursor: 'pointer',
          flexShrink: 0
        }}
      />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minWidth: 0
        }}
      >
        <div
          style={{
            fontSize: '16px',
            color: task.completed 
              ? 'var(--tg-theme-hint-color)' 
              : 'var(--tg-theme-text-color)',
            textDecoration: task.completed ? 'line-through' : 'none',
            wordBreak: 'break-word'
          }}
        >
          {task.pinned && '📌 '}
          {getPriorityIcon()} {task.title}
        </div>
        {task.date && (
          <div
            style={{
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)'
            }}
          >
            {formatDate(task.date)}
            {task.time && ` в ${task.time}`}
          </div>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenMenu();
        }}
        style={{
          padding: '8px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          color: 'var(--tg-theme-hint-color)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ⋯
      </button>
    </div>
  );
}

