import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';

interface Step4FrequencyProps {
  name: string;
  onNext: (frequency: {
    type: 'daily' | 'weekly' | 'custom' | 'flexible';
    customDays?: number[];
    timesPerDay?: number;
    timesPerWeek?: number;
    timesPerMonth?: number;
  }) => void;
  onBack: () => void;
}

const weekDays = [
  { id: 0, name: 'Вс', fullName: 'Воскресенье' },
  { id: 1, name: 'Пн', fullName: 'Понедельник' },
  { id: 2, name: 'Вт', fullName: 'Вторник' },
  { id: 3, name: 'Ср', fullName: 'Среда' },
  { id: 4, name: 'Чт', fullName: 'Четверг' },
  { id: 5, name: 'Пт', fullName: 'Пятница' },
  { id: 6, name: 'Сб', fullName: 'Суббота' }
];

export default function Step4Frequency({ name, onNext, onBack }: Step4FrequencyProps) {
  const [frequencyType, setFrequencyType] = useState<'daily' | 'weekly' | 'custom' | 'flexible'>('daily');
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [timesPerDay, setTimesPerDay] = useState<number>(1);
  const [timesPerWeek, setTimesPerWeek] = useState<number>(1);

  const toggleDay = (dayId: number) => {
    setCustomDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId].sort()
    );
  };

  const handleNext = () => {
    const frequencyData: any = { type: frequencyType };
    
    if (frequencyType === 'custom') {
      frequencyData.customDays = customDays;
    } else if (frequencyType === 'flexible') {
      // Для гибкого графика можно выбрать один из вариантов
      // Здесь используем timesPerWeek как основной
      frequencyData.timesPerWeek = timesPerWeek;
    } else if (frequencyType === 'daily' && timesPerDay > 1) {
      frequencyData.timesPerDay = timesPerDay;
    }
    
    onNext(frequencyData);
  };

  return (
    <WizardSlide
      icon="📅"
      title="Частота выполнения"
      description={`Как часто вы хотите отслеживать "${name}"?`}
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
            disabled={frequencyType === 'custom' && customDays.length === 0}
          >
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <WizardCard
          icon="📅"
          title="Ежедневно"
          description="Каждый день"
          selected={frequencyType === 'daily'}
          onClick={() => setFrequencyType('daily')}
        />
        
        {frequencyType === 'daily' && (
          <div style={{ padding: '0 8px', marginTop: '-8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px', display: 'block' }}>
              Количество раз в день:
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setTimesPerDay(Math.max(1, timesPerDay - 1))}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: '2px solid var(--tg-theme-secondary-bg-color)',
                  background: 'var(--tg-theme-bg-color)',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                −
              </button>
              <span style={{ fontSize: '18px', fontWeight: '600', minWidth: '40px', textAlign: 'center' }}>
                {timesPerDay}
              </span>
              <button
                onClick={() => setTimesPerDay(timesPerDay + 1)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: '2px solid var(--tg-theme-secondary-bg-color)',
                  background: 'var(--tg-theme-bg-color)',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
          </div>
        )}

        <WizardCard
          icon="📆"
          title="Еженедельно"
          description="Раз в неделю"
          selected={frequencyType === 'weekly'}
          onClick={() => setFrequencyType('weekly')}
        />

        <WizardCard
          icon="🗓️"
          title="Конкретные дни"
          description="Выберите дни недели"
          selected={frequencyType === 'custom'}
          onClick={() => setFrequencyType('custom')}
        />

        {frequencyType === 'custom' && (
          <div style={{ padding: '0 8px', marginTop: '-8px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: '8px',
              marginTop: '12px'
            }}>
              {weekDays.map(day => (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    border: `2px solid ${customDays.includes(day.id) ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
                    background: customDays.includes(day.id) 
                      ? 'rgba(51, 144, 236, 0.1)' 
                      : 'var(--tg-theme-bg-color)',
                    fontSize: '12px',
                    fontWeight: customDays.includes(day.id) ? '600' : '400',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px'
                  }}
                  title={day.fullName}
                >
                  <span>{day.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <WizardCard
          icon="🔄"
          title="Гибкий график"
          description="X раз в неделю/месяц"
          selected={frequencyType === 'flexible'}
          onClick={() => setFrequencyType('flexible')}
        />

        {frequencyType === 'flexible' && (
          <div style={{ padding: '0 8px', marginTop: '-8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px', display: 'block' }}>
              Количество раз в неделю:
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setTimesPerWeek(Math.max(1, timesPerWeek - 1))}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: '2px solid var(--tg-theme-secondary-bg-color)',
                  background: 'var(--tg-theme-bg-color)',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                −
              </button>
              <span style={{ fontSize: '18px', fontWeight: '600', minWidth: '40px', textAlign: 'center' }}>
                {timesPerWeek}
              </span>
              <button
                onClick={() => setTimesPerWeek(timesPerWeek + 1)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: '2px solid var(--tg-theme-secondary-bg-color)',
                  background: 'var(--tg-theme-bg-color)',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </WizardSlide>
  );
}

