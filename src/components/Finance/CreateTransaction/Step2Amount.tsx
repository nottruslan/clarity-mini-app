import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

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
    const cleaned = value.replace(/[^\d,.]/g, '');
    const normalized = cleaned.replace(',', '.');
    return normalized;
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
        gap: '8px',
        width: '100%'
      }}>
        <input
          type="text"
          className="wizard-input"
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
    </WizardSlide>
  );
}
