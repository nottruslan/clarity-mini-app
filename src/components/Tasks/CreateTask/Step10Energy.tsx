import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';

interface Step10EnergyProps {
  onComplete: (energyLevel?: 'low' | 'medium' | 'high') => void;
  onBack: () => void;
  initialValue?: 'low' | 'medium' | 'high';
  isEditing?: boolean;
}

export default function Step10Energy({ onComplete, onBack, initialValue, isEditing }: Step10EnergyProps) {
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high' | undefined>(initialValue);

  const energyLevels = [
    { 
      id: 'low' as const, 
      label: 'Низкая', 
      icon: '😌',
      description: 'Простая задача, не требует много усилий'
    },
    { 
      id: 'medium' as const, 
      label: 'Средняя', 
      icon: '😊',
      description: 'Обычная задача'
    },
    { 
      id: 'high' as const, 
      label: 'Высокая', 
      icon: '💪',
      description: 'Требует много энергии и концентрации'
    }
  ];

  return (
    <WizardSlide
      icon="⚡"
      title="Энергозатратность"
      description="Оцените, сколько энергии потребует эта задача (необязательно)"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton
            variant="secondary"
            onClick={onBack}
          >
            Назад
          </GradientButton>
          <GradientButton
            onClick={() => onComplete(energyLevel)}
          >
{isEditing ? 'Сохранить' : 'Создать задачу'}
          </GradientButton>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <WizardCard
          icon="➖"
          title="Не указывать"
          description="Не оценивать энергозатратность"
          selected={energyLevel === undefined}
          onClick={() => setEnergyLevel(undefined)}
        />
        {energyLevels.map((level) => (
          <WizardCard
            key={level.id}
            icon={level.icon}
            title={level.label}
            description={level.description}
            selected={energyLevel === level.id}
            onClick={() => setEnergyLevel(level.id)}
          />
        ))}
      </div>
    </WizardSlide>
  );
}

