import { Habit } from '../../utils/storage';
import HabitItem from './HabitItem';
import EmptyState from '../EmptyState';

interface HabitListProps {
  habits: Habit[];
  onCheck: (id: string) => void;
}

export default function HabitList({ habits, onCheck }: HabitListProps) {
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
      overflowY: 'auto' as const,
      paddingTop: '0px',
      WebkitOverflowScrolling: 'touch' as any
    }}>
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onCheck={() => onCheck(habit.id)}
        />
      ))}
    </div>
  );
}

