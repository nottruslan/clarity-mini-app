import { ReactNode, useEffect } from 'react';
import ProgressBar from './ProgressBar';

interface WizardContainerProps {
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
  progressColor?: string;
}

export default function WizardContainer({
  currentStep,
  totalSteps,
  children,
  progressColor
}: WizardContainerProps) {
  // Блокируем прокрутку body когда wizard открыт
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="wizard-container">
      <ProgressBar 
        currentStep={currentStep} 
        totalSteps={totalSteps}
        color={progressColor}
      />
      <div className="wizard-slides-wrapper">
        {children}
      </div>
    </div>
  );
}

