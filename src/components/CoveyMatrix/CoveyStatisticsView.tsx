import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { type CoveyMatrixData } from '../../utils/storage';

interface CoveyStatisticsViewProps {
  storage: any;
}

const COLORS = {
  q1: '#FF5757',
  q2: '#4CAF50',
  q3: '#FFC107',
  q4: '#9E9E9E'
};

export default function CoveyStatisticsView({ storage }: CoveyStatisticsViewProps) {
  const data = storage.coveyMatrixData as CoveyMatrixData || { tasks: [], completedTasks: [] };
  
  const stats = useMemo(() => {
    const q1 = data.tasks.filter((t: any) => t.quadrant === 'q1').length;
    const q2 = data.tasks.filter((t: any) => t.quadrant === 'q2').length;
    const q3 = data.tasks.filter((t: any) => t.quadrant === 'q3').length;
    const q4 = data.tasks.filter((t: any) => t.quadrant === 'q4').length;
    const total = data.tasks.length;
    const completed = data.completedTasks.length;

    return { q1, q2, q3, q4, total, completed };
  }, [data]);

  const pieData = [
    { name: 'Важно и срочно', value: stats.q1, quadrant: 'q1' },
    { name: 'Важно, но не срочно', value: stats.q2, quadrant: 'q2' },
    { name: 'Не важно, но срочно', value: stats.q3, quadrant: 'q3' },
    { name: 'Не важно и не срочно', value: stats.q4, quadrant: 'q4' }
  ].filter(item => item.value > 0);

  const barData = [
    { name: 'Q1', value: stats.q1, fill: COLORS.q1 },
    { name: 'Q2', value: stats.q2, fill: COLORS.q2 },
    { name: 'Q3', value: stats.q3, fill: COLORS.q3 },
    { name: 'Q4', value: stats.q4, fill: COLORS.q4 }
  ];

  const insights = useMemo(() => {
    const insights: string[] = [];
    const total = stats.total;

    if (total === 0) {
      return ['Добавьте задачи в матрицу, чтобы увидеть статистику'];
    }

    const q1Percent = (stats.q1 / total) * 100;
    const q2Percent = (stats.q2 / total) * 100;
    const q3Percent = (stats.q3 / total) * 100;
    const q4Percent = (stats.q4 / total) * 100;

    if (q1Percent > 50) {
      insights.push('⚠️ Больше 50% задач в Q1 - это может привести к выгоранию. Постарайтесь делегировать или перенести часть задач.');
    }

    if (q2Percent < 20) {
      insights.push('💡 Меньше 20% задач в Q2. Фокус на важных, но не срочных задачах поможет достигать долгосрочных целей.');
    }

    if (q3Percent > 30) {
      insights.push('📞 Много задач в Q3. Проверьте, какие из них можно делегировать или отклонить.');
    }

    if (q4Percent > 20) {
      insights.push('⏰ Задачи в Q4 отнимают время. Постарайтесь минимизировать или исключить их.');
    }

    if (q2Percent > 40) {
      insights.push('✅ Отличное распределение! Много времени уделяется важным, но не срочным задачам.');
    }

    if (stats.completed > 0) {
      insights.push(`🎉 Выполнено задач: ${stats.completed}. Продолжайте в том же духе!`);
    }

    return insights.length > 0 ? insights : ['Продолжайте использовать матрицу для организации задач'];
  }, [stats]);

  return (
    <div style={{
      flex: 1,
      padding: '16px',
      overflowY: 'auto',
      paddingBottom: '100px'
    }}>
      {/* Счетчики */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: COLORS.q1 }}>
            {stats.q1}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)', marginTop: '4px' }}>
            Q1
          </div>
        </div>
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: COLORS.q2 }}>
            {stats.q2}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)', marginTop: '4px' }}>
            Q2
          </div>
        </div>
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: COLORS.q3 }}>
            {stats.q3}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)', marginTop: '4px' }}>
            Q3
          </div>
        </div>
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: COLORS.q4 }}>
            {stats.q4}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)', marginTop: '4px' }}>
            Q4
          </div>
        </div>
      </div>

      {/* Круговая диаграмма */}
      {pieData.length > 0 && (
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--tg-theme-text-color)'
          }}>
            Распределение задач
          </h3>
          <div style={{ width: '100%', height: '250px', outline: 'none', userSelect: 'none' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.quadrant as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Столбчатая диаграмма */}
      <div style={{
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: 'var(--tg-theme-secondary-bg-color)',
        marginBottom: '24px'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '16px',
          color: 'var(--tg-theme-text-color)'
        }}>
          Количество задач по квадрантам
        </h3>
        <div style={{ width: '100%', height: '200px', outline: 'none', userSelect: 'none' }}>
          <ResponsiveContainer>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Инсайты */}
      <div style={{
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: 'var(--tg-theme-secondary-bg-color)'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '16px',
          color: 'var(--tg-theme-text-color)'
        }}>
          Рекомендации
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {insights.map((insight, index) => (
            <div
              key={index}
              style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'var(--tg-theme-bg-color)',
                fontSize: '14px',
                lineHeight: '1.5',
                color: 'var(--tg-theme-text-color)'
              }}
            >
              {insight}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

