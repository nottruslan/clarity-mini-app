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
  const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Фокусируемся на поле ввода при открытии
    inputRef.current?.focus();
    if (inputRef.current && multiline) {
      (inputRef.current as HTMLTextAreaElement).setSelectionRange(
        editedValue.length,
        editedValue.length
      );
    }

    // Обработка visualViewport для корректного позиционирования при открытии клавиатуры
    const updateModalPosition = () => {
      if (window.visualViewport && modalRef.current) {
        const viewport = window.visualViewport;
        setModalStyle({
          position: 'fixed',
          top: `${viewport.offsetTop}px`,
          left: `${viewport.offsetLeft}px`,
          width: `${viewport.width}px`,
          height: `${viewport.height}px`,
        });
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('scroll', updateModalPosition);
      window.visualViewport.addEventListener('resize', updateModalPosition);
      updateModalPosition();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('scroll', updateModalPosition);
        window.visualViewport.removeEventListener('resize', updateModalPosition);
      }
    };
  }, []);

  const handleSave = () => {
    inputRef.current?.blur();
    onSave(editedValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div 
      ref={modalRef}
      style={{
        ...modalStyle,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px',
        boxSizing: 'border-box',
        overflow: 'auto'
      }}
    >
      <div style={{
        backgroundColor: 'var(--tg-theme-bg-color)',
        borderRadius: '16px',
        padding: '20px',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxHeight: window.visualViewport ? `${Math.min(window.visualViewport.height * 0.8, 600)}px` : '80vh',
        overflow: 'hidden',
        boxSizing: 'border-box',
        flexShrink: 0
      }}>
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
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton
            variant="secondary"
            onClick={onCancel}
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
  );
}

