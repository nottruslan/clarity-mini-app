import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

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
    <WizardSlide
      icon="📅"
      title="Дата"
      description="Выберите дату транзакции"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton
            variant="secondary"
            onClick={onBack}
          >
            Назад
          </GradientButton>
          <GradientButton
            onClick={handleNext}
          >
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px', 
        width: '100%',
        overflowX: 'hidden',
        touchAction: 'pan-y'
      }}>
        <input
          type="date"
          className="wizard-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ 
            fontSize: '18px',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        />

        <div style={{
          padding: '20px',
          borderRadius: '16px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          marginTop: '8px'
        }}>
          <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '12px' }}>
            Сводка
          </div>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            {category}
          </div>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '700',
            color: type === 'income' ? '#4caf50' : '#f44336'
          }}>
            {type === 'income' ? '+' : '-'}{formatCurrency(amount)}
          </div>
        </div>
      </div>
    </WizardSlide>
  );
}
