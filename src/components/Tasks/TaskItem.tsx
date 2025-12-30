import { useState, useRef } from 'react';
import { Task } from '../../utils/storage';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const maxSwipe = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const deltaX = touchStartX.current - e.touches[0].clientX;
    
    if (deltaX > 0) {
      setSwipeOffset(Math.min(deltaX, maxSwipe));
    } else {
      setSwipeOffset(0);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > maxSwipe / 2) {
      onDelete();
    } else {
      setSwipeOffset(0);
    }
    touchStartX.current = null;
  };

  return (
    <div 
      className="swipeable-item"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="swipeable-content"
        style={{ transform: `translateX(-${swipeOffset}px)` }}
      >
        <div className="list-item">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={onToggle}
            style={{
              width: '20px',
              height: '20px',
              cursor: 'pointer',
              flexShrink: 0
            }}
          />
          <span style={{
            flex: 1,
            textDecoration: task.completed ? 'line-through' : 'none',
            opacity: task.completed ? 0.6 : 1,
            color: task.completed 
              ? 'var(--tg-theme-hint-color)' 
              : 'var(--tg-theme-text-color)'
          }}>
            {task.text}
          </span>
        </div>
      </div>
      {swipeOffset > 0 && (
        <div className="swipeable-actions">
          <div className="swipeable-delete">
            Удалить
          </div>
        </div>
      )}
    </div>
  );
}

