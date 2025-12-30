import { Goal } from '../../utils/storage';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onAddProgress: (id: string, amount: number) => void;
}

export default function GoalCard({ goal, onEdit, onDelete, onAddProgress }: GoalCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

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
      year: 'numeric'
    });
  };

  return (
    <div style={{
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: 'var(--tg-theme-section-bg-color)',
      border: '1px solid var(--tg-theme-secondary-bg-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            {goal.icon && <span style={{ fontSize: '24px' }}>{goal.icon}</span>}
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: 0
            }}>
              {goal.name}
            </h3>
          </div>
          {goal.description && (
            <p style={{
              fontSize: '14px',
              color: 'var(--tg-theme-hint-color)',
              margin: 0,
              marginBottom: '8px'
            }}>
              {goal.description}
            </p>
          )}
          {goal.deadline && (
            <div style={{
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)'
            }}>
              До: {formatDate(goal.deadline)}
            </div>
          )}
        </div>
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => onEdit(goal)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--tg-theme-button-color)',
              backgroundColor: 'transparent',
              color: 'var(--tg-theme-button-color)',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ✏️
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Удалить цель "${goal.name}"?`)) {
                onDelete(goal.id);
              }
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#f44336',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      </div>

      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
          </span>
          <span style={{
            fontSize: '14px',
            color: 'var(--tg-theme-hint-color)'
          }}>
            {progress.toFixed(1)}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '12px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Math.min(progress, 100)}%`,
            height: '100%',
            backgroundColor: progress >= 100 ? '#4caf50' : '#3390ec',
            borderRadius: '6px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {remaining > 0 && (
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => {
              const amount = parseFloat(prompt(`Сколько добавить к цели "${goal.name}"?`, '0') || '0');
              if (amount > 0) {
                onAddProgress(goal.id, amount);
              }
            }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--tg-theme-button-color)',
              color: 'var(--tg-theme-button-text-color)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Добавить
          </button>
        </div>
      )}

      {progress >= 100 && (
        <div style={{
          padding: '8px',
          borderRadius: '8px',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          color: '#4caf50',
          fontSize: '14px',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          🎉 Цель достигнута!
        </div>
      )}
    </div>
  );
}

