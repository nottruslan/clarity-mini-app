import { useState, useRef } from 'react';
import { Category } from '../../../utils/storage';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';
import CategoryBottomSheet from '../CategoryBottomSheet';

interface Step3CategoryProps {
  type: 'income' | 'expense';
  categories: Category[];
  onNext: (category: string) => void;
  onBack: () => void;
  onCreateCategory: (name: string, icon?: string) => void;
  onDeleteCategory?: (categoryId: string, newCategoryName?: string) => void;
  onUpdateCategory?: (categoryId: string, updates: Partial<Category>) => void;
  onMoveCategoryUp?: (categoryId: string) => void;
  onMoveCategoryDown?: (categoryId: string) => void;
  initialCategory?: string;
}

export default function Step3Category({ 
  type, 
  categories, 
  onNext, 
  onBack,
  onCreateCategory,
  onDeleteCategory,
  onUpdateCategory,
  onMoveCategoryUp,
  onMoveCategoryDown,
  initialCategory
}: Step3CategoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [menuCategory, setMenuCategory] = useState<Category | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const filteredCategories = categories
    .filter(c => c.type === type)
    .sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });

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

  const getCategoryIcon = (category: Category) => {
    if (category.icon) {
      return category.icon;
    }
    // Fallback для старых категорий без иконки
    return type === 'income' ? '💰' : '💸';
  };

  // Вычисляем индексы для меню категории
  const menuCategoryIndex = menuCategory ? filteredCategories.findIndex(c => c.id === menuCategory.id) : -1;
  const canMoveUpMenu = menuCategoryIndex > 0;
  const canMoveDownMenu = menuCategoryIndex >= 0 && menuCategoryIndex < filteredCategories.length - 1;

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
                    icon={getCategoryIcon(category)}
                    title={category.name}
                    selected={selectedCategory === category.name}
                    onClick={() => setSelectedCategory(category.name)}
                  />
                </div>
                {(onDeleteCategory || onMoveCategoryUp || onMoveCategoryDown || onUpdateCategory) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuCategory(category);
                      setShowMenu(true);
                    }}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--tg-theme-hint-color)',
                      fontSize: '20px',
                      fontWeight: '400',
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
                      e.currentTarget.style.backgroundColor = 'var(--tg-theme-secondary-bg-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    ⋯
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
      
      {showMenu && menuCategory && (
        <CategoryBottomSheet
          key={menuCategory.id}
          category={menuCategory}
          onClose={() => {
            setShowMenu(false);
            setMenuCategory(null);
          }}
          onMoveUp={canMoveUpMenu && onMoveCategoryUp ? () => {
            onMoveCategoryUp(menuCategory.id);
            setShowMenu(false);
            setMenuCategory(null);
          } : undefined}
          onMoveDown={canMoveDownMenu && onMoveCategoryDown ? () => {
            onMoveCategoryDown(menuCategory.id);
            setShowMenu(false);
            setMenuCategory(null);
          } : undefined}
          onChangeIcon={onUpdateCategory ? () => {
            // TODO: открыть emoji picker для изменения иконки
            setShowMenu(false);
            setMenuCategory(null);
          } : undefined}
          onDelete={onDeleteCategory ? () => {
            // TODO: показать диалог выбора новой категории для транзакций
            // Пока просто удаляем
            onDeleteCategory(menuCategory.id);
            setShowMenu(false);
            setMenuCategory(null);
          } : undefined}
          canMoveUp={canMoveUpMenu}
          canMoveDown={canMoveDownMenu}
        />
      )}
    </WizardSlide>
  );
}
