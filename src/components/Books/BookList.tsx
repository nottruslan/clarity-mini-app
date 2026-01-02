import { useState, useMemo } from 'react';
import { Book } from '../../utils/storage';
import EmptyState from '../EmptyState';
import BookItem from './BookItem';

interface BookListProps {
  books: Book[];
  onOpenDetails: (book: Book) => void;
  onOpenMenu: (book: Book) => void;
}

type FilterStatus = 'all' | Book['status'];
type SortBy = 'date' | 'completed' | 'rating' | 'title';

export default function BookList({ books, onOpenDetails, onOpenMenu }: BookListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [showFilters, setShowFilters] = useState(false);

  // Получаем уникальные жанры
  const genres = useMemo(() => {
    const genreSet = new Set<string>();
    books.forEach(book => {
      if (book.genre) genreSet.add(book.genre);
    });
    return Array.from(genreSet).sort();
  }, [books]);

  // Фильтрация и поиск
  const filteredBooks = useMemo(() => {
    let filtered = books.filter(book => {
      // Поиск
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesAuthor = book.author?.toLowerCase().includes(query) || false;
        const matchesNotes = book.notes?.some(note => note.content.toLowerCase().includes(query)) || false;
        const matchesQuotes = book.quotes?.some(quote => quote.text.toLowerCase().includes(query)) || false;
        const matchesReflections = book.reflections?.some(ref => ref.content.toLowerCase().includes(query)) || false;
        
        if (!matchesTitle && !matchesAuthor && !matchesNotes && !matchesQuotes && !matchesReflections) {
          return false;
        }
      }

      // Фильтр по статусу
      if (filterStatus !== 'all' && book.status !== filterStatus) {
        return false;
      }

      // Фильтр по жанру
      if (filterGenre !== 'all' && book.genre !== filterGenre) {
        return false;
      }

      return true;
    });

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.createdAt - a.createdAt;
        case 'completed':
          return (b.completedDate || 0) - (a.completedDate || 0);
        case 'rating':
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        case 'title':
          return a.title.localeCompare(b.title, 'ru');
        default:
          return 0;
      }
    });

    return filtered;
  }, [books, searchQuery, filterStatus, filterGenre, sortBy]);

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
      {/* Поиск и фильтры */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'var(--tg-theme-bg-color)',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)'
      }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: showFilters ? '12px' : '0' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию, автору, заметкам..."
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid var(--tg-theme-secondary-bg-color)',
              borderRadius: '10px',
              backgroundColor: 'var(--tg-theme-secondary-bg-color)',
              color: 'var(--tg-theme-text-color)',
              fontSize: '14px'
            }}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '10px 16px',
              background: showFilters ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)',
              border: 'none',
              borderRadius: '10px',
              color: showFilters ? 'var(--tg-theme-button-text-color)' : 'var(--tg-theme-text-color)',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: showFilters ? '600' : '400'
            }}
          >
            🔍
          </button>
        </div>

        {showFilters && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Фильтр по статусу */}
            <div>
              <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
                Статус
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(['all', 'want-to-read', 'reading', 'completed', 'paused', 'abandoned'] as FilterStatus[]).map(status => {
                  const labels: Record<FilterStatus, string> = {
                    all: 'Все',
                    'want-to-read': 'Хочу прочитать',
                    'reading': 'Читаю',
                    'completed': 'Прочитано',
                    'paused': 'На паузе',
                    'abandoned': 'Брошено'
                  };
                  return (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      style={{
                        padding: '6px 12px',
                        border: `1px solid ${filterStatus === status ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
                        borderRadius: '8px',
                        background: filterStatus === status ? 'rgba(51, 144, 236, 0.1)' : 'transparent',
                        color: 'var(--tg-theme-text-color)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: filterStatus === status ? '600' : '400'
                      }}
                    >
                      {labels[status]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Фильтр по жанру */}
            {genres.length > 0 && (
              <div>
                <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
                  Жанр
                </div>
                <select
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--tg-theme-secondary-bg-color)',
                    borderRadius: '10px',
                    backgroundColor: 'var(--tg-theme-bg-color)',
                    color: 'var(--tg-theme-text-color)',
                    fontSize: '14px'
                  }}
                >
                  <option value="all">Все жанры</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Сортировка */}
            <div>
              <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
                Сортировка
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--tg-theme-secondary-bg-color)',
                  borderRadius: '10px',
                  backgroundColor: 'var(--tg-theme-bg-color)',
                  color: 'var(--tg-theme-text-color)',
                  fontSize: '14px'
                }}
              >
                <option value="date">По дате добавления</option>
                <option value="completed">По дате завершения</option>
                <option value="rating">По рейтингу</option>
                <option value="title">По названию</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Список книг */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto' as const,
        paddingTop: '0px',
        WebkitOverflowScrolling: 'touch' as any
      }}>
        {filteredBooks.length === 0 ? (
          <EmptyState 
            message={searchQuery || filterStatus !== 'all' || filterGenre !== 'all' 
              ? "Книги не найдены" 
              : "У вас пока нет книг. Добавьте первую книгу!"}
          />
        ) : (
          filteredBooks.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              onOpenDetails={() => onOpenDetails(book)}
              onOpenMenu={() => onOpenMenu(book)}
            />
          ))
        )}
      </div>
    </div>
  );
}

