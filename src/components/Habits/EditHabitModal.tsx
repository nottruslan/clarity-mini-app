import { useState } from 'react';
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

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--tg-theme-bg-color)',
        borderRadius: '16px',
        padding: '20px',
        maxWidth: '400px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--tg-theme-text-color)'
          }}>
            Редактировать привычку
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: 'var(--tg-theme-secondary-bg-color)',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              fontSize: '14px',
              color: 'var(--tg-theme-hint-color)',
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
              fontSize: '14px',
              color: 'var(--tg-theme-hint-color)',
              marginBottom: '8px',
              display: 'block'
            }}>
              Иконка
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '8px'
            }}>
              {icons.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    border: `2px solid ${icon === ic ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
                    background: icon === ic 
                      ? 'rgba(51, 144, 236, 0.1)' 
                      : 'var(--tg-theme-bg-color)',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{
              fontSize: '14px',
              color: 'var(--tg-theme-hint-color)',
              marginBottom: '8px',
              display: 'block'
            }}>
              Категория
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px'
            }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
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
                    gap: '4px'
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
              fontSize: '14px',
              color: 'var(--tg-theme-hint-color)',
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
                fontSize: '14px',
                color: 'var(--tg-theme-hint-color)',
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
              fontSize: '14px',
              color: 'var(--tg-theme-hint-color)',
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

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              className="tg-button"
              onClick={handleSave}
              style={{ flex: 1 }}
            >
              Сохранить
            </button>
            <button
              className="tg-button"
              onClick={onClose}
              style={{
                flex: 1,
                background: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-text-color)'
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

