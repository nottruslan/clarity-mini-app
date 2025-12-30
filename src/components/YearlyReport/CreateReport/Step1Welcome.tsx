import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step1WelcomeProps {
  onNext: () => void;
}

export default function Step1Welcome({ onNext }: Step1WelcomeProps) {
  return (
    <WizardSlide
      icon="📅"
      title="Добро пожаловать в YearCompass"
      description="Этот буклет поможет вам проанализировать прошедший год и спланировать следующий"
      actions={
        <GradientButton onClick={onNext}>
          Начать
        </GradientButton>
      }
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        textAlign: 'left',
        width: '100%'
      }}>
        <p style={{
          fontSize: '16px',
          color: 'var(--tg-theme-text-color)',
          lineHeight: '1.6'
        }}>
          Подготовьтесь. Соберитесь. Подготовьте всё необходимое и пространство вокруг себя.
        </p>
        <p style={{
          fontSize: '16px',
          color: 'var(--tg-theme-text-color)',
          lineHeight: '1.6'
        }}>
          Закройте глаза и глубоко вдохните и выдохните пять раз.
        </p>
        <p style={{
          fontSize: '16px',
          color: 'var(--tg-theme-text-color)',
          lineHeight: '1.6'
        }}>
          Отпустите любые ожидания. Начинайте, когда почувствуете, что готовы.
        </p>
      </div>
    </WizardSlide>
  );
}

