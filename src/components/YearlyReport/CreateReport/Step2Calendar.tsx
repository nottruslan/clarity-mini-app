import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step2CalendarProps {
  onNext: (events: string[]) => void;
  onBack: () => void;
  initialEvents?: string[];
}

export default function Step2Calendar({ onNext, onBack, initialEvents = [] }: Step2CalendarProps) {
  const [events, setEvents] = useState<string[]>(initialEvents);
  const [currentEvent, setCurrentEvent] = useState('');

  const handleAdd = () => {
    if (currentEvent.trim()) {
      setEvents([...events, currentEvent.trim()]);
      setCurrentEvent('');
    }
  };

  const handleRemove = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  return (
    <WizardSlide
      icon="📆"
      title="Важные события"
      description="Запишите важные события прошедшего года"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(events)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="wizard-input"
            placeholder="Важное событие, встреча, проект..."
            value={currentEvent}
            onChange={(e) => setCurrentEvent(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAdd();
              }
            }}
            style={{ flex: 1, marginTop: 0 }}
          />
          <button
            className="tg-button"
            onClick={handleAdd}
            style={{ minWidth: '80px' }}
          >
            Добавить
          </button>
        </div>
        {events.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {events.map((event, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                  borderRadius: '8px'
                }}
              >
                <span style={{ fontSize: '14px', flex: 1 }}>{event}</span>
                <button
                  onClick={() => handleRemove(index)}
                  style={{
                    padding: '4px 8px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--tg-theme-destructive-text-color)',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </WizardSlide>
  );
}

