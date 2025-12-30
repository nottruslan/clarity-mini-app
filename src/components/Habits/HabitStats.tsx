import { Habit } from '../../utils/storage';
import { calculateGoalProgress } from '../../utils/habitCalculations';
import { getPeriodStats } from '../../utils/habitVisualization';

interface HabitStatsProps {
  habit: Habit;
}

export default function HabitStats({ habit }: HabitStatsProps) {
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 7);
  
  const monthAgo = new Date();
  monthAgo.setMonth(today.getMonth() - 1);

  const weekStats = getPeriodStats(habit, weekAgo, today);
  const monthStats = getPeriodStats(habit, monthAgo, today);
  
  const goalProgress = calculateGoalProgress(habit);

  return (
    <div style={{ marginTop: '16px' }}>
      <h4 style={{ 
        fontSize: '14px', 
        fontWeight: '600', 
        marginBottom: '12px',
        color: 'var(--tg-theme-text-color)'
      }}>
        Статистика
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Цель по дням */}
        {habit.goalDays && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)'
            }}>
              <span>Прогресс к цели</span>
              <span style={{ fontWeight: '600', color: 'var(--tg-theme-text-color)' }}>
                {goalProgress.current}/{goalProgress.target} дней
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'var(--tg-theme-secondary-bg-color)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${goalProgress.percentage}%`,
                height: '100%',
                background: goalProgress.percentage === 100
                  ? 'linear-gradient(90deg, #4caf50 0%, #45a049 100%)'
                  : 'linear-gradient(90deg, #ff9800 0%, #f57c00 100%)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {/* Детальная статистика */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          padding: '12px',
          background: 'var(--tg-theme-secondary-bg-color)',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--tg-theme-text-color)' }}>
              {weekStats.completedDays}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--tg-theme-hint-color)', marginTop: '4px' }}>
              За неделю
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--tg-theme-text-color)' }}>
              {monthStats.completedDays}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--tg-theme-hint-color)', marginTop: '4px' }}>
              За месяц
            </div>
          </div>
        </div>

        {/* Среднее значение */}
        {habit.unit && monthStats.averageValue > 0 && (
          <div style={{
            padding: '12px',
            background: 'var(--tg-theme-secondary-bg-color)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)', marginBottom: '4px' }}>
              Среднее значение за месяц
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--tg-theme-text-color)' }}>
              {Math.round(monthStats.averageValue * 10) / 10} {habit.unit}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

