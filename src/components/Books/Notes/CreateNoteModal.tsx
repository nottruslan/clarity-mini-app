import { useState, useEffect, useRef } from 'react';
import { generateId } from '../../../utils/storage';

interface CreateNoteModalProps {
  bookId: string;
  onSave: (note: { id: string; bookId: string; content: string; page?: number; createdAt: number; updatedAt: number }) => void;
  onClose: () => void;
}

export default function CreateNoteModal({ bookId, onSave, onClose }: CreateNoteModalProps) {
  const [content, setContent] = useState('');
  const [page, setPage] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    
    let keyboardVisible = false;
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        keyboardVisible = viewportHeight < windowHeight - 150;
        setIsKeyboardVisible(keyboardVisible);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      handleViewportChange();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

  const handleSave = () => {
    if (!content.trim()) return;

    const note = {
      id: generateId(),
      bookId,
      content: content.trim(),
      page: page ? parseInt(page) : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    onSave(note);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 10001,
      paddingTop: 'env(safe-area-inset-top)'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--tg-theme-bg-color)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        padding: '8px 0 20px',
        paddingBottom: isKeyboardVisible ? '20px' : 'calc(20px + env(safe-area-inset-bottom))',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--tg-theme-text-color)', margin: 0 }}>
              Новая заметка
            </h2>
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--tg-theme-text-color)'
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
              Страница (опционально)
            </label>
            <input
              type="number"
              value={page}
              onChange={(e) => setPage(e.target.value)}
              placeholder="Номер страницы"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--tg-theme-secondary-bg-color)',
                borderRadius: '12px',
                backgroundColor: 'var(--tg-theme-bg-color)',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
              Текст заметки
            </label>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Введите текст заметки..."
              rows={6}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--tg-theme-secondary-bg-color)',
                borderRadius: '12px',
                backgroundColor: 'var(--tg-theme-bg-color)',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '120px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                background: 'transparent',
                border: '1px solid var(--tg-theme-secondary-bg-color)',
                borderRadius: '12px',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={!content.trim()}
              style={{
                flex: 1,
                padding: '14px',
                background: content.trim() ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)',
                border: 'none',
                borderRadius: '12px',
                color: content.trim() ? 'var(--tg-theme-button-text-color)' : 'var(--tg-theme-hint-color)',
                fontSize: '16px',
                fontWeight: '600',
                cursor: content.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

