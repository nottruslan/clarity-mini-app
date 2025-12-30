import { Budget, Transaction } from '../../utils/storage';

interface BudgetOverviewProps {
  budgets: Budget[];
  transactions: Transaction[];
}

export default function BudgetOverview({ budgets, transactions }: BudgetOverviewProps) {
  if (budgets.length === 0) return null;

  const getBudgetSpent = (budget: Budget): number => {
    const now = new Date();
    const start = new Date();
    const end = new Date();

    if (budget.period === 'month') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
    } else {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
    }

    return transactions
      .filter(t => 
        t.category === budget.categoryName &&
        t.type === 'expense' &&
        t.date >= start.getTime() &&
        t.date <= end.getTime()
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const overBudget = budgets.filter(b => {
    const spent = getBudgetSpent(b);
    return spent > b.limit;
  });

  return (
    <div style={{
      padding: '16px',
      borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
      backgroundColor: 'var(--tg-theme-section-bg-color)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Бюджет
        </h3>
        {overBudget.length > 0 && (
          <div style={{
            fontSize: '12px',
            color: '#f44336',
            fontWeight: '600',
            padding: '4px 8px',
            borderRadius: '8px',
            backgroundColor: 'rgba(244, 67, 54, 0.1)'
          }}>
            ⚠️ {overBudget.length} превышен{overBudget.length > 1 ? 'о' : ''}
          </div>
        )}
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {budgets.slice(0, 3).map((budget) => {
          const spent = getBudgetSpent(budget);
          const percentage = Math.min((spent / budget.limit) * 100, 100);
          const isOver = spent > budget.limit;

          return (
            <div key={budget.categoryId} style={{
              padding: '12px',
              borderRadius: '10px',
              backgroundColor: 'var(--tg-theme-secondary-bg-color)',
              border: isOver ? '2px solid #f44336' : '2px solid transparent'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                <span style={{ fontWeight: '600' }}>{budget.categoryName}</span>
                <span style={{
                  color: isOver ? '#f44336' : 'var(--tg-theme-hint-color)',
                  fontWeight: '600'
                }}>
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                backgroundColor: 'var(--tg-theme-bg-color)',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '4px'
              }}>
                <div style={{
                  width: `${percentage}%`,
                  height: '100%',
                  backgroundColor: isOver ? '#f44336' : '#4caf50',
                  borderRadius: '3px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color)'
              }}>
                {formatCurrency(spent)} / {formatCurrency(budget.limit)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

