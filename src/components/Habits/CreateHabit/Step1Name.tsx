import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step1NameProps {
  onNext: (name: string) => void;
}

export default function Step1Name({ onNext }: Step1NameProps) {
  const [name, setName] = useState('');

  const handleNext = () => {
    onNext(name.trim() || 'Новая привычка');
  };

  return (
    <WizardSlide
      icon="🔥"
      title="Название привычки"
      description="Введите название вашей привычки"
      actions={
        <GradientButton onClick={handleNext}>
          Продолжить
        </GradientButton>
      }
    >
      <input
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
        autoFocus
      />
    </WizardSlide>
  );
}
