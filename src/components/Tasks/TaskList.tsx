import { useState } from 'react';
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
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          categories={categories}
          onToggle={() => onToggle(task.id)}
          onEdit={onEdit ? () => onEdit(task.id) : undefined}
          onDelete={() => onDelete(task.id)}
          onStatusChange={onStatusChange ? (status) => onStatusChange(task.id, status) : undefined}
          date={date}
          expanded={expandedSet.has(task.id)}
          onToggleExpand={() => handleToggleExpand(task.id)}
        />
      ))}
    </div>
  );
}

