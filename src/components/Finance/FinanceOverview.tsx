import { useState } from 'react';
import { FinanceData } from '../../utils/storage';
import PeriodSelector, { type Period, filterTransactionsByPeriod } from './PeriodSelector';

interface FinanceOverviewProps {
  finance: FinanceData;
}

export default function FinanceOverview({ finance }: FinanceOverviewProps) {
  const [period, setPeriod] = useState<Period>('month');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  // Убеждаемся, что transactions всегда является массивом
  const allTransactions = Array.isArray(finance.transactions) ? finance.transactions : [];
  const transactions = filterTransactionsByPeriod(
    allTransactions, 
    period, 
    startDate || undefined, 
    endDate || undefined
  );
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;

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
      padding: '20px 16px',
      borderBottom: '1px solid var(--tg-theme-secondary-bg-color)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: 'var(--tg-theme-text-color)',
          margin: 0
        }}>
          Обзор
        </h2>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <PeriodSelector 
          value={period} 
          onChange={(p) => {
            setPeriod(p);
            if (p !== 'date') {
              setStartDate('');
              setEndDate('');
            }
          }}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)'
        }}>
          <div style={{
            fontSize: '12px',
            color: 'var(--tg-theme-hint-color)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Доходы
          </div>
          <div style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#4caf50'
          }}>
            {formatCurrency(totalIncome)}
          </div>
        </div>

        <div style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)'
        }}>
          <div style={{
            fontSize: '12px',
            color: 'var(--tg-theme-hint-color)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Расходы
          </div>
          <div style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#f44336'
          }}>
            {formatCurrency(totalExpense)}
          </div>
        </div>
      </div>

      <div style={{
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: balance >= 0 
          ? 'rgba(76, 175, 80, 0.1)' 
          : 'rgba(244, 67, 54, 0.1)',
        border: `2px solid ${balance >= 0 ? '#4caf50' : '#f44336'}`
      }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--tg-theme-hint-color)',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Баланс
        </div>
        <div style={{
          fontSize: '28px',
          fontWeight: '600',
          color: balance >= 0 ? '#4caf50' : '#f44336'
        }}>
          {formatCurrency(balance)}
        </div>
      </div>

    </div>
  );
}

