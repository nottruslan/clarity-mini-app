import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step4DateProps {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  onNext: (date: number) => void;
  onBack: () => void;
  initialDate?: number;
}

// Функция для форматирования даты в YYYY-MM-DD в локальном времени
const formatDateToInput = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Step4Date({ type, amount, category, onNext, onBack, initialDate }: Step4DateProps) {
  // Используем локальное время для инициализации, чтобы избежать проблем с часовыми поясами
  const [date, setDate] = useState(
    initialDate ? formatDateToInput(initialDate) : formatDateToInput(Date.now())
  );

  const handleNext = () => {
    // Создаем дату в локальном времени, чтобы избежать проблем с часовыми поясами
    const [year, month, day] = date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    // Устанавливаем время на начало дня (00:00:00) в локальном времени
    selectedDate.setHours(0, 0, 0, 0);
    const timestamp = selectedDate.getTime();
    console.log('[Step4Date] handleNext - Date selected:', {
      input: date,
      year,
      month,
      day,
      selectedDate: selectedDate.toString(),
      timestamp,
      timestampDate: new Date(timestamp).toString()
    });
    onNext(timestamp);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <WizardSlide
      icon="📅"
      title="Дата"
      description="Выберите дату транзакции"
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
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px', 
        width: '100%',
        overflowX: 'hidden',
        touchAction: 'pan-y',
        alignItems: 'center'
      }}>
        <input
          type="date"
          className="wizard-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ 
            fontSize: '18px',
            width: '100%',
            maxWidth: '280px',
            boxSizing: 'border-box'
          }}
        />

        <div style={{
          padding: '20px',
          borderRadius: '16px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          marginTop: '8px'
        }}>
          <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '12px' }}>
            Сводка
          </div>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            {category}
          </div>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '700',
            color: type === 'income' ? '#4caf50' : '#f44336'
          }}>
            {type === 'income' ? '+' : '-'}{formatCurrency(amount)}
          </div>
        </div>
      </div>
    </WizardSlide>
  );
}
