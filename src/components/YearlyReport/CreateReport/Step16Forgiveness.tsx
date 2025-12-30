import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step16ForgivenessProps {
  onNext: (forgiveness: string) => void;
  onBack: () => void;
  initialData?: string;
}

export default function Step16Forgiveness({ onNext, onBack, initialData }: Step16ForgivenessProps) {
  const [forgiveness, setForgiveness] = useState(initialData || '');

  return (
    <WizardSlide
      icon="🙏"
      title="Прощение"
      description="Что нужно простить и отпустить?"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(forgiveness)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%' }}>
        <textarea
          className="wizard-input"
          placeholder="Опишите, что нужно простить..."
          value={forgiveness}
          onChange={(e) => setForgiveness(e.target.value)}
          rows={8}
          style={{ marginTop: 0, resize: 'vertical', minHeight: '150px' }}
        />
      </div>
    </WizardSlide>
  );
}

