import { useEffect, useRef } from 'react';
import { Transaction } from '../../utils/storage';

interface CategoryTransactionsBottomSheetProps {
  categoryName: string;
  transactions: Transaction[];
  onClose: () => void;
}

export default function CategoryTransactionsBottomSheet({
  categoryName,
  transactions,
  onClose
}: CategoryTransactionsBottomSheetProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    if (sheetRef.current) {
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.style.transform = 'translateY(0)';
        }
      }, 10);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(100%)';
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Сортируем транзакции по дате (новые сверху)
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (b.date !== a.date) {
      return b.date - a.date;
    }
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          backgroundColor: 'var(--tg-theme-bg-color)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '8px 0',
          paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
          transform: 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        {/* Индикатор */}
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: 'var(--tg-theme-hint-color)',
            borderRadius: '2px',
            margin: '8px auto 16px',
            opacity: 0.3
          }}
        />

        {/* Заголовок */}
        <div style={{ padding: '0 20px 16px', borderBottom: '1px solid var(--tg-theme-secondary-bg-color)' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
            {categoryName}
          </h3>
          <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)' }}>
            Транзакций: {transactions.length} • Всего: {formatCurrency(total)}
          </div>
        </div>

        {/* Список транзакций */}
        <div style={{ padding: '8px 0' }}>
          {sortedTransactions.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: 'var(--tg-theme-hint-color)'
            }}>
              Нет транзакций в этой категории
            </div>
          ) : (
            sortedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="list-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  borderBottom: '1px solid var(--tg-theme-secondary-bg-color)'
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
                    {transaction.description || 'Без описания'}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--tg-theme-hint-color)'
                  }}>
                    {formatDate(transaction.date)}
                  </div>
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: transaction.type === 'income' ? '#4caf50' : '#f44336',
                  whiteSpace: 'nowrap'
                }}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

