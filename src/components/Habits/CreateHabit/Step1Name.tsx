import { useState } from 'react';

interface Step1NameProps {
  onNext: (name: string) => void;
}

export default function Step1Name({ onNext }: Step1NameProps) {
  const [name, setName] = useState('');

  const handleNext = () => {
    if (name.trim()) {
      onNext(name.trim());
    }
  };

  return (
    <div className="form-slide">
      <h2 className="form-title">Новая привычка</h2>
      <p className="form-subtitle">Введите название привычки</p>
      
      <input
        type="text"
        className="form-input"
        placeholder="Например: Пить воду"
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

