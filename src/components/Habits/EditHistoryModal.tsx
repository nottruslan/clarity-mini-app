import { useState, useEffect } from 'react';
import { Habit } from '../../utils/storage';
import MonthCalendar from './MonthCalendar';

interface EditHistoryModalProps {
  habit: Habit;
  onSave: (history: Habit['history']) => void;
  onClose: () => void;
  initialDate?: string;
}

export default function EditHistoryModal({ habit, onSave, onClose, initialDate }: EditHistoryModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || '');
  const [value, setValue] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);

  // Инициализируем значения при открытии модального окна с initialDate
  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
      const historyEntry = habit.history[initialDate];
      if (historyEntry) {
        setCompleted(historyEntry.completed);
        setValue(historyEntry.value?.toString() || '');
      } else {
        setCompleted(false);
        setValue('');
      }
    }
  }, [initialDate, habit.history]);

  const handleDateSelect = (date: string, existingValue?: number) => {
    setSelectedDate(date);
    const historyEntry = habit.history[date];
    if (historyEntry) {
      setCompleted(historyEntry.completed);
      setValue(historyEntry.value?.toString() || '');
    } else {
      setCompleted(false);
      setValue(existingValue?.toString() || '');
    }
  };

  const handleSave = () => {
    if (!selectedDate) return;

    const newHistory = { ...habit.history };
    
    if (completed) {
      newHistory[selectedDate] = {
        completed: true,
        value: habit.unit && value ? parseFloat(value) : undefined
      };
    } else {
      delete newHistory[selectedDate];
    }

    onSave(newHistory);
    onClose();
  };

  const handleDelete = () => {
    if (!selectedDate) return;

    const newHistory = { ...habit.history };
    delete newHistory[selectedDate];
    onSave(newHistory);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--tg-theme-bg-color)',
        borderRadius: '16px',
        padding: '20px',
        maxWidth: '400px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--tg-theme-text-color)'
          }}>
            Редактировать историю
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: 'var(--tg-theme-secondary-bg-color)',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              fontSize: '14px',
              color: 'var(--tg-theme-hint-color)',
              marginBottom: '8px',
              display: 'block'
            }}>
              Выберите дату
            </label>
            <MonthCalendar 
              habit={habit}
              onDateClick={handleDateSelect}
            />
          </div>

          {selectedDate && (
            <>
              <div>
                <label style={{
                  fontSize: '14px',
                  color: 'var(--tg-theme-hint-color)',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <input
                    type="checkbox"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span>Выполнено</span>
                </label>
              </div>

              {completed && habit.unit && (
                <div>
                  <label style={{
                    fontSize: '14px',
                    color: 'var(--tg-theme-hint-color)',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    Значение ({habit.unit})
                  </label>
                  <input
                    type="number"
                    className="wizard-input"
                    placeholder="Введите значение"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  className="tg-button"
                  onClick={handleSave}
                  style={{ flex: 1 }}
                >
                  Сохранить
                </button>
                {habit.history[selectedDate] && (
                  <button
                    className="tg-button"
                    onClick={handleDelete}
                    style={{
                      flex: 1,
                      background: 'var(--tg-theme-destructive-text-color)',
                      color: 'white'
                    }}
                  >
                    Удалить
                  </button>
                )}
                <button
                  className="tg-button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    background: 'var(--tg-theme-secondary-bg-color)',
                    color: 'var(--tg-theme-text-color)'
                  }}
                >
                  Отмена
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

