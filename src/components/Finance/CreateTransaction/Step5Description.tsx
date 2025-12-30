import { useState } from 'react';

interface Step5DescriptionProps {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: number;
  onComplete: (description?: string) => void;
  onBack: () => void;
}

export default function Step5Description({ 
  type, 
  amount, 
  category, 
  date, 
  onComplete, 
  onBack 
}: Step5DescriptionProps) {
  const [description, setDescription] = useState('');

  const handleComplete = () => {
    onComplete(description.trim() || undefined);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="form-slide">
      <h2 className="form-title">Описание</h2>
      <p className="form-subtitle">Добавьте описание (необязательно)</p>
      
      <textarea
        className="form-input"
        placeholder="Например: Зарплата за март"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={{
          resize: 'none',
          fontFamily: 'inherit'
        }}
      />

      <div style={{
        padding: '16px',
        borderRadius: '10px',
        backgroundColor: 'var(--tg-theme-secondary-bg-color)',
        marginBottom: '24px'
      }}>
        <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
          Сводка
        </div>
        <div style={{ fontSize: '16px', marginBottom: '4px' }}>
          <strong>{category}</strong>
        </div>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '600',
          color: type === 'income' ? '#4caf50' : '#f44336',
          marginBottom: '4px'
        }}>
          {type === 'income' ? '+' : '-'}{formatCurrency(amount)}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)' }}>
          {formatDate(date)}
        </div>
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

