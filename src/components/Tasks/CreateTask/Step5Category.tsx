import { useState, useRef } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import WizardCard from '../../Wizard/WizardCard';
import GradientButton from '../../Wizard/GradientButton';
import { TaskCategory, generateId } from '../../../utils/storage';

interface Step5CategoryProps {
  categories: TaskCategory[];
  onNext: (categoryId?: string, newCategory?: TaskCategory) => void;
  onBack: () => void;
  initialValue?: string;
}

const DEFAULT_COLORS = [
  '#3390ec', '#ff6b35', '#4caf50', '#9c27b0', 
  '#ff9800', '#607d8b', '#e91e63', '#00bcd4', '#9e9e9e'
];

const DEFAULT_ICONS = ['📁', '💼', '👤', '💚', '📚', '👨‍👩‍👧‍👦', '🏠', '🎨', '⚽', '📝'];

export default function Step5Category({ categories, onNext, onBack, initialValue }: Step5CategoryProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(initialValue);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📁');
  const [newCategoryColor, setNewCategoryColor] = useState(DEFAULT_COLORS[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: TaskCategory = {
        id: generateId(),
        name: newCategoryName.trim(),
        icon: newCategoryIcon,
        color: newCategoryColor
      };
      setSelectedCategoryId(newCategory.id);
      setShowCreateForm(false);
      setNewCategoryName('');
      // Не вызываем onNext сразу, чтобы пользователь мог продолжить wizard
      // onNext вызовется при нажатии кнопки "Продолжить" с уже выбранной категорией
    }
  };

  const handleCreateAndContinue = () => {
    if (showCreateForm && newCategoryName.trim()) {
      const newCategory: TaskCategory = {
        id: generateId(),
        name: newCategoryName.trim(),
        icon: newCategoryIcon,
        color: newCategoryColor
      };
      onNext(newCategory.id, newCategory);
    } else {
      handleNext();
    }
  };

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
            onClick={showCreateForm ? handleCreateAndContinue : handleNext}
            disabled={showCreateForm && !newCategoryName.trim()}
          >
            {showCreateForm ? 'Создать и продолжить' : 'Продолжить'}
          </GradientButton>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {!showCreateForm ? (
          <>
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
            <WizardCard
              icon="➕"
              title="Создать категорию"
              description="Добавить новую категорию"
              selected={false}
              onClick={() => {
                setShowCreateForm(true);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
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
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--tg-theme-text-color)',
                marginBottom: '8px'
              }}>
                Иконка
              </label>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {DEFAULT_ICONS.slice(0, 10).map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewCategoryIcon(icon)}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      border: `2px solid ${newCategoryIcon === icon ? newCategoryColor : 'transparent'}`,
                      background: newCategoryIcon === icon 
                        ? `${newCategoryColor}20` 
                        : 'var(--tg-theme-secondary-bg-color)',
                      fontSize: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--tg-theme-text-color)',
                marginBottom: '8px'
              }}>
                Цвет
              </label>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {DEFAULT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewCategoryColor(color)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: `3px solid ${newCategoryColor === color ? 'var(--tg-theme-text-color)' : 'transparent'}`,
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
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
            </div>
          </div>
        )}
      </div>
    </WizardSlide>
  );
}

