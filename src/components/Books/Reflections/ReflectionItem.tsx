import { Reflection } from '../../../utils/storage';

interface ReflectionItemProps {
  reflection: Reflection;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ReflectionItem({ reflection, onEdit, onDelete }: ReflectionItemProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      padding: '16px',
      borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
      backgroundColor: 'var(--tg-theme-bg-color)'
    }}>
      {reflection.title && (
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--tg-theme-text-color)',
          marginBottom: '8px'
        }}>
          {reflection.title}
        </div>
      )}
      <div style={{
        fontSize: '14px',
        color: 'var(--tg-theme-hint-color)',
        marginBottom: '12px'
      }}>
        {formatDate(reflection.createdAt)}
      </div>
      <div style={{
        fontSize: '16px',
        color: 'var(--tg-theme-text-color)',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        marginBottom: '12px'
      }}>
        {reflection.content}
      </div>
      {(onEdit || onDelete) && (
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          {onEdit && (
            <button
              onClick={onEdit}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid var(--tg-theme-button-color)',
                borderRadius: '8px',
                color: 'var(--tg-theme-button-color)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Редактировать
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid #f44336',
                borderRadius: '8px',
                color: '#f44336',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Удалить
            </button>
          )}
        </div>
      )}
    </div>
  );
}

