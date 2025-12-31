import { useState, useRef } from 'react';
import { Task, TaskCategory } from '../../utils/storage';
import { getTaskStartMinutes, getTaskDuration, formatTime, formatDuration } from '../../utils/taskTimeUtils';

interface TaskItemProps {
  task: Task;
  categories?: TaskCategory[];
  onToggle: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  onStatusChange?: (status: 'todo' | 'in-progress' | 'completed') => void;
  date?: Date;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export default function TaskItem({ 
  task, 
  categories = [],
  onToggle, 
  onEdit,
  onDelete,
  onStatusChange,
  date = new Date(),
  expanded = false,
  onToggleExpand
}: TaskItemProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const touchStartX = useRef<number | null>(null);
  const maxSwipe = 80;

  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const actualExpanded = onToggleExpand ? expanded : isExpanded;

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

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusChange) {
      const currentStatus = task.status || (task.completed ? 'completed' : 'todo');
      if (currentStatus === 'todo') {
        onStatusChange('in-progress');
      } else if (currentStatus === 'in-progress') {
        onStatusChange('completed');
      } else {
        onStatusChange('todo');
      }
    } else {
      onToggle();
    }
  };

  const isCompleted = task.status === 'completed' || task.completed;
  const category = task.categoryId ? categories.find(c => c.id === task.categoryId) : undefined;
  const startMinutes = getTaskStartMinutes(task, date);
  const duration = getTaskDuration(task);
  const subtasksCount = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;

  const priorityColors = {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#f44336'
  };

  const energyIcons = {
    low: '😌',
    medium: '😊',
    high: '💪'
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
        onClick={(e) => {
          if (onEdit && e.target !== e.currentTarget) {
            // Клик на саму задачу открывает редактирование, если не кликнули на чекбокс или другие элементы
            const target = e.target as HTMLElement;
            if (target.tagName !== 'INPUT' && !target.closest('button') && !target.closest('.swipeable-actions')) {
              onEdit();
            }
          } else {
            handleToggleExpand();
          }
        }}
      >
        <div className="list-item" style={{ 
          padding: '12px 16px',
          backgroundColor: 'var(--tg-theme-section-bg-color)',
          borderBottom: '1px solid var(--tg-theme-secondary-bg-color)'
        }}>
          {/* Основная строка */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Чекбокс/Статус */}
            <div onClick={handleStatusClick} style={{ cursor: 'pointer', flexShrink: 0 }}>
              {task.status === 'in-progress' ? (
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid var(--tg-theme-button-color)',
                  borderTopColor: 'transparent',
                  animation: 'spin 1s linear infinite'
                }} />
              ) : (
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                />
              )}
            </div>

            {/* Контент */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Заголовок */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  flex: 1,
                  textDecoration: isCompleted ? 'line-through' : 'none',
                  opacity: isCompleted ? 0.6 : 1,
                  color: isCompleted 
                    ? 'var(--tg-theme-hint-color)' 
                    : 'var(--tg-theme-text-color)',
                  fontSize: '16px',
                  fontWeight: '500',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {task.text}
                </span>
                
                {/* Иконки */}
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 }}>
                  {category && (
                    <span style={{ fontSize: '16px' }}>{category.icon}</span>
                  )}
                  {task.energyLevel && (
                    <span style={{ fontSize: '14px' }}>{energyIcons[task.energyLevel]}</span>
                  )}
                  {task.priority && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: priorityColors[task.priority]
                    }} />
                  )}
                  {subtasksCount > 0 && (
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--tg-theme-hint-color)'
                    }}>
                      {completedSubtasks}/{subtasksCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Дополнительная информация (компактный режим) */}
              {!actualExpanded && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  fontSize: '12px',
                  color: 'var(--tg-theme-hint-color)',
                  flexWrap: 'wrap'
                }}>
                  {startMinutes !== null && (
                    <span>⏰ {formatTime(startMinutes)}</span>
                  )}
                  {duration && (
                    <span>⏱️ {formatDuration(duration)}</span>
                  )}
                </div>
              )}

              {/* Детальная информация (расширенный режим) */}
              {actualExpanded && (
                <div style={{
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--tg-theme-secondary-bg-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {task.description && (
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--tg-theme-hint-color)'
                    }}>
                      {task.description}
                    </div>
                  )}
                  
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                    fontSize: '12px',
                    color: 'var(--tg-theme-hint-color)'
                  }}>
                    {startMinutes !== null && (
                      <span>⏰ {formatTime(startMinutes)}</span>
                    )}
                    {duration && (
                      <span>⏱️ {formatDuration(duration)}</span>
                    )}
                  </div>


                  {subtasksCount > 0 && (
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--tg-theme-hint-color)'
                    }}>
                      Подзадачи: {completedSubtasks}/{subtasksCount} выполнено
                    </div>
                  )}

                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                      }}
                      style={{
                        marginTop: '8px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'var(--tg-theme-button-color)',
                        color: 'var(--tg-theme-button-text-color)',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Редактировать
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
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

