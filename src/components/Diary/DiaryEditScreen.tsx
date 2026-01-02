import { useState, useEffect, useRef } from 'react';
import { generateId, type DiaryEntry } from '../../utils/storage';

// #region agent log
const log = (location: string, message: string, data: any, hypothesisId?: string) => {
  fetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location,
      message,
      data,
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: hypothesisId || 'A'
    })
  }).catch(() => {});
};
// #endregion

interface DiaryEditScreenProps {
  entry?: DiaryEntry | null;
  onSave: (entry: DiaryEntry) => void;
  onClose: () => void;
  readOnly?: boolean;
  onEditRequest?: () => void;
}

export default function DiaryEditScreen({ entry, onSave, onClose, readOnly = false, onEditRequest }: DiaryEditScreenProps) {
  // Инициализируем состояние пустыми значениями, useEffect установит правильные значения
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  
  // #region agent log
  log('DiaryEditScreen.tsx:component', 'DiaryEditScreen mounted', {
    entryId: entry?.id || null,
    entryTitle: entry?.title || null,
    entryContent: entry?.content?.substring(0, 50) || null,
    readOnly,
    initialTitle: title,
    initialContent: content
  }, 'A');
  // #endregion

  // Инициализация значений при монтировании или изменении entry
  useEffect(() => {
    // #region agent log
    log('DiaryEditScreen.tsx:useEffect', 'useEffect triggered', {
      entryId: entry?.id || null,
      entryTitle: entry?.title || null,
      entryContent: entry?.content?.substring(0, 50) || null,
      readOnly,
      currentTitle: title,
      currentContent: content?.substring(0, 50) || '',
      willSetTitle: entry ? (entry.title || '') : '',
      willSetContent: entry ? (entry.content?.substring(0, 50) || '') : ''
    }, 'B');
    // #endregion
    
    // Всегда сбрасываем состояние сначала - это гарантирует чистый сброс
    if (entry) {
      const newTitle = entry.title || '';
      const newContent = entry.content || '';
      setTitle(newTitle);
      setContent(newContent);
      // #region agent log
      log('DiaryEditScreen.tsx:useEffect', 'state set from entry', {
        entryId: entry.id,
        newTitle,
        newContent: newContent.substring(0, 50),
        previousTitle: title,
        previousContent: content.substring(0, 50)
      }, 'B');
      // #endregion
    } else {
      // Явно сбрасываем для новой записи
      setTitle('');
      setContent('');
      // #region agent log
      log('DiaryEditScreen.tsx:useEffect', 'state reset for new entry', {
        previousTitle: title,
        previousContent: content.substring(0, 50),
        newTitle: '',
        newContent: ''
      }, 'B');
      // #endregion
    }
    setHasUnsavedChanges(false);
    // Фокус на поле заголовка при открытии (только в режиме редактирования)
    if (!readOnly) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [entry, readOnly]);

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
    // #region agent log
    log('DiaryEditScreen.tsx:handleSave', 'handleSave called', {
      entryId: entry?.id || null,
      currentTitle: title,
      currentContent: content.substring(0, 50),
      isUpdate: entry !== null,
      isNewEntry: entry === null
    }, 'B');
    // #endregion
    
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
      // #region agent log
      log('DiaryEditScreen.tsx:handleSave', 'updating existing entry', {
        entryId: entry.id,
        savedTitle: savedEntry.title,
        savedContent: savedEntry.content.substring(0, 50)
      }, 'B');
      // #endregion
    } else {
      // Создание новой записи
      const newId = generateId();
      savedEntry = {
        id: newId,
        title: title.trim() || '',
        content: content.trim(),
        date: todayTimestamp,
        createdAt: now,
        updatedAt: now
      };
      // #region agent log
      log('DiaryEditScreen.tsx:handleSave', 'creating new entry', {
        newId,
        savedTitle: savedEntry.title,
        savedContent: savedEntry.content.substring(0, 50),
        date: todayTimestamp
      }, 'B');
      // #endregion
    }

    onSave(savedEntry);
    setHasUnsavedChanges(false);
    
    // Закрываем сразу после сохранения
    onClose();
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
        {readOnly ? (
          <button
            onClick={onEditRequest}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--tg-theme-button-color, #3390ec)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              color: 'var(--tg-theme-button-text-color, #ffffff)',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            aria-label="Править"
          >
            Править
          </button>
        ) : (
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
        )}
      </div>

      {/* Поле заголовка */}
      <div
        style={{
          padding: '16px',
          borderBottom: readOnly ? 'none' : '1px solid var(--tg-theme-secondary-bg-color, #f0f0f0)'
        }}
      >
        {readOnly ? (
          title ? (
            <div
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--tg-theme-text-color, #000000)',
                lineHeight: '1.4'
              }}
            >
              {title}
            </div>
          ) : null
        ) : (
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
        )}
      </div>

      {/* Поле текста */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: readOnly ? 'auto' : 'hidden',
          padding: readOnly ? '16px' : '0'
        }}
      >
        {readOnly ? (
          <div
            style={{
              fontSize: '16px',
              color: 'var(--tg-theme-text-color, #000000)',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {content}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}

