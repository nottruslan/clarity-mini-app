import { Transaction } from '../../utils/storage';
import { Period, getPeriodDates } from './PeriodSelector';

interface TrendsChartProps {
  transactions: Transaction[];
  period: Period;
  startDate?: string;
  endDate?: string;
}

export default function TrendsChart({ transactions, period, startDate, endDate }: TrendsChartProps) {
  const { start, end } = getPeriodDates(period, startDate, endDate);
  
  // Фильтруем транзакции по периоду
  const periodTransactions = transactions.filter(t => t.date >= start && t.date <= end);
  
  // Вычисляем средние значения для прогноза
  const calculateAverage = (type: 'income' | 'expense') => {
    const filtered = periodTransactions.filter(t => t.type === type);
    if (filtered.length === 0) return 0;
    const total = filtered.reduce((sum, t) => sum + t.amount, 0);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return total / days;
  };
  
  const avgIncome = calculateAverage('income');
  const avgExpense = calculateAverage('expense');
  
  // Группируем по датам
  const dailyData: Record<string, { income: number; expense: number }> = {};
  
  periodTransactions.forEach(t => {
    const dateKey = new Date(t.date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
    
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = { income: 0, expense: 0 };
    }
    
    if (t.type === 'income') {
      dailyData[dateKey].income += t.amount;
    } else {
      dailyData[dateKey].expense += t.amount;
    }
  });
  
  // Добавляем прогноз на следующий период (если есть данные)
  const showForecast = periodTransactions.length > 0 && (avgIncome > 0 || avgExpense > 0);

  const dates = Object.keys(dailyData).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  if (dates.length === 0) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: 'var(--tg-theme-hint-color)'
      }}>
        Нет данных для отображения
      </div>
    );
  }

  const maxValue = Math.max(
    ...Object.values(dailyData).flatMap(d => [d.income, d.expense])
  );

  const formatCurrency = (amount: number) => {
    if (amount < 1000) return `${Math.round(amount)}₽`;
    return `${(amount / 1000).toFixed(1)}к₽`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '16px 0'
    }}>
      {dates.map((date) => {
        const data = dailyData[date];
        const incomeHeight = maxValue > 0 ? (data.income / maxValue) * 100 : 0;
        const expenseHeight = maxValue > 0 ? (data.expense / maxValue) * 100 : 0;
        
        return (
          <div key={date} style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px',
            height: '120px'
          }}>
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}>
              <div style={{
                width: '100%',
                height: `${incomeHeight}%`,
                minHeight: incomeHeight > 0 ? '4px' : '0',
                backgroundColor: '#4caf50',
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.3s ease'
              }} />
              <div style={{
                fontSize: '10px',
                color: 'var(--tg-theme-hint-color)',
                marginTop: '4px'
              }}>
                {formatCurrency(data.income)}
              </div>
            </div>
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}>
              <div style={{
                width: '100%',
                height: `${expenseHeight}%`,
                minHeight: expenseHeight > 0 ? '4px' : '0',
                backgroundColor: '#f44336',
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.3s ease'
              }} />
              <div style={{
                fontSize: '10px',
                color: 'var(--tg-theme-hint-color)',
                marginTop: '4px'
              }}>
                {formatCurrency(data.expense)}
              </div>
            </div>
            <div style={{
              width: '60px',
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              {date}
            </div>
          </div>
        );
      })}
      {showForecast && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          border: '1px dashed var(--tg-theme-hint-color)'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            color: 'var(--tg-theme-text-color)'
          }}>
            📊 Прогноз (средние значения)
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--tg-theme-hint-color)' }}>
                Средний доход в день:
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#4caf50' }}>
                {formatCurrency(avgIncome)}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--tg-theme-hint-color)' }}>
                Средний расход в день:
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#f44336' }}>
                {formatCurrency(avgExpense)}
              </span>
            </div>
            <div style={{
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px solid var(--tg-theme-hint-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>
                Прогноз баланса:
              </span>
              <span style={{
                fontSize: '14px',
                fontWeight: '700',
                color: (avgIncome - avgExpense) >= 0 ? '#4caf50' : '#f44336'
              }}>
                {formatCurrency(avgIncome - avgExpense)}/день
              </span>
            </div>
          </div>
        </div>
      )}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '8px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            backgroundColor: '#4caf50'
          }} />
          <span>Доходы</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            backgroundColor: '#f44336'
          }} />
          <span>Расходы</span>
        </div>
      </div>
    </div>
  );
}

