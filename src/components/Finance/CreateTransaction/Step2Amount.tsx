import { useState } from 'react';

interface Step2AmountProps {
  type: 'income' | 'expense';
  onNext: (amount: number) => void;
  onBack: () => void;
}

export default function Step2Amount({ type, onNext, onBack }: Step2AmountProps) {
  const [amount, setAmount] = useState('');

  const handleNext = () => {
    const numAmount = parseFloat(amount.replace(/\s/g, '').replace(',', '.'));
    if (!isNaN(numAmount) && numAmount > 0) {
      onNext(numAmount);
    }
  };

  const formatAmount = (value: string) => {
    // Удаляем все кроме цифр и запятой/точки
    const cleaned = value.replace(/[^\d,.]/g, '');
    // Заменяем запятую на точку
    const normalized = cleaned.replace(',', '.');
    return normalized;
  };

  return (
    <div className="form-slide">
      <h2 className="form-title">Сумма</h2>
      <p className="form-subtitle">Введите сумму {type === 'income' ? 'дохода' : 'расхода'}</p>
      
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(formatAmount(e.target.value))}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && amount) {
              handleNext();
            }
          }}
          autoFocus
          style={{
            fontSize: '32px',
            textAlign: 'center',
            fontWeight: '600'
          }}
        />
        <div style={{
          textAlign: 'center',
          marginTop: '8px',
          fontSize: '14px',
          color: 'var(--tg-theme-hint-color)'
        }}>
          ₽
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
          disabled={!amount || parseFloat(amount.replace(/\s/g, '').replace(',', '.')) <= 0}
        >
          Далее
        </button>
      </div>
    </div>
  );
}

