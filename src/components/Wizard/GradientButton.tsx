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
  return (
    <button
      className={`gradient-button gradient-button-${variant}`}
      onClick={onClick}
      onTouchEnd={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onClick();
        }
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

