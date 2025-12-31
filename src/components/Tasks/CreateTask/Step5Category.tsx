import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';
import { TaskCategory } from '../../../utils/storage';

interface Step5CategoryProps {
  categories: TaskCategory[];
  onNext: (categoryId?: string) => void;
  onBack: () => void;
}

export default function Step5Category({ categories, onNext, onBack }: Step5CategoryProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);

  const handleNext = () => {
    onNext(selectedCategoryId);
  };

  return (
    <WizardSlide
      icon="📁"
      title="Категория"
      description="Выберите категорию (необязательно)"
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <WizardCard
          icon="📝"
          title="Без категории"
          description="Задача без категории"
          selected={selectedCategoryId === undefined}
          onClick={() => setSelectedCategoryId(undefined)}
        />
        {categories.map((category) => (
          <WizardCard
            key={category.id}
            icon={category.icon}
            title={category.name}
            description={`Категория: ${category.name}`}
            selected={selectedCategoryId === category.id}
            onClick={() => setSelectedCategoryId(category.id)}
          />
        ))}
      </div>
    </WizardSlide>
  );
}

