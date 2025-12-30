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
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    // Фокусируемся на поле ввода при открытии
    inputRef.current?.focus();
    if (inputRef.current && multiline) {
      (inputRef.current as HTMLTextAreaElement).setSelectionRange(
        editedValue.length,
        editedValue.length
      );
    }
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'var(--tg-theme-bg-color)',
        borderRadius: '16px',
        padding: '20px',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxHeight: '80vh',
        overflow: 'hidden'
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

