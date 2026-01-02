import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';

interface Step3StatusProps {
  title: string;
  onNext: (status: 'want-to-read' | 'reading' | 'completed' | 'paused' | 'abandoned') => void;
  onBack: () => void;
}

const statuses = [
  { id: 'want-to-read', name: 'Хочу прочитать', icon: '📖', color: '#2196f3' },
  { id: 'reading', name: 'Читаю', icon: '📘', color: '#ff9800' },
  { id: 'completed', name: 'Прочитано', icon: '✅', color: '#4caf50' },
  { id: 'paused', name: 'На паузе', icon: '⏸️', color: '#ffc107' },
  { id: 'abandoned', name: 'Брошено', icon: '❌', color: '#f44336' }
] as const;

export default function Step3Status({ title, onNext, onBack }: Step3StatusProps) {
  const [selectedStatus, setSelectedStatus] = useState<'want-to-read' | 'reading' | 'completed' | 'paused' | 'abandoned'>('want-to-read');

  return (
    <WizardSlide
      icon="📊"
      title="Статус книги"
      description={`Какой статус у "${title}"?`}
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton
            variant="secondary"
            onClick={onBack}
          >
            Назад
          </GradientButton>
          <GradientButton
            onClick={() => onNext(selectedStatus)}
          >
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '8px', 
          width: '100%',
          maxWidth: '400px'
        }}
      >
        {statuses.map((status) => (
          <WizardCard
            key={status.id}
            icon={status.icon}
            title={status.name}
            selected={selectedStatus === status.id}
            onClick={() => setSelectedStatus(status.id)}
          />
        ))}
      </div>
    </WizardSlide>
  );
}

