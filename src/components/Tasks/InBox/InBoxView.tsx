import { useState, useRef } from 'react';
import { InBoxNote, generateId } from '../../../utils/storage';
import InBoxItem from './InBoxItem';

interface InBoxViewProps {
  notes: InBoxNote[];
  onNoteAdd: (note: InBoxNote) => void;
  onNoteEdit: (id: string, text: string) => void;
  onNoteDelete: (id: string) => void;
  onMoveToList: (id: string) => void;
}

export default function InBoxView({
  notes,
  onNoteAdd,
  onNoteEdit,
  onNoteDelete,
  onMoveToList
}: InBoxViewProps) {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const sortedNotes = [...notes].sort((a, b) => b.createdAt - a.createdAt);

  const handleAddNote = () => {
    const trimmedText = inputText.trim();
    if (trimmedText.length < 1) {
      return;
    }

    const newNote: InBoxNote = {
      id: generateId(),
      text: trimmedText,
      createdAt: Date.now()
    };

    onNoteAdd(newNote);
    setInputText('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNote();
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Форма добавления заметки */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
        backgroundColor: 'var(--tg-theme-bg-color)'
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Быстрая заметка..."
            style={{
              flex: 1,
              padding: '12px 16px',
              minHeight: '44px',
              borderRadius: '10px',
              border: '1px solid var(--tg-theme-secondary-bg-color)',
              backgroundColor: 'var(--tg-theme-section-bg-color)',
              color: 'var(--tg-theme-text-color)',
              fontSize: '16px',
              fontFamily: 'inherit',
              outline: 'none'
            }}
          />
          <button
            onClick={handleAddNote}
            disabled={inputText.trim().length < 1}
            style={{
              padding: '12px 20px',
              minHeight: '44px',
              borderRadius: '10px',
              border: 'none',
              background: inputText.trim().length >= 1
                ? 'var(--tg-theme-button-color)'
                : 'var(--tg-theme-secondary-bg-color)',
              color: inputText.trim().length >= 1
                ? 'var(--tg-theme-button-text-color)'
                : 'var(--tg-theme-hint-color)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: inputText.trim().length >= 1 ? 'pointer' : 'not-allowed',
              transition: 'opacity 0.2s',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              whiteSpace: 'nowrap'
            }}
          >
            Добавить
          </button>
        </div>
      </div>

      {/* Список заметок */}
      <div style={{
        flex: 1,
        overflowY: 'auto' as const,
        WebkitOverflowScrolling: 'touch' as any
      }}>
        {sortedNotes.length === 0 ? (
          <div style={{
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px'
          }}>
            <div style={{
              fontSize: '64px',
              color: 'var(--tg-theme-hint-color)',
              opacity: 0.6
            }}>
              📥
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxWidth: '320px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'var(--tg-theme-text-color)',
                margin: 0
              }}>
                InBox
              </h3>
              <div style={{
                fontSize: '15px',
                color: 'var(--tg-theme-hint-color)',
                lineHeight: '1.6',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <p style={{ margin: 0 }}>
                  Здесь можно быстро записать заметку. Нажмите "В список" чтобы превратить её в задачу.
                </p>
                <p style={{ margin: 0, marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--tg-theme-secondary-bg-color)' }}>
                  <strong style={{ color: 'var(--tg-theme-text-color)' }}>💡 Подсказка:</strong> Чтобы удалить заметку, проведи по ней пальцем влево.
                </p>
              </div>
            </div>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <InBoxItem
              key={note.id}
              note={note}
              onEdit={onNoteEdit}
              onDelete={onNoteDelete}
              onMoveToList={onMoveToList}
              isEditing={editingNoteId === note.id}
              onStartEdit={setEditingNoteId}
              onCancelEdit={() => setEditingNoteId(null)}
            />
          ))
        )}
      </div>
    </div>
  );
}

