import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { type CoveyTask } from '../../utils/storage';
import CoveyTaskBottomSheet from './CoveyTaskBottomSheet';

interface QuadrantTaskItemProps {
  task: CoveyTask;
  storage: any;
  onEdit?: (task: CoveyTask) => void;
}

export default function QuadrantTaskItem({ task, storage, onEdit }: QuadrantTaskItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    }
  };

  const handleToggleComplete = () => {
    if (task.completed) {
      storage.uncompleteCoveyTask(task.id);
    } else {
      storage.completeCoveyTask(task.id);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className="list-item"
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px',
          cursor: 'grab',
          backgroundColor: 'var(--tg-theme-bg-color)',
          borderRadius: '6px',
          border: '1px solid var(--tg-theme-secondary-bg-color)'
        }}
      >
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => {
            e.stopPropagation();
            handleToggleComplete();
          }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '18px',
            height: '18px',
            cursor: 'pointer',
            flexShrink: 0
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            minWidth: 0
          }}
        >
          <div
            style={{
              fontSize: '14px',
              color: task.completed 
                ? 'var(--tg-theme-hint-color)' 
                : 'var(--tg-theme-text-color)',
              textDecoration: task.completed ? 'line-through' : 'none',
              wordBreak: 'break-word'
            }}
          >
            {task.title}
          </div>
          {task.date && (
            <div
              style={{
                fontSize: '11px',
                color: 'var(--tg-theme-hint-color)'
              }}
            >
              {formatDate(task.date)}
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(true);
          }}
          style={{
            padding: '4px 8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: 'var(--tg-theme-hint-color)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ⋯
        </button>
      </div>

      {showMenu && (
        <CoveyTaskBottomSheet
          task={task}
          onClose={() => setShowMenu(false)}
          onEdit={() => {
            setShowMenu(false);
            if (onEdit) {
              onEdit(task);
            }
          }}
          onMove={(quadrant) => {
            storage.moveCoveyTask(task.id, quadrant);
            setShowMenu(false);
          }}
          onDelete={() => {
            storage.deleteCoveyTask(task.id);
            setShowMenu(false);
          }}
        />
      )}
    </>
  );
}

