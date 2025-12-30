import { Transaction, Category } from '../../utils/storage';

interface CategoryChartProps {
  transactions: Transaction[];
  categories: Category[];
  type: 'income' | 'expense';
}

export default function CategoryChart({ transactions, categories, type }: CategoryChartProps) {
  const filteredTransactions = transactions.filter(t => t.type === type);
  
  // Группируем по категориям
  const categoryTotals = filteredTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  if (total === 0) {
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

  // Сортируем по сумме
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8); // Топ 8

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, string> = {
      'Зарплата': '💰',
      'Подарки': '🎁',
      'Инвестиции': '💹',
      'Фриланс': '💼',
      'Еда': '🍔',
      'Транспорт': '🚗',
      'Развлечения': '🎬',
      'Здоровье': '🏥',
      'Покупки': '🛍️',
      'Жилье': '🏠',
      'Образование': '📚',
      'Прочее': '📦'
    };
    return iconMap[categoryName] || '📊';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {sortedCategories.map(([categoryName, amount], index) => {
        const percentage = (amount / total) * 100;
        const category = categories.find(c => c.name === categoryName);
        
        return (
          <div key={categoryName} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: 1,
                minWidth: 0
              }}>
                <span style={{ fontSize: '20px' }}>
                  {getCategoryIcon(categoryName)}
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {categoryName}
                </span>
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: type === 'income' ? '#4caf50' : '#f44336',
                marginLeft: '8px'
              }}>
                {formatCurrency(amount)}
              </div>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--tg-theme-secondary-bg-color)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${percentage}%`,
                height: '100%',
                backgroundColor: category?.color || (type === 'income' ? '#4caf50' : '#f44336'),
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)'
            }}>
              {percentage.toFixed(1)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

