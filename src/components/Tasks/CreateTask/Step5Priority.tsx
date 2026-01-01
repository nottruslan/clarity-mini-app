import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import WizardCard from '../../Wizard/WizardCard';

interface Step5PriorityProps {
  initialPriority?: 'low' | 'medium' | 'high';
  onNext: (priority?: 'low' | 'medium' | 'high') => void;
  onBack: () => void;
}

const priorities = [
  { value: 'low' as const, label: 'Низкий', icon: '🟢' },
  { value: 'medium' as const, label: 'Средний', icon: '🟡' },
  { value: 'high' as const, label: 'Высокий', icon: '🔴' }
];

export default function Step5Priority({ 
  initialPriority, 
  onNext, 
  onBack 
}: Step5PriorityProps) {
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | undefined>(initialPriority);

  const handleNext = () => {
    onNext(priority);
  };

  return (
    <WizardSlide
      icon="⚡"
      title="Приоритет"
      description="Выберите приоритет задачи (необязательно)"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={handleNext}>
            Продолжить
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
          title="Без приоритета"
          selected={!priority}
          onClick={() => setPriority(undefined)}
        />
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
    </WizardSlide>
  );
}

