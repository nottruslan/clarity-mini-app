import { useState, useRef } from 'react';
import { Task, TaskCategory, TaskTag } from '../../../utils/storage';
import { formatDuration } from '../../../utils/taskTimeUtils';

interface TaskTimeBlockProps {
  task: Task;
  categories?: TaskCategory[];
  tags?: TaskTag[];
  top: string;
  height: string;
  onClick?: () => void;
  onDelete?: () => void;
}

export default function TaskTimeBlock({
  task,
  categories = [],
  tags = [],
  top,
  height,
  onClick,
  onDelete
}: TaskTimeBlockProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const maxSwipe = 80;

  const category = task.categoryId ? categories.find(c => c.id === task.categoryId) : undefined;
  const isCompleted = task.status === 'completed' || task.completed;
  const duration = task.duration || 60;

  const priorityColors = {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#f44336'
  };

  const backgroundColor = category?.color || 
    (task.priority ? priorityColors[task.priority] : 'var(--tg-theme-button-color)');

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !onDelete) return;
    
    const deltaX = touchStartX.current - e.touches[0].clientX;
    
    if (deltaX > 0) {
      setSwipeOffset(Math.min(deltaX, maxSwipe));
    } else {
      setSwipeOffset(0);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > maxSwipe / 2 && onDelete) {
      onDelete();
    } else {
      setSwipeOffset(0);
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="swipeable-item"
      style={{
        position: 'absolute',
        left: '8px',
        right: '8px',
        top,
        height,
        minHeight: '40px'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="swipeable-content"
        style={{
          transform: `translateX(-${swipeOffset}px)`,
          height: '100%'
        }}
        onClick={onClick}
      >
        <div style={{
          height: '100%',
          backgroundColor: isCompleted ? `${backgroundColor}80` : backgroundColor,
          borderRadius: '8px',
          padding: '8px 12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: onClick ? 'pointer' : 'default',
          border: `2px solid ${isCompleted ? 'transparent' : backgroundColor}`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '4px'
          }}>
            {category?.icon && (
              <span style={{ fontSize: '14px' }}>{category.icon}</span>
            )}
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffffff',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
            }}>
              {task.text}
            </span>
          </div>
          
          {duration && (
            <div style={{
              fontSize: '11px',
              color: '#ffffff',
              opacity: 0.9
            }}>
              {formatDuration(duration)}
            </div>
          )}
        </div>
      </div>
      {swipeOffset > 0 && onDelete && (
        <div className="swipeable-actions">
          <div className="swipeable-delete">
            Удалить
          </div>
        </div>
      )}
    </div>
  );
}

