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
  onDeleteCategory?: (categoryId: string) => void;
}

// Дефолтные категории (по именам)
const DEFAULT_CATEGORY_NAMES = [
  'Зарплата', 'Подарки', 'Инвестиции', 'Фриланс', 'Прочее',
  'Еда', 'Транспорт', 'Развлечения', 'Здоровье', 'Покупки', 'Жилье', 'Образование'
];

const isDefaultCategory = (categoryName: string): boolean => {
  return DEFAULT_CATEGORY_NAMES.includes(categoryName);
};

export default function Step3Category({ 
  type, 
  categories, 
  onNext, 
  onBack,
  onCreateCategory,
  onDeleteCategory
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
      {!showCreateForm ? (
        <>
          {filteredCategories.map((category) => {
            const canDelete = !isDefaultCategory(category.name) && onDeleteCategory;
            
            return (
              <div
                key={category.id}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <div style={{ flex: 1, width: '100%' }}>
                  <WizardCard
                    icon={getCategoryIcon(category.name)}
                    title={category.name}
                    selected={selectedCategory === category.name}
                    onClick={() => setSelectedCategory(category.name)}
                  />
                </div>
                {canDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Удалить категорию "${category.name}"?`)) {
                        onDeleteCategory(category.id);
                      }
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (window.confirm(`Удалить категорию "${category.name}"?`)) {
                        onDeleteCategory(category.id);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                      color: 'var(--tg-theme-destructive-text-color)',
                      fontSize: '18px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      transition: 'all 0.2s',
                      flexShrink: 0,
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--tg-theme-destructive-text-color)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--tg-theme-secondary-bg-color)';
                      e.currentTarget.style.color = 'var(--tg-theme-destructive-text-color)';
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
          
          <WizardCard
            icon="+"
            title="Создать категорию"
            description="Добавить новую категорию"
            selected={false}
            onClick={() => setShowCreateForm(true)}
          />
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
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
    </WizardSlide>
  );
}
