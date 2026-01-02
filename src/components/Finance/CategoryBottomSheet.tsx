import { useEffect, useRef } from 'react';
import { Category } from '../../utils/storage';

interface CategoryBottomSheetProps {
  category: Category;
  onClose: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onChangeIcon?: () => void;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export default function CategoryBottomSheet({
  category,
  onClose,
  onMoveUp,
  onMoveDown,
  onChangeIcon,
  onDelete,
  canMoveUp = false,
  canMoveDown = false
}: CategoryBottomSheetProps) {
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

        {/* Название категории */}
        <div style={{ padding: '0 20px 16px' }}>
          <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '600' }}>
            {category.icon && <span style={{ marginRight: '8px' }}>{category.icon}</span>}
            {category.name}
          </h3>
        </div>

        {/* Опции меню */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {canMoveUp && onMoveUp && (
            <button
              onClick={() => {
                handleClose();
                setTimeout(() => onMoveUp(), 350);
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
              Переместить вверх
            </button>
          )}

          {canMoveDown && onMoveDown && (
            <button
              onClick={() => {
                handleClose();
                setTimeout(() => onMoveDown(), 350);
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
              Переместить вниз
            </button>
          )}

          {onChangeIcon && (
            <>
              {(canMoveUp || canMoveDown) && (
                <div
                  style={{
                    height: '1px',
                    backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                    margin: '8px 0'
                  }}
                />
              )}
              <button
                onClick={() => {
                  handleClose();
                  setTimeout(() => onChangeIcon(), 350);
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
                Изменить иконку
              </button>
            </>
          )}

          {onDelete && (
            <>
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
            </>
          )}
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

