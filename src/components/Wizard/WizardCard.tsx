import { ReactNode, useRef } from 'react';

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
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);

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
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    movedRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    // Если движение больше 10px, считаем это скроллом
    if (deltaX > 10 || deltaY > 10) {
      movedRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    // Обрабатываем клик только если не было движения (тап)
    if (!movedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
    
    touchStartRef.current = null;
    movedRef.current = false;
  };

  return (
    <div
      className={`wizard-card ${selected ? 'selected' : ''}`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
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

