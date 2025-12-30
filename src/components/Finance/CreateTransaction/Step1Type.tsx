import { useState } from 'react';

interface Step1TypeProps {
  onNext: (type: 'income' | 'expense') => void;
}

export default function Step1Type({ onNext }: Step1TypeProps) {
  const [type, setType] = useState<'income' | 'expense' | null>(null);

  return (
    <div className="form-slide">
      <h2 className="form-title">Новая транзакция</h2>
      <p className="form-subtitle">Выберите тип транзакции</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setType('income')}
          style={{
            padding: '20px',
            borderRadius: '10px',
            border: `2px solid ${type === 'income' ? '#4caf50' : 'var(--tg-theme-secondary-bg-color)'}`,
            backgroundColor: type === 'income' 
              ? 'rgba(76, 175, 80, 0.1)' 
              : 'var(--tg-theme-bg-color)',
            color: type === 'income' 
              ? '#4caf50' 
              : 'var(--tg-theme-text-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            minHeight: '64px'
          }}
        >
          <span style={{ fontSize: '32px' }}>💰</span>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: '600' }}>Доход</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Получение денег</div>
          </div>
        </button>

        <button
          onClick={() => setType('expense')}
          style={{
            padding: '20px',
            borderRadius: '10px',
            border: `2px solid ${type === 'expense' ? '#f44336' : 'var(--tg-theme-secondary-bg-color)'}`,
            backgroundColor: type === 'expense' 
              ? 'rgba(244, 67, 54, 0.1)' 
              : 'var(--tg-theme-bg-color)',
            color: type === 'expense' 
              ? '#f44336' 
              : 'var(--tg-theme-text-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            minHeight: '64px'
          }}
        >
          <span style={{ fontSize: '32px' }}>💸</span>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: '600' }}>Расход</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Трата денег</div>
          </div>
        </button>
      </div>

      <div className="form-actions">
        <button 
          className="tg-button" 
          onClick={() => type && onNext(type)}
          disabled={!type}
        >
          Далее
        </button>
      </div>
    </div>
  );
}

