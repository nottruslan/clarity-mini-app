import { useEffect, useRef } from 'react';

interface BottomSheetProps {
  onClose: () => void;
  onEdit: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
  isPinned: boolean;
}

export default function BottomSheet({
  onClose,
  onEdit,
  onTogglePin,
  onDelete,
  isPinned
}: BottomSheetProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Блокируем прокрутку body когда bottom sheet открыт
    document.body.style.overflow = 'hidden';
    
    // Анимация появления
    if (sheetRef.current) {
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.style.transform = 'translateY(0)';
        }
      }, 10);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(100%)';
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          backgroundColor: 'var(--tg-theme-bg-color)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '8px 0',
          paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
          transform: 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        {/* Индикатор */}
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: 'var(--tg-theme-hint-color)',
            borderRadius: '2px',
            margin: '8px auto 16px',
            opacity: 0.3
          }}
        />

        {/* Опции меню */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={() => {
              handleClose();
              setTimeout(() => onEdit(), 350);
            }}
            style={{
              padding: '16px 20px',
              border: 'none',
              background: 'transparent',
              color: 'var(--tg-theme-text-color)',
              fontSize: '16px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--tg-theme-secondary-bg-color)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Редактировать
          </button>

          <button
            onClick={() => {
              handleClose();
              setTimeout(() => onTogglePin(), 350);
            }}
            style={{
              padding: '16px 20px',
              border: 'none',
              background: 'transparent',
              color: 'var(--tg-theme-text-color)',
              fontSize: '16px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--tg-theme-secondary-bg-color)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {isPinned ? 'Открепить' : 'Закрепить'}
          </button>

          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--tg-theme-secondary-bg-color)',
              margin: '8px 0'
            }}
          />

          <button
            onClick={() => {
              handleClose();
              setTimeout(() => onDelete(), 350);
            }}
            style={{
              padding: '16px 20px',
              border: 'none',
              background: 'transparent',
              color: 'var(--tg-theme-destructive-text-color)',
              fontSize: '16px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--tg-theme-secondary-bg-color)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Удалить
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

