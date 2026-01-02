import { useState, useRef } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step1TitleProps {
  onNext: (title: string) => void;
  onBack?: () => void;
}

export default function Step1Title({ onNext, onBack }: Step1TitleProps) {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    inputRef.current?.blur();
    if (title.trim()) {
      onNext(title.trim());
    }
  };

  return (
    <WizardSlide
      icon="📚"
      title="Название книги"
      description="Введите название книги"
      actions={
        onBack ? (
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <GradientButton
              variant="secondary"
              onClick={onBack}
            >
              Назад
            </GradientButton>
            <GradientButton onClick={handleNext} disabled={!title.trim()}>
              Продолжить
            </GradientButton>
          </div>
        ) : (
          <GradientButton onClick={handleNext} disabled={!title.trim()}>
            Продолжить
          </GradientButton>
        )
      }
    >
      <input
        ref={inputRef}
        type="text"
        className="wizard-input"
        placeholder="Например: Война и мир"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && title.trim()) {
            handleNext();
          }
        }}
      />
    </WizardSlide>
  );
}

