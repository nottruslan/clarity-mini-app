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
      // Создаем дату в UTC, чтобы избежать проблем с часовыми поясами
      // Формат dueDate: "YYYY-MM-DD"
      const [year, month, day] = dueDate.split('-').map(Number);
      const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      // Конвертируем в локальное время (начало дня в локальном времени)
      const localDate = new Date(year, month - 1, day, 0, 0, 0, 0);
      console.log('[DEBUG] Step3Date handleComplete:', {
        dueDateString: dueDate,
        year,
        month,
        day,
        localDateTimestamp: localDate.getTime(),
        utcDateTimestamp: date.getTime()
      });
      onComplete(localDate.getTime());
    } else {
      console.log('[DEBUG] Step3Date handleComplete: no date set');
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
