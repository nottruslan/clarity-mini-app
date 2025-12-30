import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step18FinalProps {
  onComplete: () => void;
  onBack: () => void;
  year: number;
}

export default function Step18Final({ onComplete, onBack, year }: Step18FinalProps) {
  return (
    <WizardSlide
      icon="🎉"
      title="Поздравляем!"
      description={`Ты только что спланировал(а) будущий год ${year}!`}
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={onComplete}>
            Завершить
          </GradientButton>
        </div>
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
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--tg-theme-text-color)',
          textAlign: 'center'
        }}>
          Я верю, что всё возможно в новом году.
        </p>
        <p style={{
          fontSize: '16px',
          color: 'var(--tg-theme-hint-color)',
          lineHeight: '1.6',
          textAlign: 'center'
        }}>
          Сделайте снимок и поделитесь с нами, используя хэштег #yearcompass.
        </p>
      </div>
    </WizardSlide>
  );
}

