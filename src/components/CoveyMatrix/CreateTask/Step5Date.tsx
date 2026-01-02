import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step5DateProps {
  onNext: (date?: number) => void;
  onBack: () => void;
  onSkip: () => void;
  initialValue?: number;
}

export default function Step5Date({ onNext, onBack, onSkip, initialValue }: Step5DateProps) {
  const [date, setDate] = useState(() => {
    if (initialValue) {
      const d = new Date(initialValue);
      return d.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleNext = () => {
    if (date) {
      const timestamp = new Date(date).getTime();
      onNext(timestamp);
    } else {
      onNext();
    }
  };

  return (
    <WizardSlide
      icon="📅"
      title="Дата"
      description="Укажите дату выполнения (необязательно)"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%', flexDirection: 'column' }}>
          <GradientButton
            onClick={handleNext}
          >
            Продолжить
          </GradientButton>
          <GradientButton
            variant="secondary"
            onClick={onBack}
          >
            Назад
          </GradientButton>
          <button
            onClick={onSkip}
            style={{
              width: '100%',
              padding: '14px',
              border: 'none',
              background: 'transparent',
              color: 'var(--tg-theme-hint-color)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Пропустить
          </button>
        </div>
      }
    >
      <input
        type="date"
        value={date}
        onChange={handleDateChange}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '16px',
          border: '1px solid var(--tg-theme-secondary-bg-color)',
          borderRadius: '12px',
          backgroundColor: 'var(--tg-theme-bg-color)',
          color: 'var(--tg-theme-text-color)'
        }}
      />
    </WizardSlide>
  );
}

