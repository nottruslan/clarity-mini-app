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
        padding: '20px',
        paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
        maxHeight: '80vh',
        overflowY: 'auto' as const,
        WebkitOverflowScrolling: 'touch' as any
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600'
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
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
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
            gap: '12px'
          }}>
            <div>
              <div style={{
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color)',
                marginBottom: '4px'
              }}>
                Категория
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '600'
              }}>
                {transaction.category}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color)',
                marginBottom: '4px'
              }}>
                Дата
              </div>
              <div style={{
                fontSize: '16px'
              }}>
                {formatDate(transaction.date)}
              </div>
            </div>

            {transaction.description && (
              <div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--tg-theme-hint-color)',
                  marginBottom: '4px'
                }}>
                  Описание
                </div>
                <div style={{
                  fontSize: '16px'
                }}>
                  {transaction.description}
                </div>
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '8px'
          }}>
            <button
              onClick={onEdit}
              className="tg-button"
              style={{
                width: '100%'
              }}
            >
              Редактировать
            </button>
            <button
              onClick={onDuplicate}
              style={{
                width: '100%',
                padding: '12px 24px',
                borderRadius: '10px',
                border: '2px solid var(--tg-theme-button-color)',
                backgroundColor: 'transparent',
                color: 'var(--tg-theme-button-color)',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                minHeight: '44px'
              }}
            >
              Дублировать
            </button>
            <button
              onClick={onDelete}
              style={{
                width: '100%',
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--tg-theme-destructive-text-color)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                minHeight: '44px'
              }}
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

