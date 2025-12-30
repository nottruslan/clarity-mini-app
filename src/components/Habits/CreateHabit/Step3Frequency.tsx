import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';

interface Step3FrequencyProps {
  name: string;
  onComplete: (frequency: 'daily' | 'weekly') => void;
  onBack: () => void;
}

export default function Step3Frequency({ name, onComplete, onBack }: Step3FrequencyProps) {
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');

  return (
    <WizardSlide
      icon="📅"
      title="Частота"
      description={`Как часто вы хотите отслеживать "${name}"?`}
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton
            variant="secondary"
            onClick={onBack}
          >
            Назад
          </GradientButton>
          <GradientButton
            onClick={() => onComplete(frequency)}
          >
            Создать
          </GradientButton>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <WizardCard
          icon="📅"
          title="Ежедневно"
          description="Каждый день"
          selected={frequency === 'daily'}
          onClick={() => setFrequency('daily')}
        />
        <WizardCard
          icon="📆"
          title="Еженедельно"
          description="Раз в неделю"
          selected={frequency === 'weekly'}
          onClick={() => setFrequency('weekly')}
        />
      </div>
    </WizardSlide>
  );
}
