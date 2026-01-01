import { useState } from 'react';
import { Habit } from '../../utils/storage';
import HabitItem from './HabitItem';
import EmptyState from '../EmptyState';

interface HabitListProps {
  habits: Habit[];
  onCheck: (id: string, value?: number) => void;
  onUpdate: (id: string, updates: Partial<Habit>) => void;
  onHistoryUpdate: (id: string, history: Habit['history']) => void;
  onDelete: (id: string) => void;
  onOpenDetails: (habit: Habit) => void;
  onOpenMenu: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
}

const categories = [
  { id: 'all', name: 'Все' },
  { id: 'health', name: 'Здоровье' },
  { id: 'fitness', name: 'Фитнес' },
  { id: 'learning', name: 'Обучение' },
  { id: 'productivity', name: 'Продуктивность' },
  { id: 'mindfulness', name: 'Осознанность' },
  { id: 'social', name: 'Социальное' },
  { id: 'creative', name: 'Творчество' },
  { id: 'finance', name: 'Финансы' },
  { id: 'other', name: 'Прочее' }
];

export default function HabitList({ 
  habits, 
  onCheck, 
  onUpdate, 
  onHistoryUpdate,
  onDelete,
  onOpenDetails,
  onOpenMenu,
  onEdit
}: HabitListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredHabits = selectedCategory === 'all' 
    ? habits 
    : habits.filter(h => h.category === selectedCategory);

  const sortedHabits = [...filteredHabits].sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
  });

  if (habits.length === 0) {
    return (
      <EmptyState 
        message="У вас пока нет привычек. Создайте первую привычку!"
      />
    );
  }

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '12px 16px',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
        background: 'var(--tg-theme-bg-color)',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          minWidth: 'max-content'
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: selectedCategory === cat.id
                  ? 'var(--tg-theme-button-color)'
                  : 'var(--tg-theme-secondary-bg-color)',
                color: selectedCategory === cat.id
                  ? 'var(--tg-theme-button-text-color)'
                  : 'var(--tg-theme-text-color)',
                fontSize: '14px',
                fontWeight: selectedCategory === cat.id ? '600' : '400',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                touchAction: 'pan-y'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        overflowY: 'auto' as const,
        paddingTop: '0px',
        WebkitOverflowScrolling: 'touch' as any
      }}>
        {filteredHabits.length === 0 ? (
          <EmptyState 
            message={`Нет привычек в категории "${categories.find(c => c.id === selectedCategory)?.name}"`}
          />
        ) : (
          sortedHabits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onCheck={(value) => onCheck(habit.id, value)}
              onUpdate={(updates) => onUpdate(habit.id, updates)}
              onHistoryUpdate={(history) => onHistoryUpdate(habit.id, history)}
              onDelete={() => onDelete(habit.id)}
              onOpenDetails={() => onOpenDetails(habit)}
              onOpenMenu={() => onOpenMenu(habit)}
              onEdit={() => onEdit(habit)}
            />
          ))
        )}
      </div>
    </div>
  );
}
