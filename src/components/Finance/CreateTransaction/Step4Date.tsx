import { useState } from 'react';

interface Step4DateProps {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  onNext: (date: number) => void;
  onBack: () => void;
}

export default function Step4Date({ type, amount, category, onNext, onBack }: Step4DateProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleNext = () => {
    const selectedDate = new Date(date);
    onNext(selectedDate.getTime());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="form-slide">
      <h2 className="form-title">Дата</h2>
      <p className="form-subtitle">Выберите дату транзакции</p>
      
      <div style={{ marginBottom: '24px' }}>
        <input
          type="date"
          className="form-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ fontSize: '18px' }}
        />
      </div>

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
          color: type === 'income' ? '#4caf50' : '#f44336'
        }}>
          {type === 'income' ? '+' : '-'}{formatCurrency(amount)}
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
          onClick={handleNext}
        >
          Далее
        </button>
      </div>
    </div>
  );
}

