import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step1NameProps {
  onNext: (name: string) => void;
  onBack: () => void;
  initialValue?: string;
}

export default function Step1Name({ onNext, onBack, initialValue = '' }: Step1NameProps) {
  const [name, setName] = useState(initialValue);

  return (
    <WizardSlide
      icon="📝"
      title="Название задачи"
      description="Введите название задачи"
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
              onClick={() => name.trim() && onNext(name.trim())}
              disabled={!name.trim()}
            >
              Продолжить
            </GradientButton>
          </div>
        </div>
      }
    >
      <input
        className="wizard-input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Например: Подготовить презентацию"
        autoFocus
      />
    </WizardSlide>
  );
}

