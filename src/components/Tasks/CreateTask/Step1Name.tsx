import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step1NameProps {
  onNext: (name: string) => void;
  onBack?: () => void;
}

export default function Step1Name({ onNext, onBack }: Step1NameProps) {
  const [name, setName] = useState('');

  const handleNext = () => {
    onNext(name.trim() || 'Новая задача');
  };

  return (
    <WizardSlide
      icon="✓"
      title="Название задачи"
      description="Введите название вашей задачи"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          {onBack && (
            <GradientButton
              variant="secondary"
              onClick={onBack}
            >
              Назад
            </GradientButton>
          )}
          <GradientButton
            onClick={handleNext}
          >
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <input
        type="text"
        className="wizard-input"
        placeholder="Например: Купить молоко"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleNext();
          }
        }}
        autoFocus
      />
    </WizardSlide>
  );
}
