import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

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
    <WizardSlide
      icon="🎨"
      title="Выберите иконку"
      description={`Выберите иконку для "${name}"`}
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton
            variant="secondary"
            onClick={onBack}
          >
            Назад
          </GradientButton>
          <GradientButton
            onClick={() => onNext(selectedIcon)}
          >
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        width: '100%',
        maxWidth: '400px'
      }}>
        {icons.map((icon) => (
          <button
            key={icon}
            onClick={() => setSelectedIcon(icon)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setSelectedIcon(icon);
            }}
            className={`wizard-icon-button ${selectedIcon === icon ? 'selected' : ''}`}
            style={{
              aspectRatio: '1',
              borderRadius: '12px',
              border: `2px solid ${selectedIcon === icon ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
              backgroundColor: selectedIcon === icon 
                ? 'rgba(51, 144, 236, 0.1)' 
                : 'var(--tg-theme-bg-color)',
              fontSize: '36px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            {icon}
          </button>
        ))}
      </div>
    </WizardSlide>
  );
}
