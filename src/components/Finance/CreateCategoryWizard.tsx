import { useState } from 'react';
import WizardContainer from '../Wizard/WizardContainer';
import WizardSlide from '../Wizard/WizardSlide';
import WizardCard from '../Wizard/WizardCard';
import GradientButton from '../Wizard/GradientButton';
import { sectionColors } from '../../utils/sectionColors';

interface CreateCategoryWizardProps {
  onComplete: (categoryData: { type: 'income' | 'expense'; name: string; icon: string }) => void;
  onClose: () => void;
  initialType?: 'income' | 'expense';
}

const categoryIcons = [
  '💰', '💸', '💵', '💴', '💶', '💷', '💳', '💹',
  '🏦', '📊', '📈', '📉', '💼', '🎁', '🛍️', '🛒',
  '🍔', '🍕', '🍖', '🍗', '🍝', '🍜', '🍛', '🍱',
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
  '🏥', '💊', '💉', '🏋️', '⛹️', '🤸', '🏃', '🚴',
  '📚', '✏️', '📝', '📖', '🎓', '🎯', '🎨', '🎬',
  '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏛️',
  '🎮', '🎲', '🎯', '🎳', '🎪', '🎭', '🎨', '🎬',
  '💡', '🔦', '🕯️', '🧯', '🛢️', '💸', '📦', '⭐'
];

export default function CreateCategoryWizard({ onComplete, onClose, initialType }: CreateCategoryWizardProps) {
  const [step, setStep] = useState(initialType ? 1 : 0);
  const [categoryType, setCategoryType] = useState<'income' | 'expense' | undefined>(initialType);
  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('💰');

  const handleTypeSelect = (type: 'income' | 'expense') => {
    setCategoryType(type);
    setStep(1);
  };

  const handleNameNext = () => {
    if (categoryName.trim()) {
      setStep(2);
    }
  };

  const handleIconComplete = () => {
    if (categoryType && categoryName.trim()) {
      onComplete({
        type: categoryType,
        name: categoryName.trim(),
        icon: selectedIcon
      });
    }
  };

  const handleBack = () => {
    if (step > (initialType ? 1 : 0)) {
      setStep(step - 1);
    } else if (step === (initialType ? 1 : 0)) {
      onClose();
    }
  };

  const colors = sectionColors.finance;

  return (
    <WizardContainer
      currentStep={step + 1}
      totalSteps={initialType ? 2 : 3}
      progressColor={colors.primary}
    >
      {/* Шаг 0: Выбор типа (показываем только если initialType не задан) */}
      {!initialType && (
        <div className={`wizard-slide ${step === 0 ? 'active' : step > 0 ? 'prev' : 'next'}`}>
        <WizardSlide
          icon="📂"
          title="Тип категории"
          description="Выберите тип категории"
          actions={
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <GradientButton
                variant="secondary"
                onClick={onClose}
              >
                Отмена
              </GradientButton>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <WizardCard
              icon="💰"
              title="Доход"
              description="Категория для доходов"
              selected={categoryType === 'income'}
              onClick={() => handleTypeSelect('income')}
            />
            <WizardCard
              icon="💸"
              title="Расход"
              description="Категория для расходов"
              selected={categoryType === 'expense'}
              onClick={() => handleTypeSelect('expense')}
            />
          </div>
        </WizardSlide>
      </div>
      )}

      {/* Шаг 1: Название */}
      {categoryType && (
        <div className={`wizard-slide ${step === 1 ? 'active' : step > 1 ? 'prev' : 'next'}`}>
          <WizardSlide
            icon="📝"
            title="Название категории"
            description="Введите название категории"
            actions={
              <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <GradientButton
                  variant="secondary"
                  onClick={handleBack}
                >
                  Назад
                </GradientButton>
                <GradientButton
                  onClick={handleNameNext}
                  disabled={!categoryName.trim()}
                >
                  Продолжить
                </GradientButton>
              </div>
            }
          >
            <input
              type="text"
              className="wizard-input"
              placeholder="Название категории"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && categoryName.trim()) {
                  handleNameNext();
                }
              }}
              autoFocus
            />
          </WizardSlide>
        </div>
      )}

      {/* Шаг 2: Иконка */}
      {categoryType && categoryName.trim() && (
        <div className={`wizard-slide ${step === 2 ? 'active' : step > 2 ? 'prev' : 'next'}`}>
          <WizardSlide
            icon="🎨"
            title="Выберите иконку"
            description={`Выберите иконку для "${categoryName.trim()}"`}
            actions={
              <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <GradientButton
                  variant="secondary"
                  onClick={handleBack}
                >
                  Назад
                </GradientButton>
                <GradientButton
                  onClick={handleIconComplete}
                >
                  Создать
                </GradientButton>
              </div>
            }
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              width: '100%',
              maxWidth: '400px'
            }}>
              {categoryIcons.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    setSelectedIcon(icon);
                  }}
                  className={`wizard-icon-button ${selectedIcon === icon ? 'selected' : ''}`}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '12px',
                    border: `2px solid ${selectedIcon === icon ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
                    backgroundColor: selectedIcon === icon 
                      ? 'rgba(51, 144, 236, 0.1)' 
                      : 'var(--tg-theme-bg-color)',
                    fontSize: '36px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </WizardSlide>
        </div>
      )}
    </WizardContainer>
  );
}
