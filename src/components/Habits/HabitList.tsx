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
  const sortedHabits = [...habits].sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
  });

  if (habits.length === 0) {
    return (
      <div style={{ 
        flex: 1, 
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Информационный блок */}
        <div style={{
          padding: '16px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          margin: '16px',
          borderRadius: '12px',
          border: '1px solid var(--tg-theme-secondary-bg-color)'
        }}>
          <div style={{
            fontSize: '14px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.5'
          }}>
            <div style={{ marginBottom: '8px', fontWeight: '500' }}>
              💡 Как работать с привычками:
            </div>
            <div style={{ fontSize: '13px', color: 'var(--tg-theme-hint-color)' }}>
              <div style={{ marginBottom: '4px' }}>
                • Создайте привычку и отмечайте в календаре
              </div>
              <div>
                • Чтобы открыть календарь, нужно нажать на привычку и там отмечать в календаре
              </div>
            </div>
          </div>
        </div>
        <EmptyState 
          message="У вас пока нет привычек. Создайте первую привычку!"
        />
      </div>
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
        flex: 1, 
        overflowY: 'auto' as const,
        paddingTop: '0px',
        WebkitOverflowScrolling: 'touch' as any
      }}>
        {/* Информационный блок */}
        <div style={{
          padding: '16px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          margin: '16px',
          marginBottom: '8px',
          borderRadius: '12px',
          border: '1px solid var(--tg-theme-secondary-bg-color)'
        }}>
          <div style={{
            fontSize: '14px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.5'
          }}>
            <div style={{ marginBottom: '8px', fontWeight: '500' }}>
              💡 Как работать с привычками:
            </div>
            <div style={{ fontSize: '13px', color: 'var(--tg-theme-hint-color)' }}>
              <div style={{ marginBottom: '4px' }}>
                • Создайте привычку и отмечайте в календаре
              </div>
              <div>
                • Чтобы открыть календарь, нужно нажать на привычку и там отмечать в календаре
              </div>
            </div>
          </div>
        </div>
        {sortedHabits.length === 0 ? (
          <EmptyState 
            message="У вас пока нет привычек. Создайте первую привычку!"
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
