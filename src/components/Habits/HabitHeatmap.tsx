import { Habit } from '../../utils/storage';
import { generateHeatmapData } from '../../utils/habitVisualization';

interface HabitHeatmapProps {
  habit: Habit;
  days?: number;
}

export default function HabitHeatmap({ habit, days = 365 }: HabitHeatmapProps) {
  const heatmapData = generateHeatmapData(habit, days);
  
  // Группируем данные по неделям для отображения
  const weeks: Array<Array<typeof heatmapData[0]>> = [];
  let currentWeek: typeof heatmapData = [];
  
  heatmapData.forEach((day, index) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    
    currentWeek.push(day);
    
    if (index === heatmapData.length - 1 && currentWeek.length > 0) {
      weeks.push([...currentWeek]);
    }
  });

  const getIntensityColor = (intensity: number): string => {
    if (intensity === 0) return 'var(--tg-theme-secondary-bg-color)';
    const opacity = 0.2 + (intensity * 0.2);
    return `rgba(51, 144, 236, ${opacity})`;
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <h4 style={{ 
        fontSize: '14px', 
        fontWeight: '600', 
        marginBottom: '12px',
        color: 'var(--tg-theme-text-color)'
      }}>
        Прогресс за год
      </h4>
      <div style={{
        display: 'flex',
        gap: '4px',
        overflowX: 'auto',
        paddingBottom: '8px',
        WebkitOverflowScrolling: 'touch'
      }}>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {week.map((day, dayIndex) => {
              const date = new Date(day.date);
              const isToday = date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
              
              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  title={`${day.date}: ${day.intensity > 0 ? 'Выполнено' : 'Не выполнено'}`}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    background: getIntensityColor(day.intensity),
                    border: isToday ? '2px solid var(--tg-theme-button-color)' : 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.1s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '8px',
        fontSize: '11px',
        color: 'var(--tg-theme-hint-color)'
      }}>
        <span>Меньше</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 1, 2, 3, 4].map(intensity => (
            <div
              key={intensity}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                background: getIntensityColor(intensity)
              }}
            />
          ))}
        </div>
        <span>Больше</span>
      </div>
    </div>
  );
}

