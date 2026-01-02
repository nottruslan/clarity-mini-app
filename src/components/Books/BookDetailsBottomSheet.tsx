import { useState, useEffect, useRef } from 'react';
import { Book, Note, Quote, Reflection } from '../../utils/storage';
import NotesList from './Notes/NotesList';
import QuotesList from './Quotes/QuotesList';
import ReflectionsList from './Reflections/ReflectionsList';
import CreateNoteModal from './Notes/CreateNoteModal';
import EditNoteModal from './Notes/EditNoteModal';
import CreateQuoteModal from './Quotes/CreateQuoteModal';
import CreateReflectionModal from './Reflections/CreateReflectionModal';
import EditReflectionModal from './Reflections/EditReflectionModal';

interface BookDetailsBottomSheetProps {
  book: Book;
  onClose: () => void;
  onUpdate: (book: Book) => void;
}

type Tab = 'info' | 'notes' | 'quotes' | 'reflections';

const statusLabels: Record<Book['status'], { label: string; color: string }> = {
  'want-to-read': { label: 'Хочу прочитать', color: '#2196f3' },
  'reading': { label: 'Читаю', color: '#ff9800' },
  'completed': { label: 'Прочитано', color: '#4caf50' },
  'paused': { label: 'На паузе', color: '#ffc107' },
  'abandoned': { label: 'Брошено', color: '#f44336' }
};

