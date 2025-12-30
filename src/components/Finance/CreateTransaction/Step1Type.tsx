import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';

interface Step1TypeProps {
  onNext: (type: 'income' | 'expense') => void;
}

export default function Step1Type({ onNext }: Step1TypeProps) {
  const [type, setType] = useState<'income' | 'expense' | null>(null);

  return (
    <WizardSlide
      icon="💰"
      title="Тип транзакции"
      description="Выберите тип транзакции"
      actions={
        <GradientButton
          onClick={() => type && onNext(type)}
          disabled={!type}
        >
          Продолжить
        </GradientButton>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <WizardCard
          icon="💰"
          title="Доход"
          description="Получение денег"
          selected={type === 'income'}
          onClick={() => setType('income')}
        />
        <WizardCard
          icon="💸"
          title="Расход"
          description="Трата денег"
          selected={type === 'expense'}
          onClick={() => setType('expense')}
        />
      </div>
    </WizardSlide>
  );
}
