import { Transaction, Category } from '../../utils/storage';

interface PieChartProps {
  transactions: Transaction[];
  categories: Category[];
  type: 'income' | 'expense';
}

export default function PieChart({ transactions, categories, type }: PieChartProps) {
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

  // Сортируем и берем топ категории
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a);

  // Берем топ 6, остальные объединяем в "Прочее"
  const topCategories = sortedCategories.slice(0, 6);
  const otherTotal = sortedCategories.slice(6).reduce((sum, [, amount]) => sum + amount, 0);
  
  const chartData = otherTotal > 0 
    ? [...topCategories, ['Прочее', otherTotal] as [string, number]]
    : topCategories;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryColor = (categoryName: string, index: number): string => {
    const category = categories.find(c => c.name === categoryName);
    if (category?.color) return category.color;
    
    // Дефолтные цвета для круговой диаграммы
    const colors = [
      '#3390ec', '#4caf50', '#ff9800', '#9c27b0', 
      '#f44336', '#00bcd4', '#795548', '#607d8b'
    ];
    return colors[index % colors.length];
  };

  // Создаем SVG path для каждого сегмента
  const radius = 100;
  const centerX = 120;
  const centerY = 120;

  const createPaths = () => {
    let currentAngle = -90; // Начинаем сверху
    const paths: Array<{ path: string; percentage: number }> = [];
    
    chartData.forEach(([, amount]) => {
      const percentage = (amount / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      paths.push({ path, percentage });
      
      currentAngle = endAngle;
    });
    
    return paths;
  };

  const paths = createPaths();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      alignItems: 'center'
    }}>
      {/* Круговая диаграмма */}
      <div style={{
        position: 'relative',
        width: '240px',
        height: '240px'
      }}>
        <svg width="240" height="240" viewBox="0 0 240 240">
          {chartData.map(([categoryName], index) => {
            const pathData = paths[index];
            const color = getCategoryColor(categoryName, index);
            
            return (
              <path
                key={categoryName}
                d={pathData.path}
                fill={color}
                stroke="var(--tg-theme-bg-color)"
                strokeWidth="2"
                style={{
                  transition: 'opacity 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              />
            );
          })}
        </svg>
        
        {/* Центральный текст с общей суммой */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: type === 'income' ? '#4caf50' : '#f44336'
          }}>
            {formatCurrency(total)}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--tg-theme-hint-color)',
            marginTop: '4px'
          }}>
            Всего
          </div>
        </div>
      </div>

      {/* Легенда */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        maxWidth: '400px'
      }}>
        {chartData.map(([categoryName, amount], index) => {
          const percentage = (amount / total) * 100;
          const color = getCategoryColor(categoryName, index);
          
          const getCategoryIcon = (name: string) => {
            const iconMap: Record<string, string> = {
              'Зарплата': '💰', 'Подарки': '🎁', 'Инвестиции': '💹', 'Фриланс': '💼',
              'Еда': '🍔', 'Транспорт': '🚗', 'Развлечения': '🎬', 'Здоровье': '🏥',
              'Покупки': '🛍️', 'Жилье': '🏠', 'Образование': '📚', 'Прочее': '📦'
            };
            return iconMap[name] || '📊';
          };

          return (
            <div
              key={categoryName}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                transition: 'transform 0.2s'
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: color,
                flexShrink: 0
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: 1,
                minWidth: 0
              }}>
                <span style={{ fontSize: '18px' }}>
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
                marginLeft: '8px',
                whiteSpace: 'nowrap'
              }}>
                {formatCurrency(amount)}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color)',
                minWidth: '45px',
                textAlign: 'right'
              }}>
                {percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

