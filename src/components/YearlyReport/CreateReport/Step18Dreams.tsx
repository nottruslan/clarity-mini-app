import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step18DreamsProps {
  onNext: (dreams: string) => void;
  onBack: () => void;
  initialData?: string;
}

export default function Step18Dreams({ onNext, onBack, initialData }: Step18DreamsProps) {
  const [dreams, setDreams] = useState(initialData || '');

  return (
    <WizardSlide
      icon="🌟"
      title="Мечты"
      description="Как вы видите предстоящий год?"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(dreams)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%' }}>
        <textarea
          className="wizard-input"
          placeholder="Опишите ваши мечты и планы..."
          value={dreams}
          onChange={(e) => setDreams(e.target.value)}
          rows={8}
          style={{ marginTop: 0, resize: 'vertical', minHeight: '150px' }}
        />
      </div>
    </WizardSlide>
  );
}

