import { useState } from 'react';

interface Step3DateProps {
  name: string;
  priority: 'low' | 'medium' | 'high';
  onComplete: (dueDate?: number) => void;
  onBack: () => void;
}

export default function Step3Date({ name, priority, onComplete, onBack }: Step3DateProps) {
  const [hasDueDate, setHasDueDate] = useState(false);
  const [dueDate, setDueDate] = useState('');

  const handleComplete = () => {
    if (hasDueDate && dueDate) {
      const date = new Date(dueDate);
      onComplete(date.getTime());
    } else {
      onComplete();
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="form-slide">
      <h2 className="form-title">Срок выполнения</h2>
      <p className="form-subtitle">Установите срок выполнения (необязательно)</p>
      
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setHasDueDate(!hasDueDate)}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '10px',
            border: `2px solid ${hasDueDate ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
            backgroundColor: hasDueDate 
              ? 'var(--tg-theme-button-color)' 
              : 'var(--tg-theme-bg-color)',
            color: hasDueDate 
              ? 'var(--tg-theme-button-text-color)' 
              : 'var(--tg-theme-text-color)',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '16px',
            minHeight: '56px'
          }}
        >
          {hasDueDate ? '✓ Установить срок' : 'Установить срок'}
        </button>

        {hasDueDate && (
          <input
            type="date"
            className="form-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={today}
          />
        )}
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
          onClick={handleComplete}
        >
          Создать
        </button>
      </div>
    </div>
  );
}

