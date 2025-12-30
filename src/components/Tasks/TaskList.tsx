import { Task } from '../../utils/storage';
import TaskItem from './TaskItem';
import EmptyState from '../EmptyState';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState 
        message="У вас пока нет задач. Создайте первую задачу!"
      />
    );
  }

  return (
    <div className="list" style={{ flex: 1, overflowY: 'auto' }}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggle(task.id)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </div>
  );
}

