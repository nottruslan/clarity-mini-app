import { useState } from 'react';
import { Category } from '../../../utils/storage';

interface Step3CategoryProps {
  type: 'income' | 'expense';
  amount: number;
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

  const filteredCategories = categories.filter(c => c.type === type);

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      onCreateCategory(newCategoryName.trim());
      setSelectedCategory(newCategoryName.trim());
      setShowCreateForm(false);
      setNewCategoryName('');
    }
  };

  return (
    <div className="form-slide">
      <h2 className="form-title">Категория</h2>
      <p className="form-subtitle">Выберите или создайте категорию</p>
      
      {!showCreateForm ? (
        <>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            marginBottom: '16px',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: `2px solid ${selectedCategory === category.name ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
                  backgroundColor: selectedCategory === category.name 
                    ? 'var(--tg-theme-button-color)' 
                    : 'var(--tg-theme-bg-color)',
                  color: selectedCategory === category.name 
                    ? 'var(--tg-theme-button-text-color)' 
                    : 'var(--tg-theme-text-color)',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minHeight: '56px',
                  textAlign: 'left'
                }}
              >
                {category.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '10px',
              border: '2px dashed var(--tg-theme-button-color)',
              backgroundColor: 'transparent',
              color: 'var(--tg-theme-button-color)',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '16px',
              minHeight: '56px'
            }}
          >
            + Создать категорию
          </button>
        </>
      ) : (
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Название категории"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newCategoryName.trim()) {
                handleCreateCategory();
              }
            }}
            autoFocus
          />
          <button
            onClick={handleCreateCategory}
            className="tg-button"
            disabled={!newCategoryName.trim()}
            style={{ width: '100%', marginTop: '12px' }}
          >
            Создать
          </button>
          <button
            onClick={() => {
              setShowCreateForm(false);
              setNewCategoryName('');
            }}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '8px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'var(--tg-theme-secondary-bg-color)',
              color: 'var(--tg-theme-text-color)',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Отмена
          </button>
        </div>
      )}

      <div className="form-actions">
        <button 
          className="tg-button" 
          onClick={onBack}
          style={{ 
            backgroundColor: 'var(--tg-theme-secondary-bg-color)',
            color: 'var(--tg-theme-text-color)'
          }}
        >
          Назад
        </button>
        <button 
          className="tg-button" 
          onClick={() => selectedCategory && onNext(selectedCategory)}
          disabled={!selectedCategory}
        >
          Далее
        </button>
      </div>
    </div>
  );
}

