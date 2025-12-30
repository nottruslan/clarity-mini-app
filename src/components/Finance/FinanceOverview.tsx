import { FinanceData, Transaction } from '../../utils/storage';

interface FinanceOverviewProps {
  finance: FinanceData;
}

export default function FinanceOverview({ finance }: FinanceOverviewProps) {
  const transactions = finance.transactions || [];
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;

  // Статистика за текущий месяц
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlyIncome = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'income' && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpense = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div style={{
      background: 'var(--tg-theme-section-bg-color)',
      padding: '16px',
      borderBottom: '1px solid var(--tg-theme-secondary-bg-color)'
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '16px'
      }}>
        Обзор
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          padding: '12px',
          borderRadius: '10px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)'
        }}>
          <div style={{
            fontSize: '12px',
            color: 'var(--tg-theme-hint-color)',
            marginBottom: '4px'
          }}>
            Доходы
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#4caf50'
          }}>
            {formatCurrency(totalIncome)}
          </div>
        </div>

        <div style={{
          padding: '12px',
          borderRadius: '10px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)'
        }}>
          <div style={{
            fontSize: '12px',
            color: 'var(--tg-theme-hint-color)',
            marginBottom: '4px'
          }}>
            Расходы
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#f44336'
          }}>
            {formatCurrency(totalExpense)}
          </div>
        </div>
      </div>

      <div style={{
        padding: '16px',
        borderRadius: '10px',
        backgroundColor: balance >= 0 
          ? 'rgba(76, 175, 80, 0.1)' 
          : 'rgba(244, 67, 54, 0.1)',
        border: `2px solid ${balance >= 0 ? '#4caf50' : '#f44336'}`
      }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--tg-theme-hint-color)',
          marginBottom: '4px'
        }}>
          Баланс
        </div>
        <div style={{
          fontSize: '24px',
          fontWeight: '600',
          color: balance >= 0 ? '#4caf50' : '#f44336'
        }}>
          {formatCurrency(balance)}
        </div>
      </div>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        borderRadius: '10px',
        backgroundColor: 'var(--tg-theme-secondary-bg-color)'
      }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--tg-theme-hint-color)',
          marginBottom: '8px'
        }}>
          Этот месяц
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '14px'
        }}>
          <span style={{ color: '#4caf50' }}>
            +{formatCurrency(monthlyIncome)}
          </span>
          <span style={{ color: '#f44336' }}>
            -{formatCurrency(monthlyExpense)}
          </span>
        </div>
      </div>
    </div>
  );
}

