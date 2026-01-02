import { Note } from '../../../utils/storage';

interface NoteItemProps {
  note: Note;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function NoteItem({ note, onEdit, onDelete }: NoteItemProps) {
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
      <div style={{
        fontSize: '14px',
        color: 'var(--tg-theme-hint-color)',
        marginBottom: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>{formatDate(note.createdAt)}</span>
        {note.page && (
          <span>Стр. {note.page}</span>
        )}
      </div>
      <div style={{
        fontSize: '16px',
        color: 'var(--tg-theme-text-color)',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {note.content}
      </div>
      {(onEdit || onDelete) && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '12px'
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

