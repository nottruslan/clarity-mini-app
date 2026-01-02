import { useState } from 'react';
import { Category, generateId } from '../../utils/storage';
import CategoryBottomSheet from './CategoryBottomSheet';
import CreateCategoryWizard from './CreateCategoryWizard';

interface CategoriesViewProps {
  categories: Category[];
  onCategoryAdd: (category: Category) => Promise<void>;
  onCategoryUpdate: (id: string, updates: Partial<Category>) => Promise<void>;
  onCategoryDelete: (id: string, newCategoryName?: string) => Promise<void>;
  onCategoryMoveUp: (id: string) => Promise<void>;
  onCategoryMoveDown: (id: string) => Promise<void>;
}

export default function CategoriesView({
  categories,
  onCategoryAdd,
  onCategoryUpdate,
  onCategoryDelete,
  onCategoryMoveUp,
  onCategoryMoveDown
}: CategoriesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  const incomeCategories = categories
    .filter(c => c.type === 'income')
    .sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });

  const expenseCategories = categories
    .filter(c => c.type === 'expense')
    .sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setShowCategorySheet(true);
  };

  const handleCreateCategory = async (categoryData: { type: 'income' | 'expense'; name: string; icon: string }) => {
    const newCategory: Category = {
      id: generateId(),
      name: categoryData.name,
      type: categoryData.type,
      color: categoryData.type === 'income' ? '#4caf50' : '#f44336',
      icon: categoryData.icon,
      order: categories.filter(c => c.type === categoryData.type).length
    };
    await onCategoryAdd(newCategory);
    setShowCreateWizard(false);
  };

  const getCategoryIndex = (category: Category, type: 'income' | 'expense') => {
    const typeCategories = type === 'income' ? incomeCategories : expenseCategories;
    return typeCategories.findIndex(c => c.id === category.id);
  };

  const canMoveUp = (category: Category) => {
    const index = getCategoryIndex(category, category.type);
    return index > 0;
  };

  const canMoveDown = (category: Category) => {
    const typeCategories = category.type === 'income' ? incomeCategories : expenseCategories;
    const index = getCategoryIndex(category, category.type);
    return index >= 0 && index < typeCategories.length - 1;
  };

  const CategoryList = ({ items, type }: { items: Category[]; type: 'income' | 'expense' }) => {
    if (items.length === 0) {
      return (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--tg-theme-hint-color)'
        }}>
          <div style={{ fontSize: '16px', marginBottom: '12px' }}>Категорий нет</div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: 'var(--tg-theme-secondary-bg-color)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--tg-theme-bg-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--tg-theme-secondary-bg-color)';
            }}
          >
            <span style={{ fontSize: '24px' }}>{category.icon || '📦'}</span>
            <span style={{
              flex: 1,
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--tg-theme-text-color)'
            }}>
              {category.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (showCreateWizard) {
    return (
      <CreateCategoryWizard
        onComplete={handleCreateCategory}
        onClose={() => setShowCreateWizard(false)}
      />
    );
  }

  return (
    <>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        gap: '24px',
        overflowY: 'auto'
      }}>
        {/* Кнопка добавить категорию */}
        <button
          onClick={() => setShowCreateWizard(true)}
          className="tg-button"
          style={{ width: '100%' }}
        >
          + Добавить категорию
        </button>

        {/* Категории доходов */}
        <div>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '12px',
            color: 'var(--tg-theme-text-color)'
          }}>
            Категории доходов
          </div>
          <CategoryList items={incomeCategories} type="income" />
        </div>

        {/* Категории расходов */}
        <div>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '12px',
            color: 'var(--tg-theme-text-color)'
          }}>
            Категории расходов
          </div>
          <CategoryList items={expenseCategories} type="expense" />
        </div>
      </div>

      {showCategorySheet && selectedCategory && (
        <CategoryBottomSheet
          category={selectedCategory}
          onClose={() => {
            setShowCategorySheet(false);
            setSelectedCategory(null);
          }}
          onMoveUp={canMoveUp(selectedCategory) ? () => {
            onCategoryMoveUp(selectedCategory.id);
            setShowCategorySheet(false);
            setSelectedCategory(null);
          } : undefined}
          onMoveDown={canMoveDown(selectedCategory) ? () => {
            onCategoryMoveDown(selectedCategory.id);
            setShowCategorySheet(false);
            setSelectedCategory(null);
          } : undefined}
          onChangeIcon={(icon: string) => {
            onCategoryUpdate(selectedCategory.id, { icon });
            setShowCategorySheet(false);
            setSelectedCategory(null);
          }}
          onDelete={(categoryId: string, newCategoryName?: string) => {
            onCategoryDelete(categoryId, newCategoryName);
            setShowCategorySheet(false);
            setSelectedCategory(null);
          }}
          categories={categories}
          canMoveUp={canMoveUp(selectedCategory)}
          canMoveDown={canMoveDown(selectedCategory)}
        />
      )}
    </>
  );
}
