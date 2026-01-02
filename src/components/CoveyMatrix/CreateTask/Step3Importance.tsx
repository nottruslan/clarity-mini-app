import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import WizardCard from '../../Wizard/WizardCard';

interface Step3ImportanceProps {
  onNext: (important: boolean) => void;
  onBack: () => void;
  initialValue?: boolean;
}

export default function Step3Importance({ onNext, onBack, initialValue = false }: Step3ImportanceProps) {
  const [important, setImportant] = useState<boolean | null>(initialValue ? true : null);

  return (
    <WizardSlide
      icon="⭐"
      title="Важность"
      description="Эта задача важна для ваших целей?"
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
              onClick={() => important !== null && onNext(important)}
              disabled={important === null}
            >
              Продолжить
            </GradientButton>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <WizardCard
          icon="✅"
          title="Важно"
          description="Задача важна для достижения целей"
          selected={important === true}
          onClick={() => setImportant(true)}
        />
        <WizardCard
          icon="❌"
          title="Не важно"
          description="Задача не критична"
          selected={important === false}
          onClick={() => setImportant(false)}
        />
      </div>
    </WizardSlide>
  );
}

