import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';

interface Step2PriorityProps {
  onNext: (priority: 'low' | 'medium' | 'high') => void;
  onBack: () => void;
  initialValue?: 'low' | 'medium' | 'high';
}

export default function Step2Priority({ onNext, onBack, initialValue }: Step2PriorityProps) {
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialValue || 'medium');

  const priorities = [
    { 
      id: 'low' as const, 
      label: 'Низкий', 
      icon: '🟢'
    },
    { 
      id: 'medium' as const, 
      label: 'Средний', 
      icon: '🟡'
    },
    { 
      id: 'high' as const, 
      label: 'Высокий', 
      icon: '🔴'
    }
  ];

  return (
    <WizardSlide
      icon="🎯"
      title="Приоритет"
      description="Выберите приоритет задачи"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton
            variant="secondary"
            onClick={onBack}
          >
            Назад
          </GradientButton>
          <GradientButton
            onClick={() => onNext(priority)}
          >
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {priorities.map((p) => (
          <WizardCard
            key={p.id}
            icon={p.icon}
            title={p.label}
            selected={priority === p.id}
            onClick={() => setPriority(p.id)}
          />
        ))}
      </div>
    </WizardSlide>
  );
}
