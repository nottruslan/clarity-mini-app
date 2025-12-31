import { useState, useRef } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step7DescriptionProps {
  onNext: (description?: string) => void;
  onBack: () => void;
  initialValue?: string;
}

export default function Step7Description({ onNext, onBack, initialValue }: Step7DescriptionProps) {
  const [description, setDescription] = useState(initialValue || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleNext = () => {
    textareaRef.current?.blur();
    onNext(description.trim() || undefined);
  };

  return (
    <WizardSlide
      icon="📝"
      title="Описание"
      description="Добавьте описание задачи (необязательно)"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton
            variant="secondary"
            onClick={onBack}
          >
            Назад
          </GradientButton>
          <GradientButton
            onClick={handleNext}
          >
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <textarea
        ref={textareaRef}
        placeholder="Введите описание задачи..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          width: '100%',
          minHeight: '150px',
          padding: '12px 16px',
          borderRadius: '10px',
          border: '1px solid var(--tg-theme-secondary-bg-color)',
          backgroundColor: 'var(--tg-theme-bg-color)',
          color: 'var(--tg-theme-text-color)',
          fontSize: '16px',
          fontFamily: 'inherit',
          resize: 'vertical',
          outline: 'none'
        }}
      />
    </WizardSlide>
  );
}

