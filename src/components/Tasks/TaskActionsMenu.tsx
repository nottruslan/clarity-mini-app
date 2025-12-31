import { useEffect, useRef } from 'react';

interface TaskActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPin: () => void;
  onUnpin: () => void;
  isPinned: boolean;
  position?: { top: number; left: number };
}

export default function TaskActionsMenu({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onPin,
  onUnpin,
  isPinned,
  position
}: TaskActionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleEdit = () => {
    onEdit();
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const handlePin = () => {
    if (isPinned) {
      onUnpin();
    } else {
      onPin();
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9998,
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }}
        onClick={onClose}
      />
      
      {/* Menu */}
      <div
        ref={menuRef}
        style={{
          position: 'fixed',
          top: position ? `${position.top}px` : '50%',
          left: position ? `${position.left}px` : '50%',
          transform: position ? 'none' : 'translate(-50%, -50%)',
          backgroundColor: 'var(--tg-theme-bg-color)',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
          minWidth: '200px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <button
          onClick={handleEdit}
          style={{
            padding: '16px 20px',
            border: 'none',
            background: 'transparent',
            color: 'var(--tg-theme-text-color)',
            fontSize: '16px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <span style={{ fontSize: '20px' }}>✏️</span>
          <span>Редактировать</span>
        </button>
        
        <button
          onClick={handlePin}
          style={{
            padding: '16px 20px',
            border: 'none',
            background: 'transparent',
            color: 'var(--tg-theme-text-color)',
            fontSize: '16px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderTop: '1px solid var(--tg-theme-secondary-bg-color)'
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <span style={{ fontSize: '20px' }}>{isPinned ? '📌' : '📍'}</span>
          <span>{isPinned ? 'Открепить' : 'Закрепить'}</span>
        </button>
        
        <button
          onClick={handleDelete}
          style={{
            padding: '16px 20px',
            border: 'none',
            background: 'transparent',
            color: 'var(--tg-theme-destructive-text-color)',
            fontSize: '16px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderTop: '1px solid var(--tg-theme-secondary-bg-color)'
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <span style={{ fontSize: '20px' }}>🗑️</span>
          <span>Удалить</span>
        </button>
      </div>
    </>
  );
}

