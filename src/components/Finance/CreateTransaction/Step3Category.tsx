import { useState } from 'react';
import { Category } from '../../../utils/storage';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';
import CreateCategoryWizard from '../CreateCategoryWizard';

interface Step3CategoryProps {
  type: 'income' | 'expense';
  categories: Category[];
  onNext: (category: string) => void;
  onBack: () => void;
  onCreateCategory: (categoryData: { type: 'income' | 'expense'; name: string; icon: string }) => void;
  initialCategory?: string;
}

export default function Step3Category({ 
  type, 
  categories, 
  onNext, 
  onBack,
  onCreateCategory,
  initialCategory
}: Step3CategoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  const filteredCategories = categories
    .filter(c => c.type === type)
    .sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });

  const handleNext = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (selectedCategory) {
      onNext(selectedCategory);
    }
  };

  const handleCreateCategory = async (categoryData: { type: 'income' | 'expense'; name: string; icon: string }) => {
    await onCreateCategory(categoryData);
    setSelectedCategory(categoryData.name);
    setShowCreateWizard(false);
  };

  const getCategoryIcon = (category: Category) => {
    if (category.icon) {
      return category.icon;
    }
    // Fallback для старых категорий без иконки
    return type === 'income' ? '💰' : '💸';
  };

  if (showCreateWizard) {
    return (
      <CreateCategoryWizard
        onComplete={handleCreateCategory}
        onClose={() => setShowCreateWizard(false)}
        initialType={type}
      />
    );
  }

  return (
    <WizardSlide
      icon="📂"
      title="Категория"
      description="Выберите категорию"
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
            disabled={!selectedCategory}
          >
            Продолжить
          </GradientButton>
        </div>
      }
    >
      {filteredCategories.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '16px',
            color: 'var(--tg-theme-hint-color)'
          }}>
            Категорий нет
          </div>
          <GradientButton
            onClick={() => setShowCreateWizard(true)}
          >
            Создать категорию
          </GradientButton>
        </div>
      ) : (
        <>
          {filteredCategories.map((category) => (
            <WizardCard
              key={category.id}
              icon={getCategoryIcon(category)}
              title={category.name}
              selected={selectedCategory === category.name}
              onClick={() => setSelectedCategory(category.name)}
            />
          ))}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '12px'
          }}>
            <GradientButton
              variant="secondary"
              onClick={() => setShowCreateWizard(true)}
            >
              Создать категорию
            </GradientButton>
          </div>
        </>
      )}
    </WizardSlide>
  );
}
