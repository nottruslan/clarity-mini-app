import { useState, useRef } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step2AuthorProps {
  title: string;
  onNext: (author?: string) => void;
  onBack: () => void;
}

export default function Step2Author({ title, onNext, onBack }: Step2AuthorProps) {
  const [author, setAuthor] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    inputRef.current?.blur();
    onNext(author.trim() || undefined);
  };

  const handleSkip = () => {
    onNext(undefined);
  };

  return (
    <WizardSlide
      icon="✍️"
      title="Автор"
      description={`Укажите автора книги "${title}" (опционально)`}
      actions={
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
      }
    >
      <input
        ref={inputRef}
        type="text"
        className="wizard-input"
        placeholder="Например: Лев Толстой"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleNext();
          }
        }}
      />
      <button
        onClick={handleSkip}
        style={{
          marginTop: '12px',
          padding: '12px',
          background: 'transparent',
          border: '1px solid var(--tg-theme-hint-color)',
          borderRadius: '12px',
          color: 'var(--tg-theme-hint-color)',
          fontSize: '14px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Пропустить
      </button>
    </WizardSlide>
  );
}

