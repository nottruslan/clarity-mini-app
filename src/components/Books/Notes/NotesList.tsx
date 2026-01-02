import { Note } from '../../../utils/storage';
import NoteItem from './NoteItem';
import EmptyState from '../../EmptyState';

interface NotesListProps {
  notes: Note[];
  onEdit?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
}

export default function NotesList({ notes, onEdit, onDelete }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <EmptyState 
        message="Заметок пока нет. Добавьте первую заметку!"
      />
    );
  }

  return (
    <div>
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onEdit={onEdit ? () => onEdit(note) : undefined}
          onDelete={onDelete ? () => onDelete(note.id) : undefined}
        />
      ))}
    </div>
  );
}