export default function BookDetailsBottomSheet({ book, onClose, onUpdate }: BookDetailsBottomSheetProps) {
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const [showCreateReflection, setShowCreateReflection] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingReflection, setEditingReflection] = useState<Reflection | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (sheetRef.current) {
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.style.transform = 'translateY(0)';
        }
      }, 10);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(100%)';
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  const statusInfo = statusLabels[book.status];

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Не указано';
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderStars = () => {
    if (!book.rating) return 'Не указано';
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ fontSize: '18px', color: i <= book.rating! ? '#ffc107' : '#ccc' }}>
          ★
        </span>
      );
    }
    return <div style={{ display: 'flex', gap: '4px' }}>{stars}</div>;
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}
    >
      <div
        ref={sheetRef}
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'var(--tg-theme-bg-color)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '8px 0 20px',
          paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
          transform: 'translateY(100%)',
          transition: 'transform 0.3s ease-out',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Индикатор */}
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: 'var(--tg-theme-hint-color)',
            borderRadius: '2px',
            margin: '8px auto 16px',
            opacity: 0.3
          }}
        />

        {/* Заголовок */}
        <div style={{ padding: '0 20px 16px', borderBottom: '1px solid var(--tg-theme-secondary-bg-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--tg-theme-text-color)', margin: 0, flex: 1 }}>
              {book.title}
            </h2>
            <button
              onClick={handleClose}
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
                color: 'var(--tg-theme-text-color)',
                marginLeft: '12px'
              }}
            >
              ×
            </button>
          </div>
          {book.author && (
            <div style={{ fontSize: '16px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
              {book.author}
            </div>
          )}
        </div>

        {/* Вкладки */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--tg-theme-secondary-bg-color)', padding: '0 20px' }}>
          {(['info', 'notes', 'quotes', 'reflections'] as Tab[]).map((tab) => {
            const labels: Record<Tab, string> = {
              info: 'О книге',
              notes: 'Заметки',
              quotes: 'Цитаты',
              reflections: 'Размышления'
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid var(--tg-theme-button-color)' : '2px solid transparent',
                  color: activeTab === tab ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-hint-color)',
                  fontSize: '14px',
                  fontWeight: activeTab === tab ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Контент вкладок */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {activeTab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {book.coverUrl && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    style={{
                      width: '150px',
                      height: '225px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '2px solid var(--tg-theme-secondary-bg-color)'
                    }}
                  />
                </div>
              )}
              
              <div>
                <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Статус
                </div>
                <span
                  style={{
                    fontSize: '14px',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    backgroundColor: `${statusInfo.color}20`,
                    color: statusInfo.color,
                    fontWeight: '500',
                    display: 'inline-block'
                  }}
                >
                  {statusInfo.label}
                </span>
              </div>

              {book.rating && (
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Рейтинг
                  </div>
                  {renderStars()}
                </div>
              )}

              {book.genre && (
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Жанр
                  </div>
                  <div style={{ fontSize: '16px', color: 'var(--tg-theme-text-color)' }}>
                    {book.genre}
                  </div>
                </div>
              )}

              <div>
                <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Дата начала
                </div>
                <div style={{ fontSize: '16px', color: 'var(--tg-theme-text-color)' }}>
                  {formatDate(book.startDate)}
                </div>
              </div>

              {book.completedDate && (
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Дата завершения
                  </div>
                  <div style={{ fontSize: '16px', color: 'var(--tg-theme-text-color)' }}>
                    {formatDate(book.completedDate)}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <button
                onClick={() => setShowCreateNote(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  background: 'var(--tg-theme-button-color)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'var(--tg-theme-button-text-color)',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                + Добавить заметку
              </button>
              <NotesList 
                notes={book.notes || []}
                onEdit={(note) => setEditingNote(note)}
                onDelete={(noteId) => {
                  const updatedBook = {
                    ...book,
                    notes: (book.notes || []).filter(n => n.id !== noteId),
                    updatedAt: Date.now()
                  };
                  onUpdate(updatedBook);
                }}
              />
            </div>
          )}

          {activeTab === 'quotes' && (
            <div>
              <button
                onClick={() => setShowCreateQuote(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  background: 'var(--tg-theme-button-color)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'var(--tg-theme-button-text-color)',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                + Добавить цитату
              </button>
              <QuotesList 
                quotes={book.quotes || []}
                onDelete={(quoteId) => {
                  const updatedBook = {
                    ...book,
                    quotes: (book.quotes || []).filter(q => q.id !== quoteId),
                    updatedAt: Date.now()
                  };
                  onUpdate(updatedBook);
                }}
              />
            </div>
          )}

          {activeTab === 'reflections' && (
            <div>
              <button
                onClick={() => setShowCreateReflection(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  background: 'var(--tg-theme-button-color)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'var(--tg-theme-button-text-color)',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                + Добавить размышление
              </button>
              <ReflectionsList 
                reflections={book.reflections || []}
                onEdit={(reflection) => setEditingReflection(reflection)}
                onDelete={(reflectionId) => {
                  const updatedBook = {
                    ...book,
                    reflections: (book.reflections || []).filter(r => r.id !== reflectionId),
                    updatedAt: Date.now()
                  };
                  onUpdate(updatedBook);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {showCreateNote && (
        <CreateNoteModal
          bookId={book.id}
          onSave={(note) => {
            const updatedBook = {
              ...book,
              notes: [...(book.notes || []), note],
              updatedAt: Date.now()
            };
            onUpdate(updatedBook);
            setShowCreateNote(false);
          }}
          onClose={() => setShowCreateNote(false)}
        />
      )}

      {showCreateQuote && (
        <CreateQuoteModal
          bookId={book.id}
          onSave={(quote) => {
            const updatedBook = {
              ...book,
              quotes: [...(book.quotes || []), quote],
              updatedAt: Date.now()
            };
            onUpdate(updatedBook);
            setShowCreateQuote(false);
          }}
          onClose={() => setShowCreateQuote(false)}
        />
      )}

      {showCreateReflection && (
        <CreateReflectionModal
          bookId={book.id}
          onSave={(reflection) => {
            const updatedBook = {
              ...book,
              reflections: [...(book.reflections || []), reflection],
              updatedAt: Date.now()
            };
            onUpdate(updatedBook);
            setShowCreateReflection(false);
          }}
          onClose={() => setShowCreateReflection(false)}
        />
      )}

      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onSave={(updates) => {
            const updatedBook = {
              ...book,
              notes: (book.notes || []).map(n => n.id === editingNote.id ? { ...n, ...updates } : n),
              updatedAt: Date.now()
            };
            onUpdate(updatedBook);
            setEditingNote(null);
          }}
          onClose={() => setEditingNote(null)}
        />
      )}

      {editingReflection && (
        <EditReflectionModal
          reflection={editingReflection}
          onSave={(updates) => {
            const updatedBook = {
              ...book,
              reflections: (book.reflections || []).map(r => r.id === editingReflection.id ? { ...r, ...updates } : r),
              updatedAt: Date.now()
            };
            onUpdate(updatedBook);
            setEditingReflection(null);
          }}
          onClose={() => setEditingReflection(null)}
        />
      )}
    </div>
  );
}

