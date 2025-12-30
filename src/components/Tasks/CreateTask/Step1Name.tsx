import { useState } from 'react';
import SlideContainer from '../../Navigation/SlideContainer';

interface Step1NameProps {
  onNext: (name: string) => void;
  onBack?: () => void;
}

export default function Step1Name({ onNext, onBack }: Step1NameProps) {
  const [name, setName] = useState('');

  const handleNext = () => {
    if (name.trim()) {
      onNext(name.trim());
    }
  };

  return (
    <div className="form-slide">
      <h2 className="form-title">Новая задача</h2>
      <p className="form-subtitle">Введите название задачи</p>
      
      <input
        type="text"
        className="form-input"
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

      <div className="form-actions">
        {onBack && (
          <button className="tg-button" onClick={onBack} style={{ 
            backgroundColor: 'var(--tg-theme-secondary-bg-color)',
            color: 'var(--tg-theme-text-color)'
          }}>
            Назад
          </button>
        )}
        <button 
          className="tg-button" 
          onClick={handleNext}
          disabled={!name.trim()}
        >
          Далее
        </button>
      </div>
    </div>
  );
}

