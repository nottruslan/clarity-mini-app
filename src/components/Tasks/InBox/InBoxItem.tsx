import { useState, useRef } from 'react';
import { InBoxNote } from '../../../utils/storage';

interface InBoxItemProps {
  note: InBoxNote;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onConvert: (note: InBoxNote) => void;
  isEditing?: boolean;
  onStartEdit?: (id: string) => void;
  onCancelEdit?: () => void;
}

export default function InBoxItem({
  note,
  onEdit,
  onDelete,
  onConvert,
  isEditing = false,
  onStartEdit,
  onCancelEdit
}: InBoxItemProps) {
  const [localText, setLocalText] = useState(note.text);
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
      onDelete(note.id);
    } else {
      setSwipeOffset(0);
    }
    touchStartX.current = null;
  };

  const handleSave = () => {
    if (localText.trim()) {
      onEdit(note.id, localText.trim());
      onCancelEdit?.();
    }
  };

  const handleCancel = () => {
    setLocalText(note.text);
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
          marginTop: '8px'
        }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
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
            Сохранить
          </button>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--tg-theme-secondary-bg-color)',
              color: 'var(--tg-theme-text-color)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
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
          onClick={() => onStartEdit?.(note.id)}
        >
          <div style={{
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {note.text}
          </div>
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '8px'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConvert(note);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--tg-theme-button-color)',
                color: 'var(--tg-theme-button-text-color)',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              В задачу
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartEdit?.(note.id);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-text-color)',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Редактировать
            </button>
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

