import { useState, useEffect, useRef } from 'react';
import GradientButton from '../Wizard/GradientButton';

interface EditFieldModalProps {
  title: string;
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  multiline?: boolean;
}

export default function EditFieldModal({ 
  title, 
  value, 
  onSave, 
  onCancel,
  multiline = true 
}: EditFieldModalProps) {
  const [editedValue, setEditedValue] = useState(value);
  const backdropRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (sheetRef.current) {
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.style.transform = 'translateY(0)';
        }
      }, 10);
    }
    // Фокусируемся на поле ввода при открытии
    setTimeout(() => {
      inputRef.current?.focus();
      if (inputRef.current && multiline) {
        (inputRef.current as HTMLTextAreaElement).setSelectionRange(
          editedValue.length,
          editedValue.length
        );
      }
    }, 100);

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
        onCancel();
      }, 300);
    } else {
      onCancel();
    }
  };

  const handleSave = () => {
    inputRef.current?.blur();
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(100%)';
      setTimeout(() => {
        onSave(editedValue.trim());
      }, 300);
    } else {
      onSave(editedValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
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
        zIndex: 10001,
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
          display: 'flex',
          flexDirection: 'column'
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

        {/* Контент */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1 }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--tg-theme-text-color)',
            margin: 0
          }}>
            {title}
          </h3>
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              className="wizard-input"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              rows={8}
              style={{ 
                marginTop: 0, 
                resize: 'vertical', 
                minHeight: '120px',
                fontFamily: 'inherit'
              }}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              className="wizard-input"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              style={{ marginTop: 0, fontFamily: 'inherit' }}
              onKeyDown={handleKeyDown}
            />
          )}
          <div style={{ display: 'flex', gap: '12px', width: '100%', paddingBottom: '8px' }}>
            <GradientButton
              variant="secondary"
              onClick={handleClose}
            >
              Отмена
            </GradientButton>
            <GradientButton
              onClick={handleSave}
            >
              Сохранить
            </GradientButton>
          </div>
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
