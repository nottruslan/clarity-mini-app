import { Transaction } from '../../utils/storage';
import EmptyState from '../EmptyState';

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
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

  // Группируем транзакции по дате
  const grouped = transactions.reduce((acc, transaction) => {
    const dateKey = formatDate(transaction.date);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  // Сортируем транзакции по дате (новые сначала)
  const sortedDates = Object.keys(grouped).sort((a, b) => {
    const dateA = grouped[a][0].date;
    const dateB = grouped[b][0].date;
    return dateB - dateA;
  });

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {sortedDates.map((dateKey) => (
        <div key={dateKey}>
          <div style={{
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--tg-theme-hint-color)',
            backgroundColor: 'var(--tg-theme-secondary-bg-color)'
          }}>
            {dateKey}
          </div>
          {grouped[dateKey].map((transaction) => (
            <div
              key={transaction.id}
              className="list-item"
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
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {transaction.category}
                </div>
                {transaction.description && (
                  <div style={{
                    fontSize: '14px',
                    color: 'var(--tg-theme-hint-color)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {transaction.description}
                  </div>
                )}
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: transaction.type === 'income' ? '#4caf50' : '#f44336'
              }}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

