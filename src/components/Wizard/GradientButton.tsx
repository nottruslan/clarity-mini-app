import { useRef } from 'react';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function GradientButton({ 
  children, 
  onClick, 
  disabled = false,
  variant = 'primary'
}: GradientButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { notificationOccurred, selectionChanged } = useHapticFeedback();

  const handleClick = () => {
    // Вибрация даже для disabled кнопок (по требованию)
    // Для primary кнопок используем success вибрацию, для secondary - selection
    if (variant === 'primary') {
      notificationOccurred('success');
    } else {
      selectionChanged();
    }
    onClick();
  };

  return (
    <button
      ref={buttonRef}
      className={`gradient-button gradient-button-${variant}`}
      data-haptic="skip"
      onClick={handleClick}
      onTouchEnd={(e) => {
        e.preventDefault();
        if (!disabled) {
          handleClick();
        } else {
          // Вибрация даже для disabled кнопок
          if (variant === 'primary') {
            notificationOccurred('success');
          } else {
            selectionChanged();
          }
        }
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

