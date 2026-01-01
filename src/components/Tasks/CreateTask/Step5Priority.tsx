import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import WizardCard from '../../Wizard/WizardCard';

interface Step5PriorityProps {
  initialPriority?: 'low' | 'medium' | 'high';
  initialRecurring?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  onComplete: (priority: 'low' | 'medium' | 'high', recurring?: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
  onBack: () => void;
}

const priorities = [
  { value: 'low' as const, label: 'Низкий', icon: '🟢' },
  { value: 'medium' as const, label: 'Средний', icon: '🟡' },
  { value: 'high' as const, label: 'Высокий', icon: '🔴' }
];

const recurringOptions = [
  { value: 'daily' as const, label: 'Ежедневно', icon: '📆' },
  { value: 'weekly' as const, label: 'Еженедельно', icon: '📅' },
  { value: 'monthly' as const, label: 'Ежемесячно', icon: '🗓️' },
  { value: 'yearly' as const, label: 'Ежегодно', icon: '📊' }
];

export default function Step5Priority({ 
  initialPriority = 'medium', 
  initialRecurring,
  onComplete, 
  onBack 
}: Step5PriorityProps) {
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialPriority);
  const [recurring, setRecurring] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | undefined>(initialRecurring);

  const handleComplete = () => {
    onComplete(priority, recurring);
  };

  return (
    <WizardSlide
      icon="⚡"
      title="Приоритет и повторения"
      description="Выберите приоритет задачи и настройте повторения"
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
        gap: '24px', 
        width: '100%'
      }}>
        {/* Приоритет */}
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--tg-theme-text-color)',
            marginBottom: '12px'
          }}>
            Приоритет
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {priorities.map((p) => (
              <WizardCard
                key={p.value}
                icon={p.icon}
                title={p.label}
                selected={priority === p.value}
                onClick={() => setPriority(p.value)}
              />
            ))}
          </div>
        </div>

        {/* Повторения */}
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--tg-theme-text-color)',
            marginBottom: '12px'
          }}>
            Повторения (необязательно)
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
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
        </div>
      </div>
    </WizardSlide>
  );
}

