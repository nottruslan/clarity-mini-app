import { Reflection } from '../../../utils/storage';
import ReflectionItem from './ReflectionItem';
import EmptyState from '../../EmptyState';

interface ReflectionsListProps {
  reflections: Reflection[];
  onEdit?: (reflection: Reflection) => void;
  onDelete?: (reflectionId: string) => void;
}

export default function ReflectionsList({ reflections, onEdit, onDelete }: ReflectionsListProps) {
  if (reflections.length === 0) {
    return (
      <EmptyState 
        message="Размышлений пока нет. Добавьте первое размышление!"
      />
    );
  }

  return (
    <div>
      {reflections.map((reflection) => (
        <ReflectionItem
          key={reflection.id}
          reflection={reflection}
          onEdit={onEdit ? () => onEdit(reflection) : undefined}
          onDelete={onDelete ? () => onDelete(reflection.id) : undefined}
        />
      ))}
    </div>
  );
}

