interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  color?: string;
}

export default function ProgressBar({ 
  currentStep, 
  totalSteps, 
  color = '#3390ec' 
}: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="wizard-progress-bar">
      <div 
        className="wizard-progress-bar-fill"
        style={{
          width: `${progress}%`,
          backgroundColor: color,
          transition: 'width 0.3s ease'
        }}
      />
    </div>
  );
}

