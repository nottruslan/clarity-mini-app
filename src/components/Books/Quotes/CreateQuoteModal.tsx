import { useState, useEffect, useRef } from 'react';
import { generateId } from '../../../utils/storage';

interface CreateQuoteModalProps {
  bookId: string;
  onSave: (quote: { id: string; bookId: string; text: string; page?: number; chapter?: string; createdAt: number }) => void;
  onClose: () => void;
}

export default function CreateQuoteModal({ bookId, onSave, onClose }: CreateQuoteModalProps) {
  const [text, setText] = useState('');
  const [page, setPage] = useState('');
  const [chapter, setChapter] = useState('');
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
    if (!text.trim()) return;

    const quote = {
      id: generateId(),
      bookId,
      text: text.trim(),
      page: page ? parseInt(page) : undefined,
      chapter: chapter.trim() || undefined,
      createdAt: Date.now()
    };
    onSave(quote);
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
              Новая цитата
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
              Цитата
            </label>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Введите цитату..."
              rows={4}
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
                minHeight: '100px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
                Страница
              </label>
              <input
                type="number"
                value={page}
                onChange={(e) => setPage(e.target.value)}
                placeholder="Номер"
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
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
                Глава
              </label>
              <input
                type="text"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="Название"
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
              disabled={!text.trim()}
              style={{
                flex: 1,
                padding: '14px',
                background: text.trim() ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)',
                border: 'none',
                borderRadius: '12px',
                color: text.trim() ? 'var(--tg-theme-button-text-color)' : 'var(--tg-theme-hint-color)',
                fontSize: '16px',
                fontWeight: '600',
                cursor: text.trim() ? 'pointer' : 'not-allowed'
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

