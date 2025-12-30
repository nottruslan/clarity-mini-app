import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';

interface Step2PriorityProps {
  onNext: (priority: 'low' | 'medium' | 'high') => void;
  onBack: () => void;
}

export default function Step2Priority({ onNext, onBack }: Step2PriorityProps) {
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const priorities = [
    { 
      id: 'low' as const, 
      label: 'Спокойный', 
      icon: '🟢',
      description: 'Низкий приоритет',
      badge: 'Низкий'
    },
    { 
      id: 'medium' as const, 
      label: 'Крепкий', 
      icon: '🟡',
      description: 'Средний приоритет',
      badge: 'Средний'
    },
    { 
      id: 'high' as const, 
      label: 'Уверенный', 
      icon: '🔴',
      description: 'Высокий приоритет',
      badge: 'Высокий'
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
            description={p.description}
            badge={p.badge}
            selected={priority === p.id}
            onClick={() => setPriority(p.id)}
          />
        ))}
      </div>
    </WizardSlide>
  );
}
