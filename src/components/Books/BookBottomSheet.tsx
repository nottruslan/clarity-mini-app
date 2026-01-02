import { useRef, useEffect } from 'react';

interface BookBottomSheetProps {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function BookBottomSheet({ onClose, onEdit, onDelete }: BookBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

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
        justifyContent: 'center'
      }}
    >
      <div
        ref={sheetRef}
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'var(--tg-theme-bg-color)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '8px 0',
          paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
          transform: 'translateY(100%)',
          transition: 'transform 0.3s ease-out',
          maxHeight: '80vh'
        }}
        onClick={(e) => e.stopPropagation()}
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

        <div style={{ padding: '0 20px' }}>
          <button
            onClick={() => {
              handleClose();
              onEdit();
            }}
            style={{
              width: '100%',
              padding: '16px',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
              color: 'var(--tg-theme-text-color)',
              fontSize: '16px',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            Редактировать
          </button>
          <button
            onClick={() => {
              if (window.Telegram?.WebApp?.showConfirm) {
                window.Telegram.WebApp.showConfirm(
                  'Удалить книгу?',
                  (confirmed: boolean) => {
                    if (confirmed) {
                      onDelete();
                    }
                    handleClose();
                  }
                );
              } else {
                if (window.confirm('Удалить книгу?')) {
                  onDelete();
                }
                handleClose();
              }
            }}
            style={{
              width: '100%',
              padding: '16px',
              background: 'transparent',
              border: 'none',
              color: '#f44336',
              fontSize: '16px',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

