import { ReactNode } from 'react';

interface WizardCardProps {
  icon?: string;
  title: string;
  description?: string;
  badge?: string;
  selected?: boolean;
  onClick: () => void;
  children?: ReactNode;
}

export default function WizardCard({
  icon,
  title,
  description,
  badge,
  selected = false,
  onClick,
  children
}: WizardCardProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Предотвращаем автоматический скролл
    if (e.currentTarget) {
      e.currentTarget.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
    onClick();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Предотвращаем движение экрана при touch
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      className={`wizard-card ${selected ? 'selected' : ''}`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {icon && (
        <div className="wizard-card-icon">{icon}</div>
      )}
      <div className="wizard-card-content">
        <div className="wizard-card-header">
          <span className="wizard-card-title">{title}</span>
          {badge && (
            <span className="wizard-card-badge">{badge}</span>
          )}
        </div>
        {description && (
          <p className="wizard-card-description">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}

