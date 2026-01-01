import { useState, useRef } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step2AmountProps {
  type: 'income' | 'expense';
  onNext: (amount: number) => void;
  onBack: () => void;
  initialValue?: number;
}

export default function Step2Amount({ type, onNext, onBack, initialValue }: Step2AmountProps) {
  const [amount, setAmount] = useState(initialValue ? initialValue.toString() : '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    inputRef.current?.blur();
    const numAmount = parseFloat(amount.replace(/\s/g, '').replace(',', '.'));
    if (!isNaN(numAmount) && numAmount > 0) {
      onNext(numAmount);
    }
  };

  const formatAmount = (value: string) => {
    const cleaned = value.replace(/[^\d,.]/g, '');
    const normalized = cleaned.replace(',', '.');
    return normalized;
  };

  const quickAmounts = [100, 500, 1000, 5000];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    // Не открываем клавиатуру при быстром выборе суммы
    inputRef.current?.blur();
  };

  return (
    <WizardSlide
      icon="💵"
      title="Сумма"
      description={`Введите сумму ${type === 'income' ? 'дохода' : 'расхода'}`}
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
            disabled={!amount || parseFloat(amount.replace(/\s/g, '').replace(',', '.')) <= 0}
          >
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: '24px',
        width: '100%'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '8px',
          width: '100%'
        }}>
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            className="wizard-input"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(formatAmount(e.target.value))}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && amount) {
                handleNext();
              }
            }}
            style={{
              fontSize: '48px',
              textAlign: 'center',
              fontWeight: '600',
              maxWidth: '300px'
            }}
          />
          <div style={{
            fontSize: '18px',
            color: 'var(--tg-theme-hint-color)',
            fontWeight: '500'
          }}>
            ₽
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          width: '100%',
          maxWidth: '400px'
        }}>
          {quickAmounts.map((value) => (
            <button
              key={value}
              onClick={() => handleQuickAmount(value)}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleQuickAmount(value);
              }}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid var(--tg-theme-secondary-bg-color)',
                backgroundColor: amount === value.toString() 
                  ? 'rgba(51, 144, 236, 0.1)' 
                  : 'var(--tg-theme-bg-color)',
                color: 'var(--tg-theme-text-color)',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              {value.toLocaleString('ru-RU')} ₽
            </button>
          ))}
        </div>
      </div>
    </WizardSlide>
  );
}
