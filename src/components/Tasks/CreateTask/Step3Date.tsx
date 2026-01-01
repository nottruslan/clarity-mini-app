import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step3DateProps {
  initialValue?: number;
  onNext: (date?: number) => void;
  onBack: () => void;
}

export default function Step3Date({ initialValue, onNext, onBack }: Step3DateProps) {
  const [date, setDate] = useState<string>(() => {
    if (initialValue) {
      const d = new Date(initialValue);
      return d.toISOString().split('T')[0];
    }
    return '';
  });

  const handleNext = () => {
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      onNext(selectedDate.getTime());
    } else {
      onNext(undefined);
    }
  };

  return (
    <WizardSlide
      icon="📅"
      title="Дата выполнения"
      description="Выберите дату выполнения задачи (необязательно)"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={handleNext}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <input
        type="date"
        className="wizard-input"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{
          fontSize: '18px',
          width: '100%',
          maxWidth: '280px',
          boxSizing: 'border-box'
        }}
      />
      <div style={{
        marginTop: '16px',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: 'var(--tg-theme-secondary-bg-color)',
        fontSize: '14px',
        color: 'var(--tg-theme-hint-color)',
        textAlign: 'center'
      }}>
        Можно пропустить этот шаг, если задача без даты
      </div>
    </WizardSlide>
  );
}

