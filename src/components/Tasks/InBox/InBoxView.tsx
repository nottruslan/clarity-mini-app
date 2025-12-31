import { useState, useRef, useEffect } from 'react';
import { InBoxNote, generateId } from '../../../utils/storage';
import InBoxItem from './InBoxItem';
import EmptyState from '../../EmptyState';

interface InBoxViewProps {
  notes: InBoxNote[];
  onNoteAdd: (note: InBoxNote) => void;
  onNoteEdit: (id: string, text: string) => void;
  onNoteDelete: (id: string) => void;
  onNoteConvert: (note: InBoxNote) => void;
}

export default function InBoxView({
  notes,
  onNoteAdd,
  onNoteEdit,
  onNoteDelete,
  onNoteConvert
}: InBoxViewProps) {
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddNote = () => {
    const trimmed = newNoteText.trim();
    if (trimmed) {
      const newNote: InBoxNote = {
        id: generateId(),
        text: trimmed,
        createdAt: Date.now()
      };
      onNoteAdd(newNote);
      setNewNoteText('');
      // Фокус обратно на input после добавления
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  const sortedNotes = [...notes].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Инлайн-редактор для быстрого добавления */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '2px solid var(--tg-theme-button-color)',
        backgroundColor: 'var(--tg-theme-bg-color)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end'
        }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Быстрая заметка..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid var(--tg-theme-secondary-bg-color)',
              backgroundColor: 'var(--tg-theme-bg-color)',
              color: 'var(--tg-theme-text-color)',
              fontSize: '16px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleAddNote}
            disabled={!newNoteText.trim()}
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              border: 'none',
              background: newNoteText.trim()
                ? 'var(--tg-theme-button-color)'
                : 'var(--tg-theme-secondary-bg-color)',
              color: newNoteText.trim()
                ? 'var(--tg-theme-button-text-color)'
                : 'var(--tg-theme-hint-color)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: newNoteText.trim() ? 'pointer' : 'not-allowed',
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
          <EmptyState 
            message="InBox пуст. Добавьте первую заметку!"
          />
        ) : (
          sortedNotes.map((note) => (
            <InBoxItem
              key={note.id}
              note={note}
              onEdit={onNoteEdit}
              onDelete={onNoteDelete}
              onConvert={onNoteConvert}
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

