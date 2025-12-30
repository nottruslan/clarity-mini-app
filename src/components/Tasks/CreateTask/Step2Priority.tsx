import { useState } from 'react';

interface Step2PriorityProps {
  onNext: (priority: 'low' | 'medium' | 'high') => void;
  onBack: () => void;
}

export default function Step2Priority({ onNext, onBack }: Step2PriorityProps) {
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const priorities = [
    { id: 'low' as const, label: 'Низкий', emoji: '🟢' },
    { id: 'medium' as const, label: 'Средний', emoji: '🟡' },
    { id: 'high' as const, label: 'Высокий', emoji: '🔴' }
  ];

  return (
    <div className="form-slide">
      <h2 className="form-title">Приоритет</h2>
      <p className="form-subtitle">Выберите приоритет задачи</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {priorities.map((p) => (
          <button
            key={p.id}
            onClick={() => setPriority(p.id)}
            style={{
              padding: '16px',
              borderRadius: '10px',
              border: `2px solid ${priority === p.id ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
              backgroundColor: priority === p.id 
                ? 'var(--tg-theme-button-color)' 
                : 'var(--tg-theme-bg-color)',
              color: priority === p.id 
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
            <span style={{ fontSize: '24px' }}>{p.emoji}</span>
            <span>{p.label}</span>
          </button>
        ))}
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
          onClick={() => onNext(priority)}
        >
          Далее
        </button>
      </div>
    </div>
  );
}

