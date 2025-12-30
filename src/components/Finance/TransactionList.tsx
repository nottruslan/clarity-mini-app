import { useState, useRef } from 'react';
import { Transaction } from '../../utils/storage';
import EmptyState from '../EmptyState';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onTransactionClick }: TransactionListProps) {
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
    <div style={{ 
      flex: 1, 
      overflowY: 'auto' as const,
      paddingTop: '0px',
      WebkitOverflowScrolling: 'touch' as any
    }}>
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
              onClick={() => onTransactionClick?.(transaction)}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                const target = e.currentTarget;
                const startX = touch.clientX;
                const startY = touch.clientY;
                let moved = false;
                
                const handleMove = (moveEvent: TouchEvent) => {
                  const moveTouch = moveEvent.touches[0];
                  const deltaX = Math.abs(moveTouch.clientX - startX);
                  const deltaY = Math.abs(moveTouch.clientY - startY);
                  
                  if (deltaX > 10 || deltaY > 10) {
                    moved = true;
                  }
                };
                
                const handleEnd = () => {
                  if (!moved && onTransactionClick) {
                    onTransactionClick(transaction);
                  }
                  document.removeEventListener('touchmove', handleMove);
                  document.removeEventListener('touchend', handleEnd);
                };
                
                document.addEventListener('touchmove', handleMove);
                document.addEventListener('touchend', handleEnd);
              }}
              style={{
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

