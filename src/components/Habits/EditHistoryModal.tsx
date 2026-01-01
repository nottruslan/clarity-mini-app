import { useState, useEffect, useRef } from 'react';
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
  const sheetRef = useRef<HTMLDivElement>(null);

  // Анимация появления
  useEffect(() => {
    if (sheetRef.current) {
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.style.transform = 'translateY(0)';
        }
      }, 10);
    }
  }, []);

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

  const handleClose = () => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(100%)';
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'flex-end',
      zIndex: 10000,
      animation: 'fadeIn 0.2s ease-out'
    }} onClick={(e) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    }}>
      <div 
        ref={sheetRef}
        style={{
          background: 'var(--tg-theme-bg-color)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '8px 0',
          paddingBottom: isKeyboardVisible ? '8px' : 'calc(8px + env(safe-area-inset-bottom))',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          transform: 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          WebkitOverflowScrolling: 'touch'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
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

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px 16px',
          borderBottom: '1px solid var(--tg-theme-secondary-bg-color)'
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
            onClick={handleClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              background: 'var(--tg-theme-secondary-bg-color)',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--tg-theme-text-color)'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px 16px' }}>
          <div>
            <label style={{
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
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
                  fontSize: '12px',
                  color: 'var(--tg-theme-hint-color)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
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
                  <span style={{ textTransform: 'none' }}>Выполнено</span>
                </label>
              </div>

              {completed && habit.unit && (
                <div>
                  <label style={{
                    fontSize: '12px',
                    color: 'var(--tg-theme-hint-color)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
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

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  className="tg-button"
                  onClick={handleSave}
                  style={{ flex: 1, minWidth: '100px' }}
                >
                  Сохранить
                </button>
                {habit.history[selectedDate] && (
                  <button
                    onClick={handleDelete}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: '1px solid var(--tg-theme-destructive-text-color)',
                      background: 'transparent',
                      color: 'var(--tg-theme-destructive-text-color)',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      minHeight: '36px',
                      minWidth: '60px',
                      flex: 1,
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    Удалить
                  </button>
                )}
                <button
                  onClick={handleClose}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: '1px solid var(--tg-theme-button-color)',
                    background: 'transparent',
                    color: 'var(--tg-theme-button-color)',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    minHeight: '44px',
                    minWidth: '60px',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.opacity = '0.7';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  Отмена
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

