import { Transaction } from '../../utils/storage';
import EmptyState from '../EmptyState';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  onOpenMenu?: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onTransactionClick, onOpenMenu }: TransactionListProps) {
  // Убеждаемся, что transactions всегда является массивом
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  console.log('[TransactionList] Render - transactions prop:', {
    isArray: Array.isArray(transactions),
    count: safeTransactions.length,
    transactionIds: safeTransactions.map(t => t.id),
    transactions: safeTransactions
  });
  
  if (safeTransactions.length === 0) {
    return (
      <EmptyState 
        message="У вас пока нет транзакций. Добавьте первую транзакцию!"
      />
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  // Получаем ISO-дату для группировки (YYYY-MM-DD) в локальном времени
  const getDateKey = (timestamp: number): string => {
    const date = new Date(timestamp);
    // Устанавливаем время на начало дня для корректной группировки
    date.setHours(0, 0, 0, 0);
    // Используем локальное время вместо UTC, чтобы избежать сдвига на день
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Группируем транзакции по дате (используем ISO-дату как ключ)
  console.log('[TransactionList] Grouping transactions:', {
    inputCount: safeTransactions.length,
    transactions: safeTransactions.map(t => ({
      id: t.id,
      date: new Date(t.date).toISOString(),
      timestamp: t.date,
      dateKey: getDateKey(t.date)
    }))
  });
  const grouped = safeTransactions.reduce((acc, transaction) => {
    const dateKey = getDateKey(transaction.date);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);
  console.log('[TransactionList] Grouped transactions:', {
    groups: Object.keys(grouped).map(key => ({
      dateKey: key,
      count: grouped[key].length,
      transactionIds: grouped[key].map(t => t.id)
    }))
  });

  // Сортируем транзакции внутри каждой группы по createdAt (новые сверху)
  Object.keys(grouped).forEach(dateKey => {
    grouped[dateKey].sort((a, b) => {
      const aCreated = a.createdAt || 0;
      const bCreated = b.createdAt || 0;
      return bCreated - aCreated;
    });
  });

  // Сортируем группы по дате (новые сначала)
  const sortedDates = Object.keys(grouped).sort((a, b) => {
    // Сортируем по ISO-дате (YYYY-MM-DD) в обратном порядке
    return b.localeCompare(a);
  });

  return (
    <div style={{ 
      flex: 1, 
      overflowY: 'auto' as const,
      paddingTop: '0px',
      paddingBottom: '0px',
      backgroundColor: 'transparent',
      WebkitOverflowScrolling: 'touch' as any
    }}>
      {sortedDates.map((dateKey) => {
        // Преобразуем ISO-дату обратно в timestamp для formatDate в локальном времени
        const [year, month, day] = dateKey.split('-').map(Number);
        const dateTimestamp = new Date(year, month - 1, day).getTime();
        const displayDate = formatDate(dateTimestamp);
        
        return (
          <div key={dateKey}>
            <div style={{
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--tg-theme-hint-color)',
              backgroundColor: 'var(--tg-theme-secondary-bg-color)'
            }}>
              {displayDate}
            </div>
          {grouped[dateKey].map((transaction) => (
            <div
              key={transaction.id}
              className="list-item"
              onClick={() => onTransactionClick?.(transaction)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: transaction.type === 'income' 
                  ? 'rgba(76, 175, 80, 0.1)' 
                  : 'rgba(244, 67, 54, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0
              }}>
                {transaction.type === 'income' ? '💰' : '💸'}
              </div>
              <div style={{ 
                flex: 1, 
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                minWidth: 0
              }}>
                <div style={{
                  fontSize: '16px',
                  color: 'var(--tg-theme-text-color)',
                  wordBreak: 'break-word'
                }}>
                  {transaction.category}
                </div>
                {transaction.description && (
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--tg-theme-hint-color)'
                  }}>
                    {transaction.description}
                  </div>
                )}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0
              }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                  color: transaction.type === 'income' ? '#4caf50' : '#f44336',
                  whiteSpace: 'nowrap'
              }}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
                </div>
                {onOpenMenu && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenMenu(transaction);
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
                )}
              </div>
            </div>
          ))}
          </div>
        );
      })}
    </div>
  );
}

