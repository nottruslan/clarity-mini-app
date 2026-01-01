import { useEffect, useRef } from 'react';

interface ReportBottomSheetProps {
  onClose: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function ReportBottomSheet({
  onClose,
  onEdit,
  onDuplicate,
  onDelete
}: ReportBottomSheetProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
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

  const buttonStyle = {
    padding: '16px 20px',
    border: 'none',
    background: 'transparent',
    color: 'var(--tg-theme-text-color)',
    fontSize: '16px',
    textAlign: 'left' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  const destructiveButtonStyle = {
    ...buttonStyle,
    color: 'var(--tg-theme-destructive-text-color)'
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'var(--tg-theme-secondary-bg-color)';
  };

  const handleMouseUpLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
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
            style={buttonStyle}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUpLeave}
            onMouseLeave={handleMouseUpLeave}
          >
            Редактировать
          </button>

          <button
            onClick={() => {
              handleClose();
              setTimeout(() => onDuplicate(), 350);
            }}
            style={buttonStyle}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUpLeave}
            onMouseLeave={handleMouseUpLeave}
          >
            Дублировать
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
            style={destructiveButtonStyle}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUpLeave}
            onMouseLeave={handleMouseUpLeave}
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

