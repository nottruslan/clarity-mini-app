import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step10BetterTomorrowProps {
  onNext: (value: string) => void;
  onBack: () => void;
  initialData?: string;
}

export default function Step10BetterTomorrow({ onNext, onBack, initialData }: Step10BetterTomorrowProps) {
  const [value, setValue] = useState(initialData || '');

  return (
    <WizardSlide
      icon="🌍"
      title="Лучшее завтра"
      description="Что вы сделали, чтобы сделать мир лучше?"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(value)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%' }}>
        <textarea
          className="wizard-input"
          placeholder="Опишите значимые события..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={6}
          style={{ marginTop: 0, resize: 'vertical', minHeight: '120px' }}
        />
      </div>
    </WizardSlide>
  );
}

