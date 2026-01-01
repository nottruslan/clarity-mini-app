import { useState, useRef } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step1NameProps {
  onNext: (name: string) => void;
  onBack?: () => void;
}

export default function Step1Name({ onNext, onBack }: Step1NameProps) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    inputRef.current?.blur();
    onNext(name.trim() || 'Новая привычка');
  };

  return (
    <WizardSlide
      icon="🔥"
      title="Название привычки"
      description="Введите название вашей привычки"
      actions={
        onBack ? (
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <GradientButton
              variant="secondary"
              onClick={onBack}
            >
              Назад
            </GradientButton>
            <GradientButton onClick={handleNext}>
              Продолжить
            </GradientButton>
          </div>
        ) : (
          <GradientButton onClick={handleNext}>
            Продолжить
          </GradientButton>
        )
      }
    >
      <input
        ref={inputRef}
        type="text"
        className="wizard-input"
        placeholder="Например: Пить воду"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleNext();
          }
        }}
      />
    </WizardSlide>
  );
}
