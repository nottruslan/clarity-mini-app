import { type Task } from '../../utils/storage';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDetails({ task, onClose }: TaskDetailsProps) {
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const getPriorityLabel = () => {
    if (!task.priority) return 'Не указан';
    switch (task.priority) {
      case 'high':
        return '🔴 Высокий';
      case 'medium':
        return '🟡 Средний';
      case 'low':
        return '🟢 Низкий';
      default:
        return 'Не указан';
    }
  };

  const getRecurringLabel = () => {
    switch (task.recurring) {
      case 'daily':
        return 'Ежедневно';
      case 'weekly':
        return 'Еженедельно';
      case 'monthly':
        return 'Ежемесячно';
      case 'yearly':
        return 'Ежегодно';
      default:
        return '';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--tg-theme-bg-color)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Заголовок */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          borderBottom: '1px solid var(--tg-theme-secondary-bg-color)'
        }}
      >
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: 'var(--tg-theme-text-color)',
          margin: 0
        }}>
          Детали задачи
        </h2>
        <button
          onClick={onClose}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'var(--tg-theme-secondary-bg-color)',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--tg-theme-text-color)'
          }}
        >
          ×
        </button>
      </div>

      {/* Контент */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Название */}
          <div>
            <div style={{
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Название
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'var(--tg-theme-text-color)',
              wordBreak: 'break-word'
            }}>
              {task.title}
            </div>
          </div>

          {/* Описание */}
          {task.description && (
            <div>
              <div style={{
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Описание
              </div>
              <div style={{
                fontSize: '16px',
                color: 'var(--tg-theme-text-color)',
                wordBreak: 'break-word',
                lineHeight: '1.5'
              }}>
                {task.description}
              </div>
            </div>
          )}

          {/* Приоритет */}
          <div>
            <div style={{
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Приоритет
            </div>
            <div style={{
              fontSize: '16px',
              color: 'var(--tg-theme-text-color)'
            }}>
              {getPriorityLabel()}
            </div>
          </div>

          {/* Дата */}
          {task.date && (
            <div>
              <div style={{
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Дата выполнения
              </div>
              <div style={{
                fontSize: '16px',
                color: 'var(--tg-theme-text-color)'
              }}>
                {formatDate(task.date)}
                {task.time && ` в ${task.time}`}
              </div>
            </div>
          )}

          {/* Повторения */}
          {task.recurring && (
            <div>
              <div style={{
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Повторения
              </div>
              <div style={{
                fontSize: '16px',
                color: 'var(--tg-theme-text-color)'
              }}>
                {getRecurringLabel()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

