import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';

interface Step4GenreProps {
  title: string;
  onNext: (genre?: string) => void;
  onBack: () => void;
}

const genres = [
  { id: 'fiction', name: 'Художественная', icon: '📖', color: '#9c27b0' },
  { id: 'non-fiction', name: 'Нон-фикшн', icon: '📚', color: '#2196f3' },
  { id: 'biography', name: 'Биография', icon: '👤', color: '#ff9800' },
  { id: 'self-help', name: 'Саморазвитие', icon: '🌟', color: '#4caf50' },
  { id: 'business', name: 'Бизнес', icon: '💼', color: '#607d8b' },
  { id: 'science', name: 'Наука', icon: '🔬', color: '#00bcd4' },
  { id: 'history', name: 'История', icon: '🏛️', color: '#795548' },
  { id: 'philosophy', name: 'Философия', icon: '🤔', color: '#9e9e9e' },
  { id: 'psychology', name: 'Психология', icon: '🧠', color: '#e91e63' },
  { id: 'fantasy', name: 'Фэнтези', icon: '🧙', color: '#673ab7' },
  { id: 'sci-fi', name: 'Научная фантастика', icon: '🚀', color: '#3f51b5' },
  { id: 'other', name: 'Прочее', icon: '⭐', color: '#9e9e9e' }
];

export default function Step4Genre({ title, onNext, onBack }: Step4GenreProps) {
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(undefined);

  const handleNext = () => {
    onNext(selectedGenre);
  };

  const handleSkip = () => {
    onNext(undefined);
  };

  return (
    <WizardSlide
      icon="📁"
      title="Жанр"
      description={`Выберите жанр для "${title}" (опционально)`}
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
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '8px', 
          width: '100%',
          maxWidth: '400px',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 300px)',
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {genres.map((genre) => (
          <WizardCard
            key={genre.id}
            icon={genre.icon}
            title={genre.name}
            selected={selectedGenre === genre.id}
            onClick={() => setSelectedGenre(genre.id)}
          />
        ))}
      </div>
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

