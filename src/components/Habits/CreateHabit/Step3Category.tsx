import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';

interface Step3CategoryProps {
  name: string;
  onNext: (category: string) => void;
  onBack: () => void;
}

const categories = [
  { id: 'health', name: 'Здоровье', icon: '💪', color: '#4caf50' },
  { id: 'fitness', name: 'Фитнес', icon: '🏃', color: '#2196f3' },
  { id: 'learning', name: 'Обучение', icon: '📚', color: '#ff9800' },
  { id: 'productivity', name: 'Продуктивность', icon: '⚡', color: '#9c27b0' },
  { id: 'mindfulness', name: 'Осознанность', icon: '🧘', color: '#00bcd4' },
  { id: 'social', name: 'Социальное', icon: '👥', color: '#e91e63' },
  { id: 'creative', name: 'Творчество', icon: '🎨', color: '#f44336' },
  { id: 'finance', name: 'Финансы', icon: '💰', color: '#4caf50' },
  { id: 'other', name: 'Прочее', icon: '⭐', color: '#9e9e9e' }
];

export default function Step3Category({ name, onNext, onBack }: Step3CategoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('health');

  return (
    <WizardSlide
      icon="📁"
      title="Выберите категорию"
      description={`В какой категории находится "${name}"?`}
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton
            variant="secondary"
            onClick={onBack}
          >
            Назад
          </GradientButton>
          <GradientButton
            onClick={() => onNext(selectedCategory)}
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
          gap: '12px', 
          width: '100%',
          maxWidth: '400px',
          overflow: 'hidden',
          touchAction: 'none'
        }}
        onClick={(e) => {
          // Предотвращаем всплытие событий
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          // Предотвращаем движение экрана
          e.stopPropagation();
        }}
      >
        {categories.map((category) => (
          <WizardCard
            key={category.id}
            icon={category.icon}
            title={category.name}
            selected={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
          />
        ))}
      </div>
    </WizardSlide>
  );
}

