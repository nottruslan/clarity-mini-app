import { useState, useEffect, useRef } from 'react';
import { generateId, type DiaryEntry } from '../../utils/storage';

interface DiaryEditScreenProps {
  entry?: DiaryEntry | null;
  onSave: (entry: DiaryEntry) => void;
  onClose: () => void;
}

export default function DiaryEditScreen({ entry, onSave, onClose }: DiaryEditScreenProps) {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Инициализация значений при монтировании или изменении entry
  useEffect(() => {
    if (entry) {
      setTitle(entry.title || '');
      setContent(entry.content || '');
    } else {
      setTitle('');
      setContent('');
    }
    setHasUnsavedChanges(false);
    // Фокус на поле заголовка при открытии
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 100);
  }, [entry]);

  // Отслеживание изменений
  useEffect(() => {
    const initialTitle = entry?.title || '';
    const initialContent = entry?.content || '';
    
    if (title !== initialTitle || content !== initialContent) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [title, content, entry]);

  // Обработка клавиатуры
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleViewportChange = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;
      const keyboardVisible = viewportHeight < windowHeight - 150;
      
      if (keyboardVisible && contentTextareaRef.current) {
        // Прокручиваем textarea в видимую область при появлении клавиатуры
        setTimeout(() => {
          contentTextareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    };

    window.visualViewport.addEventListener('resize', handleViewportChange);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  const handleBack = () => {
    if (hasUnsavedChanges && (title.trim() || content.trim())) {
      // Показываем подтверждение
      const shouldSave = window.confirm('Сохранить изменения?');
      if (shouldSave) {
        handleSave();
      } else {
        const discard = window.confirm('Не сохранять изменения?');
        if (discard) {
          onClose();
        }
        // Если пользователь нажал "Отмена" во втором confirm, ничего не делаем
      }
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    if (!content.trim()) return;

    const now = Date.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    let savedEntry: DiaryEntry;

    if (entry) {
      // Редактирование существующей записи
      savedEntry = {
        ...entry,
        title: title.trim() || '',
        content: content.trim(),
        updatedAt: now
      };
    } else {
      // Создание новой записи
      savedEntry = {
        id: generateId(),
        title: title.trim() || '',
        content: content.trim(),
        date: todayTimestamp,
        createdAt: now,
        updatedAt: now
      };
    }

    onSave(savedEntry);
    setHasUnsavedChanges(false);
    
    // Показываем уведомление
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 1500);
  };

  const canSave = content.trim().length > 0;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10000,
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      {/* Хедер */}
      <div
        style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
          borderBottom: '1px solid var(--tg-theme-secondary-bg-color, #f0f0f0)'
        }}
      >
        <button
          onClick={handleBack}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '24px',
            color: 'var(--tg-theme-text-color, #000000)',
            padding: 0
          }}
          aria-label="Назад"
        >
          ←
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: canSave
              ? 'var(--tg-theme-button-color, #3390ec)'
              : 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: canSave ? 'pointer' : 'not-allowed',
            fontSize: '20px',
            color: canSave
              ? 'var(--tg-theme-button-text-color, #ffffff)'
              : 'var(--tg-theme-hint-color, #999999)',
            padding: 0,
            transition: 'background-color 0.2s'
          }}
          aria-label="Сохранить"
        >
          ✓
        </button>
      </div>

      {/* Поле заголовка */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid var(--tg-theme-secondary-bg-color, #f0f0f0)'
        }}
      >
        <input
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Заголовок (опционально)"
          style={{
            width: '100%',
            padding: '0',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--tg-theme-text-color, #000000)',
            fontSize: '18px',
            fontWeight: '600',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Поле текста */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <textarea
          ref={contentTextareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Введите ваши мысли..."
          style={{
            flex: 1,
            width: '100%',
            padding: '16px',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--tg-theme-text-color, #000000)',
            fontSize: '16px',
            fontFamily: 'inherit',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            lineHeight: '1.5'
          }}
        />
      </div>

      {/* Toast уведомление */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(20px + env(safe-area-inset-bottom))',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            zIndex: 10001,
            animation: 'fadeInOut 1.5s ease-in-out'
          }}
        >
          Сохранено
        </div>
      )}

      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
          20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

