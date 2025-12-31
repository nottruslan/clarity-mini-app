import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';

interface Step3DateProps {
  onComplete: (dueDate?: number) => void;
  onBack: () => void;
  initialValue?: number;
}

export default function Step3Date({ onComplete, onBack, initialValue }: Step3DateProps) {
  const initialDateStr = initialValue ? new Date(initialValue).toISOString().split('T')[0] : '';
  const [hasDueDate, setHasDueDate] = useState(!!initialValue);
  const [dueDate, setDueDate] = useState(initialDateStr);

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
