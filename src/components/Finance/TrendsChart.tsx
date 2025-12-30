import { Transaction } from '../../utils/storage';
import { Period, getPeriodDates } from './PeriodSelector';

interface TrendsChartProps {
  transactions: Transaction[];
  period: Period;
}

export default function TrendsChart({ transactions, period }: TrendsChartProps) {
  const { start, end } = getPeriodDates(period);
  
  // Фильтруем транзакции по периоду
  const periodTransactions = transactions.filter(t => t.date >= start && t.date <= end);
  
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

