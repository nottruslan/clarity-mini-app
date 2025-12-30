import { useState } from 'react';

interface Step3FrequencyProps {
  name: string;
  icon: string;
  onComplete: (frequency: 'daily' | 'weekly') => void;
  onBack: () => void;
}

export default function Step3Frequency({ name, icon, onComplete, onBack }: Step3FrequencyProps) {
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');

  return (
    <div className="form-slide">
      <h2 className="form-title">Частота</h2>
      <p className="form-subtitle">Как часто вы хотите отслеживать "{name}"?</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setFrequency('daily')}
          style={{
            padding: '16px',
            borderRadius: '10px',
            border: `2px solid ${frequency === 'daily' ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
            backgroundColor: frequency === 'daily' 
              ? 'var(--tg-theme-button-color)' 
              : 'var(--tg-theme-bg-color)',
            color: frequency === 'daily' 
              ? 'var(--tg-theme-button-text-color)' 
              : 'var(--tg-theme-text-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            minHeight: '56px'
          }}
        >
          <span style={{ fontSize: '24px' }}>📅</span>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: '500' }}>Ежедневно</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Каждый день</div>
          </div>
        </button>

        <button
          onClick={() => setFrequency('weekly')}
          style={{
            padding: '16px',
            borderRadius: '10px',
            border: `2px solid ${frequency === 'weekly' ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
            backgroundColor: frequency === 'weekly' 
              ? 'var(--tg-theme-button-color)' 
              : 'var(--tg-theme-bg-color)',
            color: frequency === 'weekly' 
              ? 'var(--tg-theme-button-text-color)' 
              : 'var(--tg-theme-text-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            minHeight: '56px'
          }}
        >
          <span style={{ fontSize: '24px' }}>📆</span>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: '500' }}>Еженедельно</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Раз в неделю</div>
          </div>
        </button>
      </div>

      <div className="form-actions">
        <button 
          className="tg-button" 
          onClick={onBack}
          style={{ 
            backgroundColor: 'var(--tg-theme-secondary-bg-color)',
            color: 'var(--tg-theme-text-color)'
          }}
        >
          Назад
        </button>
        <button 
          className="tg-button" 
          onClick={() => onComplete(frequency)}
        >
          Создать
        </button>
      </div>
    </div>
  );
}

