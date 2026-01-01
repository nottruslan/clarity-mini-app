import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import WizardCard from '../../Wizard/WizardCard';

interface Step6RecurringProps {
  initialRecurring?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  onComplete: (recurring?: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
  onBack: () => void;
}

const recurringOptions = [
  { value: 'daily' as const, label: 'Ежедневно', icon: '📆' },
  { value: 'weekly' as const, label: 'Еженедельно', icon: '📅' },
  { value: 'monthly' as const, label: 'Ежемесячно', icon: '🗓️' },
  { value: 'yearly' as const, label: 'Ежегодно', icon: '📊' }
];

export default function Step6Recurring({ 
  initialRecurring,
  onComplete, 
  onBack 
}: Step6RecurringProps) {
  const [recurring, setRecurring] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | undefined>(initialRecurring);

  const handleComplete = () => {
    onComplete(recurring);
  };

  return (
    <WizardSlide
      icon="🔄"
      title="Повторения"
      description="Настройте повторения задачи (необязательно)"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={handleComplete}>
            Готово
          </GradientButton>
        </div>
      }
    >
      <div style={{ 
        display: 'flex',
        flexDirection: 'column', 
        gap: '12px', 
        width: '100%'
      }}>
        <WizardCard
          title="Без повторений"
          selected={!recurring}
          onClick={() => setRecurring(undefined)}
        />
        {recurringOptions.map((option) => (
          <WizardCard
            key={option.value}
            icon={option.icon}
            title={option.label}
            selected={recurring === option.value}
            onClick={() => setRecurring(option.value)}
          />
        ))}
      </div>
    </WizardSlide>
  );
}

