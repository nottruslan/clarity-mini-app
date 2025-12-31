import { useState } from 'react';

interface TransferTaskModalProps {
  taskName: string;
  currentDate?: Date;
  onTransfer: (date: Date) => void;
  onClose: () => void;
}

export default function TransferTaskModal({
  taskName,
  currentDate,
  onTransfer,
  onClose
}: TransferTaskModalProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    if (currentDate) {
      return currentDate.toISOString().split('T')[0];
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const handleTransfer = () => {
    const date = new Date(selectedDate);
    date.setHours(12, 0, 0, 0); // Устанавливаем середину дня
    onTransfer(date);
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const quickSelectDate = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}
    >
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'var(--tg-theme-bg-color)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{
          margin: '0 0 16px 0',
          fontSize: '20px',
          fontWeight: '600',
          color: 'var(--tg-theme-text-color)'
        }}>
          Перенести задачу
        </h2>
        
        <p style={{
          margin: '0 0 20px 0',
          fontSize: '14px',
          color: 'var(--tg-theme-hint-color)'
        }}>
          {taskName}
        </p>

        {/* Быстрый выбор */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => quickSelectDate(0)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: selectedDate === today
                ? 'var(--tg-theme-button-color)'
                : 'var(--tg-theme-secondary-bg-color)',
              color: selectedDate === today
                ? 'var(--tg-theme-button-text-color)'
                : 'var(--tg-theme-text-color)',
              fontSize: '14px',
              fontWeight: selectedDate === today ? '600' : '400',
              cursor: 'pointer'
            }}
          >
            Сегодня
          </button>
          <button
            onClick={() => quickSelectDate(1)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: selectedDate === tomorrowStr
                ? 'var(--tg-theme-button-color)'
                : 'var(--tg-theme-secondary-bg-color)',
              color: selectedDate === tomorrowStr
                ? 'var(--tg-theme-button-text-color)'
                : 'var(--tg-theme-text-color)',
              fontSize: '14px',
              fontWeight: selectedDate === tomorrowStr ? '600' : '400',
              cursor: 'pointer'
            }}
          >
            Завтра
          </button>
          <button
            onClick={() => quickSelectDate(7)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: 'var(--tg-theme-secondary-bg-color)',
              color: 'var(--tg-theme-text-color)',
              fontSize: '14px',
              fontWeight: '400',
              cursor: 'pointer'
            }}
          >
            Через неделю
          </button>
        </div>

        {/* Выбор даты */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--tg-theme-text-color)',
            marginBottom: '8px'
          }}>
            Выберите дату
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={today}
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

        {/* Кнопки действий */}
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              background: 'var(--tg-theme-secondary-bg-color)',
              color: 'var(--tg-theme-text-color)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Отмена
          </button>
          <button
            onClick={handleTransfer}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              background: 'var(--tg-theme-button-color)',
              color: 'var(--tg-theme-button-text-color)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Перенести
          </button>
        </div>
      </div>
    </div>
  );
}

