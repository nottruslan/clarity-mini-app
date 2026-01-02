import { useState, useEffect } from 'react';
import { generateId } from '../../../utils/storage';

interface CreateGoalModalProps {
  onSave: (goal: {
    id: string;
    targetCount: number;
    period: 'year' | 'month';
    year?: number;
    month?: number;
    startDate: number;
    endDate: number;
    completedCount: number;
    createdAt: number;
  }) => void;
  onClose: () => void;
}

export default function CreateGoalModal({ onSave, onClose }: CreateGoalModalProps) {
  const [targetCount, setTargetCount] = useState('');
  const [period, setPeriod] = useState<'year' | 'month'>('year');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const currentDate = new Date();
    setYear(currentDate.getFullYear());
    setMonth(currentDate.getMonth() + 1);
  }, [period]);

  const handleSave = () => {
    const count = parseInt(targetCount);
    if (!count || count <= 0) return;

    let startDate: number;
    let endDate: number;

    if (period === 'year') {
      startDate = new Date(year, 0, 1).getTime();
      endDate = new Date(year, 11, 31, 23, 59, 59, 999).getTime();
    } else {
      startDate = new Date(year, month - 1, 1).getTime();
      endDate = new Date(year, month, 0, 23, 59, 59, 999).getTime();
    }

    const goal = {
      id: generateId(),
      targetCount: count,
      period,
      year: period === 'year' ? year : undefined,
      month: period === 'month' ? month : undefined,
      startDate,
      endDate,
      completedCount: 0,
      createdAt: Date.now()
    };
    onSave(goal);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 10001,
      paddingTop: 'env(safe-area-inset-top)'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--tg-theme-bg-color)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        padding: '8px 0 20px',
        paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--tg-theme-text-color)', margin: 0 }}>
              Новая цель
            </h2>
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--tg-theme-text-color)'
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
              Количество книг
            </label>
            <input
              type="number"
              value={targetCount}
              onChange={(e) => setTargetCount(e.target.value)}
              placeholder="Например: 12"
              min="1"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--tg-theme-secondary-bg-color)',
                borderRadius: '12px',
                backgroundColor: 'var(--tg-theme-bg-color)',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
              Период
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setPeriod('year')}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: `2px solid ${period === 'year' ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
                  borderRadius: '12px',
                  background: period === 'year' ? 'rgba(51, 144, 236, 0.1)' : 'transparent',
                  color: 'var(--tg-theme-text-color)',
                  fontSize: '16px',
                  fontWeight: period === 'year' ? '600' : '400',
                  cursor: 'pointer'
                }}
              >
                Год
              </button>
              <button
                onClick={() => setPeriod('month')}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: `2px solid ${period === 'month' ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
                  borderRadius: '12px',
                  background: period === 'month' ? 'rgba(51, 144, 236, 0.1)' : 'transparent',
                  color: 'var(--tg-theme-text-color)',
                  fontSize: '16px',
                  fontWeight: period === 'month' ? '600' : '400',
                  cursor: 'pointer'
                }}
              >
                Месяц
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
              {period === 'year' ? 'Год' : 'Месяц'}
            </label>
            {period === 'year' ? (
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                min="2000"
                max="2100"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--tg-theme-secondary-bg-color)',
                  borderRadius: '12px',
                  backgroundColor: 'var(--tg-theme-bg-color)',
                  color: 'var(--tg-theme-text-color)',
                  fontSize: '16px'
                }}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <select
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--tg-theme-secondary-bg-color)',
                    borderRadius: '12px',
                    backgroundColor: 'var(--tg-theme-bg-color)',
                    color: 'var(--tg-theme-text-color)',
                    fontSize: '16px'
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                    <option key={m} value={m}>
                      {new Date(2000, m - 1).toLocaleDateString('ru-RU', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  min="2000"
                  max="2100"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--tg-theme-secondary-bg-color)',
                    borderRadius: '12px',
                    backgroundColor: 'var(--tg-theme-bg-color)',
                    color: 'var(--tg-theme-text-color)',
                    fontSize: '16px'
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                background: 'transparent',
                border: '1px solid var(--tg-theme-secondary-bg-color)',
                borderRadius: '12px',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={!targetCount || parseInt(targetCount) <= 0}
              style={{
                flex: 1,
                padding: '14px',
                background: targetCount && parseInt(targetCount) > 0 ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)',
                border: 'none',
                borderRadius: '12px',
                color: targetCount && parseInt(targetCount) > 0 ? 'var(--tg-theme-button-text-color)' : 'var(--tg-theme-hint-color)',
                fontSize: '16px',
                fontWeight: '600',
                cursor: targetCount && parseInt(targetCount) > 0 ? 'pointer' : 'not-allowed'
              }}
            >
              Создать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

