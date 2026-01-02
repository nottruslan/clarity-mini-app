import { Quote } from '../../../utils/storage';

interface QuoteItemProps {
  quote: Quote;
  onDelete?: () => void;
}

export default function QuoteItem({ quote, onDelete }: QuoteItemProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div style={{
      padding: '16px',
      borderLeft: '4px solid var(--tg-theme-button-color)',
      backgroundColor: 'var(--tg-theme-secondary-bg-color)',
      borderRadius: '8px',
      marginBottom: '12px'
    }}>
      <div style={{
        fontSize: '16px',
        color: 'var(--tg-theme-text-color)',
        fontStyle: 'italic',
        lineHeight: '1.6',
        marginBottom: '12px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        "{quote.text}"
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: 'var(--tg-theme-hint-color)'
      }}>
        <div>
          {quote.page && <span>Стр. {quote.page}</span>}
          {quote.page && quote.chapter && <span> • </span>}
          {quote.chapter && <span>{quote.chapter}</span>}
        </div>
        <span>{formatDate(quote.createdAt)}</span>
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          style={{
            marginTop: '12px',
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
  );
}

