import { useState, useRef } from 'react';
import { Task } from '../../../utils/storage';

interface InBoxItemProps {
  task: Task;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string) => void;
  isEditing?: boolean;
  onStartEdit?: (id: string) => void;
  onCancelEdit?: () => void;
}

export default function InBoxItem({
  task,
  onEdit,
  onDelete,
  onMove,
  isEditing = false,
  onStartEdit,
  onCancelEdit
}: InBoxItemProps) {
  const [localText, setLocalText] = useState(task.text);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const maxSwipe = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isEditing) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isEditing || touchStartX.current === null) return;
    
    const deltaX = touchStartX.current - e.touches[0].clientX;
    
    if (deltaX > 0) {
      setSwipeOffset(Math.min(deltaX, maxSwipe));
    } else {
      setSwipeOffset(0);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > maxSwipe / 2) {
      onDelete(task.id);
    } else {
      setSwipeOffset(0);
    }
    touchStartX.current = null;
  };

  const handleSave = () => {
    if (localText.trim()) {
      onEdit(task.id, localText.trim());
      onCancelEdit?.();
    }
  };

  const handleCancel = () => {
    setLocalText(task.text);
    onCancelEdit?.();
  };

  if (isEditing) {
    return (
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'var(--tg-theme-section-bg-color)',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)'
      }}>
        <textarea
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              handleSave();
            } else if (e.key === 'Escape') {
              handleCancel();
            } else if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
              // Сохраняем при простом Enter (без модификаторов)
              handleSave();
            }
          }}
          autoFocus
          style={{
            width: '100%',
            minHeight: '60px',
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid var(--tg-theme-button-color)',
            backgroundColor: 'var(--tg-theme-bg-color)',
            color: 'var(--tg-theme-text-color)',
            fontSize: '16px',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none'
          }}
        />
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '8px',
          justifyContent: 'center'
        }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '12px 16px',
              minHeight: '44px',
              borderRadius: '10px',
              border: 'none',
              background: 'var(--tg-theme-button-color)',
              color: 'var(--tg-theme-button-text-color)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Сохранить
          </button>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: '12px 16px',
              minHeight: '44px',
              borderRadius: '10px',
              border: 'none',
              background: 'var(--tg-theme-secondary-bg-color)',
              color: 'var(--tg-theme-text-color)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    );
  }

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
        <div 
          className="list-item"
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--tg-theme-section-bg-color)',
            borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
            cursor: 'pointer'
          }}
          onClick={() => onStartEdit?.(task.id)}
        >
          {/* Минимальный вид - только текст задачи */}
          <div style={{
            fontSize: '16px',
            color: task.completed || task.status === 'completed' 
              ? 'var(--tg-theme-hint-color)' 
              : task.movedToList
              ? '#4caf50' // зеленый цвет для перемещенных задач
              : 'var(--tg-theme-text-color)',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            textDecoration: task.completed || task.status === 'completed' ? 'line-through' : 'none'
          }}>
            {task.text}
          </div>
          {/* Кнопка перемещения в список - показываем только если не редактируем */}
          {!isEditing && (
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '8px'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(task.id);
                }}
                style={{
                  padding: '10px 16px',
                  minHeight: '44px',
                  borderRadius: '10px',
                  border: 'none',
                  background: task.movedToList 
                    ? '#4caf50' // зеленый цвет когда уже в списке
                    : 'var(--tg-theme-button-color)',
                  color: task.movedToList 
                    ? '#ffffff' // белый текст на зеленом фоне
                    : 'var(--tg-theme-button-text-color)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {task.movedToList ? '✓ В списке' : 'В список'}
              </button>
            </div>
          )}
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

