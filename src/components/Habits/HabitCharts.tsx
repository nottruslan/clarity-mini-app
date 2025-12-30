import { useState } from 'react';
import { Habit } from '../../utils/storage';
import { generateChartData, generateWeekData, generateMonthData } from '../../utils/habitVisualization';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface HabitChartsProps {
  habit: Habit;
}

export default function HabitCharts({ habit }: HabitChartsProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const getChartData = () => {
    const today = new Date();
    const startDate = new Date();
    
    if (period === 'week') {
      startDate.setDate(today.getDate() - 7);
      return generateChartData(habit, startDate, today);
    } else if (period === 'month') {
      startDate.setMonth(today.getMonth() - 1);
      return generateChartData(habit, startDate, today);
    } else {
      startDate.setFullYear(today.getFullYear() - 1);
      return generateChartData(habit, startDate, today);
    }
  };

  const getBarData = () => {
    if (period === 'week') {
      return generateWeekData(habit, 4);
    } else if (period === 'month') {
      return generateWeekData(habit, 12);
    } else {
      return generateMonthData(habit, 12);
    }
  };

  const chartData = getChartData();
  const barData = getBarData();

  // Форматируем даты для отображения
  const formattedChartData = chartData.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('ru-RU', { 
      month: 'short', 
      day: 'numeric' 
    })
  }));

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px'
      }}>
        {(['week', 'month', 'year'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: `2px solid ${period === p ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
              background: period === p 
                ? 'rgba(51, 144, 236, 0.1)' 
                : 'var(--tg-theme-section-bg-color)',
              fontSize: '14px',
              fontWeight: period === p ? '600' : '400',
              cursor: 'pointer',
              color: 'var(--tg-theme-text-color)'
            }}
          >
            {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          marginBottom: '12px',
          color: 'var(--tg-theme-text-color)'
        }}>
          График выполнения
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={formattedChartData.slice(-30)}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--tg-theme-secondary-bg-color)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--tg-theme-hint-color)"
              tick={{ fill: 'var(--tg-theme-hint-color)', fontSize: 10 }}
            />
            <YAxis 
              stroke="var(--tg-theme-hint-color)"
              tick={{ fill: 'var(--tg-theme-hint-color)', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{
                background: 'var(--tg-theme-bg-color)',
                border: '1px solid var(--tg-theme-secondary-bg-color)',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="var(--tg-theme-button-color)" 
              strokeWidth={2}
              dot={{ fill: 'var(--tg-theme-button-color)', r: 3 }}
            />
            {habit.targetValue && (
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="var(--tg-theme-hint-color)" 
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          marginBottom: '12px',
          color: 'var(--tg-theme-text-color)'
        }}>
          Процент выполнения
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--tg-theme-secondary-bg-color)" />
            <XAxis 
              dataKey="week" 
              stroke="var(--tg-theme-hint-color)"
              tick={{ fill: 'var(--tg-theme-hint-color)', fontSize: 10 }}
            />
            <YAxis 
              stroke="var(--tg-theme-hint-color)"
              tick={{ fill: 'var(--tg-theme-hint-color)', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{
                background: 'var(--tg-theme-bg-color)',
                border: '1px solid var(--tg-theme-secondary-bg-color)',
                borderRadius: '8px'
              }}
              formatter={(value: any) => {
                if (typeof value === 'number') {
                  return [`${value}%`, 'Выполнение'];
                }
                return [value, 'Выполнение'];
              }}
            />
            <Bar 
              dataKey="percentage" 
              fill="var(--tg-theme-button-color)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

