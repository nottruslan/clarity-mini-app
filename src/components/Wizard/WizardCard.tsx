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
  return (
    <div
      className={`wizard-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      onTouchEnd={(e) => {
        e.preventDefault();
        onClick();
      }}
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

