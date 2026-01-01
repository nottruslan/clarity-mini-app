import { useState, useMemo } from 'react';
import { Task, TaskCategory } from '../../utils/storage';
import TaskItem from './TaskItem';
import EmptyState from '../EmptyState';

interface TaskListProps {
  tasks: Task[];
  categories?: TaskCategory[];
  onToggle: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: 'todo' | 'in-progress' | 'completed') => void;
  onPin?: (id: string) => void;
  onUnpin?: (id: string) => void;
  onConfirmDelete?: (id: string) => void;
  onSubtaskToggle?: (taskId: string, subtaskId: string) => void;
  date?: Date;
  expandedTasks?: Set<string>;
  onToggleExpand?: (id: string) => void;
}

export default function TaskList({ 
  tasks, 
  categories = [],
  onToggle, 
  onEdit,
  onDelete,
  onStatusChange,
  onPin,
  onUnpin,
  onConfirmDelete,
  onSubtaskToggle,
  date = new Date(),
  expandedTasks,
  onToggleExpand
}: TaskListProps) {
  const [localExpanded, setLocalExpanded] = useState<Set<string>>(new Set());

  const handleToggleExpand = (id: string) => {
    if (onToggleExpand) {
      onToggleExpand(id);
    } else {
      setLocalExpanded(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    }
  };

  const expandedSet = expandedTasks || localExpanded;

  // Сортировка: сначала закрепленные (последняя закрепленная первая), затем остальные
  const sortedTasks = useMemo(() => {
    const pinned = tasks.filter(t => t.pinned);
    const unpinned = tasks.filter(t => !t.pinned);
    
    // Закрепленные сортируем по createdAt в обратном порядке (новые первыми)
    pinned.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    
    return [...pinned, ...unpinned];
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <EmptyState 
        message="У вас пока нет задач. Создайте первую задачу!"
      />
    );
  }

  return (
    <div className="list" style={{ 
      flex: 1, 
      overflowY: 'auto' as const,
      paddingTop: '0px',
      WebkitOverflowScrolling: 'touch' as any
    }}>
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          data-task-id={task.id}
          categories={categories}
          onToggle={() => onToggle(task.id)}
          onEdit={onEdit ? () => onEdit(task.id) : undefined}
          onDelete={() => onDelete(task.id)}
          onStatusChange={onStatusChange ? (status) => onStatusChange(task.id, status) : undefined}
          onPin={onPin ? () => onPin(task.id) : undefined}
          onUnpin={onUnpin ? () => onUnpin(task.id) : undefined}
          onConfirmDelete={onConfirmDelete ? () => onConfirmDelete(task.id) : undefined}
          onSubtaskToggle={onSubtaskToggle ? (subtaskId) => onSubtaskToggle(task.id, subtaskId) : undefined}
          date={date}
          expanded={expandedSet.has(task.id)}
          onToggleExpand={() => handleToggleExpand(task.id)}
        />
      ))}
    </div>
  );
}

