import { useState } from 'react';

interface Step2IconProps {
  name: string;
  onNext: (icon: string) => void;
  onBack: () => void;
}

const icons = [
  '🔥', '💪', '📚', '🏃', '🧘', '💧', '🍎', '🌱',
  '☀️', '🌙', '⭐', '🎯', '💎', '🚀', '🎨', '🎵',
  '📝', '🧠', '❤️', '✨', '🌟', '🎪', '🏆', '🎁'
];

export default function Step2Icon({ name, onNext, onBack }: Step2IconProps) {
  const [selectedIcon, setSelectedIcon] = useState('🔥');

  return (
    <div className="form-slide">
      <h2 className="form-title">Иконка</h2>
      <p className="form-subtitle">Выберите иконку для "{name}"</p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '24px',
        padding: '16px 0'
      }}>
        {icons.map((icon) => (
          <button
            key={icon}
            onClick={() => setSelectedIcon(icon)}
            style={{
              aspectRatio: '1',
              borderRadius: '10px',
              border: `2px solid ${selectedIcon === icon ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
              backgroundColor: selectedIcon === icon 
                ? 'var(--tg-theme-button-color)' 
                : 'var(--tg-theme-bg-color)',
              fontSize: '32px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </button>
        ))}
      </div>

      <div className="form-actions">
        <button 
          className="tg-button" 
          onClick={onBack}
          style={{ 
            backgroundColor: 'var(--tg-theme-secondary-bg-color)',
            color: 'var(--tg-theme-text-color)'
          }}
        >
          Назад
        </button>
        <button 
          className="tg-button" 
          onClick={() => onNext(selectedIcon)}
        >
          Далее
        </button>
      </div>
    </div>
  );
}

