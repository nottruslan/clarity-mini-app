import { useState, useEffect } from 'react';
import { Transaction } from '../../utils/storage';

interface TransactionDetailsProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onClose: () => void;
}

export default function TransactionDetails({
  transaction,
  onEdit,
  onDelete,
  onDuplicate,
  onClose
}: TransactionDetailsProps) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Отслеживаем открытие клавиатуры (на всякий случай, хотя здесь нет input полей)
  useEffect(() => {
    let keyboardVisible = false;
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        keyboardVisible = viewportHeight < windowHeight - 150;
        setIsKeyboardVisible(keyboardVisible);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      handleViewportChange();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'var(--tg-theme-bg-color)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        padding: '8px 0 20px',
        paddingBottom: isKeyboardVisible ? '20px' : 'calc(20px + env(safe-area-inset-bottom))',
        maxHeight: '80vh',
        overflowY: 'auto' as const,
        WebkitOverflowScrolling: 'touch' as any
      }}>
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
        <div style={{
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'var(--tg-theme-text-color)',
              margin: 0
            }}>
              Детали транзакции
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

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: transaction.type === 'income'
              ? 'rgba(76, 175, 80, 0.1)'
              : 'rgba(244, 67, 54, 0.1)',
            border: `2px solid ${transaction.type === 'income' ? '#4caf50' : '#f44336'}`,
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '14px',
              color: 'var(--tg-theme-hint-color)',
              marginBottom: '8px'
            }}>
              {transaction.type === 'income' ? 'Доход' : 'Расход'}
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: transaction.type === 'income' ? '#4caf50' : '#f44336'
            }}>
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div>
              <div style={{
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Категория
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--tg-theme-text-color)'
              }}>
                {transaction.category}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Дата
              </div>
              <div style={{
                fontSize: '16px',
                color: 'var(--tg-theme-text-color)'
              }}>
                {formatDate(transaction.date)}
              </div>
            </div>

            {transaction.description && (
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
                  {transaction.description}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

