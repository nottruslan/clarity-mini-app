import { useState } from 'react';
import { Habit } from '../../utils/storage';
import HabitItem from './HabitItem';
import EmptyState from '../EmptyState';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface HabitListProps {
  habits: Habit[];
  onCheck: (id: string, value?: number) => void;
  onUpdate: (id: string, updates: Partial<Habit>) => void;
  onHistoryUpdate: (id: string, history: Habit['history']) => void;
  onReorder: (habits: Habit[]) => void;
  onDelete: (id: string) => void;
  onOpenDetails: (habit: Habit) => void;
  onOpenMenu: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
}

function SortableHabitItem({ habit, onCheck, onUpdate, onHistoryUpdate, onDelete, onOpenDetails, onOpenMenu, onEdit }: {
  habit: Habit;
  onCheck: (value?: number) => void;
  onUpdate: (updates: Partial<Habit>) => void;
  onHistoryUpdate: (history: Habit['history']) => void;
  onDelete: () => void;
  onOpenDetails: () => void;
  onOpenMenu: () => void;
  onEdit: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ position: 'relative' }}>
        <div
          {...attributes}
          {...listeners}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--tg-theme-secondary-bg-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
            touchAction: 'none',
            zIndex: 10,
            fontSize: '18px'
          }}
        >
          ⋮⋮
        </div>
        <HabitItem
          habit={habit}
          onCheck={onCheck}
          onUpdate={onUpdate}
          onHistoryUpdate={onHistoryUpdate}
          onDelete={onDelete}
          onOpenDetails={onOpenDetails}
          onOpenMenu={onOpenMenu}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
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
  onReorder,
  onDelete,
  onOpenDetails,
  onOpenMenu,
  onEdit
}: HabitListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredHabits = selectedCategory === 'all' 
    ? habits 
    : habits.filter(h => h.category === selectedCategory);

  const sortedHabits = [...filteredHabits].sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedHabits.findIndex(h => h.id === active.id);
      const newIndex = sortedHabits.findIndex(h => h.id === over.id);

      const newHabits = arrayMove(sortedHabits, oldIndex, newIndex);
      
      // Обновляем order для всех привычек
      const updatedHabits = habits.map(habit => {
        const newIndex = newHabits.findIndex((h: Habit) => h.id === habit.id);
        if (newIndex !== -1) {
          return { ...habit, order: newIndex };
        }
        return habit;
      });

      onReorder(updatedHabits);
    }
  }

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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedHabits.map(h => h.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedHabits.map((habit) => (
                <SortableHabitItem
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
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
