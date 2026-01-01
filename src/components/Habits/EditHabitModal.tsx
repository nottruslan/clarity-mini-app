import { useState, useEffect, useRef } from 'react';
import { Habit } from '../../utils/storage';

interface EditHabitModalProps {
  habit: Habit;
  onSave: (updates: Partial<Habit>) => void;
  onClose: () => void;
}

const categories = [
  { id: 'health', name: 'Здоровье', icon: '💪' },
  { id: 'fitness', name: 'Фитнес', icon: '🏃' },
  { id: 'learning', name: 'Обучение', icon: '📚' },
  { id: 'productivity', name: 'Продуктивность', icon: '⚡' },
  { id: 'mindfulness', name: 'Осознанность', icon: '🧘' },
  { id: 'social', name: 'Социальное', icon: '👥' },
  { id: 'creative', name: 'Творчество', icon: '🎨' },
  { id: 'finance', name: 'Финансы', icon: '💰' },
  { id: 'other', name: 'Прочее', icon: '⭐' }
];

const icons = [
  '🔥', '💪', '📚', '🏃', '🧘', '💧', '🍎', '🌱',
  '☀️', '🌙', '⭐', '🎯', '💎', '🚀', '🎨', '🎵',
  '📝', '🧠', '❤️', '✨', '🌟', '🎪', '🏆', '🎁'
];

export default function EditHabitModal({ habit, onSave, onClose }: EditHabitModalProps) {
  const [name, setName] = useState(habit.name);
  const [icon, setIcon] = useState(habit.icon || '🔥');
  const [category, setCategory] = useState(habit.category || 'health');
  const [unit, setUnit] = useState(habit.unit || '');
  const [targetValue, setTargetValue] = useState(habit.targetValue?.toString() || '');
  const [goalDays, setGoalDays] = useState(habit.goalDays?.toString() || '');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Блокируем скролл body при открытии модального окна
  useEffect(() => {
    // Анимация появления
    if (sheetRef.current) {
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.style.transform = 'translateY(0)';
        }
      }, 10);
    }
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const scrollY = window.scrollY;
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;
    
    // Фиксируем viewport
    const originalHeight = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${originalHeight * 0.01}px`);

    // Отслеживаем открытие клавиатуры
    let keyboardVisible = false;
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        keyboardVisible = viewportHeight < windowHeight - 150;
        setIsKeyboardVisible(keyboardVisible);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      handleViewportChange();
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
      document.documentElement.style.removeProperty('--vh');
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

  const handleSave = () => {
    const updates: Partial<Habit> = {
      name,
      icon,
      category,
      unit: unit || undefined,
      targetValue: targetValue ? parseFloat(targetValue) : undefined,
      goalDays: goalDays ? parseInt(goalDays) : undefined
    };
    onSave(updates);
    onClose();
  };

  const handleIconClick = (ic: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Предотвращаем автоматический скролл
    if (e.currentTarget) {
      e.currentTarget.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
    setIcon(ic);
  };

  const handleIconTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleIconTouchEnd = (ic: string, e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIcon(ic);
  };

  const handleCategoryClick = (catId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Предотвращаем автоматический скролл
    if (e.currentTarget) {
      e.currentTarget.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
    setCategory(catId);
  };

  const handleCategoryTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleCategoryTouchEnd = (catId: string, e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCategory(catId);
  };

  const handleClose = () => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(100%)';
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 10000,
        animation: 'fadeIn 0.2s ease-out'
      }} 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div 
        ref={sheetRef}
        style={{
          background: 'var(--tg-theme-bg-color)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '8px 0',
          paddingBottom: isKeyboardVisible ? '8px' : 'calc(8px + env(safe-area-inset-bottom))',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          transform: 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          WebkitOverflowScrolling: 'touch'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Индикатор */}
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: 'var(--tg-theme-hint-color)',
            borderRadius: '2px',
            margin: '8px auto 16px',
            opacity: 0.3
          }}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px 16px',
          borderBottom: '1px solid var(--tg-theme-secondary-bg-color)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--tg-theme-text-color)',
            margin: 0
          }}>
            Редактировать привычку
          </h2>
          <button
            onClick={handleClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              background: 'var(--tg-theme-secondary-bg-color)',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--tg-theme-text-color)'
            }}
          >
            ×
          </button>
        </div>

        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            padding: '20px 16px'
          }}
        >
          <div>
            <label style={{
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              display: 'block'
            }}>
              Название
            </label>
            <input
              type="text"
              className="wizard-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label style={{
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              display: 'block'
            }}>
              Иконка
            </label>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '8px',
                touchAction: 'none'
              }}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {icons.map((ic) => (
                <button
                  key={ic}
                  onClick={(e) => handleIconClick(ic, e)}
                  onTouchStart={handleIconTouchStart}
                  onTouchEnd={(e) => handleIconTouchEnd(ic, e)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    border: `2px solid ${icon === ic ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
                    background: icon === ic 
                      ? 'rgba(51, 144, 236, 0.1)' 
                      : 'var(--tg-theme-bg-color)',
                    fontSize: '24px',
                    cursor: 'pointer',
                    touchAction: 'none',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              display: 'block'
            }}>
              Категория
            </label>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                touchAction: 'none'
              }}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={(e) => handleCategoryClick(cat.id, e)}
                  onTouchStart={handleCategoryTouchStart}
                  onTouchEnd={(e) => handleCategoryTouchEnd(cat.id, e)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: `2px solid ${category === cat.id ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
                    background: category === cat.id 
                      ? 'rgba(51, 144, 236, 0.1)' 
                      : 'var(--tg-theme-section-bg-color)',
                    fontSize: '12px',
                    fontWeight: category === cat.id ? '600' : '400',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    touchAction: 'none',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              display: 'block'
            }}>
              Единица измерения
            </label>
            <input
              type="text"
              className="wizard-input"
              placeholder="Например: литры, минуты, разы"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>

          {unit && (
            <div>
              <label style={{
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
                display: 'block'
              }}>
                Целевое значение
              </label>
              <input
                type="number"
                className="wizard-input"
                placeholder="Целевое значение"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
          )}

          <div>
            <label style={{
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              display: 'block'
            }}>
              Цель по дням (опционально)
            </label>
            <input
              type="number"
              className="wizard-input"
              placeholder="Например: 30"
              value={goalDays}
              onChange={(e) => setGoalDays(e.target.value)}
              min="1"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="tg-button"
              onClick={handleSave}
              style={{ flex: 1 }}
            >
              Сохранить
            </button>
            <button
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: '10px',
                border: '1px solid var(--tg-theme-button-color)',
                background: 'transparent',
                color: 'var(--tg-theme-button-color)',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.2s'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.opacity = '0.7';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

