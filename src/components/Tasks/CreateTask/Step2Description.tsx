import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step2DescriptionProps {
  initialValue?: string;
  onNext: (description?: string) => void;
  onBack: () => void;
}

export default function Step2Description({ initialValue = '', onNext, onBack }: Step2DescriptionProps) {
  const [description, setDescription] = useState(initialValue);

  const handleNext = () => {
    onNext(description.trim() || undefined);
  };

  return (
    <WizardSlide
      icon="📝"
      title="Описание"
      description="Добавьте описание задачи (необязательно)"
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
      <textarea
        className="wizard-input"
        placeholder="Дополнительная информация о задаче..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={6}
        style={{
          resize: 'none',
          fontFamily: 'inherit'
        }}
      />
    </WizardSlide>
  );
}

