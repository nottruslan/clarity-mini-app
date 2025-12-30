import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step32FinalProps {
  onComplete: () => void;
  onBack: () => void;
  year: number;
}

export default function Step32Final({ onComplete, onBack, year }: Step32FinalProps) {
  return (
    <WizardSlide
      icon="🎉"
      title="Поздравляем!"
      description={`Годовой отчет за ${year} готов!`}
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
          Все данные сохранены
        </p>
      </div>
    </WizardSlide>
  );
}

