import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step6GoalProps {
  name: string;
  onComplete: (goalDays: number | undefined) => void;
  onBack: () => void;
}

const commonGoals = [
  { days: 7, label: 'Неделя', description: '7 дней подряд' },
  { days: 21, label: '21 день', description: 'Классическая привычка' },
  { days: 30, label: 'Месяц', description: '30 дней подряд' },
  { days: 66, label: '66 дней', description: 'Для сложных привычек' },
  { days: 90, label: '3 месяца', description: '90 дней подряд' },
  { days: 365, label: 'Год', description: '365 дней подряд' }
];

export default function Step6Goal({ name, onComplete, onBack }: Step6GoalProps) {
  const [selectedGoal, setSelectedGoal] = useState<number | undefined>(undefined);
  const [customGoal, setCustomGoal] = useState<string>('');
  const [hasGoal, setHasGoal] = useState<boolean>(true);

  const handleComplete = () => {
    if (!hasGoal) {
      onComplete(undefined);
      return;
    }
    
    if (selectedGoal) {
      onComplete(selectedGoal);
    } else if (customGoal) {
      const days = parseInt(customGoal);
      if (!isNaN(days) && days > 0) {
        onComplete(days);
      } else {
        onComplete(undefined);
      }
    } else {
      onComplete(undefined);
    }
  };

  return (
    <WizardSlide
      icon="🎯"
      title="Цель по дням"
      description={`Установите цель для "${name}" (опционально)`}
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
        <button
          onClick={() => {
            setHasGoal(!hasGoal);
            if (!hasGoal) {
              setSelectedGoal(undefined);
              setCustomGoal('');
            }
          }}
          style={{
            padding: '16px',
            borderRadius: '12px',
            border: `2px solid ${!hasGoal ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
            background: !hasGoal 
              ? 'rgba(51, 144, 236, 0.1)' 
              : 'var(--tg-theme-section-bg-color)',
            fontSize: '16px',
            fontWeight: !hasGoal ? '600' : '400',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          Без цели
        </button>

        {hasGoal && (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '12px',
              marginTop: '8px'
            }}>
              {commonGoals.map((goal) => (
                <button
                  key={goal.days}
                  onClick={() => {
                    setSelectedGoal(goal.days);
                    setCustomGoal('');
                  }}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: `2px solid ${selectedGoal === goal.days ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
                    background: selectedGoal === goal.days 
                      ? 'rgba(51, 144, 236, 0.1)' 
                      : 'var(--tg-theme-section-bg-color)',
                    fontSize: '14px',
                    fontWeight: selectedGoal === goal.days ? '600' : '400',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>{goal.label}</span>
                  <span style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>
                    {goal.description}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '8px' }}>
              <label style={{ 
                fontSize: '14px', 
                color: 'var(--tg-theme-hint-color)', 
                marginBottom: '8px', 
                display: 'block' 
              }}>
                Или введите свое количество дней:
              </label>
              <input
                type="number"
                className="wizard-input"
                placeholder="Количество дней"
                value={customGoal}
                onChange={(e) => {
                  setCustomGoal(e.target.value);
                  setSelectedGoal(undefined);
                }}
                min="1"
              />
            </div>
          </>
        )}
      </div>
    </WizardSlide>
  );
}

