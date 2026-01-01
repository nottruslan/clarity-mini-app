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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                padding: '14px 24px',
                borderRadius: '12px',
                border: '1px solid var(--tg-theme-secondary-bg-color)',
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Назад
            </button>
          )}
          <GradientButton onClick={handleNext}>
            Продолжить
          </GradientButton>
        </div>
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
