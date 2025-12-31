import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step4TimeProps {
  onNext: (startTime: number, duration: number) => void;
  onBack: () => void;
  initialStartTime?: number;
  initialDuration?: number;
}

const minutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export default function Step4Time({ onNext, onBack, initialStartTime, initialDuration }: Step4TimeProps) {
  const initialStartTimeStr = initialStartTime ? minutesToTimeString(initialStartTime) : '09:00';
  const initialDurationStr = initialDuration ? initialDuration.toString() : '60';
  const [hasTime, setHasTime] = useState(!!initialStartTime && !!initialDuration);
  const [startTime, setStartTime] = useState(initialStartTimeStr);
  const [duration, setDuration] = useState(initialDurationStr);

  const handleNext = () => {
    if (hasTime) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const startMinutes = hours * 60 + minutes;
      const durationMinutes = parseInt(duration);
      onNext(startMinutes, durationMinutes);
    } else {
      onNext(0, 0);
    }
  };

  const presetDurations = [
    { label: '15 мин', value: '15' },
    { label: '30 мин', value: '30' },
    { label: '1 час', value: '60' },
    { label: '2 часа', value: '120' },
    { label: '3 часа', value: '180' },
    { label: '4 часа', value: '240' }
  ];

  return (
    <WizardSlide
      icon="⏰"
      title="Время"
      description="Установите время начала и длительность (необязательно)"
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
          onClick={() => setHasTime(!hasTime)}
          style={{
            padding: '16px',
            borderRadius: '12px',
            border: `2px solid ${hasTime ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
            backgroundColor: hasTime ? 'var(--tg-theme-secondary-bg-color)' : 'transparent',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
            {hasTime ? '✓' : '⏰'}
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '500',
            color: 'var(--tg-theme-text-color)'
          }}>
            {hasTime ? 'Время установлено' : 'Установить время'}
          </div>
        </div>

        {hasTime && (
          <>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--tg-theme-text-color)',
                marginBottom: '8px'
              }}>
                Время начала
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--tg-theme-secondary-bg-color)',
                  backgroundColor: 'var(--tg-theme-bg-color)',
                  color: 'var(--tg-theme-text-color)',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--tg-theme-text-color)',
                marginBottom: '8px'
              }}>
                Длительность
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '12px'
              }}>
                {presetDurations.map(preset => (
                  <button
                    key={preset.value}
                    onClick={() => setDuration(preset.value)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      background: duration === preset.value
                        ? 'var(--tg-theme-button-color)'
                        : 'var(--tg-theme-secondary-bg-color)',
                      color: duration === preset.value
                        ? 'var(--tg-theme-button-text-color)'
                        : 'var(--tg-theme-text-color)',
                      fontSize: '14px',
                      fontWeight: duration === preset.value ? '600' : '400',
                      cursor: 'pointer'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="5"
                max="1440"
                step="5"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Минуты"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--tg-theme-secondary-bg-color)',
                  backgroundColor: 'var(--tg-theme-bg-color)',
                  color: 'var(--tg-theme-text-color)',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
          </>
        )}
      </div>
    </WizardSlide>
  );
}

