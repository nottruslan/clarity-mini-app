import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import WizardCard from '../../Wizard/WizardCard';

interface Step4UrgencyProps {
  onNext: (urgent: boolean) => void;
  onBack: () => void;
  initialValue?: boolean;
}

export default function Step4Urgency({ onNext, onBack, initialValue = false }: Step4UrgencyProps) {
  const [urgent, setUrgent] = useState<boolean | null>(initialValue ? true : null);

  return (
    <WizardSlide
      icon="⏰"
      title="Срочность"
      description="Эта задача требует немедленного внимания?"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <div style={{ flex: 1 }}>
            <GradientButton
              variant="secondary"
              onClick={onBack}
            >
              Назад
            </GradientButton>
          </div>
          <div style={{ flex: 1 }}>
            <GradientButton
              onClick={() => urgent !== null && onNext(urgent)}
              disabled={urgent === null}
            >
              Продолжить
            </GradientButton>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <WizardCard
          icon="🔥"
          title="Срочно"
          description="Требует немедленного внимания"
          selected={urgent === true}
          onClick={() => setUrgent(true)}
        />
        <WizardCard
          icon="📅"
          title="Не срочно"
          description="Можно отложить"
          selected={urgent === false}
          onClick={() => setUrgent(false)}
        />
      </div>
    </WizardSlide>
  );
}

