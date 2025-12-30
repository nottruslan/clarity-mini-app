import { ReactNode } from 'react';

interface WizardSlideProps {
  icon: string;
  title: string;
  description?: string;
  children: ReactNode;
  actions: ReactNode;
}

export default function WizardSlide({ 
  icon, 
  title, 
  description, 
  children, 
  actions 
}: WizardSlideProps) {
  return (
    <>
      <div className="wizard-slide-content">
        <div className="wizard-slide-icon">{icon}</div>
        <h2 className="wizard-slide-title">{title}</h2>
        {description && (
          <p className="wizard-slide-description">{description}</p>
        )}
        <div className="wizard-slide-body">
          {children}
        </div>
      </div>
      <div className="wizard-slide-actions">
        {actions}
      </div>
    </>
  );
}

