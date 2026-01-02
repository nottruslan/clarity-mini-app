import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step2DescriptionProps {
  onNext: (description: string) => void;
  onBack: () => void;
  initialValue?: string;
}

export default function Step2Description({ onNext, onBack, initialValue = '' }: Step2DescriptionProps) {
  const [description, setDescription] = useState(initialValue);

  return (
    <WizardSlide
      icon="📄"
      title="Описание"
      description="Добавьте описание (необязательно)"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <div style={{ flex: 1 }}>
            <GradientButton
              variant="secondary"
              onClick={onBack}
            >
              Назад
            </GradientButton>
          </div>
          <div style={{ flex: 1 }}>
            <GradientButton
              onClick={() => onNext(description)}
            >
              Продолжить
            </GradientButton>
          </div>
        </div>
      }
    >
      <textarea
        className="wizard-input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Добавьте дополнительные детали..."
        rows={6}
        style={{
          width: '100%',
          minHeight: '120px',
          resize: 'vertical'
        }}
      />
    </WizardSlide>
  );
}

