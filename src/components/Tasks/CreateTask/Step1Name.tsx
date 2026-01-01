import { useState, useRef } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step1NameProps {
  initialValue?: string;
  onNext: (name: string) => void;
  onBack?: () => void;
}

export default function Step1Name({ initialValue = '', onNext, onBack }: Step1NameProps) {
  const [name, setName] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (!name.trim()) return;
    inputRef.current?.blur();
    onNext(name.trim());
  };

  return (
    <WizardSlide
      icon="✓"
      title="Название задачи"
      description="Введите название задачи"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          {onBack && (
            <GradientButton variant="secondary" onClick={onBack}>
              Назад
            </GradientButton>
          )}
          <GradientButton onClick={handleNext} disabled={!name.trim()}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <input
        ref={inputRef}
        type="text"
        className="wizard-input"
        placeholder="Например: Купить молоко"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && name.trim()) {
            handleNext();
          }
        }}
        autoFocus
      />
    </WizardSlide>
  );
}

