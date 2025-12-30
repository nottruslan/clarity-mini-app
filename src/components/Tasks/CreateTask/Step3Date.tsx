import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';

interface Step3DateProps {
  onComplete: (dueDate?: number) => void;
  onBack: () => void;
}

export default function Step3Date({ onComplete, onBack }: Step3DateProps) {
  const [hasDueDate, setHasDueDate] = useState(false);
  const [dueDate, setDueDate] = useState('');

  const handleComplete = () => {
    if (hasDueDate && dueDate) {
      const date = new Date(dueDate);
      onComplete(date.getTime());
    } else {
      onComplete();
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <WizardSlide
      icon="📅"
      title="Срок выполнения"
      description="Установите срок выполнения (необязательно)"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton
            variant="secondary"
            onClick={onBack}
          >
            Назад
          </GradientButton>
          <GradientButton
            onClick={handleComplete}
          >
            Создать
          </GradientButton>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <WizardCard
          icon={hasDueDate ? '✓' : '📅'}
          title={hasDueDate ? 'Срок установлен' : 'Установить срок'}
          description={hasDueDate ? 'Нажмите, чтобы убрать срок' : 'Нажмите, чтобы установить срок выполнения'}
          selected={hasDueDate}
          onClick={() => setHasDueDate(!hasDueDate)}
        />
        
        {hasDueDate && (
          <input
            type="date"
            className="wizard-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={today}
            style={{ marginTop: '8px' }}
          />
        )}
      </div>
    </WizardSlide>
  );
}
