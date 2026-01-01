import { useState, useRef } from 'react';
import { InBoxNote } from '../../../utils/storage';

interface InBoxItemProps {
  note: InBoxNote;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onMoveToList: (id: string) => void;
  isEditing?: boolean;
  onStartEdit?: (id: string) => void;
  onCancelEdit?: () => void;
}

export default function InBoxItem({
  note,
  onEdit,
  onDelete,
  onMoveToList,
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

  const handleMoveToList = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoveToList(note.id);
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
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {/* Текст заметки */}
          <div 
            style={{
              flex: 1,
              fontSize: '16px',
              color: 'var(--tg-theme-text-color)',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              cursor: 'pointer'
            }}
            onClick={() => onStartEdit?.(note.id)}
          >
            {note.text}
          </div>
          
          {/* Кнопка "В список" */}
          <button
            onClick={handleMoveToList}
            style={{
              padding: '8px 16px',
              minHeight: '36px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--tg-theme-button-color)',
              color: 'var(--tg-theme-button-text-color)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            В список
          </button>
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

