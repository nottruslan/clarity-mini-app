import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step5DescriptionProps {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: number;
  onComplete: (description?: string) => void;
  onBack: () => void;
}

export default function Step5Description({ 
  type, 
  amount, 
  category, 
  date, 
  onComplete, 
  onBack 
}: Step5DescriptionProps) {
  const [description, setDescription] = useState('');

  const handleComplete = () => {
    onComplete(description.trim() || undefined);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <WizardSlide
      icon="📝"
      title="Описание"
      description="Добавьте описание (необязательно)"
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <textarea
          className="wizard-input"
          placeholder="Например: Зарплата за март"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{
            resize: 'none',
            fontFamily: 'inherit',
            minHeight: '100px'
          }}
        />

        <div style={{
          padding: '20px',
          borderRadius: '16px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)'
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
            color: type === 'income' ? '#4caf50' : '#f44336',
            marginBottom: '8px'
          }}>
            {type === 'income' ? '+' : '-'}{formatCurrency(amount)}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)' }}>
            {formatDate(date)}
          </div>
        </div>
      </div>
    </WizardSlide>
  );
}
