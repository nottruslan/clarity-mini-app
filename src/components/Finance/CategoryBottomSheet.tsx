import { useEffect, useRef, useState } from 'react';
import { Category } from '../../utils/storage';

interface CategoryBottomSheetProps {
  category: Category;
  onClose: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onChangeIcon?: (icon: string) => void;
  onDelete?: (categoryId: string) => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

const categoryIcons = [
  '💰', '💸', '💵', '💴', '💶', '💷', '💳', '💹',
  '🏦', '📊', '📈', '📉', '💼', '🎁', '🛍️', '🛒',
  '🍔', '🍕', '🍖', '🍗', '🍝', '🍜', '🍛', '🍱',
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
  '🏥', '💊', '💉', '🏋️', '⛹️', '🤸', '🏃', '🚴',
  '📚', '✏️', '📝', '📖', '🎓', '🎯', '🎨', '🎬',
  '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏛️',
  '🎮', '🎲', '🎯', '🎳', '🎪', '🎭', '🎨', '🎬',
  '💡', '🔦', '🕯️', '🧯', '🛢️', '💸', '📦', '⭐'
];

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
  const [showIconPicker, setShowIconPicker] = useState(false);

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
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '500px',
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
                onClick={() => setShowIconPicker(true)}
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
                  if (window.confirm(`Вы уверены, что хотите удалить категорию "${category.name}"? Все транзакции с этой категорией также будут удалены.`)) {
                    onDelete?.(category.id);
                    handleClose();
                  }
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

      {showIconPicker && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowIconPicker(false);
            }
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '500px',
              backgroundColor: 'var(--tg-theme-bg-color)',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              padding: '20px',
              paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
              maxHeight: '60vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                Выберите иконку
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--tg-theme-hint-color)' }}>
                Выберите иконку для категории "{category.name}"
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '12px'
              }}
            >
              {categoryIcons.map((icon) => (
                <button
                  key={icon}
                  onClick={() => {
                    if (onChangeIcon) {
                      onChangeIcon(icon);
                      setShowIconPicker(false);
                      handleClose();
                    }
                  }}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '12px',
                    border: `2px solid ${category.icon === icon ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
                    backgroundColor: category.icon === icon 
                      ? 'rgba(51, 144, 236, 0.1)' 
                      : 'var(--tg-theme-secondary-bg-color)',
                    fontSize: '28px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (category.icon !== icon) {
                      e.currentTarget.style.backgroundColor = 'var(--tg-theme-bg-color)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (category.icon !== icon) {
                      e.currentTarget.style.backgroundColor = 'var(--tg-theme-secondary-bg-color)';
                    }
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowIconPicker(false)}
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--tg-theme-hint-color)';
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--tg-theme-secondary-bg-color)';
                e.currentTarget.style.opacity = '1';
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

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

