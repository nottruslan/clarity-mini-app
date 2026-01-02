import { Book } from '../../utils/storage';

interface BookItemProps {
  book: Book;
  onOpenDetails: () => void;
  onOpenMenu: () => void;
}

const statusLabels: Record<Book['status'], { label: string; color: string }> = {
  'want-to-read': { label: 'Хочу прочитать', color: '#2196f3' },
  'reading': { label: 'Читаю', color: '#ff9800' },
  'completed': { label: 'Прочитано', color: '#4caf50' },
  'paused': { label: 'На паузе', color: '#ffc107' },
  'abandoned': { label: 'Брошено', color: '#f44336' }
};

export default function BookItem({ book, onOpenDetails, onOpenMenu }: BookItemProps) {
  const statusInfo = statusLabels[book.status];

  const renderStars = () => {
    if (!book.rating) return null;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ fontSize: '14px', color: i <= book.rating! ? '#ffc107' : '#ccc' }}>
          ★
        </span>
      );
    }
    return <div style={{ display: 'flex', gap: '2px' }}>{stars}</div>;
  };

  return (
    <div
      className="list-item"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        padding: '12px 16px',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)'
      }}
      onClick={onOpenDetails}
    >
      {/* Обложка */}
      <div style={{
        width: '60px',
        height: '90px',
        borderRadius: '8px',
        backgroundColor: 'var(--tg-theme-secondary-bg-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        flexShrink: 0,
        overflow: 'hidden'
      }}>
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <span>📚</span>
        )}
      </div>

      {/* Основная информация */}
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
            fontWeight: '500',
            color: 'var(--tg-theme-text-color)',
            wordBreak: 'break-word'
          }}
        >
          {book.title}
        </div>
        {book.author && (
          <div style={{
            fontSize: '14px',
            color: 'var(--tg-theme-hint-color)'
          }}>
            {book.author}
          </div>
        )}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '4px'
        }}>
          <span
            style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: `${statusInfo.color}20`,
              color: statusInfo.color,
              fontWeight: '500'
            }}
          >
            {statusInfo.label}
          </span>
          {book.rating && renderStars()}
        </div>
      </div>

      {/* Кнопка меню */}
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

