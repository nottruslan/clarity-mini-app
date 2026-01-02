import { Book } from '../../utils/storage';
import EmptyState from '../EmptyState';
import BookItem from './BookItem';

interface BookListProps {
  books: Book[];
  onOpenDetails: (book: Book) => void;
  onOpenMenu: (book: Book) => void;
}

export default function BookList({ books, onOpenDetails, onOpenMenu }: BookListProps) {
  if (books.length === 0) {
    return (
      <EmptyState 
        message="У вас пока нет книг. Добавьте первую книгу!"
      />
    );
  }

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{ 
        flex: 1, 
        overflowY: 'auto' as const,
        paddingTop: '0px',
        WebkitOverflowScrolling: 'touch' as any
      }}>
        {books.map((book) => (
          <BookItem
            key={book.id}
            book={book}
            onOpenDetails={() => onOpenDetails(book)}
            onOpenMenu={() => onOpenMenu(book)}
          />
        ))}
      </div>
    </div>
  );
}

