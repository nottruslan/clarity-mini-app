import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';
import { RecurrenceRule } from '../../../utils/storage';

interface Step9RecurrenceProps {
  onNext: (recurrence?: RecurrenceRule) => void;
  onBack: () => void;
}

export default function Step9Recurrence({ onNext, onBack }: Step9RecurrenceProps) {
  const [hasRecurrence, setHasRecurrence] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const handleNext = () => {
    if (hasRecurrence) {
      const rule: RecurrenceRule = {
        type: recurrenceType
      };
      
      if (recurrenceType === 'weekly' || recurrenceType === 'custom') {
        rule.daysOfWeek = selectedDays;
      }
      
      onNext(rule);
    } else {
      onNext(undefined);
    }
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const daysOfWeek = [
    { value: 0, label: 'Вс', short: 'В' },
    { value: 1, label: 'Пн', short: 'П' },
    { value: 2, label: 'Вт', short: 'В' },
    { value: 3, label: 'Ср', short: 'С' },
    { value: 4, label: 'Чт', short: 'Ч' },
    { value: 5, label: 'Пт', short: 'П' },
    { value: 6, label: 'Сб', short: 'С' }
  ];

  return (
    <WizardSlide
      icon="🔁"
      title="Повторение"
      description="Настройте повторение задачи (необязательно)"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton
            variant="secondary"
            onClick={onBack}
          >
            Назад
          </GradientButton>
          <GradientButton
            onClick={handleNext}
          >
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <div
          onClick={() => setHasRecurrence(!hasRecurrence)}
          style={{
            padding: '16px',
            borderRadius: '12px',
            border: `2px solid ${hasRecurrence ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
            backgroundColor: hasRecurrence ? 'var(--tg-theme-secondary-bg-color)' : 'transparent',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
            {hasRecurrence ? '✓' : '🔁'}
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '500',
            color: 'var(--tg-theme-text-color)'
          }}>
            {hasRecurrence ? 'Повторение включено' : 'Без повторения'}
          </div>
        </div>

        {hasRecurrence && (
          <>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--tg-theme-text-color)',
                marginBottom: '12px'
              }}>
                Тип повторения
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {([
                  { type: 'daily' as const, label: 'Ежедневно', icon: '📅' },
                  { type: 'weekly' as const, label: 'Еженедельно', icon: '📆' },
                  { type: 'monthly' as const, label: 'Ежемесячно', icon: '🗓️' }
                ]).map(({ type, label, icon }) => (
                  <WizardCard
                    key={type}
                    icon={icon}
                    title={label}
                    selected={recurrenceType === type}
                    onClick={() => setRecurrenceType(type)}
                  />
                ))}
              </div>
            </div>

            {(recurrenceType === 'weekly' || recurrenceType === 'custom') && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--tg-theme-text-color)',
                  marginBottom: '12px'
                }}>
                  Дни недели
                </label>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  {daysOfWeek.map(({ value, label, short }) => (
                    <button
                      key={value}
                      onClick={() => toggleDay(value)}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '22px',
                        border: 'none',
                        background: selectedDays.includes(value)
                          ? 'var(--tg-theme-button-color)'
                          : 'var(--tg-theme-secondary-bg-color)',
                        color: selectedDays.includes(value)
                          ? 'var(--tg-theme-button-text-color)'
                          : 'var(--tg-theme-text-color)',
                        fontSize: '14px',
                        fontWeight: selectedDays.includes(value) ? '600' : '400',
                        cursor: 'pointer'
                      }}
                    >
                      {short}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </WizardSlide>
  );
}

