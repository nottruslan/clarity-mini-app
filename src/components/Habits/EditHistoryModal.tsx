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
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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

  // Отслеживаем открытие клавиатуры
  useEffect(() => {
    let keyboardVisible = false;
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        keyboardVisible = viewportHeight < windowHeight - 150;
        setIsKeyboardVisible(keyboardVisible);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      handleViewportChange();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

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
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 10000,
      paddingTop: 'env(safe-area-inset-top)'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--tg-theme-bg-color)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        padding: '8px 0 20px',
        paddingBottom: isKeyboardVisible ? '20px' : 'calc(20px + env(safe-area-inset-bottom))',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)'
      }} onClick={(e) => e.stopPropagation()}>
        {/* Индикатор */}
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: 'var(--tg-theme-hint-color)',
            borderRadius: '2px',
            margin: '8px auto 16px',
            opacity: 0.3
          }}
        />

        <div style={{ padding: '0 20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'var(--tg-theme-text-color)',
              margin: 0
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)',
              marginBottom: '8px',
              display: 'block',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
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
                    fontSize: '12px',
                    color: 'var(--tg-theme-hint-color)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
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
                    fontSize: '12px',
                    color: 'var(--tg-theme-hint-color)',
                    marginBottom: '8px',
                    display: 'block',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
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
    </div>
  );
}

