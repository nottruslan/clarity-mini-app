import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step1WelcomeProps {
  onNext: () => void;
}

export default function Step1Welcome({ onNext }: Step1WelcomeProps) {
  return (
    <WizardSlide
      icon="📅"
      title="Годовой отчет"
      description="Проанализируйте прошедший год и спланируйте следующий"
      actions={
        <GradientButton onClick={onNext}>
          Начать
        </GradientButton>
      }
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        textAlign: 'center',
        width: '100%'
      }}>
        <p style={{
          fontSize: '16px',
          color: 'var(--tg-theme-hint-color)',
          lineHeight: '1.5'
        }}>
          Вспомните важные события и определите цели на будущее
        </p>
      </div>
    </WizardSlide>
  );
}

