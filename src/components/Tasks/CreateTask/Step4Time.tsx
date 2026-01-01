import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step4TimeProps {
  date?: number;
  initialValue?: string;
  onNext: (time?: string) => void;
  onBack: () => void;
}

export default function Step4Time({ date, initialValue = '', onNext, onBack }: Step4TimeProps) {
  const [time, setTime] = useState(initialValue);

  const handleNext = () => {
    onNext(time.trim() || undefined);
  };

  return (
    <WizardSlide
      icon="🕐"
      title="Время выполнения"
      description="Выберите время выполнения задачи (необязательно)"
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
        type="time"
        className="wizard-input"
        value={time}
        onChange={(e) => setTime(e.target.value)}
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
        Можно пропустить этот шаг, если время не важно
      </div>
    </WizardSlide>
  );
}

