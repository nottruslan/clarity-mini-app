import { useState, useRef } from 'react';
import { Task, TaskCategory, Subtask } from '../../utils/storage';
import { getTaskStartMinutes, getTaskDuration, formatTime, formatDuration } from '../../utils/taskTimeUtils';
import TaskActionsMenu from './TaskActionsMenu';

interface TaskItemProps {
  task: Task;
  categories?: TaskCategory[];
  onToggle: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  onStatusChange?: (status: 'todo' | 'in-progress' | 'completed') => void;
  onPin?: () => void;
  onUnpin?: () => void;
  onConfirmDelete?: () => void;
  onSubtaskToggle?: (subtaskId: string) => void;
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
  onPin,
  onUnpin,
  onConfirmDelete,
  onSubtaskToggle,
  date = new Date(),
  expanded = false,
  onToggleExpand
}: TaskItemProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | undefined>(undefined);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
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
      if (onConfirmDelete) {
        onConfirmDelete();
      } else {
        onDelete();
      }
    } else {
      setSwipeOffset(0);
    }
    touchStartX.current = null;
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.left - 150 // Смещаем влево, чтобы меню не выходило за экран
      });
    }
    setIsMenuOpen(true);
  };

  const handleSubtaskToggle = (subtaskId: string) => {
    if (onSubtaskToggle) {
      onSubtaskToggle(subtaskId);
    }
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
          // Клик на задачу раскрывает/сворачивает, если не кликнули на кнопки или меню
          const target = e.target as HTMLElement;
          if (target.tagName !== 'INPUT' && 
              !target.closest('button') && 
              !target.closest('.swipeable-actions') &&
              !target.closest('.task-menu-button')) {
            handleToggleExpand();
          }
        }}
      >
        <div className="list-item" style={{ 
          padding: '12px 16px',
          backgroundColor: 'var(--tg-theme-section-bg-color)',
          borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
          position: 'relative'
        }}>
          {/* Меню действий (три точки) - в правом верхнем углу */}
          <button
            ref={menuButtonRef}
            className="task-menu-button"
            onClick={handleMenuClick}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              padding: '4px 8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '20px',
              color: 'var(--tg-theme-hint-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              zIndex: 10
            }}
          >
            ⋮
          </button>
          
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
            <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
              {/* Заголовок */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', paddingRight: '32px' }}>
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
                  {task.pinned && (
                    <span style={{ fontSize: '16px' }} title="Закреплено">📌</span>
                  )}
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
                  gap: '12px',
                  width: '100%',
                  maxWidth: '100%'
                }}>
                  {/* Описание */}
                  {task.description && (
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--tg-theme-text-color)',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      textAlign: 'center'
                    }}>
                      {task.description}
                    </div>
                  )}
                  
                  {/* Подзадачи с чекбоксами */}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'var(--tg-theme-text-color)',
                        marginBottom: '4px',
                        textAlign: 'center'
                      }}>
                        Подзадачи ({completedSubtasks}/{subtasksCount})
                      </div>
                      {task.subtasks.map((subtask: Subtask) => (
                        <div
                          key={subtask.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--tg-theme-secondary-bg-color)'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={() => handleSubtaskToggle(subtask.id)}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              width: '18px',
                              height: '18px',
                              cursor: 'pointer',
                              flexShrink: 0
                            }}
                          />
                          <span
                            style={{
                              flex: 1,
                              fontSize: '14px',
                              color: subtask.completed 
                                ? 'var(--tg-theme-hint-color)' 
                                : 'var(--tg-theme-text-color)',
                              textDecoration: subtask.completed ? 'line-through' : 'none',
                              opacity: subtask.completed ? 0.6 : 1,
                              textAlign: 'center'
                            }}
                          >
                            {subtask.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Дополнительная информация */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '13px',
                    color: 'var(--tg-theme-hint-color)',
                    alignItems: 'center'
                  }}>
                    {task.priority && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <span>Приоритет:</span>
                        <span style={{ 
                          color: priorityColors[task.priority],
                          fontWeight: '500'
                        }}>
                          {task.priority === 'low' ? 'Низкий' : task.priority === 'medium' ? 'Средний' : 'Высокий'}
                        </span>
                      </div>
                    )}
                    
                    {category && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <span>Категория:</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </span>
                      </div>
                    )}
                    
                    {task.energyLevel && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <span>Энергия:</span>
                        <span>{energyIcons[task.energyLevel]}</span>
                      </div>
                    )}
                    
                    {task.dueDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <span>Срок:</span>
                        <span>{new Date(task.dueDate).toLocaleDateString('ru-RU', { 
                          day: 'numeric', 
                          month: 'long',
                          year: 'numeric'
                        })}</span>
                      </div>
                    )}
                    
                    {startMinutes !== null && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <span>Время:</span>
                        <span>⏰ {formatTime(startMinutes)}</span>
                        {duration && <span>⏱️ {formatDuration(duration)}</span>}
                      </div>
                    )}
                  </div>
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
      
      {/* Меню действий */}
      <TaskActionsMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onEdit={() => {
          if (onEdit) {
            onEdit();
          }
        }}
        onDelete={() => {
          if (onConfirmDelete) {
            onConfirmDelete();
          } else {
            onDelete();
          }
        }}
        onPin={() => {
          if (onPin) {
            onPin();
          }
        }}
        onUnpin={() => {
          if (onUnpin) {
            onUnpin();
          }
        }}
        isPinned={task.pinned || false}
        position={menuPosition}
      />
    </div>
  );
}

