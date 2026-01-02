import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useRef } from 'react';
import { type CoveyTask } from '../../utils/storage';
import CoveyTaskBottomSheet from './CoveyTaskBottomSheet';
import CoveyTaskDetailsBottomSheet from './CoveyTaskDetailsBottomSheet';

interface QuadrantTaskItemProps {
  task: CoveyTask;
  storage: any;
  onEdit?: (task: CoveyTask) => void;
}

export default function QuadrantTaskItem({ task, storage, onEdit }: QuadrantTaskItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const hasMovedRef = useRef(false);
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

  const handlePointerDown = (e: React.PointerEvent) => {
    // Проверяем, что клик не на drag handle, checkbox или меню
    const target = e.target as HTMLElement;
    if (target.closest('[data-drag-handle]') || 
        (target instanceof HTMLInputElement && target.type === 'checkbox') || 
        target.closest('button')) {
      return;
    }

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };
    hasMovedRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    
    const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
    const deltaY = Math.abs(e.clientY - dragStartRef.current.y);
    
    // Если движение больше 5px - это drag
    if (deltaX > 5 || deltaY > 5) {
      hasMovedRef.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;

    const target = e.target as HTMLElement;
    // Не обрабатываем клик, если это был drag handle, checkbox или меню
    if (target.closest('[data-drag-handle]') || 
        (target instanceof HTMLInputElement && target.type === 'checkbox') || 
        target.closest('button')) {
      dragStartRef.current = null;
      return;
    }

    const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
    const deltaY = Math.abs(e.clientY - dragStartRef.current.y);
    const deltaTime = Date.now() - dragStartRef.current.time;

    // Если движение было маленьким и быстрым, и не было drag - это клик
    if (!hasMovedRef.current && deltaX < 10 && deltaY < 10 && deltaTime < 500) {
      e.stopPropagation();
      setShowDetails(true);
    }

    dragStartRef.current = null;
    hasMovedRef.current = false;
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className="list-item"
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px',
          cursor: 'pointer',
          backgroundColor: 'var(--tg-theme-bg-color)',
          borderRadius: '6px',
          border: '1px solid var(--tg-theme-secondary-bg-color)'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          {...attributes}
          {...listeners}
          data-drag-handle
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'grab',
            flexShrink: 0,
            padding: '4px',
            touchAction: 'none'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <span style={{ fontSize: '16px', color: 'var(--tg-theme-hint-color)' }}>⋮⋮</span>
        </div>
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
          className="task-content"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            minWidth: 0,
            cursor: 'pointer'
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
      
      {showDetails && (
        <CoveyTaskDetailsBottomSheet
          task={task}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}

