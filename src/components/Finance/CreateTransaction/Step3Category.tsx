import { useState, useRef } from 'react';
import { Category } from '../../../utils/storage';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';

interface Step3CategoryProps {
  type: 'income' | 'expense';
  categories: Category[];
  onNext: (category: string) => void;
  onBack: () => void;
  onCreateCategory: (name: string) => void;
}

export default function Step3Category({ 
  type, 
  categories, 
  onNext, 
  onBack,
  onCreateCategory 
}: Step3CategoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCategories = categories.filter(c => c.type === type);

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      inputRef.current?.blur();
      onCreateCategory(newCategoryName.trim());
      setSelectedCategory(newCategoryName.trim());
      setShowCreateForm(false);
      setNewCategoryName('');
    }
  };

  const handleNext = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (selectedCategory) {
      onNext(selectedCategory);
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    // Простая логика для иконок категорий
    const iconMap: Record<string, string> = {
      'Зарплата': '💰',
      'Подарки': '🎁',
      'Еда': '🍔',
      'Транспорт': '🚗',
      'Развлечения': '🎬',
      'Здоровье': '🏥',
      'Покупки': '🛍️'
    };
    return iconMap[categoryName] || (type === 'income' ? '💰' : '💸');
  };

  return (
    <WizardSlide
      icon="📂"
      title="Категория"
      description="Выберите или создайте категорию"
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {!showCreateForm ? (
          <>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              maxHeight: '400px',
              overflowY: 'auto' as const,
              WebkitOverflowScrolling: 'touch' as any
            }}>
              {filteredCategories.map((category) => (
                <WizardCard
                  key={category.id}
                  icon={getCategoryIcon(category.name)}
                  title={category.name}
                  selected={selectedCategory === category.name}
                  onClick={() => setSelectedCategory(category.name)}
                />
              ))}
            </div>

            <WizardCard
              icon="+"
              title="Создать категорию"
              description="Добавить новую категорию"
              selected={false}
              onClick={() => setShowCreateForm(true)}
            />
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              ref={inputRef}
              type="text"
              className="wizard-input"
              placeholder="Название категории"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newCategoryName.trim()) {
                  handleCreateCategory();
                }
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <GradientButton
                variant="secondary"
                onClick={() => {
                  inputRef.current?.blur();
                  setShowCreateForm(false);
                  setNewCategoryName('');
                }}
              >
                Отмена
              </GradientButton>
              <GradientButton
                onClick={handleCreateCategory}
                disabled={!newCategoryName.trim()}
              >
                Создать
              </GradientButton>
            </div>
          </div>
        )}
      </div>
    </WizardSlide>
  );
}
